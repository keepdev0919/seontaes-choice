-- ============================================
-- 선태의 선택: companies 테이블 생성
-- Supabase SQL Editor에서 실행
-- ============================================

-- 테이블 생성
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  youtube_likes INTEGER DEFAULT 0,
  logo_url TEXT,
  votes INTEGER DEFAULT 0,
  author_channel_id TEXT UNIQUE,
  subscriber_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  video_id TEXT,
  comment_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Anyone can read companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update votes"
  ON companies FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS 정책: INSERT 허용 (댓글 수집 스크립트용)
CREATE POLICY "Anyone can insert companies"
  ON companies FOR INSERT
  WITH CHECK (true);
