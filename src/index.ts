interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Lyrics OVH MCP — keyless lyrics lookup.
 *
 * Endpoints:
 *   GET /v1/<artist>/<title>           → { lyrics }
 *   GET /suggest/<query>               → { data: [...] }
 */


const BASE = 'https://api.lyrics.ovh';
const UA = 'pipeworx-mcp-lyrics-ovh/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'lyrics',
    description: 'Exact-name lookup. Returns the lyrics text for an (artist, title) pair.',
    inputSchema: {
      type: 'object',
      properties: {
        artist: { type: 'string', description: 'e.g. "Coldplay"' },
        title: { type: 'string', description: 'e.g. "Yellow"' },
      },
      required: ['artist', 'title'],
    },
  },
  {
    name: 'suggest',
    description: 'Title/artist suggestions for a free-form query (results have track + artist info).',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number', description: '1-50 (default 10)' },
      },
      required: ['query'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'lyrics': {
      const artist = reqStr(args, 'artist', '"Coldplay"');
      const title = reqStr(args, 'title', '"Yellow"');
      const path = `/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
      const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
      if (res.status === 404) throw new Error(`Lyrics not found for "${artist} — ${title}". Try /suggest first.`);
      if (!res.ok) throw new Error(`Lyrics OVH: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
      return res.json();
    }
    case 'suggest': {
      const q = reqStr(args, 'query', '"yellow coldplay"');
      const limit = Math.min(50, Math.max(1, (args.limit as number) ?? 10));
      const res = await fetch(`${BASE}/suggest/${encodeURIComponent(q)}`, {
        headers: { Accept: 'application/json', 'User-Agent': UA },
      });
      if (!res.ok) throw new Error(`Lyrics OVH suggest: ${res.status}`);
      const json = (await res.json()) as { data?: unknown[]; total?: number };
      return { total: json.total ?? 0, data: (json.data ?? []).slice(0, limit) };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
