import type { FileUploadContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildFileUploadHTML(data: FileUploadContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-file-upload',
    css: `
      .upload-container { background: white; border-radius: var(--radius); padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); max-width: 380px; }
      .title { margin-bottom: 16px; }
      .dropzone {
        border: 2px dashed var(--border); border-radius: var(--radius); padding: 32px 16px;
        text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 12px;
      }
      .dropzone:hover { border-color: var(--primary); background: var(--primary-light); }
      .dropzone.dragging { border-color: var(--primary); background: var(--primary-light); }
      .dropzone-icon { font-size: 32px; color: #ccc; margin-bottom: 8px; }
      .dropzone-text { font-size: 14px; color: var(--text-muted); }
      .dropzone-hint { font-size: 12px; color: #aaa; margin-top: 4px; }
      .file-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
      .file-item {
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 12px; background: #fafafa; border-radius: var(--radius-sm);
      }
      .file-name { font-size: 13px; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .file-size { font-size: 11px; color: #aaa; }
      .file-remove { background: none; border: none; color: #aaa; cursor: pointer; font-size: 18px; padding: 0 4px; }
      .file-remove:hover { color: var(--error); }
      .footer { display: flex; gap: 8px; justify-content: flex-end; }
      .footer .btn { padding: 8px 16px; font-size: 13px; }
    `,
    body: `
      <div class="upload-container">
        <div class="title" id="title">Upload File</div>
        <div class="dropzone" id="dropzone">
          <div class="dropzone-icon">\\u2601</div>
          <div class="dropzone-text">Drop files here or click to browse</div>
          <div class="dropzone-hint" id="hint"></div>
        </div>
        <input type="file" id="fileInput" style="display:none">
        <div class="file-list" id="fileList"></div>
        <div class="footer">
          <button class="btn btn-primary" id="uploadBtn" style="display:none">Upload</button>
          <button class="btn btn-secondary" id="closeBtn">Close</button>
        </div>
      </div>
    `,
    script: `
    let files = [];
    let config = {};

    app.ontoolinput = (params) => {
      const input = params.input;
      config = input;
      document.getElementById('title').textContent = input.title || 'Upload File';

      const hints = [];
      if (input.accept && input.accept.length) hints.push(input.accept.map(e => '.' + e).join(', '));
      if (input.max_size) hints.push('Max ' + formatSize(input.max_size));
      document.getElementById('hint').textContent = hints.join(' | ');

      const fileInput = document.getElementById('fileInput');
      if (input.accept) fileInput.accept = input.accept.map(e => '.' + e).join(',');
      if (input.multiple) fileInput.multiple = true;
    };

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(1) + ' MB';
    }

    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');

    dropzone.onclick = () => fileInput.click();
    dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('dragging'); };
    dropzone.ondragleave = () => dropzone.classList.remove('dragging');
    dropzone.ondrop = (e) => { e.preventDefault(); dropzone.classList.remove('dragging'); addFiles(e.dataTransfer.files); };
    fileInput.onchange = (e) => addFiles(e.target.files);

    function addFiles(fileList) {
      const arr = Array.from(fileList).filter(f => {
        if (config.max_size && f.size > config.max_size) return false;
        return true;
      });
      if (config.multiple) {
        files = [...files, ...arr];
      } else {
        files = arr.slice(0, 1);
      }
      renderFiles();
    }

    function renderFiles() {
      const container = document.getElementById('fileList');
      container.innerHTML = '';
      files.forEach((file, i) => {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.innerHTML =
          '<div><div class="file-name">' + file.name + '</div><div class="file-size">' + formatSize(file.size) + '</div></div>' +
          '<button class="file-remove" data-idx="' + i + '">\\u00D7</button>';
        div.querySelector('.file-remove').onclick = (e) => {
          e.stopPropagation();
          files.splice(i, 1);
          renderFiles();
        };
        container.appendChild(div);
      });
      document.getElementById('uploadBtn').style.display = files.length > 0 ? '' : 'none';
    }

    document.getElementById('uploadBtn').onclick = () => {
      const fileData = files.map(f => ({ name: f.name, size: f.size, type: f.type }));
      sendIntent('file_upload', { files: fileData });
    };
    document.getElementById('closeBtn').onclick = () => sendIntent('dismiss', {});
    `,
  })
}
