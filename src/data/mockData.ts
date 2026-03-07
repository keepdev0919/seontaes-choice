export interface Company {
  id: string;
  name: string;
  channelId: string;
  commentText: string;
  youtubeLikes: number;
  logoUrl: string;
  votes: number;
  authorChannelId?: string;
  subscriberCount?: number;
  isVerified?: boolean;
  videoId?: string;
  commentId?: string;
}
