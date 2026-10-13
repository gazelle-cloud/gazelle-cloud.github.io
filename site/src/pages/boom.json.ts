import { loadBoom } from '../boom-data';

// The map (nodes, links) plus every relation for the info panel.
export async function GET() {
  const { graph, relations } = await loadBoom();
  return new Response(JSON.stringify({ ...graph, relations }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
