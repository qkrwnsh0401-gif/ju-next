import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useApp } from '../lib/AppContext'

const REPORT_TYPES = [
  { id: 'summary', label: '전체 현황 요약', icon: '📊', desc: '모든 현장의 이슈·재무·업무 종합 분석' },
  { id: 'issue', label: '이슈 분석 리포트', icon: '⚠️', desc: '현장별 이슈 현황 및 우선순위 분석' },
  { id: 'finance', label: '재무 분석 리포트', icon: '💰', desc: '매출·인건비·수익이율 트렌드 분석' },
  { id: 'worklog', label: '업무일지 분석', icon: '📋', desc: '업무 패턴 및 현장 방문 최적화 제안' },
]

const fmt = (n) => (n / 10000).toLocaleString('ko-KR') + '만원'
const fmtB = (n) => (n / 100000000).toFixed(2) + '억원'

function generateReport(type, { sites, issues, financials, workLogs }) {
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })

  const openIssues = issues.filter(i => i.status !== 'done')
  const highIssues = openIssues.filter(i => i.severity === 'high')
  const doneIssues = issues.filter(i => i.status === 'done')

  const totalRevenue = financials.reduce((s, f) => s + f.revenue, 0)
  const totalLabor = financials.reduce((s, f) => s + f.labor_cost, 0)
  const totalProfit = totalRevenue - totalLabor
  const profitRate = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0

  const months = [...new Set(financials.map(f => f.year_month))].sort()
  const latestMonth = months[months.length - 1] || ''
  const prevMonth = months[months.length - 2] || ''
  const latestRevenue = financials.filter(f => f.year_month === latestMonth).reduce((s, f) => s + f.revenue, 0)
  const prevRevenue = financials.filter(f => f.year_month === prevMonth).reduce((s, f) => s + f.revenue, 0)
  const revGrowth = prevRevenue > 0 ? Math.round(((latestRevenue - prevRevenue) / prevRevenue) * 100) : 0

  const siteSummary = sites.map(site => {
    const siteIssues = openIssues.filter(i => i.site_id === site.id)
    const siteRev = financials.filter(f => f.site_id === site.id && f.year_month === latestMonth).reduce((s, f) => s + f.revenue, 0)
    const totalSiteRev = financials.filter(f => f.site_id === site.id).reduce((s, f) => s + f.revenue, 0)
    const totalSiteLabor = financials.filter(f => f.site_id === site.id).reduce((s, f) => s + f.labor_cost, 0)
    const siteRate = totalSiteRev > 0 ? Math.round(((totalSiteRev - totalSiteLabor) / totalSiteRev) * 100) : 0
    return { site, siteIssues, siteRev, totalSiteRev, siteRate }
  })

  const thisMonthLogs = workLogs.filter(l => l.log_date?.startsWith(latestMonth))

  if (type === 'summary') {
    const urgentSite = siteSummary.find(s => s.siteIssues.some(i => i.severity === 'high'))
    const topRevSite = [...siteSummary].sort((a, b) => b.siteRev - a.siteRev)[0]
    return `## 전체 현황 요약 리포트 (${today})

**핵심 지표**
- 총 관리 현장: ${sites.length}개소 (${sites.map(s => s.name).join(', ')})
- 이번달(${latestMonth}) 총 매출: ${fmt(latestRevenue)} (${revGrowth >= 0 ? '+' : ''}${revGrowth}% 전월 대비)
- 미처리 이슈: ${openIssues.length}건 (긴급 ${highIssues.length}건, 처리중 ${openIssues.filter(i => i.status === 'in_progress').length}건)
- 이번달 업무일지: ${thisMonthLogs.length}건 / 전체 ${workLogs.length}건

**현장별 현황**
${siteSummary.map(({ site, siteIssues, siteRev }) =>
  `- **${site.name}**: ${siteIssues.length > 0 ? `미처리 이슈 ${siteIssues.length}건${siteIssues.some(i => i.severity === 'high') ? ' (긴급)' : ''}` : '이슈 없음'}. ${siteRev > 0 ? `이번달 매출 ${fmt(siteRev)}` : '이번달 재무 미등록'}`
).join('\n')}

**추천 액션**
${urgentSite ? `1. ${urgentSite.site.name} 긴급 이슈 즉시 처리 필요` : '1. 긴급 이슈 없음 — 정기 점검 유지'}
${topRevSite ? `2. 이번달 최고 매출 현장: ${topRevSite.site.name} (${fmt(topRevSite.siteRev)}) — 계약 유지 및 확대 검토` : '2. 재무 데이터를 등록하여 분석을 시작하세요'}
3. 총 수익이율 ${profitRate}% — ${profitRate >= 60 ? '양호한 수준 유지 중' : '개선 여지 있음, 인건비 구조 검토 권장'}`
  }

  if (type === 'issue') {
    const urgentIssues = issues.filter(i => i.severity === 'high' && i.status !== 'done')
    const inProgressIssues = issues.filter(i => i.status === 'in_progress')
    return `## 이슈 분석 리포트 (${today})

**이슈 요약**
- 전체 이슈: ${issues.length}건
- 발생: ${issues.filter(i => i.status === 'open').length}건 / 처리중: ${inProgressIssues.length}건 / 완료: ${doneIssues.length}건
- 긴급(High): ${urgentIssues.length}건

${urgentIssues.length > 0 ? `**긴급 처리 필요**
${urgentIssues.map(i => {
  const site = sites.find(s => s.id === i.site_id)
  return `→ [${site?.name || '기타'}] ${i.title}${i.detail ? `\n   ${i.detail}` : ''}`
}).join('\n')}

` : '**긴급 이슈 없음** — 현재 모든 현장 정상 운영 중\n\n'}${inProgressIssues.length > 0 ? `**처리중 이슈**
${inProgressIssues.map(i => {
  const site = sites.find(s => s.id === i.site_id)
  return `→ [${site?.name || '기타'}] ${i.title}`
}).join('\n')}

` : ''}**현장별 이슈 현황**
${siteSummary.map(({ site, siteIssues }) => {
  const allSiteIssues = issues.filter(i => i.site_id === site.id)
  return `- ${site.name}: 미처리 ${siteIssues.length}건 / 전체 ${allSiteIssues.length}건`
}).join('\n')}

**추천 액션**
${urgentIssues.length > 0 ? `1. 긴급 이슈 ${urgentIssues.length}건 즉각 처리 일정 확정` : '1. 현재 긴급 이슈 없음 — 예방 점검 유지'}
2. 처리중 이슈 ${inProgressIssues.length}건 조기 완료 추진
3. 완료된 이슈 ${doneIssues.length}건 — 재발 방지 조치 확인`
  }

  if (type === 'finance') {
    const topSite = [...siteSummary].sort((a, b) => b.siteRate - a.siteRate)[0]
    const bottomSite = [...siteSummary].filter(s => s.totalSiteRev > 0).sort((a, b) => a.siteRate - b.siteRate)[0]
    return `## 재무 분석 리포트 (${today})

**전체 재무 요약**
- 누적 총 매출: ${fmtB(totalRevenue)}
- 누적 총 인건비: ${fmtB(totalLabor)} (인건비율 ${totalRevenue > 0 ? Math.round((totalLabor / totalRevenue) * 100) : 0}%)
- 평균 수익이율: ${profitRate}%
- 분석 기간: ${months[0] || '-'} ~ ${latestMonth || '-'} (${months.length}개월)

**이번달(${latestMonth}) 실적**
- 이번달 총 매출: ${fmt(latestRevenue)}
- 전월 대비: ${revGrowth >= 0 ? '+' : ''}${revGrowth}%

**현장별 수익성 분석**
${siteSummary.filter(s => s.totalSiteRev > 0).map(({ site, siteRate, totalSiteRev }) =>
  `- ${site.name}: 누적 매출 ${fmt(totalSiteRev)}, 수익이율 ${siteRate}%`
).join('\n')}
${siteSummary.filter(s => s.totalSiteRev === 0).length > 0 ? `- ${siteSummary.filter(s => s.totalSiteRev === 0).map(s => s.site.name).join(', ')}: 재무 데이터 미등록` : ''}

**추천 액션**
${topSite ? `1. 최고 수익이율 현장: ${topSite.site.name} (${topSite.siteRate}%) — 운영 모델 벤치마크 권장` : '1. 재무 데이터를 더 등록하면 분석이 가능합니다'}
${bottomSite && bottomSite.siteRate < 50 ? `2. 수익이율 개선 필요: ${bottomSite.site.name} (${bottomSite.siteRate}%) — 인건비 구조 검토` : '2. 전체 현장 수익이율 양호'}
3. ${revGrowth >= 0 ? `전월 대비 매출 ${revGrowth}% 성장 — 성장세 유지` : `전월 대비 매출 ${Math.abs(revGrowth)}% 감소 — 원인 분석 필요`}`
  }

  if (type === 'worklog') {
    const recentLogs = workLogs.slice(0, 5)
    const tagCounts = {}
    workLogs.forEach(l => (l.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))
    const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)
    return `## 업무일지 분석 리포트 (${today})

**업무 현황 요약**
- 전체 일지: ${workLogs.length}건
- 이번달(${latestMonth}) 작성: ${thisMonthLogs.length}건
- AI 요약 완료: ${workLogs.filter(l => l.ai_summary).length}건 / ${workLogs.length}건
${topTags.length > 0 ? `- 주요 태그: ${topTags.map(([t, c]) => `${t}(${c}건)`).join(', ')}` : ''}

**최근 업무 내역**
${recentLogs.length > 0 ? recentLogs.map(l => `→ [${l.log_date}] ${l.title}`).join('\n') : '→ 작성된 업무일지가 없습니다'}

**업무 패턴 분석**
${workLogs.length >= 10 ? `- 꾸준한 일지 작성 습관 유지 중 (${workLogs.length}건 누적)` : `- 일지 ${workLogs.length}건 작성됨 — 꾸준한 기록을 권장합니다`}
- AI 요약 미생성 ${workLogs.filter(l => !l.ai_summary).length}건 → AI 요약 버튼으로 내용 정리 권장

**추천 액션**
1. ${workLogs.filter(l => !l.ai_summary).length > 0 ? `AI 요약 미완료 일지 ${workLogs.filter(l => !l.ai_summary).length}건 일괄 처리` : 'AI 요약 완료 — 내용 아카이브 정리 권장'}
2. 월별 업무량 추이 확인 및 이슈 연계 기록 강화
3. 태그 활용으로 업무 분류 체계화 권장`
  }

  return '데이터를 불러올 수 없습니다.'
}

export default function AIPortfolio() {
  const appData = useApp()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState('')

  const generate = async (type) => {
    setSelected(type)
    setLoading(true)
    setReport('')
    await new Promise(r => setTimeout(r, 1200))
    setReport(generateReport(type, appData))
    setLoading(false)
  }

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="AI 포트폴리오" />
      <div className="p-4 sm:p-6 space-y-5">
        <div className="bg-navy-800 rounded-2xl p-5 text-white flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="font-bold text-base">Claude AI 자동 리포트</h2>
            <p className="text-xs text-slate-300 mt-1">
              실제 등록된 현장·이슈·재무·업무일지 데이터를 기반으로 AI가 자동 분석합니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REPORT_TYPES.map(rt => (
            <button key={rt.id} onClick={() => generate(rt.id)}
              className={`bg-white rounded-2xl p-4 text-left shadow-sm border transition-all hover:shadow-md active:scale-[0.98] ${
                selected === rt.id ? 'border-teal-400 ring-1 ring-teal-400' : 'border-slate-100'
              }`}>
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

        {(loading || report) && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-teal-600" />
                <span className="font-semibold text-navy-800 text-sm">
                  {REPORT_TYPES.find(r => r.id === selected)?.label}
                </span>
              </div>
              {!loading && (
                <button onClick={() => generate(selected)}
                  className="text-xs text-slate-500 flex items-center gap-1 hover:text-teal-600 transition-colors">
                  <RefreshCw size={12} /> 재생성
                </button>
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
                <div className="space-y-1">
                  {report.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-navy-800 mb-2 mt-1">{line.slice(3)}</h2>
                    if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-navy-800 mt-3 mb-1 text-sm">{line.slice(2, -2)}</p>
                    if (line.startsWith('- ')) return <li key={i} className="text-sm text-slate-700 ml-3 list-disc">{line.slice(2)}</li>
                    if (line.match(/^\d+\. /)) return <li key={i} className="text-sm text-slate-700 ml-3 list-decimal">{line.replace(/^\d+\. /, '')}</li>
                    if (line.startsWith('→')) return <p key={i} className="text-xs text-teal-700 bg-teal-50 rounded px-3 py-1.5 my-1">{line}</p>
                    if (!line.trim()) return <div key={i} className="h-2" />
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
