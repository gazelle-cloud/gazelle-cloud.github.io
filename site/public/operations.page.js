import { mount } from '/engine.js';
import { forceCollide, forceRadial } from 'https://esm.sh/d3-force';
import { PALETTE, FONT_MONO, linkEnds } from '/shell.js';
import React from 'react';

const INNER_R = 70;
const OUTER_R = 160;

// ── idle panel ────────────────────────────────────────────────────────────────
function IdlePanel({ theme }) {
  return React.createElement('div', {
    className: 'corner-panel' + (theme === 'light' ? ' light' : ''),
  },
    React.createElement('h1', { style: { margin: '0 0 12px', padding: 0, fontSize: 16, fontWeight: 400, lineHeight: 1.3, color: '#fff' } },
      'Platform Operations'),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        "This graph maps Gazelle's standard operations — the files each one touches and the design decisions that shape it."),
      React.createElement('hr', { style: { border: 'none', borderTop: '1px solid rgba(155,175,215,0.15)', margin: '4px 0' } }),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.ENTRY } }, 'Yellow'), ' = operations'),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.LEAF } }, 'Blue'), ' = design decisions'),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.CONNECTOR } }, 'Green'), ' = file paths'),
    ),
  );
}

// ── panel ─────────────────────────────────────────────────────────────────────
const DECISION_COLOR = PALETTE.LEAF;
const FILE_COLOR     = PALETTE.CONNECTOR;

function panel(node, graph, { setFocusedId, theme }) {
  const nodeById = Object.fromEntries(graph.nodes.map(n => [n.id, n]));

  const connected = graph.links
    .filter(l => { const [s, t] = linkEnds(l); return s === node.id || t === node.id; })
    .map(l => {
      const [s, t] = linkEnds(l);
      return { id: s === node.id ? t : s, type: l.type };
    });

  const reasoningIds = connected.filter(c => c.type === 'reasoning' || (!c.type && nodeById[c.id]?.type === 'decision')).map(c => c.id);
  const fileIds      = connected.filter(c => c.type === 'file').map(c => c.id);
  const otherIds     = connected.filter(c => c.type !== 'reasoning' && c.type !== 'file' && nodeById[c.id]?.type !== 'decision').map(c => c.id);

  // For decision nodes, find which operations link to them
  const usedBy = node.type === 'decision'
    ? connected.filter(c => nodeById[c.id]?.type === 'operation').map(c => c.id)
    : [];

  const children = [];

  if (node.intent) children.push(
    React.createElement('div', { key: 'il', className: 'info-label' }, 'Intent'),
    React.createElement('p',   { key: 'iv', className: 'info-text' }, node.intent),
  );

  if (node.decision) children.push(
    React.createElement('div', { key: 'dl', className: 'info-label', style: { color: DECISION_COLOR } }, 'Design constraint'),
    React.createElement('p',   { key: 'dv', className: 'info-text' }, node.decision),
  );

  // Operations: show design decisions
  if (node.type !== 'decision' && reasoningIds.length > 0) children.push(
    React.createElement('div', { key: 'll', className: 'info-label', style: { color: DECISION_COLOR } }, 'Design constraints'),
    React.createElement('div', { key: 'lv', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 8, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...reasoningIds.map((id, i) => {
        const d = nodeById[id];
        return React.createElement('div', { key: i },
          React.createElement('a', {
            href: `/knowledge-graph/#${id}`,
            style: { color: DECISION_COLOR, fontFamily: FONT_MONO, fontSize: 13, textDecoration: 'none' },
          }, '→ ' + id.replaceAll('-', ' ')),
          d?.decision && React.createElement('div', { style: { color: '#94a3b8', fontFamily: FONT_MONO, fontSize: 12, marginTop: 2 } }, d.decision),
        );
      }),
    ),
  );

  // Decisions: show "used by" operations
  if (node.type === 'decision' && usedBy.length > 0) children.push(
    React.createElement('div', { key: 'ubl', className: 'info-label' }, 'Used by'),
    React.createElement('div', { key: 'ubv', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 8, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...usedBy.map((id, i) => React.createElement('div', { key: i,
        style: { color: '#94a3b8', fontFamily: FONT_MONO, fontSize: 13 },
      }, id)),
    ),
  );

  // File nodes
  if (fileIds.length > 0) children.push(
    React.createElement('div', { key: 'fl', className: 'info-label', style: { color: FILE_COLOR } }, 'Files to modify'),
    React.createElement('div', { key: 'fv', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 8, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...fileIds.map((id, i) => React.createElement('div', { key: i,
        style: { color: FILE_COLOR, fontFamily: FONT_MONO, fontSize: 13 },
      }, id)),
    ),
  );

  if (otherIds.length > 0) children.push(
    React.createElement('div', { key: 'ol', className: 'info-label' }, 'Connected'),
    React.createElement('div', { key: 'ov', className: 'code-block', style: { display: 'flex', flexDirection: 'column', gap: 8, overflowX: 'hidden', whiteSpace: 'normal' } },
      ...otherIds.map((id, i) => React.createElement('div', { key: i,
        style: { color: '#94a3b8', fontFamily: FONT_MONO, fontSize: 13 },
      }, id)),
    ),
  );

  // Steps for operations
  if (node.steps?.length > 0) children.push(
    React.createElement('div', { key: 'sl', className: 'info-label' }, 'Steps'),
    React.createElement('ol', { key: 'sv', style: { margin: '4px 0 0', paddingLeft: 18 } },
      ...node.steps.map((s, i) => React.createElement('li', { key: i, className: 'info-text', style: { marginBottom: 4 } }, s)),
    ),
  );

  return React.createElement(React.Fragment, null, ...children);
}

// ── label helper ──────────────────────────────────────────────────────────────
function nodeLabel(node) {
  if (node.type !== 'file') return node.id.replaceAll('-', ' ');
  const parts = node.id.split('/').filter(Boolean);
  if (parts.length <= 2) return node.id;
  return `${parts[0]}/\u2026/${parts[parts.length - 1]}`;
}

// ── page config ───────────────────────────────────────────────────────────────
mount({
  activeHref: '/operations/',

  localJson: '/operations.json',

  types: {
    'operation': { palette: 'ENTRY',     label: 'operation'      },
    'decision':  { palette: 'LEAF',      label: 'design decision' },
    'file':      { palette: 'CONNECTOR', label: 'file'            },
  },

  dotRadius: node =>
    node.type === 'operation' ? 6 : node.type === 'file' ? 3 : 4,

  prepare(raw) {
    const ops   = raw.nodes.filter(n => n.type === 'operation').sort((a, b) => a.id.localeCompare(b.id));
    const outer = raw.nodes.filter(n => n.type !== 'operation').sort((a, b) => a.id.localeCompare(b.id));

    ops.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / ops.length - Math.PI / 2;
      n.fx = Math.cos(angle) * INNER_R;
      n.fy = Math.sin(angle) * INNER_R;
    });

    const decisions = outer.filter(n => n.type === 'decision');
    const files     = outer.filter(n => n.type === 'file');

    decisions.forEach((n, i) => {
      const angle = -Math.PI + Math.PI * i / Math.max(decisions.length - 1, 1);
      n.x = Math.cos(angle) * OUTER_R;
      n.y = Math.sin(angle) * OUTER_R;
    });
    files.forEach((n, i) => {
      const angle = Math.PI * i / Math.max(files.length - 1, 1);
      n.x = Math.cos(angle) * OUTER_R;
      n.y = Math.sin(angle) * OUTER_R;
    });

    // Pre-compute sibling pairs (nodes sharing an operation parent) for repulsion
    const opIds = new Set(ops.map(n => n.id));
    const opChildren = new Map();
    raw.links.forEach(l => {
      if (opIds.has(l.source)) { if (!opChildren.has(l.source)) opChildren.set(l.source, []); opChildren.get(l.source).push(l.target); }
      if (opIds.has(l.target)) { if (!opChildren.has(l.target)) opChildren.set(l.target, []); opChildren.get(l.target).push(l.source); }
    });
    raw._siblingPairs = [];
    opChildren.forEach(children => {
      for (let i = 0; i < children.length; i++)
        for (let j = i + 1; j < children.length; j++)
          raw._siblingPairs.push([children[i], children[j]]);
    });
  },

  forces(fg, nodes, raw) {
    const siblingPairs = raw._siblingPairs ?? [];

    fg.d3Force('link').strength(0);
    fg.d3Force('charge').strength(n => n.type === 'operation' ? 0 : -120);
    fg.d3Force('collision', forceCollide(n =>
      (n.type === 'operation' ? 6 : n.type === 'file' ? 3 : 4) + 8));
    fg.d3Force('radial', forceRadial(OUTER_R, 0, 0)
      .strength(n => n.type === 'operation' ? 0 : 0.8));

    const halfForce = (() => {
      let ns = [];
      const force = alpha => {
        for (const n of ns) {
          if (n.type === 'operation') continue;
          const target = n.type === 'file' ? Math.PI / 2 : -Math.PI / 2;
          let dAngle = target - Math.atan2(n.y, n.x);
          if (dAngle >  Math.PI) dAngle -= 2 * Math.PI;
          if (dAngle < -Math.PI) dAngle += 2 * Math.PI;
          const ang = Math.atan2(n.y, n.x);
          const f = alpha * 0.3 * dAngle;
          n.vx += -Math.sin(ang) * f;
          n.vy +=  Math.cos(ang) * f;
        }
      };
      force.initialize = arr => { ns = arr; };
      return force;
    })();
    fg.d3Force('half-pull', halfForce);

    const siblingForce = (() => {
      let pairs = [];
      const force = alpha => {
        for (const [a, b] of pairs) {
          let dAngle = Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x);
          if (dAngle >  Math.PI) dAngle -= 2 * Math.PI;
          if (dAngle < -Math.PI) dAngle += 2 * Math.PI;
          const sign = Math.sign(dAngle) || 1;
          const f = alpha * 0.8 / (Math.abs(dAngle) + 0.05);
          const angA = Math.atan2(a.y, a.x);
          a.vx += sign * -Math.sin(angA) * f;
          a.vy += sign *  Math.cos(angA) * f;
          const angB = Math.atan2(b.y, b.x);
          b.vx -= sign * -Math.sin(angB) * f;
          b.vy -= sign *  Math.cos(angB) * f;
        }
      };
      force.initialize = arr => {
        const byId = new Map(arr.map(n => [n.id, n]));
        pairs = siblingPairs.map(([idA, idB]) => [byId.get(idA), byId.get(idB)]).filter(([a, b]) => a && b);
      };
      return force;
    })();
    fg.d3Force('siblings', siblingForce);
  },

  showLabel(node, { activeId, isNeighbour, isMatch }) {
    return node.type === 'operation' || node.id === activeId || isNeighbour || isMatch;
  },

  labelPosition(node, r, gap) {
    const angle = Math.atan2(node.y, node.x);
    return {
      lx:    node.x + Math.cos(angle) * gap,
      ly:    node.y + Math.sin(angle) * gap,
      align: Math.cos(angle) >= 0 ? 'left' : 'right',
    };
  },

  cooldownTime: 4000,
  nodeLabel,
  idlePanel: IdlePanel,
  panel,
});
