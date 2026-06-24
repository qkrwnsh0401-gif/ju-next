import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import TopBar from '../components/TopBar'
import { FINANCIALS, MONTHLY_TOTALS, SITES, SITE_NAME_BY_ID, SITE_COLORS } from '../lib/mockData'

const fmt = (n) => (n / 10000).toLocaleString('ko-KR') + '만'
const fmtW = (n) => (n / 100000000).toFixed(2) + '억'

const PIE_COLORS = ['#0D9488', '#3B82F6', '#8B5CF6', '#F59E0B']

export default function Finance() {
  const [period, setPeriod] = useState('월간')

  const totalRevenue = FINANCIALS.reduce((s, f) => s + f.revenue, 0)
  const totalLabor = FINANCIALS.reduce((s, f) => s + f.labor_cost, 0)
  const totalProfit = FINANCIALS.reduce((s, f) => s + f.profit, 0)
  const profitRate = Math.round((totalProfit / totalRevenue) * 100)

  const siteSummary = SITES.map((site) => {
    const rows = FINANCIALS.filter((f) => f.site_id === site.id)
    const rev = rows.reduce((s, f) => s + f.revenue, 0)
    const labor = rows.reduce((s, f) => s + f.labor_cost, 0)
    const profit = rows.reduce((s, f) => s + f.profit, 0)
    return { name: site.name, rev, labor, profit, rate: Math.round((profit / rev) * 100) }
  })

  const pieData = siteSummary.map((s) => ({ name: s.name, value: s.rev }))

  const chartData = MONTHLY_TOTALS.map((m) => ({
    month: m.month,
    매출: m.revenue,
    인건비: m.labor_cost,
    수익: m.revenue - m.labor_cost,
  }))

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="재무 분석" />
      <div className="p-6 space-y-6">
        {/* Period toggle */}
        <div className="flex gap-2">
          {['월간', '분기', '연간'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-navy-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: '총 매출', val: fmtW(totalRevenue), trend: '+9.8%' },
            { label: '총 인건비', val: fmtW(totalLabor), trend: '+4.2%' },
            { label: '수익이율', val: `${profitRate}%`, trend: '+3.1%p' },
            { label: '평균 현장 단가', val: fmt(Math.round(totalRevenue / SITES.length / 6)), trend: '+1.6%' },
          ].map(({ label, val, trend }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-2xl font-bold text-navy-800 mt-1">{val}</p>
              <p className="text-xs text-teal-600 flex items-center gap-1 mt-1">
                <TrendingUp size={12} /> {trend}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-navy-800">월별 매출·인건비 추이</h2>
            </div>
            <div className="p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/10000000).toFixed(0)}천만`} />
                  <Tooltip formatter={(v, n) => [fmt(v), n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }} />
                  <Line type="monotone" dataKey="매출" stroke="#0D9488" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="인건비" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-navy-800">현장별 매출 비중</h2>
            </div>
            <div className="p-4 h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [fmt(v), '매출']} contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Site Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-navy-800">현장별 재무 상세</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 font-medium">
                  <th className="text-left px-5 py-3">현장</th>
                  <th className="text-right px-4 py-3">매출</th>
                  <th className="text-right px-4 py-3">인건비</th>
                  <th className="text-right px-4 py-3">수익이율</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {siteSummary.map((s) => (
                  <tr key={s.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-navy-800">{s.name}</td>
                    <td className="px-4 py-3.5 text-right text-slate-600">{fmt(s.rev)}</td>
                    <td className="px-4 py-3.5 text-right text-slate-600">{fmt(s.labor)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-semibold text-teal-600">{s.rate}%</span>
                    </td>
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
