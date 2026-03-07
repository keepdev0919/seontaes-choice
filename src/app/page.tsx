import HeroBanner from "@/components/HeroBanner";
import TopThreeDashboard from "@/components/TopThreeDashboard";
import FactBoard from "@/components/FactBoard";
import VotingBooth from "@/components/VotingBooth";
import { supabase } from "@/lib/supabase";
import { mapRowToCompany } from "@/hooks/useCompanies";

export const revalidate = 60; // 1분 단위로 ISR 캐시 갱신

export default async function Home() {
    // 사전 데이터 Fetching (최초 렌더링 시 서버에서 실행)
    const { data: companies, error } = await supabase
        .from("companies")
        .select("*")
        .order("votes", { ascending: false });

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-destructive text-lg font-medium">데이터를 불러올 수 없습니다</p>
                    <p className="text-muted-foreground text-sm">{error.message}</p>
                </div>
            </div>
        );
    }

    // 데이터 매핑 (snake_case -> camelCase)
    const formattedCompanies = (companies || []).map(mapRowToCompany);

    return (
        <div className="min-h-screen bg-background">
            <HeroBanner />
            <TopThreeDashboard initialCompanies={formattedCompanies} />

            <section className="container mx-auto px-4 pb-12">
                <div className="grid gap-6 lg:grid-cols-2">
                    <FactBoard initialCompanies={formattedCompanies} />
                    <VotingBooth initialCompanies={formattedCompanies} />
                </div>
            </section>

            <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
                선태의 선택
            </footer>
        </div>
    );
}
