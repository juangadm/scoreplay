export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <div className="landing-logo">ScorePlay</div>
        <h1>Case Studies</h1>
        <div className="landing-cards">
          <a href="/semantic" className="landing-card">
            <h3>Semantic Search</h3>
            <p>Product Proposal</p>
          </a>
          <a href="/org" className="landing-card">
            <h3>Team Organization</h3>
            <p>Product Proposal</p>
          </a>
        </div>
      </div>
    </div>
  )
}
