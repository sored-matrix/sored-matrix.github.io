// ApexTree org chart for relationships view with Bootstrap icons
(function() {
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('apextree-diagram');
    if (!container) return;

    function showFallback() {
      container.innerHTML = '<div class="text-center text-muted" style="padding:40px">Nie udało się wczytać wykresu. Spróbuj odświeżyć stronę.</div>';
    }

    // Wait for ApexTree to be attached to window by ESM loader
    function waitForApexTree(attempts = 0) {
      if (typeof ApexTree !== 'undefined') {
        initWhenActive();
      } else if (attempts < 50) {
        setTimeout(() => waitForApexTree(attempts + 1), 100);
      } else {
        showFallback();
      }
    }
    waitForApexTree();

    function initWhenActive() {
      const relView = document.getElementById('relationships-view');
      function checkAndInit() {
        if (relView && relView.classList.contains('active') && !container.dataset.initialized) {
          container.dataset.initialized = 'true';
          initChart();
        }
      }
      const observer = new MutationObserver(checkAndInit);
      observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
      checkAndInit();
    }

    function initChart() {
      const BLUE_ROOT = '#1e3a8a';
      const BLUE_CAPITAL = '#2563eb';
      const BLUE_DIM = '#3b82f6';

      // Data structure with id, data object, options, and children
      const data = {
        id: 'osiagniecia',
        data: {
          name: 'OSIĄGNIĘCIA\nedukacyjne',
          icon: 'bi-mortarboard-fill'
        },
        options: {
          nodeBGColor: BLUE_ROOT,
          nodeBGColorHover: BLUE_ROOT
        },
        children: [
          {
            id: 'kap_ludzki',
            data: { name: 'KAPITAŁ LUDZKI', icon: 'bi-person-badge-fill' },
            options: { nodeBGColor: BLUE_CAPITAL, nodeBGColorHover: BLUE_CAPITAL },
            children: [
              { id: 'kadry', data: { name: 'KADRY', icon: 'bi-person-badge-fill' }, options: { nodeBGColor: BLUE_DIM, nodeBGColorHover: BLUE_DIM } }
            ]
          },
          {
            id: 'kap_materialny',
            data: { name: 'KAPITAŁ MATERIALNY', icon: 'bi-box-seam-fill' },
            options: { nodeBGColor: BLUE_CAPITAL, nodeBGColorHover: BLUE_CAPITAL },
            children: [
              { id: 'architektura', data: { name: 'ARCHITEKTURA', icon: 'bi-building-fill' }, options: { nodeBGColor: BLUE_DIM, nodeBGColorHover: BLUE_DIM } },
              { id: 'zasoby', data: { name: 'ZASOBY', icon: 'bi-box-seam-fill' }, options: { nodeBGColor: BLUE_DIM, nodeBGColorHover: BLUE_DIM } }
            ]
          },
          {
            id: 'kap_org',
            data: { name: 'KAPITAŁ ORGANIZACYJNY', icon: 'bi-diagram-3-fill' },
            options: { nodeBGColor: BLUE_CAPITAL, nodeBGColorHover: BLUE_CAPITAL },
            children: [
              { id: 'organizacja', data: { name: 'ORGANIZACJA', icon: 'bi-diagram-3-fill' }, options: { nodeBGColor: BLUE_DIM, nodeBGColorHover: BLUE_DIM } },
              { id: 'uczestnictwo', data: { name: 'UCZESTNICTWO', icon: 'bi-people-fill' }, options: { nodeBGColor: BLUE_DIM, nodeBGColorHover: BLUE_DIM } }
            ]
          },
          {
            id: 'kap_rel',
            data: { name: 'KAPITAŁ RELACYJNY', icon: 'bi-chat-dots-fill' },
            options: { nodeBGColor: BLUE_CAPITAL, nodeBGColorHover: BLUE_CAPITAL },
            children: [
              { id: 'komunikacja', data: { name: 'KOMUNIKACJA', icon: 'bi-chat-dots-fill' }, options: { nodeBGColor: BLUE_DIM, nodeBGColorHover: BLUE_DIM } },
              { id: 'cyfrowa', data: { name: 'CYFROWA', icon: 'bi-laptop-fill' }, options: { nodeBGColor: BLUE_DIM, nodeBGColorHover: BLUE_DIM } }
            ]
          },
          {
            id: 'kap_int',
            data: { name: 'KAPITAŁ INTELEKTUALNY', icon: 'bi-book-fill' },
            options: { nodeBGColor: BLUE_CAPITAL, nodeBGColorHover: BLUE_CAPITAL },
            children: [
              { id: 'dydaktyka', data: { name: 'DYDAKTYKA', icon: 'bi-book-fill' }, options: { nodeBGColor: BLUE_DIM, nodeBGColorHover: BLUE_DIM } }
            ]
          }
        ]
      };

      const options = {
        contentKey: 'data',
        nodeWidth: 280,
        nodeHeight: 100,
        fontColor: '#1f2a3a',
        borderColor: '#e5e7eb',
        childrenSpacing: 40,
        siblingSpacing: 30,
        direction: 'top',
        nodeTemplate: (content) => {
          const name = content.name || '';
          const icon = content.icon || 'bi-question-circle';
          return `
            <div style="display:flex;align-items:center;gap:14px;padding:12px 16px;height:100%;border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,.1);">
              <div style="width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6a11cb,#2575fc);flex-shrink:0;">
                <i class="bi ${icon}" style="color:#fff;font-size:24px;"></i>
              </div>
              <div style="font-size:14px;font-weight:800;color:#1f2a3a;text-transform:uppercase;line-height:1.3;">${name}</div>
            </div>
          `;
        },
        canvasStyle: 'background:transparent;',
        enableToolbar: false
      };

      try {
        const tree = new ApexTree(container, options);
        tree.render(data);

        // High contrast mode
        function applyHC() {
          const isHC = document.body.classList.contains('high-contrast');
          container.classList.toggle('apext-hc', isHC);
        }
        const hcObs = new MutationObserver(applyHC);
        hcObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        applyHC();
      } catch (e) {
        console.error('ApexTree render error:', e);
        showFallback();
      }
    }
  });
})();
