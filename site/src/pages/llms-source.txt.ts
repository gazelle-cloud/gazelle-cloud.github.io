import { DATA_REPO } from '../data';

const BINARY_EXTS = new Set(['.dll', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.zip', '.woff', '.woff2', '.ttf', '.eot', '.otf', '.pdf']);

function isBinary(path: string) {
  const dot = path.lastIndexOf('.');
  return dot !== -1 && BINARY_EXTS.has(path.slice(dot).toLowerCase());
}

const token = import.meta.env.GITHUB_TOKEN;
const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

export async function GET() {
  const treeRes = await fetch(
    `https://api.github.com/repos/${DATA_REPO}/git/trees/main?recursive=1`,
    { headers },
  );
  const { tree } = await treeRes.json();

  const blobs = tree.filter((e: any) =>
    e.type === 'blob' &&
    !isBinary(e.path) &&
    !e.path.includes('ipmgmt') &&
    !e.path.startsWith('knowledge-graph/'),
  );

  const files = await Promise.all(
    blobs.map(async (e: any) => {
      const res = await fetch(e.url, { headers });
      const { content, encoding } = await res.json();
      const text = encoding === 'base64'
        ? Buffer.from(content.replace(/\n/g, ''), 'base64').toString('utf-8')
        : content;
      return { path: e.path, text };
    }),
  );

  const lines: string[] = [];
  for (const { path, text } of files) {
    lines.push(`## ${path}`, '', text.trimEnd(), '', '');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
