// ─── @avatarfirst/agent-ui — Intent Protocol ─────────────────────────
// Defines the structured responses users send back when interacting
// with UI components. Every intent returns JSON with { intent, data }.

export type StandardIntent =
  | 'form_submit'
  | 'form_cancel'
  | 'card_select'
  | 'confirm'
  | 'calendar_select'
  | 'file_upload'
  | 'table_sort'
  | 'detail_action'
  | 'comparison_select'
  | 'dismiss'

export interface UserIntentResponse<T = Record<string, unknown>> {
  intent: string
  data: T
}

// ─── Intent Data Shapes ───────────────────────────────────────────────

export interface FormSubmitData {
  [fieldName: string]: string | number | boolean
}

export interface CardSelectData {
  id: string
  label: string
  index: number
}

export interface ConfirmData {
  confirmed: boolean
}

export interface CalendarSelectData {
  date: string
  time: string
}

export interface FileUploadData {
  files: { name: string; size: number; type: string }[]
}

export interface TableSortData {
  column: string
  direction: 'asc' | 'desc'
}

export interface DetailActionData {
  action: string
}

export interface ComparisonSelectData {
  name: string
  index: number
}

// ─── Intent Data Map ──────────────────────────────────────────────────

export interface IntentDataMap {
  form_submit: FormSubmitData
  form_cancel: Record<string, never>
  card_select: CardSelectData
  confirm: ConfirmData
  calendar_select: CalendarSelectData
  file_upload: FileUploadData
  table_sort: TableSortData
  detail_action: DetailActionData
  comparison_select: ComparisonSelectData
  dismiss: Record<string, never>
}

// ─── Type-safe intent parser ──────────────────────────────────────────

export function parseIntent(raw: string): UserIntentResponse {
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.intent === 'string' && typeof parsed.data === 'object') {
      return parsed as UserIntentResponse
    }
  } catch {
    // Not JSON — treat as plain text
  }
  return { intent: 'text', data: { message: raw } }
}
