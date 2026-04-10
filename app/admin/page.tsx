"use client";

import { useEffect, useState, useMemo } from "react";
import type { ConversationInsight, MessageFeedback } from "@/lib/types";

interface AdminData {
  insights: ConversationInsight[];
  feedback: MessageFeedback[];
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-white/30">{sub}</p>}
    </div>
  );
}

function BarChart({
  data,
  title,
}: {
  data: { label: string; count: number }[];
  title: string;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-right text-xs text-white/50">
              {item.label}
            </span>
            <div className="flex-1">
              <div
                className="h-5 rounded bg-[#0066CC]/60"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs text-white/40">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackTable({ feedback }: { feedback: MessageFeedback[] }) {
  const downvotes = feedback.filter((f) => f.rating === "down");
  if (downvotes.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-2 text-sm font-semibold text-white">
          Negative Feedback
        </h3>
        <p className="text-xs text-white/40">No negative feedback yet.</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">
        Negative Feedback ({downvotes.length})
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {downvotes.slice(0, 50).map((f) => (
          <div
            key={f.id}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/30">
                {new Date(f.timestamp).toLocaleDateString()} &middot;{" "}
                {f.tier}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/60">
              <span className="text-white/30">User asked:</span>{" "}
              {f.userMessage.slice(0, 150)}
            </p>
            {f.comment && (
              <p className="mt-1 text-xs text-red-400/80">
                &ldquo;{f.comment}&rdquo;
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsTable({ insights }: { insights: ConversationInsight[] }) {
  if (insights.length === 0) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">
        Recent Conversations
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/40">
              <th className="pb-2 pr-4 font-medium">Time</th>
              <th className="pb-2 pr-4 font-medium">Tier</th>
              <th className="pb-2 pr-4 font-medium">Category</th>
              <th className="pb-2 pr-4 font-medium">Intent</th>
              <th className="pb-2 pr-4 font-medium">Endpoints</th>
              <th className="pb-2 pr-4 font-medium">Language</th>
              <th className="pb-2 font-medium">Friction</th>
            </tr>
          </thead>
          <tbody>
            {insights.slice(0, 50).map((insight) => (
              <tr
                key={insight.id}
                className="border-b border-white/5 text-white/60"
              >
                <td className="py-2 pr-4 whitespace-nowrap text-white/30">
                  {new Date(insight.timestamp).toLocaleDateString()}
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      insight.tier === "Enterprise"
                        ? "bg-purple-500/20 text-purple-300"
                        : insight.tier === "Plus"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {insight.tier}
                  </span>
                </td>
                <td className="py-2 pr-4 capitalize">{insight.category}</td>
                <td className="py-2 pr-4 max-w-[200px] truncate">
                  {insight.intent}
                </td>
                <td className="py-2 pr-4">
                  {insight.endpointsDiscussed.slice(0, 2).map((ep) => (
                    <span
                      key={ep}
                      className="mr-1 inline-block rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40"
                    >
                      {ep}
                    </span>
                  ))}
                </td>
                <td className="py-2 pr-4">{insight.language}</td>
                <td className="py-2">
                  {insight.frictionPoints.length > 0 && (
                    <span className="text-amber-400/70">
                      {insight.frictionPoints[0]?.slice(0, 60)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((d) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;

    const { insights, feedback } = data;
    const totalConversations = insights.length;
    const uniqueSessions = new Set(insights.map((i) => i.sessionId)).size;
    const upvotes = feedback.filter((f) => f.rating === "up").length;
    const downvotes = feedback.filter((f) => f.rating === "down").length;
    const totalFeedback = upvotes + downvotes;
    const satisfactionRate =
      totalFeedback > 0 ? Math.round((upvotes / totalFeedback) * 100) : 0;

    // Category distribution
    const categories: Record<string, number> = {};
    for (const i of insights) {
      categories[i.category] = (categories[i.category] || 0) + 1;
    }
    const categoryData = Object.entries(categories)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    // Tier distribution
    const tiers: Record<string, number> = {};
    for (const i of insights) {
      tiers[i.tier] = (tiers[i.tier] || 0) + 1;
    }
    const tierData = Object.entries(tiers)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    // Top endpoints
    const endpoints: Record<string, number> = {};
    for (const i of insights) {
      for (const ep of i.endpointsDiscussed) {
        endpoints[ep] = (endpoints[ep] || 0) + 1;
      }
    }
    const endpointData = Object.entries(endpoints)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Language distribution
    const languages: Record<string, number> = {};
    for (const i of insights) {
      languages[i.language] = (languages[i.language] || 0) + 1;
    }
    const languageData = Object.entries(languages)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    // Tier mismatch: users on a lower tier asking about higher-tier endpoints
    const tierMismatches = insights.filter(
      (i) =>
        (i.tier === "Standard" && i.tierNeeded !== "Standard") ||
        (i.tier === "Plus" && i.tierNeeded === "Enterprise")
    ).length;

    // Friction points
    const frictionCounts: Record<string, number> = {};
    for (const i of insights) {
      for (const fp of i.frictionPoints) {
        if (fp && fp.length > 3) {
          frictionCounts[fp] = (frictionCounts[fp] || 0) + 1;
        }
      }
    }
    const topFriction = Object.entries(frictionCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      totalConversations,
      uniqueSessions,
      upvotes,
      downvotes,
      satisfactionRate,
      totalFeedback,
      categoryData,
      tierData,
      endpointData,
      languageData,
      tierMismatches,
      topFriction,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <p className="text-sm text-white/40">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-sm text-red-400">Failed to load analytics</p>
          <p className="mt-1 text-xs text-white/30">{error}</p>
          <p className="mt-3 text-xs text-white/20">
            Make sure KV_REST_API_URL and KV_REST_API_TOKEN are set in your
            environment variables.
          </p>
        </div>
      </div>
    );
  }

  if (!stats || !data) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              RFMS API Assistant &mdash; Analytics
            </h1>
            <p className="mt-1 text-xs text-white/40">
              Voice of Customer dashboard &middot; What dealers are building
            </p>
          </div>
          <a
            href="/"
            className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/50 hover:bg-white/5"
          >
            Back to Chat
          </a>
        </div>

        {/* Summary stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Queries"
            value={stats.totalConversations}
            sub={`${stats.uniqueSessions} sessions`}
          />
          <StatCard
            label="Satisfaction"
            value={
              stats.totalFeedback > 0 ? `${stats.satisfactionRate}%` : "--"
            }
            sub={`${stats.upvotes} up / ${stats.downvotes} down`}
          />
          <StatCard
            label="Total Feedback"
            value={stats.totalFeedback}
            sub="responses rated"
          />
          <StatCard
            label="Tier Mismatches"
            value={stats.tierMismatches}
            sub="needed higher tier"
          />
          <StatCard
            label="Top Category"
            value={stats.categoryData[0]?.label || "--"}
            sub={
              stats.categoryData[0]
                ? `${stats.categoryData[0].count} queries`
                : ""
            }
          />
        </div>

        {/* Charts row */}
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <BarChart data={stats.categoryData} title="Queries by Category" />
          <BarChart data={stats.endpointData} title="Top Endpoints Asked About" />
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <BarChart data={stats.tierData} title="Tier Distribution" />
          <BarChart data={stats.languageData} title="Languages Requested" />
        </div>

        {/* Friction points */}
        {stats.topFriction.length > 0 && (
          <div className="mb-6">
            <BarChart data={stats.topFriction} title="Common Friction Points" />
          </div>
        )}

        {/* Feedback table */}
        <div className="mb-6">
          <FeedbackTable feedback={data.feedback} />
        </div>

        {/* Recent conversations */}
        <InsightsTable insights={data.insights} />
      </div>
    </div>
  );
}
