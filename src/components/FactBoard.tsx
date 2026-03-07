"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, MessageSquare, Vote, HelpCircle, Youtube, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { Company } from "@/data/mockData";
import { useCompanies, useVote } from "@/hooks/useCompanies";

interface FactBoardProps {
  initialCompanies: Company[];
}

// 영상 ID → 제목 매핑 (새 영상 추가 시 여기에도 추가)
const VIDEO_TITLES: Record<string, string> = {
  n8fdEYaDtfM: "김선태입니다",
  "9OWG7ulgUN4": "100만 구독자 감사합니다",
};

const VOTE_STORAGE_KEY = "suntae-vote";

function getVotedToday(): string | null {
  try {
    const data = JSON.parse(localStorage.getItem(VOTE_STORAGE_KEY) || "{}");
    const today = new Date().toISOString().slice(0, 10);
    return data.date === today ? data.companyId : null;
  } catch {
    return null;
  }
}

function setVotedToday(companyId: string) {
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify({ date: today, companyId }));
}

const FactBoard = ({ initialCompanies }: FactBoardProps) => {
  const { data: companies = [] } = useCompanies(initialCompanies);
  const voteMutation = useVote();

  const [votedId, setVotedId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [search, setSearch] = useState("");
  const sorted = [...companies]
    .sort((a, b) => b.youtubeLikes - a.youtubeLikes)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    setVotedId(getVotedToday());
  }, []);

  const handleVote = (company: Company) => {
    if (votedId) {
      toast.error("오늘은 이미 투표하셨습니다! 내일 다시 도전하세요 ");
      return;
    }
    setVotedToday(company.id);
    setVotedId(company.id);
    voteMutation.mutate(company.id);
    toast.success(`${company.name}에 투표 완료! 🎉`);
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl text-primary">실시간 유튜브 댓글</h2>
        <span className="ml-1 text-sm text-muted-foreground/80 font-medium">
          {search ? `(${sorted.length} / 총 ${companies.length}개)` : `(총 ${companies.length}개)`}
        </span>

        {/* ? 안내 아이콘 */}
        <div className="relative">
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-1/2 top-8 z-50 w-56 -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
              >
                <p className="font-semibold">자동 수집</p>
                <p className="mt-1 text-muted-foreground">
                  1시간마다 김선태 유튜브 영상의 기업 댓글(구독자 1천+)을 자동 수집합니다.
                </p>
                <div
                  className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-border bg-popover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span className="ml-auto text-xs text-muted-foreground">좋아요 순</span>
      </div>

      <div className="border-b border-border px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="기업명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-secondary/50 py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <ScrollArea className="h-[880px]">
        <div className="divide-y divide-border">
          {sorted.map((company, idx) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex gap-3 px-5 py-4 transition-colors hover:bg-secondary/50"
            >
              <img
                src={company.logoUrl}
                alt={company.name}
                className="mt-1 h-9 w-9 shrink-0 rounded-lg bg-foreground/10 object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-bold text-foreground">{company.name}</span>
                </div>
                <p className="mb-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {company.commentText}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ThumbsUp className="h-3 w-3" />
                  <span className="font-semibold text-foreground">
                    {company.youtubeLikes.toLocaleString()}
                  </span>
                  {/* 유튜브 출처 아이콘 — 클릭하면 영상으로 이동 */}
                  {company.videoId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${company.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 flex items-center gap-1 text-muted-foreground transition-colors hover:text-red-500"
                      title="원본 영상 보기"
                    >
                      <Youtube className="h-3.5 w-3.5" />
                      <span className="max-w-[120px] truncate text-[10px]">
                        {VIDEO_TITLES[company.videoId] || "영상 보기"}
                      </span>
                    </a>
                  )}
                </div>
              </div>

              {/* 정사각형 투표 버튼 */}
              <button
                onClick={() => handleVote(company)}

                className={`mt-1 flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border transition-all ${votedId === company.id
                  ? "border-primary bg-primary/20 text-primary"
                  : votedId
                    ? "cursor-not-allowed border-border bg-secondary/30 text-muted-foreground opacity-50"
                    : "border-primary/30 bg-primary/5 text-primary hover:border-primary hover:bg-primary/15 active:scale-95"
                  }`}
                title={votedId ? (votedId === company.id ? "투표 완료" : "이미 투표함") : `${company.name}에 투표`}
              >
                <Vote className="h-4 w-4" />
                <span className="mt-0.5 text-[9px] font-bold leading-none">
                  {votedId === company.id ? "완료" : "투표"}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FactBoard;
