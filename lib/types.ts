export type Tier = "Standard" | "Plus" | "Enterprise";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}
