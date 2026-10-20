import { mount } from '/engine.js';
import { PALETTE, RENDER, FONT_MONO, linkEnds, OpenSourceNote } from '/shell.js';
import React from 'react';

// ── layout: gazelle → topics, rules on hover or click ─────────────────────────
// Gazelle sits in the centre, green dots (topics) on a ring around it; both
// are pinned. Each rule has two homes. At rest it floats faint in a loose fan
// pointing away from gazelle, with no label and no spoke; fans may overlap.
// Hovering a green dot, or clicking it or one of its faint rules, opens the
// island: its rules spring from the fan onto a shallow arc beside the green
// dot, one row per rule, brighten, and show labels facing away from gazelle
// and spokes to the green dot. Closing lets them drift back. Only one island
// is open at a time, and only the island opening or closing moves.
// All sizes are screen px; maxZoom 1 keeps them so on screen.
const EDGE_PX    = 44;    // canvas edge → nearest dot or label (≥ zoomToFit's 40)
const RING_SHAPE = 2;     // 2 = ellipse; higher = squarer
const RING_FILL  = 0.55;  // green ring, as a share of the way to the canvas edge

const FAN_NEAR     = 0.5;   // nearest resting rule, as a share of the green → edge distance
const FAN_FAR      = 1.0;   // farthest resting rule, same measure
const FAN_REACH_PX = 260;   // longest a fan may reach, however far the edge is
const FAN_STEP     = 0.12;  // fan width per rule, radians …
const FAN_MAX      = 1.6;   // … capped here
const WOBBLE       = 0.22;  // per-dot irregularity in the fan

const ROW_PX     = 24;    // one rule per row on an open arc
const COLUMN_PX  = 70;    // green dot → arc ends, when the labels leave room
const BOW_PX     = 36;    // how far the arc's middle bulges past its ends, at most
const JITTER_PX  = 6;     // per-dot irregularity along the arc

const OPEN_PULL  = 0.12;  // spring towards the arc; a little overshoot, settles in ~½ s
const REST_PULL  = 0.06;  // spring back towards the fan, softer
const SETTLE_MS  = 1500;  // how long the simulation runs after an island opens or closes
const LEAVE_MS   = 350;   // grace after the pointer leaves an island, to cross to its rules

const REST_ALPHA = 0.28;  // a closed island's rules, while no island is open
const AWAY_ALPHA = 0.1;   // a closed island's rules, while another is open

const STILL = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const label         = id => id.replaceAll('-', ' ');
const dotRadius     = n => n.type === 'root' ? 8 : n.type === 'constitutive' ? 5.5 : 3.5;
const labelFontSize = n => n.type === 'regulative' ? RENDER.labelFontSize : RENDER.labelFontSize + 1;

let canvasW = 1200, canvasH = 800;   // set in prepare()
let nodeById = new Map();            // set in prepare()
let blues = [];                      // every rule, set in layout()
let fg = null;                       // ForceGraph instance, set in forces()

// Label width in screen px, measured with the font drawLabel uses.
let measurer;
function textWidth(n, text) {
  measurer ??= document.createElement('canvas').getContext('2d');
  measurer.font = `${labelFontSize(n)}px 'IBM Plex Sans', system-ui, sans-serif`;
  return measurer.measureText(text).width;
}

function measureLabels(nodes) {
  for (const n of nodes) n.__labelW = textWidth(n, label(n.id));
}

// The label cut to fit maxW, ending in an ellipsis; whole when it fits.
function fitText(n, maxW) {
  const full = label(n.id);
  if (n.__labelW <= maxW) return full;
  let text = full;
  while (text.length > 1 && textWidth(n, text + '…') > maxW) text = text.slice(0, -1);
  return text.trimEnd() + '…';
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

// Resting homes for an island's rules: a fan pointing away from gazelle.
// Neighbouring dots alternate near/far so the fan has depth, not a single arc.
function placeFan(t) {
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
    k.__restX = t.x + Math.cos(phi) * reach * share;
    k.__restY = t.y + Math.sin(phi) * reach * share;
  });
}

// An island's rules on a shallow arc on the outer side of its green dot: rows
// stay evenly spaced so labels never touch, while the middle bulges outward
// and each dot sits a little off the line. The arc is centred on the green dot
// and kept inside the canvas. Labels always face outward. When the longest
// would run off the edge, the arc first moves in towards its green dot (never
// under the green label); a label that still does not fit is cut with an
// ellipsis, and the panel carries its full name.
function placeArc(t) {
  const kids = t.__kids;
  if (!kids.length) return;
  const xMax  = canvasW / 2 - EDGE_PX, yMax = canvasH / 2 - EDGE_PX;
  const side  = t.x >= 0 ? 1 : -1;
  const room  = xMax - Math.abs(t.x) - dotRadius(kids[0]) - RENDER.labelGap;
  const h     = (kids.length - 1) * ROW_PX;
  const bow   = Math.min(BOW_PX, h * 0.2);
  const want  = Math.max(COLUMN_PX, t.__labelW / 2 + 24);
  const least = t.__labelW / 2 + 12 + JITTER_PX;                // clear of the green label
  const dx    = Math.max(least, Math.min(want, room - bow - Math.max(...kids.map(k => k.__labelW))));

  const top  = Math.max(-yMax, Math.min(t.y - h / 2, yMax - h));
  const half = Math.max(h / 2, 1);
  kids.forEach((k, j) => {
    const y   = top + j * ROW_PX;
    const u   = Math.max(-1, Math.min(1, (y - t.y) / half));   // −1 above the green dot … 1 below
    const off = dx + bow * (1 - u * u) + JITTER_PX * wobble(k.id, 1);
    k.__arcX = t.x + side * off;
    k.__arcY = y;
    k.__side = side;
    k.__text = fitText(k, room - off);
  });
}

function layout(raw) {
  const root  = raw.nodes.find(n => n.type === 'root');
  const terms = raw.nodes.filter(n => n.type === 'constitutive');
  if (!root) { console.warn('boom: no gazelle node in /boom.json — check the build log'); return; }

  for (const t of terms) t.__kids = [];
  for (const l of raw.links) {
    const s = nodeById.get(l.source), k = nodeById.get(l.target);
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
    placeFan(t);
    placeArc(t);
  });

  blues = raw.nodes.filter(n => n.type === 'regulative');
  for (const k of blues) { k.x = k.__restX; k.y = k.__restY; }
}

// ── labels ────────────────────────────────────────────────────────────────────
// Gazelle and green labels sit centred under their dot. Blue labels sit beside
// their dot, on the arc's outer side.
function labelAnchor(node, gap) {
  const k = (dotRadius(node) + RENDER.labelGap) / gap;        // current zoom, recovered from gap
  if (node.type === 'regulative') {
    const side = node.__side;
    return { lx: node.x + side * gap, ly: node.y, align: side > 0 ? 'left' : 'right' };
  }
  return { lx: node.x, ly: node.y + gap + (labelFontSize(node) / 2 + 2) / k, align: 'center' };
}

// ── open island ───────────────────────────────────────────────────────────────
// A clicked island stays open until it is closed (click away, Esc) or another
// is clicked. Without a click, hovering a green dot opens its island, and it
// stays open while the pointer is on that green dot or its open rules. Once
// the pointer leaves, the island closes after LEAVE_MS, long enough to cross
// the gap between the green dot and its arc. Hovering gazelle or another
// green dot switches at once. Hovering a closed island's faint rule does not
// open it: the rule would spring out from under the pointer, close, drift
// back and open again. A click on it does.
let hoverIsland = null, lastFocusedId = null, openNow = null, leaveTimer = null;

const islandOf = n => n?.type === 'constitutive' ? n : n?.__parent ?? null;

function stay() { clearTimeout(leaveTimer); leaveTimer = null; }

function openIsland({ focusedId, hoveredId }) {
  if (lastFocusedId && !focusedId) hoverIsland = null;          // closed by click-away or Esc
  lastFocusedId = focusedId;
  const f = nodeById.get(focusedId);
  let open;
  if (f) open = islandOf(f);
  else {
    const h = nodeById.get(hoveredId);
    if (h?.type === 'constitutive')                            { stay(); hoverIsland = h; }
    else if (h?.type === 'root')                               { stay(); hoverIsland = null; }
    else if (h?.type === 'regulative' && h.__parent === hoverIsland) stay();
    else if (hoverIsland && !leaveTimer) leaveTimer = setTimeout(() => {
      leaveTimer  = null;
      hoverIsland = null;
      fg?.d3ReheatSimulation();                                 // redraw, so the close is seen
    }, LEAVE_MS);
    open = hoverIsland;
  }
  if (open !== openNow) { openNow = open; queueMicrotask(settle); }
  return open;
}

// ── motion ────────────────────────────────────────────────────────────────────
// Each rule springs towards its arc slot while its island is open, and back
// to its fan home otherwise. The spring ignores the simulation's cooling, so
// every dot reaches its home before the run ends. With reduced motion, dots
// jump straight there.
const homeX = n => n.__parent === openNow ? n.__arcX : n.__restX;
const homeY = n => n.__parent === openNow ? n.__arcY : n.__restY;

function forceHome() {
  function force() {
    for (const n of blues) {
      const k = n.__parent === openNow ? OPEN_PULL : REST_PULL;
      n.vx += (homeX(n) - n.x) * k;
      n.vy += (homeY(n) - n.y) * k;
    }
  }
  force.initialize = () => {};
  return force;
}

function settle() {
  if (STILL) for (const n of blues) { n.x = homeX(n); n.y = homeY(n); n.vx = n.vy = 0; }
  fg?.d3ReheatSimulation();
}

// Rules of the open island, and search matches, show in full. Every other
// rule rests faint, fainter still while an island is open.
function nodeAlpha(node, ctx) {
  const dim = ctx.dimmed ? RENDER.dimmedAlpha : 1;
  if (node.type !== 'regulative') return dim;
  if (ctx.isMatch) return 1;
  const open = openIsland(ctx);
  if (node.__parent === open) return ctx.dimmed ? 0.4 : 1;
  return open ? AWAY_ALPHA : REST_ALPHA;
}

function showLabel(node, ctx) {
  return node.type !== 'regulative' || ctx.isMatch || node.__parent === openIsland(ctx);
}

// ── focus ─────────────────────────────────────────────────────────────────────
// A green dot highlights its whole island. A blue dot keeps the default:
// itself, its green dot and the spoke between them.
function neighbours(activeId, graph, base) {
  const g = nodeById.get(activeId);
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
      p('c', 'Hover or click a green dot to see its rules.'),
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
    relations  = raw.relations ?? relations;
    entityById = new Map(relations.nodes.map(n => [n.id, n]));
    nodeById   = new Map(raw.nodes.map(n => [n.id, n]));
    measureLabels(raw.nodes);
    layout(raw);
  },

  // Gazelle and green dots are pinned; rules move only under forceHome.
  forces(graph) {
    fg = graph;
    fg.d3Force('link').strength(0);
    fg.d3Force('charge', null);
    fg.d3Force('center', null);
    fg.d3Force('home', forceHome());
  },

  cooldownTime: SETTLE_MS,
  fitOnEngineStop: false,              // the camera stays put while islands open and close
  maxZoom: 1,                          // layout is sized in screen px at 1×; never zoom past it

  nodeAlpha,
  showLabel,

  labelPosition: (node, r, gap) => labelAnchor(node, gap),
  labelFontSize,
  labelText: n => n.__text ?? label(n.id),

  // Green → rule spokes show only for the open island.
  linkColor(l, ctx) {
    const { activeId, neighbours, theme } = ctx;
    if (l.source.type === 'constitutive' && l.source !== openIsland(ctx)) return 'rgba(0,0,0,0)';
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
