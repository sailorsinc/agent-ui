// ─── @avatarfirst/agent-ui — Shared HTML Infrastructure ──────────────
// CSS design system, animations, and base HTML wrapper used by all
// HTML builders. Provides MCP Apps messaging boilerplate.

export const CSS_VARS = `
  :root {
    --primary: #6c5ce7;
    --primary-hover: #5a4bd1;
    --primary-light: #f0edff;
    --text: #2d3436;
    --text-muted: #636e72;
    --bg: #f8f9fa;
    --card-bg: white;
    --border: #e8e8e8;
    --error: #e74c3c;
    --success: #00b894;
    --radius: 12px;
    --radius-sm: 8px;
  }
`

export const CSS_RESET = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg);
    padding: 16px;
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }
`

export const CSS_ANIMATIONS = `
  @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes popIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
`

export const CSS_BUTTONS = `
  .btn {
    padding: 13px; border: none; border-radius: var(--radius);
    font-size: 15px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: inherit;
  }
  .btn-primary { background: var(--primary); color: white; }
  .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(108,92,231,0.3); }
  .btn-secondary { background: white; color: var(--text-muted); border: 1.5px solid var(--border); }
  .btn-secondary:hover { background: #f5f5f5; }
`

export const CSS_TITLE = `
  .title { font-size: 18px; font-weight: 700; color: var(--text); }
`

const MCP_APPS_SCRIPT = `
    import { App } from 'https://esm.sh/@modelcontextprotocol/ext-apps@1.1.1';
    const app = new App({ name: 'avatarfirst-agent-ui', version: '1.0.0' });

    async function sendIntent(intent, data) {
      await app.sendMessage({
        role: 'user',
        content: [{ type: 'text', text: JSON.stringify({ intent, data }) }],
      });
    }
`

export interface BuildBaseHTMLOptions {
  css: string
  body: string
  script: string
  appName?: string
}

export function buildBaseHTML({ css, body, script, appName }: BuildBaseHTMLOptions): string {
  const appNameStr = appName || 'avatarfirst-agent-ui'
  return `<!DOCTYPE html>
<html>
<head>
<style>
${CSS_VARS}
${CSS_RESET}
${CSS_ANIMATIONS}
${CSS_BUTTONS}
${CSS_TITLE}
${css}
</style>
</head>
<body>
${body}
<script type="module">
    import { App } from 'https://esm.sh/@modelcontextprotocol/ext-apps@1.1.1';
    const app = new App({ name: '${appNameStr}', version: '1.0.0' });

    async function sendIntent(intent, data) {
      await app.sendMessage({
        role: 'user',
        content: [{ type: 'text', text: JSON.stringify({ intent, data }) }],
      });
    }

${script}

    await app.connect();
</script>
</body>
</html>`
}

// Escapes HTML special characters to prevent XSS in user-provided data
export function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
