import { kv } from "@vercel/kv";
import type { ConversationInsight, MessageFeedback } from "./types";

const INSIGHTS_KEY = "insights";
const FEEDBACK_KEY = "feedback";

export async function storeInsight(insight: ConversationInsight) {
  try {
    await kv.lpush(INSIGHTS_KEY, JSON.stringify(insight));
    // Keep last 10,000 entries
    await kv.ltrim(INSIGHTS_KEY, 0, 9999);
  } catch (err) {
    console.error("Failed to store insight:", err);
  }
}

export async function storeFeedback(feedback: MessageFeedback) {
  try {
    await kv.lpush(FEEDBACK_KEY, JSON.stringify(feedback));
    await kv.ltrim(FEEDBACK_KEY, 0, 9999);
  } catch (err) {
    console.error("Failed to store feedback:", err);
  }
}

export async function getInsights(
  limit: number = 200
): Promise<ConversationInsight[]> {
  try {
    const raw = await kv.lrange(INSIGHTS_KEY, 0, limit - 1);
    return raw.map((item) =>
      typeof item === "string" ? JSON.parse(item) : item
    );
  } catch (err) {
    console.error("Failed to get insights:", err);
    return [];
  }
}

export async function getFeedback(
  limit: number = 200
): Promise<MessageFeedback[]> {
  try {
    const raw = await kv.lrange(FEEDBACK_KEY, 0, limit - 1);
    return raw.map((item) =>
      typeof item === "string" ? JSON.parse(item) : item
    );
  } catch (err) {
    console.error("Failed to get feedback:", err);
    return [];
  }
}
