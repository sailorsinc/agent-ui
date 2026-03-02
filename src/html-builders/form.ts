import type { FormContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildFormHTML(data: FormContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-form',
    css: `
      .subtitle { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; }
      .field { margin-bottom: 16px; opacity: 0; transform: translateY(6px); animation: fadeIn 0.25s ease forwards; }
      .field label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 5px; }
      .required::after { content: ' *'; color: var(--error); font-weight: 400; }
      .field input, .field textarea, .field select {
        width: 100%; padding: 11px 14px; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
        font-size: 14px; font-family: inherit; outline: none; transition: all 0.2s; background: white;
      }
      .field input:focus, .field textarea:focus, .field select:focus {
        border-color: var(--primary); box-shadow: 0 0 0 3px rgba(108,92,231,0.1);
      }
      .field textarea { resize: vertical; min-height: 72px; }
      .field .error-msg { font-size: 12px; color: var(--error); margin-top: 4px; display: none; }
      .field.invalid input, .field.invalid textarea, .field.invalid select { border-color: var(--error); }
      .field.invalid .error-msg { display: block; }
      .actions { display: flex; gap: 10px; margin-top: 20px; }
      .actions .btn { flex: 1; }
    `,
    body: `
      <div class="title" id="title">Form</div>
      <div class="subtitle" id="subtitle"></div>
      <form id="form" novalidate></form>
    `,
    script: `
    let formFields = [];

    app.ontoolinput = (params) => {
      const input = params.input;
      formFields = input.fields || [];

      document.getElementById('title').textContent = input.title || 'Form';
      const reqCount = formFields.filter(f => f.required).length;
      document.getElementById('subtitle').textContent = reqCount ? reqCount + ' required field' + (reqCount > 1 ? 's' : '') : '';

      const form = document.getElementById('form');
      form.innerHTML = '';

      formFields.forEach((field, i) => {
        const div = document.createElement('div');
        div.className = 'field';
        div.style.animationDelay = (i * 0.06) + 's';

        const label = document.createElement('label');
        label.textContent = field.label;
        if (field.required) label.className = 'required';
        div.appendChild(label);

        let el;
        if (field.type === 'textarea') {
          el = document.createElement('textarea');
          el.placeholder = field.placeholder || '';
        } else if (field.type === 'select' && field.options) {
          el = document.createElement('select');
          const defaultOpt = document.createElement('option');
          defaultOpt.value = ''; defaultOpt.textContent = field.placeholder || 'Select ' + field.label + '...';
          defaultOpt.disabled = true; defaultOpt.selected = true;
          el.appendChild(defaultOpt);
          field.options.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt; o.textContent = opt;
            el.appendChild(o);
          });
        } else {
          el = document.createElement('input');
          el.type = field.type || 'text';
          el.placeholder = field.placeholder || '';
        }
        el.name = field.name;
        el.required = field.required || false;
        div.appendChild(el);

        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-msg';
        errorMsg.textContent = field.label + ' is required';
        div.appendChild(errorMsg);

        form.appendChild(div);
      });

      const actions = document.createElement('div');
      actions.className = 'actions';

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn-secondary'; cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.onclick = () => sendIntent('form_cancel', {});

      const submitBtn = document.createElement('button');
      submitBtn.className = 'btn btn-primary'; submitBtn.type = 'button';
      submitBtn.textContent = input.submitLabel || 'Submit';
      submitBtn.onclick = () => {
        let valid = true;
        formFields.forEach(field => {
          const el = document.querySelector('[name="' + field.name + '"]');
          const wrapper = el && el.closest('.field');
          if (field.required && (!el || !el.value.trim())) {
            if (wrapper) wrapper.classList.add('invalid');
            valid = false;
          } else {
            if (wrapper) wrapper.classList.remove('invalid');
          }
        });
        if (!valid) return;
        const data = {};
        formFields.forEach(f => {
          const el = document.querySelector('[name="' + f.name + '"]');
          if (el) data[f.name] = el.value;
        });
        sendIntent('form_submit', data);
      };

      actions.appendChild(cancelBtn);
      actions.appendChild(submitBtn);
      form.appendChild(actions);
    };
    `,
  })
}
