import { mount } from '/engine.js';
import { PALETTE, RENDER, FONT_MONO, linkEnds, OpenSourceNote } from '/shell.js';
import React from 'react';

// ── layout: gazelle → topics → rules, outward ─────────────────────────────────
// Reads from the centre out. Green dots (topics) sit on an inner ring around
// gazelle; each island's blue dots (rules) fan outward, away from gazelle, in
// a slice sized by how many rules it has, reaching towards the canvas edge.
// Blue dots start from that fan with a fixed per-dot wobble (same every load),
// then settle under light forces: a pull towards their home spot, staying
// nearer their own green dot, clear of green labels, and a soft wall at the edge.
// All sizes are screen px; the wall keeps the map inside the canvas, so
// zoomToFit lands at ≥ 1× and px spacing holds on screen.
const EDGE_PX         = 44;    // canvas edge → nearest dot or label (≥ zoomToFit's 40)
const RING_SHAPE      = 2;     // 2 = ellipse; higher = squarer
const RING_FILL       = 0.55;  // green ring, as a share of the way to the canvas edge
const FAN_NEAR        = 0.5;   // nearest blue dot, as a share of the green → edge distance
const FAN_FAR         = 1.0;   // farthest blue dot, same measure
const FAN_REACH_PX    = 260;   // longest a spoke may get, however far the edge is
const FAN_STEP        = 0.12;  // fan width per rule, radians …
const FAN_MAX         = 1.6;   // … capped here
const WOBBLE          = 0.22;  // per-dot irregularity
const HOME_PULL       = 0.04;  // how firmly a blue dot keeps its fan shape
const BELONG_PX       = 30;    // a blue dot is at least this much nearer its own green

const label         = id => id.replaceAll('-', ' ');
const dotRadius     = n => n.type === 'root' ? 8 : n.type === 'constitutive' ? 5.5 : 3.5;
const labelFontSize = n => n.type === 'regulative' ? RENDER.labelFontSize : RENDER.labelFontSize + 1;

let canvasW = 1200, canvasH = 800;   // set in prepare()

// Label width in screen px, measured once with the font drawLabel uses.
function measureLabels(nodes) {
  const ctx = document.createElement('canvas').getContext('2d');
  for (const n of nodes) {
    ctx.font = `${labelFontSize(n)}px 'IBM Plex Sans', system-ui, sans-serif`;
    n.__labelW = ctx.measureText(label(n.id)).width;
  }
}

// Canvas size the engine will give ForceGraph (pane content box minus padding).
function canvasSize() {
  const pane = document.getElementById('viz-pane');
  if (!pane) return { W: window.innerWidth, H: window.innerHeight };
  const cs  = getComputedStyle(pane);
  const pad = parseFloat(cs.getPropertyValue('--viz-padding')) || 20;
  return {
    W: pane.clientWidth  - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)  - 2 * pad,
    H: pane.clientHeight - parseFloat(cs.paddingTop)  - parseFloat(cs.paddingBottom) - 2 * pad,
  };
}

// Stable pseudo-random in [-1, 1) from a string, so the wobble is the same every load.
function wobble(id, salt) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return ((h >>> 0) / 2 ** 32) * 2 - 1;
}

// Point on a superellipse |x/a|^p + |y/b|^p = 1 at parameter t. Even steps in
// t spread points along the ring's long sides, unlike even polar angles.
function ringPoint(t, a, b) {
  const c = Math.cos(t), s = Math.sin(t), e = 2 / RING_SHAPE;
  return [a * Math.sign(c) * Math.abs(c) ** e, b * Math.sign(s) * Math.abs(s) ** e];
}

// Distance from (x, y) along angle φ to the inner canvas edge (EDGE_PX in).
function toEdge(x, y, phi) {
  const xMax = canvasW / 2 - EDGE_PX, yMax = canvasH / 2 - EDGE_PX;
  const c = Math.cos(phi), s = Math.sin(phi);
  const tx = c > 1e-6 ? (xMax - x) / c : c < -1e-6 ? (-xMax - x) / c : Infinity;
  const ty = s > 1e-6 ? (yMax - y) / s : s < -1e-6 ? (-yMax - y) / s : Infinity;
  return Math.max(0, Math.min(tx, ty));
}

// Home spots for an island's blue dots: a fan pointing away from gazelle.
// Neighbouring dots alternate near/far so the fan has depth, not a single arc.
function shapeFan(t) {
  const kids = t.__kids;
  if (!kids.length) return;
  const out  = Math.atan2(t.y, t.x);
  const span = Math.min(FAN_MAX, FAN_STEP * kids.length);
  kids.forEach((k, j) => {
    const phi   = out + (kids.length === 1 ? 0 : (j / (kids.length - 1) - 0.5) * span)
                + 0.08 * wobble(k.id, 3);
    const reach = Math.min(toEdge(t.x, t.y, phi), FAN_REACH_PX);
    const depth = kids.length < 3 ? 0.6 : j % 2 ? 0.85 : 0.45;       // stagger near/far
    const share = FAN_NEAR + (FAN_FAR - FAN_NEAR) * Math.min(1, Math.max(0, depth + WOBBLE * wobble(k.id, 1)));
    k.__homeX = t.x + Math.cos(phi) * reach * share;
    k.__homeY = t.y + Math.sin(phi) * reach * share;
  });

}

function layout(raw) {
  const byId  = Object.fromEntries(raw.nodes.map(n => [n.id, n]));
  const root  = raw.nodes.find(n => n.type === 'root');
  const terms = raw.nodes.filter(n => n.type === 'constitutive');
  if (!root) { console.warn('boom: no gazelle node in /boom.json — check the build log'); return; }

  for (const t of terms) t.__kids = [];
  for (const l of raw.links) {
    const s = byId[l.source], k = byId[l.target];
    if (s?.type === 'constitutive') { s.__kids.push(k); k.__parent = s; }
  }
  for (const t of terms) t.__kids.sort((x, y) =>
    x.subjectType.localeCompare(y.subjectType) || x.id.localeCompare(y.id));

  ({ W: canvasW, H: canvasH } = canvasSize());
  root.x = root.fx = 0;
  root.y = root.fy = 0;

  // Ring slots at even angles, offset half a step so none sits dead on top.
  // Big islands take the side slots, where the canvas is widest.
  const slots = terms.map((_, i) => -Math.PI / 2 + (i + 0.5) / terms.length * 2 * Math.PI)
                     .sort((p, q) => Math.abs(Math.sin(p)) - Math.abs(Math.sin(q)));
  const a = (canvasW / 2 - EDGE_PX) * RING_FILL, b = (canvasH / 2 - EDGE_PX) * RING_FILL;

  [...terms].sort((p, q) => q.__kids.length - p.__kids.length).forEach((t, i) => {
    const [x, y] = ringPoint(slots[i], a, b);
    t.x = t.fx = x;
    t.y = t.fy = y;
    shapeFan(t);
    for (const k of t.__kids) { k.x = k.__homeX; k.y = k.__homeY; }
  });
}

// ── labels ────────────────────────────────────────────────────────────────────
// Gazelle and green labels sit centred under their dot. Blue labels sit beside
// their dot, facing away from their green dot — or towards it when that would
// run off the canvas.
function labelAnchor(node, gap) {
  const k = (dotRadius(node) + RENDER.labelGap) / gap;        // current zoom, recovered from gap
  if (node.type === 'regulative') {
    let side = node.x >= node.__parent.x ? 1 : -1;
    const far = node.x + side * (gap + (node.__labelW + 8) / k);
    if (Math.abs(far) > (canvasW / 2 - 8) / k) side = -side;
    return { lx: node.x + side * gap, ly: node.y, align: side > 0 ? 'left' : 'right' };
  }
  return { lx: node.x, ly: node.y + gap + (labelFontSize(node) / 2 + 2) / k, align: 'center' };
}

// Dot + label box in graph units at zoom 1 (px).
function nodeBox(n, withLabel = true) {
  const r = dotRadius(n);
  const box = { x0: n.x - r, x1: n.x + r, y0: n.y - r, y1: n.y + r };
  if (!withLabel) return box;
  const w = n.__labelW + 8, h = labelFontSize(n) + 8;
  const { lx, ly, align } = labelAnchor(n, r + RENDER.labelGap);
  const x0 = align === 'left' ? lx - 4 : align === 'right' ? lx - w + 4 : lx - w / 2;
  return {
    x0: Math.min(box.x0, x0), x1: Math.max(box.x1, x0 + w),
    y0: Math.min(box.y0, ly - h / 2), y1: Math.max(box.y1, ly + h / 2),
  };
}

// Push a and b (either may be pinned) apart along the box overlap's shorter axis.
function separate(a, b, A, B, strength) {
  const ox = Math.min(A.x1, B.x1) - Math.max(A.x0, B.x0);
  const oy = Math.min(A.y1, B.y1) - Math.max(A.y0, B.y0);
  if (ox <= 0 || oy <= 0) return;
  const aFree = a.fx == null, bFree = b.fx == null;
  if (!aFree && !bFree) return;
  const share = aFree && bFree ? 0.5 : 1;
  if (ox < oy) {
    const d = ((A.x0 + A.x1) < (B.x0 + B.x1) ? -1 : 1) * ox * strength * share;
    if (aFree) a.vx += d; if (bFree) b.vx -= d;
  } else {
    const d = ((A.y0 + A.y1) < (B.y0 + B.y1) ? -1 : 1) * oy * strength * share;
    if (aFree) a.vy += d; if (bFree) b.vy -= d;
  }
}

// ── forces ────────────────────────────────────────────────────────────────────
// Green dots and gazelle are pinned; only blue dots move.

// Each blue dot is pulled back towards its home spot, so the island keeps its
// loose shape while labels and neighbours nudge it.
function forceHome(strength = HOME_PULL) {
  let blues = [];
  function force() {
    for (const n of blues) {
      n.vx += (n.__homeX - n.x) * strength;
      n.vy += (n.__homeY - n.y) * strength;
    }
  }
  force.initialize = ns => { blues = ns.filter(n => n.type === 'regulative'); };
  return force;
}

// A blue dot stays clearly nearer its own green dot than any other: when
// another green gets within BELONG_PX of that, it is pushed back home.
function forceBelong() {
  let greens = [], blues = [];
  function force() {
    for (const n of blues) {
      const p = n.__parent;
      const own = Math.hypot(n.x - p.x, n.y - p.y) || 1;
      for (const g of greens) {
        if (g === p) continue;
        const dx = n.x - g.x, dy = n.y - g.y, d = Math.hypot(dx, dy) || 1;
        const short = own + BELONG_PX - d;
        if (short <= 0) continue;
        n.vx += (dx / d) * short * 0.3 + ((p.x - n.x) / own) * short * 0.2;
        n.vy += (dy / d) * short * 0.3 + ((p.y - n.y) / own) * short * 0.2;
      }
    }
  }
  force.initialize = ns => {
    greens = ns.filter(n => n.type === 'constitutive');
    blues  = ns.filter(n => n.type === 'regulative');
  };
  return force;
}

// Labels: no blue dot settles under a green or gazelle label (those always show).
function forceLabels(strength = 1.0) {
  let fixed = [], blues = [];
  function force() {
    for (const L of fixed) {
      const LB = nodeBox(L);
      for (const n of blues) separate(L, n, LB, nodeBox(n, false), strength);
    }
  }
  force.initialize = ns => {
    fixed  = ns.filter(n => n.type !== 'regulative');
    blues  = ns.filter(n => n.type === 'regulative');
  };
  return force;
}

// Soft wall: every blue dot and its label stays EDGE_PX inside the canvas.
function forceWall(strength = 0.6) {
  let nodes;
  function force() {
    const x0 = -canvasW / 2 + EDGE_PX, x1 = canvasW / 2 - EDGE_PX;
    const y0 = -canvasH / 2 + EDGE_PX, y1 = canvasH / 2 - EDGE_PX;
    for (const n of nodes) {
      if (n.fx != null) continue;
      const b = nodeBox(n);
      if (b.x0 < x0) n.vx += (x0 - b.x0) * strength;
      if (b.x1 > x1) n.vx -= (b.x1 - x1) * strength;
      if (b.y0 < y0) n.vy += (y0 - b.y0) * strength;
      if (b.y1 > y1) n.vy -= (b.y1 - y1) * strength;
    }
  }
  force.initialize = ns => { nodes = ns; };
  return force;
}

// ── focus ─────────────────────────────────────────────────────────────────────
// Hovering or clicking highlights; nothing moves and the camera stays put.
// A green dot highlights its whole island and shows all its rule labels.
// A blue dot keeps the default: itself, its green dot and the spoke between them.
function neighbours(activeId, graph, base) {
  const g = graph.nodes.find(n => n.id === activeId);
  if (g?.type !== 'constitutive') return base;
  return new Set([g.id, ...g.__kids.map(k => k.id), ...base]);
}

// ── idle panel ────────────────────────────────────────────────────────────────
function IdlePanel({ theme }) {
  const p = (key, ...content) =>
    React.createElement('p', { key, className: 'info-text', style: { margin: 0 } }, ...content);
  const swatch = (color, text) => React.createElement('span', { style: { color } }, text);

  return React.createElement('div', {
    className: 'corner-panel' + (theme === 'light' ? ' light' : ''),
  },
    React.createElement('h1', { style: { margin: '0 0 12px', padding: 0, fontSize: 16, fontWeight: 400, lineHeight: 1.3 } },
      'Boom'),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      p('a', 'Each constitutive rule defines what a term counts as. The regulative rules around it say what must hold for it.'),
      React.createElement('hr', { style: { border: 'none', borderTop: '1px solid rgba(155,175,215,0.15)', margin: '4px 0' } }),
      p('y', swatch(PALETTE.ENTRY,     'Yellow'), ' = gazelle'),
      p('g', swatch(PALETTE.CONNECTOR, 'Green'),  ' = constitutive rules'),
      p('b', swatch(PALETTE.LEAF,      'Blue'),   ' = regulative rules (entity and process)'),
    ),
    React.createElement(OpenSourceNote),
  );
}

// ── panel ─────────────────────────────────────────────────────────────────────
// Rule text, why, violations, then outbound and inbound relations with their
// type and note. Relations come from the full set boom.json carries alongside
// the map (raw.relations): implements and cross-links, not just
// the gazelle → topic → rule edges drawn here. A related entity links to its
// own page, /boom/<id>/ — the map with that entity selected.
const OUTBOUND_COLOR = '#fb923c';
const INBOUND_COLOR  = '#7dd3fc';
const META = { color: '#94a3b8', fontFamily: FONT_MONO, fontSize: 12 };
const LIST = { display: 'flex', flexDirection: 'column', overflowX: 'hidden', whiteSpace: 'normal' };

let relations = { nodes: [], links: [] }, entityById = new Map();

function panel(node, graph) {
  const entity = entityById.get(node.id) ?? node;
  const onMap  = new Set(graph.nodes.map(n => n.id));
  // 'implements' shows inbound only (a topic lists its rules); a rule's own
  // topic is already its green dot on the map.
  const out = relations.links.filter(l => l.source === node.id && l.relationship !== 'implements');
  const inc = relations.links.filter(l => l.target === node.id);
  const children = [];

  if (entity.rule)     children.push(React.createElement('p', { key: 'rv', className: 'info-text' }, entity.rule));
  if (entity.decision) children.push(React.createElement('p', { key: 'dv', className: 'info-text' }, entity.decision));
  if (entity.why) children.push(
    React.createElement('div', { key: 'wl', className: 'info-label' }, 'Why'),
    React.createElement('p',   { key: 'wv', className: 'info-text' }, entity.why),
  );
  if (entity.violations?.length) children.push(
    React.createElement('div', { key: 'vl', className: 'info-label' }, 'Violations'),
    React.createElement('div', { key: 'vv', className: 'code-block', style: { ...LIST, gap: 6 } },
      ...entity.violations.map((v, i) => React.createElement('div', { key: i, style: META }, v))),
  );

  function Related({ id, relation, note, arrow, color }) {
    const name    = { style: { color, fontFamily: FONT_MONO, fontSize: 13, textDecoration: 'none' } };
    const text    = arrow + ' ' + label(id);
    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 8, borderBottom: '1px solid rgba(155,175,215,0.1)' } },
      onMap.has(id)
        ? React.createElement('a', { ...name, href: `/boom/${id}/` }, text)
        : React.createElement('span', name, text),
      relation && React.createElement('div', { style: { ...META, opacity: 0.75 } }, label(relation)),
      note && React.createElement('div', { style: META }, note),
    );
  }

  // showRelation: false when the heading already names the relation.
  const block = (key, title, color, links, end, arrow, showRelation) => links.length > 0 && children.push(
    React.createElement('div', { key: key + 'l', className: 'info-label', style: { color } }, title),
    React.createElement('div', { key: key + 'v', className: 'code-block', style: { ...LIST, gap: 0 } },
      ...links.map((l, i) => React.createElement(Related,
        { key: i, id: l[end], relation: showRelation && l.relationship, note: l.note, arrow, color }))),
  );

  // Outbound: one section per relation, titled by it ("Depends on →", …).
  const byRelation = new Map();
  for (const l of out) byRelation.set(l.relationship, [...(byRelation.get(l.relationship) ?? []), l]);
  for (const [relation, links] of byRelation) {
    const title = label(relation).replace(/^./, c => c.toUpperCase()) + ' →';
    block('o-' + relation, title, OUTBOUND_COLOR, links, 'target', '→', false);
  }
  block('i', 'Inbound Links ←', INBOUND_COLOR, inc, 'source', '←', true);

  return React.createElement(React.Fragment, null, ...children);
}

// ── page config ───────────────────────────────────────────────────────────────
mount({
  activeHref: '/boom/',
  localJson:  '/boom.json',

  types: {
    'root':         { palette: 'ENTRY',     label: 'gazelle'           },
    'constitutive': { palette: 'CONNECTOR', label: 'constitutive rule' },
    'regulative':   { palette: 'LEAF',      label: 'regulative rule'   },
  },

  dotRadius,

  prepare(raw) {
    relations = raw.relations ?? relations;
    entityById = new Map(relations.nodes.map(n => [n.id, n]));
    measureLabels(raw.nodes);
    layout(raw);
  },

  // Gazelle and green dots are pinned; blue dots settle before the first frame.
  forces(fg) {
    fg.d3Force('link').strength(0);                   // spokes are drawn, the home pull does the holding
    fg.d3Force('charge')                              // a little mutual push keeps siblings from clumping
      .strength(n => n.type === 'regulative' ? -12 : 0)
      .distanceMax(40);
    fg.d3Force('center', null);
    fg.d3Force('home',   forceHome());
    fg.d3Force('belong', forceBelong());
    fg.d3Force('labels', forceLabels());
    fg.d3Force('wall',   forceWall());
  },

  warmupTicks: 300,
  cooldownTime: 0,
  maxZoom: 1,                          // layout is sized in screen px at 1×; never zoom past it

  // Blue labels show one at a time: the hovered or clicked rule, or search
  // matches. A green dot highlights its island; the panel lists its rules.
  showLabel(node, { activeId, isMatch }) {
    return node.type !== 'regulative' || node.id === activeId || isMatch;
  },

  labelPosition: (node, r, gap) => labelAnchor(node, gap),
  labelFontSize,

  linkColor(l, { activeId, neighbours, theme }) {
    const dim    = theme === 'dark' ? 'rgba(180,195,225,0.28)' : 'rgba(80,80,100,0.15)';
    const active = theme === 'dark' ? 'rgba(235,242,255,0.95)' : 'rgba(30,30,50,0.75)';
    const faded  = theme === 'dark' ? 'rgba(180,180,180,0.04)' : 'rgba(80,80,100,0.04)';
    if (!activeId) return dim;
    const [s, t] = linkEnds(l);
    if (s === activeId || t === activeId) return active;
    // Inside the highlighted island every parent → rule link stays visible.
    return neighbours?.has(s) && neighbours?.has(t) ? active : faded;
  },

  neighbours,

  nameplateLabel: n => n.rule ?? n.decision ?? label(n.id),

  idlePanel: IdlePanel,
  panel,
});
