# Knowledge Graph

A force-directed graph that visualises the design decisions, platform anchors, and platform operations of a landing zone platform. Nodes are dots; edges are relationships between them.

## Structure

```
data/
  design-decisions/     # one JSON per decision
  platform-anchors/     # one JSON per anchor
  platform-operations/  # one JSON per operation
scripts/
  build-graph.ps1       # reads data/, writes app/public/index.json
app/public/
  index.html            # single-file React app (JSX via Babel standalone)
  index.json            # generated — do not edit by hand
```

Run `pwsh -File scripts/build-graph.ps1` after any data change to regenerate `index.json`.

## Data schemas

### `data/design-decisions/*.json`
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

### `data/platform-operations/*.json`
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

## Visualization (`app/public/index.html`)

- **React + ForceGraph2D** rendered into `#graph`; JSX transpiled in-browser by Babel standalone
- Node types: `anchor` (gold), `operation` (green), `decision` (blue)
- Anchors and operations are pinned on a rim circle; decisions float by D3 force
- Hover or click a decision node → top-right panel shows its `mechanism` and `why`
- Filter chips (top-left) toggle visibility by node type
