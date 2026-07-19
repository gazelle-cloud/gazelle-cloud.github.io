import React from 'react';
import { createPortal } from 'react-dom';

// ── navigation entries ───────────────────────────────────────────────────────
// Add one object here whenever you create a new page. That's it.
export const NAV = [
  { label: 'Home',         href: '/' },
  { label: 'Knowledge Graph', href: '/knowledge-graph/' },
  { label: 'Operations',   href: '/operations/' },
  { label: 'BigBang',      href: '/bigbang/' },
];

// ── linkEnds ─────────────────────────────────────────────────────────────────
// Extracts [sourceId, targetId] from a ForceGraph link, handling both the
// raw-string form (before simulation) and the object form (after simulation).
export const linkEnds = l => [l.source?.id ?? l.source, l.target?.id ?? l.target];

// ── normalizeNodeWeights ─────────────────────────────────────────────────────
// Computes normalised total degree (in + out, 0–1) and stores it as node.__weight.
// Mutates raw in place; call once after fetching, before mounting.
export function normalizeNodeWeights(raw) {
  const deg = Object.fromEntries(raw.nodes.map(n => [n.id, 0]));
  raw.links.forEach(l => {
    deg[l.source] = (deg[l.source] ?? 0) + 1;
    deg[l.target] = (deg[l.target] ?? 0) + 1;
  });
  const maxDeg = Math.max(1, ...Object.values(deg));
  raw.nodes.forEach(n => { n.__weight = (deg[n.id] ?? 0) / maxDeg; });
}

// ── drawLabel ────────────────────────────────────────────────────────────────
// Draws a dark-backdrop text label on a canvas at (lx, ly).
// The caller computes the position; this handles font, backdrop, and text.
//
// align: 'left' | 'right' | 'center'
export function drawLabel(ctx, text, lx, ly, align, fontSize, globalScale, color, backdrop) {
  const fs = fontSize / globalScale;
  ctx.font = `${fs}px 'IBM Plex Sans', system-ui, sans-serif`;
  const tw = ctx.measureText(text).width;
  const p  = 4 / globalScale;

  const bgX = align === 'center' ? lx - tw / 2 - p
             : align === 'right'  ? lx - tw - p
             :                      lx - p;
  ctx.fillStyle = backdrop;
  ctx.fillRect(bgX, ly - fs / 2 - p, tw + p * 2, fs + p * 2);
  ctx.fillStyle    = color;
  ctx.textAlign    = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, lx, ly);
}

// ── FONT_MONO ─────────────────────────────────────────────────────────────────
// Canonical monospace font stack. Use in inline JSX styles wherever a code-like
// font is needed (link labels, paths, snippets). Matches --font-mono in shell.css.
export const FONT_MONO = "'Fira Code', 'Cascadia Code', 'Consolas', monospace";

// ── PALETTE ──────────────────────────────────────────────────────────────────
// Canonical colour roles shared by every graph page.
// Pages assign their node types to these roles — never to raw hex values.
export const PALETTE = {
  ENTRY:     '#f0a500',  // yellow — entry points (top-level triggers / anchors)
  CONNECTOR: '#3dba7f',  // green  — links between (orchestrators / operations)
  LEAF:      '#4e8ef7',  // blue   — most nodes   (decisions / modules)
};

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


// ── paintNodeColors ───────────────────────────────────────────────────────────
// Returns the two theme-dependent colour values every paintNode callback needs.
// Call once per paintNode invocation (inside useCallback, before the loop body).
//
// Usage:
//   const paintNode = React.useCallback((node, ctx, globalScale) => {
//     const { activeColor, backdrop } = paintNodeColors(theme);
//     // … draw circle … drawLabel(ctx, …, activeColor, backdrop);
//   }, [activeId, neighbours, searchMatchIds, theme]);
export function paintNodeColors(theme) {
  return {
    activeColor: theme === 'dark' ? '#fff' : '#1a1b26',
    backdrop:    theme === 'dark' ? 'rgba(31,36,48,0.9)' : 'rgba(245,245,240,0.9)',
  };
}

// ── setupLayout ──────────────────────────────────────────────────────────────
// Creates the top bar + graph pane DOM structure and appends it to <body>.
// Call once at the top of each page script, before mounting React.
export function setupLayout() {
  const header = document.createElement('header');
  header.id = 'top-bar';
  document.body.appendChild(header);

  const layout = document.createElement('div');
  layout.id = 'layout';
  layout.innerHTML = '<div id="viz-pane"><div id="graph"></div></div>';
  document.body.appendChild(layout);
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
    width:  window.innerWidth - padding * 2,
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
// hover/focus ids, graph data, active node, neighbour set,
// and ready-to-use onNodeClick / onBackgroundClick props.
// Returns { activeId, graph, activeNode, neighbours,
//           setHoveredId, setFocusedId, onNodeClick, onBackgroundClick }.
export function useGraphState(raw, nodeTypes) {
  const [hoveredId, setHoveredId] = React.useState(null);
  const [focusedId, setFocusedId] = React.useState(null);

  const activeId = focusedId ?? hoveredId;

  const [searchQuery, setSearchQuery] = React.useState('');

  const graph = React.useMemo(() => ({
    nodes: raw.nodes,
    links: raw.links,
  }), [raw]);

  const searchMatchIds = React.useMemo(() => {
    if (!searchQuery) return new Set();
    const q = searchQuery.toLowerCase();
    return new Set(graph.nodes.filter(n => n.id.toLowerCase().includes(q)).map(n => n.id));
  }, [searchQuery, graph.nodes]);

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

  return {
    activeId, graph, activeNode, neighbours, setHoveredId, setFocusedId,
    searchQuery, setSearchQuery, searchMatchIds,
    onNodeClick:       node => {
      window.__closeNavMenu?.();
      setFocusedId(p => p === node.id ? null : node.id);
    },
    onBackgroundClick: ()   => {
      window.__closeNavMenu?.();
      setFocusedId(null);
    },
  };
}

// ── useBraveClickFix ─────────────────────────────────────────────────────────
// Brave Shields blocks canvas getImageData which react-force-graph uses for
// hit-testing via nodePointerAreaPaint. Wraps onBackgroundClick with a
// geometric fallback so node clicks still register in Brave (and any other
// browser that restricts canvas pixel reads).
//
// Usage inside a page's Graph component:
//   const handleBackgroundClick = useBraveClickFix(
//     fgRef, graph.nodes, dotRadius, setFocusedId, onBackgroundClick);
//   // then: <ForceGraph2D onBackgroundClick={handleBackgroundClick} … />
export function useBraveClickFix(fgRef, graphNodes, dotRadiusFn, setFocusedId, onBackgroundClick) {
  return React.useCallback(evt => {
    const fg = fgRef.current;
    if (fg && evt) {
      const canvas = document.querySelector('#graph canvas');
      const rect   = canvas?.getBoundingClientRect();
      if (rect) {
        const cx = (evt.clientX ?? evt.changedTouches?.[0]?.clientX ?? 0) - rect.left;
        const cy = (evt.clientY ?? evt.changedTouches?.[0]?.clientY ?? 0) - rect.top;
        const { x, y } = fg.screen2GraphCoords(cx, cy);
        const zoom = fg.zoom();
        const hit = graphNodes.find(n => {
          const r = dotRadiusFn(n) / zoom + RENDER.hitTestPadding;
          return Math.hypot(n.x - x, n.y - y) <= r;
        });
        if (hit) { setFocusedId(prev => prev === hit.id ? null : hit.id); return; }
      }
    }
    onBackgroundClick();
  }, [graphNodes, dotRadiusFn, setFocusedId, onBackgroundClick]);
}

// ── NavBar ───────────────────────────────────────────────────────────────────
// Portals into #top-bar (created by setupLayout).
// Desktop: nav links left, children (chips / search / theme) pushed right.
// Mobile:  hamburger toggles a drop-down panel containing both.
//
// Usage inside a page's JSX:
//   <NavBar activeHref="./index.html">
//     <SearchBox … /> <ThemeToggle … />
//   </NavBar>
export function NavBar({ activeHref, children }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Expose a global closer so graph interactions can dismiss the menu.
  React.useEffect(() => {
    window.__closeNavMenu = () => setMenuOpen(false);
    return () => { delete window.__closeNavMenu; };
  }, []);

  // Sync menu-open class onto #top-bar so CSS can drive the mobile panel.
  React.useEffect(() => {
    document.getElementById('top-bar')?.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  // Close when tapping outside the top bar on mobile.
  React.useEffect(() => {
    if (!menuOpen) return;
    const close = e => {
      if (!document.getElementById('top-bar')?.contains(e.target)) setMenuOpen(false);
    };
    const id = setTimeout(() => document.addEventListener('pointerdown', close), 0);
    return () => { clearTimeout(id); document.removeEventListener('pointerdown', close); };
  }, [menuOpen]);

  const container = document.getElementById('top-bar');
  if (!container) return null;

  const navLinks = NAV.flatMap(({ label, href, external }, i) => {
    const isActive = href === activeHref;
    const link = isActive
      ? React.createElement('span', { key: label, className: 'nav-link nav-active' }, label)
      : (() => {
          const props = { key: label, className: 'nav-link', href };
          if (external) { props.target = '_blank'; props.rel = 'noopener noreferrer'; }
          return React.createElement('a', props, label);
        })();
    return i === 0
      ? [link]
      : [React.createElement('span', { key: `sep-${i}`, className: 'nav-sep', 'aria-hidden': 'true' }, '|'), link];
  });

  return createPortal(
    React.createElement(React.Fragment, null,
      // .top-bar-panel: display:contents on desktop (children lay out in the bar
      // directly); flex column dropdown on mobile when #top-bar.menu-open.
      React.createElement('div', { className: 'top-bar-panel' },
        React.createElement('nav', { className: 'top-bar-nav' }, ...navLinks),
        React.createElement('div', { className: 'top-bar-right' }, children),
      ),
      // Hamburger — hidden on desktop, shown on mobile.
      React.createElement('button', {
        id: 'menu-btn',
        onClick: () => setMenuOpen(m => !m),
        'aria-label': menuOpen ? 'Close menu' : 'Open menu',
        'aria-expanded': String(menuOpen),
      }, menuOpen ? '✕' : '☰'),
    ),
    container,
  );
}

// ── useTheme ──────────────────────────────────────────────────────────────────
// Manages dark/light theme state. Toggles data-theme on <html> and re-reads
// --bg-color so the ForceGraph2D backgroundColor prop stays in sync.
// Returns { theme, toggleTheme, bgColor }.
export function useTheme() {
  const [theme, setTheme] = React.useState(() => {
    const saved = localStorage.getItem('theme');
    const initial = saved ? saved : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = initial === 'light' ? 'light' : '';
    return initial;
  });
  const [bgColor, setBgColor] = React.useState(
    () => getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim()
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next === 'light' ? 'light' : '';
      localStorage.setItem('theme', next);
      setBgColor(getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim());
      return next;
    });
  }, []);

  return { theme, toggleTheme, bgColor };
}

// ── ThemeToggle ───────────────────────────────────────────────────────────────
// A ☀/☾ pill button to be placed inside NavBar after SearchBox.
// Usage:
//   const { theme, toggleTheme, bgColor } = useTheme();
//   <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
export function ThemeToggle({ theme, toggleTheme }) {
  return React.createElement('button', {
    className:  'theme-toggle',
    onClick:    toggleTheme,
    'aria-label': theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
  }, theme === 'dark' ? '☀' : '☾');
}

// ── OpenSourceNote ────────────────────────────────────────────────────────────
// info-label–styled footer note. Rendered at the bottom of every panel.
export function OpenSourceNote() {
  return React.createElement(React.Fragment, null,
    React.createElement('hr', { style: { border: 'none', borderTop: '1px solid rgba(155,175,215,0.15)', margin: '12px 0 0' } }),
    React.createElement('div', { className: 'info-label', style: { textTransform: 'none' } },
    React.createElement('a', {
      href: 'https://github.com/gazelle-cloud/Azure-landing-zones',
      target: '_blank',
      rel: 'noopener noreferrer',
      style: { color: 'inherit', textDecoration: 'underline' },
    }, 'Open source — view on GitHub'),
    ),
  );
}

// ── SearchBox ─────────────────────────────────────────────────────────────────
// Renders a search input + live dropdown of matching node IDs.
// Clicking a result focuses the node and clears the query.
// Usage:
//   <SearchBox nodes={graph.nodes} searchQuery={searchQuery}
//              setSearchQuery={setSearchQuery} setFocusedId={setFocusedId} />
export function SearchBox({ nodes, searchQuery, setSearchQuery, setFocusedId, onFocus, onBlur }) {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef(null);
  const q       = searchQuery.toLowerCase();
  const matches = q.length > 0 ? nodes.filter(n => n.id.toLowerCase().includes(q)) : nodes;

  return React.createElement('div', { className: 'search-box' },
    React.createElement('input', {
      ref:         inputRef,
      className:   'search-input',
      type:        'text',
      placeholder: 'Search…',
      value:       searchQuery,
      onChange:    e => setSearchQuery(e.target.value),
      onFocus:     () => { setOpen(true);  onFocus?.(); },
      onBlur:      () => { setOpen(false); onBlur?.(); },
      onKeyDown:   e => { if (e.key === 'Escape') { setSearchQuery(''); setOpen(false); } },
    }),
    open && matches.length > 0 && React.createElement('div', { className: 'search-dropdown' },
      ...matches.map(n =>
        React.createElement('div', {
          key:         n.id,
          className:   'search-result',
          onMouseDown: e => {
            e.preventDefault(); // prevent blur firing before click
            window.__closeNavMenu?.();
            setFocusedId(n.id);
            setSearchQuery('');
            setOpen(false);
            inputRef.current?.blur();
          },
        }, n.id)
      )
    ),
  );
}

// ── DetailHeader ─────────────────────────────────────────────────────────────
// Renders the standard two-line header inside the detail pane:
//   - a small-caps type label  (info-id)
//   - a bold node ID           (info-text, high-contrast)
// Usage:
//   <DetailHeader typeLabel={TYPE_LABELS[activeNode.type]} nodeId={activeNode.id} theme={theme} />
export function DetailHeader({ nodeId }) {
  return React.createElement('div', { className: 'info-label', style: { marginTop: 0 } }, nodeId);
}

// ── useMousePos ───────────────────────────────────────────────────────────────
// Tracks the current mouse position in viewport coordinates.
// Returns { x, y } on desktop, or null on touch-only devices.
export function useMousePos() {
  const [pos, setPos] = React.useState(null);
  React.useEffect(() => {
    const h = e => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  return pos;
}

// ── NodeTooltip ───────────────────────────────────────────────────────────────
// Floating tooltip that follows the cursor on desktop and anchors to the
// bottom-centre on mobile (where there is no mouse position).
// Renders nothing when `node` is null/undefined.
//
// Usage:
//   const mousePos = useMousePos();
//   <NodeTooltip node={activeNode} mousePos={mousePos} theme={theme}>
//     {/* your info-label / info-text elements */}
//   </NodeTooltip>
const TOOLTIP_W = 280;
export function NodeTooltip({ node, mousePos, theme, children }) {
  if (!node) return null;

  let style;
  if (mousePos) {
    let x = mousePos.x + 16;
    let y = mousePos.y + 16;
    if (x + TOOLTIP_W > window.innerWidth - 16) x = mousePos.x - TOOLTIP_W - 16;
    if (y < 10) y = 10;
    style = { left: x, top: y, maxWidth: TOOLTIP_W };
  } else {
    // Mobile: centred near the bottom of the screen
    style = {
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: 24,
      maxWidth: Math.min(TOOLTIP_W, window.innerWidth - 32),
    };
  }

  return React.createElement(
    'div',
    { className: `node-tooltip${theme === 'light' ? ' light' : ''}`, style },
    children,
  );
}

// ── nodePointerAreaPaint ──────────────────────────────────────────────────────
// Standard hit-test paint for every graph page. Spread directly onto
// <ForceGraph2D nodePointerAreaPaint={nodePointerAreaPaint} />.
// Requires each paintNode callback to store node.__r (the scaled radius).
export function nodePointerAreaPaint(node, color, ctx) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(node.x, node.y, (node.__r ?? 4) + RENDER.hitTestPadding, 0, 2 * Math.PI);
  ctx.fill();
}

// ── CornerPanel ───────────────────────────────────────────────────────────────
// Fixed overlay panel anchored to the top-right corner of the viewport.
// Invisible when `node` is null; scrollable when content is tall.
// On mobile it reflows to a bottom sheet.
//
// Usage:
//   <CornerPanel node={activeNode} theme={theme}>
//     {/* info-label / info-text elements */}
//   </CornerPanel>
export function CornerPanel({ node, theme, children }) {
  if (!node) return null;
  return React.createElement(
    'div',
    { className: `corner-panel${theme === 'light' ? ' light' : ''}` },
    children,
    React.createElement(OpenSourceNote),
  );
}

