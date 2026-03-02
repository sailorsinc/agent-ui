// ─── @avatarfirst/agent-ui — MCP Server Adapter ──────────────────────
// Registers all 13 UI components as MCP tools + resources.
// Usage: import { createAgentUIServer } from '@avatarfirst/agent-ui/mcp'

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import {
  showCardList,
  showForm,
  showConfirm,
  showChart,
  showTable,
  showCalendar,
  showDetail,
  showProgress,
  showComparison,
  showFileUpload,
  showMap,
  showMedia,
  showRichText,
} from '../index.js'

const MCP_APP_MIME = 'text/html;profile=mcp-app'
const URI_PREFIX = 'ui://agent-ui'

export interface AgentUIServerConfig {
  name?: string
  version?: string
}

export function createAgentUIServer(config?: AgentUIServerConfig): McpServer {
  const server = new McpServer({
    name: config?.name ?? 'agent-ui',
    version: config?.version ?? '1.0.0',
  })

  // ── Card List ──────────────────────────────────────────────────────

  server.resource('card-list-ui', `${URI_PREFIX}/card-list`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showCardList({ items: [] }).html }],
  }))

  server.tool(
    'show_card_list',
    'Display a list of items as interactive cards. Users can browse and select items.',
    {
      title: z.string().optional().describe('Title for the card list'),
      items: z.array(z.object({
        id: z.string().optional().describe('Unique item ID'),
        label: z.string().describe('Item name/title'),
        description: z.string().optional().describe('Item description'),
        value: z.string().optional().describe('Display value (e.g. price, status)'),
        icon: z.string().optional().describe('Emoji or icon character'),
        price: z.number().optional().describe('Price in dollars'),
      })).describe('Items to display as cards'),
    },
    async ({ title, items }) => {
      const result = showCardList({ title, items })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/card-list`, toolInput: { title, items } } },
      }
    }
  )

  // ── Form ───────────────────────────────────────────────────────────

  server.resource('form-ui', `${URI_PREFIX}/form`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showForm({ fields: [] }).html }],
  }))

  server.tool(
    'show_form',
    'Show a form to collect user input. Returns submitted data as structured JSON.',
    {
      title: z.string().optional().describe('Form title'),
      fields: z.array(z.object({
        name: z.string().describe('Field name (key in returned data)'),
        label: z.string().describe('Display label'),
        type: z.enum(['text', 'email', 'textarea', 'select', 'number']).default('text'),
        placeholder: z.string().optional(),
        options: z.array(z.string()).optional().describe('Options for select fields'),
        required: z.boolean().default(false),
      })).describe('Form fields'),
      submitLabel: z.string().optional().describe('Submit button text'),
    },
    async ({ title, fields, submitLabel }) => {
      const result = showForm({ title, fields, submitLabel })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/form`, toolInput: { title, fields, submitLabel } } },
      }
    }
  )

  // ── Confirm ────────────────────────────────────────────────────────

  server.resource('confirm-ui', `${URI_PREFIX}/confirm`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showConfirm({ message: '' }).html }],
  }))

  server.tool(
    'show_confirm',
    'Show a yes/no confirmation dialog. Returns whether the user confirmed or cancelled.',
    {
      title: z.string().optional().describe('Dialog title'),
      message: z.string().describe('Confirmation message'),
      confirmLabel: z.string().optional().describe('Confirm button text'),
      cancelLabel: z.string().optional().describe('Cancel button text'),
    },
    async ({ title, message, confirmLabel, cancelLabel }) => {
      const result = showConfirm({ title, message, confirmLabel, cancelLabel })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/confirm`, toolInput: { title, message, confirmLabel, cancelLabel } } },
      }
    }
  )

  // ── Chart ──────────────────────────────────────────────────────────

  server.resource('chart-ui', `${URI_PREFIX}/chart`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showChart({ series: [] }).html }],
  }))

  server.tool(
    'show_chart',
    'Display data as a bar, line, or pie chart.',
    {
      title: z.string().optional().describe('Chart title'),
      type: z.enum(['bar', 'line', 'pie']).default('bar').describe('Chart type'),
      series: z.array(z.object({
        label: z.string().describe('Data label'),
        value: z.number().describe('Data value'),
        color: z.string().optional().describe('Color hex code'),
      })).describe('Data series'),
    },
    async ({ title, type, series }) => {
      const result = showChart({ title, type, series })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/chart`, toolInput: { title, type, series } } },
      }
    }
  )

  // ── Table ──────────────────────────────────────────────────────────

  server.resource('table-ui', `${URI_PREFIX}/table`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showTable({ columns: [], rows: [] }).html }],
  }))

  server.tool(
    'show_table',
    'Display data in a sortable table.',
    {
      title: z.string().optional().describe('Table title'),
      columns: z.array(z.string()).describe('Column headers'),
      rows: z.array(z.array(z.string())).describe('Table rows (each row is an array of cell values)'),
    },
    async ({ title, columns, rows }) => {
      const result = showTable({ title, columns, rows })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/table`, toolInput: { title, columns, rows } } },
      }
    }
  )

  // ── Calendar ───────────────────────────────────────────────────────

  server.resource('calendar-ui', `${URI_PREFIX}/calendar`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showCalendar({ available_slots: [] }).html }],
  }))

  server.tool(
    'show_calendar',
    'Show a date/time slot picker. Users can select an available time slot.',
    {
      title: z.string().optional().describe('Calendar title'),
      available_slots: z.array(z.object({
        date: z.string().describe('Date string (e.g. "2024-03-15")'),
        time: z.string().describe('Time string (e.g. "10:00 AM")'),
        available: z.boolean().default(true).describe('Whether this slot is available'),
      })).describe('Available time slots'),
    },
    async ({ title, available_slots }) => {
      const result = showCalendar({ title, available_slots })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/calendar`, toolInput: { title, available_slots } } },
      }
    }
  )

  // ── Detail Card ────────────────────────────────────────────────────

  server.resource('detail-ui', `${URI_PREFIX}/detail`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showDetail({}).html }],
  }))

  server.tool(
    'show_detail',
    'Show a detailed view of a single item with metadata and optional actions.',
    {
      title: z.string().optional().describe('Detail title'),
      body: z.string().optional().describe('Description text'),
      image: z.string().optional().describe('Image URL'),
      metadata: z.record(z.string()).optional().describe('Key-value metadata'),
      actions: z.array(z.object({ label: z.string() })).optional().describe('Action buttons'),
    },
    async ({ title, body, image, metadata, actions }) => {
      const result = showDetail({ title, body, image, metadata, actions })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/detail`, toolInput: { title, body, image, metadata, actions } } },
      }
    }
  )

  // ── Progress ───────────────────────────────────────────────────────

  server.resource('progress-ui', `${URI_PREFIX}/progress`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showProgress({ steps: [] }).html }],
  }))

  server.tool(
    'show_progress',
    'Show a step-by-step progress tracker.',
    {
      title: z.string().optional().describe('Progress title'),
      steps: z.array(z.object({
        label: z.string().describe('Step label'),
        completed: z.boolean().describe('Whether step is completed'),
        active: z.boolean().optional().describe('Whether step is the current active step'),
      })).describe('Progress steps'),
    },
    async ({ title, steps }) => {
      const result = showProgress({ title, steps })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/progress`, toolInput: { title, steps } } },
      }
    }
  )

  // ── Comparison ─────────────────────────────────────────────────────

  server.resource('comparison-ui', `${URI_PREFIX}/comparison`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showComparison({ items: [] }).html }],
  }))

  server.tool(
    'show_comparison',
    'Show items side-by-side for comparison.',
    {
      title: z.string().optional().describe('Comparison title'),
      items: z.array(z.object({
        name: z.string().describe('Item name'),
        attributes: z.record(z.union([z.string(), z.number()])).describe('Key-value attributes to compare'),
      })).describe('Items to compare'),
    },
    async ({ title, items }) => {
      const result = showComparison({ title, items })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/comparison`, toolInput: { title, items } } },
      }
    }
  )

  // ── File Upload ────────────────────────────────────────────────────

  server.resource('file-upload-ui', `${URI_PREFIX}/file-upload`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showFileUpload({}).html }],
  }))

  server.tool(
    'show_file_upload',
    'Show a file upload zone with drag-and-drop support.',
    {
      title: z.string().optional().describe('Upload title'),
      accept: z.array(z.string()).optional().describe('Accepted file extensions (e.g. ["pdf", "png"])'),
      max_size: z.number().optional().describe('Maximum file size in bytes'),
      multiple: z.boolean().optional().describe('Allow multiple files'),
    },
    async ({ title, accept, max_size, multiple }) => {
      const result = showFileUpload({ title, accept, max_size, multiple })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/file-upload`, toolInput: { title, accept, max_size, multiple } } },
      }
    }
  )

  // ── Map ────────────────────────────────────────────────────────────

  server.resource('map-ui', `${URI_PREFIX}/map`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showMap({ locations: [] }).html }],
  }))

  server.tool(
    'show_map',
    'Show locations on a map.',
    {
      title: z.string().optional().describe('Map title'),
      locations: z.array(z.object({
        lat: z.number().describe('Latitude'),
        lng: z.number().describe('Longitude'),
        label: z.string().optional().describe('Location label'),
      })).describe('Locations to display'),
    },
    async ({ title, locations }) => {
      const result = showMap({ title, locations })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/map`, toolInput: { title, locations } } },
      }
    }
  )

  // ── Media ──────────────────────────────────────────────────────────

  server.resource('media-ui', `${URI_PREFIX}/media`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showMedia({ url: '' }).html }],
  }))

  server.tool(
    'show_media',
    'Show a video, audio, or image.',
    {
      title: z.string().optional().describe('Media title'),
      url: z.string().describe('Media URL'),
      type: z.enum(['video', 'audio', 'image']).default('image').describe('Media type'),
      alt: z.string().optional().describe('Alt text'),
      autoplay: z.boolean().optional().describe('Autoplay media'),
    },
    async ({ title, url, type, alt, autoplay }) => {
      const result = showMedia({ title, url, type, alt, autoplay })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/media`, toolInput: { title, url, type, alt, autoplay } } },
      }
    }
  )

  // ── Rich Text ──────────────────────────────────────────────────────

  server.resource('rich-text-ui', `${URI_PREFIX}/rich-text`, { mimeType: MCP_APP_MIME }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: MCP_APP_MIME, text: showRichText({ content: '' }).html }],
  }))

  server.tool(
    'show_rich_text',
    'Show formatted content with markdown support (headings, bold, code, links, etc.).',
    {
      title: z.string().optional().describe('Content title'),
      content: z.string().describe('Markdown content to display'),
    },
    async ({ title, content }) => {
      const result = showRichText({ title, content })
      return {
        content: [{ type: 'text' as const, text: result.text }],
        _meta: { ui: { resourceUri: `${URI_PREFIX}/rich-text`, toolInput: { title, content } } },
      }
    }
  )

  // ── Prompt: Agent UI Guide ─────────────────────────────────────────

  server.prompt(
    'agent-ui-guide',
    'Guide for using interactive UI components in agent responses',
    async () => ({
      messages: [{
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `When you need to present interactive UI to users, use these tools:

- Lists of items → show_card_list({ items: [...] })
- Collect user input → show_form({ fields: [...] })
- Yes/no decisions → show_confirm({ message: "..." })
- Data visualization → show_chart({ type: "bar", series: [...] })
- Tabular data → show_table({ columns: [...], rows: [...] })
- Date selection → show_calendar({ available_slots: [...] })
- Entity details → show_detail({ title, body, metadata })
- Step tracker → show_progress({ steps: [...] })
- Side-by-side → show_comparison({ items: [...] })
- File upload → show_file_upload({ accept: ["pdf"] })
- Map → show_map({ locations: [...] })
- Media → show_media({ url: "...", type: "video" })
- Rich content → show_rich_text({ content: "# Markdown..." })

User responses come back as structured JSON: { intent: "form_submit", data: { ... } }`,
        },
      }],
    })
  )

  return server
}
