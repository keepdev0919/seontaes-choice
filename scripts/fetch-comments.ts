/**
 * YouTube 댓글 수집 스크립트
 * 
 * 김선태 유튜브 영상에서 기업/기관 공식 계정의 댓글을 수집하여
 * Supabase companies 테이블에 저장합니다.
 * 
 * 실행: npx tsx scripts/fetch-comments.ts
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─── 설정 ───────────────────────────────
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// 수집 대상 영상 목록 (새 영상 추가 시 여기에 ID 추가)
const VIDEO_IDS = [
    "n8fdEYaDtfM",  // 김선태입니다
    "9OWG7ulgUN4",  // 2번째 영상
];
const MIN_SUBSCRIBER_COUNT = 1000; // 기업 계정 필터 기준 (구독자 1천 이상)

// ─── 타입 정의 ───────────────────────────
interface YouTubeComment {
    commentId: string;
    authorName: string;
    authorChannelId: string;
    authorProfileImage: string;
    text: string;
    likeCount: number;
    publishedAt: string;
}

interface ChannelInfo {
    channelId: string;
    title: string;
    subscriberCount: number;
    thumbnailUrl: string;
}

// ─── YouTube API 호출 ────────────────────

async function fetchAllComments(videoId: string): Promise<YouTubeComment[]> {
    const comments: YouTubeComment[] = [];
    let nextPageToken: string | undefined;

    console.log(`📥 영상 ${videoId}의 댓글을 가져오는 중...`);

    do {
        const params = new URLSearchParams({
            part: "snippet",
            videoId,
            maxResults: "100",
            order: "relevance",
            key: YOUTUBE_API_KEY!,
        });
        if (nextPageToken) params.set("pageToken", nextPageToken);

        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/commentThreads?${params}`
        );

        if (!res.ok) {
            const err = await res.json();
            throw new Error(`YouTube API 오류: ${JSON.stringify(err)}`);
        }

        const data = await res.json();

        for (const item of data.items || []) {
            const snippet = item.snippet.topLevelComment.snippet;
            comments.push({
                commentId: item.snippet.topLevelComment.id,
                authorName: snippet.authorDisplayName,
                authorChannelId: snippet.authorChannelId?.value || "",
                authorProfileImage: snippet.authorProfileImageUrl,
                text: snippet.textOriginal,
                likeCount: snippet.likeCount,
                publishedAt: snippet.publishedAt,
            });
        }

        nextPageToken = data.nextPageToken;
        console.log(`  ✅ ${comments.length}개 댓글 수집 완료`);
    } while (nextPageToken);

    console.log(`📊 총 ${comments.length}개 댓글 수집 완료\n`);
    return comments;
}

async function fetchChannelInfoBatch(
    channelIds: string[]
): Promise<Map<string, ChannelInfo>> {
    const channelMap = new Map<string, ChannelInfo>();

    // YouTube API는 한 번에 최대 50개 채널 조회 가능
    for (let i = 0; i < channelIds.length; i += 50) {
        const batch = channelIds.slice(i, i + 50);
        const params = new URLSearchParams({
            part: "snippet,statistics",
            id: batch.join(","),
            key: YOUTUBE_API_KEY!,
        });

        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?${params}`
        );

        if (!res.ok) {
            const err = await res.json();
            console.error(`채널 정보 조회 실패:`, err);
            continue;
        }

        const data = await res.json();
        for (const item of data.items || []) {
            channelMap.set(item.id, {
                channelId: item.id,
                title: item.snippet.title,
                subscriberCount: parseInt(item.statistics.subscriberCount || "0", 10),
                thumbnailUrl: item.snippet.thumbnails?.default?.url || "",
            });
        }
    }

    return channelMap;
}

// ─── Supabase 저장 ──────────────────────

async function upsertCompanies(
    supabase: SupabaseClient,
    companies: Array<{
        name: string;
        channelId: string;
        commentText: string;
        youtubeLikes: number;
        logoUrl: string;
        authorChannelId: string;
        subscriberCount: number;
        videoId: string;
        commentId: string;
    }>
) {
    // 같은 채널의 댓글이 여러 개면 좋아요가 가장 높은 것만 남기기
    const bestByChannel = new Map<string, (typeof companies)[0]>();
    for (const company of companies) {
        const existing = bestByChannel.get(company.authorChannelId);
        if (!existing || company.youtubeLikes > existing.youtubeLikes) {
            bestByChannel.set(company.authorChannelId, company);
        }
    }

    const deduped = [...bestByChannel.values()];
    console.log(`💾 Supabase에 ${deduped.length}개 기업 댓글 저장 중... (중복 채널 제거: ${companies.length} → ${deduped.length})`);

    for (const company of deduped) {
        // 기존 votes 값 보존을 위해 먼저 조회
        const { data: existingRow } = await supabase
            .from("companies")
            .select("votes")
            .eq("author_channel_id", company.authorChannelId)
            .single();

        const existingVotes = (existingRow as { votes: number } | null)?.votes ?? 0;

        const { error } = await (supabase.from("companies") as any).upsert(
            {
                name: company.name,
                comment_text: company.commentText,
                youtube_likes: company.youtubeLikes,
                logo_url: company.logoUrl,
                author_channel_id: company.authorChannelId,
                subscriber_count: company.subscriberCount,
                video_id: company.videoId,
                comment_id: company.commentId,
                votes: existingVotes,
            },
            { onConflict: "author_channel_id" }
        );

        if (error) {
            console.error(`  ❌ ${company.name} 저장 실패:`, error.message);
        } else {
            console.log(
                `  ✅ ${company.name} (구독자 ${company.subscriberCount.toLocaleString()}명, 좋아요 ${company.youtubeLikes})`
            );
        }
    }
}

// ─── 메인 ───────────────────────────────

async function main() {
    // 환경변수 체크
    if (!YOUTUBE_API_KEY) {
        console.error("❌ YOUTUBE_API_KEY 환경변수를 설정해주세요");
        process.exit(1);
    }
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error("❌ VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 환경변수를 설정해주세요");
        process.exit(1);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    console.log("🚀 김선태 유튜브 기업 댓글 수집 시작\n");
    console.log(`📌 대상 영상: ${VIDEO_IDS.length}개`);
    VIDEO_IDS.forEach((id, i) => console.log(`   ${i + 1}. https://www.youtube.com/watch?v=${id}`));
    console.log(`📌 필터 기준: 구독자 ${MIN_SUBSCRIBER_COUNT.toLocaleString()}명 이상\n`);

    // 1. 모든 영상의 댓글 가져오기
    const allComments: (YouTubeComment & { videoId: string })[] = [];
    for (const videoId of VIDEO_IDS) {
        const comments = await fetchAllComments(videoId);
        allComments.push(...comments.map((c) => ({ ...c, videoId })));
    }
    console.log(`📊 전체 영상 총 ${allComments.length}개 댓글 수집\n`);

    // 2. 고유 채널 ID 추출
    const uniqueChannelIds = [...new Set(allComments.map((c) => c.authorChannelId).filter(Boolean))];
    console.log(`👤 고유 댓글 작성자: ${uniqueChannelIds.length}명\n`);

    // 3. 채널 정보 조회 (구독자 수 등)
    console.log("🔍 각 채널 정보 조회 중...");
    const channelInfoMap = await fetchChannelInfoBatch(uniqueChannelIds);
    console.log(`📊 채널 정보 조회 완료: ${channelInfoMap.size}개\n`);

    // 4. 구독자 수로 필터링
    const companyComments = allComments.filter((comment) => {
        const channelInfo = channelInfoMap.get(comment.authorChannelId);
        return channelInfo && channelInfo.subscriberCount >= MIN_SUBSCRIBER_COUNT;
    });

    console.log(`🏢 기업/기관 댓글 (구독자 ${MIN_SUBSCRIBER_COUNT.toLocaleString()}+ 필터): ${companyComments.length}개\n`);

    if (companyComments.length === 0) {
        console.log("⚠️ 필터 기준에 맞는 기업 댓글이 없습니다.");
        console.log("   구독자 수 기준을 낮춰보세요.");
        return;
    }

    // 5. 수집된 데이터 정리
    const companiesToSave = companyComments.map((comment) => {
        const channelInfo = channelInfoMap.get(comment.authorChannelId)!;
        return {
            name: channelInfo.title,
            channelId: comment.authorChannelId,
            commentText: comment.text,
            youtubeLikes: comment.likeCount,
            logoUrl: channelInfo.thumbnailUrl,
            authorChannelId: comment.authorChannelId,
            subscriberCount: channelInfo.subscriberCount,
            videoId: comment.videoId,
            commentId: comment.commentId,
        };
    });

    // 결과 미리보기
    console.log("─── 수집된 기업 댓글 미리보기 ───");
    for (const c of companiesToSave) {
        console.log(`  🏢 ${c.name} (구독자 ${c.subscriberCount.toLocaleString()}명)`);
        console.log(`     💬 ${c.commentText.substring(0, 60)}...`);
        console.log(`     👍 ${c.youtubeLikes} likes\n`);
    }

    // 6. Supabase에 저장
    await upsertCompanies(supabase, companiesToSave);

    console.log("\n🎉 수집 완료!");
}

main().catch((err) => {
    console.error("❌ 에러 발생:", err);
    process.exit(1);
});
