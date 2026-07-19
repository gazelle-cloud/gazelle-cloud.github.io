import { mount } from '/engine.js';
import { forceCollide, forceRadial } from 'https://esm.sh/d3-force';
import { PALETTE, RENDER, FONT_MONO, linkEnds, OpenSourceNote } from '/shell.js';
import React from 'react';

// ── idle panel ────────────────────────────────────────────────────────────────
function IdlePanel({ theme }) {
  return React.createElement('div', {
    className: 'corner-panel' + (theme === 'light' ? ' light' : ''),
  },
    React.createElement('h1', { style: { margin: '0 0 12px', padding: 0, fontSize: 16, fontWeight: 400, lineHeight: 1.3 } },
      'Gazelle — Engine for Azure Landing Zones'),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        "Every dot is a decision. Every line brings clarity to what depends on it — so you can see the full picture from any starting point. Click any dot to open a helicopter view."),
      React.createElement('hr', { style: { border: 'none', borderTop: '1px solid rgba(155,175,215,0.15)', margin: '4px 0' } }),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.ENTRY } }, 'Yellow'), ' = guiding principles'),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.LEAF } }, 'Blue'), ' = design decisions'),
    ),
    React.createElement(OpenSourceNote),
  );
}

// ── panel ─────────────────────────────────────────────────────────────────────
const OUTBOUND_COLOR = '#fb923c';
const INBOUND_COLOR  = '#7dd3fc';

function panel(node, graph, { setFocusedId, theme }) {
  const outLinks = graph.links.filter(l => {
    const [s] = linkEnds(l);
    return s === node.id && l.relationship === 'related';
  });
  const inLinks = graph.links.filter(l => {
    const [, t] = linkEnds(l);
    return t === node.id && l.relationship === 'related';
  });

  const children = [];

  if (node.intent) children.push(
    React.createElement('div', { key: 'il', className: 'info-label' }, 'Intent'),
    React.createElement('p',   { key: 'iv', className: 'info-text' }, node.intent),
  );

  if (node.decision) children.push(
    React.createElement('p', { key: 'dv', className: 'info-text' }, node.decision),
  );

  if (node.why) children.push(
    React.createElement('div', { key: 'wl', className: 'info-label' }, 'Why'),
    React.createElement('p',   { key: 'wv', className: 'info-text' }, node.why),
  );

  const nodeById = Object.fromEntries(graph.nodes.map(n => [n.id, n]));

  function LinkedNode({ id, note, arrow, color }) {
    const linked = nodeById[id];
    const isYellowInvolved = node.type === 'guiding-principle' || linked?.type === 'guiding-principle';
    const summary = linked?.decision || linked?.intent;
    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 8, borderBottom: '1px solid rgba(155,175,215,0.1)' } },
      React.createElement('span', {
        style: { color, fontFamily: FONT_MONO, fontSize: 13, cursor: 'pointer' },
        onClick: () => setFocusedId(id),
      }, arrow + ' ' + id.replaceAll('-', ' ')),
      note && React.createElement('div', { style: { color: '#94a3b8', fontFamily: FONT_MONO, fontSize: 12 } }, note),
      isYellowInvolved && summary && React.createElement('div', { style: { color: '#94a3b8', fontFamily: FONT_MONO, fontSize: 12 } }, summary),
    );
  }

  if (outLinks.length > 0) children.push(
    React.createElement('div', { key: 'ol', className: 'info-label', style: { color: OUTBOUND_COLOR } }, 'Outbound Links →'),
    React.createElement('div', { key: 'ov', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...outLinks.map((l, i) => {
        const [, targetId] = linkEnds(l);
        return React.createElement(LinkedNode, { key: i, id: targetId, note: l.note, arrow: '→', color: OUTBOUND_COLOR });
      }),
    ),
  );

  if (inLinks.length > 0) children.push(
    React.createElement('div', { key: 'inl', className: 'info-label', style: { color: INBOUND_COLOR } }, 'Inbound Links ←'),
    React.createElement('div', { key: 'inv', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...inLinks.map((l, i) => {
        const [sourceId] = linkEnds(l);
        return React.createElement(LinkedNode, { key: i, id: sourceId, note: l.note, arrow: '←', color: INBOUND_COLOR });
      }),
    ),
  );

  return React.createElement(React.Fragment, null, ...children);
}

// ── page config ───────────────────────────────────────────────────────────────
mount({
  activeHref: '/knowledge-graph/',

  localJson: '/knowledge-graph.json',

  types: {
    'guiding-principle': { palette: 'ENTRY', label: 'guiding principle' },
    'decision':          { palette: 'LEAF',  label: 'design decision'   },
  },

  dotRadius: node => node.type === 'decision' ? 2 + node.__weight * 7 : 5,

  prepare(raw) {
    // Pin guiding-principles on a rim
    const rim = raw.nodes.filter(n => n.type === 'guiding-principle');
    rim.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / rim.length - Math.PI / 4;
      n.x = Math.cos(angle) * 105;
      n.y = Math.sin(angle) * 105;
    });
    // Pin the highest-weight decision at the centre
    raw.nodes
      .filter(n => n.type !== 'guiding-principle')
      .sort((a, b) => b.__weight - a.__weight)
      .slice(0, 1)
      .forEach(n => { n.fx = 0; n.fy = 0; });
  },

  forces(fg) {
    fg.d3Force('link').distance(60).strength(0.05);
    fg.d3Force('collision', forceCollide(n => (n.type === 'decision' ? 2 + n.__weight * 7 : 5) + 3));
    fg.d3Force('charge').strength(n => n.type === 'guiding-principle' ? 0 : -5);
    fg.d3Force('radial', forceRadial(
      n => n.type === 'guiding-principle' ? 105 : (1 - n.__weight) * 110, 0, 0)
      .strength(n => n.type === 'guiding-principle' ? 0.8 : 1.0));
  },

  showLabel(node, { activeId, isNeighbour, isMatch }) {
    return node.type === 'guiding-principle' || node.id === activeId || isNeighbour || isMatch;
  },

  labelPosition(node, r, gap) {
    if (node.type === 'guiding-principle') {
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
    return node.type === 'guiding-principle' ? RENDER.labelFontSize + 1 : RENDER.labelFontSize;
  },

  linkColor(l, { activeId, theme }) {
    const dim    = theme === 'dark' ? 'rgba(180,195,225,0.28)' : 'rgba(80,80,100,0.15)';
    const faded  = theme === 'dark' ? 'rgba(180,180,180,0.04)' : 'rgba(80,80,100,0.04)';
    if (!activeId) return dim;
    const [s, t] = linkEnds(l);
    if (l.relationship === 'related') {
      if (s === activeId) return OUTBOUND_COLOR;
      if (t === activeId) return INBOUND_COLOR;
    }
    const active = theme === 'dark' ? 'rgba(235,242,255,0.95)' : 'rgba(30,30,50,0.75)';
    return (s === activeId || t === activeId) ? active : faded;
  },

  idlePanel: IdlePanel,
  panel,
});
