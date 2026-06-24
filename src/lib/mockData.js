// 데모용 목업 데이터 (Supabase 연결 전 사용)
export const SITES = [
  { id: 1, name: 'MBC', client_company: 'MBC 방송국', location: '서울 마포구', active: true },
  { id: 2, name: '다이나맥', client_company: '다이나맥 물류', location: '경기 용인시', active: true },
  { id: 3, name: 'CESCO', client_company: 'CESCO 방역서비스', location: '서울 강서구', active: true },
  { id: 4, name: '한국전력', client_company: '한국전력 변전소', location: '경기 수원시', active: true },
]

export const ISSUES = [
  { id: 1, site_id: 1, title: '방송 송출 장비 이상음 발생', status: 'open', severity: 'high', created_at: '2026-06-24' },
  { id: 2, site_id: 3, title: '방역 약품 재고 부족', status: 'in_progress', severity: 'medium', created_at: '2026-06-23' },
  { id: 3, site_id: 2, title: '물류센터 컨베이어 점검 요청', status: 'in_progress', severity: 'low', created_at: '2026-06-22' },
  { id: 4, site_id: 4, title: '변전소 정기 안전점검 완료', status: 'done', severity: 'low', created_at: '2026-06-20' },
  { id: 5, site_id: 1, title: '부품 교체 필요 판단 완료', status: 'done', severity: 'medium', created_at: '2026-06-18' },
  { id: 6, site_id: 2, title: '컨베이어 벨트 소음 임시 조치', status: 'done', severity: 'low', created_at: '2026-06-17' },
]

export const FINANCIALS = [
  { id: 1, site_id: 1, year_month: '2026-01', revenue: 38200000, labor_cost: 13620000, profit: 24580000 },
  { id: 2, site_id: 2, year_month: '2026-01', revenue: 21540000, labor_cost: 9280000, profit: 12260000 },
  { id: 3, site_id: 3, year_month: '2026-01', revenue: 16150000, labor_cost: 5940000, profit: 10210000 },
  { id: 4, site_id: 4, year_month: '2026-01', revenue: 8210000, labor_cost: 3060000, profit: 5150000 },
  { id: 1, site_id: 1, year_month: '2026-02', revenue: 39800000, labor_cost: 14100000, profit: 25700000 },
  { id: 2, site_id: 2, year_month: '2026-02', revenue: 22100000, labor_cost: 9500000, profit: 12600000 },
  { id: 3, site_id: 3, year_month: '2026-02', revenue: 17200000, labor_cost: 6200000, profit: 11000000 },
  { id: 4, site_id: 4, year_month: '2026-02', revenue: 8500000, labor_cost: 3100000, profit: 5400000 },
  { id: 1, site_id: 1, year_month: '2026-03', revenue: 41000000, labor_cost: 14500000, profit: 26500000 },
  { id: 2, site_id: 2, year_month: '2026-03', revenue: 23000000, labor_cost: 9800000, profit: 13200000 },
  { id: 3, site_id: 3, year_month: '2026-03', revenue: 18000000, labor_cost: 6500000, profit: 11500000 },
  { id: 4, site_id: 4, year_month: '2026-03', revenue: 8800000, labor_cost: 3200000, profit: 5600000 },
  { id: 1, site_id: 1, year_month: '2026-04', revenue: 40500000, labor_cost: 14300000, profit: 26200000 },
  { id: 2, site_id: 2, year_month: '2026-04', revenue: 22500000, labor_cost: 9600000, profit: 12900000 },
  { id: 3, site_id: 3, year_month: '2026-04', revenue: 17800000, labor_cost: 6400000, profit: 11400000 },
  { id: 4, site_id: 4, year_month: '2026-04', revenue: 8600000, labor_cost: 3150000, profit: 5450000 },
  { id: 1, site_id: 1, year_month: '2026-05', revenue: 42000000, labor_cost: 14800000, profit: 27200000 },
  { id: 2, site_id: 2, year_month: '2026-05', revenue: 23500000, labor_cost: 10000000, profit: 13500000 },
  { id: 3, site_id: 3, year_month: '2026-05', revenue: 18500000, labor_cost: 6700000, profit: 11800000 },
  { id: 4, site_id: 4, year_month: '2026-05', revenue: 9000000, labor_cost: 3300000, profit: 5700000 },
  { id: 1, site_id: 1, year_month: '2026-06', revenue: 38200000, labor_cost: 13620000, profit: 24580000 },
  { id: 2, site_id: 2, year_month: '2026-06', revenue: 21540000, labor_cost: 9280000, profit: 12260000 },
  { id: 3, site_id: 3, year_month: '2026-06', revenue: 16150000, labor_cost: 5940000, profit: 10210000 },
  { id: 4, site_id: 4, year_month: '2026-06', revenue: 8210000, labor_cost: 3060000, profit: 5150000 },
]

export const WORK_LOGS = [
  { id: 1, log_date: '2026-06-23', site_id: 3, content: '정기 방역 점검 완료, 약품 재고 부족 확인 후 발주 요청함', tags: ['방역', '재고'], ai_summary: '약품 재고 임계치 도달, 긴급 발주 조치 완료' },
  { id: 2, log_date: '2026-06-22', site_id: 1, content: '송출 장비 이상음 1차 점검, 부품 교체 필요 판단', tags: ['장비', '점검'], ai_summary: '송출장비 부품 노화로 교체 필요, 2차 방문 일정 협의 중' },
  { id: 3, log_date: '2026-06-22', site_id: 2, content: '물류센터 컨베이어 벨트 소음 점검 및 임시 조치', tags: ['설비', '조치'], ai_summary: '벨트 장력 조정으로 임시 해결, 정기 교체 시기 도래' },
  { id: 4, log_date: '2026-06-20', site_id: 4, content: '변전소 정기 안전점검 완료, 특이사항 없음', tags: ['안전', '점검'], ai_summary: '이상 없음, 다음 정기점검 3개월 후 예정' },
  { id: 5, log_date: '2026-06-19', site_id: 2, content: '다이나맥 월간 점검 보고서 작성', tags: ['보고서'], ai_summary: '월간 점검 완료, 전반적 설비 상태 양호' },
]

export const MONTHLY_TOTALS = [
  { month: '1월', revenue: 84100000, labor_cost: 31960000 },
  { month: '2월', revenue: 87600000, labor_cost: 32900000 },
  { month: '3월', revenue: 90800000, labor_cost: 34000000 },
  { month: '4월', revenue: 89400000, labor_cost: 33450000 },
  { month: '5월', revenue: 93000000, labor_cost: 34800000 },
  { month: '6월', revenue: 84100000, labor_cost: 31900000 },
]

export const SITE_COLORS = {
  MBC: '#0D9488',
  '다이나맥': '#3B82F6',
  CESCO: '#8B5CF6',
  '한국전력': '#F59E0B',
}

export const SITE_NAME_BY_ID = { 1: 'MBC', 2: '다이나맥', 3: 'CESCO', 4: '한국전력' }

export const SEVERITY_LABEL = { high: '심각도 긴급', medium: '심각도 중간', low: '심각도 낮음' }
export const STATUS_LABEL = { open: '발생', in_progress: '처리중', done: '완료' }
export const STATUS_COLOR = {
  open: 'bg-red-100 text-red-600',
  in_progress: 'bg-orange-100 text-orange-600',
  done: 'bg-teal-100 text-teal-600',
}
