export interface Company {
  id: string;
  name: string;
  commentText: string;
  youtubeLikes: number;
  logoUrl?: string; // 채널 로고 이미지 URL
  votes: number;
  authorChannelId?: string; // 댓글 작성자의 채널 ID
  subscriberCount: number; // 구독자 수
  isVerified: boolean; // 유튜브 인증 배지 여부
  videoId?: string; // 댓글이 작성된 원본 영상
  commentId?: string; // 유튜브 댓글의 진짜 고유 ID
}
