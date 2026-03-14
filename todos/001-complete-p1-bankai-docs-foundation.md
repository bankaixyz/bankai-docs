---
status: complete
priority: p1
issue_id: "001"
tags: [docs, fumadocs, nextjs, ci]
dependencies: []
---

# Problem Statement

Set up the initial `bankai-docs` foundation as a standalone Fumadocs + Next.js site with a product-first information architecture, clear ownership guidance, and basic CI.

# Findings

- The repo currently only contains planning documents.
- The first slice should not include SDK sync automation.
- The first slice should leave API rendering as a placeholder, not a live OpenAPI integration.

# Proposed Solutions

## Option 1: Full scaffold plus light Bankai customization

Use the official Fumadocs app generator, then replace sample docs content with Bankai-specific placeholder pages and add CI.

Pros:
- Fastest path to a correct foundation
- Stays close to official defaults

Cons:
- Introduces some scaffold churn in the first commit

## Option 2: Hand-roll a minimal Next.js app

Build only the pieces we need manually.

Pros:
- Smaller dependency footprint

Cons:
- More likely to drift from Fumadocs conventions
- Slower and riskier for a first pass

# Recommended Action

Use the official Fumadocs scaffold, then:

1. Verify the site builds and the docs route works.
2. Replace starter content with Bankai Overview, Concepts, Chains, SDK, and API sections.
3. Add README ownership guidance.
4. Add GitHub Actions CI for install and build.

# Acceptance Criteria

- [x] Official Fumadocs app scaffold committed locally
- [x] Bankai placeholder pages replace default content
- [x] README explains ownership boundaries
- [x] CI builds the site successfully
- [x] Work log records commands, edits, and verification

# Work Log

### 2026-03-14 - Setup

**By:** Codex

**Actions:**
- Read the strategy plan and created a tighter implementation plan.
- Deferred SDK sync automation from the first slice.
- Created a feature branch for implementation.

**Learnings:**
- The right first cut is scaffold + IA + ownership rules + CI.

### 2026-03-14 - Implementation

**By:** Codex

**Actions:**
- Applied the official Fumadocs Next.js MDX scaffold from the cached `create-fumadocs-app` template.
- Installed dependencies and generated `package-lock.json`.
- Replaced starter docs content with Overview, Concepts, Chains, SDK, and API sections under `content/docs/`.
- Updated app metadata, landing page copy, README ownership rules, and repository GitHub metadata.
- Added `.github/workflows/ci.yml` for Node 22 install and build validation.
- Ran `npm run types:check`.
- Ran `npm run build` successfully outside the sandbox after the initial sandboxed build hung.
- Started `npm run dev`, opened `http://localhost:3000/docs`, and captured `/tmp/bankai-docs-docs-page.png`.

**Learnings:**
- The official scaffold can be applied programmatically from the cached generator package, which is easier than driving the interactive CLI in this environment.
- `next build` needed to run outside the sandbox to complete reliably here, even though the project configuration itself was valid.
