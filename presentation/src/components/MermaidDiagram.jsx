import { useEffect, useRef, useState } from 'react'

let mermaidLoaded = false
let mermaidPromise = null

function loadMermaid() {
  if (mermaidPromise) return mermaidPromise
  mermaidPromise = new Promise((resolve) => {
    if (window.mermaid) {
      mermaidLoaded = true
      resolve(window.mermaid)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
    script.onload = () => {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#fce4ec',
          primaryBorderColor: '#E70074',
          primaryTextColor: '#1a1a1a',
          lineColor: '#E70074',
          secondaryColor: '#f3f2ef',
          tertiaryColor: '#faf9f7',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
        }
      })
      mermaidLoaded = true
      resolve(window.mermaid)
    }
    document.head.appendChild(script)
  })
  return mermaidPromise
}

export default function MermaidDiagram({ chart }) {
  const containerRef = useRef(null)
  const [svg, setSvg] = useState('')
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    let cancelled = false
    loadMermaid().then(async (mermaid) => {
      if (cancelled) return
      try {
        const { svg } = await mermaid.render(idRef.current, chart)
        if (!cancelled) setSvg(svg)
      } catch (e) {
        console.error('Mermaid render error:', e)
      }
    })
    return () => { cancelled = true }
  }, [chart])

  return (
    <div className="mermaid-container" ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} />
  )
}
