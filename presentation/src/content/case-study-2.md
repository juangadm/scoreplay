# Case Study 2: Semantic Search
## ScorePlay: Product Proposal

# PAGE ONE: EXECUTIVE SUMMARY

---

## The Problem

Media managers and PR teams waste significant time browsing filtered results for content they can describe in plain language but cannot express as a dropdown selection. The tool works for power users who know the taxonomy. It fails for everyone else, and the "everyone else" case is the most common and most time-sensitive one.

**Observed in demo:** When typing "celebration" into the search bar, the system surfaces zero matching tags and falls back to three literal text options only:
- `File name contains: "celebration"`
- `Description contains: "celebration"`
- `Video transcript contains: "celebration"`

The Advanced Search modal offers only boolean tag logic (must match / must not match). No free text. No relevance ranking.

**5 queries users cannot express today:**

| Query | Why it fails |
|---|---|
| *"Emotional moment right after the equalizer"* | No emotion tags exist. "Goal" returns all goal assets with no mood distinction |
| *"Behind the scenes footage with fans"* | No "behind the scenes" concept in any observed taxonomy |
| *"Close-up of goalkeeper under pressure"* | No composition or shot-type tags exist |
| *"Pre-match player portraits from this season"* | Cannot combine temporal context (pre-match) with visual composition |
| *"Crowd reaction to a big moment"* | Crowd-as-subject is not a tag concept |

**What is currently tagged:** Manual taxonomy tags (year, team, venue, league, match type) + AWS Rekognition player identity tags + Google Vision/Gemini sponsor logo tags + Opta/SportRadar match event tags for live video (goal, card, substitution). No scene description, no emotional register, no compositional tags exist anywhere in the current system.

### Why This Is Existential

If ScorePlay remains a taxonomy-dependent search tool, it is a storage and distribution product. Storage gets commoditized. Infrastructure doesn't. ScorePlay cannot stay a vertical SaaS tool that competes on features (features get replicated). It needs to become a content intelligence layer that compounds with every asset ingested and becomes harder to displace over time.

Semantic search is the first step. It solves the immediate UX problem and lays the foundation for everything that follows.

---

## North Star Metric

**Time to asset:** seconds from search query to asset click. Baseline on structured search with pilot clients, compare against semantic search. Target: 60% reduction at 90 days post-GA, 75% on match days. If a social media manager finds the right clip in 15 seconds instead of 3 minutes, they use ScorePlay more, publish faster, and never switch. That's retention.

## Go-to-Market

Oakland Roots (alpha, Week 3) → Liverpool FC (beta, Week 9) → MLS league-wide (GA, Week 13). Start with a single hungry team for fast daily feedback, expand to Liverpool where internal champions already exist and the ROI case is pre-validated, then scale to 30 clubs in one deployment. Tier-gated pricing: semantic search in Professional and Enterprise only, structured filters in Creator.

---

## The Solution: Two Layers, One Foundation

**Layer 1: Semantic Search** *(what users see)*
Natural language queries mapped to visual content via a joint image-text embedding model. Users describe what they want; the system finds assets by visual and contextual similarity. Coexists with existing structured filters; the filter bar remains for users who prefer it. The search bar interface stays familiar. The intelligence behind it changes.

**Layer 2: Universal Ontology** *(what nobody sees)*
A standard 7-dimension content description applied to every asset at ingest, silently, on top of whatever client tags exist. The dimensions (subject, action, setting, temporal context, emotional register, visual properties, rights) are media-universal: they describe a sports photo, a fashion editorial, a news wire image, and a Netflix still equally well. Sports is where it launches; the ontology is designed to work across any media vertical. ScorePlay owns and defines this layer. Objective context (goal, match minute, score state in sports; scene, episode, talent in entertainment) is joined from structured data feeds, not inferred by AI. Subjective visual content (emotional register, composition, crowd atmosphere) is extracted by vision model. The client's taxonomy is untouched. The enrichment layer runs underneath.

This is the moat. Any competitor can add a vector search bar. No competitor can replicate a corpus of 150M+ assets enriched with a consistent intelligence layer without years of ingestion and the client relationships to get there.

---

## What This Unlocks Long-Term

```
Phase 1 → Natural language search within client library
Phase 2 → Universal ontology: ScorePlay owns the content intelligence layer.
          Proprietary data asset that compounds with every upload.
Phase 3 → Cross-org permissioned search: sponsors, media companies, leagues
          search across multiple org libraries, in plain language, with rights scoping.
          (Example: Nike searches NFL assets filtered to what Nike has licensed.)
Phase 4 → Open API / plugin platform: third parties build tools on top of the
          enrichment layer. The Vercel marketplace model for media.
          ScorePlay is infrastructure, not just a product.
```

The Series B narrative: **ScorePlay is building the content intelligence infrastructure for media**, the layer between raw assets and any application that needs to understand them. It starts with sports because that's where the client base, the data feeds, and the urgency are. But the ontology is domain-agnostic by design. It becomes the standard through which visual media (sports, entertainment, news, fashion) is described, discovered, licensed, and built upon.

---

## Technical Direction

### Phase 1: What Powers Semantic Search

Phase 1 uses CLIP visual embeddings stored in Elasticsearch as dense kNN vectors. No new infrastructure. ES is already in the stack (confirmed in case brief) and supports kNN vector search in v8.x. A text query ("celebration") is encoded using the same CLIP model that encoded the images, so text and image live in the same vector space. Similarity search returns visually and contextually matching assets without requiring any tag match.

**Embedding model:** Jina CLIP v2 (open source). Chosen over standard OpenAI CLIP because it supports 89 languages (French, Spanish, Portuguese, German, Arabic) all represented in ScorePlay's current client base. ([source](https://jina.ai/models/jina-clip-v2/)) Standard CLIP is English-only and insufficient for this client mix. Jina CLIP uses the same joint image-text embedding architecture, is self-hostable on ECS (already in stack), and has no per-query API cost.

**What gets embedded:** For photos, the image itself is encoded by Jina CLIP (visual embedding). For video, sampled frames are encoded. No text concatenation into the embedding input. Instead, existing structured metadata (tags, player names, event context, description) is stored alongside each vector as filterable metadata. This keeps the visual embedding space clean and avoids polluting CLIP's joint space with noisy text. Hybrid queries ("Wolfgang Prentice celebrating") work by combining a metadata pre-filter (player = Prentice) with a semantic vector search (celebrating). Assets mid-processing (partially tagged, no enrichment yet) are still searchable the moment CLIP embedding completes; enrichment metadata fills in asynchronously.

**Re-indexing on tag updates:** When a client updates tags on an existing asset, the existing Debezium/Kafka CDC pipeline (already in stack) captures the mutation and updates the vector's metadata in the index. No re-embedding needed, because tags are metadata, not part of the vector. Ontology re-enrichment (Phase 2) only triggers on model upgrades, not on tag changes.

**Phase 1 vector store:** Existing Elasticsearch kNN. Zero new infrastructure to stand up. Sufficient for per-org pre-filtered search at current library sizes.

### Phase 2+: Dedicated Vector Database

At 150M+ assets and with cross-org search requirements, ES kNN is not the right long-term choice. Evaluated options:

| Option | Cost/1M vectors/mo | Strengths | Weaknesses |
|---|---|---|---|
| **ES kNN** | Already paying | Zero new infra, hybrid text+vector search | Not purpose-built, memory-intensive at scale, performance degrades above ~10M vectors |
| **Pinecone** | ~$0.096/1M read units (per query operation, not per vector stored; storage billed separately at ~$0.33/GB) | Managed, mature, excellent performance | Expensive at 150M+ scale, vendor lock-in, not AWS-native |
| **Turbopuffer** | ~$1.00/1M vectors/mo storage + $4.00/1M queries ([source](https://turbopuffer.com/pricing); quantization reduces effective footprint) | S3-native (matches existing AWS stack), aggressive quantization, fast retrieval, significantly cheaper than Pinecone at scale | Less mature, smaller community |
| **pgvector** | ~$45K–80K/yr self-hosted, ~$180K–280K/yr on RDS | Native to Postgres (already source of truth), eliminates sync overhead, pgvectorscale DiskANN shows strong results at 50M vectors | Cannot handle 2.79B vectors on RDS. No public benchmarks above 50M. HNSW index alone requires 25–33 TB. Billion-scale builds need 60+ GB RAM and months of initial indexing |

**Recommendation: Turbopuffer for Phase 2+.** AWS-native (S3 backend aligns with existing infrastructure), significantly cheaper at scale, and the quantization-first design is the right architecture for retrieval performance at 150M+ vectors. ES kNN bridges to Phase 2 without any new infrastructure ask.

---

## Performance Targets

| Metric | Target | Notes |
|---|---|---|
| Search retrieval latency | **<35ms** | Pre-filter to org sub-corpus → HNSW ANN → metadata re-rank |
| Live asset: ingest to searchable | **<30 seconds** | Priority queue for live event uploads |
| Archive asset: ingest to searchable | **<5 minutes** | Standard async queue |

---

## Success Metrics by Phase

Metrics are time-based. For ScorePlay's users (social media managers, PR teams, broadcast editors), time saved is the value. Dollar savings are secondary.

**Phase 1, End of Week 3 (internal alpha):**
- Natural language queries return relevant results for the 5 query types that currently fail
- Zero-result rate on intent-based queries measurably lower than structured filter baseline (to be baselined with pilot clients at kickoff)

**Phase 2, End of Week 9 (beta launch):**
- 100% of new uploads enriched with ontology dimensions within 5 minutes of ingest
- Live event turnaround: <30 seconds validated on at least 3 live matches across pilot clients
- Enrichment accuracy spot-check: >85% precision on emotional register and composition tags (manual review sample)

**Phase 3, End of Week 13 (GA):**
- At least 1 pilot client's social team reports finding assets for post-match posts without using the filter bar
- At least 1 cross-org permissioned search session demonstrated with a pilot client and a partner/sponsor
- 90-day retention: pilot clients using semantic search in >50% of their weekly sessions

---

## Engineering Timeline (13 weeks / 90 days)

```
PHASE 1: SEMANTIC SEARCH (Weeks 1–3)
Weeks 1–2:   Jina CLIP deployed on ECS. Embedding pipeline for new uploads.
             ES kNN index populated for pilot client libraries.
Week 3:      Semantic search UI. NL query bar integrated alongside
             existing filter bar. Internal alpha live.

PHASE 2: ENRICHMENT + SCALE (Weeks 4–9)
Weeks 4–6:   Gemini Flash enrichment pipeline at ingest.
             Opta/SportRadar data join (objective sports context).
             Ontology dimensions 1–6 writing to metadata.
Weeks 7–8:   Turbopuffer migration. Hot/cold index split.
             Priority queue for live events. <30s target validated.
Week 9:      Beta launch with 3 pilot clients.

PHASE 3: HARDEN + GA (Weeks 10–13)
Weeks 10–11: Cross-org permissioning layer. Rights metadata.
             Pilot sponsor/partner search session.
Week 12:     GA readiness. Monitoring, alerting, SLA.
Week 13:     GA launch.
```

**Staffing:**
- 1 ML engineer (embeddings, enrichment pipeline, model ops)
- 1 backend engineer (ingest pipeline, vector DB, API)
- 1 frontend engineer (search UX, filter integration)
- 0.5 PM (pilot coordination, success metrics)
- 0.5 Data engineer (Opta join, ontology schema)

---

## Pricing & Packaging Recommendation

**Tier-gate, not add-on.**

Semantic search included in Professional and Enterprise plans only. Creator (entry tier) retains structured filter search. Every free-trial or entry-plan user who types a natural language query and hits a paywall sees the exact feature they want. This is a clean, demonstrable upgrade trigger.

For Phase 3 cross-org search: proposed consumption-based model (per external query or per licensed asset download). This is a hypothesis. The commercial structure depends on how rights agreements are structured with clients and requires validation. It does not exist today.

**Series B framing:** Semantic search makes ScorePlay's value defensible on two axes: user stickiness (the tool is now irreplaceable for daily workflows) and data moat (the enrichment layer is proprietary and compounds with scale).

---

---

# APPENDICES

---

## Appendix A: Current State Audit

### What Search Looks Like Today

**Global search bar** (Media Library):
- Placeholder: "Search by keyword, tag, player, team, season etc."
- On empty open: autocomplete dropdown with pre-indexed values grouped by Tags, Teams, Metadata, Credits, Format, Free tags, Seasons
- On text input ("celebration"): zero tag matches → falls back to literal text options only: File name contains / Description contains / Video transcript contains
- No semantic understanding. No fuzzy matching. No relevance ranking.

**Filter bar:**
`Date` | `Players` | `# of players` | `Sponsors` | `Season` | `Team` | `Format`
(Sport, Category, Credits: disabled in demo org)

Players filter surfaces face-recognition-identified athletes with asset counts (Ne Hackshaw 7, Kendall McIntosh 7, Wolfgang Prentice 6, Jose Sinesterra 2).

**Advanced Search modal:**
- View as: permission scoping dropdown
- Must match: Tags (multiselect)
- Must not match: Tags (multiselect)
- Save: toggle
- Purely boolean tag logic. No free text. No relevance ranking.

### Tag Origin Model

| Tag type | Origin | Notes |
|---|---|---|
| `home`, `match`, `usl`, `toyota field`, `2025` | Manually created in taxonomy by org admin | 100% client-defined, client-scoped |
| `Wolfgang Prentice`, `Ne Hackshaw` | AWS Rekognition face recognition | Applied per-asset at ingest |
| `Anthem`, `Oakland Roots SC` (logo) | Google Vision / Gemini logo detection | Applied per-asset at ingest |
| `goal`, `yellow card` (live clips only) | Opta / SportRadar / Transfermarkt match data feed | Via Video Logs API (`ActionClip` endpoint) |

### API Findings: No Hidden Enrichment Layer

Full Media object schema (~20 fields) reviewed. Zero fields named `category`, `scene`, `content_type`, `ai_tags`, `enrichment`, or `auto_tags`. All TagOptions have a `company_id`, so every tag is 100% client-scoped. No system-level universal tags anywhere in the schema.

**One existing enrichment hook found:** Upload endpoint has `skip_team_tags` parameter: *"Whether to skip automatic team tag assignment."* ScorePlay already injects team tags at ingest from event hierarchy context. The enrichment pipeline pattern exists. It runs one rule today. The universal ontology layer extends this pattern.

**Transcription:** `transcript_query` field exists on event search but transcript data is not returned via API. Opaque background pipeline, surfaces only as a keyword search filter.

---

## Appendix B: Universal Ontology

### Design Principles

1. **Strict universality test**: a dimension only qualifies if it applies equally to a sports photo, a fashion editorial, a news wire image, and a Netflix still.
2. **Orthogonality**: dimensions must be independent. Collapse overlapping concepts (emotion + mood → one dimension).
3. **Operationalizability**: every value must be assignable by a human in <10 seconds or by a model with >80% precision. Reject abstract dimensions that fail this test.
4. **LSCOM constraint** ([Naphade et al., IEEE Multimedia 2006](https://ieeexplore.ieee.org/document/1667983/), [Hauptmann et al., ACM MM 2007](https://dl.acm.org/doi/10.1145/1282280.1282369)): The LSCOM project annotated 449 concepts total; related retrieval research demonstrated effective news video retrieval using 300-concept subsets. The specific claim that annotator agreement degrades below 70% above ~400 concepts is an analytical extrapolation from annotator-burden findings, not a direct quote from the original paper. Total leaf nodes in this ontology: ~230.

### The 7 Universal Dimensions

| # | Dimension | Universal? | Domain-specific branch |
|---|---|---|---|
| 1 | **Subject**: entity type, count, identity | ✅ | Identity links to domain registries (player DB, talent DB) |
| 2 | **Action / Activity**: what is happening | ✅ root | Branches: Sports / Fashion / News / Entertainment |
| 3 | **Setting**: environment, venue, geography | ✅ | Venue category branches by domain |
| 4 | **Temporal Context**: calendar time + narrative/event time | ✅ root | Event phase branches: Match Phase / Show Phase / News Cycle |
| 5 | **Emotional / Affective Register**: valence + arousal | ✅ fully | No domain branching needed |
| 6 | **Visual Properties**: shot type, angle, composition, lighting | ✅ fully | No domain branching needed |
| 7 | **Rights & Provenance**: creator, rights status, releases | ✅ fully | No domain branching needed |

### Objective vs. Subjective Distinction

**Do not re-derive with AI what the data feed already knows:**

| Signal | Source | Cost |
|---|---|---|
| Goal, card, substitution, match minute, score state | Opta / SportRadar data join | Near-zero (already ingested via Video Logs API) |
| Player identity | AWS Rekognition (already running) | Already paid |
| Sponsor logos | Google Vision (already running) | Already paid |
| **Emotional register, shot composition, crowd atmosphere** | Vision model (Gemini Flash) | New cost (this is where AI adds net-new value) |

### Key Insight: Score State as a Dimension

No existing sports media taxonomy includes score state at the moment of capture. A goal celebration at 0–0 in the 2nd minute is stock footage. A goal celebration when equalizing in the 90th minute is a cover image. The visual content can be identical; context creates the meaning. This dimension is computable by joining the match event timestamp with the scoreline from the data feed, no AI inference needed.

### Derived Moment Type (computed, not manually tagged)

Rather than asking anyone to label "decisive goal," compute it from atomic dimensions:
- `action=goal` + `match_minute ≥ 75` + `score_state=trailing` + `emotional_valence=positive_high` → **Decisive equalizer**
- `action=save` + `match_minute ≥ 85` + `score_state=leading_by_1` → **Match-saving stop**

Auditable, adjustable, zero tagger burden. The rule can be updated without re-tagging the corpus.

### Video Embedding Architecture Decision

ScorePlay assets are a mix of photos and video clips (max 2 minutes per client brief). Three approaches were evaluated:

| Approach | Method | Cost | Quality | Verdict |
|---|---|---|---|---|
| **Uniform frame sampling** | Extract 1 frame per N seconds via ffmpeg; embed each frame with Jina CLIP | Lowest | Good for clip-level retrieval | ✅ **Recommended** |
| Scene detection | PySceneDetect finds cut boundaries; embed 1 representative frame per scene | Medium | Better for variable-content clips | Overkill for 2-min sports clips |
| Dedicated video model | VideoClip, InternVideo (trained on video sequences, captures motion) | Highest | Best for temporal queries | No multilingual support; different infra |

**Recommendation: 1 frame per 2 seconds (uniform sampling).** ([source](https://arxiv.org/html/2408.03340v1))

Rationale: the retrieval goal is "find the right clip," not "find the right frame." A query for "goalkeeper save" needs to surface the clip containing the save. Two-second granularity ensures any sub-second action moment is within ±1s of a sampled frame, which is sufficient precision for clip-level discovery. 1fps (120 frames per 2-min clip) is unnecessary overkill. CLIP encodes visual similarity and adjacent frames cluster together in embedding space, so the marginal precision gain above 1 frame/2s is negligible. Scene detection adds complexity with marginal gain for short sports clips. Dedicated video models add infrastructure dependency and lose Jina CLIP's multilingual advantage.

**True embedding count implications:**
- Assumed asset mix: 60% photos, 40% video clips (conservative, actual ratio should be confirmed with ScorePlay engineering)
- Average clip duration: 90 seconds (assumed; consistent with max 2-minute clips per client brief)
- Frames per average clip at 1 frame/2 seconds: **45 frames**
- Photo embeddings: 90M assets × 1 = 90M vectors
- Video embeddings: 60M clips × 45 frames = 2.70B vectors
- **True corpus size: ~2.79B vectors**, approximately 18× the asset count
- Frame-level vectors point back to parent asset via metadata -retrieval returns the clip, not the individual frame

### Phase Scope

**Phase 1 (ship now):** Jina CLIP embeddings only. No explicit ontology tagging. Semantic search works because visual similarity in embedding space proxies for semantic meaning (a query for "celebration" finds celebrations because they cluster together visually). No vision model needed yet.

**Phase 2 (enrich):** Add Gemini Flash ontology extraction. Structured dimensions written as metadata alongside embeddings. Enables faceted semantic search, analytics, and the cross-org marketplace layer.

---

## Appendix C: Technical Architecture

### Full Stack

```
INGEST PIPELINE
───────────────
Upload → skip_team_tags hook (existing)
       → Async embedding queue
         [Live events: priority lane → target searchable in <30s]
         [Archive: standard lane → target searchable in <5min]
       → [VIDEO ONLY] Frame extraction via ffmpeg on Fargate
         (1 frame per 2 seconds; 2-min clip → 60 frames max; avg 90s clip → 45 frames)
       → Jina CLIP embedding (g4dn.xlarge ECS, self-hosted, always warm)
       → Opta/SportRadar data join (objective sports context, free)
       → Gemini Flash enrichment (Phase 2+: subjective ontology dims)
         [Enrichment runs per ASSET, not per frame, cost stays O(assets)]
       → Write vector(s) + metadata to index
         [Per-frame vectors carry parent_asset_id for clip-level retrieval]

INDEX STRUCTURE (Phase 2+: Turbopuffer)
────────────────────────────────────────
Single global index
  per-frame vector:
    vector: 512-dim float32 (Jina CLIP)
    metadata:
      parent_asset_id   ← deduplicates results to clip level
      frame_offset_sec  ← which moment in the clip
      org_id            ← pre-filter anchor
      asset_type        ← photo / video
      permissions[]     ← rights/access control
      ontology.*        ← 7-dimension enrichment (from parent asset)
      tags[]            ← client-defined tags (from parent asset)
      event_context.*   ← from Opta/SportRadar join

RETRIEVAL STACK
───────────────
Query text → Jina CLIP text encoder → query vector
           → Pre-filter: org_id (Phase 1) / permissions (Phase 3)
           → HNSW ANN search on filtered sub-corpus (~5ms)
           → Metadata re-rank: recency boost, player match, format filter (~30ms)
           → Return top-k results
Total target: <35ms
```

### Vector DB Evaluation

**ES kNN (Phase 1)**
- Already in stack. Zero new infra spinup.
- ES 8.x supports HNSW kNN on dense vectors with int8_hnsw quantization.
- Hybrid: run text filter + vector search simultaneously. Useful for "Wolfgang Prentice celebrating" (player filter + semantic).
- **Memory requirement (the hidden cost):** Official ES formula for 512-dim HNSW: `num_vectors × (512 × 4 + 4 × 16)` = **2,112 bytes per vector** (float32). With int8_hnsw quantization: **528 bytes per vector** (75% reduction). ([source](https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-knn-search.html))
  - Phase 1 pilot corpus scope: **photos only + live video frames** (archive video backfill deferred to Phase 2 on Turbopuffer, since backfilling 3 pilot clients' full video libraries at 1 frame/2s would produce ~279M vectors, requiring ~147GB RAM in ES, which is not cost-justified for a 3-week alpha)
  - Phase 1 vectors: 3 clients × 5M assets × 60% photos = **~9M photo vectors** + live video uploads during Phase 1 (~1M new video frames) = **~10M vectors**
  - With int8 quantization: 10M × 528 bytes = **~5.3 GB RAM**, manageable on an upgraded ES node
  - Without quantization: 10M × 2,112 bytes = **~21 GB RAM**, requires r6g.xlarge (31 GB RAM) or larger. ([source](https://aws.amazon.com/opensearch-service/pricing/))
  - Estimated additional ES cost during Phase 1: **~$400–800/month** for 1–2 memory-optimized nodes
  - This cost goes away when full corpus migrates to Turbopuffer at Week 8. Archive video backfill runs on Turbopuffer from Week 11 onward.
- Limitation: not purpose-built for vector search. Not the right choice at 1B+ vector scale or for cross-org queries.
- Verdict: **correct for Phase 1. Plan migration from day one. Budget for node upgrade.**

**Turbopuffer (Phase 2+)**
- S3-backed architecture that plugs directly into ScorePlay's existing AWS/S3 stack.
- Aggressive quantization (binary + int8) with re-ranking pass. Designed for high-throughput low-latency at scale.
- Significantly cheaper than Pinecone at equivalent scale at storage-dominant workloads.
- Less mature than Pinecone. Smaller community. Operational risk to name explicitly.
- Verdict: **recommended for Phase 2+. Cost and architecture alignment outweigh maturity risk given AWS-native infra.**

**Pinecone (not recommended)**
- Mature, excellent performance, strong documentation.
- Significantly more expensive at 150M+ scale.
- Not AWS-native, adds a cross-cloud hop to the retrieval path.
- Vendor lock-in without clear migration path.
- Verdict: fallback if Turbopuffer operational risk proves too high.

### Retrieval Performance Tricks

1. **Pre-filter before vector search.** Filter to org sub-corpus before running ANN. At ~500K assets per large client, even brute-force KNN is <10ms. Never scan all 150M for a within-org query.
2. **HNSW indexing.** Standard approximate nearest neighbor. Tune `M` and `ef_construction` at index build time. More memory → faster, more accurate retrieval.
3. **Quantization.** Compress 512-dim float32 to int8 or binary. Binary = 32x memory reduction. Small re-ranking pass on top-50 candidates maintains full-precision quality.
4. **Hot/cold index split.** Last 7 days in RAM ("hot"). Archive paged from S3 ("cold"). Live event queries almost exclusively hit the hot index.
5. **Priority queue for live uploads + warm GPU.** Live event assets jump the embedding queue. Social media manager can find a goal clip within 30 seconds of photographer upload. **This SLA requires a permanently warm GPU instance.** Cold-starting a GPU instance takes 2–5 minutes, incompatible with a 30-second target. A warm `g4dn.xlarge` (NVIDIA T4, 16 GB VRAM) is sufficient: Jina CLIP v2 requires ~3.5 GB VRAM ([source](https://clip-as-service.jina.ai/user-guides/server/)), leaving headroom for concurrent requests. Standing cost: **~$774/month** for 2 warm instances (redundancy on match days) ([source](https://instances.vantage.sh)).
6. **Two-stage retrieval.** Stage 1: fast ANN, top-1000 candidates (~5ms). Stage 2: exact re-rank with metadata scoring (~30ms). Total: ~35ms.
7. **Query result caching.** Post-match, many users search the same thing simultaneously. Cache top-100 results per popular query, 60-second TTL. CloudFront already in stack.

### Embedding Drift Mitigation

When the embedding model is upgraded (inevitable), old and new vectors cannot coexist in the same index because the vector spaces are different. Mitigation:
- Run new model in parallel index during transition period
- Serve from both indexes, deprecate old progressively
- Plan for full re-index at model upgrade: the true corpus is ~2.79B vectors. At 25 imgs/sec sustained throughput on g4dn.xlarge: 2.79B / 25 / 3,600 = **~31,000 GPU-hours × $0.526 = ~$16,000–21,000** ([source](https://instances.vantage.sh), [benchmarks](https://clip-as-service.jina.ai/user-guides/benchmark/)). Schedulable in off-peak batches, not an ongoing cost.

---

## Appendix D: Cost Model

### The Math at a Glance

```
CORPUS SIZE
  150M assets × 40% video × 45 frames   = 2.70B video vectors
  150M assets × 60% photos × 1 frame    = 0.09B photo vectors
                                           ─────────────────
                                           2.79B vectors total

BACKFILL (one-time)
  2.79B vectors ÷ 25 imgs/sec ÷ 3,600   = 31,000 GPU-hrs × $0.53  = ~$16K  (embed)
  150M assets × $0.00012/asset                                      = ~$18K  (enrich)
  60M clips × ffmpeg on Fargate                                     = ~ $3K  (extract)
                                                                       ──────
                                                                       ~$37K  total

MONTHLY, MONTH 1  (5M new assets/mo)
  5M × 18.6 vectors/asset = 93M new vectors
  93M ÷ 25 ÷ 3,600        = 1,033 GPU-hrs × $0.53  = ~$543   (embed)
  5M × $0.00012                                     = ~$600   (enrich)
  2.79B stored × $1.00/M                            = ~$2,800 (storage)
  2 GPUs × 720 hrs × $0.53                          = ~$774   (live SLA)
  6TB × $0.09/GB                                    = ~$540   (egress)
                                                      ───────
                                                      ~$5,920/mo

MONTHLY, MONTH 4  (10M new assets/mo, library at ~3.1B vectors)
  10M × 18.6 = 186M new vectors
  186M ÷ 25 ÷ 3,600       = 2,067 GPU-hrs × $0.53  = ~$1,086 (embed)
  10M × $0.00012                                    = ~$1,200 (enrich)
  3.1B stored × $1.00/M                             = ~$3,100 (storage)
  2 GPUs × 720 hrs × $0.53                          = ~$774   (live SLA)
  6TB × $0.09/GB                                    = ~$540   (egress)
                                                      ───────
                                                      ~$6,700/mo

MONTHLY, MONTH 10  (40M new assets/mo, library at ~5.1B vectors)
  40M × 18.6 = 744M new vectors
  744M ÷ 25 ÷ 3,600       = 8,267 GPU-hrs × $0.53  = ~$4,344 (embed)
  40M × $0.00012                                    = ~$4,800 (enrich)
  5.1B stored × $1.00/M                             = ~$5,100 (storage)
  2 GPUs × 720 hrs × $0.53                          = ~$774   (live SLA)
  11TB × $0.09/GB                                   = ~$1,000 (egress)
                                                      ───────
                                                      ~$16,018/mo
```

### Key Assumptions

| Assumption | Value | Source / Basis |
|---|---|---|
| Total asset corpus | 150M assets | ScorePlay case brief |
| Asset mix | 60% photos (90M), 40% video clips (60M) | Conservative estimate, confirm with ScorePlay engineering |
| Video clip duration | avg 90 seconds (max 2 minutes per client brief) | Client brief |
| Frame sampling rate | 1 frame per 2 seconds | ([source](https://arxiv.org/html/2408.03340v1)) |
| Frames per avg clip | 45 (90s ÷ 2s) | Derived from above |
| **True embedding corpus** | **~2.79B vectors** | 90M photos + 60M clips × 45 frames = 90M + 2.70B |
| New assets/month (baseline) | 5M assets/month, doubling every 3 months | Growth assumption, confirm with ScorePlay engineering |
| New vectors/month (Month 1) | ~93M | 5M × (0.6×1 + 0.4×45) = 5M × 18.6 |
| Monthly query volume (B2B baseline) | ~3M queries/month | ~5,000 users × 20 queries/day × 30 days |
| Monthly query volume (Phase 3 marketplace) | 50–100M queries/month | Programmatic sponsor/broadcaster queries, see note |
| Search result payload | ~2 MB/query | 20 results × 100KB thumbnail each |
| Gemini Flash pricing | $0.30/1M input tokens; ~258–500 tokens/image | ([source](https://ai.google.dev/gemini-api/docs/pricing)) |
| Effective Gemini cost/asset | ~$0.00008–0.00015 | 258 tokens (small image) to 500 tokens (large) × $0.30/1M |
| GPU instance (embedding) | g4dn.xlarge: $0.526/hr | ([source](https://instances.vantage.sh)) |
| GPU throughput (Jina CLIP, batch) | ~25 imgs/sec sustained | ([benchmarks](https://clip-as-service.jina.ai/user-guides/benchmark/), [T4 inference](https://replicate.com/zsxkib/jina-clip-v2); batching improves throughput ~10–15×) |
| Turbopuffer storage | $1.00/1M vectors/month | ([source](https://turbopuffer.com/pricing)) |
| Turbopuffer queries | $4.00/1M queries | ([source](https://turbopuffer.com/pricing)) |
| AWS data egress | $0.09/GB (10GB–10TB tier) | ([source](https://aws.amazon.com/s3/pricing/)) |
| AWS Fargate (frame extraction) | $0.04048/vCPU-hr, $0.004445/GB-hr | ([source](https://aws.amazon.com/fargate/pricing/)) |

### Backfill Cost (one-time)

| Component | Calculation | Est. cost |
|---|---|---|
| Frame extraction (video only) | ffmpeg on Fargate (CPU, no GPU): 60M clips × ~10 CPU-seconds each ÷ 2 vCPU = ~83,000 vCPU-hours × $0.04048 | ~$3,400 |
| CLIP embeddings, 2.79B vectors | g4dn.xlarge at ~25 imgs/sec: 2.79B ÷ 25 ÷ 3,600 = ~31,000 hrs × $0.526 | ~$16,000–20,000 |
| Gemini Flash enrichment, 150M assets | ~$0.00012/asset × 150M (enrichment runs per asset, not per frame) | ~$12,000–18,000 |
| **Total backfill** | | **~$31,000–41,000** |

*These are analytical estimates from published pricing. Actual compute time depends on GPU batch efficiency, parallelism, and instance availability. Gemini Flash pricing is for input token inference, not image generation. Confirm model version before execution.*

*The "few million" concern from earlier discussions was valid against GPT-4V 2023 pricing (~$0.01/image = $1.5M for 150M assets). At Gemini 2.5 Flash pricing, the cost is ~100× lower.*

### Ongoing Cost (monthly), Phase 2+ steady state

| Component | Month 1 | Month 4 | Month 7 | Month 10 | Source |
|---|---|---|---|---|---|
| Frame extraction (Fargate, new video assets) | ~$50 | ~$100 | ~$200 | ~$400 | Fargate CPU pricing |
| CLIP embedding compute (new vectors) | ~$543 | ~$1,086 | ~$2,172 | ~$4,344 | 93M→744M vectors ÷ 25 imgs/sec × $0.526/hr |
| Gemini Flash enrichment (per asset, not per frame) | ~$600 | ~$1,200 | ~$2,400 | ~$4,800 | 5M→40M assets × $0.00012 |
| Turbopuffer vector storage (cumulative) | ~$2,800 | ~$3,100 | ~$3,600 | ~$5,100 | 2.79B→5.1B vectors × $1/M |
| Turbopuffer queries (B2B baseline) | ~$15 | ~$15 | ~$15 | ~$40 | 3M→10M queries × $4/M |
| Warm GPU, live event SLA (2× g4dn.xlarge always-on) | ~$774 | ~$774 | ~$774 | ~$774 | $0.526/hr × 720hr × 2 instances |
| AWS egress (search result delivery) | ~$540 | ~$540 | ~$700 | ~$1,000 | ~6TB/month × $0.09/GB |
| ES cluster upgrade (Phase 1 only, migrates to Turbopuffer at Week 8) | ~$600 | ~$0 | ~$0 | ~$0 | Phase 1 = photos + live video only (~10M vectors); archive video backfill on Turbopuffer from Week 11 |
| **Monthly total** | **~$5,920** | **~$6,715** | **~$9,661** | **~$16,058** | |

*Phase 3 marketplace note: programmatic queries from sponsors and broadcasters can push Turbopuffer query costs from ~$40/month to $200–400/month (50–100M queries × $4/M). Egress grows proportionally with query volume. Neither breaks the model, but both should be monitored as Phase 3 activates.*

### Re-indexing Cost (model upgrade scenario)
Full re-embed of 2.79B+ accumulated vectors: **~$16,000–21,000** compute on g4dn.xlarge ([source](https://instances.vantage.sh)). Schedulable in off-peak batches. Not an ongoing cost, periodic event every 18–24 months as models improve.

### Cost vs. Pinecone at Scale
At 300M assets (~5.6B vectors at 1 frame/2s): Turbopuffer ~$5,600/month storage + ~$40/month queries vs. Pinecone pod-based **~$20,000–30,000/month** ([source](https://www.pinecone.io/pricing/)). The Turbopuffer advantage is real and large at storage-dominant workloads; narrows if query volume reaches hundreds of millions per month.

---

## Appendix E: Engineering Plan & Pre-Mortem

### Phase Milestones

| Milestone | Week | Exit criteria |
|---|---|---|
| Jina CLIP embedding pipeline live | 2 | New uploads embedding in <2 min; ES kNN index populated for 2 pilot client libraries |
| Semantic search alpha | 3 | 5 failing query types return relevant results; latency <35ms on pilot sub-corpus |
| Ontology enrichment pipeline live | 6 | 100% of new uploads enriched within 5 min; Opta join working for live clips |
| Turbopuffer migration complete | 8 | Full pilot library migrated; hot/cold split live; live event <30s validated |
| Beta launch | 9 | 3 pilot clients onboarded; feedback loop established |
| Cross-org permissioning layer | 11 | Rights metadata model defined; 1 demo session with pilot partner |
| GA | 13 | SLA defined, monitoring live, documentation complete |

### Pre-Mortem: What Could Go Wrong

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Embedding drift**: model upgrade invalidates all vectors | Medium | High | Parallel index during transition; plan re-index budget upfront |
| **Live event queue overflow**: major match, simultaneous uploads saturate embedding queue | Medium | High | Auto-scaling embedding workers on ECS; priority lane with circuit breaker |
| **Vision model hallucinations at scale**: wrong emotional register tags persist in metadata | High (at 2-3% error rate × 150M = millions of bad tags) | Medium | Human spot-check sample per release; confidence threshold filter; correction API |
| **Multilingual query degradation**: Jina CLIP underperforms on less-common languages | Low-Medium | Medium | Test on French, Spanish, Portuguese, Arabic queries during alpha; fallback to structured search if precision drops below threshold |
| **Client resistance to "black box" enrichment**: clients don't trust tags they didn't create | Medium | Low | Enrichment layer is invisible by default; never surfaced in client taxonomy editor; positioned as ScorePlay infrastructure, not client config |
| **Vector DB vendor lock-in (Turbopuffer)**: service degrades or pricing changes | Low | High | Abstract vector DB behind interface layer; maintain ES kNN as fallback; export vectors as standard float32 arrays |
| **Cold start for new small clients**: <10K assets → poor embedding density → poor semantic results | High (common) | Medium | Seed new orgs with strong enrichment on first upload batch; supplement with text-based retrieval until embedding density reaches threshold (~50K assets) |
| **Frame sampling rate mismatch**: 1 frame/2s may still miss the single best frame for a sub-second action | Low | Low | Test retrieval precision on fast-action query types during alpha (Weeks 1–3); 2s granularity means any moment is within ±1s of a sampled frame, which is sufficient for clip-level discovery |
| **Video/photo mix assumption wrong**: actual corpus is more video-heavy than 60/40 assumed | Unknown | High | Get actual asset type breakdown from ScorePlay engineering before finalizing backfill budget; 80/20 video/photo mix at 1 frame/2s would push true embedding corpus to ~5.4B vectors (150M × 36.2 avg) and backfill cost to ~$75,000+ |
| **Permissions leak in cross-org search**: asset surfaced to unauthorized org | Low | Critical | Pre-filter by permissions at index level, not just query time; audit log on every cross-org query; security review before Phase 3 GA |

---

## Appendix F: GTM, Pilots & Pricing

### Pilot Client Recommendations

**Flagship: MLS (Major League Soccer)**
- **Relationship:** Existing ScorePlay partner. Formal league-wide collaboration announced April 8, 2025, covering all 30 clubs in a shared workspace. ([MLSSoccer.com](https://www.mlssoccer.com/news/major-league-soccer-teams-up-with-scoreplay-to-build-on-asset-management-capabilities-through-ai-innovation), [SVG](https://www.sportsvideo.org/2025/04/11/mls-teams-up-with-scoreplay-to-build-on-asset-management-capabilities-through-ai-innovation/))
- **Scale:** 30 clubs, centralized production, 13.7B total social impressions in 2025 season ([MLS official](https://www.mlssoccer.com/news/mls-30th-regular-season-strength-scale-and-unmatched-fan-engagement)). Prior DAM infrastructure (Imagen) was replaced, a documented search and distribution bottleneck.
- **Why semantic search:** 30 clubs share a single asset pool across MLS regular season, Leagues Cup, and All-Star. Finding the right asset across competitions, photographers, and match dates is exactly the cross-taxonomy discovery problem semantic search solves.
- **Reference value:** One pilot = feedback from 30 orgs simultaneously. Unlocks every professional league on a shared-workspace model.

**Mid-Tier 1: FIBA (International Basketball Federation)**
- **Relationship:** Multi-year strategic partnership signed January 30, 2025. ([FIBA official](https://about.fiba.basketball/en/news/fiba-and-scoreplay-sign-strategic-partnership-with-focus-on-cutting-edge), [Broadcast Now](https://www.broadcastnow.co.uk/content-management/fiba-to-automate-digital-content-management-with-scoreplays-ai-tech/5201399.article), [Sportcal](https://www.sportcal.com/news/fiba-partners-with-scoreplay-to-expand-digital-content-output/))
- **Scale:** 212 national federations, dozens of annual tournaments across 5 continental regions. A third-party DAM case study documented that FIBA 3x3's manual content workflows consumed ~60 staff hours in a single event week before workflow automation. ([Greenfly case study](https://www.greenfly.com/resources-category/customer-showcase/fiba-3x3-athletes-digital-media-distribution/), predates ScorePlay partnership, establishes pre-AI baseline)
- **Why semantic search:** Inconsistent metadata quality across regional productions makes tag-based search unreliable. CLIP visual embeddings bypass metadata quality variance because the pixels are consistent even when tags aren't. Multi-stakeholder distribution (federations, broadcasters, athletes) means many users who don't know the internal taxonomy need to search.
- **Reference value:** Validates semantic search for governing bodies and non-football sports. Breadth signal for basketball, volleyball (Volleyball World already a client), athletics.

**Mid-Tier 2: Liverpool FC**
- **Relationship:** Named in case study client list. Wasabi + ScorePlay partnership announced October 2025. ([IT Brief](https://itbrief.co.uk/story/wasabi-scoreplay-partner-to-boost-ai-for-sports-media), [SVG](https://www.sportsvideo.org/2025/10/29/scoreplay-wasabi-technologies-partnership-upgrades-distribution-of-sports-content/))
- **Scale:** ~10TB of content per match ([The Stack](https://www.thestack.technology/all-red-how-liverpool-football-club-overhauled-its-media-stack-and-ditched-spinning-discs/)). 1.7B social media engagements in 2024–25 season ([LFC official](https://www.liverpoolfc.com/news/lfc-honoured-digital-excellence-football-business-awards)). Award-winning digital team (Football Business Awards 2025).
- **Why semantic search (the strongest signal):** Liverpool already paid to build their own natural language search. Before ScorePlay, they brought in Curio AI (acquired by Wasabi) specifically for AI-powered NL search on their archive. ([The Stack](https://www.thestack.technology/all-red-how-liverpool-football-club-overhauled-its-media-stack-and-ditched-spinning-discs/), [IT Pro](https://www.itpro.com/cloud/cloud-storage/inside-wasabis-plans-to-revolutionize-cloud-storage-with-its-ambitious-curio-ai-acquisition), [Wasabi case study](https://wasabi.com/resources/case-studies/liverpool-football-club)). They described the pre-AI state as "three days of Excel and editing pain" to process a single match's worth of sponsor logo tracking. Internal champions exist. ROI case is already made. A ScorePlay-native version removes the context-switching step they currently have between two systems.
- **Reference value:** Top-flight European club, most-engaged UK sports team on social. A Liverpool case study converts the entire European club tier. Aston Villa, Wolves, Brentford (all current ScorePlay clients) move fast when Liverpool validates something.

### Launch Sequencing

- **Week 9:** Invite all three pilots to beta simultaneously
- **Weeks 10–11:** Weekly structured feedback per pilot. Distinct focus per org: MLS = cross-competition speed; FIBA = multi-geography archive quality; Liverpool = high-volume live match turnaround
- **Week 12:** Compile case studies. Liverpool is the anchor story, lead with it in all external communications
- **Week 13:** GA launch with case studies published

### Pricing Recommendation

**Tier-gate, not add-on.**

| Plan | Semantic Search | Rationale |
|---|---|---|
| Creator (entry) | ❌ Structured filters only | Creates concrete upgrade trigger |
| Professional | ✅ Included | Primary upgrade driver |
| Enterprise | ✅ Included + cross-org (Phase 3) | Unlocks marketplace vision |

For Phase 3 cross-org / marketplace search: **consumption-based model is a hypothesis** (per external query or per licensed asset download). The commercial structure depends on how rights agreements are structured with clients. Requires validation before committing. Net-new revenue stream that does not exist today.

**Series B framing:**
> "We are the first sports media platform to offer natural language search across a multi-sport, multi-geography asset network, and the first with a universal content intelligence layer that makes a permissioned cross-org marketplace possible. Our three launch pilots (MLS, 30 clubs; FIBA, 212 national federations; Liverpool FC, 10TB/match) represent the full spectrum of the market. The enrichment layer compounds with every asset ingested. It cannot be replicated without the client relationships and the data."

---

*Document last updated: March 2026*
