import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Section({ id, label, children, markdown }) {
  return (
    <section id={id} className="section">
      {label && <h2>{label}</h2>}
      {markdown ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      ) : (
        children
      )}
    </section>
  )
}
