import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { storeInsight } from "@/lib/analytics";
import type { Tier, ConversationInsight } from "@/lib/types";

const anthropic = new Anthropic();

async function extractInsight(
  userMessage: string,
  assistantMessage: string,
  tier: Tier,
  sessionId: string
) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Analyze this RFMS API support conversation and extract structured metadata. Respond ONLY with valid JSON, no markdown.

User message: "${userMessage}"

Assistant response (first 500 chars): "${assistantMessage.slice(0, 500)}"

Extract:
{
  "intent": "brief description of what the user is trying to do",
  "endpointsDiscussed": ["v2/endpoint/path", ...],
  "tierNeeded": "Standard|Plus|Enterprise",
  "language": "programming language mentioned or 'javascript' if none",
  "frictionPoints": ["any confusion, missing info, or difficulty expressed"],
  "category": "one of: authentication, customers, orders, quotes, payments, inventory, products, vendors, scheduling, general"
}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text);

    const insight: ConversationInsight = {
      id: crypto.randomUUID(),
      sessionId,
      timestamp: new Date().toISOString(),
      tier,
      userMessage: userMessage.slice(0, 500),
      intent: parsed.intent || "",
      endpointsDiscussed: parsed.endpointsDiscussed || [],
      tierNeeded: parsed.tierNeeded || tier,
      language: parsed.language || "javascript",
      frictionPoints: parsed.frictionPoints || [],
      category: parsed.category || "general",
    };

    await storeInsight(insight);
  } catch (err) {
    console.error("Insight extraction failed:", err);
  }
}

export async function POST(req: Request) {
  const { messages, tier, sessionId } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    tier: Tier;
    sessionId: string;
  };

  if (!messages?.length) {
    return new Response("No messages provided", { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(tier);
  const lastUserMsg = messages.findLast((m) => m.role === "user");

  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      tier,
      sessionId,
      userMessage:
        lastUserMsg?.content.slice(0, 200) +
        (lastUserMsg && lastUserMsg.content.length > 200 ? "..." : ""),
    })
  );

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  let fullResponse = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullResponse += event.delta.text;
          }
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();

        // Fire-and-forget insight extraction after stream completes
        if (lastUserMsg && fullResponse) {
          extractInsight(
            lastUserMsg.content,
            fullResponse,
            tier,
            sessionId || "unknown"
          );
        }
      } catch (err) {
        console.error("Stream error:", err);
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
