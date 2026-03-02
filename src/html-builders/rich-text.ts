import type { RichTextContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildRichTextHTML(data: RichTextContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-rich-text',
    css: `
      .richtext { background: white; border-radius: var(--radius); padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        opacity: 0; animation: fadeIn 0.3s ease forwards; max-width: 600px; }
      .title { margin-bottom: 12px; }
      .content { font-size: 14px; line-height: 1.8; color: var(--text); }
      .content h1 { font-size: 22px; font-weight: 700; margin: 16px 0 8px; }
      .content h2 { font-size: 18px; font-weight: 700; margin: 14px 0 6px; }
      .content h3 { font-size: 16px; font-weight: 600; margin: 12px 0 4px; }
      .content p { margin-bottom: 10px; }
      .content ul, .content ol { padding-left: 20px; margin-bottom: 10px; }
      .content li { margin-bottom: 4px; }
      .content code { background: #f1f1f1; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: 'SF Mono', monospace; }
      .content pre { background: #1e1e2e; color: #cdd6f4; padding: 14px; border-radius: var(--radius-sm); overflow-x: auto; margin-bottom: 12px; }
      .content pre code { background: none; padding: 0; color: inherit; }
      .content blockquote { border-left: 3px solid var(--primary); padding-left: 14px; color: var(--text-muted); margin-bottom: 10px; }
      .content a { color: var(--primary); text-decoration: none; }
      .content a:hover { text-decoration: underline; }
      .content hr { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
      .content strong { font-weight: 600; }
      .content em { font-style: italic; }
      .footer { margin-top: 16px; display: flex; justify-content: flex-end; }
      .footer .btn { padding: 8px 16px; font-size: 13px; }
    `,
    body: `
      <div class="richtext">
        <div class="title" id="title"></div>
        <div class="content" id="content"></div>
        <div class="footer"><button class="btn btn-secondary" id="closeBtn">Close</button></div>
      </div>
    `,
    script: `
    function markdownToHTML(md) {
      let html = md;
      // Code blocks
      html = html.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');
      // Inline code
      html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
      // Headings
      html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
      html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
      html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
      // Bold & italic
      html = html.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
      html = html.replace(/\\*(.+?)\\*/g, '<em>$1</em>');
      // Links
      html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      // Blockquotes
      html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
      // Horizontal rule
      html = html.replace(/^---$/gm, '<hr>');
      // Unordered list
      html = html.replace(/^[\\-\\*] (.+)$/gm, '<li>$1</li>');
      html = html.replace(/((?:<li>.*<\\/li>\\n?)+)/g, '<ul>$1</ul>');
      // Paragraphs
      html = html.replace(/^(?!<[hupob]|<li|<hr|<pre|<ul|<ol)(.+)$/gm, '<p>$1</p>');
      return html;
    }

    app.ontoolinput = (params) => {
      const input = params.input;
      document.getElementById('title').textContent = input.title || '';
      document.getElementById('content').innerHTML = markdownToHTML(input.content || '');
    };

    document.getElementById('closeBtn').onclick = () => sendIntent('dismiss', {});
    `,
  })
}
