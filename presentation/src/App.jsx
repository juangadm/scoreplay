import { useState, useEffect } from 'react'
import CaseStudy1 from './pages/CaseStudy1'
import CaseStudy2 from './pages/CaseStudy2'
import Landing from './pages/Landing'

function App() {
  const [page, setPage] = useState('cs2')

  useEffect(() => {
    const path = window.location.pathname
    if (path === '/' || path === '/index.html') {
      setPage('landing')
    } else if (path.includes('org')) {
      setPage('cs1')
    } else {
      setPage('cs2')
    }
  }, [])

  if (page === 'landing') return <Landing />
  if (page === 'cs1') return <CaseStudy1 />

  return <CaseStudy2 />
}

export default App
