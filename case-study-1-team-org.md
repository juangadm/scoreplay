# Case Study 1: Team Organization
## ScorePlay — Head of Product Proposal

---

## Thesis

ScorePlay has spent 24 months building what customers ask for. That's how you survive — it's not how you become defensible. The transition from a customer-dictated roadmap to a product-led one is the difference between a consulting service that scales linearly with headcount and a platform company that compounds. Every structural change below serves one goal: make ScorePlay fast enough to ship its own vision while remaining responsive enough to keep 270+ clients happy.

---

## The Diagnosis

Before proposing a structure, name the root causes:

| Symptom | Root Cause |
|---|---|
| 85–117% scope creep | No intake filter. Work enters the sprint from too many directions. |
| 35–65% completion | Scope creep + empty specs = engineers context-switching constantly. |
| 30+ empty-spec tickets | Specs are written during sprint planning, not before it. |
| Two competing roadmaps | No single owner. Roadmap is a negotiation, not a decision. |
| 60%+ capacity on client fires | No interrupt rotation. Every engineer is reachable, so every engineer gets interrupted. |
| 24 months customer-dictated | Customer requests enter the backlog directly. No filter for "right to win." |

None of these are personnel problems. They're structural. The fix is org design, not hiring or motivation.

---

## The Org Model: Intentionally Asymmetric

The instinct at this team size is to create balanced squads — one per product surface or tier. Resist that. A symmetrical org chart should raise suspicion. You design your org the way you want your product to perform — and you will ship your org structure.

ScorePlay's products — Creator, Studio, Pulse — are not three separate products. They are tiered capabilities of one product. Creator is the core DAM. Studio unlocks live ingest, Adobe Premiere, and social publishing. Pulse adds enterprise storage and custom integrations. Stats is the only genuinely new bet outside this upgrade path.

This matters structurally: there is no "Live squad" or "Distribute squad" to create. The product is one thing at three price points. The org should reflect that.

**The wrong model:** Three squads, one per tier. This creates symmetric orgs with diffuse focus and engineers building features to justify their squad's existence.

**The right model:**

```
ONE LARGE CORE SQUAD (~9–10 engineers)
  Creator + Studio + Pulse — the full product, the main thing
  Owns: feature work, tech debt paydown, client escalations (via rotation)
  Staffed: backend (Go), frontend (React), video specialists, mobile, DevOps
  Led by: EM, with Delivery Lead on process
  PM role: connective tissue, not gatekeeper (see below)

ONE TEMPORARY PROJECT SQUAD (~2–3 engineers)
  Stats — a genuinely new surface with its own UX and data model
  Disbanding condition defined upfront: "This squad exists until Stats is GA
  and integrated into the core tier upgrade path. Target: Q3 2026."
  Kill criteria stated at formation, not discovered later.

PLATFORM / INFRA: embedded in Core Squad, not siloed
  Dedicated infra engineers are never isolated into a "platform team."
  Pure platform teams end up too far removed from business context.
  Keep them in the van.
```

**What this looks like on the org chart:**
One large lopsided core team. One small time-boxed stats team. No video specialists siloed away from the rest of product. No "Studio squad" that builds features nobody wanted because they needed to justify their existence.

**Open questions for discussion:**
- How do video specialists currently split time between feature work and live operations? Is there a natural on-call pattern we should formalize, or does video work flow through normal project priorities?
- What's the right escalation path when multiple projects need video expertise simultaneously?

---

## The PM Model

With 2 PMs for 10–12 engineers, the ratio is already healthy (~1:5–6). The question is how PMs operate, not how many there are.

**Wrong:** PM as backlog manager and ticket writer. This turns PMs into project managers and removes ownership from engineers.

**Right:** PMs as connective tissue — synthesizing feedback, defining intent, surfacing downstream effects. Engineers write their own tickets. One owner per issue — no shared ownership.

**Spec format (plain language, 3 components):**
1. What's the situation? (Context)
2. What do we want to happen? (Intent)
3. What breaks if we get this wrong? (Downstream effects)

No "As a user I want to..." language. No epics. No story points on unspecced work. Just say what you want done.

**Rule:** Nothing enters a cycle without all three fields filled. This is enforced by the Delivery Lead at cycle entry, not by PMs retroactively.

---

## Design: The Missing Leg of the Tripod

Design is not mentioned once in the case brief. That is the finding.

ScorePlay's primary users — social media managers, PR teams, broadcast editors — live inside this product for hours every day. They are not developers. They are creative professionals whose output (the post, the press release, the broadcast package) is time-sensitive and emotionally high-stakes. The quality of their experience with ScorePlay's UI is directly tied to whether they renew, expand, or churn. This is a design-sensitive product being built without a named design function.

The tripod: PM + Engineer + Designer working together from the start of every project — not designer consulted at the end to polish what engineers already built. Remove the designer from that tripod and you get fast-moving features that are technically correct and experientially confusing.

**Recommendation: hire 1 designer and embed them in the Core Squad.**

At 10–12 engineers, 1 full-time designer is the right ratio — not a freelancer, not a contractor, not a PM who "has good taste."

**Where design lives:** Product org. Reports to HoP. Not a satellite of marketing, not shared with brand. Seat at the table on every spec from day one.

**What this designer owns:**

| Domain | What it means in practice |
|---|---|
| Search UX | The semantic search bar is the whole Case 2 bet. Its design is the product. |
| Media detail view | The moment a user finds an asset and acts on it. Highest-frequency interaction in the product. |
| Distribution flows | Portal creation, mobile share, permission management — currently functional, likely not delightful. |
| Design system | One shared component library for all surfaces. Reduces eng rework, enforces visual consistency, speeds up new feature scaffolding. |
| Onboarding | New orgs (ScorePlay has 270+) likely get dropped into the product cold. A designer fixes this at the root. |

**Design + AI:** Same access model as PMs — READ access to codebase minimum. A designer who can read component code writes better specs and can propose changes that are actually buildable. Figma-to-code handoffs via tools like Cursor or v0 should be standard workflow, not experimental.

**What to do on Day 1 without a designer yet:** Run a "design audit" in Week 1. Ask every PM and engineer: *"Which part of the product would you be embarrassed to show a new customer?"* That answer is the design backlog. Prioritize it before hiring so the first designer walks in with a clear first project.

**On budget:** A senior product designer in Paris costs ~€87k fully loaded (~$103k). NYC equivalent: ~$171k. Paris is ~1.66x cheaper. This is not a role to offshore or freelance — design consistency requires a dedicated person who ships alongside the team. (See Appendix for full cost methodology.)

---

## Demand Triage: Fixing the Intake Problem

**The current state:** Customer requests enter the backlog. Sales and CS escalate directly to engineering. Two roadmaps exist because there's no decision-making structure above them.

**The fix — three separate queues:**

| Queue | Source | Owner | SLA |
|---|---|---|---|
| **Interrupt rotation** | Client fires, production bugs | 1 engineer/cycle on rotating duty | <24h |
| **Customer-requested features** | CS, Sales escalations | HoP filters via "right to win" test | Quarterly backlog review |
| **Platform roadmap** | Internal — tech debt, infra, new product bets | EM + HoP jointly | Quarterly planning |

**"Right to win" filter:** Every customer request must answer: Is this only valuable to one customer, or does it make the product better for all customers at this tier? If one customer, it's professional services, not product. If it's universal, it enters the backlog with a priority score.

**Interrupt rotation:** One engineer per cycle is designated interrupt-duty. All client fires and P0 bugs route through them. Every other engineer is protected. This is the single highest-leverage change — it immediately frees 40–60% of engineering capacity that's currently bled out in context switching.

**Contractual requests:** Flag at intake, price separately if truly bespoke. Don't let contracts define the roadmap. Define a "product obligation window" — if a contractual feature is also on the roadmap, it ships with the roadmap. If not, it gets a separate estimate.

---

## Tech Debt: Audit First, Then Allocate

The case brief flags "significant frontend + backend tech debt with no paydown plan." The instinct is to prescribe a fixed allocation — 20% of every cycle for tech debt. That's premature. We don't know the composition of the debt, and a blanket percentage treats all debt equally when it isn't.

**Week 1 action:** Run a tech debt audit with the EM. Ask every engineer to list the top 3 things in the codebase that slow them down or scare them. Categorize the results:

| Category | Examples | Who can fix it |
|---|---|---|
| **Config-layer debt** | Hardcoded client overrides, copy buried in code, manual taxonomy updates | CS with structured codebase access (see AI-First section) |
| **Application debt** | Duplicated logic, missing abstractions, slow queries, test gaps | Core Squad engineers, addressed alongside feature work |
| **Infrastructure debt** | CI/CD bottlenecks, deployment fragility, monitoring gaps | DevOps / infra engineers embedded in Core Squad |

The key insight: a meaningful portion of what feels like "tech debt" is actually config-layer work that CS can own with proper guardrails. Every config change that CS handles directly is one fewer interrupt for engineering — and one fewer piece of debt that accumulates from quick-fix workarounds.

**For application and infra debt:** Don't create a separate "tech debt cycle" or allocate a fixed percentage. Instead, attach debt paydown to feature work. When an engineer is building in an area with known debt, the spec includes the cleanup. This keeps debt reduction connected to business value and prevents it from becoming a deprioritized backlog that never ships.

**For high-severity debt** (the "things that scare engineers" category): these go on the platform roadmap queue and get scheduled in quarterly planning alongside new product bets. They're treated as projects, not background tasks.

---

## Cadence & Delivery

Rigid two-week sprints with heavy planning ceremonies don't work well at this team size. They create overhead and false precision. The right model is lighter: weekly cycles with project-based delivery commitments.

**Weekly cycles, not rigid sprints:**
- Each project or initiative has a single owner — an engineer, designer, or PM — who commits to a delivery date.
- Weekly Monday check-in (30 min max): each project owner gives a status update. Three states: on track, blocked, date moved. No story points, no velocity calculations.
- The Delivery Lead runs this check-in and maintains a single view of all active projects and their committed dates.

**Why weekly:** One-week cycles keep the feedback loop tight without the overhead of full sprint planning. Nothing hides for two weeks. If something is off track, you know on Monday, not at a retrospective 10 days later.

**Project ownership, not ticket assignment:**
- Work is organized as projects with clear outcomes, not as lists of tickets to complete.
- Each project has a written spec (3-field format) and a committed delivery date before it starts.
- The project owner is accountable for the outcome, not just for closing tickets. They pull in collaborators as needed.
- One owner per project. No shared ownership, no ambiguity about who's driving.

**What the Delivery Lead owns:**
- The weekly check-in cadence
- The project status board (one view, all active work, all committed dates)
- Enforcing the spec gate at project entry
- Flagging when too many projects are active for the team's capacity

**Quarterly planning:**
- Projects are sourced from the three queues (interrupt, customer-requested, platform roadmap).
- HoP + EM jointly prioritize the quarter's projects. Each one gets a named owner and a target delivery date.
- Mid-quarter: one check-in to assess progress and re-prioritize if needed. No mid-quarter additions unless something is genuinely urgent (filtered through the "right to win" test).

---

## Transition: Week 1 / Month 1 / Quarter 1

**Week 1 — Listen, don't restructure.**
- 1:1s with every engineer, both PMs, Delivery Lead, EM. Ask: "What's the most broken thing?" and "What's working that I should not touch?"
- Audit the two competing roadmaps. Find the overlap — that overlap *is* the real roadmap. Flag divergences to leadership.
- Read the last 3 sprint retros. Map the actual interrupt sources.
- Run the tech debt audit (see above).
- Do not change the cycle in progress. Do not introduce new process. Just absorb.

**Month 1 — Stabilize.**
- Install interrupt rotation immediately — this is day-10 work, not quarter-2.
- Freeze new roadmap additions for 30 days. Only existing commitments move forward.
- Kill one of the two roadmaps. Merge into a single source of truth. Ship it internally before external.
- Introduce spec pre-requisite gate: Delivery Lead checks 3-field spec at project entry. If missing, project goes back. No exceptions.
- Work with EM, not around them. Present changes to the EM first. Get their language on the process changes so it doesn't read as a top-down override.

**Quarter 1 — Structure.**
- Formally reorganize into Core Squad + Stats Project Squad.
- Define Stats disbanding conditions in writing. Announce them to the team.
- First proper quarterly roadmap: presented to company, sourced from customer signal + platform needs, filtered through "right to win." No more competing docs.
- Run a "feature roast": team destructively tests a recent feature, gives immediate feedback. Introduce this as a biweekly ritual.
- First "right to win" retrospective on customer requests from the past quarter: which ones shipped? Which were one-offs? What did we learn?

---

## Rebuilding Momentum

35–65% completion rates don't demotivate teams because engineers are lazy. They demotivate because engineers don't finish things. Every cycle is a visible reminder of what didn't ship.

**The fix is small, completable scopes — not cheerleading.**

Scope features as small as possible to enable constant shipping, immediate feedback, and visible progress.

Concrete changes:
- Cycle goal is one *shipped* thing, not a list of in-progress things. "Beta search bar live for 3 pilot clients" beats "semantic search: 60% complete."
- Bugs: classify as only critical or high severity. Small bugs signal carelessness — fix them fast or close them deliberately.
- First cycle as HoP: **do not blow up the sprint.** Run the current cycle. Introduce interrupt rotation mid-cycle. Let the team close something. Use the completion to build credibility.
- Celebrate shipped things, not started things. One shipped feature in a retro beats three in-progress ones.

---

## AI-First EPD Culture

This is a structural advantage ScorePlay hasn't fully activated.

**For all EPD staff:**
- GitHub Copilot or Cursor for all engineers. Non-optional. Budget: ~$20/user/month.
- READ access to the full codebase for all PMs and designers — minimum. PMs who can read code write better specs.
- LLM-assisted spec drafting: PMs use Claude/GPT to generate first-draft specs from customer interviews. PM reviews and signs off. Reduces empty-spec backlog dramatically.

**For CS — the high-leverage unlock:**
60%+ of engineer capacity goes to client fires. A meaningful fraction of those fires are configuration-layer issues: copy changes, threshold tweaks, permission resets, minor taxonomy updates. These do not require a Go engineer.

**Proposed CS codebase access model:**
- READ access to the full repo for senior CS
- WRITE access limited to: a clearly defined `config/` or `client-overrides/` layer — no logic changes, no schema changes
- All CS-initiated PRs require a 1-engineer review (can be interrupt-duty engineer)
- Estimated impact: removes ~20–30% of interrupt-duty load. Engineers handle infra and new product. CS handles the "I need this tag renamed" class of tickets.

The principle: remove gatekeepers, not to lower standards, but to route work to the right person.

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| One large Core Squad → diffuse ownership | Medium | Project ownership model (one named owner per project) prevents diffusion. Weekly check-in keeps coordination lightweight. |
| Interrupt rotation → rotating engineer falls behind | Medium | Rotations are 1-week. Interrupt duty is the only responsibility that week — no feature commitments. |
| Spec gate → short-term velocity dip | High (temporary) | Expected. Completion rate rises within 2 cycles. The dip surfaces how much unspecced work was entering before. |
| Merging roadmaps → political friction | Medium | Frame as a merger, not a kill. Find the overlap first. Present the merged version as "here's what we agree on" before cutting divergences. |
| CS codebase access → accidental breakage | Low | Strict scope (config layer only), mandatory eng review. Start with READ-only for 30 days before granting WRITE. |

---

## If Case 2 Ships: Org Evolution

Semantic search isn't just a feature — it's a new discipline that eventually requires its own PM surface. The build runs as a temporary project squad embedded in Core (1 ML engineer, 1 backend, 1 frontend, 0.5 PM, 0.5 data engineer). As search matures from feature to product differentiator — the thing that separates Studio from Creator and unlocks Enterprise — it needs a dedicated **Search & Intelligence PM** who owns retrieval quality, ontology governance, and the upsell funnel that semantic search creates. Stats and search will eventually converge into one intelligence layer drawing from the same enriched data model. Don't hire ahead of the need. Hire the Intelligence PM when search is in beta and ontology governance is clearly a bottleneck.

---

## What "Great" Looks Like at 90 Days

- One roadmap. No competing docs.
- Interrupt rotation running. Engineers are not being pulled out of flow.
- Completion rate above 70% for two consecutive cycles.
- Stats squad has written disbanding conditions. Core squad owns everything else.
- CS has READ access and has closed their first config-layer PR.
- One "feature roast" completed. Engineers have been in the room giving and receiving hard product feedback.
- Every project has a 3-field spec at entry.

---

## Appendix: Budget — Paris vs. NYC

ScorePlay is European. The existing team is almost certainly Paris-weighted. This is a structural cost advantage that should be preserved and named explicitly in planning.

### Summary

| Role | Paris fully loaded | NYC fully loaded | Paris cheaper by |
|---|---|---|---|
| Senior PM | €107k ($127k) | $234k | **1.84x** |
| Head of Product | €149k ($176k) | $296k | **1.68x** |
| Senior SWE | €119k ($141k) | $251k | **1.78x** |
| Senior Designer | €87k ($103k) | $171k | **1.66x** |

**Rule of thumb:** Paris fully loaded = base × 1.50. NYC fully loaded = base × 1.20. The gap is driven almost entirely by base salary differences (Paris Senior PM ~€72k vs NYC ~$195k base).

A 4-person EPD team (HoP + Senior PM + Senior SWE + Designer) costs ~€462k/yr fully loaded in Paris (~$545k) vs ~$952k in NYC.

**For the 3.5 FTE needed for semantic search (Case 2):** Paris ~€430–460k (~$507–543k) vs NYC equivalent ~$860k–$950k.

**The tradeoff:** Paris FTEs are ~1.7x cheaper but significantly harder to exit. Wrongful dismissal risk is real (labor court exposure: 3–20 months salary under the Macron scale). Mitigation: CDI for permanent roles; SASU contractor structure for the 0.5 FTE roles (Data Engineer, part-time PM) where scope is bounded and the relationship is project-based.

**BSPCE (French options):** ScorePlay as a French SAS likely qualifies. Tax at sale: 30% flat if employee tenure ≥ 3 years — comparable to US LTCG rates (~34% total). Zero employer social charges on the gain. Use BSPCEs aggressively for senior hires.

**Recommendation:** Keep building in Paris. Reserve NYC hiring for roles requiring US market access (enterprise sales, NBA/MLB business development).

### Detailed Methodology

**France fully-loaded = gross salary + employer social charges (~45.5% on gross) + mandatory benefits.**
The 45.5% blended rate is the sum of statutory employer contributions effective Jan 1, 2026:

| Contribution | Rate | Basis |
|---|---|---|
| Health, maternity, disability, death | 13.00% | Total gross |
| Autonomy solidarity (CSA) | 0.30% | Total gross |
| Old-age pension (capped at €47,100/yr) | 8.55% | First €47,100 |
| Old-age pension (uncapped) | 2.02% | Total gross |
| Family benefits | 5.25% | Total gross |
| Unemployment insurance | 4.05% | Total gross |
| AGS (wage guarantee) | 0.20% | Total gross |
| Agirc-Arrco supplementary pension T1 | 4.72% | First €47,100 |
| Agirc-Arrco supplementary pension T2 | 12.95% | €47,100–€376,800 |
| CEG balance T1 | 1.29% | First €47,100 |
| CEG balance T2 | 1.62% | €47,100–€376,800 |
| Workplace accident insurance (tech, Paris) | ~1.50% | Total gross |
| CPF professional training (>50 employees) | 1.00% | Total gross |
| Apprenticeship tax | 0.68% | Total gross |
| Transport levy (Île-de-France) | 2.95% | Total gross |

Mandatory benefits (mutuelle health supplement 50% employer share ~€900/yr; 50% Navigo transit pass ~€520/yr; meal vouchers ~€1,320/yr) add ~€2,740–€3,500/yr depending on seniority.

**USA (NYC) fully-loaded = base salary + employer payroll taxes (~7–9% effective) + health insurance + 401k match + other benefits.**

| Tax | Rate | Cap (2026) |
|---|---|---|
| Social Security (FICA) | 6.20% | First $184,500 |
| Medicare (FICA) | 1.45% | No cap |
| Federal unemployment (FUTA, effective) | 0.60% | First $7,000 |
| NY State unemployment (SUTA) | 3.40% | First $13,000 |
| MTA payroll tax (NYC metro) | 0.60% | No cap |

### Fully-Loaded Breakdown by Role

**Senior PM** *(Glassdoor Paris avg €75.7k / Levels.fyi €60–93k → using €72k; NYC Wellfound startup avg $166k / Levels.fyi Series B range → using $195k)*

| Component | Paris | NYC |
|---|---|---|
| Base salary | €72,000 | $195,000 |
| Employer social / payroll taxes | €32,800 (45.5%) | $15,900 (8.2%) |
| Benefits (health, transit, 401k etc.) | €2,750 | $23,300 |
| **Total fully loaded** | **€107,550 (~$127k)** | **$234,200** |

**Head of Product** *(Glassdoor Paris €85–120k → using €100k; NYC Glassdoor/Levels.fyi HoP at Series B → using $250k base)*

| Component | Paris | NYC |
|---|---|---|
| Base salary | €100,000 | $250,000 |
| Employer social / payroll taxes | €45,500 (45.5%) | $17,050 (6.8%) |
| Benefits | €3,500 | $28,700 |
| **Total fully loaded** | **€149,000 (~$176k)** | **$295,750** |

**Senior SWE — Backend / Go** *(Glassdoor Paris avg €71.5k / Levels.fyi €62–102k → using €80k; NYC Levels.fyi startup range → using $210k)*

| Component | Paris | NYC |
|---|---|---|
| Base salary | €80,000 | $210,000 |
| Employer social / payroll taxes | €36,400 (45.5%) | $16,200 (7.7%) |
| Benefits | €2,800 | $24,900 |
| **Total fully loaded** | **€119,200 (~$141k)** | **$251,100** |

**Senior Product Designer** *(Glassdoor Paris UX/Product Designer senior ~€55–68k → using €58k; NYC Glassdoor/Wellfound senior designer at startup → using $140k)*

| Component | Paris | NYC |
|---|---|---|
| Base salary | €58,000 | $140,000 |
| Employer social / payroll taxes | €26,400 (45.5%) | $12,000 (8.6%) |
| Benefits | €2,700 | $19,100 |
| **Total fully loaded** | **€87,100 (~$103k)** | **$171,100** |
