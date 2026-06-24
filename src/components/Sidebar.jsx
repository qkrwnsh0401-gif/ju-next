import { NavLink } from 'react-router-dom'
import { LayoutDashboard, AlertTriangle, BarChart2, BookOpen, Sparkles, LogOut } from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: '대시보드' },
  { to: '/issues', icon: AlertTriangle, label: '현장 이슈 관리' },
  { to: '/finance', icon: BarChart2, label: '재무 분석' },
  { to: '/worklog', icon: BookOpen, label: '업무일지' },
  { to: '/ai', icon: Sparkles, label: 'AI 포트폴리오' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-navy-800 text-white">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-navy-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">JN</span>
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-white">JU-NEXT</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Personal HR OS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-navy-700 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-navy-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold">박</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">박주노</p>
            <p className="text-xs text-slate-400">현장관리자</p>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
