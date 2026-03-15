---
date: 2026-03-14
topic: bankai-docs-content-scope
---

# Bankai Docs Content Scope

## What We're Building

The next docs pass should turn `bankai-docs` from a foundation shell into the main public documentation surface for Bankai.

The site should do two jobs at once:

1. explain Bankai through its core primitive, stateless light clients
2. get developers to a first verified proof as quickly as possible

The resulting docs should be product-first, but still optimized for developer onboarding. Readers who skim should understand the core idea quickly, while readers who want depth should be able to keep going without leaving the site.

## Why This Approach

We considered three shapes:

- a layered product-docs approach
- a concept-heavy approach
- an SDK-first approach

The layered product-docs approach is the best fit.

It keeps stateless light clients at the center of the story, which is important for positioning Bankai correctly, but it still gives developers a short path into the SDK and proof verification flows. This avoids making Bankai feel like just a crate surface while also avoiding a research-only docs experience.

## Key Decisions

- Bankai should be introduced first as a stateless light-client system, not primarily as an SDK.
- `Stateless Light Clients` should be the first major concept users encounter before SDK setup.
- The docs should optimize for developers who want to get to a first proof quickly.
- This repo should become the primary public SDK docs surface rather than only linking out to `bankai-sdk`.
- The concepts section should start as a small cluster:
  - `Stateless Light Clients`
  - `Bankai Blocks`
  - `Trust Model`
- API reference should be generated from a checked-in OpenAPI schema file rather than depending on a live backend at docs-build time.

## Proposed Scope

### Overview Flow

The main docs journey should read like this:

1. Overview
2. Stateless Light Clients
3. SDK Quickstart
4. Verify a Proof
5. API Reference

This makes the conceptual primitive visible immediately, then turns that understanding into action.

### Concepts Scope

#### 1. Stateless Light Clients

This should be the flagship concept page and the core Bankai explanation.

Recommended section shape:

- `Why Bankai exists`
- `What a stateless light client is`
- `Stateful vs stateless light clients`
- `How Bankai carries trust forward`
- `Why finality and weak subjectivity matter`
- `How this becomes a product primitive`
- `What to read next`

The page should open with a skim-friendly summary and diagram, then deepen into the mechanics from `docs/knowledgebase/stateless_light_clients.md`.

#### 2. Bankai Blocks

This page should explain the verified Bankai block as the trust anchor that unlocks later proof verification.

Recommended section shape:

- `What a Bankai block contains`
- `Why it is the trust anchor`
- `How headers and objects are recovered from it`
- `How it connects to SDK verification`

#### 3. Trust Model

This page should make the trust boundary explicit in practical terms.

Recommended section shape:

- `What you trust at bootstrap`
- `What the proof chain guarantees`
- `What verified results mean`
- `When to use finalized vs fresher views`

### SDK Scope

The SDK section should become the fastest actionable path in the docs.

Recommended initial pages:

- `SDK Overview`
- `Quickstart`
- `Verify a Proof`
- `Proof Bundles`
- `API Client`
- `Supported Surfaces`

Recommended UX rule:

- keep the first page tightly focused on the smallest end-to-end happy path
- move deeper explanation into follow-on guides instead of overloading the quickstart

The current upstream SDK docs in `bankai-sdk/docs` are a strong base for this material and should be adapted into this repo rather than merely linked.

### API Scope

The API section should be generated from a checked-in `openapi.json` file.

Recommended first-pass scope:

- commit the schema into this repo
- generate endpoint reference pages from that file
- keep hand-authored API prose limited to a short entry page if needed

This keeps the reference stable for docs builds while preserving a clean source-of-truth boundary.

## Content Principles

- Skimmable first: every key page should open with a short explanation, a mental model, and a clear next step.
- Depth without sprawl: deeper details should appear lower on the page or in linked supporting pages.
- Product-first language: describe Bankai as the system, with the SDK as the main interface into it.
- Hard cutover: once local SDK docs are added here, avoid treating upstream GitHub links as the main reading path.

## Open Questions

None at this stage. The main scope and ownership decisions are resolved enough to proceed to planning.

## Next Steps

Move to `/ce:plan` to turn this into an implementation plan covering:

- page inventory and navigation changes
- which SDK docs to migrate first
- how to reshape `stateless_light_clients.md` into public-facing docs pages
- OpenAPI file ingestion and Fumadocs integration
