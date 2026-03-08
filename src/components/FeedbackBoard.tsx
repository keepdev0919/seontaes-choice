"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Send, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const NICKNAME_KEY = "chat_nickname";
const LIKED_KEY = "liked_posts";
const MY_POSTS_KEY = "my_post_ids";

interface Post {
  id: number;
  nickname: string;
  content: string;
  likes: number;
  created_at: string;
}

interface Comment {
  id: number;
  post_id: number;
  nickname: string;
  content: string;
  created_at: string;
}

function formatRelative(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

function getLikedIds(): Set<number> {
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveLikedIds(ids: Set<number>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...ids]));
}

function getMyPostIds(): Set<number> {
  try {
    const raw = localStorage.getItem(MY_POSTS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveMyPostIds(ids: Set<number>) {
  localStorage.setItem(MY_POSTS_KEY, JSON.stringify([...ids]));
}

// 대댓글 컴포넌트
function CommentSection({ postId, nickname }: { postId: number; nickname: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase
      .from("feedback_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setComments(data as Comment[]);
      });
  }, [postId]);

  const sendComment = async () => {
    const trimmed = commentInput.trim();
    if (!trimmed || trimmed.length > 300 || sending || !nickname) return;
    setSending(true);
    const { data } = await supabase
      .from("feedback_comments")
      .insert({ post_id: postId, nickname, content: trimmed })
      .select()
      .single();
    if (data) setComments((prev) => [...prev, data as Comment]);
    setCommentInput("");
    setSending(false);
  };

  return (
    <div className="mt-3 border-t border-border pt-3 space-y-2">
      {comments.map((c) => (
        <div key={c.id} className="flex gap-2 text-sm">
          <span className="shrink-0 font-medium text-foreground">{c.nickname}</span>
          <span className="text-muted-foreground">{c.content}</span>
          <span className="ml-auto shrink-0 text-xs text-muted-foreground">{formatRelative(c.created_at)}</span>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendComment()}
          maxLength={300}
          placeholder={nickname ? "대댓글 입력..." : "닉네임을 먼저 설정하세요"}
          disabled={!nickname}
          className="flex-1 rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        />
        <button
          onClick={sendComment}
          disabled={!commentInput.trim() || !nickname || sending}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// 게시글 카드
function PostCard({
  post,
  nickname,
  isOwner,
  onDelete,
}: {
  post: Post;
  nickname: string;
  isOwner: boolean;
  onDelete: (id: number) => void;
}) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLiked(getLikedIds().has(post.id));
  }, [post.id]);

  const handleLike = async () => {
    if (liked) return;
    const ids = getLikedIds();
    ids.add(post.id);
    saveLikedIds(ids);
    setLiked(true);
    setLikes((n) => n + 1);
    await supabase.rpc("increment_post_like", { post_id: post.id });
  };

  const handleDelete = async () => {
    if (!confirm("이 글을 삭제할까요?")) return;
    setDeleting(true);
    await supabase.from("feedback_posts").delete().eq("id", post.id);
    const ids = getMyPostIds();
    ids.delete(post.id);
    saveMyPostIds(ids);
    onDelete(post.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-foreground">{post.nickname}</span>
        <span className="text-xs text-muted-foreground">{formatRelative(post.created_at)}</span>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
            title="삭제"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-xs transition-colors ${
            liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-rose-500" : ""}`} />
          <span>{likes}</span>
        </button>
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
            <CommentSection postId={post.id} nickname={nickname} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FeedbackBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [myPostIds, setMyPostIds] = useState<Set<number>>(new Set());
  const [nickname, setNickname] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const saved = localStorage.getItem(NICKNAME_KEY);
    if (saved) setNickname(saved);
    setMyPostIds(getMyPostIds());
  }, []);

  const loadPosts = useCallback(async (pageNum: number) => {
    const { data } = await supabase
      .from("feedback_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);
    if (!data) return;
    if (data.length < PAGE_SIZE) setHasMore(false);
    if (pageNum === 0) setPosts(data as Post[]);
    else setPosts((prev) => [...prev, ...(data as Post[])]);
  }, []);

  useEffect(() => {
    loadPosts(0);
  }, [loadPosts]);

  const saveNickname = () => {
    const trimmed = nicknameInput.trim();
    if (!trimmed || trimmed.length > 20) return;
    localStorage.setItem(NICKNAME_KEY, trimmed);
    setNickname(trimmed);
    setEditingNickname(false);
    setNicknameInput("");
  };

  const submitPost = async () => {
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > 500 || submitting || !nickname) return;
    setSubmitting(true);
    const { data } = await supabase
      .from("feedback_posts")
      .insert({ nickname, content: trimmed })
      .select()
      .single();
    if (data) {
      const newPost = data as Post;
      setPosts((prev) => [newPost, ...prev]);
      const ids = getMyPostIds();
      ids.add(newPost.id);
      saveMyPostIds(ids);
      setMyPostIds(new Set(ids));
    }
    setContent("");
    setSubmitting(false);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadPosts(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-primary">자유게시판</h2>
        <span className="ml-auto text-xs text-muted-foreground">김선태 관련 무엇이든 남겨보세요</span>
      </div>

      {/* 글쓰기 폼 */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        {/* 닉네임 영역 */}
        {!nickname || editingNickname ? (
          <div className="flex gap-2">
            <input
              autoFocus={editingNickname}
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveNickname()}
              maxLength={20}
              placeholder="닉네임 설정 (최대 20자)"
              className="flex-1 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={saveNickname}
              disabled={!nicknameInput.trim()}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              설정
            </button>
            {editingNickname && nickname && (
              <button
                onClick={() => { setEditingNickname(false); setNicknameInput(""); }}
                className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                취소
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{nickname}</span>
            <span className="text-xs text-muted-foreground">으로 작성됩니다</span>
            <button
              onClick={() => { setEditingNickname(true); setNicknameInput(nickname); }}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              변경
            </button>
          </div>
        )}

        {/* 내용 입력 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) submitPost(); }}
          maxLength={500}
          placeholder={nickname ? "내용을 입력하세요... (⌘+Enter 제출)" : "닉네임을 먼저 설정해주세요"}
          disabled={!nickname}
          rows={3}
          className="w-full resize-none rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{content.length}/500</span>
          <button
            onClick={submitPost}
            disabled={!content.trim() || !nickname || submitting}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <Send className="h-3.5 w-3.5" />
            글 남기기
          </button>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-3">
        {posts.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            아직 게시글이 없습니다. 첫 번째 글을 남겨보세요!
          </p>
        )}
        <AnimatePresence>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              nickname={nickname}
              isOwner={myPostIds.has(post.id)}
              onDelete={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
            />
          ))}
        </AnimatePresence>
        {hasMore && posts.length > 0 && (
          <button
            onClick={loadMore}
            className="w-full rounded-xl border border-border py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"
          >
            더 보기
          </button>
        )}
      </div>
    </div>
  );
}
