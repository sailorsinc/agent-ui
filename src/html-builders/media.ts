import type { MediaContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildMediaHTML(data: MediaContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-media',
    css: `
      .media-container { background: white; border-radius: var(--radius); padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        opacity: 0; animation: popIn 0.25s ease forwards; max-width: 480px; }
      .title { margin-bottom: 12px; }
      .media-frame { width: 100%; border-radius: var(--radius-sm); }
      video.media-frame, audio.media-frame { outline: none; }
      img.media-frame { object-fit: contain; max-height: 300px; }
      .footer { margin-top: 12px; display: flex; justify-content: flex-end; }
      .footer .btn { padding: 8px 16px; font-size: 13px; }
    `,
    body: `
      <div class="media-container">
        <div class="title" id="title"></div>
        <div id="mediaArea"></div>
        <div class="footer"><button class="btn btn-secondary" id="closeBtn">Close</button></div>
      </div>
    `,
    script: `
    app.ontoolinput = (params) => {
      const input = params.input;
      document.getElementById('title').textContent = input.title || '';
      const area = document.getElementById('mediaArea');
      const url = input.url || '';
      const type = input.type || 'image';
      const autoplay = input.autoplay ? 'autoplay' : '';

      if (type === 'video') {
        area.innerHTML = '<video class="media-frame" controls ' + autoplay + '><source src="' + url + '"></video>';
      } else if (type === 'audio') {
        area.innerHTML = '<audio class="media-frame" controls ' + autoplay + '><source src="' + url + '"></audio>';
      } else {
        area.innerHTML = '<img class="media-frame" src="' + url + '" alt="' + (input.alt || '') + '">';
      }
    };

    document.getElementById('closeBtn').onclick = () => sendIntent('dismiss', {});
    `,
  })
}
