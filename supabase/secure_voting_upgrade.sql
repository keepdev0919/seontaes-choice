-- ============================================
-- 보안 업그레이드: RLS 정책 강화 및 투표 RPC 함수 생성
-- 
-- 이 전체 코드를 Supabase SQL Editor에 복사하고 
-- [ RUN ] 버튼을 눌러주세요.
-- ============================================

-- 1. 서비스 롤 키(관리자)만 INSERT, UPDATE, DELETE 할 수 있는 정책
-- 이 정책이 있으면 일반 사용자는 ANON_KEY 로 데이터를 수정/삽입/삭제 할 수 없습니다.
DROP POLICY IF EXISTS "Service Role Only Insert" ON companies;
DROP POLICY IF EXISTS "Service Role Only Update" ON companies;
DROP POLICY IF EXISTS "Service Role Only Delete" ON companies;

CREATE POLICY "Service Role Only Insert"
  ON companies FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service Role Only Update"
  ON companies FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service Role Only Delete"
  ON companies FOR DELETE
  TO service_role
  USING (true);

-- 3. 안전한 실시간 투표 처리를 위한 RPC (원격 프로시저 호출) 함수 생성
-- 프론트엔드가 'n표로 덮어씌워 줘'라고 요청하는 대신, 
-- '이 회사 아이디에 1표 더해줘' 라고만 요청하게 만듭니다. (동시투표 씹힘 방지 및 보안강화)
CREATE OR REPLACE FUNCTION increment_vote(row_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER -- 이 함수는 생성자(데이터베이스 관리자) 권한으로 실행되어 RLS 제약을 우회하고 표를 1 올립니다.
AS $$
  UPDATE companies
  SET votes = votes + 1
  WHERE id = row_id;
$$;
