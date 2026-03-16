import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Appendix({ id, title, markdown, isOpen, onToggle }) {
  const ref = useRef(null)

  useEffect(() => {
    if (isOpen && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isOpen])

  return (
    <div id={id} className={`appendix ${isOpen ? 'open' : ''}`} ref={ref}>
      <div className="appendix-header" onClick={onToggle}>
        <span>{title}</span>
        <span className="chevron">▶</span>
      </div>
      {isOpen && (
        <div className="appendix-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
