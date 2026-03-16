# 🎯 Hiring Case Studies

Source: https://scoreplay.notion.site/hop-case-study

---

## Case Study 1: Team Organization

### Context

ScorePlay is a sports media platform (270+ clients: NBA, MLB, NHL, Netflix, Liverpool FC, etc.) spanning four product domains: Vault (MAM), Live (video ingest/clipping), Distribute (sharing/portals/mobile), and Stats (emerging).

Team: ~10-12 engineers, 2 PMs, 1 Delivery Lead, 1 EM (single EM across entire org). Mix of backend (Go), frontend (React), video specialists, mobile, and DevOps.

What's broken:

- Sprint scope creep: 85-117% additional work added mid-sprint
- Sprint completion: 35-65% of planned work delivered
- 30+ tickets in active sprints with empty specs
- Two competing draft roadmaps, no single source of truth
- Roadmap has been customer-dictated for 24 months
- 60%+ engineering capacity consumed by client fires, no interrupt rotation
- Significant frontend + backend tech debt with no paydown plan

### Assignment

You're joining as Head of Product. Present a plan covering:

**Team Structure:** How would you organize this team? Feature teams, squads, hybrid? How do you handle the Live/video specialization vs. cross-cutting needs? Where does tech debt fit?

**Demand Triage:** High-value customers push features constantly (some contractual). How do you balance customer requests vs. platform roadmap? How do you create a sustainable bug-fix cadence and interrupt rotation?

**Transition:** What does week 1, month 1, quarter 1 look like? How do you work with the existing Delivery Lead and EM without creating turf conflicts?

**Motivation:** Engineers feel perpetually behind at 35-65% completion. How do you rebuild momentum? How do you handle your first sprint: big bang or incremental?

**Spec Process:** Projects arrive at sprint planning without engineering breakdown. How do you fix this bottleneck?

### What We're Evaluating

- Specificity over generic frameworks: reference actual team size and constraints
- Tradeoff awareness: every model has a cost, name it
- Phasing: day-1 triage vs. quarter-2 structural changes
- Collaboration instinct: working with existing leaders, not overriding them
- Pragmatism: we've tried Scrum, Shape Up, and ad-hoc; build for this team

---

## Case Study 2: Semantic Search

### Context

ScorePlay users search media via structured filters (dropdowns: player, event, tag, date) powered by Elasticsearch. This works for users who know the taxonomy.

It fails when intent is fuzzy: "emotional celebration photos from last home match" or "behind the scenes content with fans." No dropdown can express this. Semantic search closes the gap: natural language queries matched by meaning, not keywords.

### Assignment

Build a comprehensive proposal covering product, engineering, commercial, and GTM:

**Product Strategy:** Who benefits most? What's the UX? How does it coexist with structured search? Name 5 queries users can't express today.

**Pricing & Packaging:** Include in all plans, tier-gate, or add-on? How does this affect Series B positioning?

**Technical Architecture:** Be specific.

- Embedding model: which one, why, multilingual considerations, cost/M tokens
- Vector database: ES kNN vs. dedicated (Turbopuffer, Pinecone, pgvector): evaluate at least 2, recommend one
- Embedding content: which fields, template vs. raw concatenation, handling assets mid-processing
- Pipeline: real-time vs. batch vs. CDC, re-indexing on tag updates, full query flow

**Cost Estimation:** Back-of-envelope: embedding backfill + ongoing, vector storage at 150M assets, query costs, total monthly.

**Engineering Plan:** Staffing, phased rollout (alpha > beta > GA), milestones, risks.

**Go-to-Market:** Announcement strategy, pilot customers (name 3 + why), success metric at 90 days.

### Reference Material

- API docs: developer.scoreplay.io (investigate independently), API key: `4139ee71-7a85-4`
- Infra context: AWS (S3, ECS, RDS, CloudFront), Go backend, Postgres source of truth, Debezium/Kafka CDC, existing Elasticsearch cluster
- Data model: events-based taxonomy, AI auto-tagging (face recognition, scene detection), multi-tenant isolation per org

### What We're Evaluating

- Product instinct: why this matters for ScorePlay's users specifically
- Technical depth: specific, defensible infrastructure choices
- Commercial thinking: pricing, packaging, Series B narrative
- Cost awareness: credible numbers, not "it depends"
- Execution planning: phased, realistic staffing, measurable milestones
- GTM sense: launch, adoption, success metrics

> **What great looks like:** A real product proposal you could present to investors. Specific numbers, named tradeoffs, a phased plan, and a clear recommendation.
