import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Boom's data, read at build time from constitution/ at the repo root (one
// level above site/). Shared by /boom.json, /boom/ and the per-rule pages.
const CONSTITUTION = resolve(process.cwd(), '..', 'constitution');
export const ROOT_ID = 'gazelle';

async function readCategory(category: string): Promise<any[]> {
  const dir = resolve(CONSTITUTION, category);
  const files = (await readdir(dir)).filter(f => f.endsWith('.json'));
  return Promise.all(files.map(async f => JSON.parse(await readFile(resolve(dir, f), 'utf-8'))));
}

// Mind map, not a dependency graph: gazelle → constitutive → regulative.
// Only `implements` is followed; anchors and cross-links are left out on purpose.
function deriveGraph(constitutive: any[], regEntity: any[], regProcess: any[]) {
  const pick = (r: any) => ({ id: r.id, rule: r.rule, decision: r.decision, why: r.why, steps: r.steps });

  const root  = constitutive.find(c => c.id === ROOT_ID);
  const terms = constitutive.filter(c => c.id !== ROOT_ID);
  const termIds = new Set(terms.map(c => c.id));

  const nodes: any[] = [
    ...(root ? [{ ...pick(root), type: 'root' }] : []),
    ...terms.map(c => ({ ...pick(c), type: 'constitutive' })),
  ];
  const links: any[] = terms.map(c => ({ source: ROOT_ID, target: c.id }));

  const regulative = [
    ...regEntity.map(r  => ({ ...pick(r), type: 'regulative', subjectType: 'entity',  parent: r.implements })),
    ...regProcess.map(r => ({ ...pick(r), type: 'regulative', subjectType: 'process', parent: r.implements })),
  ];
  for (const r of regulative) {
    if (!termIds.has(r.parent)) continue;   // dangling id kills the sim
    nodes.push(r);
    links.push({ source: r.parent, target: r.id });
  }

  return { nodes, links };
}

// Every entity and its relations (implements, cross-links), for the info panel —
// the map only draws gazelle → topic → rule. Anchors are left out.
function deriveRelations(constitutive: any[], regEntity: any[], regProcess: any[]) {
  const pick = (r: any) => ({ id: r.id, rule: r.rule, decision: r.decision, why: r.why, violations: r.violations });
  const nodes = [
    ...constitutive.map(c => ({ ...pick(c), type: 'constitutive' })),
    ...regEntity.map(r    => ({ ...pick(r), type: 'regulative' })),
    ...regProcess.map(r   => ({ ...pick(r), type: 'regulative' })),
  ];
  const raw   = [...constitutive, ...regEntity, ...regProcess];
  const ids   = new Set(nodes.map(n => n.id));
  const links: any[] = [];
  const add = (source: string, target: string, relationship: string, note?: string) => {
    if (source !== target && ids.has(source) && ids.has(target)) links.push({ source, target, relationship, note });
  };
  for (const n of raw) {
    ([] as string[]).concat(n.implements ?? []).forEach(t => add(n.id, t, 'implements'));
    (n.links ?? []).forEach((l: any) => add(n.id, l.target, l.relation ?? 'related', l.note));
  }
  return { nodes, links };
}

// graph: what the map draws. relations: what the info panel lists.
// sources: each entity's source file content, as-is, by id.
export async function loadBoom() {
  const [constitutive, regEntity, regProcess] = await Promise.all([
    readCategory('constitutive'),
    readCategory('regulative-entity'),
    readCategory('regulative-process'),
  ]);
  return {
    graph:     deriveGraph(constitutive, regEntity, regProcess),
    relations: deriveRelations(constitutive, regEntity, regProcess),
    sources:   new Map<string, any>([...constitutive, ...regEntity, ...regProcess].map(r => [r.id, r])),
  };
}
