import { useState } from 'react'

const S = 14  // dot size
const G = 5   // gap
const R = 3   // border-radius
const PANEL_HEIGHT = 160  // fixed height for crossfade area

const FONT = '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

const C = {
  eng: '#E70074',
  prod: '#FF6BA8',
  designer: '#4AA8D8',
  white: '#fff',
  dim: 'rgba(255,255,255,0.2)',
}

function Dot({ color = C.white, dashed = false }) {
  const style = {
    width: S,
    height: S,
    borderRadius: R,
    flexShrink: 0,
  }

  if (dashed) {
    style.background = `${color}30`
    style.border = `1.5px dashed ${color}`
  } else {
    style.background = color
  }

  return <div style={style} />
}

function Grid({ dots, cols, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${S}px)`,
        gap: G,
      }}>
        {dots.map((d, i) => <Dot key={i} {...d} />)}
      </div>
      {label && (
        <div style={{
          fontFamily: FONT,
          fontSize: 10,
          fontWeight: 450,
          color: 'rgba(255,255,255,0.45)',
          marginTop: 4,
          letterSpacing: '-0.01em',
        }}>{label}</div>
      )}
    </div>
  )
}

function Title({ children }) {
  return (
    <div style={{ marginBottom: 28, fontFamily: FONT, fontSize: 15, fontWeight: 450, letterSpacing: '-0.01em' }}>
      {children}
    </div>
  )
}

function Panel1() {
  const squads = [
    { dots: 4, cols: 2, label: 'Squad A' },
    { dots: 3, cols: 2, label: 'Squad B' },
    { dots: 5, cols: 3, label: 'Squad C' },
    { dots: 3, cols: 2, label: 'Squad D' },
    { dots: 4, cols: 2, label: 'Squad E' },
  ]
  return (
    <div>
      <Title>
        <span style={{ color: 'rgba(255,255,255,0.85)' }}>Small teams force </span>
        <span style={{ color: C.eng, fontStyle: 'italic' }}>narrow scopes</span>
      </Title>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {squads.map((s, i) => (
          <Grid key={i} dots={Array(s.dots).fill({ color: C.white })} cols={s.cols} label={s.label} />
        ))}
      </div>
    </div>
  )
}

function Panel2() {
  return (
    <div>
      <Title>
        <span style={{ color: 'rgba(255,255,255,0.85)' }}>Over-provision </span>
        <span style={{ color: C.eng, fontStyle: 'italic' }}>what's important</span>
      </Title>
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
        <Grid dots={Array(20).fill({ color: C.white })} cols={4} label="The Main Thing" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Grid dots={Array(4).fill({ color: C.dim })} cols={4} />
          <Grid dots={Array(5).fill({ color: C.dim })} cols={4} />
        </div>
      </div>
    </div>
  )
}

function Panel3() {
  const coreDots = [
    ...Array(9).fill({ color: C.eng }),
    { color: C.prod },
    { color: C.designer, dashed: true },
  ]
  const insightsDots = [
    ...Array(3).fill({ color: C.eng }),
    { color: C.prod },
  ]
  return (
    <div>
      <Title>
        <span style={{ color: 'rgba(255,255,255,0.85)' }}>Proposed Structure </span>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>(tentative)</span>
      </Title>
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
        <Grid dots={coreDots} cols={4} label="Play" />
        <Grid dots={insightsDots} cols={2} label="Insights / Marketplace" />
      </div>
    </div>
  )
}

const PANELS = [Panel1, Panel2, Panel3]

function Legend() {
  const items = [
    { color: C.eng, label: 'Engineering' },
    { color: C.prod, label: 'Product' },
    { color: C.designer, label: 'Designer (hire)', dashed: true },
  ]
  return (
    <div style={{
      display: 'flex',
      gap: 14,
      fontFamily: FONT,
      fontSize: 11,
      fontWeight: 450,
      color: 'rgba(255,255,255,0.6)',
      letterSpacing: '-0.01em',
    }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: item.dashed ? `${item.color}30` : item.color,
            border: item.dashed ? `1px dashed ${item.color}` : 'none',
            display: 'inline-block',
          }} />
          {item.label}
        </span>
      ))}
    </div>
  )
}

export default function OrgDiagram() {
  const [active, setActive] = useState(0)

  const advance = () => setActive((active + 1) % PANELS.length)

  return (
    <div
      onClick={advance}
      style={{
        background: '#1a1a1a',
        borderRadius: 8,
        padding: '32px 28px 24px',
        margin: '8px 0',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Fixed-height crossfade area */}
      <div style={{ position: 'relative', height: PANEL_HEIGHT }}>
        {PANELS.map((Panel, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              opacity: i === active ? 1 : 0,
              transition: 'opacity 0.35s ease',
              pointerEvents: i === active ? 'auto' : 'none',
            }}
          >
            <Panel />
          </div>
        ))}
      </div>

      {/* Legend — only on panel 3 */}
      <div style={{
        opacity: active === 2 ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}>
        <Legend />
      </div>

      {/* Dot indicators */}
      <div style={{
        display: 'flex',
        gap: 6,
        justifyContent: 'center',
        marginTop: 16,
      }}>
        {PANELS.map((_, i) => (
          <div
            key={i}
            onClick={(e) => { e.stopPropagation(); setActive(i) }}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: i === active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.25s ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  )
}
