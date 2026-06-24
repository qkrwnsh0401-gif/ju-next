-- JU-NEXT HR-OS 데이터베이스 스키마
-- Supabase 대시보드 > SQL Editor에서 실행

-- 현장 테이블
CREATE TABLE sites (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  client_company TEXT NOT NULL,
  location    TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 현장 이슈 테이블
CREATE TABLE issues (
  id          BIGSERIAL PRIMARY KEY,
  site_id     BIGINT REFERENCES sites(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  status      TEXT CHECK (status IN ('open','in_progress','done')) DEFAULT 'open',
  severity    TEXT CHECK (severity IN ('high','medium','low')) DEFAULT 'medium',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 재무 테이블
CREATE TABLE financials (
  id          BIGSERIAL PRIMARY KEY,
  site_id     BIGINT REFERENCES sites(id) ON DELETE CASCADE,
  year_month  TEXT NOT NULL,  -- 'YYYY-MM'
  revenue     BIGINT DEFAULT 0,
  labor_cost  BIGINT DEFAULT 0,
  profit      BIGINT GENERATED ALWAYS AS (revenue - labor_cost) STORED,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 업무일지 테이블
CREATE TABLE work_logs (
  id          BIGSERIAL PRIMARY KEY,
  log_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  site_id     BIGINT REFERENCES sites(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  tags        TEXT[] DEFAULT '{}',
  ai_summary  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security 활성화
ALTER TABLE sites       ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues      ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_logs   ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자만 전체 접근 허용 (단일 사용자 앱)
CREATE POLICY "auth_all" ON sites       FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "auth_all" ON issues      FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "auth_all" ON financials  FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "auth_all" ON work_logs   FOR ALL TO authenticated USING (TRUE);

-- 샘플 데이터 삽입
INSERT INTO sites (name, client_company, location) VALUES
  ('MBC', 'MBC 방송국', '서울 마포구'),
  ('다이나맥', '다이나맥 물류', '경기 용인시'),
  ('CESCO', 'CESCO 방역서비스', '서울 강서구'),
  ('한국전력', '한국전력 변전소', '경기 수원시');
