"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Company } from "@/data/mockData";
import { useCompanies } from "@/hooks/useCompanies";

interface TopThreeDashboardProps {
  initialCompanies: Company[];
}

const medals = ["🥇", "🥈", "🥉"];

const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-700"];

const TopThreeDashboard = ({ initialCompanies }: TopThreeDashboardProps) => {
  const { data: companies = [] } = useCompanies(initialCompanies);
  const top3 = [...companies].sort((a, b) => b.votes - a.votes).slice(0, 3);

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          <h2 className="text-2xl text-accent">TOP 3 예측 순위</h2>
        </div>

        <div className="flex flex-col gap-2">
          {top3.map((company, idx) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3"
              >
                {/* 순위 뱃지 */}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center text-2xl">
                  {medals[idx]}
                </span>

                {/* 로고 */}
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-10 w-10 shrink-0 rounded-lg bg-foreground/10 object-contain p-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />

                {/* 기업명 + 구독자수 */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-foreground">{company.name}</p>
                  <p className="text-xs text-muted-foreground">
                    구독자 {company.subscriberCount?.toLocaleString()}명
                  </p>
                </div>

                {/* 득표수 */}
                <div className="shrink-0 text-right">
                  <span className={`text-lg font-black ${rankColors[idx]}`}>
                    {company.votes.toLocaleString()}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">표</span>
                </div>
              </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopThreeDashboard;
