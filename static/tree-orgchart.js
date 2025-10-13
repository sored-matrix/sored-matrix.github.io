// OrgChartJS Diagram for Dimension Relationships
// Large round icons with small labels below; grouped by capitals to the right root

(function() {
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('orgchart-diagram');
    if (!container || typeof OrgChart === 'undefined') return;

    // Map for Bootstrap Icons to HTML
    const icon = (bi) => `<div class="oc-icon"><i class="bi ${bi}"></i></div>`;

    // Nodes definitions
    const nodes = [
      // Root on the right
      { id: 'root', name: 'OSIĄGNIĘCIA', title: 'EDUKACYJNE', bi: 'bi-mortarboard-fill', group: 'root' },

      // Capitals (middle layer)
      { id: 'kap_ludzki', name: 'Kapitał', title: 'ludzki', bi: 'bi-person-badge-fill', pid: 'root', dir: 'l' },
      { id: 'kap_materialny', name: 'Kapitał', title: 'materialny', bi: 'bi-box-seam-fill', pid: 'root', dir: 'l' },
      { id: 'kap_org', name: 'Kapitał', title: 'organizacyjny', bi: 'bi-diagram-3-fill', pid: 'root', dir: 'l' },
      { id: 'kap_rel', name: 'Kapitał', title: 'relacyjny', bi: 'bi-chat-dots-fill', pid: 'root', dir: 'l' },
      { id: 'kap_int', name: 'Kapitał', title: 'intelektualny', bi: 'bi-book-fill', pid: 'root', dir: 'l' },

      // Dimensions (leftmost)
      { id: 'kadry', name: 'KADRY', title: '', bi: 'bi-person-badge-fill', pid: 'kap_ludzki', dir: 'l' },
      { id: 'architektura', name: 'ARCHITEKTURA', title: '', bi: 'bi-building-fill', pid: 'kap_materialny', dir: 'l' },
      { id: 'zasoby', name: 'ZASOBY', title: '', bi: 'bi-box-seam-fill', pid: 'kap_materialny', dir: 'l' },
      { id: 'organizacja', name: 'ORGANIZACJA', title: '', bi: 'bi-diagram-3-fill', pid: 'kap_org', dir: 'l' },
      { id: 'uczestnictwo', name: 'UCZESTNICTWO', title: '', bi: 'bi-people-fill', pid: 'kap_org', dir: 'l' },
      { id: 'komunikacja', name: 'KOMUNIKACJA', title: '', bi: 'bi-chat-dots-fill', pid: 'kap_rel', dir: 'l' },
      { id: 'cyfrowa', name: 'CYFROWA', title: '', bi: 'bi-laptop-fill', pid: 'kap_rel', dir: 'l' },
      { id: 'dydaktyka', name: 'DYDAKTYKA', title: '', bi: 'bi-book-fill', pid: 'kap_int', dir: 'l' }
    ];

    // Custom template with big round icon and small label
    const template = Object.assign({}, OrgChart.templates.ana);
    template.size = [220, 120];
    template.node =
      '<rect x="0" y="0" width="220" height="120" rx="16" ry="16" fill="#ffffff" stroke="#e9eef5" stroke-width="0" filter="url(#ocShadow)" />' +
      '<g transform="translate(20,18)">'+
      '  <foreignObject width="64" height="64"><div class="oc-icon-wrap">{val-icon}</div></foreignObject>'+
      '  <g transform="translate(88,10)">'+
      '    <text class="oc-name" style="font-size:18px;font-weight:800;fill:#1f2a3a;">{val-name}</text>'+
      '    <text class="oc-title" style="font-size:12px;fill:#6b7280;dominant-baseline:hanging;" y="24">{val-title}</text>'+
      '  </g>'+
      '</g>';

    // Shadow filter
    template.defs =
      '<filter id="ocShadow" x="-50%" y="-50%" width="200%" height="200%">' +
      '  <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(0,0,0,0.18)" />' +
      '</filter>';

    // Fields mapping
    template.field_0 = '{val-name}';
    template.field_1 = '{val-title}';

    // Icon container style
    const style = document.createElement('style');
    style.innerHTML = `
      #orgchart-diagram .oc-icon-wrap { display:flex; align-items:center; justify-content:center; }
      #orgchart-diagram .oc-icon { width:64px; height:64px; border-radius:50%; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg, #6a11cb, #2575fc); box-shadow: 0 8px 20px rgba(37,117,252,.25); }
      #orgchart-diagram .oc-icon i { color:#fff; font-size:28px; }
      #orgchart-diagram .oc-name { text-transform:uppercase; letter-spacing:0.3px; }
    `;
    document.head.appendChild(style);

    // Instantiate chart
    const chart = new OrgChart(container, {
      template,
      nodeBinding: {
        field_0: 'name',
        field_1: 'title',
        "icon": 'icon'
      },
      enableSearch: false,
      mouseScrool: OrgChart.action.none,
      scaleInitial: OrgChart.match.boundary,
      siblingSeparation: 30,
      levelSeparation: 80,
      roots: ['root']
    });

    // Set icons HTML
    const data = nodes.map(n => Object.assign({}, n, { icon: icon(n.bi) }));

    chart.load(data);
  });
})();
