// ─── @avatarfirst/agent-ui React Adapter ─────────────────────────────
// Standalone React components with zero CSS dependencies.
// Usage: import { Form, CardList, Confirm } from '@avatarfirst/agent-ui/react'

import React, { useState, useMemo } from 'react'
import type {
  FormContainerData,
  CardListContainerData,
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
  ChartSeries,
  TimeSlot,
} from '../types.js'
import type { UserIntentResponse } from '../intents.js'

// ─── Shared Styles ───────────────────────────────────────────────────

const s = {
  card: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '24px', minWidth: '300px', maxWidth: '448px' } as React.CSSProperties,
  title: { fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#2d3436' } as React.CSSProperties,
  btnPrimary: { padding: '8px 16px', fontSize: '14px', fontWeight: 500, borderRadius: '8px', border: 'none', background: '#6c5ce7', color: 'white', cursor: 'pointer' } as React.CSSProperties,
  btnSecondary: { padding: '8px 16px', fontSize: '14px', fontWeight: 500, borderRadius: '8px', border: '1px solid #e8e8e8', background: '#f8f9fa', color: '#636e72', cursor: 'pointer' } as React.CSSProperties,
  row: { display: 'flex', gap: '8px', justifyContent: 'flex-end' } as React.CSSProperties,
  input: { width: '100%', padding: '10px 12px', border: '1.5px solid #e8e8e8', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' } as React.CSSProperties,
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#2d3436', marginBottom: '4px' } as React.CSSProperties,
}

// ─── Shared Props ────────────────────────────────────────────────────

export interface AgentUIComponentProps<T = Record<string, unknown>> {
  data: T
  onIntent?: (intent: UserIntentResponse) => void
  onDismiss?: () => void
}

// ─── CardList ────────────────────────────────────────────────────────

export function CardList({ data, onIntent, onDismiss }: AgentUIComponentProps<CardListContainerData>) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div style={s.card}>
      {data.title && <div style={s.title}>{data.title}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {(data.items || []).map((item, i) => (
          <div
            key={item.id || i}
            onClick={() => {
              setSelected(i)
              onIntent?.({ intent: 'card_select', data: { id: item.id || String(i), label: item.label, index: i } })
            }}
            style={{
              padding: '14px 16px', borderRadius: '12px', border: `1.5px solid ${selected === i ? '#6c5ce7' : '#e8e8e8'}`,
              background: selected === i ? '#f0edff' : 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: '#2d3436' }}>
                {item.icon && <span style={{ marginRight: '6px' }}>{item.icon}</span>}
                {item.label}
              </div>
              {item.description && <div style={{ fontSize: '13px', color: '#636e72', marginTop: '2px' }}>{item.description}</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '14px' }}>
              {item.price != null && <span style={{ fontWeight: 700, color: '#6c5ce7', fontSize: '17px' }}>${item.price.toFixed(2)}</span>}
              {item.value && <span style={{ fontWeight: 700, color: '#6c5ce7', fontSize: '17px' }}>{item.value}</span>}
            </div>
          </div>
        ))}
      </div>
      {onDismiss && <div style={s.row}><button style={s.btnSecondary} onClick={onDismiss}>Close</button></div>}
    </div>
  )
}

// ─── Form ────────────────────────────────────────────────────────────

export function Form({ data, onIntent, onDismiss }: AgentUIComponentProps<FormContainerData>) {
  const [values, setValues] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onIntent?.({ intent: 'form_submit', data: values })
  }

  return (
    <div style={s.card}>
      {data.title && <div style={s.title}>{data.title}</div>}
      <form onSubmit={handleSubmit}>
        {(data.fields || []).map((field) => (
          <div key={field.name} style={{ marginBottom: '14px' }}>
            <label style={s.label}>
              {field.label}
              {field.required && <span style={{ color: '#e74c3c', fontWeight: 400 }}> *</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                style={{ ...s.input, resize: 'vertical', minHeight: '72px' }}
                placeholder={field.placeholder}
                required={field.required}
                value={values[field.name] ?? ''}
                onChange={(e) => setValues(v => ({ ...v, [field.name]: e.target.value }))}
              />
            ) : field.type === 'select' ? (
              <select
                style={s.input}
                required={field.required}
                value={values[field.name] ?? ''}
                onChange={(e) => setValues(v => ({ ...v, [field.name]: e.target.value }))}
              >
                <option value="">{field.placeholder ?? `Select ${field.label}...`}</option>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                type={field.type ?? 'text'}
                style={s.input}
                placeholder={field.placeholder}
                required={field.required}
                value={values[field.name] ?? ''}
                onChange={(e) => setValues(v => ({ ...v, [field.name]: e.target.value }))}
              />
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          {onDismiss && <button type="button" style={{ ...s.btnSecondary, flex: 1 }} onClick={() => { onIntent?.({ intent: 'form_cancel', data: {} }); onDismiss() }}>Cancel</button>}
          <button type="submit" style={{ ...s.btnPrimary, flex: 1 }}>{data.submitLabel || 'Submit'}</button>
        </div>
      </form>
    </div>
  )
}

// ─── Confirm ─────────────────────────────────────────────────────────

export function Confirm({ data, onIntent, onDismiss }: AgentUIComponentProps<ConfirmContainerData>) {
  return (
    <div style={{ ...s.card, textAlign: 'center', maxWidth: '380px' }}>
      {data.title && <div style={{ ...s.title, fontSize: '20px' }}>{data.title}</div>}
      <p style={{ fontSize: '14px', color: '#636e72', lineHeight: 1.6, marginBottom: '24px' }}>{data.message}</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={{ ...s.btnSecondary, flex: 1 }} onClick={() => { onIntent?.({ intent: 'confirm', data: { confirmed: false } }); onDismiss?.() }}>
          {data.cancelLabel || 'Cancel'}
        </button>
        <button style={{ ...s.btnPrimary, flex: 1 }} onClick={() => { onIntent?.({ intent: 'confirm', data: { confirmed: true } }); onDismiss?.() }}>
          {data.confirmLabel || 'Confirm'}
        </button>
      </div>
    </div>
  )
}

// ─── Chart ───────────────────────────────────────────────────────────

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#84cc16']

export function Chart({ data, onDismiss }: AgentUIComponentProps<ChartContainerData>) {
  const { type = 'bar', series = [] } = data
  const max = Math.max(...series.map(s => s.value), 1)
  const total = series.reduce((sum, s) => sum + s.value, 0) || 1

  return (
    <div style={s.card}>
      {data.title && <div style={s.title}>{data.title}</div>}
      {type === 'bar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {series.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#636e72', width: '80px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
              <div style={{ flex: 1, height: '24px', background: '#f1f1f1', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(item.value / max) * 100}%`, background: item.color ?? CHART_COLORS[i % CHART_COLORS.length], borderRadius: '12px', transition: 'width 0.5s' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#2d3436', width: '48px' }}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
      {type === 'pie' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'center', marginBottom: '16px' }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            {(() => {
              let offset = 0
              const C = 2 * Math.PI * 60
              return series.map((item, i) => {
                const dash = (item.value / total) * C
                const el = <circle key={i} cx="80" cy="80" r="60" fill="none" stroke={item.color ?? CHART_COLORS[i % CHART_COLORS.length]} strokeWidth="24" strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-offset} transform="rotate(-90 80 80)" />
                offset += dash
                return el
              })
            })()}
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {series.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color ?? CHART_COLORS[i % CHART_COLORS.length] }} />
                <span style={{ fontSize: '12px', color: '#636e72' }}>{item.label}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#2d3436' }}>{Math.round((item.value / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {type === 'line' && (() => {
        const w = 300, h = 120, p = 8
        const points = series.map((item, i) => ({
          x: p + (i / Math.max(series.length - 1, 1)) * (w - p * 2),
          y: h - p - ((item.value / max) * (h - p * 2)),
        }))
        const pathD = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')
        return (
          <div style={{ marginBottom: '16px' }}>
            <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: '100%' }}>
              <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((pt, i) => <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#3b82f6" />)}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {series.map((item, i) => <span key={i} style={{ fontSize: '10px', color: '#aaa' }}>{item.label}</span>)}
            </div>
          </div>
        )
      })()}
      {onDismiss && <div style={s.row}><button style={s.btnSecondary} onClick={onDismiss}>Close</button></div>}
    </div>
  )
}

// ─── Table ───────────────────────────────────────────────────────────

export function Table({ data, onIntent, onDismiss }: AgentUIComponentProps<TableContainerData>) {
  const [sortCol, setSortCol] = useState(-1)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sortedRows = useMemo(() => {
    const rows = [...(data.rows || [])]
    if (sortCol >= 0) {
      rows.sort((a, b) => {
        const va = a[sortCol] || '', vb = b[sortCol] || ''
        const na = Number(va), nb = Number(vb)
        const cmp = !isNaN(na) && !isNaN(nb) ? na - nb : va.localeCompare(vb)
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return rows
  }, [data.rows, sortCol, sortDir])

  const handleSort = (i: number) => {
    const newDir = sortCol === i && sortDir === 'asc' ? 'desc' : 'asc'
    setSortCol(i)
    setSortDir(newDir)
    onIntent?.({ intent: 'table_sort', data: { column: (data.columns || [])[i], direction: newDir } })
  }

  return (
    <div style={{ ...s.card, maxWidth: '640px', overflowX: 'auto' }}>
      {data.title && <div style={s.title}>{data.title}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {(data.columns || []).map((col, i) => (
              <th key={i} onClick={() => handleSort(i)} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#636e72', borderBottom: '2px solid #6c5ce7', cursor: 'pointer' }}>
                {col}{sortCol === i ? (sortDir === 'asc' ? ' \u25B2' : ' \u25BC') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '12px 16px', fontSize: '14px', color: '#2d3436', borderBottom: '1px solid #f0f0f0' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {onDismiss && <div style={{ ...s.row, marginTop: '12px' }}><button style={s.btnSecondary} onClick={onDismiss}>Close</button></div>}
    </div>
  )
}

// ─── Calendar ────────────────────────────────────────────────────────

export function Calendar({ data, onIntent, onDismiss }: AgentUIComponentProps<CalendarContainerData>) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  const grouped = useMemo(() => {
    const m = new Map<string, TimeSlot[]>()
    for (const slot of data.available_slots || []) {
      const arr = m.get(slot.date) ?? []
      arr.push(slot)
      m.set(slot.date, arr)
    }
    return m
  }, [data.available_slots])

  const dates = [...grouped.keys()]
  const activeDate = selectedDate ?? dates[0] ?? null
  const activeSlots = activeDate ? grouped.get(activeDate) ?? [] : []

  return (
    <div style={{ ...s.card, maxWidth: '380px' }}>
      {data.title && <div style={s.title}>{data.title}</div>}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
        {dates.map(date => (
          <button key={date} onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
            style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 500, borderRadius: '20px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: activeDate === date ? '#6c5ce7' : '#f1f1f1', color: activeDate === date ? 'white' : '#636e72' }}>
            {date}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {activeSlots.map((slot, i) => {
          const avail = slot.available !== false
          const isSel = selectedSlot === slot
          return (
            <button key={i} disabled={!avail} onClick={() => setSelectedSlot(slot)}
              style={{ padding: '8px 14px', fontSize: '14px', borderRadius: '8px', border: 'none', cursor: avail ? 'pointer' : 'not-allowed', background: isSel ? '#6c5ce7' : avail ? '#f1f1f1' : '#fafafa', color: isSel ? 'white' : avail ? '#2d3436' : '#ccc' }}>
              {slot.time}
            </button>
          )
        })}
      </div>
      <div style={s.row}>
        {selectedSlot && <button style={s.btnPrimary} onClick={() => onIntent?.({ intent: 'calendar_select', data: { date: selectedSlot.date, time: selectedSlot.time } })}>Confirm</button>}
        {onDismiss && <button style={s.btnSecondary} onClick={onDismiss}>Close</button>}
      </div>
    </div>
  )
}

// ─── Progress ────────────────────────────────────────────────────────

export function Progress({ data, onDismiss }: AgentUIComponentProps<ProgressContainerData>) {
  return (
    <div style={{ ...s.card, maxWidth: '400px' }}>
      {data.title && <div style={s.title}>{data.title}</div>}
      {(data.steps || []).map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: '14px', paddingBottom: i < (data.steps || []).length - 1 ? '24px' : 0, position: 'relative' }}>
          {i < (data.steps || []).length - 1 && (
            <div style={{ position: 'absolute', left: '13px', top: '28px', bottom: 0, width: '2px', background: step.completed ? '#00b894' : '#e8e8e8' }} />
          )}
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0, background: step.completed ? '#00b894' : step.active ? '#6c5ce7' : '#e8e8e8', color: step.completed || step.active ? 'white' : '#636e72', boxShadow: step.active ? '0 0 0 4px rgba(108,92,231,0.2)' : 'none', position: 'relative', zIndex: 1 }}>
            {step.completed ? '\u2713' : i + 1}
          </div>
          <div style={{ fontSize: '14px', paddingTop: '4px', color: step.completed ? '#00b894' : step.active ? '#2d3436' : '#636e72', fontWeight: step.active ? 600 : 400 }}>
            {step.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Comparison ──────────────────────────────────────────────────────

export function Comparison({ data, onIntent, onDismiss }: AgentUIComponentProps<ComparisonContainerData>) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div style={s.card}>
      {data.title && <div style={s.title}>{data.title}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min((data.items || []).length, 3)}, 1fr)`, gap: '12px' }}>
        {(data.items || []).map((item, i) => (
          <div key={i} onClick={() => { setSelected(i); onIntent?.({ intent: 'comparison_select', data: { name: item.name, index: i } }) }}
            style={{ border: `1.5px solid ${selected === i ? '#6c5ce7' : '#e8e8e8'}`, borderRadius: '12px', padding: '16px', cursor: 'pointer', background: selected === i ? '#f0edff' : 'white' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#2d3436', marginBottom: '10px' }}>{item.name}</div>
            {Object.entries(item.attributes).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#636e72' }}>{k}</span>
                <span style={{ fontWeight: 500, color: '#2d3436' }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Detail ──────────────────────────────────────────────────────────

export function Detail({ data, onIntent, onDismiss }: AgentUIComponentProps<DetailContainerData>) {
  return (
    <div style={{ ...s.card, maxWidth: '420px' }}>
      {data.image && <img src={data.image} alt={data.title || ''} style={{ width: '100%', borderRadius: '8px', marginBottom: '16px', objectFit: 'cover', maxHeight: '200px' }} />}
      {data.title && <div style={s.title}>{data.title}</div>}
      {data.body && <p style={{ fontSize: '14px', color: '#636e72', lineHeight: 1.6, marginBottom: '16px' }}>{data.body}</p>}
      {data.metadata && (
        <div style={{ marginBottom: '16px' }}>
          {Object.entries(data.metadata).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: '#636e72' }}>{k}</span>
              <span style={{ fontWeight: 500, color: '#2d3436' }}>{v}</span>
            </div>
          ))}
        </div>
      )}
      <div style={s.row}>
        {data.actions?.map((action, i) => (
          <button key={i} style={s.btnPrimary} onClick={() => onIntent?.({ intent: 'detail_action', data: { action: action.label } })}>{action.label}</button>
        ))}
        {onDismiss && <button style={s.btnSecondary} onClick={onDismiss}>Close</button>}
      </div>
    </div>
  )
}

// ─── RichText ────────────────────────────────────────────────────────

function simpleMarkdown(md: string): string {
  let html = md
  html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:#1e1e2e;color:#cdd6f4;padding:14px;border-radius:8px;overflow-x:auto;margin:12px 0"><code>$1</code></pre>')
  html = html.replace(/`([^`]+)`/g, '<code style="background:#f1f1f1;padding:2px 6px;border-radius:4px;font-size:13px">$1</code>')
  html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:16px;font-weight:600;margin:12px 0 4px">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:18px;font-weight:700;margin:14px 0 6px">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 style="font-size:22px;font-weight:700;margin:16px 0 8px">$1</h1>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#6c5ce7">$1</a>')
  html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #6c5ce7;padding-left:14px;color:#636e72;margin:10px 0">$1</blockquote>')
  html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e8e8e8;margin:16px 0">')
  html = html.replace(/^(?!<[hupob]|<li|<hr|<pre|<code|<a |<str|<em>|<block)(.+)$/gm, '<p style="margin-bottom:10px">$1</p>')
  return html
}

export function RichText({ data, onDismiss }: AgentUIComponentProps<RichTextContainerData>) {
  return (
    <div style={{ ...s.card, maxWidth: '600px' }}>
      {data.title && <div style={s.title}>{data.title}</div>}
      <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#2d3436' }} dangerouslySetInnerHTML={{ __html: simpleMarkdown(data.content || '') }} />
      {onDismiss && <div style={{ ...s.row, marginTop: '16px' }}><button style={s.btnSecondary} onClick={onDismiss}>Close</button></div>}
    </div>
  )
}

// ─── Media ───────────────────────────────────────────────────────────

export function Media({ data, onDismiss }: AgentUIComponentProps<MediaContainerData>) {
  const frameStyle: React.CSSProperties = { width: '100%', borderRadius: '8px' }

  return (
    <div style={{ ...s.card, maxWidth: '480px' }}>
      {data.title && <div style={s.title}>{data.title}</div>}
      {data.type === 'video' && <video style={frameStyle} controls autoPlay={data.autoplay}><source src={data.url} /></video>}
      {data.type === 'audio' && <audio style={frameStyle} controls autoPlay={data.autoplay}><source src={data.url} /></audio>}
      {(!data.type || data.type === 'image') && <img style={{ ...frameStyle, objectFit: 'contain', maxHeight: '300px' }} src={data.url} alt={data.alt || ''} />}
      {onDismiss && <div style={{ ...s.row, marginTop: '12px' }}><button style={s.btnSecondary} onClick={onDismiss}>Close</button></div>}
    </div>
  )
}
