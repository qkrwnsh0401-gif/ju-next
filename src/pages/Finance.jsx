import { useState } from 'react'
import { TrendingUp, Plus, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import TopBar from '../components/TopBar'
import { useApp } from '../lib/AppContext'

const fmt = (n) => (n / 10000).toLocaleString('ko-KR') + '만'
const fmtW = (n) => (n / 100000000).toFixed(2) + '억'
const PIE_COLORS = ['#0D9488', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981']

export default function Finance() {
  const { sites, financials, addFinancial } = useApp()
  const [period, setPeriod] = useState('월간')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ site_id: '', year_month: new Date().toISOString().slice(0,7), revenue: '', labor_cost: '' })

  const months = [...new Set(financials.map(f => f.year_month))].sort()
  const monthlyTotals = months.map(m => ({
    month: m.slice(5) + '월',
    매출: financials.filter(f => f.year_month === m).reduce((s,f) => s + f.revenue, 0),
    인건비: financials.filter(f => f.year_month === m).reduce((s,f) => s + f.labor_cost, 0),
  }))

  const totalRevenue = financials.reduce((s,f) => s + f.revenue, 0)
  const totalLabor = financials.reduce((s,f) => s + f.labor_cost, 0)
  const totalProfit = totalRevenue - totalLabor
  const profitRate = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0

  const siteSummary = sites.map(site => {
    const rows = financials.filter(f => f.site_id === site.id)
    const rev = rows.reduce((s,f) => s + f.revenue, 0)
    const labor = rows.reduce((s,f) => s + f.labor_cost, 0)
    return { name: site.name, rev, labor, profit: rev - labor, rate: rev > 0 ? Math.round(((rev-labor)/rev)*100) : 0 }
  }).filter(s => s.rev > 0)

  const pieData = siteSummary.map(s => ({ name: s.name, value: s.rev }))

  const handleAdd = () => {
    if (!form.site_id || !form.year_month || !form.revenue || !form.labor_cost) return
    addFinancial({
      site_id: Number(form.site_id),
      year_month: form.year_month,
      revenue: Number(form.revenue) * 10000,
      labor_cost: Number(form.labor_cost) * 10000,
    })
    setShowModal(false)
    setForm({ site_id: '', year_month: new Date().toISOString().slice(0,7), revenue: '', labor_cost: '' })
  }

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="재무 분석" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {['월간', '분기', '연간'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-navy-300'}`}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors">
            <Plus size={14}/> 재무 등록
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: '총 매출', val: fmtW(totalRevenue), trend: '' },
            { label: '총 인건비', val: fmtW(totalLabor), trend: '' },
            { label: '수익이율', val: `${profitRate}%`, trend: '' },
            { label: '총 수익', val: fmtW(totalProfit), trend: '' },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-2xl font-bold text-navy-800 mt-1">{val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-navy-800">월별 매출·인건비 추이</h2>
            </div>
            <div className="p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTotals}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/10000000).toFixed(0)}천만`}/>
                  <Tooltip formatter={(v,n) => [fmt(v), n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }}/>
                  <Line type="monotone" dataKey="매출" stroke="#0D9488" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="인건비" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-navy-800">현장별 매출 비중</h2>
            </div>
            <div className="p-4 h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }}/>
                  <Tooltip formatter={v => [fmt(v), '매출']} contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

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
                  <th className="text-right px-4 py-3">수익</th>
                  <th className="text-right px-4 py-3">수익이율</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {siteSummary.map(s => (
                  <tr key={s.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-navy-800">{s.name}</td>
                    <td className="px-4 py-3.5 text-right text-slate-600">{fmt(s.rev)}</td>
                    <td className="px-4 py-3.5 text-right text-slate-500">{fmt(s.labor)}</td>
                    <td className="px-4 py-3.5 text-right text-slate-600">{fmt(s.profit)}</td>
                    <td className="px-4 py-3.5 text-right"><span className="font-semibold text-teal-600">{s.rate}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-navy-800">재무 데이터 등록</h3>
              <button onClick={() => setShowModal(false)}><X size={18} className="text-slate-400"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">현장 *</label>
                <select value={form.site_id} onChange={e => setForm({...form, site_id: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                  <option value="">현장 선택</option>
                  {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">년월 *</label>
                <input type="month" value={form.year_month} onChange={e => setForm({...form, year_month: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"/>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">매출액 (만원 단위) *</label>
                <input type="number" value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})}
                  placeholder="예: 3820 (3,820만원)"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"/>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">인건비 (만원 단위) *</label>
                <input type="number" value={form.labor_cost} onChange={e => setForm({...form, labor_cost: e.target.value})}
                  placeholder="예: 1362 (1,362만원)"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"/>
              </div>
              {form.revenue && form.labor_cost && (
                <div className="bg-teal-50 rounded-lg px-4 py-3 text-sm">
                  <span className="text-slate-600">예상 수익: </span>
                  <span className="font-bold text-teal-600">{fmt((Number(form.revenue) - Number(form.labor_cost)) * 10000)}</span>
                  <span className="text-slate-500 ml-2">
                    (수익률 {form.revenue > 0 ? Math.round(((Number(form.revenue) - Number(form.labor_cost)) / Number(form.revenue)) * 100) : 0}%)
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50">취소</button>
              <button onClick={handleAdd} className="flex-1 bg-teal-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-teal-700">등록</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
