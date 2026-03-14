---
title: Fumadocs Foundation for bankai-docs
type: feat
status: active
date: 2026-03-14
---

# Fumadocs Foundation for bankai-docs

## Overview

Create a dedicated public `bankai-docs` repository for Bankai's product documentation, using Fumadocs on Next.js as the site framework.

The first pass should focus on infrastructure and consistency, not on finishing content:

- bootstrap the docs site cleanly
- establish the repository structure and navigation model
- define how `bankai-docs` stays consistent with `bankai-sdk`
- leave room for future API reference, chain docs, and product concepts

This plan assumes `bankai-docs` will be a sibling repo and the implementation work will happen there later.

## Problem Statement / Motivation

Bankai's public documentation is currently split across:

- SDK docs in `bankai-sdk/docs`
- API/OpenAPI output in `bankai-backend`
- product and architecture context that is starting to live outside the public repos

That is workable for early development, but it is not a good long-term docs experience.

The core issue is scope mismatch:

- `bankai-sdk` is a crate repo
- Bankai docs need to cover the whole product
- Bankai's concepts already extend beyond the SDK, especially around stateless light clients, trust model, chain coverage, and long-term multi-chain vision

If the docs site is built directly inside `bankai-sdk`, it will ship faster but likely inherit the wrong information architecture and ownership model.

The better long-term structure is a dedicated docs repo with an explicit contract for what remains canonical in `bankai-sdk` and what becomes canonical in `bankai-docs`.

## Research Summary

### Local Research

- No relevant brainstorms or prior plan/docs workflow artifacts were found in this repo.
- No institutional learnings were found under `docs/solutions/`.
- `bankai-backend` already exposes an OpenAPI spec at `/v1/openapi.json` via [`crates/api/src/docs.rs`](/Users/paul/.codex/worktrees/2226/bankai-backend/crates/api/src/docs.rs).
- `bankai-sdk` already has a meaningful public docs surface under `/tmp/bankai-sdk/docs`, including:
  - concepts
  - proof-bundles
  - verify flow
  - supported surfaces

### External Research

As of March 14, 2026, the current official Fumadocs guidance is:

- Quick start uses `npm create fumadocs-app`
- minimum Node.js version is 22
- the standard Fumadocs MDX layout uses `content/docs`
- Fumadocs MDX is ESM-only, so `next.config.mjs` is recommended
- Fumadocs has first-party OpenAPI support through `fumadocs-openapi`
- Fumadocs' default/recommended self-hosted search path is Orama

Sources:

- Fumadocs quick start: [https://www.fumadocs.dev/docs](https://www.fumadocs.dev/docs)
- Fumadocs Next.js MDX setup: [https://www.fumadocs.dev/docs/mdx/next](https://www.fumadocs.dev/docs/mdx/next)
- Fumadocs OpenAPI integration: [https://www.fumadocs.dev/docs/integrations/openapi](https://www.fumadocs.dev/docs/integrations/openapi)
- Fumadocs search / Orama: [https://www.fumadocs.dev/docs/headless/search/orama](https://www.fumadocs.dev/docs/headless/search/orama)

## Proposed Solution

Set up `bankai-docs` as a dedicated Fumadocs site with three clear documentation ownership zones:

1. `product/concepts` content owned by `bankai-docs`
2. `sdk` content synchronized from `bankai-sdk`
3. `api` reference generated from OpenAPI, sourced from the Bankai API

This keeps the docs repo simple and avoids over-engineering:

- one docs app
- one content tree
- one sync script for SDK docs
- one API integration path

### Recommended Ownership Model

#### Canonical in `bankai-docs`

These pages should live only in `bankai-docs`:

- landing / overview
- product concepts
- stateless light clients
- trust model
- supported chains overview
- roadmap / vision
- cross-product guides

#### Canonical in `bankai-sdk`

These pages should remain authored in `bankai-sdk`, then synchronized into `bankai-docs`:

- SDK getting started
- SDK proof bundle guide
- SDK verify guide
- SDK examples overview
- SDK crate-specific reference pages

#### Canonical from API/OpenAPI

These pages should not be hand-maintained in either repo:

- endpoint reference
- request/response schema pages
- parameter-level API docs

Instead, they should be generated or rendered from the OpenAPI schema exposed by Bankai.

## Technical Approach

### Repository Shape

Create a separate `bankai-docs` repo with a plain Next.js + Fumadocs structure.

Suggested top-level layout:

```text
bankai-docs/
  app/
  components/
  content/docs/
    index.mdx
    concepts/
    sdk/
    api/
    chains/
  lib/
  scripts/
  public/
  source.config.ts
  next.config.mjs
  package.json
```

### Fumadocs Setup

Bootstrap using the official app generator, choosing:

- framework: Next.js
- content source: Fumadocs MDX

Then standardize on:

- `content/docs` as the only docs content root
- `source.config.ts` for collection setup
- `lib/source.ts` for Fumadocs source loader
- `next.config.mjs` because the MDX packages are ESM-only

### Navigation Model

Start with a minimal docs IA:

- Overview
- Concepts
- Chains
- SDK
- API

This is intentionally product-first, not repo-first.

That matters because users should think "Bankai" before they think "SDK crate layout."

### SDK Consistency Mechanism

Use a one-way sync model from `bankai-sdk` into `bankai-docs`.

Recommended first-pass mechanism:

- a small sync script in `bankai-docs`, for example `scripts/sync-sdk-docs.ts`
- source path defaults to sibling repo `../bankai-sdk/docs`
- copied output lands in `content/docs/sdk/`
- script rewrites relative links as needed so they work in the docs site
- generated files carry a header comment noting they are synced, not hand-edited

Keep the ownership rule simple:

- do not manually edit synced SDK pages in `bankai-docs`
- edit the source in `bankai-sdk/docs`
- re-run sync

### Drift Prevention

Add a lightweight CI contract in `bankai-docs`:

- run the SDK sync script in `--check` mode
- fail if generated SDK docs differ from committed output

This is the minimum useful enforcement for consistency without inventing a complicated content platform.

### API Reference Path

Plan for API docs from day one, even if not implemented in the first PR.

Preferred path:

- use `fumadocs-openapi`
- point it at Bankai's OpenAPI schema
- support either:
  - a checked-in schema file committed during release flow, or
  - an external schema URL from the deployed Bankai API

First-pass recommendation:

- start with a checked-in schema or a build-time fetch from a stable deployed OpenAPI endpoint
- avoid coupling local docs development to the private backend repo

## System-Wide Impact

- **Interaction graph**: `bankai-docs` becomes the public presentation layer. `bankai-sdk` remains the canonical authoring surface for SDK-specific docs. `bankai-backend` remains the source of truth for OpenAPI output.
- **Error propagation**: broken sync logic can create stale SDK docs; broken OpenAPI ingestion can create stale or missing API reference pages; bad link rewriting can silently degrade the docs UX.
- **State lifecycle risks**: the biggest risk is ownership confusion, where people edit synced files in the docs repo and later lose changes. This needs a hard rule and visible generated-file markers.
- **API surface parity**: if the Bankai API changes, generated API docs need to stay in lockstep with `/v1/openapi.json`.
- **Integration test scenarios**:
  - SDK doc changed upstream but sync output was not refreshed
  - OpenAPI schema changes and API reference build breaks
  - navigation link rewrites fail and internal SDK links 404
  - docs build succeeds locally but external-schema fetch fails in CI

## Implementation Phases

### Phase 1: Foundation

- Create `bankai-docs` repo
- Bootstrap Next.js + Fumadocs MDX app
- Confirm local dev server renders `/docs`
- Commit clean base structure with a minimal nav shell

Deliverable:

- a working empty docs shell ready for content

### Phase 2: Information Architecture and Ownership

- Add initial section structure under `content/docs`
- Document ownership rules in `README.md`
- Create placeholders for:
  - concepts
  - chains
  - sdk
  - api

Deliverable:

- clear docs repo structure with explicit boundaries

### Phase 3: SDK Sync Contract

- Implement sync script from `../bankai-sdk/docs`
- Copy a selected subset of SDK docs into `content/docs/sdk`
- Rewrite links and add generated-file markers
- Add a `--check` mode

Deliverable:

- one-way reproducible SDK docs sync

### Phase 4: CI and Quality Gates

- Add CI job for:
  - install
  - build
  - sync check
- Add link validation if practical
- Document contributor workflow

Deliverable:

- consistency protections for public docs

### Phase 5: API Reference Integration

- Add `fumadocs-openapi`
- choose schema ingestion mode
- render the first API section from Bankai's OpenAPI schema

Deliverable:

- API reference path established, even if still partial

## Alternatives Considered

### 1. Build docs inside `bankai-sdk`

Pros:

- fastest initial launch
- no new repo
- SDK docs already live there

Cons:

- wrong long-term ownership boundary
- product docs become subordinate to SDK concerns
- harder to combine product docs, chain docs, and API docs cleanly

Verdict:

- viable as a temporary shortcut
- not recommended as the main long-term home

### 2. Put everything in `bankai-backend`

Pros:

- OpenAPI is already there

Cons:

- repo is not the right public-facing home
- product docs would depend on backend repo decisions
- SDK docs would still need importing the other direction

Verdict:

- not recommended

### 3. Build a complex multi-repo content system immediately

Pros:

- theoretically elegant

Cons:

- over-engineered for the current stage
- adds tooling cost before content value exists

Verdict:

- avoid for first pass

## Acceptance Criteria

- [ ] `bankai-docs` is a standalone public repo using Fumadocs + Next.js
- [ ] local development serves a working `/docs` route
- [ ] docs navigation is product-first: Overview, Concepts, Chains, SDK, API
- [ ] `bankai-docs` contains a documented ownership model for product docs vs SDK docs vs API docs
- [ ] SDK docs can be synchronized into the docs site with a single script
- [ ] CI can detect drift between synced SDK docs and committed output
- [ ] the repo is prepared for OpenAPI integration through Fumadocs

## Success Metrics

- new contributors can tell where a docs change belongs in under five minutes
- SDK docs no longer need manual copy-paste into the docs site
- product docs can evolve without waiting on SDK repo structure changes
- API reference can be added without restructuring the site

## Dependencies & Risks

### Dependencies

- public `bankai-docs` repo created
- Node.js 22+ available for contributors and CI
- `bankai-sdk` remains public and available as sync source
- a stable OpenAPI endpoint or schema export path for API docs

### Risks

- ownership confusion between docs repo and SDK repo
- brittle link rewriting across synced SDK docs
- OpenAPI integration coupling docs builds to backend availability
- docs IA drifting toward internal implementation details instead of product clarity

### Mitigations

- keep ownership rules explicit and short
- keep sync one-way and generated
- use CI `--check` enforcement
- treat OpenAPI as a separate ingestion lane, not mixed into hand-authored docs

## Recommendations

### Recommended first implementation

Use:

- dedicated `bankai-docs` repo
- official Fumadocs app scaffold
- MDX-based docs under `content/docs`
- one-way SDK sync script
- delayed but planned OpenAPI integration

### Recommended non-goals for the first PR

Do not try to:

- finish all content
- solve private-repo content ingestion
- build a bidirectional docs sync system
- fully customize Fumadocs UI before the structure is proven

## Sources & References

### Internal References

- Bankai OpenAPI setup: [crates/api/src/docs.rs](/Users/paul/.codex/worktrees/2226/bankai-backend/crates/api/src/docs.rs)
- Current stateless light clients draft: [docs/stateless-light-clients.md](/Users/paul/.codex/worktrees/2226/bankai-backend/docs/stateless-light-clients.md)
- Existing SDK docs source reviewed from local clone: `/tmp/bankai-sdk/docs`

### External References

- Fumadocs quick start: [https://www.fumadocs.dev/docs](https://www.fumadocs.dev/docs)
- Fumadocs Next.js MDX setup: [https://www.fumadocs.dev/docs/mdx/next](https://www.fumadocs.dev/docs/mdx/next)
- Fumadocs OpenAPI integration: [https://www.fumadocs.dev/docs/integrations/openapi](https://www.fumadocs.dev/docs/integrations/openapi)
- Fumadocs built-in search / Orama: [https://www.fumadocs.dev/docs/headless/search/orama](https://www.fumadocs.dev/docs/headless/search/orama)
