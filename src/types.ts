// ─── @avatarfirst/agent-ui — Core Types ───────────────────────────────
// Extracted from AFAP v1 spec + platform extensions.
// These define the shape of every UI component's data.

// ─── Container Types ──────────────────────────────────────────────────

export type ContainerType =
  | 'form'
  | 'card_list'
  | 'detail'
  | 'confirm'
  | 'calendar'
  | 'chart'
  | 'progress'
  | 'comparison'
  | 'file_upload'
  | 'map'
  | 'media'
  | 'rich_text'
  | 'table'

export const CONTAINER_TYPES: ContainerType[] = [
  'form', 'card_list', 'detail', 'confirm', 'calendar',
  'chart', 'progress', 'comparison', 'file_upload',
  'map', 'media', 'rich_text', 'table',
]

export function isValidContainerType(type: string): type is ContainerType {
  return CONTAINER_TYPES.includes(type as ContainerType)
}

// ─── Form ─────────────────────────────────────────────────────────────

export interface FormField {
  name: string
  label: string
  type?: 'text' | 'email' | 'textarea' | 'select' | 'number'
  placeholder?: string
  options?: string[]
  required?: boolean
}

export interface FormContainerData {
  title?: string
  fields: FormField[]
  submitLabel?: string
}

// ─── Card List ────────────────────────────────────────────────────────

export interface CardListItem {
  id?: string
  label: string
  description?: string
  value?: string
  icon?: string
  price?: number
}

export interface CardListContainerData {
  title?: string
  description?: string
  items: CardListItem[]
}

// ─── Detail Card ──────────────────────────────────────────────────────

export interface DetailContainerData {
  title?: string
  body?: string
  image?: string
  metadata?: Record<string, string>
  actions?: { label: string }[]
}

// ─── Confirm ──────────────────────────────────────────────────────────

export interface ConfirmContainerData {
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  icon?: string
}

// ─── Calendar ─────────────────────────────────────────────────────────

export interface TimeSlot {
  date: string
  time: string
  available?: boolean
}

export interface CalendarContainerData {
  title?: string
  available_slots: TimeSlot[]
}

// ─── Chart ────────────────────────────────────────────────────────────

export interface ChartSeries {
  label: string
  value: number
  color?: string
}

export interface ChartContainerData {
  title?: string
  type?: 'bar' | 'line' | 'pie'
  series: ChartSeries[]
}

// ─── Progress ─────────────────────────────────────────────────────────

export interface ProgressStep {
  label: string
  completed: boolean
  active?: boolean
}

export interface ProgressContainerData {
  title?: string
  steps: ProgressStep[]
}

// ─── Comparison ───────────────────────────────────────────────────────

export interface ComparisonItem {
  name: string
  attributes: Record<string, string | number>
}

export interface ComparisonContainerData {
  title?: string
  items: ComparisonItem[]
}

// ─── File Upload ──────────────────────────────────────────────────────

export interface FileUploadContainerData {
  title?: string
  accept?: string[]
  max_size?: number
  multiple?: boolean
}

// ─── Map ──────────────────────────────────────────────────────────────

export interface MapLocation {
  lat: number
  lng: number
  label?: string
}

export interface MapContainerData {
  title?: string
  locations: MapLocation[]
}

// ─── Media ────────────────────────────────────────────────────────────

export interface MediaContainerData {
  title?: string
  url: string
  type?: 'video' | 'audio' | 'image'
  alt?: string
  autoplay?: boolean
}

// ─── Rich Text ────────────────────────────────────────────────────────

export interface RichTextContainerData {
  title?: string
  content: string
}

// ─── Table ────────────────────────────────────────────────────────────

export interface TableContainerData {
  title?: string
  columns: string[]
  rows: string[][]
}

// ─── Container Data Map ───────────────────────────────────────────────

export interface ContainerDataMap {
  form: FormContainerData
  card_list: CardListContainerData
  detail: DetailContainerData
  confirm: ConfirmContainerData
  calendar: CalendarContainerData
  chart: ChartContainerData
  progress: ProgressContainerData
  comparison: ComparisonContainerData
  file_upload: FileUploadContainerData
  map: MapContainerData
  media: MediaContainerData
  rich_text: RichTextContainerData
  table: TableContainerData
}

// ─── Agent UI Result ──────────────────────────────────────────────────

export interface AgentUIResult<T extends ContainerType = ContainerType> {
  type: T
  data: ContainerDataMap[T]
  html: string
  text: string
}
