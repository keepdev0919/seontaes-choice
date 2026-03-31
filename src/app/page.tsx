import HeroBanner from "@/components/HeroBanner";
import TopThreeDashboard from "@/components/TopThreeDashboard";
import FactBoard from "@/components/FactBoard";
import VotingBooth from "@/components/VotingBooth";
import FeedbackBoard from "@/components/FeedbackBoard";
import { mapRowToCompany } from "@/hooks/useCompanies";
import companiesData from "@/data/companies.json";

export default function Home() {
    const formattedCompanies = [...companiesData]
        .sort((a, b) => b.votes - a.votes)
        .map(mapRowToCompany);

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

            <section className="container mx-auto px-4 pb-12">
                <FeedbackBoard />
            </section>

            <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
                선태의 선택
            </footer>
        </div>
    );
}
