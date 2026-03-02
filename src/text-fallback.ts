// ─── @avatarfirst/agent-ui — Text Fallback System ────────────────────
// Converts any container data to readable plain text.
// Used by MCP tools so non-UI clients still get useful output.

import type {
  ContainerType,
  ContainerDataMap,
  FormContainerData,
  CardListContainerData,
  DetailContainerData,
  ConfirmContainerData,
  CalendarContainerData,
  ChartContainerData,
  ProgressContainerData,
  ComparisonContainerData,
  FileUploadContainerData,
  MapContainerData,
  MediaContainerData,
  RichTextContainerData,
  TableContainerData,
} from './types.js'

export function toTextFallback<T extends ContainerType>(
  type: T,
  data: ContainerDataMap[T]
): string {
  const fn = TEXT_FALLBACKS[type]
  if (!fn) return JSON.stringify(data, null, 2)
  return fn(data as never)
}

const TEXT_FALLBACKS: {
  [K in ContainerType]: (data: ContainerDataMap[K]) => string
} = {
  form(data: FormContainerData) {
    const title = data.title || 'Form'
    const fieldLines = (data.fields || []).map(
      f => `  - ${f.label}${f.required ? ' (required)' : ''}${f.type ? ` [${f.type}]` : ''}`
    )
    return `${title}\nFields:\n${fieldLines.join('\n')}\n[${data.submitLabel || 'Submit'}]`
  },

  card_list(data: CardListContainerData) {
    const title = data.title || 'Items'
    const lines = (data.items || []).map(
      (item, i) => `${i + 1}. ${item.label}${item.value ? ` — ${item.value}` : ''}${item.price != null ? ` — $${item.price.toFixed(2)}` : ''}${item.description ? ` (${item.description})` : ''}`
    )
    return `${title}\n${lines.join('\n')}`
  },

  detail(data: DetailContainerData) {
    const parts = [data.title || 'Details']
    if (data.body) parts.push(data.body)
    if (data.metadata) {
      const metaLines = Object.entries(data.metadata).map(([k, v]) => `  ${k}: ${v}`)
      parts.push(metaLines.join('\n'))
    }
    if (data.actions?.length) {
      parts.push(`Actions: ${data.actions.map(a => a.label).join(', ')}`)
    }
    return parts.join('\n')
  },

  confirm(data: ConfirmContainerData) {
    return `${data.title || 'Confirm'}: ${data.message}\n[${data.cancelLabel || 'Cancel'}] [${data.confirmLabel || 'Confirm'}]`
  },

  calendar(data: CalendarContainerData) {
    const title = data.title || 'Available Slots'
    const slots = (data.available_slots || [])
      .filter(s => s.available !== false)
      .map(s => `  ${s.date} at ${s.time}`)
    return `${title}\n${slots.join('\n')}`
  },

  chart(data: ChartContainerData) {
    const title = data.title || 'Chart'
    const type = data.type || 'bar'
    const lines = (data.series || []).map(
      s => `  ${s.label}: ${s.value}`
    )
    return `${title} (${type} chart)\n${lines.join('\n')}`
  },

  progress(data: ProgressContainerData) {
    const title = data.title || 'Progress'
    const steps = (data.steps || []).map(
      s => `  ${s.completed ? '[x]' : s.active ? '[>]' : '[ ]'} ${s.label}`
    )
    return `${title}\n${steps.join('\n')}`
  },

  comparison(data: ComparisonContainerData) {
    const title = data.title || 'Comparison'
    const items = (data.items || []).map(item => {
      const attrs = Object.entries(item.attributes).map(([k, v]) => `    ${k}: ${v}`).join('\n')
      return `  ${item.name}\n${attrs}`
    })
    return `${title}\n${items.join('\n')}`
  },

  file_upload(data: FileUploadContainerData) {
    const title = data.title || 'Upload File'
    const parts = [title]
    if (data.accept?.length) parts.push(`Accepted: ${data.accept.join(', ')}`)
    if (data.max_size) parts.push(`Max size: ${(data.max_size / 1024 / 1024).toFixed(1)}MB`)
    if (data.multiple) parts.push('Multiple files allowed')
    return parts.join('\n')
  },

  map(data: MapContainerData) {
    const title = data.title || 'Map'
    const locs = (data.locations || []).map(
      l => `  ${l.label || 'Location'}: ${l.lat}, ${l.lng}`
    )
    return `${title}\n${locs.join('\n')}`
  },

  media(data: MediaContainerData) {
    const title = data.title || 'Media'
    return `${title}\n${data.type || 'media'}: ${data.url}${data.alt ? ` (${data.alt})` : ''}`
  },

  rich_text(data: RichTextContainerData) {
    const title = data.title || 'Content'
    return `${title}\n${data.content || ''}`
  },

  table(data: TableContainerData) {
    const title = data.title || 'Table'
    const header = (data.columns || []).join(' | ')
    const rows = (data.rows || []).map(r => r.join(' | '))
    return `${title}\n${header}\n${'-'.repeat(header.length)}\n${rows.join('\n')}`
  },
}
