import { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import Section from '../components/Section'
import Appendix from '../components/Appendix'
import OrgDiagram from '../components/OrgDiagram'
import { sections, appendices } from '../content/cs1-sections'

// Filter out 'the-org-model-detail' from sidebar since it's a continuation of org model
const HIDDEN_SIDEBAR_IDS = new Set(['the-org-model-detail'])

export default function CaseStudy1() {
  const [openAppendices, setOpenAppendices] = useState({})

  const sidebarSections = sections
    .filter(s => !HIDDEN_SIDEBAR_IDS.has(s.id))
    .map(s => ({ id: s.id, label: s.label }))
  const sidebarAppendices = appendices.map(a => ({ id: a.id, label: a.label }))

  const handleAppendixClick = useCallback((id) => {
    setOpenAppendices(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }, [])

  const toggleAppendix = useCallback((id) => {
    setOpenAppendices(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  return (
    <div className="app-layout">
      <Sidebar
        sections={sidebarSections}
        appendices={sidebarAppendices}
        onAppendixClick={handleAppendixClick}
        title="Team Organization"
        footerLink={{ href: '/semantic', label: 'Semantic Search →' }}
      />
      <main className="main-content">
        <div className="content-wrapper">
          <div className="hero">
            <h1>Team Organization</h1>
          </div>

          {sections.map(s => (
            <div key={s.id}>
              <Section id={s.id} label={HIDDEN_SIDEBAR_IDS.has(s.id) ? null : s.label} markdown={s.markdown} />
              {s.id === 'thesis' && (
                <p className="note">
                  <strong className="note-label">Note:</strong> These recommendations are a starting point. The right structure emerges from working alongside the EPD team, not from a document.
                </p>
              )}
              {s.id === 'the-org-model' && <OrgDiagram />}
            </div>
          ))}

          <hr />
          <h2 style={{ marginBottom: 24 }}>Appendices</h2>

          {appendices.map(a => (
            <Appendix
              key={a.id}
              id={a.id}
              title={a.label}
              markdown={a.markdown}
              isOpen={!!openAppendices[a.id]}
              onToggle={() => toggleAppendix(a.id)}
            />
          ))}

          <footer className="footer">
            Made by <a href="https://juangabriel.org" target="_blank" rel="noopener noreferrer">Juan Gabriel</a> for ScorePlay
          </footer>

        </div>
      </main>
    </div>
  )
}
