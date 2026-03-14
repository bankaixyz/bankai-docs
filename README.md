# bankai-docs

Public documentation site for Bankai, built with Next.js and Fumadocs.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/docs](http://localhost:3000/docs).

## Content Ownership

`bankai-docs` is the public home for:

- product concepts
- chain coverage and chain-specific guidance
- cross-product guides
- future generated API reference

`bankai-sdk` remains canonical for SDK-specific docs:

- getting started
- proof bundles
- verify flow
- supported surfaces
- API client overview

For this first pass, the `SDK` section in `bankai-docs` links to the upstream docs in `bankai-sdk` instead of mirroring them locally.

## Contributor Workflow

1. Add or edit product docs under `content/docs`.
2. Keep SDK-specific content in `bankai-sdk/docs`.
3. Use `npm run dev` for local editing.
4. Run `npm run build` before pushing changes.

## Repository Shape

- `app/`: Next.js routes and layouts
- `content/docs/`: Fumadocs MDX content
- `lib/source.ts`: Fumadocs source loader
- `source.config.ts`: MDX collection configuration

## Deferred Follow-Ups

- Add a one-way SDK import or sync path only if mirrored docs become worth the maintenance cost.
- Add generated API reference once the public OpenAPI schema path is confirmed.
