// ─── @avatarfirst/agent-ui CLI ───────────────────────────────────────
// Usage: npx @avatarfirst/agent-ui --mcp

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createAgentUIServer } from './mcp/index.js'

const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
  console.log(`@avatarfirst/agent-ui — Interactive UI components for AI agents

Usage:
  npx @avatarfirst/agent-ui --mcp    Start MCP server (stdio transport)
  npx @avatarfirst/agent-ui --help   Show this help message

MCP Server:
  Registers 13 interactive UI tools (forms, cards, charts, tables, etc.)
  for use in Claude Desktop, ChatGPT, or any MCP client.

  Add to Claude Desktop config:
  {
    "mcpServers": {
      "agent-ui": {
        "command": "npx",
        "args": ["@avatarfirst/agent-ui", "--mcp"]
      }
    }
  }

Learn more: https://github.com/AvatarFirst/agent-ui`)
  process.exit(0)
}

if (args.includes('--mcp')) {
  const server = createAgentUIServer()
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('@avatarfirst/agent-ui MCP server running on stdio')
} else {
  console.error('Unknown command. Use --mcp to start the MCP server or --help for usage.')
  process.exit(1)
}
