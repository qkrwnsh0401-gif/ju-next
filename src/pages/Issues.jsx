import { useState } from 'react'
import { Plus, X, AlertTriangle } from 'lucide-react'
import TopBar from '../components/TopBar'
import {
  ISSUES as INIT_ISSUES, SITES, SITE_NAME_BY_ID,
  STATUS_COLOR, STATUS_LABEL, SEVERITY_LABEL,
} from '../lib/mockData'

const FILTER_TABS = ['전체', '발생', '처리중', '완료']
const STATUS_MAP = { '발생': 'open', '처리중': 'in_progress', '완료': 'done' }

export default function Issues() {
  const [issues, setIssues] = useState(INIT_ISSUES)
  const [filter, setFilter] = useState('전체')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ site_id: 1, title: '', severity: 'medium', status: 'open' })

  const filtered = filter === '전체' ? issues : issues.filter((i) => i.status === STATUS_MAP[filter])

  const addIssue = () => {
    if (!form.title.trim()) return
    setIssues([
      { id: Date.now(), ...form, site_id: Number(form.site_id), created_at: new Date().toISOString().slice(0, 10) },
      ...issues,
    ])
    setShowModal(false)
    setForm({ site_id: 1, title: '', severity: 'medium', status: 'open' })
  }

  const cycleStatus = (id) => {
    const cycle = { open: 'in_progress', in_progress: 'done', done: 'open' }
    setIssues(issues.map((i) => (i.id === id ? { ...i, status: cycle[i.status] } : i)))
  }

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="현장 이슈 관리" />
      <div className="p-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '발생', count: issues.filter((i) => i.status === 'open').length, cls: 'text-red-500' },
            { label: '처리중', count: issues.filter((i) => i.status === 'in_progress').length, cls: 'text-orange-500' },
            { label: '완료', count: issues.filter((i) => i.status === 'done').length, cls: 'text-teal-600' },
          ].map(({ label, count, cls }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
              <p className={`text-2xl font-bold ${cls}`}>{count}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter + Add */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {FILTER_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === t ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-navy-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={14} /> 이슈 등록
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-sm shadow-sm border border-slate-100">
              해당 상태의 이슈가 없습니다
            </div>
          )}
          {filtered.map((issue) => (
            <div key={issue.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-navy-800 text-sm flex-shrink-0">
                  {SITE_NAME_BY_ID[issue.site_id]?.[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-navy-800">{SITE_NAME_BY_ID[issue.site_id]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[issue.status]}`}>
                      {STATUS_LABEL[issue.status]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{issue.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <AlertTriangle size={10} />
                      {SEVERITY_LABEL[issue.severity]}
                    </span>
                    <span className="text-xs text-slate-400">{issue.created_at}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => cycleStatus(issue.id)}
                className="text-xs text-slate-400 hover:text-teal-600 transition-colors whitespace-nowrap ml-2"
              >
                상태변경
              </button>
            </div>
          ))}
        </div>

        {/* Mobile FAB */}
        <button
          onClick={() => setShowModal(true)}
          className="md:hidden fixed right-5 bottom-20 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-teal-700 transition-colors z-40"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-navy-800">이슈 등록</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">현장</label>
                <select
                  value={form.site_id}
                  onChange={(e) => setForm({ ...form, site_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
                >
                  {SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">이슈 내용</label>
                <textarea
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="발생한 이슈를 입력하세요"
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">심각도</label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="high">긴급</option>
                    <option value="medium">중간</option>
                    <option value="low">낮음</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">상태</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="open">발생</option>
                    <option value="in_progress">처리중</option>
                    <option value="done">완료</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={addIssue}
                className="flex-1 bg-teal-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-teal-700 transition-colors"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
