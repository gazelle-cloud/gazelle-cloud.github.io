import { mount } from '/engine.js';
import { PALETTE, FONT_MONO, OpenSourceNote, linkEnds } from '/shell.js';
import React from 'react';

// ── animation data ─────────────────────────────────────────────────────────────
// One shared canvas: yellow corners define the boundary, green+blue live inside.
const CW = 52, CH = 40;
const BREATHE_AMP  = 0.08;
const BREATHE_FREQ = 0.12;
const DRIFT_A = 6;          // wander within the corner zone, stay inside the box
const FLOW_AX = 14, FLOW_AY = 10;
const VIS_AX  = 10, VIS_AY  = 8;
const REPULSE_DIST = 20;   // min centre-to-centre distance between non-principle dots
const OUTBOUND_COLOR = '#fb923c';

// Single descriptor table — every per-node property lives here.
const HOME_NODES = {
  // ── Principles (yellow, corners) ────────────────────────────────────────────
  'no-human-touch':          { type:'principle', corner:[-1,-1], wx:0.11,wy:0.18,px:0.00,py:0.00 },
  'no-fixed-cost':           { type:'principle', corner:[ 1,-1], wx:0.15,wy:0.10,px:2.09,py:1.05 },
  'no-platform-ops':         { type:'principle', corner:[-1, 1], wx:0.13,wy:0.21,px:4.19,py:2.09 },
  'no-unapproved-resources': { type:'principle', corner:[ 1, 1], wx:0.10,wy:0.14,px:1.05,py:3.14 },

  // ── Flow (green) ─────────────────────────────────────────────────────────────
  join:    { type:'flow', cx:-28, cy:-12, wx:0.19,wy:0.33,px:0.00,py:0.00, ax:4,ay:4, spring:0.06, kgNode:'landing-zone-join-the-platform' },
  request: { type:'flow', cx:  0, cy: -8, wx:0.27,wy:0.18,px:2.09,py:1.05 },
  deploy:  { type:'flow', cx: 28, cy:-12, wx:0.23,wy:0.38,px:4.19,py:2.09,                         kgNode:'landing-zone-getting-started'    },

  // ── Visual (blue) ────────────────────────────────────────────────────────────
  'knowledge-graph': { type:'visual', cx:-30,cy:16, wx:0.14,wy:0.11,px:0.00,py:1.20, ax:18,ay:14, href:'/knowledge-graph/', panelJson:'/knowledge-graph.json', panelType:'decision',        panelLabel:'Decisions',  panelColor:PALETTE.LEAF  },
  'operations':      { type:'visual', cx:  0,cy:22, wx:0.05,wy:0.08,px:2.00,py:0.60, href:'/operations/',      panelJson:'/operations.json',      panelType:'operation',       panelLabel:'Operations', panelColor:PALETTE.ENTRY },
  'big-bang':        { type:'visual', cx: 30,cy:16, wx:0.09,wy:0.06,px:1.00,py:2.40, href:'/bigbang/',         panelJson:'/bigbang.json',          panelType:'github-workflow', panelLabel:'Workflows',  panelColor:PALETTE.ENTRY, ax:4,ay:4, spring:0.06 },
};

// Derive physics bounds from the table — changing a cy automatically updates gravity and clamps.
function groupBounds(type, ax, ay) {
  const nodes = Object.values(HOME_NODES).filter(n => n.type === type);
  const cxs = nodes.map(n => n.cx), cys = nodes.map(n => n.cy);
  return {
    xMax: Math.max(...cxs) + ax,
    yMin: Math.min(...cys) - ay,
    yMax: Math.max(...cys) + ay,
    midY: (Math.min(...cys) + Math.max(...cys)) / 2,
  };
}
const FLOW_BOUNDS   = groupBounds('flow',   FLOW_AX, FLOW_AY);
const VISUAL_BOUNDS = groupBounds('visual', VIS_AX,  VIS_AY);

function nodePosition(n, t) {
  const a = HOME_NODES[n.id];
  if (!a) return { x: 0, y: 0 };
  if (a.type === 'principle') {
    const breathe = 1 + BREATHE_AMP * Math.sin(t * BREATHE_FREQ);
    const [sx, sy] = a.corner;
    // Subtract dot radius (5) so the dot edge, not center, stays inside the box.
    // (1 + cos) / 2 is always 0..1 — drift is inward from corner, never outward
    return {
      x: sx * (CW * breathe - 5 - DRIFT_A * (1 + Math.cos(a.wx * t + a.px)) / 2),
      y: sy * (CH * breathe - 5 - DRIFT_A * (1 + Math.sin(a.wy * t + a.py)) / 2),
    };
  }
  const [defAx, defAy] = a.type === 'flow' ? [FLOW_AX, FLOW_AY] : [VIS_AX, VIS_AY];
  return {
    x: a.cx + (a.ax ?? defAx) * Math.cos(a.wx * t + a.px),
    y: a.cy + (a.ay ?? defAy) * Math.sin(a.wy * t + a.py),
  };
}

// ── idle panel ────────────────────────────────────────────────────────────────
function IdlePanel({ theme }) {
  return React.createElement('div', {
    className: 'corner-panel' + (theme === 'light' ? ' light' : ''),
  },
    React.createElement('h1', {
      style: { margin: '0 0 4px', padding: 0, fontSize: 20, fontWeight: 500, lineHeight: 1.2 },
    },
      'Gazelle ',
      React.createElement('span', { style: { color: PALETTE.ENTRY } }, 'Cloud'),
    ),
    React.createElement('p', {
      className: 'info-text',
      style: { margin: '0 0 4px', opacity: 0.7 },
    }, 'Azure landing zones at the speed of code'),
    React.createElement('hr', {
      style: { border: 'none', borderTop: '1px solid rgba(155,175,215,0.15)', margin: '12px 0' },
    }),
    React.createElement('p', { className: 'info-text', style: { margin: 0 } },
      React.createElement('span', { style: { color: PALETTE.ENTRY } }, '● '),
      'Platform rules',
    ),
    React.createElement('p', { className: 'info-text', style: { margin: 0 } },
      React.createElement('span', { style: { color: PALETTE.CONNECTOR } }, '● '),
      'From nothing to hello-world',
    ),
    React.createElement('p', { className: 'info-text', style: { margin: 0 } },
      React.createElement('span', { style: { color: PALETTE.LEAF } }, '● '),
      'Visualisations',
    ),
    React.createElement(OpenSourceNote),
  );
}

// ── shared JSON cache ─────────────────────────────────────────────────────────
const _jsonCache = {};
function fetchJson(url) {
  if (!_jsonCache[url]) {
    const entry = { data: null };
    entry.promise = fetch(url).then(r => r.json()).then(d => { entry.data = d; return d; });
    _jsonCache[url] = entry;
  }
  return _jsonCache[url];
}

// Stable hook — null url → returns null immediately, no fetch
function useJson(url) {
  const entry = url ? fetchJson(url) : null;
  const [data, setData] = React.useState(entry?.data ?? null);
  React.useEffect(() => { if (url && !data) entry.promise.then(setData); }, [url]);
  return data;
}

// ── unified node panel ────────────────────────────────────────────────────────
function NodePanel({ node }) {
  const desc     = HOME_NODES[node.id] ?? {};
  const kgUrl    = (node.type === 'principle' || desc.kgNode) ? '/knowledge-graph.json' : null;
  const kg       = useJson(kgUrl);
  const listData = useJson(desc.panelJson ?? null);

  const children = [];

  // Description (visual nodes only)
  if (node.description && desc.panelJson)
    children.push(React.createElement('p', { key: 'desc', className: 'info-text', style: { marginTop: 0 } }, node.description));

  // KG content (principle + mapped flow nodes)
  if (kgUrl && !kg)
    return React.createElement('p', { className: 'info-text', style: { opacity: 0.5 } }, 'Loading\u2026');

  if (kg) {
    const kgId   = node.type === 'principle' ? node.id : desc.kgNode;
    const kgNode = kg.nodes.find(n => n.id === kgId);
    if (!kgNode) return null;

    if (kgNode.intent) children.push(
      React.createElement('div', { key: 'il', className: 'info-label' }, 'Intent'),
      React.createElement('p',   { key: 'iv', className: 'info-text'  }, kgNode.intent),
    );

    if (kgNode.decision) children.push(
      React.createElement('p', { key: 'dv', className: 'info-text' }, kgNode.decision),
    );

    const isRelated = l => l.relationship === 'related';
    const links = [
      ...kg.links.filter(l => { const [s] = linkEnds(l); return s === kgId && isRelated(l); })
                 .map(l => { const [, t] = linkEnds(l); return { id: t, arrow: '\u2192' }; }),
      ...(node.type === 'flow'
        ? kg.links.filter(l => { const [, t] = linkEnds(l); return t === kgId && isRelated(l); })
                  .map(l => { const [s] = linkEnds(l); return { id: s, arrow: '\u2190' }; })
        : []),
    ];

    if (links.length > 0) children.push(
      React.createElement('div', { key: 'dl', className: 'info-label', style: { color: OUTBOUND_COLOR } }, 'Decisions made'),
      React.createElement('div', { key: 'dlist', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden', whiteSpace: 'normal' } },
        ...links.map(({ id, arrow }, i) => React.createElement('div', { key: i, style: { paddingBottom: 8, borderBottom: '1px solid rgba(155,175,215,0.1)' } },
          React.createElement('a', {
            href:  `/knowledge-graph/${id}/`,
            style: { color: OUTBOUND_COLOR, fontFamily: FONT_MONO, fontSize: 13 },
          }, arrow + ' ' + id.replaceAll('-', ' ')),
        )),
      ),
    );
  }

  // Visual list (knowledge-graph / operations / big-bang)
  if (desc.panelJson) {
    if (!listData) return React.createElement('p', { className: 'info-text', style: { opacity: 0.5 } }, 'Loading\u2026');
    const items = listData.nodes.filter(n => n.type === desc.panelType);
    children.push(
      React.createElement('div', { key: 'pl', className: 'info-label', style: { color: desc.panelColor } }, desc.panelLabel),
      React.createElement('div', { key: 'plist', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden', whiteSpace: 'normal' } },
        ...items.map((n, i) => React.createElement('div', { key: i, style: { paddingBottom: 8, borderBottom: '1px solid rgba(155,175,215,0.1)' } },
          React.createElement('a', {
            href:  desc.href + n.id + '/',
            style: { color: desc.panelColor, fontFamily: FONT_MONO, fontSize: 13 },
          }, n.label ?? n.id.replaceAll('-', ' ')),
        )),
      ),
    );
  }

  return React.createElement(React.Fragment, null, ...children);
}

function panel(node) {
  if (node.type === 'request') return null;
  return React.createElement(NodePanel, { node });
}

// ── debug ─────────────────────────────────────────────────────────────────────
const DEBUG    = false;  // set true to show debug overlays
let _liveNodes = null;
let _repulse   = 1;

// ── page config ───────────────────────────────────────────────────────────────
mount({
  activeHref: '/',
  localJson:  '/home.json',

  types: {
    principle: { palette: 'ENTRY',     label: 'platform rules' },
    flow:      { palette: 'CONNECTOR', label: 'from nothing to hello-world' },
    visual:    { palette: 'LEAF',      label: 'visualisations'    },
  },

  dotRadius: () => 7,
  labelFontSize: () => 14,

  forces(fg, nodes) {
    _liveNodes = nodes;
    fg.d3Force('link',   null);
    fg.d3Force('charge', null);
    fg.d3Force('center', null);
    fg.d3Force('home-animate', (alpha) => {
      const t = performance.now() * 0.001;
      const breathe   = 1 + BREATHE_AMP * Math.sin(t * BREATHE_FREQ);
      // breatheIn: -1 (fully breathed-out) … +1 (fully breathed-in) — continuous, never clipped
      const breatheIn = (1 - breathe) / BREATHE_AMP;
      const repulse   = Math.max(0.2, 1 + breatheIn * 2);
      _repulse = repulse;
      // Center gravity: always present, scales smoothly across the full breathe cycle.
      // 0.02 at breathe-out → 0.05 at neutral → 0.08 at breathe-in
      const pull = 0.05 + breatheIn * 0.03;
      nodes.forEach(n => {
        const p = nodePosition(n, t);

        if (n.type === 'principle') {
          // Yellows are hard-pinned to their breathing paths — immune to each other
          n.x = p.x; n.y = p.y;
          n.vx = 0;  n.vy = 0;
        } else {
          // Friction — damps velocity each tick for organic deceleration
          n.vx *= 0.85;
          n.vy *= 0.85;
          // Spring toward natural animated position (per-node spring, default 0.12)
          const spring = HOME_NODES[n.id]?.spring ?? 0.12;
          n.vx += (p.x - n.x) * spring;
          n.vy += (p.y - n.y) * spring;

          // Gravity toward own box midpoint — identical pull strength for both types
          // so greens and blues react equally to the breathe cycle.
          const b    = n.type === 'flow' ? FLOW_BOUNDS : VISUAL_BOUNDS;
          const midY = b.midY;
          n.vx -= n.x          * pull;
          n.vy -= (n.y - midY) * pull;

          // Hard clamp — gravity now pulls away from both walls (toward box midpoint),
          // so a hard stop is stable: forces immediately carry the node back inward.
          const { xMax, yMin, yMax } = b;
          if (n.x < -xMax) { n.x = -xMax; if (n.vx < 0) n.vx = 0; }
          if (n.x >  xMax) { n.x =  xMax; if (n.vx > 0) n.vx = 0; }
          if (n.y <  yMin) { n.y =  yMin; if (n.vy < 0) n.vy = 0; }
          if (n.y >  yMax) { n.y =  yMax; if (n.vy > 0) n.vy = 0; }
        }
      });
      // Pairwise soft repulsion — pushes non-principle dots apart when closer than REPULSE_DIST
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 'principle') continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[j].type === 'principle') continue;
          const a = nodes[i], b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d  = Math.sqrt(dx * dx + dy * dy) || 0.01;
          if (d < REPULSE_DIST) {
            const push = (REPULSE_DIST - d) / REPULSE_DIST * 0.4;
            a.vx -= dx / d * push;
            a.vy -= dy / d * push;
            b.vx += dx / d * push;
            b.vy += dy / d * push;
          }
        }
      }
      if (alpha < 0.05) fg.d3ReheatSimulation();
    });
  },

  // Labels always visible — this is a landing page
  showLabel: () => true,

  labelPosition(node, r, gap) {
    if (node.type === 'principle') {
      const inward = Math.cos(Math.atan2(node.y, node.x)) >= 0 ? -1 : 1;
      return {
        lx:    node.x + inward * gap,
        ly:    node.y,
        align: inward > 0 ? 'left' : 'right',
      };
    }
    return { lx: node.x + gap, ly: node.y, align: 'left' };
  },

  nodeLabel: node => node.label ?? node.id.replaceAll('-', ' '),

  panelLabel(node) {
    const desc = HOME_NODES[node.id];
    return desc?.kgNode?.replaceAll('-', ' ') ?? node.label ?? node.id.replaceAll('-', ' ');
  },

  nodeHref(node) {
    const desc = HOME_NODES[node.id];
    if (node.type === 'principle') return `/knowledge-graph/${node.id}/`;
    if (desc?.kgNode)              return `/knowledge-graph/${desc.kgNode}/`;
    return desc?.href ?? null;
  },

  linkColor(l, { activeId, theme }) {
    const src   = l.source;
    const faded = theme === 'dark' ? 'rgba(155,175,215,0.04)' : 'rgba(26,27,38,0.04)';
    if (activeId) {
      const [s, t] = linkEnds(l);
      return (s === activeId || t === activeId) ? 'rgba(235,242,255,0.85)' : faded;
    }
    if (src?.type === 'principle') return 'rgba(240,165,0,0.20)';
    if (src?.type === 'flow')      return 'rgba(61,186,127,0.28)';
    return 'rgba(78,142,247,0.20)';
  },

  cooldownTime: Infinity,

  onRenderFramePost(ctx) {
    if (!DEBUG) return;
    ctx.save();
    ctx.lineWidth = 0.4;
    ctx.setLineDash([1.5, 1.5]);

    // Yellow: principle absolute max reach
    const RW = CW * (1 + BREATHE_AMP);
    const RH = CH * (1 + BREATHE_AMP);
    ctx.strokeStyle = 'rgba(240,165,0,0.6)';
    ctx.strokeRect(-RW, -RH, RW * 2, RH * 2);

    // Green: flow max reach (derived from FLOW_BOUNDS)
    ctx.strokeStyle = 'rgba(61,186,127,0.6)';
    ctx.strokeRect(-FLOW_BOUNDS.xMax, FLOW_BOUNDS.yMin, FLOW_BOUNDS.xMax * 2, FLOW_BOUNDS.yMax - FLOW_BOUNDS.yMin);

    // Blue: visual max reach (derived from VISUAL_BOUNDS)
    ctx.strokeStyle = 'rgba(78,142,247,0.6)';
    ctx.strokeRect(-VISUAL_BOUNDS.xMax, VISUAL_BOUNDS.yMin, VISUAL_BOUNDS.xMax * 2, VISUAL_BOUNDS.yMax - VISUAL_BOUNDS.yMin);

    // Force lines: each yellow → each inner node, opacity pulses with breathe-in
    if (_liveNodes) {
      const principles = _liveNodes.filter(n => n.type === 'principle');
      const inners     = _liveNodes.filter(n => n.type !== 'principle');
      // opacity: 0.08 at rest/breathe-out, peaks at 0.55 when fully breathed in
      const lineAlpha  = 0.08 + Math.max(0, (_repulse - 0.2) / 2.8) * 0.47;
      ctx.lineWidth    = 0.3;
      ctx.setLineDash([0.8, 2]);
      principles.forEach(pn => {
        inners.forEach(n => {
          ctx.strokeStyle = `rgba(240,165,0,${lineAlpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.moveTo(pn.x, pn.y);
          ctx.lineTo(n.x,  n.y);
          ctx.stroke();
        });
      });
    }

    ctx.restore();
  },

  idlePanel: IdlePanel,
  panel,
});
