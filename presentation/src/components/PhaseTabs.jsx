import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const PHASES = [
  {
    label: 'Phase 1',
    title: 'Semantic Search',
    weeks: 'Weeks 1-3',
    markdown: `**Weeks 1-2:** Jina CLIP deployed on ECS. Embedding pipeline for new uploads. ES kNN index populated for pilot client libraries.

**Week 3:** Semantic search UI. NL query bar integrated alongside existing filter bar. Internal alpha live.`,
  },
  {
    label: 'Phase 2',
    title: 'Enrichment + Scale',
    weeks: 'Weeks 4-9',
    markdown: `**Weeks 4-6:** Gemini Flash enrichment pipeline at ingest. Opta/SportRadar data join (objective sports context). Ontology dimensions 1-6 writing to metadata.

**Weeks 7-8:** Turbopuffer migration. Hot/cold index split. Priority queue for live events. <30s target validated.

**Week 9:** Beta launch with 3 pilot clients.`,
  },
  {
    label: 'Phase 3',
    title: 'Harden + GA',
    weeks: 'Weeks 10-13',
    markdown: `**Weeks 10-11:** Cross-org permissioning layer. Rights metadata. Pilot sponsor/partner search session.

**Week 12:** GA readiness. Monitoring, alerting, SLA.

**Week 13:** GA launch.`,
  },
]

export default function PhaseTabs() {
  const [active, setActive] = useState(0)

  return (
    <div style={{ margin: '8px 0' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {PHASES.map((phase, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: '6px 12px',
              borderRadius: 16,
              border: 'none',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: i === active ? '#E70074' : 'rgba(0,0,0,0.04)',
              color: i === active ? '#fff' : 'rgba(0,0,0,0.5)',
            }}
          >
            {phase.label}
          </button>
        ))}
      </div>
      <div style={{
        background: '#f8f8f8',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 8,
        padding: '16px 20px',
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 550,
          color: 'rgba(0,0,0,0.78)',
          marginBottom: 4,
        }}>
          {PHASES[active].title}
        </div>
        <div style={{
          fontSize: 11,
          color: 'rgba(0,0,0,0.35)',
          marginBottom: 12,
        }}>
          {PHASES[active].weeks}
        </div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {PHASES[active].markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}
