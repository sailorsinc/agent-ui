import type { DetailContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildDetailHTML(data: DetailContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-detail',
    css: `
      .detail { background: white; border-radius: var(--radius); padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        opacity: 0; animation: popIn 0.25s ease forwards; max-width: 420px; }
      .detail-image { width: 100%; border-radius: var(--radius-sm); margin-bottom: 16px; object-fit: cover; max-height: 200px; }
      .title { margin-bottom: 8px; }
      .body { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }
      .meta { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
      .meta-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
      .meta-key { color: var(--text-muted); }
      .meta-value { font-weight: 500; color: var(--text); }
      .detail-actions { display: flex; gap: 8px; flex-wrap: wrap; }
      .detail-actions .btn { padding: 8px 16px; font-size: 13px; }
    `,
    body: `<div class="detail" id="detail"></div>`,
    script: `
    app.ontoolinput = (params) => {
      const input = params.input;
      const container = document.getElementById('detail');
      let html = '';

      if (input.image) {
        html += '<img class="detail-image" src="' + input.image + '" alt="' + (input.title || '') + '">';
      }
      html += '<div class="title">' + (input.title || 'Details') + '</div>';
      if (input.body) {
        html += '<div class="body">' + input.body + '</div>';
      }
      if (input.metadata) {
        html += '<div class="meta">';
        for (const [key, value] of Object.entries(input.metadata)) {
          html += '<div class="meta-row"><span class="meta-key">' + key + '</span><span class="meta-value">' + value + '</span></div>';
        }
        html += '</div>';
      }
      if (input.actions && input.actions.length > 0) {
        html += '<div class="detail-actions">';
        input.actions.forEach(action => {
          html += '<button class="btn btn-primary" onclick="sendIntent(\'detail_action\', { action: \'' + action.label + '\' })">' + action.label + '</button>';
        });
        html += '<button class="btn btn-secondary" onclick="sendIntent(\'dismiss\', {})">Close</button>';
        html += '</div>';
      } else {
        html += '<div class="detail-actions"><button class="btn btn-secondary" onclick="sendIntent(\'dismiss\', {})">Close</button></div>';
      }

      container.innerHTML = html;
    };
    `,
  })
}
