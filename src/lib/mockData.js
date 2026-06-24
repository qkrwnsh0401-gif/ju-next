// 데모용 목업 데이터
export const INITIAL_SITES = [
  { id: 1, name: '문화방송', client_company: '문화방송 MBC', location: '서울 마포구', active: true },
  { id: 2, name: '제때', client_company: '제때', location: '서울', active: true },
  { id: 3, name: '좋은사람들', client_company: '좋은사람들', location: '서울', active: true },
  { id: 4, name: '세스코', client_company: 'CESCO 방역서비스', location: '서울 강서구', active: true },
  { id: 5, name: '한국보건의료연구원', client_company: '한국보건의료연구원', location: '서울', active: true },
  { id: 6, name: '엠즈비어', client_company: '엠즈비어', location: '서울', active: true },
]

export const INITIAL_ISSUES = [
  { id: 1, site_id: 1, title: '방송 송출 장비 이상음 발생', detail: '3층 주조정실 송출 장비에서 이상음 발생. 부품 노화로 인한 교체 필요 판단됨.', status: 'open', severity: 'high', created_at: '2026-06-24' },
  { id: 2, site_id: 4, title: '방역 약품 재고 부족', detail: '정기 방역 진행 중 약품 재고가 임계치 이하로 떨어짐. 긴급 발주 요청 완료.', status: 'in_progress', severity: 'medium', created_at: '2026-06-23' },
  { id: 3, site_id: 2, title: '물류 설비 점검 요청', detail: '컨베이어 벨트 소음 발생. 장력 조정으로 임시 조치 완료. 정기 교체 시기 도래.', status: 'in_progress', severity: 'low', created_at: '2026-06-22' },
  { id: 4, site_id: 5, title: '변전소 정기 안전점검 완료', detail: '정기 안전점검 완료. 전체 설비 정상 작동 확인. 특이사항 없음.', status: 'done', severity: 'low', created_at: '2026-06-20' },
  { id: 5, site_id: 3, title: '냉난방 설비 점검', detail: '여름철 대비 냉방 설비 점검 완료. 필터 교체 및 냉매 보충 실시.', status: 'done', severity: 'medium', created_at: '2026-06-18' },
]

export const INITIAL_FINANCIALS = [
  { id: 1, site_id: 1, year_month: '2026-01', revenue: 38200000, labor_cost: 13620000 },
  { id: 2, site_id: 2, year_month: '2026-01', revenue: 12000000, labor_cost: 4800000 },
  { id: 3, site_id: 3, year_month: '2026-01', revenue: 9500000, labor_cost: 3800000 },
  { id: 4, site_id: 4, year_month: '2026-01', revenue: 16150000, labor_cost: 5940000 },
  { id: 5, site_id: 5, year_month: '2026-01', revenue: 21000000, labor_cost: 7800000 },
  { id: 6, site_id: 6, year_month: '2026-01', revenue: 8000000, labor_cost: 3000000 },
  { id: 7, site_id: 1, year_month: '2026-02', revenue: 39800000, labor_cost: 14100000 },
  { id: 8, site_id: 2, year_month: '2026-02', revenue: 12500000, labor_cost: 5000000 },
  { id: 9, site_id: 3, year_month: '2026-02', revenue: 10000000, labor_cost: 4000000 },
  { id: 10, site_id: 4, year_month: '2026-02', revenue: 17200000, labor_cost: 6200000 },
  { id: 11, site_id: 5, year_month: '2026-02', revenue: 22000000, labor_cost: 8100000 },
  { id: 12, site_id: 6, year_month: '2026-02', revenue: 8500000, labor_cost: 3200000 },
  { id: 13, site_id: 1, year_month: '2026-03', revenue: 41000000, labor_cost: 14500000 },
  { id: 14, site_id: 2, year_month: '2026-03', revenue: 13000000, labor_cost: 5200000 },
  { id: 15, site_id: 3, year_month: '2026-03', revenue: 10500000, labor_cost: 4200000 },
  { id: 16, site_id: 4, year_month: '2026-03', revenue: 18000000, labor_cost: 6500000 },
  { id: 17, site_id: 5, year_month: '2026-03', revenue: 23000000, labor_cost: 8500000 },
  { id: 18, site_id: 6, year_month: '2026-03', revenue: 9000000, labor_cost: 3400000 },
  { id: 19, site_id: 1, year_month: '2026-04', revenue: 40500000, labor_cost: 14300000 },
  { id: 20, site_id: 2, year_month: '2026-04', revenue: 12800000, labor_cost: 5100000 },
  { id: 21, site_id: 3, year_month: '2026-04', revenue: 10200000, labor_cost: 4100000 },
  { id: 22, site_id: 4, year_month: '2026-04', revenue: 17800000, labor_cost: 6400000 },
  { id: 23, site_id: 5, year_month: '2026-04', revenue: 22500000, labor_cost: 8300000 },
  { id: 24, site_id: 6, year_month: '2026-04', revenue: 8800000, labor_cost: 3300000 },
  { id: 25, site_id: 1, year_month: '2026-05', revenue: 42000000, labor_cost: 14800000 },
  { id: 26, site_id: 2, year_month: '2026-05', revenue: 13500000, labor_cost: 5400000 },
  { id: 27, site_id: 3, year_month: '2026-05', revenue: 11000000, labor_cost: 4400000 },
  { id: 28, site_id: 4, year_month: '2026-05', revenue: 18500000, labor_cost: 6700000 },
  { id: 29, site_id: 5, year_month: '2026-05', revenue: 24000000, labor_cost: 8800000 },
  { id: 30, site_id: 6, year_month: '2026-05', revenue: 9200000, labor_cost: 3500000 },
  { id: 31, site_id: 1, year_month: '2026-06', revenue: 38200000, labor_cost: 13620000 },
  { id: 32, site_id: 2, year_month: '2026-06', revenue: 12000000, labor_cost: 4800000 },
  { id: 33, site_id: 3, year_month: '2026-06', revenue: 9500000, labor_cost: 3800000 },
  { id: 34, site_id: 4, year_month: '2026-06', revenue: 16150000, labor_cost: 5940000 },
  { id: 35, site_id: 5, year_month: '2026-06', revenue: 21000000, labor_cost: 7800000 },
  { id: 36, site_id: 6, year_month: '2026-06', revenue: 8000000, labor_cost: 3000000 },
]

export const INITIAL_WORK_LOGS = [
  { id: 1, log_date: '2026-06-24', title: '세스코 정기방역 점검', content: '세스코 현장 정기 방역 점검 완료. 약품 재고 부족 확인 후 발주 요청함. 다음 방문 예정일 조율 완료.', tags: ['방역', '재고'], ai_summary: '약품 재고 임계치 도달, 긴급 발주 조치 완료' },
  { id: 2, log_date: '2026-06-23', title: '문화방송 장비 이상 점검', content: '문화방송 3층 주조정실 송출 장비 이상음 1차 점검. 부품 교체 필요 판단. 교체 부품 발주 및 2차 방문 일정 협의 중.', tags: ['장비', '점검'], ai_summary: '송출장비 부품 노화, 교체 필요. 2차 방문 협의 중.' },
  { id: 3, log_date: '2026-06-22', title: '제때 설비 점검', content: '제때 현장 설비 소음 점검 및 임시 조치 완료. 장력 조정으로 소음 해결. 정기 교체 시기 도래하여 교체 일정 협의 필요.', tags: ['설비', '조치'], ai_summary: '임시 조치 완료, 정기 교체 일정 수립 필요' },
  { id: 4, log_date: '2026-06-20', title: '한국보건의료연구원 안전점검', content: '한국보건의료연구원 정기 안전점검 완료. 전체 설비 정상 작동 확인. 특이사항 없음. 다음 점검일 3개월 후 예정.', tags: ['안전', '점검'], ai_summary: '이상 없음, 다음 정기점검 3개월 후 예정' },
]

export const SEVERITY_LABEL = { high: '심각도 긴급', medium: '심각도 중간', low: '심각도 낮음' }
export const SEVERITY_COLOR = { high: 'text-red-500', medium: 'text-orange-500', low: 'text-slate-400' }
export const STATUS_LABEL = { open: '발생', in_progress: '처리중', done: '완료' }
export const STATUS_COLOR = {
  open: 'bg-red-100 text-red-600',
  in_progress: 'bg-orange-100 text-orange-600',
  done: 'bg-teal-100 text-teal-600',
}
