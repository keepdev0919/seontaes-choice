import HeroBanner from "@/components/HeroBanner";
import TopThreeDashboard from "@/components/TopThreeDashboard";
import FactBoard from "@/components/FactBoard";
import VotingBooth from "@/components/VotingBooth";
import { useCompanies, useVote } from "@/hooks/useCompanies";

const Index = () => {
  const { data: companies = [], isLoading, error } = useCompanies();
  const voteMutation = useVote();

  const handleVote = (companyId: string) => {
    voteMutation.mutate(companyId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive text-lg font-medium">데이터를 불러올 수 없습니다</p>
          <p className="text-muted-foreground text-sm">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />
      <TopThreeDashboard companies={companies} />

      <section className="container mx-auto px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <FactBoard companies={companies} onVote={handleVote} />
          <VotingBooth companies={companies} onVote={handleVote} />
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        선태의 선택 · Powered by Supabase
      </footer>
    </div>
  );
};

export default Index;
