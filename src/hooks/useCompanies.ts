import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Company } from "@/data/mockData";

// Supabase row → Company 인터페이스 매핑
export interface CompanyRow {
    id: string;
    name: string;
    comment_text: string;
    youtube_likes: number;
    logo_url: string | null;
    votes: number;
    author_channel_id: string | null;
    subscriber_count: number;
    is_verified: boolean;
    video_id: string | null;
    comment_id: string | null;
    created_at: string;
}

export const mapRowToCompany = (row: CompanyRow): Company => ({
    id: row.id,
    name: row.name,
    commentText: row.comment_text,
    youtubeLikes: row.youtube_likes,
    logoUrl: row.logo_url ?? undefined,
    votes: row.votes,
    authorChannelId: row.author_channel_id ?? undefined,
    subscriberCount: row.subscriber_count,
    isVerified: row.is_verified,
    videoId: row.video_id ?? undefined,
    commentId: row.comment_id ?? undefined,
});

// 기업 목록 조회
const fetchCompanies = async (): Promise<Company[]> => {
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("youtube_likes", { ascending: false });

    if (error) throw error;
    return (data as CompanyRow[]).map(mapRowToCompany);
};

// 투표 처리 (안전한 RPC 호출로 변경: votes + 1)
const voteForCompany = async (companyId: string): Promise<void> => {
    const { error } = await supabase.rpc("increment_vote", { row_id: companyId });

    if (error) throw error;
};

export const useCompanies = (initialData?: Company[]) => {
    return useQuery<Company[]>({
        queryKey: ["companies"],
        queryFn: fetchCompanies,
        initialData,
        staleTime: 60 * 1000, // 1 minute stale time for ISR cache matching
    });
};

export const useVote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: voteForCompany,
        onMutate: async (companyId: string) => {
            await queryClient.cancelQueries({ queryKey: ["companies"] });
            const previous = queryClient.getQueryData<Company[]>(["companies"]);

            queryClient.setQueryData<Company[]>(["companies"], (old) =>
                old?.map((c) =>
                    c.id === companyId ? { ...c, votes: c.votes + 1 } : c
                )
            );

            return { previous };
        },
        onError: (_err, _companyId, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["companies"], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
    });
};
