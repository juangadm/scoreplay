import { useState, useEffect } from 'react'
import CaseStudy2 from './pages/CaseStudy2'
import Landing from './pages/Landing'

function App() {
  const [page, setPage] = useState('cs2')

  useEffect(() => {
    const path = window.location.pathname
    if (path === '/' || path === '/index.html') {
      setPage('landing')
    } else if (path.includes('case-study-1')) {
      setPage('cs1')
    } else {
      setPage('cs2')
    }
  }, [])

  // For simplicity, always show CS2 since that's the primary deliverable
  // Landing page can be accessed at root
  if (page === 'landing') return <Landing />

  return <CaseStudy2 />
}

export default App
