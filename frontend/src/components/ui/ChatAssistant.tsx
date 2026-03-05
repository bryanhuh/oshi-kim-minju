"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What dramas has Minju appeared in?",
  "Tell me about the IZ*ONE era.",
  "What magazines has she featured in?",
  "When was her acting debut?",
];

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            data.message ??
            data.error ??
            "Sorry, I couldn't find an answer right now.",
        },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 right-4 md:right-6 z-50 w-80 md:w-[360px] rounded-2xl shadow-2xl border border-[#f7c6d9]/50 overflow-hidden flex flex-col"
            style={{
              maxHeight: "72vh",
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between border-b border-[#f7c6d9]/30 shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(253,232,240,0.8) 0%, rgba(255,255,255,0.5) 100%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f4a7c1] to-[#e8809e] flex items-center justify-center text-white text-sm font-medium shadow-sm">
                  민
                </div>
                <div>
                  <p className="text-[#2a1a20] text-sm font-medium tracking-wide">
                    Minju Archive
                  </p>
                  <p className="text-[#2a1a20]/40 text-[10px] tracking-widest">
                    AI FAN ASSISTANT
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 flex items-center justify-center text-[#2a1a20]/40 hover:text-[#e8809e] transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {messages.length === 0 ? (
                <div className="space-y-4 pt-1">
                  <p className="text-[#2a1a20]/40 text-[11px] text-center tracking-widest">
                    ASK ME ANYTHING ABOUT MINJU
                  </p>
                  <div className="space-y-2">
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-[#2a1a20]/65 hover:text-[#e8809e] border border-[#f7c6d9]/40 hover:border-[#f4a7c1]/70 hover:bg-[#fde8f0]/60 transition-all duration-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-[#f4a7c1] to-[#e8809e] text-white"
                          : "bg-white/90 text-[#2a1a20] border border-[#f7c6d9]/30"
                      }`}
                    >
                      {msg.content}
                    </motion.div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/90 border border-[#f7c6d9]/30 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#f4a7c1]"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.7,
                            delay: i * 0.13,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#f7c6d9]/30 flex gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask about Minju..."
                className="flex-1 bg-white/60 border border-[#f7c6d9]/40 rounded-xl px-3.5 py-2 text-xs text-[#2a1a20] placeholder-[#2a1a20]/30 outline-none focus:border-[#f4a7c1]/70 transition-colors"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="px-3.5 py-2 bg-gradient-to-br from-[#f4a7c1] to-[#e8809e] text-white rounded-xl text-xs hover:opacity-90 disabled:opacity-35 transition-opacity"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        aria-label="Open Minju Archive AI assistant"
        className={`fixed bottom-4 right-4 md:right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          open
            ? "bg-[#e8809e]"
            : "bg-gradient-to-br from-[#f4a7c1] to-[#e8809e]"
        }`}
        style={{
          boxShadow:
            "0 0 20px rgba(244,167,193,0.5), 0 4px 12px rgba(0,0,0,0.1)",
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-white text-sm"
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="star"
              initial={{ opacity: 0, scale: 0.4, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, rotate: 45 }}
              transition={{ duration: 0.2 }}
              className="text-white text-lg"
            >
              ✦
            </motion.span>
          )}
        </AnimatePresence>

        {!open && (
          <motion.div
            className="absolute inset-0 rounded-full border border-[#f4a7c1]/60"
            animate={{ scale: [1, 1.55, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    </>
  );
}
