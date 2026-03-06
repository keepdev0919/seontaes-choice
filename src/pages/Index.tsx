import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import TopThreeDashboard from "@/components/TopThreeDashboard";
import FactBoard from "@/components/FactBoard";
import VotingBooth from "@/components/VotingBooth";
import { mockCompanies, type Company } from "@/data/mockData";

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);

  const handleVote = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, votes: c.votes + 1 } : c))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />
      <TopThreeDashboard companies={companies} />

      <section className="container mx-auto px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <FactBoard companies={companies} />
          <VotingBooth companies={companies} onVote={handleVote} />
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        선태의 선택 · 목업 데이터 · YouTube API 연동 예정
      </footer>
    </div>
  );
};

export default Index;
