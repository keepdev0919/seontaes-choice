-- ============================================
-- 선태의 선택: companies 테이블 생성
-- Supabase SQL Editor에서 실행
-- ============================================

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  channel_id TEXT NOT NULL,
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

-- 2. RLS 활성화
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책: 누구나 읽기 가능
CREATE POLICY "Anyone can read companies"
  ON companies FOR SELECT
  USING (true);

-- 4. RLS 정책: 누구나 투표(votes 업데이트) 가능
CREATE POLICY "Anyone can update votes"
  ON companies FOR UPDATE
  USING (true)
  WITH CHECK (true);
