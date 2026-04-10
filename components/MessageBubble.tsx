"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark-dimmed.min.css";
import { useCallback, useState } from "react";
import type { Message } from "@/lib/types";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded bg-white/10 px-2 py-1 text-[10px] font-medium text-white/60 transition-colors hover:bg-white/20 hover:text-white/80"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function FeedbackButtons({
  onFeedback,
}: {
  onFeedback: (rating: "up" | "down", comment?: string) => void;
}) {
  const [submitted, setSubmitted] = useState<"up" | "down" | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");

  const handleRating = useCallback(
    (rating: "up" | "down") => {
      if (submitted) return;
      if (rating === "down") {
        setShowComment(true);
        setSubmitted(rating);
        onFeedback(rating);
      } else {
        setSubmitted(rating);
        onFeedback(rating);
      }
    },
    [submitted, onFeedback]
  );

  const handleCommentSubmit = useCallback(() => {
    if (comment.trim()) {
      onFeedback("down", comment.trim());
      setShowComment(false);
    }
  }, [comment, onFeedback]);

  return (
    <div className="mt-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleRating("up")}
          disabled={!!submitted}
          className={`rounded p-1 text-xs transition-colors ${
            submitted === "up"
              ? "text-green-400"
              : submitted
                ? "text-white/10"
                : "text-white/20 hover:text-white/50"
          }`}
          title="Helpful"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        </button>
        <button
          onClick={() => handleRating("down")}
          disabled={!!submitted}
          className={`rounded p-1 text-xs transition-colors ${
            submitted === "down"
              ? "text-red-400"
              : submitted
                ? "text-white/10"
                : "text-white/20 hover:text-white/50"
          }`}
          title="Not helpful"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
          </svg>
        </button>
        {submitted && (
          <span className="ml-1 text-[10px] text-white/30">
            {submitted === "up" ? "Thanks!" : ""}
          </span>
        )}
      </div>
      {showComment && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
            placeholder="What were you hoping for?"
            className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-white/20"
            autoFocus
          />
          <button
            onClick={handleCommentSubmit}
            className="rounded-md bg-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/15"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onFeedback?: (rating: "up" | "down", comment?: string) => void;
}

export default function MessageBubble({
  message,
  isStreaming,
  onFeedback,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#0066CC] px-4 py-2.5 text-sm text-white">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] text-sm text-white/90">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            pre({ children, ...props }) {
              const codeEl = (
                children as React.ReactElement<{ children?: string }>[]
              )?.[0];
              const code =
                codeEl &&
                typeof codeEl === "object" &&
                "props" in codeEl
                  ? String(
                      (codeEl as React.ReactElement<{ children?: string }>)
                        .props.children || ""
                    )
                  : "";
              return (
                <div className="group relative my-3">
                  <CopyButton code={code} />
                  <pre
                    className="overflow-x-auto rounded-lg bg-[#1a1a2e] p-4 text-[13px] leading-relaxed"
                    {...props}
                  >
                    {children}
                  </pre>
                </div>
              );
            },
            code({ className, children, ...props }) {
              const isInline = !className;
              if (isInline) {
                return (
                  <code
                    className="rounded bg-white/10 px-1.5 py-0.5 text-[13px] text-[#7dd3fc]"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            a({ href, children, ...props }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066CC] underline hover:text-[#3399FF]"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            table({ children, ...props }) {
              return (
                <div className="my-3 overflow-x-auto">
                  <table
                    className="w-full border-collapse text-sm"
                    {...props}
                  >
                    {children}
                  </table>
                </div>
              );
            },
            th({ children, ...props }) {
              return (
                <th
                  className="border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs font-semibold"
                  {...props}
                >
                  {children}
                </th>
              );
            },
            td({ children, ...props }) {
              return (
                <td
                  className="border border-white/10 px-3 py-1.5 text-xs"
                  {...props}
                >
                  {children}
                </td>
              );
            },
            p({ children, ...props }) {
              return (
                <p className="mb-3 last:mb-0 leading-relaxed" {...props}>
                  {children}
                </p>
              );
            },
            ul({ children, ...props }) {
              return (
                <ul className="mb-3 list-disc pl-5 space-y-1" {...props}>
                  {children}
                </ul>
              );
            },
            ol({ children, ...props }) {
              return (
                <ol className="mb-3 list-decimal pl-5 space-y-1" {...props}>
                  {children}
                </ol>
              );
            },
            h1({ children, ...props }) {
              return (
                <h1 className="mb-2 mt-4 text-lg font-bold" {...props}>
                  {children}
                </h1>
              );
            },
            h2({ children, ...props }) {
              return (
                <h2 className="mb-2 mt-3 text-base font-bold" {...props}>
                  {children}
                </h2>
              );
            },
            h3({ children, ...props }) {
              return (
                <h3 className="mb-1.5 mt-3 text-sm font-bold" {...props}>
                  {children}
                </h3>
              );
            },
            blockquote({ children, ...props }) {
              return (
                <blockquote
                  className="my-3 border-l-2 border-[#0066CC] pl-4 text-white/70 italic"
                  {...props}
                >
                  {children}
                </blockquote>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
        {!isUser && !isStreaming && message.content && onFeedback && (
          <FeedbackButtons onFeedback={onFeedback} />
        )}
      </div>
    </div>
  );
}
