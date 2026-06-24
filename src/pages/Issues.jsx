import { useState } from 'react'
import { Plus, X, AlertTriangle, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useApp } from '../lib/AppContext'
import { STATUS_COLOR, STATUS_LABEL, SEVERITY_LABEL } from '../lib/mockData'

const FILTER_TABS = ['전체', '발생', '처리중', '완료']
const STATUS_MAP = { '발생': 'open', '처리중': 'in_progress', '완료': 'done' }

const emptyForm = () => ({ site_id: '', title: '', detail: '', severity: 'medium', status: 'open' })

export default function Issues() {
  const { sites, issues, addIssue, updateIssue, deleteIssue } = useApp()
  const [filter, setFilter] = useState('전체')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const filtered = filter === '전체' ? issues : issues.filter(i => i.status === STATUS_MAP[filter])

  // site_id가 0 또는 'other'이면 "기타"로 표시
  const getSiteName = (id) => {
    if (!id || id === 0 || id === 'other') return '기타'
    return sites.find(s => s.id === Number(id))?.name || '기타'
  }

  const openAdd = () => {
    setEditTarget(null)
    setForm(emptyForm())
    setShowModal(true)
  }

  const openEdit = (issue) => {
    setEditTarget(issue)
    setForm({
      site_id: issue.site_id === 0 ? 'other' : String(issue.site_id),
      title: issue.title,
      detail: issue.detail || '',
      severity: issue.severity,
      status: issue.status,
    })
    setShowModal(true)
    setExpandedId(null)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    const data = {
      ...form,
      site_id: form.site_id === 'other' || form.site_id === '' ? 0 : Number(form.site_id),
    }
    if (editTarget) {
      updateIssue(editTarget.id, data)
    } else {
      addIssue(data)
    }
    setShowModal(false)
    setEditTarget(null)
    setForm(emptyForm())
  }

  const handleDelete = (id) => {
    deleteIssue(id)
    setDeleteConfirm(null)
    if (expandedId === id) setExpandedId(null)
  }

  const cycleStatus = (e, id, current) => {
    e.stopPropagation()
    const cycle = { open: 'in_progress', in_progress: 'done', done: 'open' }
    updateIssue(id, { status: cycle[current] })
  }

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="현장 이슈 관리" />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '발생', count: issues.filter(i => i.status === 'open').length, cls: 'text-red-500' },
            { label: '처리중', count: issues.filter(i => i.status === 'in_progress').length, cls: 'text-orange-500' },
            { label: '완료', count: issues.filter(i => i.status === 'done').length, cls: 'text-teal-600' },
          ].map(({ label, count, cls }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
              <p className={`text-2xl font-bold ${cls}`}>{count}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter + Add */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            {FILTER_TABS.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === t ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-navy-300'}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={openAdd}
            className="hidden md:flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors">
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
          {filtered.map(issue => (
            <div key={issue.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Header row */}
              <div
                onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                className="px-5 py-4 flex items-start justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-navy-800 text-sm flex-shrink-0">
                    {getSiteName(issue.site_id)[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-navy-800">{getSiteName(issue.site_id)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[issue.status]}`}>
                        {STATUS_LABEL[issue.status]}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{issue.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <AlertTriangle size={10} />{SEVERITY_LABEL[issue.severity]}
                      </span>
                      <span className="text-xs text-slate-400">{issue.created_at}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); openEdit(issue) }}
                    className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setDeleteConfirm(issue.id) }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                  <button onClick={e => cycleStatus(e, issue.id, issue.status)}
                    className="text-xs text-teal-600 border border-teal-200 px-2 py-1 rounded-lg hover:bg-teal-50 transition-colors whitespace-nowrap ml-1">
                    상태변경
                  </button>
                  {expandedId === issue.id
                    ? <ChevronUp size={14} className="text-slate-400 ml-1" />
                    : <ChevronDown size={14} className="text-slate-400 ml-1" />}
                </div>
              </div>

              {/* Detail */}
              {expandedId === issue.id && (
                <div className="px-5 pb-4 pt-1 border-t border-slate-100 bg-slate-50">
                  <p className="text-xs font-semibold text-slate-500 mb-2">상세 내용</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {issue.detail || '상세 내용이 없습니다.'}
                  </p>
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
              <h3 className="font-bold text-navy-800">{editTarget ? '이슈 수정' : '이슈 등록'}</h3>
              <button onClick={() => { setShowModal(false); setEditTarget(null) }}>
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">현장</label>
                <select value={form.site_id} onChange={e => setForm({ ...form, site_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                  <option value="">현장 선택 (선택 안하면 기타)</option>
                  {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  <option value="other">기타</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">이슈 제목 *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="이슈 제목을 입력하세요"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">상세 내용</label>
                <textarea value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })}
                  placeholder="이슈 상세 내용을 입력하세요" rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">심각도</label>
                  <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                    <option value="high">긴급</option>
                    <option value="medium">중간</option>
                    <option value="low">낮음</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">상태</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                    <option value="open">발생</option>
                    <option value="in_progress">처리중</option>
                    <option value="done">완료</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditTarget(null) }}
                className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50">취소</button>
              <button onClick={handleSave}
                className="flex-1 bg-teal-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-teal-700">
                {editTarget ? '수정 완료' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="font-bold text-navy-800 mb-2">이슈 삭제</h3>
            <p className="text-sm text-slate-500 mb-6">이 이슈를 삭제하면 복구할 수 없습니다.</p>
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
