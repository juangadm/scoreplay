import { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import Section from '../components/Section'
import Appendix from '../components/Appendix'
import MermaidDiagram from '../components/MermaidDiagram'
import PhaseTabs from '../components/PhaseTabs'
import { sections, appendices } from '../content/cs2-sections'

const INGEST_DIAGRAM = `flowchart TD
  Upload["Upload"] --> Fork{"Asset Type?"}
  Fork -->|Photo| CLIP["Jina CLIP\\nEmbedding"]
  Fork -->|Video| FFmpeg["Frame Extraction\\n1 frame/2s"]
  FFmpeg --> CLIP
  CLIP --> Opta["Opta/SportRadar Join\\n(Objective Context)"]
  Opta --> Gemini["Gemini Flash Enrichment\\n(Phase 2+)"]
  Gemini --> Index["Write to\\nVector Index"]
  Upload --> Priority{"Live Event?"}
  Priority -->|Yes| HotQueue["Priority Queue\\n< 30s target"]
  Priority -->|No| StdQueue["Standard Queue\\n< 5min target"]`

const QUERY_DIAGRAM = `flowchart LR
  Query["User Query"] --> Encode["CLIP Text\\nEncoder"]
  Encode --> Filter["Pre-filter\\norg_id / permissions"]
  Filter --> ANN["HNSW ANN\\nSearch ~5ms"]
  ANN --> Rerank["Metadata\\nRe-rank ~30ms"]
  Rerank --> Results["Top-k Results\\n< 35ms total"]`

// Technical Architecture appendix gets both ingest + query diagrams
const APPENDIX_DIAGRAMS = {
  'appendix-b': [
    { label: 'Ingest Pipeline', chart: INGEST_DIAGRAM },
    { label: 'Query Flow', chart: QUERY_DIAGRAM },
  ],
}

export default function CaseStudy2() {
  const [openAppendices, setOpenAppendices] = useState({})

  const sidebarSections = sections.map(s => ({ id: s.id, label: s.label }))
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
      />
      <main className="main-content">
        <div className="content-wrapper">
          <div className="hero">
            <h1>Semantic Search</h1>
          </div>

          {sections.map(s => (
            <div key={s.id}>
              <Section id={s.id} label={s.label} markdown={s.markdown} />
              {s.id === 'engineering-timeline' && <PhaseTabs />}
            </div>
          ))}

          <hr />
          <h2 style={{ marginBottom: 24 }}>Appendices</h2>

          {appendices.map(a => (
            <div key={a.id}>
              <Appendix
                id={a.id}
                title={a.label}
                markdown={a.markdown}
                isOpen={!!openAppendices[a.id]}
                onToggle={() => toggleAppendix(a.id)}
              />
              {openAppendices[a.id] && APPENDIX_DIAGRAMS[a.id] && (
                <div style={{ marginTop: -12, marginBottom: 12 }}>
                  {APPENDIX_DIAGRAMS[a.id].map((d, i) => (
                    <MermaidDiagram key={i} chart={d.chart} />
                  ))}
                </div>
              )}
            </div>
          ))}

          <footer className="footer">
            Made by <a href="https://juangabriel.me" target="_blank" rel="noopener noreferrer">Juan Gabriel</a> for ScorePlay
          </footer>
        </div>
      </main>
    </div>
  )
}
