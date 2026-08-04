# @pipeworx/lyrics-ovh

Lyrics OVH — quick song-lyrics lookup. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `lyrics(artist, title)` — exact-name lookup, returns the lyrics text
- `suggest(query, limit?)` — title/artist suggestions from the suggest index

## Data source

`https://api.lyrics.ovh`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "lyrics-ovh": {
      "url": "https://gateway.pipeworx.io/lyrics-ovh/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Lyrics Ovh data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
