import type { TableContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildTableHTML(data: TableContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-table',
    css: `
      .table-container { background: white; border-radius: var(--radius); overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
      .header { display: flex; justify-content: space-between; align-items: center; padding: 16px; }
      table { width: 100%; border-collapse: collapse; }
      th { text-align: left; padding: 10px 16px; font-size: 13px; font-weight: 600; color: var(--text-muted); border-bottom: 2px solid var(--primary); cursor: pointer; user-select: none; }
      th:hover { color: var(--primary); }
      td { padding: 12px 16px; font-size: 14px; color: var(--text); border-bottom: 1px solid #f0f0f0; }
      tr:last-child td { border-bottom: none; }
      tbody tr { transition: background 0.15s; }
      tbody tr:hover { background: var(--primary-light); }
      .sort-arrow { margin-left: 4px; font-size: 10px; }
    `,
    body: `
      <div class="table-container">
        <div class="header">
          <div class="title" id="title">Table</div>
        </div>
        <table>
          <thead id="thead"></thead>
          <tbody id="tbody"></tbody>
        </table>
      </div>
    `,
    script: `
    let currentSort = { col: -1, dir: 'asc' };
    let tableData = { columns: [], rows: [] };

    app.ontoolinput = (params) => {
      const input = params.input;
      document.getElementById('title').textContent = input.title || 'Table';
      tableData = { columns: input.columns || [], rows: input.rows || [] };
      renderTable();
    };

    function renderTable() {
      const thead = document.getElementById('thead');
      const tbody = document.getElementById('tbody');
      thead.innerHTML = '<tr>' + tableData.columns.map((col, i) => {
        const arrow = currentSort.col === i ? '<span class="sort-arrow">' + (currentSort.dir === 'asc' ? '\\u25B2' : '\\u25BC') + '</span>' : '';
        return '<th data-col="' + i + '">' + col + arrow + '</th>';
      }).join('') + '</tr>';

      let rows = [...tableData.rows];
      if (currentSort.col >= 0) {
        const ci = currentSort.col;
        const dir = currentSort.dir === 'asc' ? 1 : -1;
        rows.sort((a, b) => {
          const va = a[ci] || '', vb = b[ci] || '';
          const na = Number(va), nb = Number(vb);
          if (!isNaN(na) && !isNaN(nb)) return (na - nb) * dir;
          return va.localeCompare(vb) * dir;
        });
      }

      tbody.innerHTML = rows.map(row =>
        '<tr>' + row.map(cell => '<td>' + (cell || '') + '</td>').join('') + '</tr>'
      ).join('');

      thead.querySelectorAll('th').forEach(th => {
        th.onclick = () => {
          const col = parseInt(th.dataset.col);
          if (currentSort.col === col) {
            currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
          } else {
            currentSort = { col, dir: 'asc' };
          }
          sendIntent('table_sort', { column: tableData.columns[col], direction: currentSort.dir });
          renderTable();
        };
      });
    }
    `,
  })
}
