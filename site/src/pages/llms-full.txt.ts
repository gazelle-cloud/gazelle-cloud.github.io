import { DATA_REPO, BASE_PATH } from '../data';

const BINARY_EXTS = new Set(['.dll', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.zip', '.woff', '.woff2', '.ttf', '.eot', '.otf', '.pdf']);

function isBinary(path: string) {
  const dot = path.lastIndexOf('.');
  return dot !== -1 && BINARY_EXTS.has(path.slice(dot).toLowerCase());
}

function toTitle(id: string) {
  return id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function renderGuidingPrinciple(obj: any): string {
  const lines = [`# ${toTitle(obj.id)}`, '', `Intent: ${obj.intent}`];
  if (obj.decisions?.length) { lines.push('', 'Decisions:', ...obj.decisions.map((d: string) => `- ${d}`)); }
  if (obj.violations?.length) { lines.push('', 'Violations:', ...obj.violations.map((v: string) => `- ${v}`)); }
  return lines.join('\n');
}

function renderDecision(obj: any): string {
  const lines = [`# ${toTitle(obj.id)}`, '', `Decision: ${obj.decision}`, '', `Why: ${obj.why}`];
  if (obj.links?.length)      { lines.push('', 'Related:', ...obj.links.map((l: any) => `- ${l.id}: ${l.note}`)); }
  if (obj.violations?.length) { lines.push('', 'Violations:', ...obj.violations.map((v: string) => `- ${v}`)); }
  if (obj.files?.length)      { lines.push('', 'Files:', ...obj.files.map((f: string) => `- ${f}`)); }
  return lines.join('\n');
}

function renderOperation(obj: any): string {
  const lines = [`# ${toTitle(obj.id)}`, '', `Intent: ${obj.intent}`];
  if (obj.triggers?.length)   { lines.push('', `Triggers: ${obj.triggers.join(', ')}`); }
  if (obj.prerequisite)       { lines.push('', `Prerequisite: ${obj.prerequisite}`); }
  if (obj.workflow)           { lines.push('', `Workflow: ${obj.workflow}`); }
  if (obj.decisions?.length)  { lines.push('', 'Decisions:', ...obj.decisions.map((d: string) => `- ${d}`)); }
  if (obj.steps?.length)      { lines.push('', 'Steps:', ...obj.steps.map((s: string, i: number) => `${i + 1}. ${s}`)); }
  if (obj.violations?.length) { lines.push('', 'Violations:', ...obj.violations.map((v: string) => `- ${v}`)); }
  if (obj.files?.length)      { lines.push('', 'Files:', ...obj.files.map((f: string) => `- ${f}`)); }
  return lines.join('\n');
}

const token = import.meta.env.GITHUB_TOKEN;
const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function fetchCategory(category: string): Promise<any[]> {
  const res = await fetch(`https://api.github.com/repos/${DATA_REPO}/contents/${BASE_PATH}/${category}`, { headers });
  const listing: any[] = await res.json();
  if (!Array.isArray(listing)) return [];
  return Promise.all(
    listing
      .filter((f: any) => f.type === 'file' && f.name.endsWith('.json'))
      .map((f: any) => fetch(f.download_url, { headers }).then(r => r.json())),
  );
}

export async function GET() {
  const [[principles, decisions, operations], treeRes] = await Promise.all([
    Promise.all([
      fetchCategory('guiding-principles'),
      fetchCategory('decisions'),
      fetchCategory('operations'),
    ]),
    fetch(`https://api.github.com/repos/${DATA_REPO}/git/trees/main?recursive=1`, { headers }),
  ]);

  const { tree } = await treeRes.json();
  const sourceFiles: string[] = tree
    .filter((e: any) => e.type === 'blob' && !isBinary(e.path))
    .map((e: any) => e.path);

  const sep = (heading: string) =>
    `===============================================================================\n  ${heading}\n===============================================================================\n`;

  const lines: string[] = [
    sep('Guiding Principles'),
    ...principles.map(renderGuidingPrinciple),
    sep('Decisions'),
    ...decisions.map(renderDecision),
    sep('Operations'),
    ...operations.map(renderOperation),
    sep('Source Code'),
    ...sourceFiles.map(p => `- [${p}](https://gazelle.cloud/source/${p})`),
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
