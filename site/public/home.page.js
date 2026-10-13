import { mount } from '/engine.js';
import { PALETTE, FONT_MONO, OpenSourceNote, DetailHeader, linkEnds } from '/shell.js';
import React from 'react';

// ── animation data ─────────────────────────────────────────────────────────────
// One shared canvas: yellow corners define the boundary, green+blue live inside.
const CW = 52, CH = 40;
const BREATHE_AMP  = 0.08;
const BREATHE_FREQ = 0.12;
const DRIFT_A = 6;          // wander within the corner zone, stay inside the box
const FLOW_AX = 14, FLOW_AY = 10;
const VIS_AX  = 10, VIS_AY  = 8;
const REPULSE_DIST = 20;   // min centre-to-centre distance between non-foundation dots
const OUTBOUND_COLOR = '#fb923c';

// Single descriptor table — every per-node property lives here.
const HOME_NODES = {
  // ── Foundations (yellow, corners) ───────────────────────────────────────────
  'no-human-touch':          { type:'foundation', corner:[-1,-1], wx:0.11,wy:0.18,px:0.00,py:0.00 },
  'no-fixed-cost':           { type:'foundation', corner:[ 1,-1], wx:0.15,wy:0.10,px:2.09,py:1.05 },
  'no-platform-ops':         { type:'foundation', corner:[-1, 1], wx:0.13,wy:0.21,px:4.19,py:2.09 },
  'no-unapproved-resources': { type:'foundation', corner:[ 1, 1], wx:0.10,wy:0.14,px:1.05,py:3.14 },

  // ── Flow (green) ─────────────────────────────────────────────────────────────
  join:    { type:'flow', cx:-28, cy:-12, wx:0.19,wy:0.33,px:0.00,py:0.00, ax:4,ay:4, spring:0.06, kgNode:'register-platform-member' },
  request: { type:'flow', cx:  0, cy: -8, wx:0.27,wy:0.18,px:2.09,py:1.05, kgNode:'create-landing-zone' },
  deploy:  { type:'flow', cx: 28, cy:-12, wx:0.23,wy:0.38,px:4.19,py:2.09,                         kgNode:'landing-zone-getting-started'    },

  // ── Visual (blue) ────────────────────────────────────────────────────────────
  'knowledge-graph': { type:'visual', cx:-30,cy:16, wx:0.14,wy:0.11,px:0.00,py:1.20, ax:18,ay:14, href:'/knowledge-graph/', panelJson:'/knowledge-graph.json', panelType:'regulative',      panelLabel:'Regulative rules', panelColor:PALETTE.LEAF  },
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
  if (a.type === 'foundation') {
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
const BLOCK_STYLE = { display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden', whiteSpace: 'normal' };
const ROW_STYLE   = { paddingBottom: 8, borderBottom: '1px solid rgba(155,175,215,0.1)' };

function linkRow(label, href, color, nodeId, setHoveredId) {
  const inner = href
    ? React.createElement('a', { href, style: { color, fontFamily: FONT_MONO, fontSize: 13 } }, '\u2192 ' + label)
    : React.createElement('span', { style: { color, fontFamily: FONT_MONO, fontSize: 13, opacity: 0.5 } }, '\u2192 ' + label);
  return React.createElement('div', {
    style: ROW_STYLE,
    onMouseEnter: () => setHoveredId(nodeId),
    onMouseLeave: () => setHoveredId(null),
  }, inner);
}

function IdlePanel({ theme, setHoveredId }) {
  const h = setHoveredId ?? (() => {});
  return React.createElement('div', {
    className: 'corner-panel' + (theme === 'light' ? ' light' : ''),
  },
    React.createElement(DetailHeader, { nodeId: 'Gazelle Cloud' }),
    React.createElement('p', {
      className: 'info-text',
      style: { margin: '0 0 4px' },
    }, 'A complete Azure landing zones implementation designed so the platform team isn\'t needed to operate them.'),

    React.createElement('div', { className: 'info-label', style: { color: PALETTE.ENTRY } }, 'Gazelle foundations'),
    React.createElement('div', { className: 'code-block', style: BLOCK_STYLE },
      linkRow('no human touch',          '/knowledge-graph/no-human-touch/',          PALETTE.ENTRY, 'no-human-touch',          h),
      linkRow('no fixed cost',           '/knowledge-graph/no-fixed-cost/',           PALETTE.ENTRY, 'no-fixed-cost',           h),
      linkRow('no platform ops',         '/knowledge-graph/no-platform-ops/',         PALETTE.ENTRY, 'no-platform-ops',         h),
      linkRow('no unapproved resources', '/knowledge-graph/no-unapproved-resources/', PALETTE.ENTRY, 'no-unapproved-resources', h),
    ),

    React.createElement('div', { className: 'info-label', style: { color: PALETTE.CONNECTOR } }, 'Getting Started'),
    React.createElement('div', { className: 'code-block', style: BLOCK_STYLE },
      linkRow('join the platform',  '/knowledge-graph/register-platform-member/',    PALETTE.CONNECTOR, 'join',    h),
      linkRow('own landing zones',  '/knowledge-graph/create-landing-zone/',         PALETTE.CONNECTOR, 'request', h),
      linkRow('deploy hello world', '/knowledge-graph/landing-zone-getting-started/', PALETTE.CONNECTOR, 'deploy',  h),
    ),

    React.createElement('div', { className: 'info-label', style: { color: PALETTE.LEAF } }, 'visuals'),
    React.createElement('div', { className: 'code-block', style: BLOCK_STYLE },
      linkRow('Knowledge Graph', '/knowledge-graph/', PALETTE.LEAF, 'knowledge-graph', h),
      linkRow('Big Bang',        '/bigbang/',         PALETTE.LEAF, 'big-bang',        h),
    ),

    React.createElement(OpenSourceNote),
  );
}

// ── shared JSON cache ─────────────────────────────────────────────────────────
// _fetchFns lets page-level code register custom fetchers for URLs that are no
// longer static files (knowledge-graph.json). Falls back to a plain fetch for
// everything else (bigbang.json, etc.).
const _jsonCache = {};
const _fetchFns  = {};

function fetchJson(url) {
  if (!_jsonCache[url]) {
    const entry = { data: null };
    const fn    = _fetchFns[url] ?? (() => fetch(url).then(r => r.json()));
    entry.promise = fn().then(d => { entry.data = d; return d; });
    _jsonCache[url] = entry;
  }
  return _jsonCache[url];
}

// ── GitHub fetch helpers ───────────────────────────────────────────────────────
const GH_BASE = 'https://api.github.com/repos/gazelle-cloud/Azure-landing-zones/contents/constitution';

async function ghFetch(sub) {
  const listing = await fetch(`${GH_BASE}/${sub}`).then(r => r.json());
  return Promise.all(
    listing.filter(f => f.type === 'file' && f.name.endsWith('.json'))
           .map(f => fetch(f.download_url).then(r => r.json()))
  );
}

// knowledge-graph.json — derive from raw GH entities, cache in sessionStorage.
// Same key and shape as knowledge-graph.page.js, so the two share one cache entry.
_fetchFns['/knowledge-graph.json'] = async () => {
  const KEY = 'kg-v3';
  const hit = sessionStorage.getItem(KEY);
  if (hit) return JSON.parse(hit);
  const [foundations, constitutive, regEntity, regProcess] = await Promise.all([
    ghFetch('foundations'),
    ghFetch('constitutive'),
    ghFetch('regulative-entity'),
    ghFetch('regulative-process'),
  ]);
  const nodes = [
    ...foundations.map(f => ({ ...f, type: 'foundation' })),
    ...constitutive.map(c => ({ ...c, type: 'constitutive' })),
    ...regEntity.map(r  => ({ ...r, type: 'regulative', subjectType: 'entity'  })),
    ...regProcess.map(r => ({ ...r, type: 'regulative', subjectType: 'process' })),
  ];
  const ids   = new Set(nodes.map(n => n.id));
  const links = [];
  const add = (source, target, relationship, note) => {
    if (source !== target && ids.has(source) && ids.has(target))
      links.push({ source, target, relationship, note });
  };
  nodes.forEach(n => {
    if (n.anchor) add(n.id, n.anchor, 'anchored-by');
    [].concat(n.implements ?? []).forEach(t => add(n.id, t, 'implements'));
    (n.links ?? []).forEach(l => add(n.id, l.target, l.relation ?? 'related', l.note));
  });
  const data = { nodes, links };
  sessionStorage.setItem(KEY, JSON.stringify(data));
  return data;
};

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
  const kgUrl    = (node.type === 'foundation' || desc.kgNode) ? '/knowledge-graph.json' : null;
  const kg       = useJson(kgUrl);
  const listData = useJson(desc.panelJson ?? null);

  const children = [];

  // Description (visual nodes only)
  if (node.description && desc.panelJson)
    children.push(React.createElement('p', { key: 'desc', className: 'info-text', style: { marginTop: 0 } }, node.description));

  // KG content (foundation + mapped flow nodes)
  if (kgUrl && !kg)
    return React.createElement('p', { className: 'info-text', style: { opacity: 0.5 } }, 'Loading\u2026');

  if (kg) {
    const kgId   = node.type === 'foundation' ? node.id : desc.kgNode;
    const kgNode = kg.nodes.find(n => n.id === kgId);
    if (!kgNode) return null;

    if (kgNode.intent) children.push(
      React.createElement('div', { key: 'il', className: 'info-label' }, 'Intent'),
      React.createElement('p',   { key: 'iv', className: 'info-text'  }, kgNode.intent),
    );

    if (kgNode.rule) children.push(
      React.createElement('p', { key: 'rv', className: 'info-text' }, kgNode.rule),
    );

    if (kgNode.decision) children.push(
      React.createElement('p', { key: 'dv', className: 'info-text' }, kgNode.decision),
    );

    // Foundations are pure targets in the new schema \u2014 rules anchor to them, so
    // list the inbound side. Flow nodes are rules themselves: show both directions.
    const isFoundation = node.type === 'foundation';
    const inbound = kg.links.filter(l => linkEnds(l)[1] === kgId)
                            .map(l => ({ id: linkEnds(l)[0], arrow: '\u2190' }));
    const links = isFoundation ? inbound : [
      ...kg.links.filter(l => linkEnds(l)[0] === kgId)
                 .map(l => ({ id: linkEnds(l)[1], arrow: '\u2192' })),
      ...inbound,
    ];

    if (links.length > 0) children.push(
      React.createElement('div', { key: 'dl', className: 'info-label', style: { color: OUTBOUND_COLOR } },
        isFoundation ? 'Rules anchored here' : 'Related rules'),
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

  // Visual list (knowledge-graph / big-bang)
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
    foundation: { palette: 'ENTRY',     label: 'gazelle foundations' },
    flow:      { palette: 'CONNECTOR', label: 'from nothing to hello-world' },
    visual:    { palette: 'LEAF',      label: 'visualisations'    },
  },

  maxCanvasWidth:  1080,
  maxCanvasHeight: 680,

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

        if (n.type === 'foundation') {
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
      // Pairwise soft repulsion — pushes non-foundation dots apart when closer than REPULSE_DIST
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 'foundation') continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[j].type === 'foundation') continue;
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
    if (node.type === 'foundation') {
      const inward = Math.cos(Math.atan2(node.y, node.x)) >= 0 ? -1 : 1;
      return {
        lx:    node.x + inward * gap,
        ly:    node.y,
        align: inward > 0 ? 'left' : 'right',
      };
    }
    return { lx: node.x + gap, ly: node.y, align: 'left' };
  },

  nodeLabel(node) {
    if (node.id === 'request') return 'Own';
    if (node.id === 'deploy')  return 'Hello World';
    return node.label ?? node.id.replaceAll('-', ' ');
  },

  panelLabel(node) {
    const desc = HOME_NODES[node.id];
    return desc?.kgNode?.replaceAll('-', ' ') ?? node.label ?? node.id.replaceAll('-', ' ');
  },

  nodeHref(node) {
    const desc = HOME_NODES[node.id];
    if (node.type === 'foundation') return `/knowledge-graph/${node.id}/`;
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
    if (src?.type === 'foundation') return 'rgba(240,165,0,0.20)';
    if (src?.type === 'flow')      return 'rgba(61,186,127,0.28)';
    return 'rgba(78,142,247,0.20)';
  },

  cooldownTime: Infinity,

  onRenderFramePost(ctx) {
    if (!DEBUG) return;
    ctx.save();
    ctx.lineWidth = 0.4;
    ctx.setLineDash([1.5, 1.5]);

    // Yellow: foundation absolute max reach
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
      const foundations = _liveNodes.filter(n => n.type === 'foundation');
      const inners      = _liveNodes.filter(n => n.type !== 'foundation');
      // opacity: 0.08 at rest/breathe-out, peaks at 0.55 when fully breathed in
      const lineAlpha  = 0.08 + Math.max(0, (_repulse - 0.2) / 2.8) * 0.47;
      ctx.lineWidth    = 0.3;
      ctx.setLineDash([0.8, 2]);
      foundations.forEach(pn => {
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
