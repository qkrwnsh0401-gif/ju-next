import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, MapPin, Building2, ChevronRight, Trash2 } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useApp } from '../lib/AppContext'
import { STATUS_COLOR, STATUS_LABEL } from '../lib/mockData'

export default function Sites() {
  const { sites, issues, addSite, deleteSite } = useApp()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', client_company: '', location: '' })

  const handleAdd = () => {
    if (!form.name.trim()) return
    addSite(form)
    setForm({ name: '', client_company: '', location: '' })
    setShowModal(false)
  }

  return (
    <div className="flex-1 overflow-auto pb-20 md:pb-0">
      <TopBar title="현장 전체보기" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">총 {sites.length}개 현장</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={14} /> 현장 추가
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map(site => {
            const siteIssues = issues.filter(i => i.site_id === site.id)
            const openIssues = siteIssues.filter(i => i.status !== 'done')
            const statusBadge = openIssues.length > 0
              ? openIssues.some(i => i.severity === 'high')
                ? { label: '긴급', cls: 'bg-red-100 text-red-600' }
                : { label: '처리중', cls: 'bg-orange-100 text-orange-600' }
              : { label: '정상', cls: 'bg-teal-100 text-teal-600' }

            return (
              <div
                key={site.id}
                onClick={() => navigate(`/sites/${site.id}`)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-200 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-white font-bold text-lg">
                    {site.name[0]}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge.cls}`}>
                    {statusBadge.label}
                  </span>
                </div>
                <h3 className="font-bold text-navy-800 text-base mb-1">{site.name}</h3>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Building2 size={11} /> {site.client_company}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin size={11} /> {site.location || '위치 미등록'}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">진행중 이슈 <strong className="text-navy-800">{openIssues.length}건</strong></span>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-navy-800">현장 추가</h3>
              <button onClick={() => setShowModal(false)}><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">현장명 *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="예: 한국전력" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">거래처명</label>
                <input value={form.client_company} onChange={e => setForm({...form, client_company: e.target.value})}
                  placeholder="예: 한국전력공사" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">위치</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                  placeholder="예: 경기 수원시" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50">취소</button>
              <button onClick={handleAdd} className="flex-1 bg-teal-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-teal-700">추가</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
