    import ForceGraph2D from 'https://esm.sh/react-force-graph-2d?external=react';
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { forceCollide, forceRadial } from 'https://esm.sh/d3-force';
    import { NavBar, SearchBox, ThemeToggle, DetailHeader, useTheme, setupLayout, useVizPaneSize, useGraphPhysics, RENDER, PALETTE, drawLabel, linkEnds, useGraphState, useBraveClickFix, CornerPanel, nodePointerAreaPaint, paintNodeColors } from '/shell.js';

    setupLayout();

    // ─── constants ───────────────────────────────────────────────────────────

    const nodeColor = node =>
      node.id === 'landing-zone'
        ? PALETTE.ENTRY
        : node.type === 'guardrails'
          ? PALETTE.LEAF
          : PALETTE.CONNECTOR;

    const NODE_TYPES = ['landing-zone', 'design-area', 'guardrails'];

    const TYPE_LABELS = {
      'landing-zone': 'landing-zone',
      'design-area':  'design-area',
      'guardrails':   'guardrails',
    };

    const dotRadius = node => node.id === 'landing-zone' ? 9 : 5;

    // ─── data prep ───────────────────────────────────────────────────────────

    const raw = await fetch('/landing-zone.json').then(r => r.json());

    // Deduplicate links by source+target key
    const seen = new Set();
    raw.links = raw.links.filter(l => {
      const key = `${l.source}→${l.target}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const nodeById = new Map(raw.nodes.map(n => [n.id, n]));

    // Pin landing-zone at the centre
    const centre = nodeById.get('landing-zone');
    if (centre) { centre.fx = 0; centre.fy = 0; }

    // Distribute design-areas evenly in a ring (initial positions, not pinned)
    const R_INNER = 20;
    const designAreas = raw.nodes.filter(n => n.type === 'design-area');
    designAreas.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / designAreas.length - Math.PI / 2;
      n.x = Math.cos(angle) * R_INNER;
      n.y = Math.sin(angle) * R_INNER;
    });

    // Fan guardrails outward along their parent design-area's spoke (initial positions)
    const R_OUTER = 55;
    const guardrailGroups = {};
    raw.links.forEach(l => {
      const src = nodeById.get(l.source);
      const tgt = nodeById.get(l.target);
      if (src?.type === 'guardrails' && tgt?.type === 'design-area')
        (guardrailGroups[tgt.id] ??= []).push(src);
      if (tgt?.type === 'guardrails' && src?.type === 'design-area')
        (guardrailGroups[src.id] ??= []).push(tgt);
    });
    Object.entries(guardrailGroups).forEach(([parentId, list]) => {
      const parent = nodeById.get(parentId);
      const parentAngle = Math.atan2(parent.y, parent.x);
      const fanSpread = 0.4;
      list.forEach((n, i) => {
        const offset = list.length > 1
          ? (i / (list.length - 1) - 0.5) * fanSpread
          : 0;
        const angle = parentAngle + offset;
        n.x = Math.cos(angle) * R_OUTER;
        n.y = Math.sin(angle) * R_OUTER;
      });
    });

    // ─── idle panel ──────────────────────────────────────────────────────────

    function IdlePanel({ theme }) {
      return (
        <div className={`corner-panel${theme === 'light' ? ' light' : ''}`}>
          <h1 style={{ margin: '0 0 12px', padding: 0, fontSize: 16, fontWeight: 400, lineHeight: 1.3, color: '#fff' }}>
            Landing Zone
          </h1>
          <p style={{ margin: '0 0 14px', fontSize: 14, color: 'rgba(155,175,215,0.75)', letterSpacing: '0.03em' }}>
            Design areas of an Azure landing zone
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="info-text" style={{ margin: 0 }}>Each spoke represents a design area — a domain of concern that shapes how the landing zone is built and governed. Guardrails are the concrete policy and configuration decisions that enforce each area.</p>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(155,175,215,0.15)', margin: '4px 0' }} />
            <p className="info-text" style={{ margin: 0 }}><span style={{ color: PALETTE.ENTRY }}>Yellow</span> = landing zone</p>
            <p className="info-text" style={{ margin: 0 }}><span style={{ color: PALETTE.CONNECTOR }}>Green</span> = design areas</p>
            <p className="info-text" style={{ margin: 0 }}><span style={{ color: PALETTE.LEAF }}>Blue</span> = guardrails</p>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(155,175,215,0.15)', margin: '4px 0' }} />
            <p className="info-text" style={{ margin: 0 }}>
              This entire platform, code and knowledge graph included, is on <a href="https://github.com/orgs/gazelle-cloud/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(155,175,215,0.85)', textDecoration: 'none', borderBottom: '1px solid rgba(155,175,215,0.3)' }}>GitHub</a>.
            </p>
          </div>
        </div>
      );
    }

    // ─── component ───────────────────────────────────────────────────────────

    function Graph() {
      const fgRef = React.useRef();
      const { theme, toggleTheme, bgColor } = useTheme();

      const size = useVizPaneSize(fgRef);

      const { activeId, graph, activeNode, neighbours, setHoveredId, setFocusedId, onNodeClick, onBackgroundClick, searchQuery, setSearchQuery, searchMatchIds } = useGraphState(raw, NODE_TYPES);
      const handleBackgroundClick = useBraveClickFix(fgRef, graph.nodes, dotRadius, setFocusedId, onBackgroundClick);

      const [searchFocused, setSearchFocused] = React.useState(false);

      // Auto-focus node from URL hash
      React.useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash && graph.nodes.some(n => n.id === hash)) {
          setFocusedId(hash);
        }
      }, []);

      const physicsProps = useGraphPhysics(fgRef, graph, fg => {
        fg.d3Force('link')
          .distance(l => {
            const [, t] = linkEnds(l);
            const tgt = raw.nodes.find(n => n.id === t);
            return tgt?.type === 'guardrails' ? 25 : 30;
          })
          .strength(l => {
            const [, t] = linkEnds(l);
            const tgt = raw.nodes.find(n => n.id === t);
            return tgt?.type === 'guardrails' ? 0.8 : 0.3;
          });
        fg.d3Force('collision', forceCollide(n => dotRadius(n) + 8));
        fg.d3Force('charge').strength(n => {
          if (n.id === 'landing-zone') return 0;
          return n.type === 'guardrails' ? -60 : -30;
        });
        fg.d3Force('radial', forceRadial(
          n => n.type === 'guardrails' ? 55 : 20, 0, 0)
          .strength(n => {
            if (n.id === 'landing-zone') return 0;
            return n.type === 'guardrails' ? 0.2 : 0.8;
          }));
      });

      const linkColor = React.useCallback(l => {
        const dim    = theme === 'dark' ? 'rgba(61,186,127,0.3)'  : 'rgba(40,140,80,0.2)';
        const active = theme === 'dark' ? 'rgba(61,186,127,0.85)' : 'rgba(40,140,80,0.7)';
        const faded  = theme === 'dark' ? 'rgba(61,186,127,0.05)' : 'rgba(40,140,80,0.04)';
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
        const r           = dotRadius(node) / globalScale;

        const { activeColor, backdrop } = paintNodeColors(theme);

        ctx.globalAlpha = dimmed ? RENDER.dimmedAlpha : 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = isActive ? activeColor : nodeColor(node);
        ctx.fill();

        const isCenter  = node.id === 'landing-zone';
        const showLabel = isCenter || isActive || isNeighbour || isMatch;
        if (showLabel) {
          const gap = r + RENDER.labelGap / globalScale;
          let lx, ly, align;
          if (isCenter) {
            lx    = node.x;
            ly    = node.y - r - (RENDER.labelGap + 6) / globalScale;
            align = 'center';
          } else {
            const angle = Math.atan2(node.y, node.x);
            lx    = node.x + Math.cos(angle) * gap;
            ly    = node.y + Math.sin(angle) * gap;
            align = Math.cos(angle) >= 0 ? 'left' : 'right';
          }
          drawLabel(ctx, node.id.replaceAll('-', ' '), lx, ly, align,
            isCenter ? RENDER.labelFontSize + 1 : RENDER.labelFontSize,
            globalScale, isActive ? activeColor : nodeColor(node), backdrop);
        }

        ctx.globalAlpha = 1;
        node.__r = r;
      }, [activeId, neighbours, searchMatchIds, theme]);

      return <>
        <NavBar activeHref="/landing-zone/">
          <SearchBox nodes={graph.nodes} searchQuery={searchQuery}
                     setSearchQuery={setSearchQuery} setFocusedId={setFocusedId}
                     onFocus={() => setSearchFocused(true)}
                     onBlur={() => setSearchFocused(false)} />
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </NavBar>

        {!activeNode && !searchFocused && <IdlePanel theme={theme} />}

        {!searchFocused && <CornerPanel node={activeNode} theme={theme}>
          <DetailHeader typeLabel={TYPE_LABELS[activeNode?.type]} nodeId={activeNode?.id?.replaceAll('-', ' ')} theme={theme} />
          {activeNode?.description && <>
            <div className="info-label">Description</div>
            <p className="info-text">{activeNode.description}</p>
          </>}
        </CornerPanel>}

        <ForceGraph2D
          ref={fgRef}
          width={size.width}
          height={size.height}
          graphData={graph}
          linkColor={linkColor}
          linkDirectionalArrowLength={0}
          {...physicsProps}
          backgroundColor={bgColor}
          onNodeHover={node => setHoveredId(node?.id ?? null)}
          onNodeClick={onNodeClick}
          onBackgroundClick={handleBackgroundClick}
          nodeCanvasObject={paintNode}
          nodePointerAreaPaint={nodePointerAreaPaint}
        />
      </>;
    }

    // ─── mount ───────────────────────────────────────────────────────────────

    createRoot(document.getElementById('graph')).render(<Graph />);
