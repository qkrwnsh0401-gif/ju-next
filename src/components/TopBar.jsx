import { useState, useRef, useEffect } from 'react'
import { Bell, Search, X, MapPin, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../lib/AppContext'

export default function TopBar({ title }) {
  const navigate = useNavigate()
  const { sites, issues } = useApp()
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const searchRef = useRef(null)
  const notifRef = useRef(null)

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })

  const openIssues = issues.filter(i => i.status !== 'done')

  const results = query.trim().length < 1 ? [] : [
    ...sites.filter(s => s.name.includes(query) || s.client_company?.includes(query))
      .map(s => ({ type: 'site', label: s.name, sub: s.client_company, id: s.id })),
    ...issues.filter(i => i.title.includes(query))
      .map(i => {
        const site = sites.find(s => s.id === i.site_id)
        return { type: 'issue', label: i.title, sub: site?.name || '', id: i.id }
      }),
  ]

  const handleSelect = (item) => {
    setQuery('')
    setShowSearch(false)
    if (item.type === 'site') navigate(`/sites/${item.id}`)
    else navigate('/issues')
  }

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between relative z-30">
      <div>
        <h1 className="text-xl font-bold text-navy-800">{title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{today}</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div ref={searchRef} className="relative hidden sm:block">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-48 focus-within:border-teal-400 transition-colors">
            <Search size={14} className="text-slate-400 flex-shrink-0" />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setShowSearch(true) }}
              onFocus={() => setShowSearch(true)}
              placeholder="현장, 이슈 검색"
              className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder:text-slate-400"
            />
            {query && (
              <button onClick={() => { setQuery(''); setShowSearch(false) }}>
                <X size={12} className="text-slate-400 hover:text-slate-600"/>
              </button>
            )}
          </div>
          {showSearch && query.trim().length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
              {results.length === 0 ? (
                <p className="text-xs text-slate-400 px-4 py-3">검색 결과가 없습니다</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {results.map((item, i) => (
                    <button key={i} onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'site' ? 'bg-teal-100' : 'bg-orange-100'}`}>
                        {item.type === 'site'
                          ? <MapPin size={12} className="text-teal-600"/>
                          : <AlertTriangle size={12} className="text-orange-500"/>
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-navy-800 truncate">{item.label}</p>
                        <p className="text-xs text-slate-400 truncate">{item.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => setShowNotif(v => !v)}
            className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Bell size={18} className="text-slate-500" />
            {openIssues.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                {openIssues.length > 9 ? '9+' : openIssues.length}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-navy-800">미처리 이슈 알림</span>
                <span className="text-xs text-slate-400">{openIssues.length}건</span>
              </div>
              {openIssues.length === 0 ? (
                <p className="text-xs text-slate-400 px-4 py-4 text-center">미처리 이슈가 없습니다</p>
              ) : (
                <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                  {openIssues.map(issue => {
                    const site = sites.find(s => s.id === issue.site_id)
                    return (
                      <button key={issue.id} onClick={() => { setShowNotif(false); navigate('/issues') }}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${issue.severity === 'high' ? 'bg-red-500' : issue.severity === 'medium' ? 'bg-orange-400' : 'bg-slate-300'}`}/>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-navy-800 truncate">{issue.title}</p>
                          <p className="text-xs text-slate-400">{site?.name} · {issue.status === 'open' ? '발생' : '처리중'}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
              <div className="px-4 py-2.5 border-t border-slate-100">
                <button onClick={() => { setShowNotif(false); navigate('/issues') }}
                  className="text-xs text-teal-600 font-medium hover:underline w-full text-center">
                  이슈 관리 페이지로 이동
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
