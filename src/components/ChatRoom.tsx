"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";

interface ChatMessage {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
}

const NICKNAME_KEY = "chat_nickname";
const MAX_CONTENT = 200;
const RATE_LIMIT_MS = 1000;

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatRoom() {
  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [settingNickname, setSettingNickname] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const lastSentRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // 닉네임 로드
  useEffect(() => {
    const saved = localStorage.getItem(NICKNAME_KEY);
    if (saved) setNickname(saved);
  }, []);

  // 초기 메시지 로드
  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100);
    if (data) setMessages(data as ChatMessage[]);
  }, []);

  // 실시간 구독
  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setUnread((n) => n + 1);
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadMessages]);

  // 채팅창 열 때 읽음 처리 + 스크롤
  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen]);

  // 새 메시지 오면 스크롤
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const saveNickname = () => {
    const trimmed = nicknameInput.trim();
    if (!trimmed || trimmed.length > 20) return;
    localStorage.setItem(NICKNAME_KEY, trimmed);
    setNickname(trimmed);
    setSettingNickname(false);
    setNicknameInput("");
  };

  const sendMessage = async () => {
    if (!nickname) {
      setSettingNickname(true);
      return;
    }
    const trimmed = input.trim();
    if (!trimmed || trimmed.length > MAX_CONTENT || sending) return;
    const now = Date.now();
    if (now - lastSentRef.current < RATE_LIMIT_MS) return;
    lastSentRef.current = now;
    setSending(true);
    setInput("");
    await supabase.from("chat_messages").insert({ nickname, content: trimmed });
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex h-[480px] w-[320px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >
            {/* 헤더 */}
            <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="flex-1 text-sm font-semibold text-foreground">
                실시간 채팅
              </span>
              {nickname && !settingNickname && (
                <button
                  onClick={() => setSettingNickname(true)}
                  className="mr-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {nickname}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 닉네임 설정 */}
            {(!nickname || settingNickname) ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
                <p className="text-sm text-muted-foreground text-center">
                  채팅에서 사용할 닉네임을 입력해주세요
                </p>
                <input
                  autoFocus
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveNickname()}
                  maxLength={20}
                  placeholder="닉네임 (최대 20자)"
                  className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={saveNickname}
                  disabled={!nicknameInput.trim()}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  완료
                </button>
                {settingNickname && nickname && (
                  <button
                    onClick={() => { setSettingNickname(false); setNicknameInput(""); }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    취소
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* 메시지 목록 */}
                <ScrollArea className="flex-1 px-3 py-2">
                  <div className="flex flex-col gap-2">
                    {messages.length === 0 && (
                      <p className="py-8 text-center text-xs text-muted-foreground">
                        첫 번째 메시지를 남겨보세요!
                      </p>
                    )}
                    {messages.map((msg) => {
                      const isMine = msg.nickname === nickname;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}
                        >
                          <span className="text-[10px] text-muted-foreground px-1">
                            {msg.nickname} · {formatTime(msg.created_at)}
                          </span>
                          <div
                            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                              isMine
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-secondary text-secondary-foreground rounded-tl-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                </ScrollArea>

                {/* 입력 */}
                <div className="flex items-end gap-2 border-t border-border px-3 py-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={MAX_CONTENT}
                    placeholder="메시지 입력... (Enter 전송)"
                    rows={1}
                    className="flex-1 resize-none rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    style={{ maxHeight: "80px" }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-all active:scale-95"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!isOpen && unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
    </div>
  );
}
