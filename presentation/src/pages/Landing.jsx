export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <div className="landing-logo">ScorePlay</div>
        <h1>Case Studies</h1>
        <div className="landing-cards">
          <a href="/case-study-2" className="landing-card">
            <h3>Case Study 2</h3>
            <p>Semantic Search: Product Proposal</p>
          </a>
          <a href="/case-study-1" className="landing-card">
            <h3>Case Study 1</h3>
            <p>Team Organization</p>
          </a>
        </div>
      </div>
    </div>
  )
}
