import type { ChartContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildChartHTML(data: ChartContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-chart',
    css: `
      .chart-container { background: white; border-radius: var(--radius); padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
      .title { margin-bottom: 16px; }

      /* Bar chart */
      .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
      .bar-label { font-size: 12px; color: var(--text-muted); width: 80px; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .bar-track { flex: 1; height: 24px; background: #f1f1f1; border-radius: 12px; overflow: hidden; }
      .bar-fill { height: 100%; border-radius: 12px; transition: width 0.5s ease; }
      .bar-value { font-size: 12px; font-weight: 600; color: var(--text); width: 48px; }

      /* Pie chart */
      .pie-container { display: flex; align-items: center; gap: 24px; justify-content: center; }
      .pie-legend { display: flex; flex-direction: column; gap: 6px; }
      .legend-item { display: flex; align-items: center; gap: 8px; }
      .legend-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
      .legend-label { font-size: 12px; color: var(--text-muted); }
      .legend-pct { font-size: 12px; font-weight: 600; color: var(--text); }

      /* Line chart */
      .line-labels { display: flex; justify-content: space-between; margin-top: 4px; }
      .line-labels span { font-size: 10px; color: #aaa; }

      .dismiss { display: flex; justify-content: flex-end; margin-top: 16px; }
    `,
    body: `
      <div class="chart-container">
        <div class="title" id="title"></div>
        <div id="chart"></div>
        <div class="dismiss"><button class="btn btn-secondary" id="closeBtn" style="padding:8px 16px;font-size:13px">Close</button></div>
      </div>
    `,
    script: `
    const COLORS = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#ef4444','#84cc16'];

    app.ontoolinput = (params) => {
      const input = params.input;
      const series = input.series || [];
      const type = input.type || 'bar';
      document.getElementById('title').textContent = input.title || 'Chart';

      const container = document.getElementById('chart');
      container.innerHTML = '';

      if (type === 'bar') renderBar(container, series);
      else if (type === 'pie') renderPie(container, series);
      else if (type === 'line') renderLine(container, series);
    };

    function renderBar(container, series) {
      const max = Math.max(...series.map(s => s.value), 1);
      series.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'bar-row';
        const color = item.color || COLORS[i % COLORS.length];
        row.innerHTML =
          '<div class="bar-label">' + item.label + '</div>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' + ((item.value / max) * 100) + '%;background:' + color + '"></div></div>' +
          '<div class="bar-value">' + item.value + '</div>';
        container.appendChild(row);
      });
    }

    function renderPie(container, series) {
      const total = series.reduce((s, x) => s + x.value, 0) || 1;
      const r = 60, cx = 80, cy = 80, C = 2 * Math.PI * r;
      let offset = 0;
      let circles = '';
      series.forEach((item, i) => {
        const dash = (item.value / total) * C;
        const color = item.color || COLORS[i % COLORS.length];
        circles += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="24" stroke-dasharray="' + dash + ' ' + (C - dash) + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
        offset += dash;
      });
      const svg = '<svg width="160" height="160" viewBox="0 0 160 160">' + circles + '</svg>';
      let legend = '<div class="pie-legend">';
      series.forEach((item, i) => {
        const color = item.color || COLORS[i % COLORS.length];
        const pct = Math.round((item.value / total) * 100);
        legend += '<div class="legend-item"><div class="legend-dot" style="background:' + color + '"></div><span class="legend-label">' + item.label + '</span><span class="legend-pct">' + pct + '%</span></div>';
      });
      legend += '</div>';
      container.innerHTML = '<div class="pie-container">' + svg + legend + '</div>';
    }

    function renderLine(container, series) {
      const max = Math.max(...series.map(s => s.value), 1);
      const w = 300, h = 120, p = 8;
      const points = series.map((item, i) => ({
        x: p + (i / Math.max(series.length - 1, 1)) * (w - p * 2),
        y: h - p - ((item.value / max) * (h - p * 2)),
      }));
      const pathD = points.map((pt, i) => (i === 0 ? 'M' : 'L') + ' ' + pt.x + ' ' + pt.y).join(' ');
      let dots = '';
      points.forEach(pt => { dots += '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="3" fill="#3b82f6"/>'; });
      const svg = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="width:100%"><path d="' + pathD + '" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' + dots + '</svg>';
      let labels = '<div class="line-labels">';
      series.forEach(item => { labels += '<span>' + item.label + '</span>'; });
      labels += '</div>';
      container.innerHTML = svg + labels;
    }

    document.getElementById('closeBtn').onclick = () => sendIntent('dismiss', {});
    `,
  })
}
