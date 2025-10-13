// ApexCharts treemap for relationships view with icons
(function() {
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('apex-diagram');
    if (!container || typeof ApexCharts === 'undefined') return;

    const relView = document.getElementById('relationships-view');
    function initIfActive() {
      if (relView && relView.classList.contains('active') && !container.dataset.initialized) {
        container.dataset.initialized = 'true';
        initChart();
      }
    }

    const observer = new MutationObserver(initIfActive);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
    initIfActive();

    function initChart() {
      const BLUE_ROOT = '#1e3a8a';
      const BLUE_CAPITAL = '#2563eb';
      const BLUE_DIM = '#3b82f6';

      const nodes = [
        { x: 'OSIĄGNIĘCIA\nedukacyjne', y: 9, color: BLUE_ROOT, icon: 'bi-mortarboard-fill' },
        { x: 'KAPITAŁ LUDZKI', y: 8, color: BLUE_CAPITAL, icon: 'bi-person-badge-fill' },
        { x: 'KAPITAŁ MATERIALNY', y: 8, color: BLUE_CAPITAL, icon: 'bi-box-seam-fill' },
        { x: 'KAPITAŁ ORGANIZACYJNY', y: 8, color: BLUE_CAPITAL, icon: 'bi-diagram-3-fill' },
        { x: 'KAPITAŁ RELACYJNY', y: 8, color: BLUE_CAPITAL, icon: 'bi-chat-dots-fill' },
        { x: 'KAPITAŁ INTELEKTUALNY', y: 8, color: BLUE_CAPITAL, icon: 'bi-book-fill' },
        { x: 'KADRY', y: 6, color: BLUE_DIM, icon: 'bi-person-badge-fill' },
        { x: 'ARCHITEKTURA', y: 6, color: BLUE_DIM, icon: 'bi-building-fill' },
        { x: 'ZASOBY', y: 6, color: BLUE_DIM, icon: 'bi-box-seam-fill' },
        { x: 'ORGANIZACJA', y: 6, color: BLUE_DIM, icon: 'bi-diagram-3-fill' },
        { x: 'UCZESTNICTWO', y: 6, color: BLUE_DIM, icon: 'bi-people-fill' },
        { x: 'KOMUNIKACJA', y: 6, color: BLUE_DIM, icon: 'bi-chat-dots-fill' },
        { x: 'CYFROWA', y: 6, color: BLUE_DIM, icon: 'bi-laptop-fill' },
        { x: 'DYDAKTYKA', y: 6, color: BLUE_DIM, icon: 'bi-book-fill' }
      ];

      const options = {
        chart: {
          type: 'treemap',
          height: 800,
          toolbar: { show: false },
          animations: { enabled: false }
        },
        legend: { show: false },
        tooltip: { enabled: false },
        dataLabels: {
          enabled: true,
          style: { fontSize: '14px', fontWeight: 800 },
          formatter: function(text, opts) { return text; }
        },
        plotOptions: {
          treemap: {
            distributed: true,
            enableShades: false,
            colorScale: { ranges: [] }
          }
        },
        series: [{ data: nodes }]
      };

      const chart = new ApexCharts(container, options);
      chart.render().then(() => placeIcons());

      function placeIcons() {
        // Create overlay container for icons
        let overlay = container.querySelector('.apex-icon-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'apex-icon-overlay';
          container.appendChild(overlay);
        }
        overlay.innerHTML = '';

        const rects = container.querySelectorAll('rect');
        rects.forEach((rect, idx) => {
          const node = nodes[idx];
          if (!node) return;
          const bounds = rect.getBoundingClientRect();
          const host = container.getBoundingClientRect();
          const iconDiv = document.createElement('div');
          iconDiv.className = 'apex-icon';
          iconDiv.style.left = (bounds.left - host.left + 10) + 'px';
          iconDiv.style.top = (bounds.top - host.top + 10) + 'px';
          iconDiv.innerHTML = '<i class="bi ' + node.icon + '"></i>';
          overlay.appendChild(iconDiv);
        });
      }

      // Reposition icons on resize
      window.addEventListener('resize', () => setTimeout(placeIcons, 100));

      // High contrast handling
      function applyHC() {
        const isHC = document.body.classList.contains('high-contrast');
        container.classList.toggle('apex-hc', isHC);
      }
      const hcObs = new MutationObserver(applyHC);
      hcObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      applyHC();
    }
  });
})();
