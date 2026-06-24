import { NavLink } from 'react-router-dom'
import { LayoutDashboard, AlertTriangle, BarChart2, BookOpen, Sparkles, MapPin } from 'lucide-react'

const TABS = [
  { to: '/', icon: LayoutDashboard, label: '홈' },
  { to: '/sites', icon: MapPin, label: '현장' },
  { to: '/issues', icon: AlertTriangle, label: '이슈' },
  { to: '/finance', icon: BarChart2, label: '재무' },
  { to: '/worklog', icon: BookOpen, label: '일지' },
  { to: '/ai', icon: Sparkles, label: 'AI' },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-50 safe-bottom">
      <div className="grid grid-cols-6 h-16">
        {TABS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[9px] font-medium transition-colors ${
                isActive ? 'text-teal-600' : 'text-slate-400'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
