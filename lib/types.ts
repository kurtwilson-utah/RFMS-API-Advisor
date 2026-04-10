export type Tier = "Standard" | "Plus" | "Enterprise";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ConversationInsight {
  id: string;
  sessionId: string;
  timestamp: string;
  tier: Tier;
  userMessage: string;
  intent: string;
  endpointsDiscussed: string[];
  tierNeeded: string;
  language: string;
  frictionPoints: string[];
  category: string;
}

export interface MessageFeedback {
  id: string;
  sessionId: string;
  messageId: string;
  timestamp: string;
  rating: "up" | "down";
  comment?: string;
  userMessage: string;
  assistantMessage: string;
  tier: Tier;
}
