import React from 'react';

// ── navigation entries ───────────────────────────────────────────────────────
// Add one object here whenever you create a new page. That's it.
export const NAV = [
  { label: 'Design decisions',  href: './design-decisions.html' },
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
export function drawLabel(ctx, text, lx, ly, align, fontSize, globalScale, color, backdrop = BACKDROP) {
  const fs = fontSize / globalScale;
  ctx.font = `${fs}px Sans-Serif`;
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
    '<div id="viz-pane"><div id="graph"></div><button id="detail-collapse-btn" aria-label="Toggle detail panel"></button></div>' +
    '<div id="detail-pane"><button id="detail-toggle" aria-label="Dismiss panel"></button></div>';
  document.body.appendChild(layout);

  // Desktop only: collapse/expand the detail pane, persisted across pages.
  // Skipped on mobile so the bottom sheet is never accidentally hidden.
  const isDesktop = () => window.innerWidth > 768;

  if (isDesktop() && localStorage.getItem('detail-hidden') === '1')
    layout.setAttribute('data-detail-hidden', '');

  document.getElementById('detail-collapse-btn').addEventListener('click', () => {
    const hidden = layout.toggleAttribute('data-detail-hidden');
    if (isDesktop()) localStorage.setItem('detail-hidden', hidden ? '1' : '0');
  });

  // Mobile: tapping the close button dismisses the bottom sheet.
  // Node clicks (handled in useGraphState) clear this attribute to re-open it.
  document.getElementById('detail-toggle').addEventListener('click', () => {
    layout.setAttribute('data-panel-dismissed', '');
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

  // Mobile: re-open the bottom sheet whenever a node is focused via a tap.
  React.useEffect(() => {
    if (focusedId) document.getElementById('layout')?.removeAttribute('data-panel-dismissed');
  }, [focusedId]);

  const [searchQuery, setSearchQuery] = React.useState('');

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
    searchQuery, setSearchQuery, searchMatchIds,
    onNodeClick:       node => {
      // Close the hamburger menu when interacting with the graph.
      // The detail panel will open naturally via the focusedId effect.
      window.__closeNavMenu?.();
      setFocusedId(p => p === node.id ? null : node.id);
    },
    onBackgroundClick: ()   => {
      // Close both the hamburger menu and dismiss the detail panel.
      window.__closeNavMenu?.();
      document.getElementById('layout')?.setAttribute('data-panel-dismissed', '');
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
// Renders the #filters overlay: nav links on the left, then `children` (chips
// wrapped with a dim "show" label) flowing to the right.
//
// Usage inside a page's JSX:
//   <NavBar activeHref="./index.html">
//     {optionalFilterChipsOrLegend}
//   </NavBar>
export function NavBar({ activeHref, children }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Expose a global closer so graph interactions can dismiss the menu.
  React.useEffect(() => {
    window.__closeNavMenu = () => setMenuOpen(false);
    return () => { delete window.__closeNavMenu; };
  }, []);

  // Close the dropdown when the user taps outside it on mobile.
  React.useEffect(() => {
    if (!menuOpen) return;
    const close = e => {
      if (!document.getElementById('filters')?.contains(e.target)) setMenuOpen(false);
    };
    const id = setTimeout(() => document.addEventListener('pointerdown', close), 0);
    return () => { clearTimeout(id); document.removeEventListener('pointerdown', close); };
  }, [menuOpen]);

  return React.createElement('div', { id: 'filters', className: menuOpen ? 'menu-open' : '' },
    React.createElement('button', {
      id: 'menu-btn',
      onClick: () => setMenuOpen(m => !m),
      'aria-label': menuOpen ? 'Close menu' : 'Open menu',
      'aria-expanded': String(menuOpen),
    }, menuOpen ? '✕' : '☰'),
    React.createElement('div', { className: 'nav-menu' },
      React.createElement('div', { className: 'nav-stack' },
        ...NAV.map(({ label, href, external }) => {
          if (href === activeHref)
            return React.createElement('span', { key: label, className: 'nav-link nav-active' }, label);
          const props = { key: label, className: 'nav-link', href };
          if (external) { props.target = '_blank'; props.rel = 'noopener noreferrer'; }
          return React.createElement('a', props, label);
        })
      ),
      children,
    ),
  );
}

// ── useTheme ──────────────────────────────────────────────────────────────────
// Manages dark/light theme state. Toggles data-theme on <html> and re-reads
// --bg-color so the ForceGraph2D backgroundColor prop stays in sync.
// Returns { theme, toggleTheme, bgColor }.
export function useTheme() {
  const [theme, setTheme] = React.useState(() => {
    const saved = localStorage.getItem('theme');
    const initial = saved === 'light' ? 'light' : 'dark';
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

// ── SearchBox ─────────────────────────────────────────────────────────────────
// Renders a search input + live dropdown of matching node IDs.
// Clicking a result focuses the node and clears the query.
// Usage:
//   <SearchBox nodes={graph.nodes} searchQuery={searchQuery}
//              setSearchQuery={setSearchQuery} setFocusedId={setFocusedId} />
export function SearchBox({ nodes, searchQuery, setSearchQuery, setFocusedId }) {
  const [open, setOpen] = React.useState(false);
  const q       = searchQuery.toLowerCase();
  const matches = q.length > 0 ? nodes.filter(n => n.id.toLowerCase().includes(q)) : nodes;

  return React.createElement('div', { className: 'search-box' },
    React.createElement('input', {
      className:   'search-input',
      type:        'text',
      placeholder: 'Search…',
      value:       searchQuery,
      onChange:    e => setSearchQuery(e.target.value),
      onFocus:     () => setOpen(true),
      onBlur:      () => setOpen(false),
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
export function DetailHeader({ typeLabel, nodeId, theme }) {
  return React.createElement(React.Fragment, null,
    React.createElement('div', { className: 'info-id' }, typeLabel),
    React.createElement('p', {
      className: 'info-text',
      style: { color: theme === 'dark' ? '#fff' : '#1a1b26', margin: '0 0 8px', fontWeight: 600 },
    }, nodeId),
  );
}

// ── FilterChips ──────────────────────────────────────────────────────────────
// Renders the type-filter chips inside NavBar.
// Usage:
//   <FilterChips nodeTypes={NODE_TYPES} typeLabels={TYPE_LABELS}
//                colors={COLORS} visible={visible} toggleType={toggleType} />
export function FilterChips({ nodeTypes, typeLabels, colors, visible, toggleType }) {
  return React.createElement('div', { className: 'chips-col' },
    ...nodeTypes.map(type =>
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
    )
  );
}
