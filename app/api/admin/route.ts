import { getInsights, getFeedback } from "@/lib/analytics";

export async function GET() {
  const [insights, feedback] = await Promise.all([
    getInsights(500),
    getFeedback(500),
  ]);

  return Response.json({ insights, feedback });
}
