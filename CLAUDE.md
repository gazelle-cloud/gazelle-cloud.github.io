# Knowledge Graph

A force-directed graph that visualises the design choices, platform anchors, and platform operations of a landing zone platform. Nodes are dots; edges are relationships between them.

## Structure

```
data/
  model/                # one JSON per choice
  platform-anchors/     # one JSON per anchor
  operations/           # one JSON per operation
scripts/
  build-graph.ps1       # reads data/, writes app/public/index.json
app/public/
  index.html            # single-file React app (JSX via Babel standalone)
  index.json            # generated — do not edit by hand
```

Run `pwsh -File scripts/build-graph.ps1` after any data change to regenerate `index.json`.

## Data schemas

### `data/model/*.json`
```json
{
  "id":        "kebab-case string — matches filename",
  "mechanism": "How the decision is implemented (1–2 sentences)",
  "scope":     ["landing-zone | platform | ..."],
  "why":       "Problem this decision solves (1–2 sentences)",
  "related": [
    { "id": "other-decision-id", "relationship": "enables | constrains | ...", "note": "..." }
  ],
  "violations": ["Example of what breaks this decision"]
}
```

### `data/platform-anchors/*.json`
```json
{
  "id":        "kebab-case string — matches filename",
  "priority":  1,
  "decisions": ["decision-id", "..."]
}
```
Anchors group decisions by theme. No `mechanism`/`why` — they are named principles, not decisions.

### `data/operations/*.json`
```json
{
  "id":          "kebab-case string — matches filename",
  "prerequisite": "operation-id (optional)",
  "workflow":    "GitHub workflow name",
  "reasoning":   ["decision-id", "..."],
  "steps":       ["Instruction for the agent executing this operation"],
  "files":       ["path/to/relevant/directory/"]
}
```
Operations are runbooks. `reasoning[]` links to the decisions that constrain the operation; those edges appear in the graph.

## Visualization (`app/public/*.html`)

Each page is a self-contained React app (JSX via Babel standalone) that renders into `#graph`.

### Shell (`app/public/shell.js` + `shell.css`)

Shared infrastructure imported by every page:

| Export | Purpose |
|--------|---------|
| `setupLayout()` | Creates `#layout > #viz-pane > #graph` DOM structure. Call once at top of each page, before mounting React. |
| `useGraphState(raw, nodeTypes)` | Centralises hover/focus/visibility/search state. |
| `useGraphPhysics(fgRef, graph, setupFn)` | Applies standard D3 forces and camera lifecycle. |
| `useVizPaneSize(fgRef)` | Tracks `#viz-pane` size via ResizeObserver. |
| `useBraveClickFix(...)` | Geometric hit-test fallback for Brave's canvas restrictions. |
| `CornerPanel` | **Standard info panel — use this on every page.** Fixed top-right overlay that appears on hover/click; scrolls for long content; reflows to a bottom sheet on mobile. |
| `NodeTooltip` | Cursor-following tooltip alternative (available but not the default). |
| `NavBar`, `SearchBox`, `ThemeToggle`, `DetailHeader` | Standard UI chrome. |
| `PALETTE`, `RENDER`, `drawLabel`, `linkEnds`, `normalizeNodeWeights` | Shared rendering constants and helpers. |

### Adding a new page

1. Create `app/public/my-page.html` — copy the structure from `model.html`.
2. Call `setupLayout()` once before mounting React.
3. Use `<CornerPanel node={activeNode} theme={theme}>` for the info panel — populate it with `.info-label` / `.info-text` elements matching your data schema.
4. Add the page to `NAV` in `shell.js` so it appears in the nav bar.
5. Serve locally or push — no build step needed for the HTML/JS layer.

### Node colour roles

| `PALETTE` key | Colour | Typical use |
|---------------|--------|-------------|
| `ENTRY` | gold | Entry points (anchors, workflows) |
| `CONNECTOR` | green | Orchestrators (operations, main-bicep) |
| `LEAF` | blue | Most nodes (decisions, modules) |
