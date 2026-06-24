import { useState } from 'react'
import { TrendingUp, TrendingDown, AlertCircle, BookOpen, CheckCircle, Sparkles, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { SITES, ISSUES, WORK_LOGS, MONTHLY_TOTALS, SITE_NAME_BY_ID, STATUS_COLOR, STATUS_LABEL, SEVERITY_LABEL } from '../lib/mockData'
import TopBar from '../components/TopBar'

const fmt = (n) => (n / 10000).toLocaleString('ko-KR') + '만원'

const KPI = ({ label, value, sub, trend, color = 'teal' }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold text-navy-800`}>{value}</p>
    {sub && (
      <p className={`text-xs mt-1 flex items-center gap-1 ${trend === 'up' ? 'text-teal-600' : 'text-red-400'}`}>
        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {sub}
      </p>
    )}
  </div>
)

const chartFmt = (v) => `${(v / 10000000).toFixed(0)}천만`

export default function Dashboard() {
  const [aiLoading, setAiLoading] = useState(false)
  const [aiText, setAiText] = useState(
    '이번 달 매출성장이 12.4% 증가했습니다. CESCO 현장의 인건비 비율이 38%로 다소 높게 집계되고 있습니다.\n\n**추천 액션**\n• CESCO 인건비 항목 재검토\n• 한국전력 신규 이슈 해결'
  )

  const openIssues = ISSUES.filter((i) => i.status !== 'done').length
  const thisMonthRevenue = MONTHLY_TOTALS[MONTHLY_TOTALS.length - 1].revenue
  const pendingLogs = WORK_LOGS.filter((l) => !l.ai_summary).length

  const handleAIRefresh = async () => {
    setAiLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setAiLoading(false)
    setAiText(
      'CESCO 현장 매출이 전월 대비 5.2% 증가했습니다. MBC 장비 이슈가 긴급 처리 대상이며, 한국전력 정기점검은 정상 완료되었습니다.\n\n**추천 액션**\n• MBC 부품 교체 일정 확정\n• 다이나맥 컨베이어 정기 교체 검토'
    )
  }

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="안녕하세요, 박주노님" />
      <div className="p-6 space-y-6">
        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI label="이번달 매출" value={fmt(thisMonthRevenue)} sub="+12.4%" trend="up" />
          <KPI label="진행중 이슈" value={`${openIssues} 건`} sub="-2건" trend="up" />
          <KPI label="이번달 업무일지" value={`${WORK_LOGS.length} 건`} sub="+3건" trend="up" />
          <KPI label="누적 현장 수" value={`${SITES.length} 개`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sites */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
              <h2 className="font-semibold text-navy-800">현장별 현황</h2>
              <button className="text-xs text-teal-600 flex items-center gap-1 hover:underline">
                전체보기 <ChevronRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {SITES.map((site) => {
                const siteIssues = ISSUES.filter((i) => i.site_id === site.id && i.status !== 'done')
                const statusBadge = siteIssues.length > 0
                  ? siteIssues.some((i) => i.severity === 'high')
                    ? { label: '긴급', cls: 'bg-red-100 text-red-600' }
                    : { label: '처리중', cls: 'bg-orange-100 text-orange-600' }
                  : { label: '정상', cls: 'bg-teal-100 text-teal-600' }

                const revenue = MONTHLY_TOTALS[MONTHLY_TOTALS.length - 1].revenue / SITES.length

                return (
                  <div key={site.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-navy-100 flex items-center justify-center font-bold text-navy-800 text-sm">
                        {site.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-navy-800 text-sm">{site.name}</p>
                        <p className="text-xs text-slate-400">{site.client_company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge.cls}`}>
                        {statusBadge.label}
                      </span>
                      <span className="text-sm font-semibold text-navy-800">{fmt(Math.round(revenue))}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-navy-800 rounded-2xl shadow-sm p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-teal-400" />
                <span className="text-sm font-semibold">Claude AI 인사이트</span>
              </div>
              <button
                onClick={handleAIRefresh}
                disabled={aiLoading}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors disabled:opacity-50"
              >
                {aiLoading ? '분석중…' : '새로고침'}
              </button>
            </div>
            {aiLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 bg-navy-600 rounded w-full" />
                <div className="h-3 bg-navy-600 rounded w-4/5" />
                <div className="h-3 bg-navy-600 rounded w-3/5" />
              </div>
            ) : (
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{aiText}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Work Logs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-navy-800">최근 업무일지</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {WORK_LOGS.slice(0, 4).map((log) => (
                <div key={log.id} className="px-5 py-3 flex items-start gap-3">
                  <span className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">
                    {log.log_date.slice(5)}
                  </span>
                  <div>
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded mr-2">
                      {SITE_NAME_BY_ID[log.site_id]}
                    </span>
                    <span className="text-xs text-slate-600">{log.content}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-navy-800">6개월 매출 추이</h2>
            </div>
            <div className="p-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_TOTALS} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={chartFmt} />
                  <Tooltip
                    formatter={(v) => [fmt(v), '매출']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }}
                  />
                  <Bar dataKey="revenue" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
