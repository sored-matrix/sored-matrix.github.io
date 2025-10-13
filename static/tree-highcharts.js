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
      // Unified blue palette to match the site
      const BLUE_ROOT = '#1e3a8a';      // dark navy for root
      const BLUE_CAPITAL = '#2563eb';   // blue-600 for capitals
      const BLUE_DIMENSION = '#3b82f6'; // blue-500 for dimensions

      const dimensions = {
        'osiagniecia': { name: 'OSIĄGNIĘCIA', subtitle: 'edukacyjne', icon: 'bi-mortarboard-fill', color: BLUE_ROOT },
        
        // Capitals
        'kap_ludzki': { name: 'KAPITAŁ LUDZKI', subtitle: '', icon: 'bi-person-badge-fill', color: BLUE_CAPITAL },
        'kap_materialny': { name: 'KAPITAŁ MATERIALNY', subtitle: '', icon: 'bi-box-seam-fill', color: BLUE_CAPITAL },
        'kap_org': { name: 'KAPITAŁ ORGANIZACYJNY', subtitle: '', icon: 'bi-diagram-3-fill', color: BLUE_CAPITAL },
        'kap_rel': { name: 'KAPITAŁ RELACYJNY', subtitle: '', icon: 'bi-chat-dots-fill', color: BLUE_CAPITAL },
        'kap_int': { name: 'KAPITAŁ INTELEKTUALNY', subtitle: '', icon: 'bi-book-fill', color: BLUE_CAPITAL },
        
        // Dimensions
        'kadry': { name: 'KADRY', subtitle: '', icon: 'bi-person-badge-fill', color: BLUE_DIMENSION },
        'architektura': { name: 'ARCHITEKTURA', subtitle: '', icon: 'bi-building-fill', color: BLUE_DIMENSION },
        'zasoby': { name: 'ZASOBY', subtitle: '', icon: 'bi-box-seam-fill', color: BLUE_DIMENSION },
        'organizacja': { name: 'ORGANIZACJA', subtitle: '', icon: 'bi-diagram-3-fill', color: BLUE_DIMENSION },
        'uczestnictwo': { name: 'UCZESTNICTWO', subtitle: '', icon: 'bi-people-fill', color: BLUE_DIMENSION },
        'komunikacja': { name: 'KOMUNIKACJA', subtitle: '', icon: 'bi-chat-dots-fill', color: BLUE_DIMENSION },
        'cyfrowa': { name: 'CYFROWA', subtitle: '', icon: 'bi-laptop-fill', color: BLUE_DIMENSION },
        'dydaktyka': { name: 'DYDAKTYKA', subtitle: '', icon: 'bi-book-fill', color: BLUE_DIMENSION }
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

      const chart = Highcharts.chart(container, {
        chart: {
          type: 'organization',
          inverted: true, // Makes root appear on right
          height: 900,
          width: null, // full width
          marginLeft: 100,
          marginRight: 100,
          marginTop: 50,
          marginBottom: 50,
          backgroundColor: 'transparent'
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
          levels: [
            { level: 0, color: BLUE_ROOT }, 
            { level: 1, color: BLUE_CAPITAL }, 
            { level: 2, color: BLUE_DIMENSION }
          ],
          nodes: chartData.map(node => ({
            id: node.id,
            name: dimensions[node.id].name,
            title: dimensions[node.id].subtitle,
            color: dimensions[node.id].color,
            icon: dimensions[node.id].icon
          })),
          colorByPoint: false,
          nodeWidth: 360,
          dataLabels: {
            useHTML: true,
            formatter: function () {
              // Use this.point properties that we set in nodes
              const name = this.point.name || '';
              const subtitle = this.point.title || '';
              const icon = this.point.icon || 'bi-question-circle';
              return (
                '<div class="hc-node-card">' +
                '  <div class="hc-icon-circle">' +
                '    <i class="bi ' + icon + '"></i>' +
                '  </div>' +
                '  <div class="hc-text">' +
                '    <div class="hc-name">' + name + '</div>' +
                (subtitle ? ('    <div class="hc-subtitle">' + subtitle + '</div>') : '') +
                '  </div>' +
                '</div>'
              );
            }
          },
          borderColor: 'white',
          nodePadding: 25,
          linkLineWidth: 2,
          linkColor: '#cbd5e1'
        }]
      });

      // React to High Contrast toggle: black nodes, white text/links
      function applyContrastColors(isHC) {
        const nodes = chartData.map(n => ({ 
          id: n.id, 
          color: isHC ? '#000000' : dimensions[n.id].color 
        }));
        
        chart.update({ 
          chart: {
            backgroundColor: isHC ? '#ffffff' : 'transparent'
          },
          series: [{ 
            nodes, 
            linkColor: isHC ? '#ffffff' : '#cbd5e1',
            borderColor: isHC ? '#ffffff' : 'white',
            linkLineWidth: isHC ? 3 : 2
          }] 
        }, true, false);
        
        // Force repaint of cards in high contrast
        if (isHC) {
          document.querySelectorAll('.hc-node-card').forEach(card => {
            card.style.background = '#000';
            card.style.border = '2px solid #fff';
          });
          document.querySelectorAll('.hc-icon-circle').forEach(circle => {
            circle.style.background = '#000';
            circle.style.border = '2px solid #fff';
          });
          document.querySelectorAll('.hc-icon-circle i').forEach(icon => {
            icon.style.color = '#fff';
          });
          document.querySelectorAll('.hc-name, .hc-subtitle').forEach(text => {
            text.style.color = '#fff';
          });
        } else {
          // Reset to normal styles
          document.querySelectorAll('.hc-node-card').forEach(card => {
            card.style.background = '';
            card.style.border = '';
          });
          document.querySelectorAll('.hc-icon-circle').forEach(circle => {
            circle.style.background = '';
            circle.style.border = '';
          });
          document.querySelectorAll('.hc-icon-circle i').forEach(icon => {
            icon.style.color = '';
          });
          document.querySelectorAll('.hc-name, .hc-subtitle').forEach(text => {
            text.style.color = '';
          });
        }
      }

      // Observe body class changes to toggle high contrast for the chart
      const bodyObserver = new MutationObserver(() => {
        applyContrastColors(document.body.classList.contains('high-contrast'));
      });
      bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

      // Initial apply based on current mode
      applyContrastColors(document.body.classList.contains('high-contrast'));
    }
  });
})();

