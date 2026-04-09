import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/system-prompt";
import type { Tier } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(req: Request) {
  const { messages, tier } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    tier: Tier;
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

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
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
