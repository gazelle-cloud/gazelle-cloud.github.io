import React from 'react';

// ── navigation entries ───────────────────────────────────────────────────────
// Add one object here whenever you create a new page. That's it.
export const NAV = [
  { label: 'Home',              href: './index.html'    },
  { label: 'Azure deployments', href: './azure-deployments.html' },
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
  ctx.fillStyle = 'rgba(26,27,38,0.9)';
  ctx.fillRect(bgX, ly - fs / 2 - p, tw + p * 2, fs + p * 2);
  ctx.fillStyle    = color;
  ctx.textAlign    = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, lx, ly);
}

// ── useGraphResize ───────────────────────────────────────────────────────────
// Tracks window size and re-fits the graph whenever the window resizes.
// Returns { width, height } to pass to <ForceGraph2D>.
//
// Usage:
//   const size = useGraphResize(fgRef);
//   // then: <ForceGraph2D width={size.width} height={size.height} ... />
export function useGraphResize(fgRef) {
  const [size, setSize] = React.useState({ width: window.innerWidth, height: window.innerHeight });
  React.useEffect(() => {
    const handle = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      // Zoom after ForceGraph2D has processed the new dimensions
      requestAnimationFrame(() => fgRef.current?.zoomToFit(400, 40));
    };
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return size;
}

// ── useGraphState ────────────────────────────────────────────────────────────
// Centralises the repeated state + derived data used by every graph page:
// visibility set, hover/focus ids, filtered graph, active node, neighbour set,
// and the toggleType handler.
// Returns { visible, activeId, graph, activeNode, neighbours, toggleType,
//           setHoveredId, setFocusedId }.
export function useGraphState(raw, nodeTypes) {
  const [visible,   setVisible]   = React.useState(new Set(nodeTypes));
  const [hoveredId, setHoveredId] = React.useState(null);
  const [focusedId, setFocusedId] = React.useState(null);

  const activeId = focusedId ?? hoveredId;

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

  return { visible, activeId, graph, activeNode, neighbours, toggleType, setHoveredId, setFocusedId };
}

// ── NavBar ───────────────────────────────────────────────────────────────────
// Renders the #filters overlay: nav links on the left, then `children` (chips,
// legend, or nothing) flowing to the right.
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
      ...NAV.map(({ label, href }) =>
        href === activeHref
          ? React.createElement('span', { key: label, className: 'nav-link nav-active' }, label)
          : React.createElement('a',    { key: label, className: 'nav-link', href },      label)
      )
    ),
    children,
  );
}
