"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Company } from "@/data/mockData";
import { useCompanies } from "@/hooks/useCompanies";

interface VotingBoothProps {
  initialCompanies: Company[];
}

const VotingBooth = ({ initialCompanies }: VotingBoothProps) => {
  const { data: companies = [] } = useCompanies(initialCompanies);
  const [search, setSearch] = useState("");
  const ranked = [...companies]
    .sort((a, b) => b.votes - a.votes)
    .map((c, i) => ({ ...c, rank: i + 1 }));
  const filtered = ranked.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const maxVotes = ranked[0]?.votes || 1;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex min-w-0 items-center gap-2 border-b border-border px-5 py-4">
        <Trophy className="h-5 w-5 shrink-0 text-primary" />
        <h2 className="shrink-0 text-xl text-primary">실시간 투표 리더보드</h2>
        <span className="ml-auto hidden shrink-0 text-xs text-muted-foreground sm:block">득표 순</span>
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

      <ScrollArea className="h-[420px] md:h-[880px]">
        <div className="divide-y divide-border">
          {filtered.map((company) => {
            const idx = company.rank - 1;
            const ratio = maxVotes > 0 ? (company.votes / maxVotes) * 100 : 0;
            const totalVotes = ranked.reduce((sum, c) => sum + c.votes, 0);
            const percentage = totalVotes > 0 ? ((company.votes / totalVotes) * 100).toFixed(1) : "0";

            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: search ? 0 : idx * 0.06 }}
                className="px-3 py-3 transition-colors hover:bg-secondary/30 md:px-5"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-full font-black ${company.rank <= 3 ? "h-8 w-8 text-sm" : "h-6 w-6 text-xs"
                      } ${company.rank === 1
                        ? "bg-yellow-500/20 text-yellow-500"
                        : company.rank === 2
                          ? "bg-gray-400/20 text-gray-400"
                          : company.rank === 3
                            ? "bg-amber-700/20 text-amber-700"
                            : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {company.rank}
                  </span>
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className={`shrink-0 rounded-md bg-foreground/10 object-contain p-0.5 ${company.rank <= 3 ? "h-9 w-9" : "h-7 w-7"
                      }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    {/* 이름 + 득표수(데스크탑) */}
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`min-w-0 flex-1 truncate font-bold text-foreground ${company.rank <= 3 ? "text-base" : "text-sm"
                          }`}
                      >
                        {company.name}
                      </span>
                      <div className={`hidden shrink-0 items-baseline gap-1 md:flex ${company.rank <= 3 ? "text-sm" : "text-xs"}`}>
                        <span className="font-black text-primary">
                          {company.votes.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">표</span>
                      </div>
                    </div>
                    {/* 모바일: 득표수 + 퍼센트 */}
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground md:hidden">
                      <span className="font-bold text-primary">{company.votes.toLocaleString()}</span>
                      <span>표</span>
                      <span>·</span>
                      <span>{percentage}%</span>
                    </div>
                    {/* 비율 바 */}
                    <div className="mt-1.5 flex items-center gap-2 pr-1">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${ratio}%` }}
                          transition={{ delay: idx * 0.06 + 0.3, duration: 0.6, ease: "easeOut" }}
                          className={`h-full rounded-full ${company.rank === 1
                            ? "bg-yellow-500"
                            : company.rank === 2
                              ? "bg-gray-400"
                              : company.rank === 3
                                ? "bg-amber-600"
                                : "bg-accent/50"
                            }`}
                        />
                      </div>
                      <span className="hidden w-10 text-right text-[10px] text-muted-foreground md:block">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VotingBooth;
