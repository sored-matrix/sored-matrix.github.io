// Highcharts Organization Chart for Dimension Relationships
// Large round icons with small labels; grouped by capitals flowing to the right root

(function() {
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('orgchart-diagram');
    if (!container || typeof Highcharts === 'undefined') return;

    // Watch for when relationships view becomes active
    const observer = new MutationObserver(() => {
      const relView = document.getElementById('relationships-view');
      if (relView && relView.classList.contains('active') && !container.dataset.initialized) {
        container.dataset.initialized = 'true';
        initChart();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });

    // Also check immediately in case view is already active
    const relView = document.getElementById('relationships-view');
    if (relView && relView.classList.contains('active') && !container.dataset.initialized) {
      container.dataset.initialized = 'true';
      initChart();
    }

    function initChart() {
      // Define dimension nodes with icons
      const dimensions = {
        'osiagniecia': { name: 'OSIĄGNIĘCIA', subtitle: 'edukacyjne', icon: 'bi-mortarboard-fill', color: '#6a11cb' },
        
        // Capitals
        'kap_ludzki': { name: 'Kapitał', subtitle: 'ludzki', icon: 'bi-person-badge-fill', color: '#8b5cf6' },
        'kap_materialny': { name: 'Kapitał', subtitle: 'materialny', icon: 'bi-box-seam-fill', color: '#3b82f6' },
        'kap_org': { name: 'Kapitał', subtitle: 'organizacyjny', icon: 'bi-diagram-3-fill', color: '#06b6d4' },
        'kap_rel': { name: 'Kapitał', subtitle: 'relacyjny', icon: 'bi-chat-dots-fill', color: '#10b981' },
        'kap_int': { name: 'Kapitał', subtitle: 'intelektualny', icon: 'bi-book-fill', color: '#f59e0b' },
        
        // Dimensions
        'kadry': { name: 'KADRY', subtitle: '', icon: 'bi-person-badge-fill', color: '#8b5cf6' },
        'architektura': { name: 'ARCHITEKTURA', subtitle: '', icon: 'bi-building-fill', color: '#3b82f6' },
        'zasoby': { name: 'ZASOBY', subtitle: '', icon: 'bi-box-seam-fill', color: '#3b82f6' },
        'organizacja': { name: 'ORGANIZACJA', subtitle: '', icon: 'bi-diagram-3-fill', color: '#06b6d4' },
        'uczestnictwo': { name: 'UCZESTNICTWO', subtitle: '', icon: 'bi-people-fill', color: '#06b6d4' },
        'komunikacja': { name: 'KOMUNIKACJA', subtitle: '', icon: 'bi-chat-dots-fill', color: '#10b981' },
        'cyfrowa': { name: 'CYFROWA', subtitle: '', icon: 'bi-laptop-fill', color: '#10b981' },
        'dydaktyka': { name: 'DYDAKTYKA', subtitle: '', icon: 'bi-book-fill', color: '#f59e0b' }
      };

      // Build hierarchical data structure
      const chartData = [
        // Root (rightmost)
        { id: 'osiagniecia', parent: '', level: 0 },
        
        // Capitals (middle layer) - children of root
        { id: 'kap_ludzki', parent: 'osiagniecia', level: 1 },
        { id: 'kap_materialny', parent: 'osiagniecia', level: 1 },
        { id: 'kap_org', parent: 'osiagniecia', level: 1 },
        { id: 'kap_rel', parent: 'osiagniecia', level: 1 },
        { id: 'kap_int', parent: 'osiagniecia', level: 1 },
        
        // Dimensions (leftmost) - children of capitals
        { id: 'kadry', parent: 'kap_ludzki', level: 2 },
        { id: 'architektura', parent: 'kap_materialny', level: 2 },
        { id: 'zasoby', parent: 'kap_materialny', level: 2 },
        { id: 'organizacja', parent: 'kap_org', level: 2 },
        { id: 'uczestnictwo', parent: 'kap_org', level: 2 },
        { id: 'komunikacja', parent: 'kap_rel', level: 2 },
        { id: 'cyfrowa', parent: 'kap_rel', level: 2 },
        { id: 'dydaktyka', parent: 'kap_int', level: 2 }
      ];

      Highcharts.chart(container, {
        chart: {
          type: 'organization',
          inverted: true, // Makes root appear on right
          height: 900,
          marginLeft: 50,
          marginRight: 50
        },
        title: {
          text: null
        },
        credits: {
          enabled: false
        },
        tooltip: {
          enabled: false
        },
        series: [{
          type: 'organization',
          name: 'Wymiary dostępności',
          keys: ['from', 'to'],
          data: chartData.map(node => {
            return node.parent ? [node.parent, node.id] : null;
          }).filter(Boolean),
          levels: [{
            level: 0,
            color: '#6a11cb',
            dataLabels: {
              color: 'white'
            },
            height: 25
          }, {
            level: 1,
            color: '#2575fc',
            dataLabels: {
              color: 'white'
            }
          }, {
            level: 2,
            color: '#6366f1'
          }],
          nodes: chartData.map(node => {
            const dim = dimensions[node.id];
            return {
              id: node.id,
              name: dim.name,
              title: dim.subtitle,
              color: dim.color,
              dataLabels: {
                useHTML: true,
                formatter: function() {
                  const d = dimensions[this.point.id];
                  return `
                    <div class="hc-node-card">
                      <div class="hc-icon-circle">
                        <i class="bi ${d.icon}"></i>
                      </div>
                      <div class="hc-text">
                        <div class="hc-name">${d.name}</div>
                        ${d.subtitle ? `<div class="hc-subtitle">${d.subtitle}</div>` : ''}
                      </div>
                    </div>
                  `;
                }
              }
            };
          }),
          colorByPoint: false,
          nodeWidth: 'auto',
          dataLabels: {
            color: 'white',
            nodeFormat: '{point.name}'
          },
          borderColor: 'white',
          nodePadding: 10,
          linkLineWidth: 2,
          linkColor: '#e5e7eb'
        }]
      });
    }
  });
})();

