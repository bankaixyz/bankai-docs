---
title: Implement bankai-docs Fumadocs foundation
type: feat
status: completed
date: 2026-03-14
source_plan: /Users/paul/Documents/projects/bankai-docs/plan.md
---

# Implement bankai-docs Fumadocs foundation

## Overview

Turn the strategy plan in [plan.md](/Users/paul/Documents/projects/bankai-docs/plan.md) into a first implementation slice that ships the docs foundation, not finished content.

This plan narrows the scope to the basics that should exist before any serious docs writing starts:

- scaffold a standalone Fumadocs + Next.js site
- establish a product-first information architecture
- document content ownership clearly
- add CI to keep the repository reproducible

The first implementation should stop short of live OpenAPI rendering. Instead, it should leave a clear API placeholder and a verified integration seam for a follow-up PR.

## Problem Statement / Motivation

The source plan defines the right long-term direction, but it is still strategy-level. `/ce:work` needs a more concrete execution plan so we can implement the basics in one pass without repeatedly stopping to decide:

- which phases are in scope for the first PR
- what "prepared for OpenAPI" means before API docs actually exist
- how SDK docs should be represented before any automation exists
- what to do with API docs before OpenAPI rendering is wired in

Without those decisions, the initial implementation will either stall on preventable questions or grow into a larger, less focused first PR.

## Research Summary

### Local Research

- This repository currently contains only the source strategy plan and Git metadata.
- No local brainstorms were found under `docs/brainstorms/`.
- No institutional learnings were found under `docs/solutions/`.
- The current Bankai SDK docs source reviewed from `/tmp/bankai-sdk/docs` contains:
  - `getting-started.md`
  - `proof-bundles.md`
  - `verify.md`
  - `supported-surfaces.md`
  - `api-client.md`
  - concept pages for Bankai blocks, Ethereum light clients, and OP Stack
- The SDK docs include relative links that point outside the docs subtree, for example `../example/basic-bundle/README.md` from [`getting-started.md`](/tmp/bankai-sdk/docs/getting-started.md). If mirrored docs are added later, that import path will need to handle these deliberately.
- The backend OpenAPI wiring in [`docs.rs`](/Users/paul/.codex/worktrees/2226/bankai-backend/crates/api/src/docs.rs) currently describes an `/openapi.json` endpoint and `/docs` explorer shell. The source strategy plan mentions `/v1/openapi.json`, so the public schema URL must be verified before Phase 5 implementation.

### Planning Decisions Carried Forward

- Use a dedicated `bankai-docs` repo rather than embedding product docs in `bankai-sdk`.
- Keep the architecture minimal: one app, one docs content tree, and one CI workflow.
- Make the docs information architecture product-first: Overview, Concepts, Chains, SDK, API.
- Treat SDK docs as externally canonical in `bankai-sdk` until a later sync/import mechanism is justified.
- Defer full OpenAPI rendering until the foundation is stable.

## Proposed Solution

Implement the initial repository as a small Fumadocs app with three explicit content zones:

1. hand-authored product docs in `content/docs/`
2. an SDK placeholder page that points to canonical docs in `bankai-sdk`
3. an API placeholder page that documents the future OpenAPI ingestion path

The first PR should cover the foundation and information architecture parts of the source plan, plus basic CI, while intentionally deferring SDK sync automation and live API rendering.

## Technical Approach

### Scope For The First PR

Include:

- Fumadocs + Next.js scaffold
- working local docs route
- initial top-level docs pages
- ownership rules in `README.md`
- GitHub Actions CI for install and build validation

Exclude:

- SDK sync automation
- live `fumadocs-openapi` rendering
- custom search
- full visual customization
- complete content population
- importing SDK examples or non-doc assets

### Repository Shape

The first PR should produce a structure close to:

```text
bankai-docs/
  app/
  content/docs/
    index.mdx
    concepts/index.mdx
    chains/index.mdx
    sdk/index.mdx
    api/index.mdx
  lib/
  .github/workflows/
    ci.yml
  source.config.ts
  next.config.mjs
  package.json
  README.md
```

Keep the shape close to the official scaffold. Prefer small edits over a custom architecture.

### Tooling Defaults

Use these defaults unless implementation reveals a blocker:

- package manager: `npm`
- Node.js: `22`
- scaffold source: official Fumadocs MDX app template
- content root: `content/docs`
- module format for Next config: ESM via `next.config.mjs`

### Navigation And Content Model

Create the initial nav shell as real pages, not empty directories:

- `Overview`
- `Concepts`
- `Chains`
- `SDK`
- `API`

Each page should explain what belongs in that section. This makes the initial site useful even before deeper docs land.

### SDK Representation For Now

For the foundation PR, keep the `SDK` section simple:

- create `content/docs/sdk/index.mdx`
- explain that SDK-specific docs are currently canonical in `bankai-sdk`
- link to the reviewed upstream SDK docs
- document that a sync or import path can be added later if maintaining mirrored docs becomes painful

### README Ownership Rules

Add a short contributor section to `README.md` covering:

- what belongs in `bankai-docs`
- what still belongs in `bankai-sdk`
- where to link readers for current SDK docs
- that sync/import automation is intentionally deferred for the first PR

### CI Contract

Add a single GitHub Actions workflow that:

- uses Node.js 22
- installs dependencies
- builds the site

If there is a cheap built-in link check available from the chosen scaffold, include it. If not, skip it for the first PR rather than introducing extra tooling.

### API Preparation Without Full Integration

The first PR should still leave an obvious seam for API docs:

- create `content/docs/api/index.mdx`
- explain that API reference will be generated from Bankai OpenAPI
- note the schema source is still to be verified because current references disagree between `/openapi.json` and `/v1/openapi.json`
- avoid adding runtime coupling to a private backend during the foundation PR

## Implementation Phases

### Phase 1: Scaffold The Docs App

- Initialize the repo with the official Fumadocs MDX app scaffold.
- Confirm local development renders the docs route successfully.
- Keep generated scaffold changes minimal and delete only obvious template content.

Deliverable:

- a running docs app with a working docs route and committed baseline structure

### Phase 2: Establish Information Architecture

- Create the top-level docs pages for Overview, Concepts, Chains, SDK, and API.
- Replace scaffold sample content with Bankai-specific placeholders.
- Add short section descriptions so the IA is visible in the UI and on disk.
- Document ownership rules in `README.md`.
- Make the SDK page link to canonical upstream docs instead of importing them.

Deliverable:

- a product-first docs shell with clear content boundaries

### Phase 3: Add CI And Contributor Workflow

- Create `.github/workflows/ci.yml`.
- Run install and build in CI.
- Document the contributor flow in `README.md`.
- Verify the workflow matches the scripts actually used locally.

Deliverable:

- a small but enforceable quality gate for docs structure and build consistency

### Deferred Follow-Up: SDK Sync Automation

Do not implement SDK sync automation in the foundation PR.

Instead:

- keep SDK docs canonical in `bankai-sdk`
- link to upstream pages from the `SDK` section
- revisit a one-way sync/import script only after the IA and contributor workflow are proven useful

### Deferred Follow-Up: API Rendering

Do not implement full API rendering in the foundation PR.

Instead:

- leave the API section in place
- record the schema endpoint mismatch as a follow-up item
- make `fumadocs-openapi` the next planned integration after the basic shell is stable

## System-Wide Impact

### Interaction Graph

- Contributors will edit product pages directly in `content/docs`.
- SDK docs authors will continue editing `bankai-sdk/docs`.
- The docs site will link to upstream SDK docs rather than mirroring them.
- CI will enforce that the site installs and builds consistently.

### Error & Failure Propagation

- If upstream SDK links change, the site can still build while the SDK section becomes stale or misleading.
- If the scaffold or content loader assumptions are wrong, the build will fail early, which is acceptable for the first PR.

### State Lifecycle Risks

- The main risk is ownership confusion if contributors start drafting SDK docs in the wrong repo.
- README ownership rules are the primary mitigation.
- There is no database or persistent runtime state in scope for the foundation PR.

### API Surface Parity

- The docs site, SDK repo, and backend repo will each own different parts of the public documentation surface.
- This PR establishes the contract, but not yet the live API parity enforcement.

### Integration Test Scenarios

- The docs app builds successfully with the placeholder content only.
- The SDK landing page contains working links to the expected upstream docs.
- The API placeholder page renders without requiring backend access.
- The docs app builds successfully in CI using only checked-in site content.

## Acceptance Criteria

- [x] The repo contains a standalone Fumadocs + Next.js app scaffold.
- [x] Local development renders the docs route successfully.
- [x] The top-level docs navigation is product-first: Overview, Concepts, Chains, SDK, API.
- [x] `README.md` documents ownership boundaries and the current SDK docs workflow.
- [x] The `SDK` section clearly points to canonical upstream docs in `bankai-sdk`.
- [x] `README.md` explains that SDK sync/import automation is deferred.
- [x] CI runs install and build successfully.
- [x] The repo contains an API placeholder page and a documented follow-up note for OpenAPI integration.

## Success Metrics

- A new contributor can see where product docs, SDK docs, and future API docs belong within five minutes.
- A new contributor can tell that SDK docs are still owned upstream rather than mirrored here.
- CI catches broken docs scaffolding or build regressions before merge.
- The first PR remains small enough to review as infrastructure rather than content work.

## Dependencies & Risks

### Dependencies

- Node.js 22 available locally and in CI
- a stable upstream location for linked SDK docs

### Risks

- Fumadocs scaffold output may differ slightly from assumptions in the source plan.
- upstream SDK docs URLs may change over time.
- The public OpenAPI endpoint may not match the path documented in the source plan.
- The empty repo means there are no existing conventions to lean on beyond the source plan itself.

### Mitigations

- Prefer official scaffold defaults over custom structure.
- start with direct upstream links rather than mirrored content
- keep ownership rules explicit in the repo root documentation
- Defer OpenAPI rendering until the endpoint contract is confirmed.

## Recommended Execution Notes

When this plan moves into `/ce:work`, use this order:

1. create a feature branch from `main`
2. scaffold the app and verify it builds before adding custom content
3. replace sample content with the Bankai IA shell
4. add CI last, once local commands are stable

This order keeps failures easy to localize and avoids mixing scaffold noise with script and CI logic too early.

## Sources & References

### Source Plan

- Strategy plan: [plan.md](/Users/paul/Documents/projects/bankai-docs/plan.md)

### Internal References

- Backend OpenAPI wiring: [`crates/api/src/docs.rs`](/Users/paul/.codex/worktrees/2226/bankai-backend/crates/api/src/docs.rs)
- SDK docs source reviewed from:
  - [`getting-started.md`](/tmp/bankai-sdk/docs/getting-started.md)
  - [`verify.md`](/tmp/bankai-sdk/docs/verify.md)

### External References Carried Forward From Source Plan

- Fumadocs quick start: [https://www.fumadocs.dev/docs](https://www.fumadocs.dev/docs)
- Fumadocs Next.js MDX setup: [https://www.fumadocs.dev/docs/mdx/next](https://www.fumadocs.dev/docs/mdx/next)
- Fumadocs OpenAPI integration: [https://www.fumadocs.dev/docs/integrations/openapi](https://www.fumadocs.dev/docs/integrations/openapi)
- Fumadocs search / Orama: [https://www.fumadocs.dev/docs/headless/search/orama](https://www.fumadocs.dev/docs/headless/search/orama)
