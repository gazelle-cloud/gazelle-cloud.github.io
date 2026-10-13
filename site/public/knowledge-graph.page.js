import { mount } from '/engine.js';
import { forceCollide } from 'https://esm.sh/d3-force';
import { PALETTE, RENDER, FONT_MONO, linkEnds, OpenSourceNote } from '/shell.js';
import React from 'react';

// ── live data from GitHub ─────────────────────────────────────────────────────
const GH_BASE = 'https://api.github.com/repos/gazelle-cloud/Azure-landing-zones/contents/constitution';

async function ghFetch(sub) {
  const listing = await fetch(`${GH_BASE}/${sub}`).then(r => r.json());
  return Promise.all(
    listing.filter(f => f.type === 'file' && f.name.endsWith('.json'))
           .map(f => fetch(f.download_url).then(r => r.json()))
  );
}

async function getData() {
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

  // Only link ids that actually resolve to a node — a dangling id kills the sim.
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

  const raw = { nodes, links };
  sessionStorage.setItem(KEY, JSON.stringify(raw));
  return raw;
}

// ── idle panel ────────────────────────────────────────────────────────────────
function IdlePanel({ theme }) {
  return React.createElement('div', {
    className: 'corner-panel' + (theme === 'light' ? ' light' : ''),
  },
    React.createElement('h1', { style: { margin: '0 0 12px', padding: 0, fontSize: 16, fontWeight: 400, lineHeight: 1.3 } },
      'Knowledge Graph'),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        "Captures the reasoning behind every platform decision."),
      React.createElement('hr', { style: { border: 'none', borderTop: '1px solid rgba(155,175,215,0.15)', margin: '4px 0' } }),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.ENTRY } }, 'Yellow'), ' = foundations'),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.CONNECTOR } }, 'Green'), ' = constitutive rules'),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.LEAF } }, 'Blue'), ' = regulative rules'),
    ),
    React.createElement(OpenSourceNote),
  );
}

// ── panel ─────────────────────────────────────────────────────────────────────
const OUTBOUND_COLOR = '#fb923c';
const INBOUND_COLOR  = '#7dd3fc';

function panel(node, graph, { setFocusedId, theme }) {
  const outLinks = graph.links.filter(l => linkEnds(l)[0] === node.id);
  const inLinks  = graph.links.filter(l => linkEnds(l)[1] === node.id);

  const children = [];

  if (node.intent) children.push(
    React.createElement('div', { key: 'il', className: 'info-label' }, 'Intent'),
    React.createElement('p',   { key: 'iv', className: 'info-text' }, node.intent),
  );

  if (node.rule) children.push(
    React.createElement('p', { key: 'rv', className: 'info-text' }, node.rule),
  );

  if (node.decision) children.push(
    React.createElement('p', { key: 'dv', className: 'info-text' }, node.decision),
  );

  if (node.why) children.push(
    React.createElement('div', { key: 'wl', className: 'info-label' }, 'Why'),
    React.createElement('p',   { key: 'wv', className: 'info-text' }, node.why),
  );

  if (node.violations?.length) children.push(
    React.createElement('div', { key: 'vl', className: 'info-label' }, 'Violations'),
    React.createElement('div', { key: 'vv', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 6, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...node.violations.map((v, i) =>
        React.createElement('div', { key: i, style: { color: '#94a3b8', fontFamily: FONT_MONO, fontSize: 12 } }, v)),
    ),
  );

  const nodeById = Object.fromEntries(graph.nodes.map(n => [n.id, n]));

  function LinkedNode({ id, relation, note, arrow, color }) {
    const linked = nodeById[id];
    const isYellowInvolved = node.type === 'foundation' || linked?.type === 'foundation';
    const summary = linked?.decision || linked?.rule || linked?.intent;
    const meta = { color: '#94a3b8', fontFamily: FONT_MONO, fontSize: 12 };
    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 8, borderBottom: '1px solid rgba(155,175,215,0.1)' } },
      React.createElement('a', {
        href: `/knowledge-graph/${id}/`,
        style: { color, fontFamily: FONT_MONO, fontSize: 13, textDecoration: 'none' },
      }, arrow + ' ' + id.replaceAll('-', ' ')),
      relation && React.createElement('div', { style: { ...meta, opacity: 0.75 } }, relation.replaceAll('-', ' ')),
      note && React.createElement('div', { style: meta }, note),
      isYellowInvolved && summary && React.createElement('div', { style: meta }, summary),
    );
  }

  if (outLinks.length > 0) children.push(
    React.createElement('div', { key: 'ol', className: 'info-label', style: { color: OUTBOUND_COLOR } }, 'Outbound Links →'),
    React.createElement('div', { key: 'ov', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...outLinks.map((l, i) => {
        const [, targetId] = linkEnds(l);
        return React.createElement(LinkedNode, { key: i, id: targetId, relation: l.relationship, note: l.note, arrow: '→', color: OUTBOUND_COLOR });
      }),
    ),
  );

  if (inLinks.length > 0) children.push(
    React.createElement('div', { key: 'inl', className: 'info-label', style: { color: INBOUND_COLOR } }, 'Inbound Links ←'),
    React.createElement('div', { key: 'inv', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...inLinks.map((l, i) => {
        const [sourceId] = linkEnds(l);
        return React.createElement(LinkedNode, { key: i, id: sourceId, relation: l.relationship, note: l.note, arrow: '←', color: INBOUND_COLOR });
      }),
    ),
  );

  return React.createElement(React.Fragment, null, ...children);
}

// ── box constraint ────────────────────────────────────────────────────────────
const BOX_W = 250, BOX_H = 170;

// Hard-wall force: clamps every unpinned node inside the foundations rectangle
function forceWalls(W, H) {
  let nodes;
  function force() {
    for (const n of nodes) {
      if (n.fx != null) continue;                          // skip pinned foundation nodes
      const r = 2 + (n.__weight ?? 0) * 7 + 12;           // node radius + gap
      const mx = W / 2 - r, my = H / 2 - r;
      if (n.x >  mx) { n.x =  mx; if (n.vx > 0) n.vx = 0; }
      if (n.x < -mx) { n.x = -mx; if (n.vx < 0) n.vx = 0; }
      if (n.y >  my) { n.y =  my; if (n.vy > 0) n.vy = 0; }
      if (n.y < -my) { n.y = -my; if (n.vy < 0) n.vy = 0; }
    }
  }
  force.initialize = ns => { nodes = ns; };
  return force;
}

// ── page config ───────────────────────────────────────────────────────────────
mount({
  activeHref: '/knowledge-graph/',

  getData,

  types: {
    'foundation':   { palette: 'ENTRY',     label: 'foundation'        },
    'constitutive': { palette: 'CONNECTOR', label: 'constitutive rule' },
    'regulative':   { palette: 'LEAF',      label: 'regulative rule'   },
  },

  // Green and blue share one sizing rule; foundations are fixed.
  dotRadius: node => node.type === 'foundation' ? 5 : 2 + node.__weight * 7,

  prepare(raw) {
    // Pin foundation nodes evenly along the rectangle perimeter
    const foundations = raw.nodes.filter(n => n.type === 'foundation');
    const W = BOX_W, H = BOX_H;
    const perimeter = 2 * (W + H);
    foundations.forEach((n, i) => {
      const d = (i / foundations.length) * perimeter;
      if (d < W)            { n.fx = -W / 2 + d;        n.fy = -H / 2; }
      else if (d < W + H)   { n.fx =  W / 2;            n.fy = -H / 2 + (d - W); }
      else if (d < 2*W + H) { n.fx =  W / 2 - (d-W-H); n.fy =  H / 2; }
      else                  { n.fx = -W / 2;            n.fy =  H / 2 - (d - 2*W - H); }
    });
  },

  forces(fg) {
    fg.d3Force('link').distance(65).strength(0.25);
    fg.d3Force('collision', forceCollide(n => (n.type === 'foundation' ? 5 : 2 + n.__weight * 7) + 14));
    fg.d3Force('charge').strength(n => n.type === 'foundation' ? 0 : -55);
    fg.d3Force('walls', forceWalls(BOX_W, BOX_H));  // hard wall — no escapes
  },

  warmupTicks: 400,
  cooldownTime: 0,

  showLabel(node, { activeId, isNeighbour, isMatch }) {
    return node.type === 'foundation' || node.id === activeId || isNeighbour || isMatch;
  },

  labelPosition(node, r, gap) {
    if (node.type === 'foundation') {
      const angle = Math.atan2(node.y, node.x);
      return {
        lx: node.x + Math.cos(angle) * gap,
        ly: node.y + Math.sin(angle) * gap,
        align: Math.cos(angle) >= 0 ? 'left' : 'right',
      };
    }
    return { lx: node.x + gap, ly: node.y, align: 'left' };
  },

  labelFontSize(node) {
    return node.type === 'foundation' ? RENDER.labelFontSize + 1 : RENDER.labelFontSize;
  },

  linkColor(l, { activeId, theme }) {
    const dim    = theme === 'dark' ? 'rgba(180,195,225,0.28)' : 'rgba(80,80,100,0.15)';
    const faded  = theme === 'dark' ? 'rgba(180,180,180,0.04)' : 'rgba(80,80,100,0.04)';
    if (!activeId) return dim;
    const [s, t] = linkEnds(l);
    if (s === activeId) return OUTBOUND_COLOR;
    if (t === activeId) return INBOUND_COLOR;
    return faded;
  },

  nameplateLabel: node => node.decision ?? node.rule ?? node.intent ?? node.id.replaceAll('-', ' '),

  idlePanel: IdlePanel,
  panel,
});
