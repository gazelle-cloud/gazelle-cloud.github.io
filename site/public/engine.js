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
  const typeLabels = Object.fromEntries(
    Object.entries(config.types).map(([t, cfg]) => [t, cfg.label])
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
      ? config.panel(activeNode, graph, { setFocusedId, theme, typeColors, typeLabels })
      : null;

    return React.createElement(React.Fragment, null,

      React.createElement(NavBar, { activeHref: config.activeHref },
        React.createElement(SearchBox, {
          nodes: graph.nodes, searchQuery, setSearchQuery, setFocusedId,
          onFocus: () => setSearchFocused(true),
          onBlur:  () => setSearchFocused(false),
        }),
        React.createElement(ThemeToggle, { theme, toggleTheme }),
      ),

      !activeNode && !searchFocused && config.idlePanel &&
        React.createElement(config.idlePanel, { theme }),

      !searchFocused && activeNode &&
        React.createElement(CornerPanel, { node: activeNode, theme },
          React.createElement(DetailHeader, {
            typeLabel: typeLabels[activeNode.type] ?? activeNode.type,
            nodeId: config.nodeLabel
              ? config.nodeLabel(activeNode)
              : activeNode.id.replaceAll('-', ' '),
            theme,
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
