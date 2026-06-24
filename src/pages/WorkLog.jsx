import { useState } from 'react'
import { Plus, X, Sparkles, Tag, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useApp } from '../lib/AppContext'

const emptyForm = () => ({ title: '', content: '', tags: '' })

export default function WorkLog() {
  const { workLogs, addWorkLog, updateWorkLog, deleteWorkLog } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [generating, setGenerating] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const openAdd = () => {
    setEditTarget(null)
    setForm(emptyForm())
    setShowModal(true)
  }

  const openEdit = (log) => {
    setEditTarget(log)
    setForm({
      title: log.title,
      content: log.content,
      tags: (log.tags || []).join(' '),
    })
    setShowModal(true)
    setExpandedId(null)
  }

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return
    const data = {
      title: form.title,
      content: form.content,
      tags: form.tags.split(' ').filter(Boolean),
    }
    if (editTarget) {
      updateWorkLog(editTarget.id, data)
    } else {
      addWorkLog({ ...data, ai_summary: '' })
    }
    setShowModal(false)
    setEditTarget(null)
    setForm(emptyForm())
  }

  const handleDelete = (id) => {
    deleteWorkLog(id)
    setDeleteConfirm(null)
    if (expandedId === id) setExpandedId(null)
  }

  const generateSummary = async (e, id) => {
    e.stopPropagation()
    setGenerating(id)
    await new Promise(r => setTimeout(r, 1800))
    const log = workLogs.find(l => l.id === id)
    updateWorkLog(id, { ai_summary: 'AI 요약: ' + (log?.content?.slice(0, 40) || '') + '… 후속 조치 검토 완료.' })
    setGenerating(null)
  }

  const thisMonth = workLogs.filter(l => l.log_date?.startsWith(new Date().toISOString().slice(0, 7))).length

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="업무일지" />
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '이번달', val: thisMonth },
            { label: '전체 일지', val: workLogs.length },
            { label: 'AI 요약', val: workLogs.filter(l => l.ai_summary).length },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
              <p className="text-2xl font-bold text-navy-800">{val}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy-800">일일 업무 보고</h2>
          <button onClick={openAdd}
            className="hidden md:flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors">
            <Plus size={14} /> 일지 작성
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {workLogs.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-sm shadow-sm border border-slate-100">
              작성된 업무일지가 없습니다
            </div>
          )}
          {workLogs.map(log => (
            <div key={log.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                className="px-5 py-4 flex items-start justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-navy-800 truncate">{log.title}</span>
                    <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{log.log_date}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{log.content}</p>
                  {log.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {log.tags.map(tag => (
                        <span key={tag} className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Tag size={9} />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); openEdit(log) }}
                    className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setDeleteConfirm(log.id) }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                  {expandedId === log.id
                    ? <ChevronUp size={14} className="text-slate-400 ml-1" />
                    : <ChevronDown size={14} className="text-slate-400 ml-1" />}
                </div>
              </div>

              {/* Detail */}
              {expandedId === log.id && (
                <div className="px-5 pb-4 pt-1 border-t border-slate-100 bg-slate-50 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1.5">업무 내용</p>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{log.content}</p>
                  </div>
                  {log.ai_summary ? (
                    <div className="bg-navy-50 border border-navy-100 rounded-lg px-3 py-2.5 flex items-start gap-2">
                      <Sparkles size={13} className="text-teal-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-navy-700 leading-relaxed">{log.ai_summary}</p>
                    </div>
                  ) : (
                    <button onClick={e => generateSummary(e, log.id)} disabled={generating === log.id}
                      className="flex items-center gap-1.5 text-xs text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50">
                      <Sparkles size={11} />
                      {generating === log.id ? 'AI 요약 생성중…' : 'AI 요약 생성'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAB */}
        <button onClick={openAdd}
          className="md:hidden fixed right-5 bottom-20 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-teal-700 z-40">
          <Plus size={20} />
        </button>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-navy-800">{editTarget ? '일지 수정' : '일지 작성'}</h3>
              <button onClick={() => { setShowModal(false); setEditTarget(null) }}>
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">제목 *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="예: 세스코 정기방역 점검"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">업무 내용 *</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="오늘 진행한 업무 내용을 자세히 입력하세요" rows={6}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">태그 (스페이스로 구분)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="예: 점검 장비 안전"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditTarget(null) }}
                className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50">취소</button>
              <button onClick={handleSave}
                className="flex-1 bg-teal-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-teal-700">
                {editTarget ? '수정 완료' : '작성'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="font-bold text-navy-800 mb-2">일지 삭제</h3>
            <p className="text-sm text-slate-500 mb-6">이 업무일지를 삭제하면 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50">취소</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-red-600">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
