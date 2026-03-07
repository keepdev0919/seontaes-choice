import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, MessageSquare, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { Company } from "@/data/mockData";

interface FactBoardProps {
  companies: Company[];
  onVote: (companyId: string) => void;
}

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

const FactBoard = ({ companies, onVote }: FactBoardProps) => {
  const [votedId, setVotedId] = useState<string | null>(null);
  const sorted = [...companies].sort((a, b) => b.youtubeLikes - a.youtubeLikes);

  useEffect(() => {
    setVotedId(getVotedToday());
  }, []);

  const handleVote = (company: Company) => {
    if (votedId) {
      toast.error("오늘은 이미 투표하셨습니다! 내일 다시 도전하세요 🗳️");
      return;
    }
    setVotedToday(company.id);
    setVotedId(company.id);
    onVote(company.id);
    toast.success(`${company.name}에 투표 완료! 🎉`);
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl text-primary">실시간 유튜브 댓글</h2>
        <span className="ml-auto text-xs text-muted-foreground">좋아요 순</span>
      </div>

      <ScrollArea className="h-[480px]">
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
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    ✓ 인증
                  </span>
                </div>
                <p className="mb-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {company.commentText}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    <span className="font-semibold text-foreground">
                      {company.youtubeLikes.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={votedId === company.id ? "default" : "outline"}
                    disabled={!!votedId}
                    onClick={() => handleVote(company)}
                    className={`h-6 px-2 text-[11px] ${votedId === company.id
                        ? "gradient-gold text-primary-foreground"
                        : "border-primary/30 text-primary hover:bg-primary/10"
                      }`}
                  >
                    <Vote className="mr-1 h-3 w-3" />
                    {votedId === company.id ? "투표완료" : "투표"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FactBoard;
