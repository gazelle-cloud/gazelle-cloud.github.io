import { mount } from '/engine.js';
import { PALETTE, FONT_MONO, OpenSourceNote, linkEnds } from '/shell.js';
import React from 'react';

// ── animation data ────────────────────────────────────────────────────────────
// One shared canvas: yellow corners define the boundary, green+blue live inside.

// Virtual box half-dimensions — just outside the interior cluster
const CW = 52, CH = 40;

// Principle dots — 4 corners of the virtual box, breathing in/out together
const PRINCIPLE_ANIM = {
  'no-human-touch':          { corner: [-1,-1], wx: 0.11, wy: 0.18, px: 0.00, py: 0.00 },
  'no-fixed-cost':           { corner: [ 1,-1], wx: 0.15, wy: 0.10, px: 2.09, py: 1.05 },
  'no-platform-ops':         { corner: [-1, 1], wx: 0.13, wy: 0.21, px: 4.19, py: 2.09 },
  'no-unapproved-resources': { corner: [ 1, 1], wx: 0.10, wy: 0.14, px: 1.05, py: 3.14 },
};
const BREATHE_AMP  = 0.08;
const BREATHE_FREQ = 0.12;
const DRIFT_A = 6;           // wander within the corner zone, stay inside the box

// Flow dots — Lissajous, upper interior (original frequencies kept)
const FLOW_ANIM = {
  join:    { cx: -28, cy: -12, wx: 0.19, wy: 0.33, px: 0.00, py: 0.00, ax: 4, ay: 4 },
  request: { cx:   0, cy:  -8, wx: 0.27, wy: 0.18, px: 2.09, py: 1.05 },
  deploy:  { cx:  28, cy: -12, wx: 0.23, wy: 0.38, px: 4.19, py: 2.09 },
};
const FLOW_AX = 14, FLOW_AY = 10;

// Visual dots — gentle drift, lower interior
const VISUAL_ANIM = {
  'knowledge-graph': { cx: -30, cy: 16, wx: 0.07, wy: 0.05, px: 0.00, py: 1.20 },
  'operations':      { cx:   0, cy: 22, wx: 0.05, wy: 0.08, px: 2.00, py: 0.60 },
  'big-bang':        { cx:  30, cy: 16, wx: 0.09, wy: 0.06, px: 1.00, py: 2.40, ax: 4, ay: 4 },
};
const VIS_AX = 10, VIS_AY = 8;

function nodePosition(n, t) {
  if (n.type === 'principle') {
    const a = PRINCIPLE_ANIM[n.id];
    if (!a) return { x: 0, y: 0 };
    const breathe = 1 + BREATHE_AMP * Math.sin(t * BREATHE_FREQ);
    const [sx, sy] = a.corner;
    // Subtract dot radius (5) so the dot edge, not center, stays inside the red box.
    // (1 + cos) / 2 is always 0..1 — drift is inward from corner, never outward
    return {
      x: sx * (CW * breathe - 5 - DRIFT_A * (1 + Math.cos(a.wx * t + a.px)) / 2),
      y: sy * (CH * breathe - 5 - DRIFT_A * (1 + Math.sin(a.wy * t + a.py)) / 2),
    };
  }
  if (n.type === 'flow') {
    const a = FLOW_ANIM[n.id];
    if (!a) return { x: 0, y: 0 };
    return {
      x: a.cx + (a.ax ?? FLOW_AX) * Math.cos(a.wx * t + a.px),
      y: a.cy + (a.ay ?? FLOW_AY) * Math.sin(a.wy * t + a.py),
    };
  }
  if (n.type === 'visual') {
    const a = VISUAL_ANIM[n.id];
    if (!a) return { x: 0, y: 0 };
    return {
      x: a.cx + (a.ax ?? VIS_AX) * Math.cos(a.wx * t + a.px),
      y: a.cy + (a.ay ?? VIS_AY) * Math.sin(a.wy * t + a.py),
    };
  }
  return { x: 0, y: 0 };
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
      'Design principles',
    ),
    React.createElement('p', { className: 'info-text', style: { margin: 0 } },
      React.createElement('span', { style: { color: PALETTE.CONNECTOR } }, '● '),
      'The flow',
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

const OUTBOUND_COLOR = '#fb923c';

function PrinciplePanel({ node }) {
  const entry       = fetchJson('/knowledge-graph.json');
  const [kg, setKg] = React.useState(entry.data);
  React.useEffect(() => { if (!kg) entry.promise.then(setKg); }, []);
  if (!kg) return React.createElement('p', { className: 'info-text', style: { opacity: 0.5 } }, 'Loading…');

  const kgNode = kg.nodes.find(n => n.id === node.id);
  if (!kgNode) return null;

  const outLinks = kg.links.filter(l => { const [s] = linkEnds(l); return s === node.id && l.relationship === 'related'; });

  function LinkedNode({ id, arrow, color }) {
    return React.createElement('div', { style: { paddingBottom: 8, borderBottom: '1px solid rgba(155,175,215,0.1)' } },
      React.createElement('a', {
        href:  `/knowledge-graph/${id}/`,
        style: { color, fontFamily: FONT_MONO, fontSize: 13 },
      }, arrow + ' ' + id.replaceAll('-', ' ')),
    );
  }

  const children = [];

  if (kgNode.intent) children.push(
    React.createElement('div', { key: 'il', className: 'info-label' }, 'Intent'),
    React.createElement('p',   { key: 'iv', className: 'info-text'  }, kgNode.intent),
  );

  if (outLinks.length > 0) children.push(
    React.createElement('div', { key: 'ol', className: 'info-label', style: { color: OUTBOUND_COLOR } }, 'Decisions made'),
    React.createElement('div', { key: 'ov', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...outLinks.map((l, i) => { const [, t] = linkEnds(l); return React.createElement(LinkedNode, { key: i, id: t, arrow: '→', color: OUTBOUND_COLOR }); }),
    ),
  );

  return React.createElement(React.Fragment, null, ...children);
}

// ── VisualPanel (blue dots) ───────────────────────────────────────────────────
const VISUAL_SOURCES = {
  'knowledge-graph': { url: '/knowledge-graph.json', type: 'decision',        label: 'Decisions',  color: PALETTE.LEAF,  base: '/knowledge-graph/' },
  'operations':      { url: '/operations.json',      type: 'operation',       label: 'Operations', color: PALETTE.ENTRY, base: '/operations/'      },
  'big-bang':        { url: '/bigbang.json',          type: 'github-workflow', label: 'Workflows',  color: PALETTE.ENTRY, base: '/bigbang/'         },
};

function VisualPanel({ node }) {
  const src         = VISUAL_SOURCES[node.id];
  const entry       = src ? fetchJson(src.url) : null;
  const [data, setData] = React.useState(entry?.data ?? null);
  React.useEffect(() => { if (src && !data) entry.promise.then(setData); }, []);
  if (!src || !data) return React.createElement('p', { className: 'info-text', style: { opacity: 0.5 } }, src ? 'Loading…' : null);

  const items = data.nodes.filter(n => n.type === src.type);

  return React.createElement(React.Fragment, null,
    node.description && React.createElement('p', { className: 'info-text', style: { marginTop: 0 } }, node.description),
    React.createElement('div', { className: 'info-label', style: { color: src.color } }, src.label),
    React.createElement('div', { className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...items.map((n, i) => React.createElement('div', { key: i, style: { paddingBottom: 8, borderBottom: '1px solid rgba(155,175,215,0.1)' } },
        React.createElement('a', {
          href:  src.base + n.id + '/',
          style: { color: src.color, fontFamily: FONT_MONO, fontSize: 13 },
        }, n.label ?? n.id.replaceAll('-', ' ')),
      )),
    ),
  );
}

// ── FlowPanel (green dots with KG mapping) ────────────────────────────────────
const FLOW_KG_MAP = {
  'join':   'landing-zone-join-the-platform',
  'deploy': 'landing-zone-getting-started',
};

function FlowPanel({ node }) {
  const kgNodeId    = FLOW_KG_MAP[node.id];
  const entry       = fetchJson('/knowledge-graph.json');
  const [kg, setKg] = React.useState(entry.data);
  React.useEffect(() => { if (!kg) entry.promise.then(setKg); }, []);
  if (!kg) return React.createElement('p', { className: 'info-text', style: { opacity: 0.5 } }, 'Loading…');

  const kgNode   = kg.nodes.find(n => n.id === kgNodeId);
  if (!kgNode) return null;

  const related = l => l.relationship === 'related';
  const outLinks = kg.links.filter(l => { const [s]    = linkEnds(l); return s === kgNodeId && related(l); });
  const inLinks  = kg.links.filter(l => { const [, t]  = linkEnds(l); return t === kgNodeId && related(l); });
  const children = [];

  if (kgNode.intent) children.push(
    React.createElement('div', { key: 'il', className: 'info-label' }, 'Intent'),
    React.createElement('p',   { key: 'iv', className: 'info-text'  }, kgNode.intent),
  );

  if (kgNode.decision) children.push(
    React.createElement('p', { key: 'dv', className: 'info-text' }, kgNode.decision),
  );

  const allDecisions = [
    ...outLinks.map(l => { const [, t] = linkEnds(l); return { id: t, arrow: '→' }; }),
    ...inLinks.map( l => { const [s]   = linkEnds(l); return { id: s, arrow: '←' }; }),
  ];

  if (allDecisions.length > 0) children.push(
    React.createElement('div', { key: 'dl', className: 'info-label', style: { color: OUTBOUND_COLOR } }, 'Decisions made'),
    React.createElement('div', { key: 'dv', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...allDecisions.map(({ id, arrow }, i) => React.createElement('div', { key: i, style: { paddingBottom: 8, borderBottom: '1px solid rgba(155,175,215,0.1)' } },
        React.createElement('a', {
          href:  `/knowledge-graph/${id}/`,
          style: { color: OUTBOUND_COLOR, fontFamily: FONT_MONO, fontSize: 13 },
        }, arrow + ' ' + id.replaceAll('-', ' ')),
      )),
    ),
  );

  return React.createElement(React.Fragment, null, ...children);
}

// ── node panel ────────────────────────────────────────────────────────────────
function panel(node, graph, { typeColors }) {
  if (node.type === 'principle') return React.createElement(PrinciplePanel, { node });
  if (node.type === 'flow' && FLOW_KG_MAP[node.id]) return React.createElement(FlowPanel, { node });
  if (node.type === 'visual')   return React.createElement(VisualPanel,    { node });

  const color    = typeColors?.[node.type] ?? PALETTE.ENTRY;
  const children = [];

  if (node.description) children.push(
    React.createElement('div', { key: 'dl', className: 'info-label' }, 'About'),
    React.createElement('p',   { key: 'dv', className: 'info-text'  }, node.description),
  );

  if (node.href) children.push(
    React.createElement('a', {
      key:   'lnk',
      href:  node.href,
      style: { display: 'inline-block', marginTop: 8, color, textDecoration: 'none', fontSize: 13 },
    }, 'Open →'),
  );

  return React.createElement(React.Fragment, null, ...children);
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
    principle: { palette: 'ENTRY',     label: 'design principles' },
    flow:      { palette: 'CONNECTOR', label: 'the flow'          },
    visual:    { palette: 'LEAF',      label: 'visualisations'    },
  },

  dotRadius: () => 5,

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
      // Midpoint of each group's box — gravity pulls toward this, not world origin.
      // Greens: y in [-22, 2] → mid -10.  Blues: y in [8, 30] → mid 19.
      const flowMidY   = (-(12 + FLOW_AY) + (-8 + FLOW_AY)) / 2;   // -10
      const visualMidY = ((16 - VIS_AY)   + (22 + VIS_AY))  / 2;   // 19
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
          // Spring toward natural animated position (anchors use weaker spring)
          const spring = (n.id === 'join' || n.id === 'big-bang') ? 0.06 : 0.12;
          n.vx += (p.x - n.x) * spring;
          n.vy += (p.y - n.y) * spring;

          // Gravity toward own box midpoint — identical pull strength for both types
          // so greens and blues react equally to the breathe cycle.
          const midY = n.type === 'flow' ? flowMidY : visualMidY;
          n.vx -= n.x       * pull;
          n.vy -= (n.y - midY) * pull;

          // Hard clamp — gravity now pulls away from both walls (toward box midpoint),
          // so a hard stop is stable: forces immediately carry the node back inward.
          if (n.type === 'flow') {
            const xMax = 28 + FLOW_AX, yMin = -(12 + FLOW_AY), yMax = -8 + FLOW_AY;
            if (n.x < -xMax) { n.x = -xMax; if (n.vx < 0) n.vx = 0; }
            if (n.x >  xMax) { n.x =  xMax; if (n.vx > 0) n.vx = 0; }
            if (n.y <  yMin) { n.y =  yMin; if (n.vy < 0) n.vy = 0; }
            if (n.y >  yMax) { n.y =  yMax; if (n.vy > 0) n.vy = 0; }
          } else if (n.type === 'visual') {
            const xMax = 30 + VIS_AX, yMin = 16 - VIS_AY, yMax = 22 + VIS_AY;
            if (n.x < -xMax) { n.x = -xMax; if (n.vx < 0) n.vx = 0; }
            if (n.x >  xMax) { n.x =  xMax; if (n.vx > 0) n.vx = 0; }
            if (n.y <  yMin) { n.y =  yMin; if (n.vy < 0) n.vy = 0; }
            if (n.y >  yMax) { n.y =  yMax; if (n.vy > 0) n.vy = 0; }
          }
        }
      });
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
    if (node.type === 'flow' && FLOW_KG_MAP[node.id]) return FLOW_KG_MAP[node.id].replaceAll('-', ' ');
    return node.label ?? node.id.replaceAll('-', ' ');
  },

  nodeHref(node) {
    if (node.type === 'principle') return `/knowledge-graph/${node.id}/`;
    if (node.type === 'visual')   return node.href ?? null;
    if (node.type === 'flow')     return FLOW_KG_MAP[node.id] ? `/knowledge-graph/${FLOW_KG_MAP[node.id]}/` : null;
    return null;
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

    // Green: flow max reach → x: -42..+42, y: -22..+2
    ctx.strokeStyle = 'rgba(61,186,127,0.6)';
    ctx.strokeRect(-(28 + FLOW_AX), -(12 + FLOW_AY), (28 + FLOW_AX) * 2, (12 + FLOW_AY) + (-8 + FLOW_AY));

    // Blue: visual max reach → x: -36..+36, y: 17..33
    ctx.strokeStyle = 'rgba(78,142,247,0.6)';
    ctx.strokeRect(-(30 + VIS_AX), 22 - VIS_AY, (30 + VIS_AX) * 2, 6 + VIS_AY * 2);

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
