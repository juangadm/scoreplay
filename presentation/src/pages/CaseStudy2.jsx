import { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import Section from '../components/Section'
import Appendix from '../components/Appendix'
import MermaidDiagram from '../components/MermaidDiagram'
import { sections, appendices } from '../content/cs2-sections'

const PHASE_DIAGRAM = `flowchart LR
  P1["Phase 1\\nNL Search"] --> P2["Phase 2\\nUniversal Ontology"]
  P2 --> P3["Phase 3\\nCross-org Marketplace"]
  P3 --> P4["Phase 4\\nAPI Platform"]`

const GANTT_DIAGRAM = `gantt
  title 90-Day Implementation
  dateFormat X
  axisFormat Week %s
  section Phase 1
    CLIP + ES kNN           :a1, 0, 2w
    Search UI + Alpha       :a2, after a1, 1w
  section Phase 2
    Enrichment pipeline     :b1, after a2, 3w
    Turbopuffer migration   :b2, after b1, 2w
    Beta launch             :milestone, m1, after b2, 0
  section Phase 3
    Cross-org permissions   :c1, after b2, 2w
    GA readiness            :c2, after c1, 1w
    GA launch               :milestone, m2, after c2, 0`

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

// Map section IDs that should have mermaid diagrams injected
const DIAGRAM_MAP = {
  'what-this-unlocks': PHASE_DIAGRAM,
  'engineering-timeline': GANTT_DIAGRAM,
}

// Appendix C gets both ingest + query diagrams
const APPENDIX_DIAGRAMS = {
  'appendix-c': [
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
            <div className="subtitle">ScorePlay: Product Proposal</div>
          </div>

          {sections.map(s => (
            <div key={s.id}>
              <Section id={s.id} label={s.label} markdown={s.markdown} />
              {DIAGRAM_MAP[s.id] && (
                <MermaidDiagram chart={DIAGRAM_MAP[s.id]} />
              )}
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
