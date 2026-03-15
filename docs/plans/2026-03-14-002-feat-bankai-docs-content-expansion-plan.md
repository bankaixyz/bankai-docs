---
title: Expand Bankai docs with core concepts, local SDK guides, and generated API reference
type: feat
status: active
date: 2026-03-14
origin: docs/brainstorms/2026-03-14-bankai-docs-content-scope-brainstorm.md
---

# Expand Bankai docs with core concepts, local SDK guides, and generated API reference

## Overview

Turn `bankai-docs` from a docs shell into the main public documentation surface for Bankai.

This pass should:

- position stateless light clients as the core primitive of Bankai
- turn the SDK section into the fastest path to a first verified proof
- add generated API reference from a checked-in OpenAPI schema
- keep the docs experience skimmable for evaluators while preserving enough detail for technical readers

This plan carries forward the decisions from the brainstorm in [docs/brainstorms/2026-03-14-bankai-docs-content-scope-brainstorm.md](/Users/paul/Documents/projects/bankai-docs/docs/brainstorms/2026-03-14-bankai-docs-content-scope-brainstorm.md): Bankai should be introduced first as a stateless light-client system, this repo should become the primary public SDK docs surface, the concepts cluster should start with `Stateless Light Clients`, `Bankai Blocks`, and `Trust Model`, and API docs should come from a checked-in schema rather than a live backend fetch.

## Problem Statement

The current docs structure is correctly product-first, but the content is still a foundation shell:

- `content/docs/concepts/index.mdx` lists planned topics but does not teach the Bankai model yet
- `content/docs/sdk/index.mdx` links out to upstream `bankai-sdk` docs instead of onboarding users locally
- `content/docs/api/index.mdx` is still a placeholder
- the strongest conceptual explanation currently lives in the private knowledge-base draft at `docs/knowledgebase/stateless_light_clients.md`

That leaves a gap between the intended information architecture and the actual user journey.

The next pass needs to solve two problems at once:

1. explain Bankai in the right order, with stateless light clients as the primary mental model
2. convert that understanding into an immediate developer path using the SDK and API reference

## Research Summary

### Origin Brainstorm

The brainstorm established these scope boundaries and rationale:

- choose the layered product-docs approach over concept-heavy or SDK-first alternatives
- optimize for developers who want to get to a first proof quickly
- make `Stateless Light Clients` the first major concept page users encounter
- move SDK docs ownership into this repo for the public reading path
- generate API reference from a checked-in schema file

These decisions should remain fixed during implementation unless new product requirements emerge. See the origin document: [docs/brainstorms/2026-03-14-bankai-docs-content-scope-brainstorm.md](/Users/paul/Documents/projects/bankai-docs/docs/brainstorms/2026-03-14-bankai-docs-content-scope-brainstorm.md).

### Local Repo Research

Current implementation context:

- [content/docs/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/index.mdx) already presents the product-first IA: Overview, Concepts, Chains, SDK, API.
- [content/docs/concepts/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/concepts/index.mdx) is a placeholder for concept topics.
- [content/docs/sdk/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/sdk/index.mdx) still treats `bankai-sdk` as canonical and links out to GitHub-hosted docs.
- [content/docs/api/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/api/index.mdx) still treats OpenAPI as a future integration.
- [source.config.ts](/Users/paul/Documents/projects/bankai-docs/source.config.ts) and [lib/source.ts](/Users/paul/Documents/projects/bankai-docs/lib/source.ts) use the standard `content/docs` + Fumadocs MDX source loader setup.
- [app/docs/[[...slug]]/page.tsx](/Users/paul/Documents/projects/bankai-docs/app/docs/[[...slug]]/page.tsx) currently assumes standard MDX pages and will likely need a branch for OpenAPI page rendering if generated pages use `APIPage`.

Content sources already available:

- [docs/knowledgebase/stateless_light_clients.md](/Users/paul/Documents/projects/bankai-docs/docs/knowledgebase/stateless_light_clients.md) contains the main Bankai conceptual source material and already frames stateless light clients as the foundational model.
- Upstream SDK docs in `/tmp/bankai-sdk/docs` already cover:
  - `getting-started.md`
  - `verify.md`
  - `proof-bundles.md`
  - `api-client.md`
  - `supported-surfaces.md`
  - concept-supporting pages such as `concepts-bankai-blocks.md` and `concepts-ethereum-light-clients.md`

### Institutional Learnings

No `docs/solutions/` corpus exists in this repo yet, so there are no institutional learnings to carry forward from prior solution documents.

### External Framework Research

Official Fumadocs guidance, checked via Context7 against the current Fumadocs docs, confirms:

- `fumadocs-openapi` supports generating MDX files from an OpenAPI schema
- generated OpenAPI docs can be backed by a local schema object, which fits the checked-in `openapi.json` decision
- OpenAPI pages typically need `APIPage` wired into MDX components and special handling in the docs route when rendering page data of type `openapi`

Relevant references:

- Fumadocs OpenAPI integration: [https://fumadocs.dev/docs/integrations/openapi](https://fumadocs.dev/docs/integrations/openapi)
- Fumadocs generate-files flow: [https://fumadocs.dev/docs/integrations/openapi/generate-files](https://fumadocs.dev/docs/integrations/openapi/generate-files)
- Fumadocs manual Next.js integration: [https://fumadocs.dev/docs/manual-installation/next](https://fumadocs.dev/docs/manual-installation/next)

### OpenAPI Availability Note

The intended backend endpoint is `http://localhost:8080/v1/openapi.json`, but it was not reachable in the current workspace during planning. That does not block this plan because the chosen approach is to commit a fetched schema into this repo and build from the checked-in file.

## Proposed Solution

Expand the docs site in three coordinated tracks:

1. **Concepts track**: turn the knowledge-base draft into public-facing product docs centered on stateless light clients
2. **SDK track**: migrate and adapt the key SDK onboarding guides into `content/docs/sdk/` so this repo becomes the primary reading path
3. **API track**: add OpenAPI docs from the Bankai schema exposed at `http://localhost:8080/v1/openapi.json`

The core principle is layered reading:

- the top of each page should reward skimming
- the middle should explain the mechanism
- the bottom should route readers into adjacent technical pages

This should preserve a simple public story:

- Bankai is a stateless light-client system
- the SDK is the main interface into that system
- the API reference is available when lower-level inspection is needed

## Technical Approach

### Architecture

Keep the current Fumadocs site structure and focus on content expansion rather than adding new helper architecture.

Planned content structure:

```text
content/docs/
  index.mdx
  concepts/
    index.mdx
    stateless-light-clients.mdx
    bankai-blocks.mdx
    trust-model.mdx
  sdk/
    index.mdx
    quickstart.mdx
    verify-a-proof.mdx
    proof-bundles.mdx
    api-client.mdx
    supported-surfaces.mdx
  api/
    index.mdx
    ...OpenAPI reference pages
```

The implementation should prefer the smallest correct setup:

- add the requested docs content directly under `content/docs`
- adapt the existing SDK material into local docs pages
- add OpenAPI docs with the smallest Fumadocs-compatible setup that works
- avoid adding helper scripts, wrappers, or abstractions unless implementation proves they are strictly necessary

### Content Strategy

#### Concepts

Use the knowledge-base draft as the canonical conceptual source, but reshape it into public docs with a tighter information gradient.

`stateless-light-clients.mdx` should:

- open with a short answer to “what is Bankai?”
- explain stateless vs stateful light clients quickly
- position the recursive proof chain as Bankai’s core primitive
- explain bootstrap, finality, and weak subjectivity in plain language
- end by pointing to `Bankai Blocks`, `Trust Model`, and the SDK quickstart

`bankai-blocks.mdx` should:

- explain the verified Bankai block as the practical trust anchor
- translate the committed roots into the data users actually care about
- bridge cleanly into proof verification and proof bundles

`trust-model.mdx` should:

- make the trust boundary explicit
- distinguish trusted bootstrap from ongoing recursive verification
- explain practical defaults such as using finalized views for trust-sensitive work

#### SDK

The SDK docs should be adapted from upstream docs, not copied verbatim without editing.

Required editorial changes:

- rewrite the landing page so the SDK is described as the main way to interact with Bankai
- lead with one tight quickstart instead of a list of upstream links
- keep the first happy-path example small and end-to-end
- ensure references to the verifier crate and raw API client match the surrounding product narrative
- avoid duplicating concept material that will already live under `concepts/`

The initial SDK slice should include:

- `SDK Overview`
- `Quickstart`
- `Verify a Proof`
- `Proof Bundles`
- `API Client`
- `Supported Surfaces`

#### API

Add OpenAPI docs from `http://localhost:8080/v1/openapi.json` with the smallest working integration.

Scope for this plan:

- fetch the schema from the requested localhost endpoint when available
- add the resulting API reference into the docs site
- keep the implementation minimal and in service of the docs outcome, not a larger tooling lane

## Implementation Phases

### Phase 1: Information Architecture and Page Inventory

- Update [content/docs/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/index.mdx) copy so it no longer describes SDK and API as deferred placeholders.
- Update [content/docs/meta.json](/Users/paul/Documents/projects/bankai-docs/content/docs/meta.json) if needed so the navigation reflects the deeper concept and SDK pages.
- Rewrite [content/docs/concepts/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/concepts/index.mdx) to introduce the concept cluster and route readers to the flagship page.
- Rewrite [content/docs/sdk/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/sdk/index.mdx) so it becomes an actual local landing page rather than a link hub.
- Rewrite [content/docs/api/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/api/index.mdx) to explain the API surface and how it relates to the SDK.

Deliverable:

- the docs nav and section landing pages reflect the new ownership model and reading order

### Phase 2: Core Concept Pages

- Create `content/docs/concepts/stateless-light-clients.mdx` using [docs/knowledgebase/stateless_light_clients.md](/Users/paul/Documents/projects/bankai-docs/docs/knowledgebase/stateless_light_clients.md) as the main source
- Create `content/docs/concepts/bankai-blocks.mdx` using the upstream SDK concept page and the knowledge-base framing
- Create `content/docs/concepts/trust-model.mdx` by extracting the trust-boundary material from the knowledge-base draft and related SDK concepts
- Add skim-friendly diagrams and concise “next read” sections on each page

Deliverable:

- Bankai’s core primitive and trust model are explained clearly enough for both skimming and deeper study

### Phase 3: Local SDK Docs Migration

- Create `content/docs/sdk/quickstart.mdx` from `/tmp/bankai-sdk/docs/getting-started.md`
- Create `content/docs/sdk/verify-a-proof.mdx` from `/tmp/bankai-sdk/docs/verify.md`
- Create `content/docs/sdk/proof-bundles.mdx` from `/tmp/bankai-sdk/docs/proof-bundles.md`
- Create `content/docs/sdk/api-client.mdx` from `/tmp/bankai-sdk/docs/api-client.md`
- Create `content/docs/sdk/supported-surfaces.mdx` from `/tmp/bankai-sdk/docs/supported-surfaces.md`
- Update internal links so SDK docs point into `bankai-docs` paths instead of upstream GitHub files or example placeholders that do not exist in this repo

Deliverable:

- a developer can stay inside this docs site from first concept through first proof verification

### Phase 4: OpenAPI Integration

- Fetch the schema from `http://localhost:8080/v1/openapi.json` when the backend is available
- Add the OpenAPI reference pages to the docs site using Fumadocs' supported integration path
- Update only the existing docs wiring that is strictly required to render those pages
- Avoid introducing helper scripts or custom wrapper components unless implementation cannot proceed without them

Deliverable:

- the docs site includes API reference material sourced from the requested OpenAPI endpoint

### Phase 5: Validation and Editorial Pass

- run `npm run build`
- run `npm run types:check`
- verify navigation, relative links, and generated API pages render correctly
- check for duplicated explanations across `concepts/` and `sdk/`
- confirm page intros are skim-friendly and end with useful “read next” guidance

Deliverable:

- the site reads coherently from landing page through concepts, SDK, and API reference

## Alternative Approaches Considered

### 1. Keep SDK docs upstream and only link to them

Rejected because the brainstorm explicitly chose a hard cutover to this repo as the main public reading path. Continuing to link out would preserve the current fragmentation and weaken the product story.

### 2. Fetch OpenAPI live during docs builds

Rejected because it makes local development and CI depend on backend availability. The brainstorm chose a checked-in schema for build stability.

### 3. Expand concepts first and defer SDK and API again

Rejected because it would improve positioning but not the developer onboarding path. The selected approach needs both the concept story and the first-proof path.

## User Flow and Spec Analysis

### Primary User Flows

1. **Evaluator skim flow**
   - lands on overview
   - opens `Stateless Light Clients`
   - understands Bankai’s main primitive within the first screen or two
   - optionally jumps to SDK quickstart

2. **Developer fast-start flow**
   - lands on overview or concepts
   - reads enough of `Stateless Light Clients` to trust the model
   - opens SDK quickstart
   - builds a first proof bundle
   - verifies it locally
   - uses API reference only if lower-level inspection is needed

3. **Technical deep-dive flow**
   - starts in `Stateless Light Clients`
   - continues into `Trust Model` and `Bankai Blocks`
   - then reads `Verify a Proof` and `Proof Bundles`

### Key Gaps To Cover In Implementation

- relative links copied from upstream SDK docs may point to missing examples or repo paths
- concept pages may over-explain the same material already covered in SDK verification docs
- generated OpenAPI pages may require route-level handling that the current MDX-only page component does not yet support
- the localhost OpenAPI endpoint may not be running during implementation, so the plan should treat fetch timing as an execution detail rather than a content-scope blocker

### Planning Assumptions

- the backend OpenAPI endpoint remains `http://localhost:8080/v1/openapi.json`
- the initial API section can be reference-heavy, with minimal hand-authored prose
- the SDK pages will be edited for fit rather than preserved as exact mirrors of upstream docs
- any OpenAPI integration should stay minimal and should not add extra repo machinery unless required by Fumadocs itself

## System-Wide Impact

### Interaction Graph

OpenAPI docs will follow this path:

`backend openapi endpoint` -> `content/docs/api/*` -> `source.config.ts` / `lib/source.ts` -> `app/docs/[[...slug]]/page.tsx`

Concept and SDK content changes will flow through:

`content/docs/**/*.mdx` -> `fumadocs-mdx` collections -> `lib/source.ts` -> `app/docs/[[...slug]]/page.tsx`

### Error & Failure Propagation

- if the OpenAPI endpoint is unavailable during implementation, the API section cannot be completed until the schema can be fetched
- if generated OpenAPI output is malformed, the docs route or build step may fail for API pages while hand-authored pages still compile
- if copied SDK links are not rewritten, pages may build successfully but send users to 404s or missing examples

### State Lifecycle Risks

- concept and SDK pages can drift in terminology if the same trust-model explanation is edited in multiple places
- partial OpenAPI integration can leave the `api/` section half-finished and confusing unless it is completed as one slice

### API Surface Parity

- the SDK docs must describe the same API/verification surfaces exposed by the checked-in OpenAPI schema
- the `Supported Surfaces` page and API reference should be reviewed together so chain names, namespaces, and endpoints do not diverge

### Integration Test Scenarios

- generated OpenAPI pages render correctly under the standard docs route
- the first SDK quickstart page links correctly into local `Verify a Proof`, `Proof Bundles`, and `API Client` pages
- the concepts cluster links cleanly into the SDK path without circular or redundant reading requirements
- adding the OpenAPI docs does not break navigation or frontmatter expectations

## Acceptance Criteria

### Functional Requirements

- [x] `content/docs/concepts/` contains `stateless-light-clients.mdx`, `bankai-blocks.mdx`, and `trust-model.mdx`
- [x] `Stateless Light Clients` is clearly positioned as the core Bankai primitive and appears as the first major concept in the reading path
- [x] the concepts pages are skim-friendly at the top and contain deeper technical detail lower on the page
- [x] `content/docs/sdk/` contains local onboarding guides for `Quickstart`, `Verify a Proof`, `Proof Bundles`, `API Client`, and `Supported Surfaces`
- [x] the SDK landing page no longer treats upstream GitHub docs as the primary reading path
- [ ] the API section includes reference docs sourced from `http://localhost:8080/v1/openapi.json`
- [ ] the OpenAPI addition stays within the requested content scope and does not add unnecessary helper tooling

### Non-Functional Requirements

- [x] page copy remains concise and skimmable before deeper sections begin
- [x] the implementation follows the repo’s minimal, hard-cutover style instead of adding unnecessary sync systems or abstractions
- [x] all internal docs links resolve within this site unless intentionally external

### Quality Gates

- [x] `npm run build` passes
- [x] `npm run types:check` passes
- [x] navigation and key cross-links are manually spot-checked
- [ ] generated API docs can be reproduced from the checked-in schema using a documented script

## Success Metrics

- a new developer can understand Bankai’s main primitive and find the first proof flow in one session without leaving the site
- the overview, concepts, SDK, and API sections feel like one documentation system instead of three ownership islands
- the site no longer depends on upstream GitHub doc links for core SDK onboarding
- the API docs are present in the site and sourced from the requested Bankai OpenAPI endpoint

## Dependencies & Prerequisites

- the knowledge-base draft at [docs/knowledgebase/stateless_light_clients.md](/Users/paul/Documents/projects/bankai-docs/docs/knowledgebase/stateless_light_clients.md)
- upstream SDK docs from `/tmp/bankai-sdk/docs` or a sibling `bankai-sdk` checkout
- a reachable backend endpoint at `http://localhost:8080/v1/openapi.json` when adding the API docs
- whatever minimum Fumadocs OpenAPI support is required by the implementation

## Risk Analysis & Mitigation

- **Risk:** SDK pages copied locally still read like upstream crate docs rather than site-native docs.
  - **Mitigation:** treat migration as adaptation, not blind mirroring. Rewrite introductions, internal links, and “next read” sections.

- **Risk:** `Stateless Light Clients` becomes too long and loses skim value.
  - **Mitigation:** enforce a layered structure with a short executive summary, one diagram, and progressive detail.

- **Risk:** OpenAPI integration adds more plumbing than the repo needs.
  - **Mitigation:** keep the API work constrained to “add the requested docs” and reject any extra helper tooling unless it becomes unavoidable.

- **Risk:** API schema drifts from backend behavior.
  - **Mitigation:** document a refresh script, commit schema updates together with API-doc regeneration, and avoid undocumented manual edits to generated files.

## Resource Requirements

- content editing across concepts and SDK pages
- one lightweight docs integration for OpenAPI generation
- local verification time for docs rendering and link correctness

## Future Considerations

- add a small schema refresh check in CI once the generation flow is stable
- decide later whether SDK docs should be sourced from a sibling repo copy step or permanently authored only in this repo
- consider adding chain-specific guides once the main concepts, SDK path, and API reference are stable

## Documentation Plan

Files expected to be created or updated in this effort:

- `content/docs/index.mdx`
- `content/docs/meta.json`
- `content/docs/concepts/index.mdx`
- `content/docs/concepts/stateless-light-clients.mdx`
- `content/docs/concepts/bankai-blocks.mdx`
- `content/docs/concepts/trust-model.mdx`
- `content/docs/sdk/index.mdx`
- `content/docs/sdk/quickstart.mdx`
- `content/docs/sdk/verify-a-proof.mdx`
- `content/docs/sdk/proof-bundles.mdx`
- `content/docs/sdk/api-client.mdx`
- `content/docs/sdk/supported-surfaces.mdx`
- `content/docs/api/index.mdx`
- additional API reference files only if they are directly required to render the OpenAPI docs
- `components/mdx.tsx` only if required by the chosen Fumadocs OpenAPI path
- `app/docs/[[...slug]]/page.tsx` only if required by the chosen Fumadocs OpenAPI path
- `README.md`

## Sources & References

### Origin

- **Brainstorm document:** [docs/brainstorms/2026-03-14-bankai-docs-content-scope-brainstorm.md](/Users/paul/Documents/projects/bankai-docs/docs/brainstorms/2026-03-14-bankai-docs-content-scope-brainstorm.md)
  - Key decisions carried forward:
    - Bankai should be introduced first as a stateless light-client system
    - this repo should become the primary SDK docs surface
    - OpenAPI docs should come from a checked-in schema

### Internal References

- [docs/knowledgebase/stateless_light_clients.md](/Users/paul/Documents/projects/bankai-docs/docs/knowledgebase/stateless_light_clients.md)
- [content/docs/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/index.mdx)
- [content/docs/concepts/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/concepts/index.mdx)
- [content/docs/sdk/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/sdk/index.mdx)
- [content/docs/api/index.mdx](/Users/paul/Documents/projects/bankai-docs/content/docs/api/index.mdx)
- [source.config.ts](/Users/paul/Documents/projects/bankai-docs/source.config.ts)
- [lib/source.ts](/Users/paul/Documents/projects/bankai-docs/lib/source.ts)
- [app/docs/[[...slug]]/page.tsx](/Users/paul/Documents/projects/bankai-docs/app/docs/[[...slug]]/page.tsx)
- [docs/plans/2026-03-14-001-feat-bankai-docs-foundation-implementation-plan.md](/Users/paul/Documents/projects/bankai-docs/docs/plans/2026-03-14-001-feat-bankai-docs-foundation-implementation-plan.md)
- Upstream source docs reviewed from `/tmp/bankai-sdk/docs`:
  - `getting-started.md`
  - `verify.md`
  - `proof-bundles.md`
  - `api-client.md`
  - `supported-surfaces.md`
  - `concepts-bankai-blocks.md`

### External References

- Fumadocs OpenAPI integration: [https://fumadocs.dev/docs/integrations/openapi](https://fumadocs.dev/docs/integrations/openapi)
- Fumadocs generate-files guide: [https://fumadocs.dev/docs/integrations/openapi/generate-files](https://fumadocs.dev/docs/integrations/openapi/generate-files)
- Fumadocs Next.js manual integration: [https://fumadocs.dev/docs/manual-installation/next](https://fumadocs.dev/docs/manual-installation/next)
