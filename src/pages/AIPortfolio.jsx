import { useState } from 'react'
import { Sparkles, RefreshCw, Download, FileText } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useApp } from '../lib/AppContext'

const REPORT_TYPES = [
  { id: 'summary', label: '전체 현황 요약', icon: '📊', desc: '모든 현장의 이슈·재무·업무 종합 분석' },
  { id: 'issue', label: '이슈 분석 리포트', icon: '⚠️', desc: '현장별 이슈 현황 및 우선순위 분석' },
  { id: 'finance', label: '재무 분석 리포트', icon: '💰', desc: '매출·인건비·수익이율 트렌드 분석' },
  { id: 'worklog', label: '업무일지 분석', icon: '📋', desc: '업무 패턴 및 현장 방문 최적화 제안' },
]

const MOCK_REPORTS = {
  summary: `## 전체 현황 요약 리포트 (2026년 6월)

**핵심 지표**
- 총 관리 현장: 4개소 (MBC, 다이나맥, CESCO, 한국전력)
- 이번 달 총 매출: 8,420만원 (+12.4% 전월 대비)
- 진행중 이슈: 6건 (긴급 1건, 중간 2건, 낮음 3건)
- 작성된 업무일지: 18건 (완료율 96%)

**현장별 현황**
- **MBC**: 방송 송출 장비 긴급 이슈 발생. 즉각 처리 필요.
- **다이나맥**: 컨베이어 정기 교체 시기 도래. 예산 계획 검토 권장.
- **CESCO**: 방역 약품 재고 부족. 발주 완료 확인 필요.
- **한국전력**: 정기 안전점검 완료. 이상 없음.

**추천 액션**
1. MBC 부품 교체 일정 즉시 확정 (긴급)
2. CESCO 약품 발주 상태 확인
3. 다이나맥 컨베이어 벨트 교체 예산 편성
4. 한국전력 다음 정기점검 일정 캘린더 등록`,

  issue: `## 이슈 분석 리포트 (2026년 6월)

**이슈 요약**
- 전체 이슈: 6건
- 발생: 1건 / 처리중: 2건 / 완료: 3건

**긴급 현장 — MBC**
방송 송출 장비에서 이상음 발생. 부품 교체 필요로 판단됨.
→ **즉각 대응 필요**: 방송 중단 리스크 있음. 48시간 내 처리 권장.

**주의 현장 — CESCO**
방역 약품 재고 임계치 도달. 발주 진행 중.
→ 발주 도착 일정 확인 및 임시 재고 확보 검토.

**정상 현장 — 한국전력**
정기 안전점검 완료. 특이사항 없음.
→ 다음 점검: 3개월 후 예정.

**트렌드 분석**
최근 3개월간 MBC 장비 관련 이슈가 반복됨.
노후 장비 전체 점검 및 교체 계획 수립 권장.`,

  finance: `## 재무 분석 리포트 (2026년 상반기)

**상반기 실적 요약**
- 총 매출: 약 5.29억원
- 총 인건비: 약 1.98억원 (인건비율 37.4%)
- 평균 수익이율: 62%
- 현장당 평균 월 매출: 약 2,205만원

**현장별 수익성 분석**
| 현장 | 매출 비중 | 수익이율 |
|------|---------|--------|
| MBC | 38% | 64% |
| CESCO | 26% | 62% |
| 다이나맥 | 26% | 57% |
| 한국전력 | 10% | 63% |

**개선 포인트**
- 다이나맥 인건비 비율이 상대적으로 높음 (43%)
- 설비 투자 대비 단가 재검토 권장

**성장 기회**
MBC·CESCO 추가 계약 확장 시 수익이율 유지 가능. 한국전력 계약 규모 확대 검토.`,

  worklog: `## 업무일지 분석 리포트 (2026년 6월)

**업무 패턴 분석**
- 이번달 총 일지: 18건
- 현장당 평균 방문: 4.5회/월
- 주요 업무 유형: 점검(52%), 조치(28%), 보고서(20%)

**현장별 업무 밀도**
- MBC: 고밀도 (장비 이슈로 추가 방문 발생)
- CESCO: 정상 (정기 방역 사이클 준수)
- 다이나맥: 중간 (설비 이슈로 일시적 증가)
- 한국전력: 저밀도 (정기점검 위주)

**최적화 제안**
1. MBC·다이나맥 방문 동선 묶기 → 이동 시간 30% 절감 가능
2. CESCO 방역 점검 주기를 격주로 조정 검토
3. AI 요약 미생성 일지 5건 → 일괄 처리 권장

**다음 달 예측**
현재 추세 기준, 7월 예상 업무일지: 약 20건. MBC 장비 교체 후 이슈 건수 감소 예상.`,
}

export default function AIPortfolio() {
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState('')

  const generate = async (type) => {
    setSelected(type)
    setLoading(true)
    setReport('')
    await new Promise((r) => setTimeout(r, 2000))
    setReport(MOCK_REPORTS[type] || '')
    setLoading(false)
  }

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="AI 포트폴리오" />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-navy-800 rounded-2xl p-5 text-white flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Claude AI 자동 리포트</h2>
            <p className="text-sm text-slate-300 mt-1">
              업무일지·이슈·재무 데이터를 기반으로 AI가 자동 분석 리포트를 생성합니다.
            </p>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REPORT_TYPES.map((rt) => (
            <button
              key={rt.id}
              onClick={() => generate(rt.id)}
              className={`bg-white rounded-2xl p-4 text-left shadow-sm border transition-all hover:shadow-md ${
                selected === rt.id ? 'border-teal-400 ring-1 ring-teal-400' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{rt.icon}</span>
                <div>
                  <p className="font-semibold text-navy-800 text-sm">{rt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{rt.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Report Output */}
        {(loading || report) && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-teal-600" />
                <span className="font-semibold text-navy-800 text-sm">
                  {REPORT_TYPES.find((r) => r.id === selected)?.label}
                </span>
              </div>
              {!loading && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generate(selected)}
                    className="text-xs text-slate-500 flex items-center gap-1 hover:text-teal-600 transition-colors"
                  >
                    <RefreshCw size={12} /> 재생성
                  </button>
                </div>
              )}
            </div>
            <div className="p-5">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`h-3 bg-slate-100 rounded ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
                  ))}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  {report.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-navy-800 mb-3 mt-1">{line.slice(3)}</h2>
                    if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-navy-800 mt-3 mb-1">{line.slice(2, -2)}</p>
                    if (line.startsWith('- ')) return <li key={i} className="text-sm text-slate-700 ml-4">{line.slice(2)}</li>
                    if (line.match(/^\d+\. /)) return <li key={i} className="text-sm text-slate-700 ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>
                    if (line.startsWith('→')) return <p key={i} className="text-xs text-teal-700 bg-teal-50 rounded px-3 py-1.5 my-1">{line}</p>
                    if (line.startsWith('|')) return <p key={i} className="text-xs text-slate-600 font-mono">{line}</p>
                    if (!line.trim()) return <br key={i} />
                    return <p key={i} className="text-sm text-slate-700 leading-relaxed">{line}</p>
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
