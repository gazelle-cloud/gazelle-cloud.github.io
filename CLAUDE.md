# Gazelle Cloud — Site

An interactive map of a lightweight Azure landing zone. Force-directed graphs visualise design decisions, platform operations, and deployment workflows. Nodes are dots; edges are relationships.

## Design Principles

**Centralised engine, decentralised content.**
One `engine.js` owns graph mounting, React lifecycle, and UI chrome. Each page is a small config file (~50 lines of pure intent). Adding a page never touches the engine.

**Drop-in new page.**
Create one `*.page.js` config, one JSON endpoint, and two Astro pages. No boilerplate to copy, no shared file to modify except `NAV` in `shell.js`.

**Free play with physics and the info panel — everything else is handled.**
Page configs have full D3 access via `forces(fg, nodes, raw)` and full React access via `panel(node, graph, ctx)`. Layout, repulsion, radial rings, tiers — all yours. The engine handles JSON loading, node painting, search, theme, resize, Brave click fix, and the NavBar.

---

## Architecture

```
site/
  public/
    engine.js                  # centralised engine: load JSON → mount → render
    shell.js                   # hooks, components, palette (used by engine + page configs)
    shell.css                  # all styles
    knowledge-graph.page.js    # page config: guiding-principles + decisions, rim layout
    operations.page.js         # page config: operations + decisions + file nodes, concentric layout
    bigbang.page.js            # page config: github-workflows + bicep, tiered layout
    bigbang.json               # pre-built graph data (bigbang not in data repo)
  src/
    layouts/
      Base.astro               # root HTML layout (fonts, sr-only, analytics, title pattern)
      GraphPage.astro          # graph page shell (importmap, shell.css, loads *.page.js)
    pages/
      index.astro              # home page
      knowledge-graph.json.ts  # build-time endpoint: fetches + derives → /knowledge-graph.json
      knowledge-graph/
        index.astro            # graph page + sr-only links
        [slug].astro           # detail page: sr-only SEO content + JS redirect to /#id
      operations.json.ts       # build-time endpoint: fetches + derives → /operations.json
      operations/
        index.astro
        [...slug].astro
      bigbang/
        index.astro
        [...slug].astro
      404.astro                # smart redirect to correct section
```

## Data flow

```
build time:
  *.json.ts → GitHub API (GITHUB_TOKEN env var)
             → raw entity files (parallel fetch per category)
             → deriveGraph() → { nodes, links }
             → /knowledge-graph.json, /operations.json

  index.astro → same GitHub API fetch → sr-only HTML → crawlers / LLMs

runtime:
  *.page.js → engine.js → fetch /my-page.json → React force graph → humans
```

Content lives in `github.com/gazelle-cloud/Azure-landing-zones`.
All graph data is pre-built at deploy time — no GitHub API calls in the browser.
`GITHUB_TOKEN` is available automatically in GitHub Actions; set it locally in `.env`.

---

## Page config contract

```js
export default mount({
  activeHref:  '/my-page/',
  localJson:   '/my-page.json',   // pre-built at build time by src/pages/my-page.json.ts

  // node type → palette role + display label
  types: {
    'decision': { palette: 'LEAF', label: 'design decision' },
  },

  // optional hooks — all have sensible defaults
  dotRadius(node) { ... },
  prepare(raw) { ... },           // post-load: pin nodes, pre-compute pairs
  forces(fg, nodes, raw) { ... }, // full D3 access
  showLabel(node, ctx) { ... },
  labelPosition(node, r, gap, gs) { ... },
  labelFontSize(node) { ... },
  nodeLabel(node) { ... },
  linkColor(link, ctx) { ... },
  cooldownTime,                   // ms, default 100

  // UI
  idlePanel: MyIdlePanel,         // React component shown when no node is active
  panel(node, graph, ctx) { ... },
});
```

## Adding a new graph page

1. Create `site/src/pages/my-page.json.ts` — fetch entities with `GITHUB_TOKEN`, inline `deriveGraph`, export as JSON endpoint
2. Create `site/public/my-page.page.js` — fill in the config above with `localJson: '/my-page.json'`
3. Create `site/src/pages/my-page/index.astro` — `GraphPage` layout + sr-only links
4. Create `site/src/pages/my-page/[...slug].astro` — sr-only detail content + redirect
5. Add the page to `NAV` in `shell.js`

## Shell (`shell.js` + `shell.css`)

The engine uses these directly. Page configs can import them for panel content or force helpers.

| Export | Purpose |
|--------|---------|
| `setupLayout()` | Creates `#layout > #viz-pane > #graph` DOM structure |
| `useGraphState(raw, nodeTypes)` | Hover/focus/search state |
| `useGraphPhysics(fgRef, graph, setupFn)` | D3 forces + camera lifecycle |
| `useVizPaneSize(fgRef)` | Tracks `#viz-pane` size via ResizeObserver |
| `useBraveClickFix(...)` | Geometric hit-test fallback for Brave |
| `CornerPanel` | Fixed top-right info panel, reflows to bottom sheet on mobile |
| `NavBar`, `SearchBox`, `ThemeToggle`, `DetailHeader` | Standard UI chrome |
| `PALETTE`, `RENDER`, `drawLabel`, `linkEnds`, `normalizeNodeWeights` | Rendering constants and helpers |

## Node colour roles

| `PALETTE` key | Colour | Typical use |
|---------------|--------|-------------|
| `ENTRY` | gold | Entry points (guiding principles, workflows) |
| `CONNECTOR` | green | Orchestrators (file nodes, main-bicep) |
| `LEAF` | blue | Most nodes (decisions, modules) |

## Titles

Pattern: `Gazelle — {title}` (set in `Base.astro`).
Top-level pages override with a hand-written full title via the `fullTitle` prop.
