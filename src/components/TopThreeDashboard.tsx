"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";
import type { Company } from "@/data/mockData";
import { useCompanies } from "@/hooks/useCompanies";

interface TopThreeDashboardProps {
  initialCompanies: Company[];
}

const medals = ["🥇", "🥈", "🥉"];

const TopThreeDashboard = ({ initialCompanies }: TopThreeDashboardProps) => {
  const { data: companies = [] } = useCompanies(initialCompanies);
  const top3 = [...companies].sort((a, b) => b.votes - a.votes).slice(0, 3);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          <h2 className="text-2xl text-accent">TOP 3 예측 순위</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {top3.map((company, idx) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="glow-accent relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-3xl">{medals[idx]}</span>
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-10 w-10 rounded-lg bg-foreground/10 object-contain p-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div>
                  <h3 className="text-lg font-bold text-foreground">{company.name}</h3>
                  <p className="text-xs text-muted-foreground">구독자 {company.subscriberCount?.toLocaleString()}명</p>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">득표수</p>
                  <p className="text-2xl font-black text-accent">
                    {company.votes.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                  <TrendingUp className="h-3 w-3" />
                  인기
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopThreeDashboard;
