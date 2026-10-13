import { DATA_REPO, BASE_PATH } from '../data';

function toTitle(id: string) {
  return id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Shared tail — every entity carries some subset of these.
function renderTail(obj: any, lines: string[]) {
  if (obj.anchor)             { lines.push('', `Anchor: ${obj.anchor}`); }
  if (obj.implements?.length) { lines.push('', 'Implements:', ...[].concat(obj.implements).map((i: string) => `- ${i}`)); }
  if (obj.links?.length)      { lines.push('', 'Links:', ...obj.links.map((l: any) =>
                                  `- ${l.target} (${l.relation})${l.note ? `: ${l.note}` : ''}`)); }
  if (obj.violations?.length) { lines.push('', 'Violations:', ...obj.violations.map((v: string) => `- ${v}`)); }
  if (obj.files?.length)      { lines.push('', 'Files:', ...obj.files.map((f: string) => `- ${f}`)); }
}

function renderFoundation(obj: any): string {
  const lines = [`# ${toTitle(obj.id)}`, '', `Intent: ${obj.intent}`];
  renderTail(obj, lines);
  return lines.join('\n');
}

function renderConstitutive(obj: any): string {
  const lines = [`# ${toTitle(obj.id)}`, '', `Rule: ${obj.rule}`];
  if (obj.subject?.term) { lines.push('', `Subject: ${obj.subject.term} (${obj.subject.type})`); }
  renderTail(obj, lines);
  return lines.join('\n');
}

function renderRegulative(obj: any): string {
  const lines = [`# ${toTitle(obj.id)}`, '', `Decision: ${obj.decision}`, '', `Why: ${obj.why}`];
  if (obj.trigger?.length) { lines.push('', `Triggers: ${obj.trigger.join(', ')}`); }
  if (obj.workflow)        { lines.push('', `Workflow: ${obj.workflow}`); }
  if (obj.steps?.length)   { lines.push('', 'Steps:', ...obj.steps.map((s: string, i: number) => `${i + 1}. ${s}`)); }
  renderTail(obj, lines);
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
  const [foundations, constitutive, regEntity, regProcess] = await Promise.all([
    fetchCategory('foundations'),
    fetchCategory('constitutive'),
    fetchCategory('regulative-entity'),
    fetchCategory('regulative-process'),
  ]);

  const sep = (heading: string) =>
    `===============================================================================\n  ${heading}\n===============================================================================\n`;

  const lines: string[] = [
    sep('Foundations'),
    ...foundations.map(renderFoundation),
    sep('Constitutive Rules'),
    ...constitutive.map(renderConstitutive),
    sep('Regulative Rules — Entities'),
    ...regEntity.map(renderRegulative),
    sep('Regulative Rules — Processes'),
    ...regProcess.map(renderRegulative),
  ];

  // Blank line between blocks — entries otherwise run straight into each other.
  return new Response(lines.join('\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
