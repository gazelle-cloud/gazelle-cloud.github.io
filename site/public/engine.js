import ForceGraph2D from 'https://esm.sh/react-force-graph-2d?external=react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  NavBar, SearchBox, ThemeToggle, DetailHeader,
  useTheme, setupLayout, useVizPaneSize, useGraphPhysics,
  RENDER, PALETTE, normalizeNodeWeights, drawLabel, linkEnds,
  useGraphState, useBraveClickFix, CornerPanel, MobileNameplate, nodePointerAreaPaint,
  paintNodeColors, FooterBar,
} from '/shell.js';
import { GITHUB_URL, GITHUB_ICON_PATH } from '/nav.js';

// ── mount ─────────────────────────────────────────────────────────────────────
export async function mount(config) {
  setupLayout();

  // ── fetch data ──────────────────────────────────────────────────────────────
  const raw = config.getData
    ? await config.getData()
    : await fetch(config.localJson).then(r => r.json());

  normalizeNodeWeights(raw);
  if (config.prepare) config.prepare(raw);

  // ── derived constants ───────────────────────────────────────────────────────
  const typeKeys   = Object.keys(config.types);
  const typeColors = Object.fromEntries(
    Object.entries(config.types).map(([t, cfg]) => [t, PALETTE[cfg.palette]])
  );

  const nodeLabelFn = config.nodeLabel ?? (n => n.id.replaceAll('-', ' '));

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
    } = useGraphState(raw, typeKeys, nodeLabelFn);

    const handleBackgroundClick = useBraveClickFix(
      fgRef, graph.nodes, dotRadius, setFocusedId, onBackgroundClick
    );

    const [searchFocused, setSearchFocused] = React.useState(false);
    const [panelHoverId, setPanelHoverId]   = React.useState(null);

    React.useEffect(() => {
      const hash = window.location.hash.slice(1);
      if (hash && graph.nodes.some(n => n.id === hash)) setFocusedId(hash);
    }, []);

    React.useEffect(() => {
      const handleClick = e => {
        const canvas  = document.querySelector('#graph canvas');
        const inCanvas = canvas && (e.target === canvas || canvas.contains(e.target));
        const inPanel  = e.target.closest?.('.corner-panel');
        if (!inCanvas && !inPanel) setFocusedId(null);
      };
      const handleKey = e => { if (e.key === 'Escape') setFocusedId(null); };
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKey);
      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKey);
      };
    }, [setFocusedId]);

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
      ctx.fillStyle = isActive || node.id === panelHoverId ? activeColor : (typeColors[node.type] ?? '#ccc');
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
    }, [activeId, neighbours, searchMatchIds, theme, panelHoverId]);

    const panelContent = activeNode
      ? config.panel(activeNode, graph, { setFocusedId, theme, typeColors })
      : null;

    return React.createElement(React.Fragment, null,

      React.createElement(NavBar, { activeHref: config.activeHref },
        React.createElement(SearchBox, {
          nodes: graph.nodes, searchQuery, setSearchQuery, setFocusedId,
          nodeLabel: nodeLabelFn,
          onFocus: () => setSearchFocused(true),
          onBlur:  () => setSearchFocused(false),
        }),
        React.createElement(ThemeToggle, { theme, toggleTheme }),
        React.createElement('a', {
          href: GITHUB_URL,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'gh-link',
          'aria-label': 'GitHub repository',
          title: 'GitHub repository',
        }, React.createElement('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'currentColor', 'aria-hidden': 'true' },
          React.createElement('path', { d: GITHUB_ICON_PATH }),
        )),
      ),

      !activeNode && !searchFocused && config.idlePanel &&
        React.createElement(config.idlePanel, { theme, setHoveredId: setPanelHoverId }),

      !searchFocused && activeNode &&
        React.createElement(CornerPanel, { node: activeNode, theme },
          React.createElement(DetailHeader, {
            nodeId: config.panelLabel
              ? config.panelLabel(activeNode)
              : config.nodeLabel
                ? config.nodeLabel(activeNode)
                : activeNode.id.replaceAll('-', ' '),
            href: config.nodeHref ? config.nodeHref(activeNode) : undefined,
          }),
          panelContent,
        ),

      !searchFocused && activeNode &&
        React.createElement(MobileNameplate, {
          node:      activeNode,
          typeLabel: config.types[activeNode.type]?.label,
          label:     config.nameplateLabel
            ? config.nameplateLabel(activeNode)
            : config.panelLabel
              ? config.panelLabel(activeNode)
              : config.nodeLabel
                ? config.nodeLabel(activeNode)
                : activeNode.id.replaceAll('-', ' '),
          href:  config.nodeHref ? config.nodeHref(activeNode) : undefined,
          theme,
        }),

      React.createElement(ForceGraph2D, {
        ref: fgRef,
        width:  config.maxCanvasWidth  ? Math.min(size.width,  config.maxCanvasWidth)  : size.width,
        height: config.maxCanvasHeight ? Math.min(size.height, config.maxCanvasHeight) : size.height,
        graphData: graph,
        linkColor,
        linkDirectionalArrowLength: 0,
        ...physicsProps,
        ...(config.cooldownTime  != null ? { cooldownTime:  config.cooldownTime  } : {}),
        ...(config.warmupTicks  != null ? { warmupTicks:   config.warmupTicks   } : {}),
        backgroundColor: bgColor,
        onNodeHover:       node => setHoveredId(node?.id ?? null),
        onNodeClick,
        onBackgroundClick: handleBackgroundClick,
        nodeCanvasObject:  paintNode,
        nodePointerAreaPaint,
        ...(config.onRenderFramePost ? { onRenderFramePost: config.onRenderFramePost } : {}),
      }),

      React.createElement(FooterBar),
    );
  }

  createRoot(document.getElementById('graph')).render(React.createElement(Graph));
}
