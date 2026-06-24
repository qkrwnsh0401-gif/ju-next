import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, BarChart2, BookOpen, MapPin, Building2 } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useApp } from '../lib/AppContext'
import { STATUS_COLOR, STATUS_LABEL, SEVERITY_LABEL } from '../lib/mockData'

const fmt = (n) => (n / 10000).toLocaleString('ko-KR') + '만원'

export default function SiteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sites, issues, financials, workLogs } = useApp()

  const site = sites.find(s => s.id === Number(id))
  if (!site) return <div className="p-6 text-slate-500">현장을 찾을 수 없습니다.</div>

  const siteIssues = issues.filter(i => i.site_id === site.id)
  const siteFinancials = financials.filter(f => f.site_id === site.id)
  const latestFin = siteFinancials.sort((a,b) => b.year_month.localeCompare(a.year_month))[0]
  const siteLogs = workLogs.filter(l => l.site_id === site.id)

  const totalRevenue = siteFinancials.reduce((s, f) => s + f.revenue, 0)
  const totalProfit = siteFinancials.reduce((s, f) => s + (f.revenue - f.labor_cost), 0)

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title={site.name} />
      <div className="p-6 space-y-5">
        {/* Back */}
        <button onClick={() => navigate('/sites')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-800 transition-colors">
          <ArrowLeft size={14} /> 현장 목록으로
        </button>

        {/* Site Info */}
        <div className="bg-navy-800 rounded-2xl p-5 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-teal-600 flex items-center justify-center text-2xl font-bold">
              {site.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{site.name}</h2>
              <p className="text-sm text-slate-300 flex items-center gap-1 mt-1"><Building2 size={12}/>{site.client_company}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={11}/>{site.location || '위치 미등록'}</p>
            </div>
          </div>
          {latestFin && (
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-navy-700">
              <div>
                <p className="text-xs text-slate-400">이번달 매출</p>
                <p className="text-sm font-bold mt-0.5">{fmt(latestFin.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">누적 매출</p>
                <p className="text-sm font-bold mt-0.5">{fmt(totalRevenue)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">누적 수익</p>
                <p className="text-sm font-bold mt-0.5 text-teal-400">{fmt(totalProfit)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Issues */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <AlertTriangle size={15} className="text-orange-500" />
            <h3 className="font-semibold text-navy-800">이슈 현황</h3>
            <span className="ml-auto text-xs text-slate-400">{siteIssues.length}건</span>
          </div>
          {siteIssues.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400 text-center">등록된 이슈가 없습니다</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {siteIssues.map(issue => (
                <div key={issue.id} className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[issue.status]}`}>
                      {STATUS_LABEL[issue.status]}
                    </span>
                    <span className="text-xs text-slate-400">{issue.created_at}</span>
                  </div>
                  <p className="text-sm font-medium text-navy-800 mb-1">{issue.title}</p>
                  {issue.detail && <p className="text-xs text-slate-500 leading-relaxed">{issue.detail}</p>}
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <AlertTriangle size={10}/>{SEVERITY_LABEL[issue.severity]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Work Logs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <BookOpen size={15} className="text-teal-600" />
            <h3 className="font-semibold text-navy-800">업무일지</h3>
            <span className="ml-auto text-xs text-slate-400">{siteLogs.length}건</span>
          </div>
          {siteLogs.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400 text-center">작성된 일지가 없습니다</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {siteLogs.map(log => (
                <div key={log.id} className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-navy-800">{log.title}</span>
                    <span className="text-xs text-slate-400 ml-auto">{log.log_date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{log.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Financials */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <BarChart2 size={15} className="text-blue-500" />
            <h3 className="font-semibold text-navy-800">월별 재무</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500">
                <th className="text-left px-5 py-2">년월</th>
                <th className="text-right px-4 py-2">매출</th>
                <th className="text-right px-4 py-2">인건비</th>
                <th className="text-right px-4 py-2">수익</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {siteFinancials.sort((a,b) => b.year_month.localeCompare(a.year_month)).map(f => (
                  <tr key={f.year_month} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-600">{f.year_month}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{fmt(f.revenue)}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{fmt(f.labor_cost)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-teal-600">{fmt(f.revenue - f.labor_cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
