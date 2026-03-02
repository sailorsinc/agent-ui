import type { ConfirmContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildConfirmHTML(data: ConfirmContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-confirm',
    css: `
      .container {
        text-align: center; max-width: 380px; margin: 0 auto;
        opacity: 0; transform: scale(0.96);
        animation: popIn 0.25s ease forwards;
      }
      .icon { font-size: 48px; margin-bottom: 12px; }
      .title { margin-bottom: 8px; }
      .message { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 24px; }
      .actions { display: flex; gap: 10px; }
      .actions .btn { flex: 1; }
    `,
    body: `
      <div class="container">
        <div class="icon" id="icon"></div>
        <div class="title" id="title">Confirm</div>
        <div class="message" id="message"></div>
        <div class="actions">
          <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
          <button class="btn btn-primary" id="confirmBtn">Confirm</button>
        </div>
      </div>
    `,
    script: `
    app.ontoolinput = (params) => {
      const input = params.input;
      document.getElementById('title').textContent = input.title || 'Confirm';
      document.getElementById('message').textContent = input.message || '';
      document.getElementById('confirmBtn').textContent = input.confirmLabel || 'Confirm';
      document.getElementById('cancelBtn').textContent = input.cancelLabel || 'Cancel';

      const iconEl = document.getElementById('icon');
      if (input.icon) {
        iconEl.textContent = input.icon;
      } else if (input.title && input.title.toLowerCase().includes('delete')) {
        iconEl.textContent = '\\u26A0\\uFE0F';
      } else if (input.title && input.title.toLowerCase().includes('order')) {
        iconEl.textContent = '\\uD83D\\uDED2';
      } else {
        iconEl.textContent = '\\u2753';
      }
    };

    document.getElementById('confirmBtn').onclick = () => sendIntent('confirm', { confirmed: true });
    document.getElementById('cancelBtn').onclick = () => sendIntent('confirm', { confirmed: false });
    `,
  })
}
