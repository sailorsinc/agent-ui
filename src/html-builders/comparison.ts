import type { ComparisonContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildComparisonHTML(data: ComparisonContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-comparison',
    css: `
      .comp-container { background: white; border-radius: var(--radius); padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        opacity: 0; animation: popIn 0.3s ease forwards; }
      .title { margin-bottom: 16px; }
      .comp-grid { display: grid; gap: 12px; }
      .comp-card {
        border: 1.5px solid var(--border); border-radius: var(--radius); padding: 16px;
        cursor: pointer; transition: all 0.2s;
      }
      .comp-card:hover { border-color: var(--primary); box-shadow: 0 4px 12px rgba(108,92,231,0.1); }
      .comp-card.selected { border-color: var(--primary); background: var(--primary-light); }
      .comp-name { font-size: 16px; font-weight: 600; color: var(--text); margin-bottom: 10px; }
      .comp-attrs { display: flex; flex-direction: column; gap: 6px; }
      .comp-attr { display: flex; justify-content: space-between; font-size: 13px; }
      .comp-attr-key { color: var(--text-muted); }
      .comp-attr-val { font-weight: 500; color: var(--text); }
    `,
    body: `
      <div class="comp-container">
        <div class="title" id="title">Comparison</div>
        <div class="comp-grid" id="grid"></div>
      </div>
    `,
    script: `
    app.ontoolinput = (params) => {
      const input = params.input;
      const items = input.items || [];
      document.getElementById('title').textContent = input.title || 'Comparison';

      const grid = document.getElementById('grid');
      grid.style.gridTemplateColumns = items.length <= 3 ? 'repeat(' + items.length + ', 1fr)' : 'repeat(2, 1fr)';
      grid.innerHTML = '';

      items.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'comp-card';
        let attrsHTML = '<div class="comp-attrs">';
        for (const [key, val] of Object.entries(item.attributes || {})) {
          attrsHTML += '<div class="comp-attr"><span class="comp-attr-key">' + key + '</span><span class="comp-attr-val">' + val + '</span></div>';
        }
        attrsHTML += '</div>';
        card.innerHTML = '<div class="comp-name">' + item.name + '</div>' + attrsHTML;
        card.onclick = () => {
          grid.querySelectorAll('.comp-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          sendIntent('comparison_select', { name: item.name, index: i });
        };
        grid.appendChild(card);
      });
    };
    `,
  })
}
