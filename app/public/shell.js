import React from 'react';

// ── navigation entries ───────────────────────────────────────────────────────
// Add one object here whenever you create a new page. That's it.
export const NAV = [
  { label: 'Home',              href: './index.html'    },
  { label: 'Azure deployments', href: './azure-deployments.html' },
  { label: 'GitHub',            href: 'https://github.com/orgs/gazelle-cloud/', external: true },
];

// ── linkEnds ─────────────────────────────────────────────────────────────────
// Extracts [sourceId, targetId] from a ForceGraph link, handling both the
// raw-string form (before simulation) and the object form (after simulation).
export const linkEnds = l => [l.source?.id ?? l.source, l.target?.id ?? l.target];

// ── normalizeNodeWeights ─────────────────────────────────────────────────────
// Computes normalised in-degree (0–1) and stores it as node.__weight.
// Mutates raw in place; call once after fetching, before mounting.
export function normalizeNodeWeights(raw) {
  const inDeg = Object.fromEntries(raw.nodes.map(n => [n.id, 0]));
  raw.links.forEach(l => { inDeg[l.target] = (inDeg[l.target] ?? 0) + 1; });
  const maxDeg = Math.max(1, ...Object.values(inDeg));
  raw.nodes.forEach(n => { n.__weight = (inDeg[n.id] ?? 0) / maxDeg; });
}

// ── drawLabel ────────────────────────────────────────────────────────────────
// Draws a dark-backdrop text label on a canvas at (lx, ly).
// The caller computes the position; this handles font, backdrop, and text.
//
// align: 'left' | 'right' | 'center'
export function drawLabel(ctx, text, lx, ly, align, fontSize, globalScale, color) {
  const fs = fontSize / globalScale;
  ctx.font = `${fs}px Sans-Serif`;
  const tw = ctx.measureText(text).width;
  const p  = 4 / globalScale;

  const bgX = align === 'center' ? lx - tw / 2 - p
             : align === 'right'  ? lx - tw - p
             :                      lx - p;
  ctx.fillStyle = BACKDROP;
  ctx.fillRect(bgX, ly - fs / 2 - p, tw + p * 2, fs + p * 2);
  ctx.fillStyle    = color;
  ctx.textAlign    = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, lx, ly);
}

// ── RENDER ───────────────────────────────────────────────────────────────────
// Shared rendering constants used by every graph page's paintNode and
// nodePointerAreaPaint callbacks. Update here to affect all pages at once.

// CSS custom property helpers — read once after the stylesheet is applied.
const _css    = prop => getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
const _cssPx  = prop => parseFloat(_css(prop));          // '20px' → 20
const _cssPct = prop => parseFloat(_css(prop)) / 100;    // '70%'  → 0.7

export const RENDER = {
  dimmedAlpha:    0.1,  // opacity of non-active, non-neighbour nodes
  labelFontSize:  12,   // canvas label font size in graph-space px
  labelGap:       6,    // gap between node edge and label in graph-space px
  hitTestPadding: 4,    // extra radius added to node hit-test area in graph-space px
  bgColor:        _css('--bg-color'),
  linkWidth:      0.5,  // default link stroke width
};

// Label backdrop uses the same bg colour at reduced opacity.
const BACKDROP = RENDER.bgColor
  .replace(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i,
    (_, r, g, b) => `rgba(${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)},0.9)`);

// ── setupLayout ──────────────────────────────────────────────────────────────
// Creates the two-pane split DOM structure and appends it to <body>.
// Call once at the top of each page script, before mounting React.
export function setupLayout() {
  const layout = document.createElement('div');
  layout.id = 'layout';
  layout.innerHTML =
    '<div id="viz-pane"><div id="graph"></div></div>' +
    '<div id="detail-pane"><button id="detail-toggle">▾</button></div>';
  document.body.appendChild(layout);

  document.getElementById('detail-toggle').addEventListener('click', () => {
    const collapsed = layout.toggleAttribute('data-collapsed');
    document.getElementById('detail-toggle').textContent = collapsed ? '▴' : '▾';
  });
}

// ── useGraphPhysics ───────────────────────────────────────────────────────────
// Shared physics + camera lifecycle for every graph page.
// Applies the standard charge (-180), calls setupForcesFn(fg) for page-specific
// layout forces (collision, radial, tier, stem…), reheats the simulation, and
// fires an initial zoomToFit at 100 ms.
// Returns { cooldownTime, onEngineStop } to spread onto <ForceGraph2D>.
//
// Usage:
//   const physicsProps = useGraphPhysics(fgRef, graph, fg => {
//     fg.d3Force('link').distance(60);
//     fg.d3Force('collision', forceCollide(...));
//     // …layout-specific forces…
//   });
//   // then: <ForceGraph2D {...physicsProps} ref={fgRef} … />
export function useGraphPhysics(fgRef, graph, setupForcesFn) {
  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force('charge').strength(-180);
    setupForcesFn(fg);
    if (isFirstRun.current) {
      // ForceGraph2D already starts the simulation at full energy on mount —
      // reheating here would double-energise it and cause the initial scatter.
      isFirstRun.current = false;
    } else {
      fg.d3ReheatSimulation();
    }
    setTimeout(() => fg.zoomToFit(400, 40), 100);
  }, [graph]);
  return {
    cooldownTime:    100,
    onEngineStop:    () => fgRef.current?.zoomToFit(400, 40),
    backgroundColor: RENDER.bgColor,
    linkWidth:       RENDER.linkWidth,
  };
}

// ── useVizPaneSize ────────────────────────────────────────────────────────────
// Tracks the actual pixel size of #viz-pane via ResizeObserver and re-fits the
// graph whenever it changes. Returns { width, height } for <ForceGraph2D>.
// `padding` (default 20) is subtracted from each side, so the canvas is inset
// and the surrounding space acts as breathing room around the physics.
// Replaces useGraphResize for pages that use the split layout.
export function useVizPaneSize(fgRef, padding = _cssPx('--viz-padding')) {
  const [size, setSize] = React.useState(() => ({
    width:  window.innerWidth * _cssPct('--viz-pane-width') - padding * 2,
    height: window.innerHeight - padding * 2,
  }));
  React.useEffect(() => {
    const pane = document.getElementById('viz-pane');
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: width - padding * 2, height: height - padding * 2 });
      requestAnimationFrame(() => fgRef.current?.zoomToFit(400, 40));
    });
    obs.observe(pane);
    return () => obs.disconnect();
  }, []);
  return size;
}

// ── useGraphState ────────────────────────────────────────────────────────────
// Centralises the repeated state + derived data used by every graph page:
// visibility set, hover/focus ids, filtered graph, active node, neighbour set,
// the toggleType handler, and ready-to-use onNodeClick / onBackgroundClick props.
// Returns { visible, activeId, graph, activeNode, neighbours, toggleType,
//           setHoveredId, setFocusedId, onNodeClick, onBackgroundClick }.
export function useGraphState(raw, nodeTypes) {
  const [visible,   setVisible]   = React.useState(new Set(nodeTypes));
  const [hoveredId, setHoveredId] = React.useState(null);
  const [focusedId, setFocusedId] = React.useState(null);

  const activeId = focusedId ?? hoveredId;

  // Drive the mobile bottom sheet: set data-active on #detail-pane so CSS
  // can slide it up/down without any per-page logic.
  React.useEffect(() => {
    const pane = document.getElementById('detail-pane');
    if (pane) pane.dataset.active = activeId ? 'true' : '';
  }, [activeId]);

  const graph = React.useMemo(() => {
    const visIds = new Set(raw.nodes.filter(n => visible.has(n.type)).map(n => n.id));
    return {
      nodes: raw.nodes.filter(n => visible.has(n.type)),
      links: raw.links.filter(l => {
        const [s, t] = linkEnds(l);
        return visIds.has(s) && visIds.has(t);
      }),
    };
  }, [visible]);

  const activeNode = React.useMemo(() =>
    activeId ? graph.nodes.find(n => n.id === activeId) : null,
  [activeId, graph.nodes]);

  const neighbours = React.useMemo(() => {
    if (!activeId) return null;
    const set = new Set([activeId]);
    graph.links.forEach(l => {
      const [s, t] = linkEnds(l);
      if (s === activeId) set.add(t);
      if (t === activeId) set.add(s);
    });
    return set;
  }, [activeId, graph.links]);

  const toggleType = type => {
    setFocusedId(null);
    setVisible(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  return {
    visible, activeId, graph, activeNode, neighbours, toggleType, setHoveredId, setFocusedId,
    onNodeClick:       node => setFocusedId(p => p === node.id ? null : node.id),
    onBackgroundClick: ()   => setFocusedId(null),
  };
}

// ── NavBar ───────────────────────────────────────────────────────────────────
// Renders the #filters overlay: nav links on the left, then `children` (chips
// wrapped with a dim "show" label) flowing to the right.
//
// Usage inside a page's JSX:
//   <NavBar activeHref="./index.html">
//     {optionalFilterChipsOrLegend}
//   </NavBar>
export function NavBar({ activeHref, children }) {
  return React.createElement(
    'div', { id: 'filters' },
    React.createElement(
      'div', { className: 'nav-stack' },
      ...NAV.map(({ label, href, external }) => {
        if (href === activeHref)
          return React.createElement('span', { key: label, className: 'nav-link nav-active' }, label);
        const props = { key: label, className: 'nav-link', href };
        if (external) { props.target = '_blank'; props.rel = 'noopener noreferrer'; }
        return React.createElement('a', props, label);
      })
    ),
    children,
  );
}

// ── FilterChips ──────────────────────────────────────────────────────────────
// Renders the type-filter chips inside NavBar.
// Usage:
//   <FilterChips nodeTypes={NODE_TYPES} typeLabels={TYPE_LABELS}
//                colors={COLORS} visible={visible} toggleType={toggleType} />
export function FilterChips({ nodeTypes, typeLabels, colors, visible, toggleType }) {
  return nodeTypes.map(type =>
    React.createElement(
      'div',
      {
        key:       type,
        className: `chip${visible.has(type) ? '' : ' off'}`,
        style:     { borderColor: colors[type], color: colors[type] },
        onClick:   () => toggleType(type),
      },
      React.createElement('div', { className: 'chip-dot', style: { background: colors[type] } }),
      typeLabels[type],
    )
  );
}
