import { createContext, useContext, useState } from 'react'
import {
  INITIAL_SITES, INITIAL_ISSUES, INITIAL_FINANCIALS, INITIAL_WORK_LOGS
} from './mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [sites, setSites] = useState(INITIAL_SITES)
  const [issues, setIssues] = useState(INITIAL_ISSUES)
  const [financials, setFinancials] = useState(INITIAL_FINANCIALS)
  const [workLogs, setWorkLogs] = useState(INITIAL_WORK_LOGS)

  const addSite = (site) => {
    const newSite = { ...site, id: Date.now(), active: true }
    setSites(prev => [...prev, newSite])
  }

  const updateSite = (id, data) => setSites(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  const deleteSite = (id) => setSites(prev => prev.filter(s => s.id !== id))

  const addIssue = (issue) => setIssues(prev => [{ ...issue, id: Date.now(), created_at: new Date().toISOString().slice(0,10) }, ...prev])
  const updateIssue = (id, data) => setIssues(prev => prev.map(i => i.id === id ? { ...i, ...data } : i))

  const addFinancial = (fin) => {
    const exists = financials.find(f => f.site_id === fin.site_id && f.year_month === fin.year_month)
    if (exists) {
      setFinancials(prev => prev.map(f => f.site_id === fin.site_id && f.year_month === fin.year_month ? { ...f, ...fin } : f))
    } else {
      setFinancials(prev => [...prev, { ...fin, id: Date.now() }])
    }
  }

  const updateFinancial = (id, data) => setFinancials(prev => prev.map(f => f.id === id ? { ...f, ...data } : f))
  const deleteFinancial = (id) => setFinancials(prev => prev.filter(f => f.id !== id))

  const addWorkLog = (log) => setWorkLogs(prev => [{ ...log, id: Date.now(), log_date: new Date().toISOString().slice(0,10) }, ...prev])
  const updateWorkLog = (id, data) => setWorkLogs(prev => prev.map(l => l.id === id ? { ...l, ...data } : l))

  return (
    <AppContext.Provider value={{
      sites, issues, financials, workLogs,
      addSite, updateSite, deleteSite,
      addIssue, updateIssue,
      addFinancial, updateFinancial, deleteFinancial,
      addWorkLog, updateWorkLog,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
