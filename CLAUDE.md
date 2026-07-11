# Knowledge Graph

A force-directed graph that visualises the design choices, platform anchors, and platform operations of a landing zone platform. Nodes are dots; edges are relationships between them.

## Structure

```
site/
  public/
    shell.css, shell.js          # shared UI chrome and React hooks
    knowledge-graph.json         # knowledge graph data (decisions, rules)
    operations.json              # operations data
    bigbang.json                 # deployment workflows data
    knowledge-graph-graph.jsx    # graph script per page
    operations-graph.jsx
    bigbang-graph.jsx
  src/
    layouts/
      Base.astro                 # root HTML layout (fonts, sr-only, analytics)
      GraphPage.astro            # shared graph page layout (importmap, Babel, shell.css)
    pages/
      knowledge-graph/index.astro          # graph page + sr-only links for crawlers
      knowledge-graph/[slug].astro         # detail page per node (sr-only content + redirect)
      operations/index.astro
      operations/[...slug].astro
      bigbang/index.astro
      bigbang/[...slug].astro
      404.astro                  # smart redirect to correct section
```

## How it works

- **Humans** see the interactive force-directed graph (React + Babel standalone, client-side)
- **Crawlers/LLMs** see sr-only HTML with real `<a>` tags and text content
- **Detail pages** (`/knowledge-graph/ipam/`) have sr-only content for SEO + JS redirect to `/knowledge-graph/#ipam` for humans

## Editing content

Edit the JSON file in `site/public/`. Run `npm run build` in `site/`. That's it.

## Adding a new graph page

1. Create `site/public/my-page-graph.jsx` — copy from an existing graph JSX file
2. Create `site/src/pages/my-page/index.astro` — use `GraphPage` layout, import JSON, render sr-only links
3. Create `site/src/pages/my-page/[...slug].astro` — detail pages with sr-only content + hash redirect
4. Add the page to `NAV` in `shell.js`

## Shell (`shell.js` + `shell.css`)

Shared infrastructure imported by every graph page:

| Export | Purpose |
|--------|---------|
| `setupLayout()` | Creates `#layout > #viz-pane > #graph` DOM structure. Call once before mounting React. |
| `useGraphState(raw, nodeTypes)` | Centralises hover/focus/visibility/search state. |
| `useGraphPhysics(fgRef, graph, setupFn)` | Applies standard D3 forces and camera lifecycle. |
| `useVizPaneSize(fgRef)` | Tracks `#viz-pane` size via ResizeObserver. |
| `useBraveClickFix(...)` | Geometric hit-test fallback for Brave's canvas restrictions. |
| `CornerPanel` | Standard info panel — fixed top-right overlay, scrolls, reflows to bottom sheet on mobile. |
| `NavBar`, `SearchBox`, `ThemeToggle`, `DetailHeader` | Standard UI chrome. |
| `PALETTE`, `RENDER`, `drawLabel`, `linkEnds`, `normalizeNodeWeights` | Rendering constants and helpers. |

## Node colour roles

| `PALETTE` key | Colour | Typical use |
|---------------|--------|-------------|
| `ENTRY` | gold | Entry points (anchors, workflows) |
| `CONNECTOR` | green | Orchestrators (operations, main-bicep) |
| `LEAF` | blue | Most nodes (decisions, modules) |
