# @avatarfirst/agent-ui

> Interactive UI components for AI agents — forms, cards, charts, tables, and more.

AI agents respond with text. But users expect forms, lists, charts. This library gives your agent **13 pre-built interactive UI components**. One `npm install`. Works everywhere.

## Quick Start

```bash
npm install @avatarfirst/agent-ui
```

```typescript
import { showForm } from '@avatarfirst/agent-ui'

const result = showForm({
  title: 'Shipping Address',
  fields: [
    { name: 'street', label: 'Street', required: true },
    { name: 'city', label: 'City', required: true },
    { name: 'zip', label: 'ZIP Code', type: 'number' },
  ],
})
// result.html  → self-contained HTML for MCP Apps iframe
// result.text  → "Shipping Address\nFields:\n  - Street (required)..."
// result.type  → 'form'
// result.data  → { title: 'Shipping Address', fields: [...] }
```

## Components

| Function | Purpose | User Response |
|----------|---------|---------------|
| `showCardList()` | Display items as selectable cards | `{ intent: 'card_select', data: { id, label, index } }` |
| `showForm()` | Collect user input with validation | `{ intent: 'form_submit', data: { ...fieldValues } }` |
| `showConfirm()` | Yes/no confirmation dialog | `{ intent: 'confirm', data: { confirmed: true } }` |
| `showChart()` | Bar, line, or pie chart | Display only |
| `showTable()` | Sortable tabular data | `{ intent: 'table_sort', data: { column, direction } }` |
| `showCalendar()` | Date/time slot picker | `{ intent: 'calendar_select', data: { date, time } }` |
| `showDetail()` | Single entity with metadata | `{ intent: 'detail_action', data: { action } }` |
| `showProgress()` | Step-by-step tracker | Display only |
| `showComparison()` | Side-by-side items | `{ intent: 'comparison_select', data: { name, index } }` |
| `showFileUpload()` | File upload zone | `{ intent: 'file_upload', data: { files } }` |
| `showMap()` | Locations on map | Display only |
| `showMedia()` | Video, audio, or image | Display only |
| `showRichText()` | Markdown content | Display only |

## Works With

- **Claude Desktop** (MCP server)
- **ChatGPT** (MCP server)
- **Claude Agent SDK**
- **Vercel AI SDK**
- **LangChain / LangGraph**
- **Any custom agent app**
- **React, Vue, vanilla JS**

## Usage by Framework

### MCP Server (Claude Desktop / ChatGPT)

```bash
npx @avatarfirst/agent-ui --mcp
```

Or add to Claude Desktop config:

```json
{
  "mcpServers": {
    "agent-ui": {
      "command": "npx",
      "args": ["@avatarfirst/agent-ui", "--mcp"]
    }
  }
}
```

### Programmatic MCP Server

```typescript
import { createAgentUIServer } from '@avatarfirst/agent-ui/mcp'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = createAgentUIServer()
const transport = new StdioServerTransport()
await server.connect(transport)
```

### React

```tsx
import { Form, CardList, Confirm, Chart, Table } from '@avatarfirst/agent-ui/react'

function MyAgent() {
  return (
    <Form
      data={{
        title: 'Contact Info',
        fields: [
          { name: 'name', label: 'Name', required: true },
          { name: 'email', label: 'Email', type: 'email' },
        ],
      }}
      onIntent={(intent) => console.log(intent)}
      onDismiss={() => console.log('dismissed')}
    />
  )
}
```

### Core API (Framework-Agnostic)

```typescript
import { showCardList, showForm, showConfirm } from '@avatarfirst/agent-ui'

// Each returns { html, text, type, data }
const menu = showCardList({
  title: 'Menu',
  items: [
    { label: 'Pizza', price: 12.99, icon: '🍕' },
    { label: 'Salad', price: 9.99, icon: '🥗' },
  ],
})

// Use menu.html for UI rendering
// Use menu.text for non-UI clients
```

## User Intent Protocol

When users interact with components, responses come as structured JSON:

```typescript
{ intent: 'card_select', data: { id: 'item-1', label: 'Pizza', index: 0 } }
{ intent: 'form_submit', data: { name: 'John', email: 'j@example.com' } }
{ intent: 'confirm', data: { confirmed: true } }
{ intent: 'calendar_select', data: { date: '2024-03-15', time: '10:00 AM' } }
```

Parse intents with the built-in parser:

```typescript
import { parseIntent } from '@avatarfirst/agent-ui'

const intent = parseIntent(userMessage)
if (intent.intent === 'form_submit') {
  // intent.data contains the form values
}
```

## License

MIT
