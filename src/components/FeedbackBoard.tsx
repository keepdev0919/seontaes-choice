"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import feedbackPostsData from "@/data/feedback_posts.json";

interface Post {
  id: number;
  nickname: string;
  content: string;
  likes: number;
  created_at: string;
}

function formatRelative(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-foreground">{post.nickname}</span>
        <span className="text-xs text-muted-foreground">{formatRelative(post.created_at)}</span>
      </div>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Heart className="h-3.5 w-3.5" />
          <span>{post.likes}</span>
        </div>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>댓글</span>
          {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">서비스가 종료되어 댓글을 작성할 수 없습니다.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const PAGE_SIZE = 10;

export default function FeedbackBoard() {
  const allPosts = [...(feedbackPostsData as Post[])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const [page, setPage] = useState(1);
  const visiblePosts = allPosts.slice(0, page * PAGE_SIZE);
  const hasMore = visiblePosts.length < allPosts.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-primary">자유게시판</h2>
        <span className="ml-auto text-xs text-muted-foreground">김선태 관련 무엇이든 남겨보세요</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
        서비스가 종료되어 새 글을 작성할 수 없습니다.
      </div>

      <div className="space-y-3">
        {allPosts.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">게시글이 없습니다.</p>
        )}
        <AnimatePresence>
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </AnimatePresence>
        {hasMore && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="w-full rounded-xl border border-border py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"
          >
            더 보기
          </button>
        )}
      </div>
    </div>
  );
}
