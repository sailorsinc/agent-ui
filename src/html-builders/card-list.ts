import type { CardListContainerData } from '../types.js'
import { buildBaseHTML, escapeHTML } from './_shared.js'

export function buildCardListHTML(data: CardListContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-card-list',
    css: `
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
      .count { font-size: 13px; color: var(--text-muted); background: var(--primary-light); padding: 3px 10px; border-radius: 12px; }
      .cards { display: flex; flex-direction: column; gap: 8px; }
      .card {
        background: var(--card-bg); border-radius: var(--radius); padding: 14px 16px;
        border: 1.5px solid var(--border); cursor: pointer; transition: all 0.2s ease;
        display: flex; justify-content: space-between; align-items: center;
        opacity: 0; transform: translateY(8px); animation: slideIn 0.3s ease forwards;
      }
      .card:hover { border-color: var(--primary); box-shadow: 0 4px 12px rgba(108,92,231,0.15); transform: translateY(-1px); }
      .card.selected { border-color: var(--primary); background: var(--primary-light); }
      .card-info { flex: 1; }
      .card-name { font-weight: 600; color: var(--text); font-size: 15px; }
      .card-desc { color: var(--text-muted); font-size: 13px; margin-top: 3px; line-height: 1.4; }
      .card-right { display: flex; align-items: center; gap: 8px; margin-left: 14px; }
      .card-price { font-weight: 700; color: var(--primary); font-size: 17px; white-space: nowrap; }
      .card-icon { font-size: 20px; }
      .card-check { width: 20px; height: 20px; border: 2px solid var(--border); border-radius: 50%; transition: all 0.2s; flex-shrink: 0; }
      .card.selected .card-check { border-color: var(--primary); background: var(--primary); }
      .card.selected .card-check::after {
        content: ''; display: block; width: 6px; height: 10px; margin: 2px auto;
        border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg);
      }
    `,
    body: `
      <div class="header">
        <div class="title" id="title">Items</div>
        <div class="count" id="count"></div>
      </div>
      <div class="cards" id="cards"></div>
    `,
    script: `
    app.ontoolinput = (params) => {
      const input = params.input;
      const items = input.items || [];

      document.getElementById('title').textContent = input.title || 'Items';
      document.getElementById('count').textContent = items.length + ' items';

      const container = document.getElementById('cards');
      container.innerHTML = '';

      items.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = (i * 0.05) + 's';

        const iconSpan = item.icon ? '<span class="card-icon">' + item.icon + '</span> ' : '';
        const descDiv = item.description ? '<div class="card-desc">' + item.description + '</div>' : '';
        const priceDiv = item.price != null ? '<div class="card-price">$' + Number(item.price).toFixed(2) + '</div>' : '';
        const valueDiv = item.value ? '<div class="card-price">' + item.value + '</div>' : '';

        card.innerHTML =
          '<div class="card-info">' +
            '<div class="card-name">' + iconSpan + item.label + '</div>' +
            descDiv +
          '</div>' +
          '<div class="card-right">' +
            priceDiv + valueDiv +
            '<div class="card-check"></div>' +
          '</div>';

        card.onclick = async () => {
          document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          await sendIntent('card_select', { id: item.id || String(i), label: item.label, index: i });
        };
        container.appendChild(card);
      });
    };
    `,
  })
}
