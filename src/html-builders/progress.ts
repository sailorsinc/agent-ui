import type { ProgressContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildProgressHTML(data: ProgressContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-progress',
    css: `
      .progress-container { background: white; border-radius: var(--radius); padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); max-width: 400px; }
      .title { margin-bottom: 20px; }
      .steps { position: relative; }
      .step { display: flex; align-items: flex-start; gap: 14px; position: relative; padding-bottom: 24px; }
      .step:last-child { padding-bottom: 0; }
      .step-line { position: absolute; left: 14px; top: 28px; bottom: 0; width: 2px; background: #e8e8e8; }
      .step:last-child .step-line { display: none; }
      .step.completed .step-line { background: var(--success); }
      .step-dot {
        width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 700; position: relative; z-index: 1;
      }
      .step.completed .step-dot { background: var(--success); color: white; }
      .step.active .step-dot { background: var(--primary); color: white; box-shadow: 0 0 0 4px rgba(108,92,231,0.2); }
      .step.pending .step-dot { background: #e8e8e8; color: var(--text-muted); }
      .step-label { font-size: 14px; padding-top: 4px; }
      .step.completed .step-label { color: var(--success); }
      .step.active .step-label { color: var(--text); font-weight: 600; }
      .step.pending .step-label { color: var(--text-muted); }
    `,
    body: `
      <div class="progress-container">
        <div class="title" id="title">Progress</div>
        <div class="steps" id="steps"></div>
      </div>
    `,
    script: `
    app.ontoolinput = (params) => {
      const input = params.input;
      document.getElementById('title').textContent = input.title || 'Progress';
      const container = document.getElementById('steps');
      container.innerHTML = '';

      (input.steps || []).forEach((step, i) => {
        const status = step.completed ? 'completed' : step.active ? 'active' : 'pending';
        const icon = step.completed ? '\\u2713' : String(i + 1);
        const div = document.createElement('div');
        div.className = 'step ' + status;
        div.innerHTML =
          '<div class="step-dot">' + icon + '</div>' +
          '<div class="step-label">' + step.label + '</div>' +
          '<div class="step-line"></div>';
        container.appendChild(div);
      });
    };
    `,
  })
}
