// ApexTree Top-to-Bottom Org Chart with Bootstrap Icons
(function() {
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('apextree-diagram');
    if (!container || typeof ApexTree === 'undefined') return;

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

      const data = {
        name: 'OSIĄGNIĘCIA\nedukacyjne',
        color: BLUE_ROOT,
        icon: 'bi-mortarboard-fill',
        children: [
          { name: 'KAPITAŁ LUDZKI', color: BLUE_CAPITAL, icon: 'bi-person-badge-fill', children: [ { name: 'KADRY', color: BLUE_DIM, icon: 'bi-person-badge-fill' } ] },
          { name: 'KAPITAŁ MATERIALNY', color: BLUE_CAPITAL, icon: 'bi-box-seam-fill', children: [ { name: 'ARCHITEKTURA', color: BLUE_DIM, icon: 'bi-building-fill' }, { name: 'ZASOBY', color: BLUE_DIM, icon: 'bi-box-seam-fill' } ] },
          { name: 'KAPITAŁ ORGANIZACYJNY', color: BLUE_CAPITAL, icon: 'bi-diagram-3-fill', children: [ { name: 'ORGANIZACJA', color: BLUE_DIM, icon: 'bi-diagram-3-fill' }, { name: 'UCZESTNICTWO', color: BLUE_DIM, icon: 'bi-people-fill' } ] },
          { name: 'KAPITAŁ RELACYJNY', color: BLUE_CAPITAL, icon: 'bi-chat-dots-fill', children: [ { name: 'KOMUNIKACJA', color: BLUE_DIM, icon: 'bi-chat-dots-fill' }, { name: 'CYFROWA', color: BLUE_DIM, icon: 'bi-laptop-fill' } ] },
          { name: 'KAPITAŁ INTELEKTUALNY', color: BLUE_CAPITAL, icon: 'bi-book-fill', children: [ { name: 'DYDAKTYKA', color: BLUE_DIM, icon: 'bi-book-fill' } ] }
        ]
      };

      const chart = new ApexTree.Tree(container, {
        layout: 'top-to-bottom',
        node: {
          width: 260,
          height: 100,
          spacingX: 30,
          spacingY: 50,
          template: (node) => {
            const icon = node.data.icon || 'bi-question-circle';
            const color = node.data.color || BLUE_DIM;
            const name = node.data.name || '';
            return (
              '<div class="apext-node" style="border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,.1);background:#fff;border:0;display:flex;align-items:center;gap:14px;padding:12px 16px;">' +
              '  <div class="apext-icon" style="width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6a11cb,#2575fc);">' +
              '    <i class="bi ' + icon + '" style="color:#fff;font-size:24px"></i>' +
              '  </div>' +
              '  <div class="apext-text" style="display:flex;flex-direction:column;gap:4px;">' +
              '    <div class="apext-name" style="font-size:14px;font-weight:800;color:#1f2a3a;text-transform:uppercase;line-height:1.2">' + name + '</div>' +
              '  </div>' +
              '</div>'
            );
          },
          connector: {
            color: '#cbd5e1',
            width: 2
          },
          getStyle: (node) => ({ background: node.data.color || BLUE_DIM })
        },
        data
      });

      // High contrast mode
      function applyHC() {
        const isHC = document.body.classList.contains('high-contrast');
        container.classList.toggle('apext-hc', isHC);
      }
      const hcObs = new MutationObserver(applyHC);
      hcObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      applyHC();
    }
  });
})();
