import type { MapContainerData } from '../types.js'
import { buildBaseHTML } from './_shared.js'

export function buildMapHTML(data: MapContainerData): string {
  return buildBaseHTML({
    appName: 'agent-ui-map',
    css: `
      .map-container { background: white; border-radius: var(--radius); padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
      .title { margin-bottom: 12px; }
      .map-frame { width: 100%; height: 250px; border: none; border-radius: var(--radius-sm); }
      .locations { margin-top: 12px; display: flex; flex-direction: column; gap: 6px; }
      .loc-item { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 0; }
      .loc-pin { color: var(--error); font-size: 16px; }
      .loc-label { color: var(--text); font-weight: 500; }
      .loc-coords { color: var(--text-muted); font-size: 11px; }
      .footer { margin-top: 12px; display: flex; justify-content: flex-end; }
      .footer .btn { padding: 8px 16px; font-size: 13px; }
    `,
    body: `
      <div class="map-container">
        <div class="title" id="title">Map</div>
        <div id="mapArea"></div>
        <div class="locations" id="locations"></div>
        <div class="footer"><button class="btn btn-secondary" id="closeBtn">Close</button></div>
      </div>
    `,
    script: `
    app.ontoolinput = (params) => {
      const input = params.input;
      document.getElementById('title').textContent = input.title || 'Map';
      const locations = input.locations || [];

      const mapArea = document.getElementById('mapArea');
      if (locations.length > 0) {
        const center = locations[0];
        const markers = locations.map(l => l.lat + ',' + l.lng).join('|');
        const src = 'https://www.openstreetmap.org/export/embed.html?bbox=' +
          (center.lng - 0.02) + ',' + (center.lat - 0.02) + ',' +
          (center.lng + 0.02) + ',' + (center.lat + 0.02) +
          '&layer=mapnik&marker=' + center.lat + ',' + center.lng;
        mapArea.innerHTML = '<iframe class="map-frame" src="' + src + '"></iframe>';
      }

      const container = document.getElementById('locations');
      container.innerHTML = '';
      locations.forEach(loc => {
        const div = document.createElement('div');
        div.className = 'loc-item';
        div.innerHTML =
          '<span class="loc-pin">\\uD83D\\uDCCD</span>' +
          '<span class="loc-label">' + (loc.label || 'Location') + '</span>' +
          '<span class="loc-coords">(' + loc.lat.toFixed(4) + ', ' + loc.lng.toFixed(4) + ')</span>';
        container.appendChild(div);
      });
    };

    document.getElementById('closeBtn').onclick = () => sendIntent('dismiss', {});
    `,
  })
}
