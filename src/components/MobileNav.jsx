import { NavLink } from 'react-router-dom'
import { LayoutDashboard, AlertTriangle, BarChart2, BookOpen } from 'lucide-react'

const TABS = [
  { to: '/', icon: LayoutDashboard, label: '홈' },
  { to: '/issues', icon: AlertTriangle, label: '이슈' },
  { to: '/finance', icon: BarChart2, label: '재무' },
  { to: '/worklog', icon: BookOpen, label: '일지' },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-50">
      <div className="grid grid-cols-4 h-16">
        {TABS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-[10px] transition-colors ${
                isActive ? 'text-teal-600' : 'text-slate-400'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
