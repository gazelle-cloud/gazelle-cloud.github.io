# Knowledge graph

Documentation that scales — the design decisions behind a Microsoft Azure cloud management platform.

---

### Ask the graph

The full graph is available as plain text at [gazelle.cloud/llms-full.txt](https://gazelle.cloud/llms-full.txt) — paste it into any AI and ask questions directly.

### Helicopter view from any entry point

The graph is not meant to be read as raw data. Any entry point — a node on the map, a question to an AI — opens the full picture from that starting point, in any direction.

### Single-direction links

Links are one-way by design. A node only knows what it points to, never what points back at it. Both representations reconstruct the missing direction at consumption time, so the data stays simple and the view stays complete.

### Evergreen

The visualization holds no state. It renders directly from source — without any sync step.

### Density is where clarity lives

The more nodes that reference a decision, the more fully that decision is understood — not through its own words, but through the accumulated intent of everything that depends on it.

### Visualization engine

High-level architecture is described in [CLAUDE.md](./CLAUDE.md)

---

### Built on open source

- [Astro](https://astro.build) — static site framework; pre-renders for crawlers, fetches live for the visualization
- [React](https://react.dev) — UI layer for the graph and panels
- [react-force-graph](https://github.com/vasturiano/react-force-graph) — force-directed graph rendering
- [D3](https://d3js.org) — physics engine underneath react-force-graph