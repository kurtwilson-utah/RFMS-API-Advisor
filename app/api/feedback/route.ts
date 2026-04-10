import { storeFeedback } from "@/lib/analytics";
import type { MessageFeedback, Tier } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    sessionId: string;
    messageId: string;
    rating: "up" | "down";
    comment?: string;
    userMessage: string;
    assistantMessage: string;
    tier: Tier;
  };

  if (!body.messageId || !body.rating) {
    return new Response("Missing required fields", { status: 400 });
  }

  const feedback: MessageFeedback = {
    id: crypto.randomUUID(),
    sessionId: body.sessionId,
    messageId: body.messageId,
    timestamp: new Date().toISOString(),
    rating: body.rating,
    comment: body.comment,
    userMessage: body.userMessage?.slice(0, 500) || "",
    assistantMessage: body.assistantMessage?.slice(0, 500) || "",
    tier: body.tier,
  };

  await storeFeedback(feedback);

  return Response.json({ ok: true });
}
