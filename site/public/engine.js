import ForceGraph2D from 'https://esm.sh/react-force-graph-2d?external=react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  NavBar, SearchBox, ThemeToggle, DetailHeader,
  useTheme, setupLayout, useVizPaneSize, useGraphPhysics,
  RENDER, PALETTE, normalizeNodeWeights, drawLabel, linkEnds,
  useGraphState, useBraveClickFix, CornerPanel, nodePointerAreaPaint,
  paintNodeColors,
} from '/shell.js';

// ── mount ─────────────────────────────────────────────────────────────────────
export async function mount(config) {
  setupLayout();

  // ── fetch data ──────────────────────────────────────────────────────────────
  const raw = await fetch(config.localJson).then(r => r.json());

  normalizeNodeWeights(raw);
  if (config.prepare) config.prepare(raw);

  // ── derived constants ───────────────────────────────────────────────────────
  const typeKeys   = Object.keys(config.types);
  const typeColors = Object.fromEntries(
    Object.entries(config.types).map(([t, cfg]) => [t, PALETTE[cfg.palette]])
  );

  const dotRadius = node =>
    config.dotRadius ? config.dotRadius(node) : 4;

  // ── Graph component ─────────────────────────────────────────────────────────
  function Graph() {
    const fgRef = React.useRef();
    const { theme, toggleTheme, bgColor } = useTheme();
    const size = useVizPaneSize(fgRef);

    const {
      activeId, graph, activeNode, neighbours,
      setHoveredId, setFocusedId,
      onNodeClick, onBackgroundClick,
      searchQuery, setSearchQuery, searchMatchIds,
    } = useGraphState(raw, typeKeys);

    const handleBackgroundClick = useBraveClickFix(
      fgRef, graph.nodes, dotRadius, setFocusedId, onBackgroundClick
    );

    const [searchFocused, setSearchFocused] = React.useState(false);

    React.useEffect(() => {
      const hash = window.location.hash.slice(1);
      if (hash && graph.nodes.some(n => n.id === hash)) setFocusedId(hash);
    }, []);

    const physicsProps = useGraphPhysics(fgRef, graph, fg => {
      config.forces(fg, graph.nodes, raw);
    });

    const linkColor = React.useCallback(l => {
      if (config.linkColor) return config.linkColor(l, { activeId, neighbours, theme });
      const dim   = theme === 'dark' ? 'rgba(180,195,225,0.28)' : 'rgba(80,80,100,0.15)';
      const active= theme === 'dark' ? 'rgba(235,242,255,0.95)' : 'rgba(30,30,50,0.75)';
      const faded = theme === 'dark' ? 'rgba(180,180,180,0.04)' : 'rgba(80,80,100,0.04)';
      if (!activeId) return dim;
      const [s, t] = linkEnds(l);
      return (s === activeId || t === activeId) ? active : faded;
    }, [activeId, theme]);

    const paintNode = React.useCallback((node, ctx, globalScale) => {
      const isActive    = node.id === activeId;
      const isNeighbour = neighbours?.has(node.id);
      const isMatch     = searchMatchIds.has(node.id);
      const dimmed      = activeId
        ? !isActive && !isNeighbour
        : searchMatchIds.size > 0 && !isMatch;
      const r = dotRadius(node) / globalScale;

      const { activeColor, backdrop } = paintNodeColors(theme);

      ctx.globalAlpha = dimmed ? RENDER.dimmedAlpha : 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
      ctx.fillStyle = isActive ? activeColor : (typeColors[node.type] ?? '#ccc');
      ctx.fill();

      const showLabel = config.showLabel
        ? config.showLabel(node, { activeId, isNeighbour, isMatch })
        : isActive || isNeighbour || isMatch;

      if (showLabel) {
        const gap = r + RENDER.labelGap / globalScale;
        let lx, ly, align;
        if (config.labelPosition) {
          ({ lx, ly, align } = config.labelPosition(node, r, gap, globalScale));
        } else {
          lx = node.x + gap; ly = node.y; align = 'left';
        }
        const text     = config.nodeLabel ? config.nodeLabel(node) : node.id.replaceAll('-', ' ');
        const fontSize = config.labelFontSize ? config.labelFontSize(node) : RENDER.labelFontSize;
        drawLabel(ctx, text, lx, ly, align, fontSize, globalScale,
          isActive ? activeColor : (typeColors[node.type] ?? '#ccc'), backdrop);
      }

      ctx.globalAlpha = 1;
      node.__r = r;
    }, [activeId, neighbours, searchMatchIds, theme]);

    const panelContent = activeNode
      ? config.panel(activeNode, graph, { setFocusedId, theme, typeColors })
      : null;

    return React.createElement(React.Fragment, null,

      React.createElement(NavBar, { activeHref: config.activeHref },
        React.createElement(SearchBox, {
          nodes: graph.nodes, searchQuery, setSearchQuery, setFocusedId,
          onFocus: () => setSearchFocused(true),
          onBlur:  () => setSearchFocused(false),
        }),
        React.createElement(ThemeToggle, { theme, toggleTheme }),
        React.createElement('a', {
          href: 'https://github.com/gazelle-cloud/Azure-landing-zones',
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'gh-link',
          'aria-label': 'GitHub repository',
          title: 'GitHub repository',
        }, React.createElement('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'currentColor', 'aria-hidden': 'true' },
          React.createElement('path', { d: 'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z' }),
        )),
      ),

      !activeNode && !searchFocused && config.idlePanel &&
        React.createElement(config.idlePanel, { theme }),

      !searchFocused && activeNode &&
        React.createElement(CornerPanel, { node: activeNode, theme },
          React.createElement(DetailHeader, {
            nodeId: config.nodeLabel
              ? config.nodeLabel(activeNode)
              : activeNode.id.replaceAll('-', ' '),
          }),
          panelContent,
        ),

      React.createElement(ForceGraph2D, {
        ref: fgRef,
        width:  size.width,
        height: size.height,
        graphData: graph,
        linkColor,
        linkDirectionalArrowLength: 0,
        ...physicsProps,
        ...(config.cooldownTime ? { cooldownTime: config.cooldownTime } : {}),
        backgroundColor: bgColor,
        onNodeHover:       node => setHoveredId(node?.id ?? null),
        onNodeClick,
        onBackgroundClick: handleBackgroundClick,
        nodeCanvasObject:  paintNode,
        nodePointerAreaPaint,
      }),
    );
  }

  createRoot(document.getElementById('graph')).render(React.createElement(Graph));
}
