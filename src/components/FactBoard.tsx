import { motion } from "framer-motion";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Company } from "@/data/mockData";

interface FactBoardProps {
  companies: Company[];
}

const FactBoard = ({ companies }: FactBoardProps) => {
  const sorted = [...companies].sort((a, b) => b.youtubeLikes - a.youtubeLikes);

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl text-primary">실시간 팩트 보드</h2>
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
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="h-3 w-3" />
                  <span className="font-semibold text-foreground">
                    {company.youtubeLikes.toLocaleString()}
                  </span>
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
