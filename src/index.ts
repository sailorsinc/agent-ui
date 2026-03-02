// ─── @avatarfirst/agent-ui ────────────────────────────────────────────
// Interactive UI components for AI agents.
// One npm install. Works with Claude, ChatGPT, Vercel AI, LangChain,
// and any agent framework.

export type {
  ContainerType,
  FormField,
  FormContainerData,
  CardListItem,
  CardListContainerData,
  DetailContainerData,
  ConfirmContainerData,
  TimeSlot,
  CalendarContainerData,
  ChartSeries,
  ChartContainerData,
  ProgressStep,
  ProgressContainerData,
  ComparisonItem,
  ComparisonContainerData,
  FileUploadContainerData,
  MapLocation,
  MapContainerData,
  MediaContainerData,
  RichTextContainerData,
  TableContainerData,
  ContainerDataMap,
  AgentUIResult,
} from './types.js'

export {
  CONTAINER_TYPES,
  isValidContainerType,
} from './types.js'

export type {
  StandardIntent,
  UserIntentResponse,
  FormSubmitData,
  CardSelectData,
  ConfirmData,
  CalendarSelectData,
  FileUploadData,
  TableSortData,
  DetailActionData,
  ComparisonSelectData,
  IntentDataMap,
} from './intents.js'

export { parseIntent } from './intents.js'

export { toTextFallback } from './text-fallback.js'

// ─── HTML Builders ────────────────────────────────────────────────────

export {
  buildCardListHTML,
  buildFormHTML,
  buildConfirmHTML,
  buildChartHTML,
  buildTableHTML,
  buildCalendarHTML,
  buildDetailHTML,
  buildProgressHTML,
  buildComparisonHTML,
  buildFileUploadHTML,
  buildMapHTML,
  buildMediaHTML,
  buildRichTextHTML,
} from './html-builders/index.js'

// ─── show*() Convenience API ──────────────────────────────────────────

import type { AgentUIResult } from './types.js'
import type {
  CardListContainerData,
  FormContainerData,
  ConfirmContainerData,
  ChartContainerData,
  TableContainerData,
  CalendarContainerData,
  DetailContainerData,
  ProgressContainerData,
  ComparisonContainerData,
  FileUploadContainerData,
  MapContainerData,
  MediaContainerData,
  RichTextContainerData,
} from './types.js'
import { toTextFallback } from './text-fallback.js'
import { buildCardListHTML } from './html-builders/card-list.js'
import { buildFormHTML } from './html-builders/form.js'
import { buildConfirmHTML } from './html-builders/confirm.js'
import { buildChartHTML } from './html-builders/chart.js'
import { buildTableHTML } from './html-builders/table.js'
import { buildCalendarHTML } from './html-builders/calendar.js'
import { buildDetailHTML } from './html-builders/detail.js'
import { buildProgressHTML } from './html-builders/progress.js'
import { buildComparisonHTML } from './html-builders/comparison.js'
import { buildFileUploadHTML } from './html-builders/file-upload.js'
import { buildMapHTML } from './html-builders/map.js'
import { buildMediaHTML } from './html-builders/media.js'
import { buildRichTextHTML } from './html-builders/rich-text.js'

export function showCardList(data: CardListContainerData): AgentUIResult<'card_list'> {
  return { type: 'card_list', data, html: buildCardListHTML(data), text: toTextFallback('card_list', data) }
}

export function showForm(data: FormContainerData): AgentUIResult<'form'> {
  return { type: 'form', data, html: buildFormHTML(data), text: toTextFallback('form', data) }
}

export function showConfirm(data: ConfirmContainerData): AgentUIResult<'confirm'> {
  return { type: 'confirm', data, html: buildConfirmHTML(data), text: toTextFallback('confirm', data) }
}

export function showChart(data: ChartContainerData): AgentUIResult<'chart'> {
  return { type: 'chart', data, html: buildChartHTML(data), text: toTextFallback('chart', data) }
}

export function showTable(data: TableContainerData): AgentUIResult<'table'> {
  return { type: 'table', data, html: buildTableHTML(data), text: toTextFallback('table', data) }
}

export function showCalendar(data: CalendarContainerData): AgentUIResult<'calendar'> {
  return { type: 'calendar', data, html: buildCalendarHTML(data), text: toTextFallback('calendar', data) }
}

export function showDetail(data: DetailContainerData): AgentUIResult<'detail'> {
  return { type: 'detail', data, html: buildDetailHTML(data), text: toTextFallback('detail', data) }
}

export function showProgress(data: ProgressContainerData): AgentUIResult<'progress'> {
  return { type: 'progress', data, html: buildProgressHTML(data), text: toTextFallback('progress', data) }
}

export function showComparison(data: ComparisonContainerData): AgentUIResult<'comparison'> {
  return { type: 'comparison', data, html: buildComparisonHTML(data), text: toTextFallback('comparison', data) }
}

export function showFileUpload(data: FileUploadContainerData): AgentUIResult<'file_upload'> {
  return { type: 'file_upload', data, html: buildFileUploadHTML(data), text: toTextFallback('file_upload', data) }
}

export function showMap(data: MapContainerData): AgentUIResult<'map'> {
  return { type: 'map', data, html: buildMapHTML(data), text: toTextFallback('map', data) }
}

export function showMedia(data: MediaContainerData): AgentUIResult<'media'> {
  return { type: 'media', data, html: buildMediaHTML(data), text: toTextFallback('media', data) }
}

export function showRichText(data: RichTextContainerData): AgentUIResult<'rich_text'> {
  return { type: 'rich_text', data, html: buildRichTextHTML(data), text: toTextFallback('rich_text', data) }
}
