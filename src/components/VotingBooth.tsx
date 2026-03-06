import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Vote, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { Company } from "@/data/mockData";

interface VotingBoothProps {
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

const VotingBooth = ({ companies, onVote }: VotingBoothProps) => {
  const [votedId, setVotedId] = useState<string | null>(null);
  const sorted = [...companies].sort((a, b) => b.votes - a.votes);

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
        <Vote className="h-5 w-5 text-primary" />
        <h2 className="text-xl text-primary">유저 예측 투표소</h2>
      </div>

      {votedId && (
        <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4" />
          오늘 투표를 완료했습니다!
        </div>
      )}

      <ScrollArea className="h-[480px]">
        <div className="divide-y divide-border p-2">
          {sorted.map((company, idx) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-secondary/50"
            >
              <span className="w-5 text-center text-sm font-bold text-muted-foreground">
                {idx + 1}
              </span>
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-8 w-8 shrink-0 rounded-lg bg-foreground/10 object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">{company.name}</p>
                <p className="text-xs text-muted-foreground">
                  {company.votes.toLocaleString()}표
                </p>
              </div>
              <Button
                size="sm"
                variant={votedId === company.id ? "default" : "outline"}
                disabled={!!votedId}
                onClick={() => handleVote(company)}
                className={
                  votedId === company.id
                    ? "gradient-gold text-primary-foreground"
                    : "border-primary/30 text-primary hover:bg-primary/10"
                }
              >
                {votedId === company.id ? "투표완료" : "투표"}
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VotingBooth;
