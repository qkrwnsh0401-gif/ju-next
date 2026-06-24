import { Bell, Search } from 'lucide-react'

export default function TopBar({ title }) {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-navy-800">{title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{today}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-48">
          <Search size={14} className="text-slate-400" />
          <input
            placeholder="현장, 이슈 검색"
            className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder:text-slate-400"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
          <Bell size={18} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
