"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { Message, Tier } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import TierSelector from "./TierSelector";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tier, setTier] = useState<Tier>("Plus");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleFeedback = useCallback(
    (messageId: string, rating: "up" | "down", comment?: string) => {
      const msgIndex = messages.findIndex((m) => m.id === messageId);
      const assistantMsg = messages[msgIndex];
      // Find the preceding user message
      const userMsg = messages
        .slice(0, msgIndex)
        .reverse()
        .find((m) => m.role === "user");

      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messageId,
          rating,
          comment,
          userMessage: userMsg?.content || "",
          assistantMessage: assistantMsg?.content || "",
          tier,
        }),
      }).catch(console.error);
    },
    [messages, sessionId, tier]
  );

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, assistantMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          tier,
          sessionId,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: `Error: ${errorText || res.statusText}` }
              : m
          )
        );
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setIsStreaming(false);
        return;
      }

      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                accumulated += parsed.delta.text;
                const current = accumulated;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: current }
                      : m
                  )
                );
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content: `Connection error: ${err instanceof Error ? err.message : "Unknown error"}`,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, tier, sessionId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tier selector bar */}
      <div className="border-b border-white/5 bg-[#0a0a0a] px-4 py-2">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-xs text-white/40">API Tier:</span>
          <TierSelector selected={tier} onChange={setTier} />
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0066CC]/10 text-2xl text-[#0066CC]">
                &lt;/&gt;
              </div>
              <h2 className="mb-2 text-lg font-semibold text-white">
                What are you building?
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-white/50">
                Describe what you&apos;re trying to integrate with the RFMS API
                and I&apos;ll walk you through the right endpoints, payloads,
                and code examples.
              </p>
              <div className="mt-8 grid gap-2 text-left sm:grid-cols-2">
                {[
                  "Post payments to RFMS orders",
                  "Look up customer info and order history",
                  "Sync inventory data to my app",
                  "Create quotes and sales orders",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-xs text-white/60 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white/80"
                  >
                    &ldquo;{example}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message, idx) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={
                    isStreaming && idx === messages.length - 1
                  }
                  onFeedback={
                    message.role === "assistant"
                      ? (rating, comment) =>
                          handleFeedback(message.id, rating, comment)
                      : undefined
                  }
                />
              ))}
              {isStreaming &&
                messages[messages.length - 1]?.content === "" && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 text-white/40">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#0066CC]" />
                      <span className="text-xs">Thinking...</span>
                    </div>
                  </div>
                )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 bg-[#0a0a0a] p-4">
        <div className="mx-auto flex max-w-4xl items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you're building..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#0066CC]/50 focus:bg-white/[0.07]"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#0066CC] text-white transition-opacity disabled:opacity-30"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
