import { mount } from '/engine.js';
import { forceCollide, forceX, forceY } from 'https://esm.sh/d3-force';
import { PALETTE, RENDER, FONT_MONO, linkEnds } from '/shell.js';
import React from 'react';

// ── syntax highlighters ───────────────────────────────────────────────────────
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightJobs(src) {
  return src.split('\n').map(line => {
    if (line.startsWith('job:')) {
      const label = esc(line.slice(4).trim());
      return `<span style="color:#3dba7f;font-weight:600">job</span><span style="color:#94a3b8">:</span> <span style="color:#e2e8f0">${label}</span>`;
    }
    return `<span style="color:#64748b">${esc(line)}</span>`;
  }).join('\n');
}

const BICEP_KEYWORDS = new Set([
  'module','resource','param','var','output','for','in','if','existing',
  'scope','params','targetScope','name','type','import','using','dependsOn',
]);
const BICEP_TYPES = new Set(['string','int','bool','object','array']);

function highlightBicep(src) {
  const code = src.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  let out = '', i = 0;
  while (i < code.length) {
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const chunk = end === -1 ? code.slice(i) : code.slice(i, end);
      out += `<span style="color:#4b5563">${esc(chunk)}</span>`;
      i += chunk.length; continue;
    }
    if (code[i] === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== "'") j++;
      j++;
      out += `<span style="color:#86efac">${esc(code.slice(i, j))}</span>`;
      i = j; continue;
    }
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i;
      while (j < code.length && /\w/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (BICEP_KEYWORDS.has(word))
        out += `<span style="color:#f0a500;font-weight:600">${esc(word)}</span>`;
      else if (BICEP_TYPES.has(word))
        out += `<span style="color:#38bdf8">${esc(word)}</span>`;
      else
        out += esc(word);
      i = j; continue;
    }
    out += esc(code[i]); i++;
  }
  return out;
}

// ── idle panel ────────────────────────────────────────────────────────────────
function IdlePanel({ theme }) {
  return React.createElement('div', {
    className: 'corner-panel' + (theme === 'light' ? ' light' : ''),
  },
    React.createElement('h1', { style: { margin: '0 0 12px', padding: 0, fontSize: 16, fontWeight: 400, lineHeight: 1.3, color: '#fff' } },
      'BigBang'),
    React.createElement('p', { style: { margin: '0 0 14px', fontSize: 14, color: 'rgba(155,175,215,0.75)', letterSpacing: '0.03em' } },
      'Explore platform deployment workflows'),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        'This graph shows how each platform capability is deployed end-to-end — independently, from nothing to production-ready.'),
      React.createElement('hr', { style: { border: 'none', borderTop: '1px solid rgba(155,175,215,0.15)', margin: '4px 0' } }),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.ENTRY } }, 'Yellow'), ' = GitHub workflows'),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.CONNECTOR } }, 'Green'), ' = main Bicep'),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        React.createElement('span', { style: { color: PALETTE.LEAF } }, 'Blue'), ' = Bicep modules'),
      React.createElement('hr', { style: { border: 'none', borderTop: '1px solid rgba(155,175,215,0.15)', margin: '4px 0' } }),
      React.createElement('p', { className: 'info-text', style: { margin: 0 } },
        'This entire platform, code and knowledge graph included, is on ',
        React.createElement('a', {
          href: 'https://github.com/orgs/gazelle-cloud/',
          target: '_blank', rel: 'noopener noreferrer',
          style: { color: 'rgba(155,175,215,0.85)', textDecoration: 'none', borderBottom: '1px solid rgba(155,175,215,0.3)' },
        }, 'GitHub'), '.'),
    ),
  );
}

// ── panel ─────────────────────────────────────────────────────────────────────
const REL_COLORS = {
  implements: 'rgba(61,186,127,0.7)',
  calls:      'rgba(192,132,252,0.7)',
  deploys:    'rgba(240,165,0,0.7)',
  uses:       'rgba(78,142,247,0.7)',
};

function panel(node) {
  const children = [];

  if (node.description) children.push(
    React.createElement('div', { key: 'dl', className: 'info-label' }, 'Description'),
    React.createElement('p',   { key: 'dv', className: 'info-text' }, node.description),
  );

  if (node.jobs) children.push(
    React.createElement('div', { key: 'jl', className: 'info-label' }, 'Jobs'),
    React.createElement('pre', { key: 'jv', className: 'code-block',
      dangerouslySetInnerHTML: { __html: highlightJobs(node.jobs) } }),
  );

  if (node.path) children.push(
    React.createElement('div', { key: 'pl', className: 'info-label' }, 'Path'),
    React.createElement('p', { key: 'pv', className: 'info-text',
      style: { fontFamily: FONT_MONO, fontSize: 11, wordBreak: 'break-all' } }, node.path),
  );

  if (node.snippet) children.push(
    React.createElement('div', { key: 'sl', className: 'info-label' }, 'Snippet'),
    React.createElement('pre', { key: 'sv', className: 'code-block',
      dangerouslySetInnerHTML: { __html: highlightBicep(node.snippet) } }),
  );

  if (node.inputs) children.push(
    React.createElement('div', { key: 'inl', className: 'info-label' }, 'Inputs'),
    React.createElement('pre', { key: 'inv', className: 'code-block',
      dangerouslySetInnerHTML: { __html: highlightBicep(node.inputs) } }),
  );

  return React.createElement(React.Fragment, null, ...children);
}

// ── layout constants ──────────────────────────────────────────────────────────
const WF_ORDER = [
  'template-GitHub-environment-variables',
  'template-Management-Groups',
  'template-access-control',
  'template-Azure-Policy',
  'template-push-Docker-images',
  'template-trigger-landingzone-workflows',
  'template-landing-zones',
];
const WF_SPACING = 130;
const WF_OFFSET  = (WF_ORDER.length - 1) / 2 * WF_SPACING;

// ── page config ───────────────────────────────────────────────────────────────
mount({
  activeHref: '/bigbang/',
  localJson:  '/bigbang.json',

  types: {
    'github-workflow': { palette: 'ENTRY',     label: 'github-workflows' },
    'main-bicep':      { palette: 'CONNECTOR', label: 'main-bicep'       },
    'bicep-module':    { palette: 'LEAF',      label: 'bicep-modules'    },
  },

  dotRadius: node => {
    if (node.type === 'github-workflow') return 5;
    if (node.type === 'main-bicep')      return 4 + node.__weight * 5;
    return 2 + node.__weight * 5;
  },

  prepare(raw) {
    WF_ORDER.forEach((id, i) => {
      const node = raw.nodes.find(n => n.id === id);
      if (node) node.__xTarget = i * WF_SPACING - WF_OFFSET;
    });

    const wfChildren = {};
    raw.links.forEach(l => {
      const [s, t] = linkEnds(l);
      const src = raw.nodes.find(n => n.id === s);
      const tgt = raw.nodes.find(n => n.id === t);
      if (src?.type === 'github-workflow' && tgt?.type === 'main-bicep')
        (wfChildren[src.id] = wfChildren[src.id] ?? []).push(tgt);
    });
    Object.entries(wfChildren).forEach(([wfId, entries]) => {
      const wf = raw.nodes.find(n => n.id === wfId);
      const baseX = wf?.__xTarget ?? 0;
      entries.forEach((n, i) => {
        const offset = entries.length > 1 ? (i - (entries.length - 1) / 2) * 35 : 0;
        n.__xTarget = baseX + offset;
      });
    });
    raw.links.forEach(l => {
      const [s, t] = linkEnds(l);
      const src = raw.nodes.find(n => n.id === s);
      const tgt = raw.nodes.find(n => n.id === t);
      if (src?.type === 'main-bicep' && tgt?.type === 'bicep-module' && tgt.__xTarget == null)
        tgt.__xTarget = src.__xTarget ?? 0;
    });
    raw.nodes.forEach(n => {
      if (n.type === 'github-workflow') { n.fx = n.__xTarget ?? 0; n.fy = 220; }
    });
  },

  forces(fg) {
    fg.d3Force('link')
      .distance(l => l.source?.type === 'github-workflow' ? 25 : 70)
      .strength(0.4);
    fg.d3Force('collision', forceCollide(n =>
      n.type === 'bicep-module'
        ? (2 + n.__weight * 5) + 60
        : (n.type === 'main-bicep' ? 4 + n.__weight * 5 : 5) + 5));
    fg.d3Force('y-tier', forceY(n => {
      if (n.type === 'github-workflow') return 220;
      if (n.type === 'main-bicep')      return 140;
      return 0;
    }).strength(n => {
      if (n.type === 'github-workflow') return 0.8;
      if (n.type === 'main-bicep')      return 0.5;
      return 0;
    }));
    fg.d3Force('x-stem', forceX(n => n.__xTarget ?? 0)
      .strength(n =>
        n.type === 'github-workflow' ? 0.8
        : n.type === 'main-bicep'    ? 0.6
        : n.type === 'bicep-module'  ? 0.3
        : 0));
  },

  showLabel(node, { activeId, isNeighbour, isMatch }) {
    return node.type === 'github-workflow' || node.id === activeId || isNeighbour || isMatch;
  },

  labelPosition(node, r, gap, globalScale) {
    if (node.type === 'github-workflow') {
      return { lx: node.x, ly: node.y + gap + 11 / globalScale, align: 'center' };
    }
    return { lx: node.x + gap, ly: node.y, align: 'left' };
  },

  nodeLabel: node => node.label ?? node.id.replaceAll('-', ' '),

  linkColor(l, { activeId }) {
    if (!activeId) {
      const base = REL_COLORS[l.relationship];
      return base ? base.replace('0.7', '0.28') : 'rgba(180,195,225,0.25)';
    }
    const [s, t] = linkEnds(l);
    return (s === activeId || t === activeId)
      ? REL_COLORS[l.relationship] ?? 'rgba(255,255,255,0.85)'
      : 'rgba(180,180,180,0.04)';
  },

  idlePanel: IdlePanel,
  panel,
});
