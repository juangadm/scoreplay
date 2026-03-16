import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const components = {
  blockquote({ children }) {
    const childArray = Array.isArray(children) ? children : [children]
    const para = childArray.find(c => c && typeof c === 'object' && c.props !== undefined)
    const inner = para?.props?.children
    const innerArray = Array.isArray(inner) ? inner : (inner != null ? [inner] : [])
    const first = innerArray.find(c => c && typeof c === 'object')
    const isStrongLabel = first?.type === 'strong'
    const label = isStrongLabel
      ? String(Array.isArray(first.props.children) ? first.props.children.join('') : first.props.children).replace(/:$/, '')
      : 'Note'
    const body = isStrongLabel ? innerArray.slice(innerArray.indexOf(first) + 1) : innerArray
    return (
      <p className="note">
        <strong className="note-label">{label}:</strong>{' '}{body}
      </p>
    )
  }
}

export default function Section({ id, label, children, markdown }) {
  return (
    <section id={id} className="section">
      {label && <h2>{label}</h2>}
      {markdown ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{markdown}</ReactMarkdown>
      ) : (
        children
      )}
    </section>
  )
}
