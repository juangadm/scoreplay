export const sections = [
  {
    id: 'thesis',
    label: 'Thesis',
    markdown: `ScorePlay has spent 24 months building what customers ask for. Becoming defensible means building what customers *need*: a core-heavy, intentionally asymmetric org where one team owns the full product and ships its own vision.

`,
  },
  {
    id: 'the-org-model',
    label: 'The Org Model',
    markdown: `ScorePlay's products (Creator, Studio, Pulse) are tiered capabilities of one product at three price points. Stats is the only genuinely new bet. The org should reflect that: one large core team, one temporary project squad.

**Why not balanced squads?** Symmetric orgs create diffuse focus. Engineers build features to justify their squad's existence. You ship your org structure.`,
  },
  {
    id: 'the-org-model-detail',
    label: 'Org Detail',
    markdown: `**Play** owns the full product: feature work, tech debt, client escalations (via rotation). Backend (Go), frontend (React), video, mobile, and DevOps all sit together. Led by the EM, with a Delivery Lead on process.

**Stats Squad** is temporary with a written disbanding condition: exists until Stats is GA and integrated into the tier upgrade path (target Q3 2026). Kill criteria stated at formation, not discovered later.

**Platform/Infra** is embedded in Core, not siloed. Pure platform teams end up too far from business context.`,
  },
  {
    id: 'ai-first-culture',
    label: 'AI-First Culture',
    markdown: `AI tooling is a structural advantage ScorePlay hasn't fully activated. Deploying it broadly improves speed, reduces spec debt, and frees engineering capacity.

**For all EPD:**
- Cursor or Copilot for all engineers, non-optional ($20/user/month)
- READ access to the full codebase for PMs and designers. PMs who read code write better specs
- LLM-assisted spec drafting: PMs use Claude/GPT for first-draft specs from customer interviews, then review and sign off

**For CS (the high-leverage unlock):**
60%+ of engineer capacity goes to client fires. A meaningful fraction are configuration-layer issues (copy changes, threshold tweaks, permission resets, taxonomy updates) that don't require a Go engineer.

Proposed access model:
- READ access to the full repo for senior CS
- WRITE access limited to a defined \`config/\` layer, no logic or schema changes
- All CS-initiated PRs require 1-engineer review (can be interrupt-duty engineer)
- Estimated impact: removes 20-30% of interrupt-duty load

**The quality filter:** Speed without quality creates different problems. Every AI-assisted output (spec, code, config change) needs a human review gate. The point is to route work to the right person with better tools, not to remove oversight.`,
  },
  {
    id: 'the-pm-model',
    label: 'The PM Model',
    markdown: `2 PMs for 10-12 engineers is a healthy ratio (approx. 1:5-6). The question is how PMs operate, not how many there are.

PMs are connective tissue, not backlog managers. They synthesize feedback, define intent, and surface downstream effects. Engineers write their own tickets. One owner per issue, no shared ownership.

**PMs should be shipping code to production consistently.** Not entire features in one go, but small, scoped changes: config updates, copy fixes, spec-driven tweaks. A PM who can push code has better judgment about what's buildable and removes bottlenecks from engineering.

**Spec format (3 fields):**
1. What's the situation? (Context)
2. What do we want to happen? (Intent)
3. What breaks if we get this wrong? (Downstream effects)

Nothing enters a cycle without all three fields filled. Enforced by the Delivery Lead at cycle entry, not by PMs retroactively.`,
  },
  {
    id: 'design',
    label: 'Design',
    markdown: `ScorePlay's customers are creatives: social media managers, PR teams, broadcast editors. They're used to the most compelling visual tools in their daily workflows. Leading with design isn't optional for this audience.

The tripod model: PM + Engineer + Designer working together from project start, not a designer consulted at the end to polish what engineers already built.

**Hire 1 designer, embed them in Play.** At 10-12 engineers, one full-time designer is the right ratio. A PM with strong design instincts can bridge the gap initially, but as the product layers more complexity, dedicated design skill becomes essential. The UX today shows signs of high friction: duplicative flows, multiple layers to accomplish single tasks. As ScorePlay evolves toward a marketplace, design will be the difference between a tool people tolerate and one they choose.

**What this designer owns:**
- Search UX (the semantic search bet, its design *is* the product)
- Media detail view (highest-frequency interaction)
- Distribution flows (portal creation, mobile share, permissions)
- Design system (shared components across all surfaces)
- Onboarding (270+ orgs likely get dropped in cold)

Reports to HoP. Seat at the table on every spec from day one. See Budget appendix for cost details.`,
  },
  {
    id: 'demand-triage',
    label: 'Demand Triage',
    markdown: `Customer requests currently enter the backlog directly. Sales and CS escalate to engineering. Without a decision-making structure above them, competing priorities create competing roadmaps.

**Three separate queues:**

| Queue | Source | Owner | SLA |
|---|---|---|---|
| **Interrupt rotation** | Client fires, production bugs | 1 engineer/cycle on rotating duty | <24h |
| **Customer-requested features** | CS, Sales escalations | Head of Product filters via "right to win" test | Quarterly review |
| **Platform roadmap** | Internal: tech debt, infra, new bets | Leadership jointly | Quarterly planning |

**"Right to win" filter (HoP makes the call):** Is this valuable to one customer, or does it improve the product for all customers at this tier? If one customer, it's professional services, not product.

**Interrupt rotation** may already exist in some form today. The goal is to formalize and build on it: one engineer per cycle handles all client fires and P0 bugs. Every other engineer is protected. This single change can free 40-60% of capacity currently lost to context switching.

**Contractual requests:** Flag at intake, price separately if bespoke. If a contractual feature is also on the roadmap, it ships with the roadmap. If not, it gets a separate estimate.`,
  },
  {
    id: 'tech-debt',
    label: 'Tech Debt',
    markdown: `The instinct is to prescribe a fixed allocation (20% of every cycle). That's premature without knowing the composition of the debt.

**Week 1:** Run a tech debt audit with the EM. Ask every engineer: what are the top 3 things that slow you down or scare you? Categorize:

| Category | Examples | Who fixes it |
|---|---|---|
| **Config-layer** | Hardcoded overrides, copy in code, manual taxonomy | CS with structured access |
| **Application** | Duplicated logic, missing abstractions, test gaps | Play, alongside feature work |
| **Infrastructure** | CI/CD bottlenecks, deployment fragility, monitoring | DevOps embedded in Core |

A meaningful portion of "tech debt" is config-layer work CS can own with guardrails. Every config change CS handles directly is one fewer engineering interrupt.

- **Application/infra debt:** Attach cleanup to feature work. When an engineer builds in an area with known debt, the spec includes the fix. No separate "tech debt cycle"
- **High-severity debt** (things that scare engineers): treated as projects on the platform roadmap, scheduled in quarterly planning`,
  },
  {
    id: 'cadence-delivery',
    label: 'Cadence & Delivery',
    markdown: `Weekly cycles with project-based delivery commitments. No rigid two-week sprints, no heavy planning ceremonies.

**Weekly cycles:**
- Each project has a single owner who commits to a delivery date
- Monday check-in (30 min max): status per project. Three states: on track, blocked, date moved
- No story points, no velocity calculations
- Delivery Lead runs the check-in and maintains the project status board

**Project ownership:**
- Work organized as projects with clear outcomes, not ticket lists
- Each project has a 3-field spec and committed date before starting
- Owner is accountable for the outcome, pulls in collaborators as needed
- One owner per project, no shared ownership

**Quarterly planning:**
- Projects sourced from the three queues
- Leadership jointly prioritizes; each project gets a named owner and target date
- Mid-quarter: one check-in to re-prioritize if needed; no additions unless genuinely urgent`,
  },
  {
    id: 'transition',
    label: 'Transition Plan',
    markdown: `*Tentative: needs calibration against the actual talent and starting base.*

**Week 1: Listen, don't restructure.**
- 1:1s with every engineer, both PMs, Delivery Lead, EM
- Ask: "What's the most broken thing?" and "What should I not touch?"
- Audit competing roadmaps; find the overlap (that's the real roadmap)
- Run the tech debt audit
- Don't change the cycle in progress

**Month 1: Stabilize.**
- Install interrupt rotation (day-10 work, not quarter-2)
- Freeze new roadmap additions for 30 days
- Merge into a single roadmap; ship internally before external
- Introduce spec prerequisite gate at project entry
- Present changes to the EM first; get their language on it

**Quarter 1: Structure.**
- Reorganize into Play + Stats Project Squad
- Define Stats disbanding conditions in writing
- First quarterly roadmap: sourced from customer signal + platform needs, filtered through "right to win"
- Run a "feature roast": team destructively tests a recent feature (biweekly ritual)
- First retrospective on customer requests: which shipped? Which were one-offs?`,
  },
  {
    id: 'rebuilding-momentum',
    label: 'Rebuilding Momentum',
    markdown: `35-65% completion rates demotivate because engineers don't finish things. Every cycle is a visible reminder of what didn't ship.

**The fix is small, completable scopes:**
- Cycle goal is one *shipped* thing, not a list of in-progress work
- "Beta search bar live for 3 pilot clients" beats "semantic search: 60% complete"
- First cycle as HoP: don't blow up the sprint. Run the current cycle, introduce interrupt rotation mid-cycle, let the team close something
- Celebrate shipped things, not started things`,
  },
  {
    id: 'risks',
    label: 'Risks',
    markdown: `| Risk | Likelihood | Mitigation |
|---|---|---|
| Play, diffuse ownership | Medium | Project ownership model (one named owner) prevents diffusion |
| Interrupt rotation, engineer falls behind | Medium | Rotations are 1-week; interrupt duty is the only responsibility that week |
| Spec gate, short-term velocity dip | High (temporary) | Expected. Completion rate rises within 2 cycles |
| Merging roadmaps, political friction | Medium | Frame as a merger, not a kill. Find overlap first |
| CS codebase access, accidental breakage | Low | Config layer only, mandatory eng review. READ-only for 30 days first |`,
  },
  {
    id: 'org-evolution',
    label: 'Org Evolution',
    markdown: `Search is a feature. Insights is the product opportunity. Semantic search enables a broader intelligence layer that eventually requires its own PM surface.

The build starts as a temporary project squad embedded in Core (1 ML engineer, 1 backend, 1 frontend, 0.5 PM, 0.5 data engineer). As the intelligence layer matures, the real opportunity shifts to marketplace: seamless permissioning, cross-org asset access, and a distribution model that turns ScorePlay from a tool into a platform.

Hire an Intelligence/Marketplace PM when search is in beta and governance is clearly a bottleneck. Stats and search will converge into one data layer. Don't hire ahead of the need.`,
  },
  {
    id: '90-day-success',
    label: '90-Day Success',
    markdown: `- One roadmap, no competing docs
- Interrupt rotation running; engineers protected from ad-hoc interruptions
- Completion rate above 70% for two consecutive cycles
- Stats squad has written disbanding conditions
- CS has READ access and has submitted their first config-layer PR
- One feature roast completed
- Every project has a 3-field spec at entry`,
  },
]

export const appendices = [
  {
    id: 'appendix-diagnosis',
    label: 'The Diagnosis',
    markdown: `Root causes identified from the current state:

| Symptom | Root Cause |
|---|---|
| 85-117% scope creep | No intake filter. Work enters the sprint from too many directions |
| 35-65% completion | Scope creep + empty specs = constant context switching |
| 30+ empty-spec tickets | Specs written during sprint planning, not before |
| Two competing roadmaps | No single owner. Roadmap is a negotiation, not a decision |
| 60%+ capacity on client fires | No interrupt rotation. Every engineer is reachable |
| 24 months customer-dictated | Customer requests enter backlog directly. No "right to win" filter |

None of these are personnel problems. They're structural. The fix is org design, not hiring or motivation.`,
  },
  {
    id: 'appendix-budget',
    label: 'Budget: Paris vs. NYC',
    markdown: `**Recommendation:** Build primarily in Paris (1.7x cost advantage). Reserve US hiring for roles requiring direct market access (enterprise sales, NBA/MLB business development) or specialized skills unavailable in the Paris talent pool.

### Cost Comparison

| Role | Paris (fully loaded) | NYC (fully loaded) | Savings |
|---|---|---|---|
| Senior PM | €107k ($127k) | $234k | 1.84x |
| Head of Product | €149k ($176k) | $296k | 1.68x |
| Senior SWE | €119k ($141k) | $251k | 1.78x |
| Senior Designer | €87k ($103k) | $171k | 1.66x |

A 4-person EPD team costs €462k/yr in Paris ($545k) vs $952k in NYC. For the 3.5 FTE needed for semantic search, Paris runs €430-460k vs NYC $860-950k.

### Key Tradeoffs

- **Paris advantage:** approx. 1.7x cheaper fully loaded
- **Paris risk:** Harder to exit (labor court exposure: 3-20 months salary under the Macron scale). Use CDI for permanent roles, SASU contractor structure for bounded-scope 0.5 FTE roles
- **BSPCE (French options):** ScorePlay as a French SAS likely qualifies. 30% flat tax at sale if tenure ≥ 3 years. Zero employer social charges on the gain. Use aggressively for senior hires

### Methodology

**France:** gross salary + employer social charges (45.5%) + mandatory benefits (€2,740-3,500/yr).

The 45.5% blended rate covers: health/maternity/disability (13%), old-age pension (8.55% capped + 2.02% uncapped), family benefits (5.25%), unemployment (4.05%), Agirc-Arrco supplementary pension (4.72% T1, 12.95% T2), transport levy (2.95% Île-de-France), and other statutory contributions.

Mandatory benefits include mutuelle health supplement (€900/yr), Navigo transit pass (€520/yr), and meal vouchers (€1,320/yr).

**NYC:** base salary + payroll taxes (7-9%) + health/401k/benefits.

Payroll taxes: Social Security (6.20%, capped at $184.5k), Medicare (1.45%, uncapped), FUTA (0.60%), NY SUTA (3.40%), MTA payroll tax (0.60%).

### Per-Role Breakdown

**Senior PM** *(Paris €72k base; NYC $195k base)*

| Component | Paris | NYC |
|---|---|---|
| Base salary | €72,000 | $195,000 |
| Employer charges | €32,800 (45.5%) | $15,900 (8.2%) |
| Benefits | €2,750 | $23,300 |
| **Total** | **€107,550 ($127k)** | **$234,200** |

**Head of Product** *(Paris €100k base; NYC $250k base)*

| Component | Paris | NYC |
|---|---|---|
| Base salary | €100,000 | $250,000 |
| Employer charges | €45,500 (45.5%) | $17,050 (6.8%) |
| Benefits | €3,500 | $28,700 |
| **Total** | **€149,000 ($176k)** | **$295,750** |

**Senior SWE** *(Paris €80k base; NYC $210k base)*

| Component | Paris | NYC |
|---|---|---|
| Base salary | €80,000 | $210,000 |
| Employer charges | €36,400 (45.5%) | $16,200 (7.7%) |
| Benefits | €2,800 | $24,900 |
| **Total** | **€119,200 ($141k)** | **$251,100** |

**Senior Product Designer** *(Paris €58k base; NYC $140k base)*

| Component | Paris | NYC |
|---|---|---|
| Base salary | €58,000 | $140,000 |
| Employer charges | €26,400 (45.5%) | $12,000 (8.6%) |
| Benefits | €2,700 | $19,100 |
| **Total** | **€87,100 ($103k)** | **$171,100** |`,
  },
]
