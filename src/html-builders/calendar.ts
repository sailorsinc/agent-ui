import type { CalendarContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildCalendarHTML(data: CalendarContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-calendar',
    css: `
      .cal-container { background: white; border-radius: var(--radius); padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); max-width: 380px; }
      .title { margin-bottom: 16px; }
      .date-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 12px; }
      .date-tab {
        padding: 6px 14px; font-size: 13px; font-weight: 500; border-radius: 20px;
        white-space: nowrap; cursor: pointer; transition: all 0.2s;
        border: none; font-family: inherit; background: #f1f1f1; color: var(--text-muted);
      }
      .date-tab.active { background: var(--primary); color: white; }
      .date-tab:hover:not(.active) { background: #e4e4e4; }
      .time-slots { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
      .time-slot {
        padding: 8px 14px; font-size: 14px; border-radius: var(--radius-sm);
        cursor: pointer; transition: all 0.2s; border: none; font-family: inherit;
        background: #f1f1f1; color: var(--text);
      }
      .time-slot:hover:not(.unavailable):not(.selected) { background: #e4e4e4; }
      .time-slot.selected { background: var(--primary); color: white; box-shadow: 0 0 0 3px rgba(108,92,231,0.2); }
      .time-slot.unavailable { background: #fafafa; color: #ccc; cursor: not-allowed; }
      .footer { display: flex; gap: 8px; justify-content: flex-end; }
      .footer .btn { padding: 8px 16px; font-size: 13px; }
    `,
    body: `
      <div class="cal-container">
        <div class="title" id="title">Select a Time</div>
        <div class="date-tabs" id="dateTabs"></div>
        <div class="time-slots" id="timeSlots"></div>
        <div class="footer">
          <button class="btn btn-primary" id="confirmBtn" style="display:none">Confirm</button>
          <button class="btn btn-secondary" id="closeBtn">Close</button>
        </div>
      </div>
    `,
    script: `
    let slots = [];
    let selectedDate = null;
    let selectedSlot = null;

    app.ontoolinput = (params) => {
      const input = params.input;
      document.getElementById('title').textContent = input.title || 'Select a Time';
      slots = input.available_slots || [];
      selectedDate = null;
      selectedSlot = null;

      const dates = [...new Set(slots.map(s => s.date))];
      if (dates.length > 0) {
        selectedDate = dates[0];
      }
      renderDateTabs(dates);
      renderTimeSlots();
    };

    function renderDateTabs(dates) {
      const container = document.getElementById('dateTabs');
      container.innerHTML = '';
      dates.forEach(date => {
        const btn = document.createElement('button');
        btn.className = 'date-tab' + (date === selectedDate ? ' active' : '');
        btn.textContent = date;
        btn.onclick = () => {
          selectedDate = date;
          selectedSlot = null;
          document.getElementById('confirmBtn').style.display = 'none';
          renderDateTabs(dates);
          renderTimeSlots();
        };
        container.appendChild(btn);
      });
    }

    function renderTimeSlots() {
      const container = document.getElementById('timeSlots');
      container.innerHTML = '';
      const dateSlots = slots.filter(s => s.date === selectedDate);
      dateSlots.forEach(slot => {
        const btn = document.createElement('button');
        const avail = slot.available !== false;
        btn.className = 'time-slot' + (!avail ? ' unavailable' : '') + (selectedSlot === slot ? ' selected' : '');
        btn.textContent = slot.time;
        btn.disabled = !avail;
        btn.onclick = () => {
          selectedSlot = slot;
          document.getElementById('confirmBtn').style.display = '';
          renderTimeSlots();
        };
        container.appendChild(btn);
      });
    }

    document.getElementById('confirmBtn').onclick = () => {
      if (selectedSlot) sendIntent('calendar_select', { date: selectedSlot.date, time: selectedSlot.time });
    };
    document.getElementById('closeBtn').onclick = () => sendIntent('dismiss', {});
    `,
  })
}
