const DATA_REPO = 'gazelle-cloud/data';
const BASE_PATH = 'knowledge-graph';

const TOKEN = import.meta.env.GITHUB_TOKEN;
const headers: HeadersInit = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};

async function fetchCategory(category: string, type: string): Promise<any[]> {
  const res = await fetch(
    `https://api.github.com/repos/${DATA_REPO}/contents/${BASE_PATH}/${category}`,
    { headers },
  );
  const listing: any[] = await res.json();
  if (!Array.isArray(listing)) return [];
  return Promise.all(
    listing
      .filter((f: any) => f.type === 'file' && f.name.endsWith('.json'))
      .map((f: any) => fetch(f.download_url, { headers }).then(r => r.json()).then((obj: any) => ({ ...obj, type }))),
  );
}

function deriveGraph(entities: any[], edgeFields: Record<string, string[]>) {
  const nodeMap = new Map<string, any>();
  for (const e of entities) nodeMap.set(e.id, e);

  const links: any[] = [];

  for (const entity of entities) {
    const fields = edgeFields[entity.type] ?? [];
    for (const field of fields) {
      const value = entity[field];
      if (!value) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          const targetId = typeof item === 'string' ? item : item.id;
          const note     = typeof item === 'object' ? item.note : undefined;
          if (!nodeMap.has(targetId)) continue;
          links.push({ source: entity.id, target: targetId, relationship: 'related', note });
        }
      }
    }
  }

  const ids = new Set(nodeMap.keys());
  return {
    nodes: [...nodeMap.values()],
    links: links.filter(l => ids.has(l.source) && ids.has(l.target)),
  };
}

export async function GET() {
  const [principles, decisions] = await Promise.all([
    fetchCategory('guiding-principles', 'guiding-principle'),
    fetchCategory('decisions', 'decision'),
  ]);

  const graph = deriveGraph([...principles, ...decisions], {
    'guiding-principle': ['decisions'],
    'decision':          ['links'],
  });

  return new Response(JSON.stringify(graph), {
    headers: { 'Content-Type': 'application/json' },
  });
}
