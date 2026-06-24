import { useState } from 'react'
import { Plus, X, Sparkles, Tag } from 'lucide-react'
import TopBar from '../components/TopBar'
import { WORK_LOGS as INIT_LOGS, SITES, SITE_NAME_BY_ID } from '../lib/mockData'

export default function WorkLog() {
  const [logs, setLogs] = useState(INIT_LOGS)
  const [showModal, setShowModal] = useState(false)
  const [generating, setGenerating] = useState(null)
  const [form, setForm] = useState({ site_id: 1, content: '', tags: '' })

  const addLog = () => {
    if (!form.content.trim()) return
    const newLog = {
      id: Date.now(),
      log_date: new Date().toISOString().slice(0, 10),
      site_id: Number(form.site_id),
      content: form.content,
      tags: form.tags.split(' ').filter(Boolean),
      ai_summary: '',
    }
    setLogs([newLog, ...logs])
    setShowModal(false)
    setForm({ site_id: 1, content: '', tags: '' })
  }

  const generateSummary = async (id) => {
    setGenerating(id)
    await new Promise((r) => setTimeout(r, 1800))
    setLogs(logs.map((l) =>
      l.id === id
        ? { ...l, ai_summary: 'AI 요약: ' + l.content.slice(0, 30) + '… 후속 조치 필요 여부 검토 완료.' }
        : l
    ))
    setGenerating(null)
  }

  const thisMonth = logs.filter((l) => l.log_date.startsWith('2026-06')).length
  const sites = new Set(logs.map((l) => l.site_id)).size
  const doneRate = Math.round((logs.filter((l) => l.ai_summary).length / logs.length) * 100)

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="업무일지" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '이번달', val: thisMonth },
            { label: '방문 현장', val: sites },
            { label: '완료율', val: `${doneRate}%` },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
              <p className="text-2xl font-bold text-navy-800">{val}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Log List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-navy-800">최근 작성한 일지</h2>
            <button
              onClick={() => setShowModal(true)}
              className="hidden md:flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus size={14} /> 일지 작성
            </button>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-navy-800 text-sm flex-shrink-0">
                      {SITE_NAME_BY_ID[log.site_id]?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {SITE_NAME_BY_ID[log.site_id]}
                        </span>
                        <span className="text-xs text-slate-400">{log.log_date}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{log.content}</p>
                      {log.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {log.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Tag size={9} /> {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {log.ai_summary && (
                        <div className="mt-2 bg-navy-50 border border-navy-100 rounded-lg px-3 py-2 text-xs text-navy-700 flex items-start gap-2">
                          <Sparkles size={12} className="text-teal-600 flex-shrink-0 mt-0.5" />
                          {log.ai_summary}
                        </div>
                      )}
                    </div>
                  </div>
                  {!log.ai_summary && (
                    <button
                      onClick={() => generateSummary(log.id)}
                      disabled={generating === log.id}
                      className="flex-shrink-0 text-xs text-teal-600 border border-teal-200 px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <Sparkles size={10} />
                      {generating === log.id ? '생성중…' : 'AI 요약'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
              <h3 className="font-bold text-navy-800">업무일지 작성</h3>
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
                <label className="text-xs font-medium text-slate-600 block mb-1.5">업무 내용</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="오늘 진행한 업무 내용을 입력하세요"
                  rows={4}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">태그 (스페이스로 구분)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="점검 장비 안전"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">취소</button>
              <button onClick={addLog} className="flex-1 bg-teal-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-teal-700 transition-colors">작성</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
