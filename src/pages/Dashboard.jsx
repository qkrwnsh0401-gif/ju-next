import { useState } from 'react'
import { TrendingUp, ChevronRight, Sparkles } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { STATUS_COLOR, STATUS_LABEL } from '../lib/mockData'
import { useApp } from '../lib/AppContext'
import TopBar from '../components/TopBar'

const fmt = (n) => (n / 10000).toLocaleString('ko-KR') + '만원'

export default function Dashboard() {
  const navigate = useNavigate()
  const { sites, issues, financials, workLogs } = useApp()
  const [aiLoading, setAiLoading] = useState(false)
  const [aiText, setAiText] = useState('이번 달 전체 현장 매출이 전월 대비 상승 추세입니다. 문화방송 긴급 이슈 처리가 필요합니다.\n\n**추천 액션**\n- 문화방송 장비 교체 일정 즉시 확정\n- 세스코 약품 발주 상태 확인')

  const months = [...new Set(financials.map(f => f.year_month))].sort()
  const monthlyTotals = months.map(m => ({
    month: m.slice(5) + '월',
    revenue: financials.filter(f => f.year_month === m).reduce((s, f) => s + f.revenue, 0),
  }))

  const latestMonth = months[months.length - 1]
  const thisMonthRevenue = financials.filter(f => f.year_month === latestMonth).reduce((s, f) => s + f.revenue, 0)
  const openIssues = issues.filter(i => i.status !== 'done').length

  const handleAIRefresh = async () => {
    setAiLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setAiLoading(false)
    setAiText('세스코 현장 수익률이 가장 높습니다. 한국보건의료연구원 계약 규모 확대 검토를 권장합니다.\n\n**추천 액션**\n- 엠즈비어 신규 계약 검토\n- 좋은사람들 냉난방 설비 정기 교체 일정 확인')
  }

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="안녕하세요, 박주노님" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: '이번달 매출', value: fmt(thisMonthRevenue), sub: '+12.4%' },
            { label: '진행중 이슈', value: `${openIssues} 건` },
            { label: '이번달 업무일지', value: `${workLogs.length} 건` },
            { label: '누적 현장 수', value: `${sites.length} 개` },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-2xl font-bold text-navy-800 mt-1">{value}</p>
              {sub && <p className="text-xs text-teal-600 flex items-center gap-1 mt-1"><TrendingUp size={12}/>{sub}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
              <h2 className="font-semibold text-navy-800">현장별 현황</h2>
              <button onClick={() => navigate('/sites')} className="text-xs text-teal-600 flex items-center gap-1 hover:underline">
                전체보기 <ChevronRight size={12}/>
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {sites.slice(0, 6).map(site => {
                const siteIssues = issues.filter(i => i.site_id === site.id && i.status !== 'done')
                const badge = siteIssues.length > 0
                  ? siteIssues.some(i => i.severity === 'high')
                    ? { label: '긴급', cls: 'bg-red-100 text-red-600' }
                    : { label: '처리중', cls: 'bg-orange-100 text-orange-600' }
                  : { label: '정상', cls: 'bg-teal-100 text-teal-600' }
                const rev = financials
                  .filter(f => f.site_id === site.id && f.year_month === latestMonth)
                  .reduce((s, f) => s + f.revenue, 0)
                return (
                  <div key={site.id} onClick={() => navigate(`/sites/${site.id}`)}
                    className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
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
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.cls}`}>{badge.label}</span>
                      {rev > 0 && <span className="text-sm font-semibold text-navy-800">{fmt(rev)}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-navy-800 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-teal-400"/>
                <span className="text-sm font-semibold">Claude AI 인사이트</span>
              </div>
              <button onClick={handleAIRefresh} disabled={aiLoading} className="text-xs text-teal-400 hover:text-teal-300 disabled:opacity-50">
                {aiLoading ? '분석중…' : '새로고침'}
              </button>
            </div>
            {aiLoading
              ? <div className="space-y-2 animate-pulse">{[...Array(4)].map((_,i) => <div key={i} className="h-3 bg-navy-600 rounded"/>)}</div>
              : <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{aiText}</div>
            }
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-navy-800">최근 업무일지</h2>
              <button onClick={() => navigate('/worklog')} className="text-xs text-teal-600 hover:underline flex items-center gap-1">전체보기<ChevronRight size={12}/></button>
            </div>
            <div className="divide-y divide-slate-50">
              {workLogs.slice(0,4).map(log => (
                <div key={log.id} className="px-5 py-3 flex items-start gap-3">
                  <span className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">{log.log_date.slice(5)}</span>
                  <div>
                    <p className="text-xs font-semibold text-navy-800">{log.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{log.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-navy-800">월별 매출 추이</h2>
            </div>
            <div className="p-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTotals} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/10000000).toFixed(0)}천만`}/>
                  <Tooltip formatter={v => [fmt(v), '매출']} contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }}/>
                  <Bar dataKey="revenue" fill="#0D9488" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
