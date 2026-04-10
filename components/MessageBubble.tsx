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

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
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
      </div>
    </div>
  );
}
