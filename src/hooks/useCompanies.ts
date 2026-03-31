import { useQuery } from "@tanstack/react-query";
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

export const useCompanies = (initialData?: Company[]) => {
    return useQuery<Company[]>({
        queryKey: ["companies"],
        queryFn: () => initialData ?? [],
        initialData,
        staleTime: Infinity,
    });
};
