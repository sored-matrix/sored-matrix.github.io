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
        nodeWidth: 1000,
        nodeHeight: 350,
        fontColor: '#ffffff',
        borderColor: '#cbd5e1',
        borderWidth: 8,
        childrenSpacing: 100,
        siblingSpacing: 80,
        direction: 'top',
        nodeTemplate: (content, node) => {
          const name = content.name || '';
          const icon = content.icon || 'bi-question-circle';
          const isCapital = name.startsWith('KAPITAŁ');
          
          if (isCapital) {
            // Kapitały bez ikon - tylko tekst wycentrowany
            return `
              <div style="display:flex;align-items:center;justify-content:center;padding:50px 70px;height:100%;border-radius:28px;box-shadow:0 12px 40px rgba(0,0,0,.3);">
                <div style="font-size:64px;font-weight:900;color:#fff;text-transform:uppercase;line-height:1.1;text-align:center;text-shadow:0 4px 8px rgba(0,0,0,.4);">${name}</div>
              </div>
            `;
          } else {
            // Root i wymiary z ikonami
            return `
              <div style="display:flex;align-items:center;gap:50px;padding:50px 70px;height:100%;border-radius:28px;box-shadow:0 12px 40px rgba(0,0,0,.3);">
                <div style="width:240px;height:240px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.3);flex-shrink:0;box-shadow:0 8px 24px rgba(0,0,0,.25);">
                  <i class="bi ${icon}" style="color:#fff;font-size:130px;"></i>
                </div>
                <div style="font-size:64px;font-weight:900;color:#fff;text-transform:uppercase;line-height:1.1;text-shadow:0 4px 8px rgba(0,0,0,.4);">${name}</div>
              </div>
            `;
          }
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
