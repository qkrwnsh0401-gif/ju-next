import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
import Dashboard from './pages/Dashboard'
import Issues from './pages/Issues'
import Finance from './pages/Finance'
import WorkLog from './pages/WorkLog'
import AIPortfolio from './pages/AIPortfolio'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/worklog" element={<WorkLog />} />
            <Route path="/ai" element={<AIPortfolio />} />
          </Routes>
        </div>
        <MobileNav />
      </div>
    </BrowserRouter>
  )
}
