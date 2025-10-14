// Demo welcome screen (no password required)
(function() {
  // Check if user already dismissed the demo screen
  if (sessionStorage.getItem('demo-entered') === 'true') {
    document.body.classList.remove('auth-locked');
    return;
  }

  // Create demo overlay
  const overlay = document.createElement('div');
  overlay.id = 'demo-overlay';
  overlay.innerHTML = `
    <div id="demo-box">
      <div class="demo-icon">🎓</div>
      <h2>Wersja Demonstracyjna</h2>
      <p>To jest wersja demonstracyjna strony przygotowywana przez Instytut Badań Edukacyjnych (IBE) prezentująca wymiary edukacji włączającej.</p>
      <p>System SORED (System Oceny Rozwoju Edukacji Dostępnej) to kompleksowe narzędzie do oceny dziewięciu wymiarów dostępności w edukacji.</p>
      <button id="demo-enter-btn">Przejdź do wersji demonstracyjnej</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Handle enter button click
  document.getElementById('demo-enter-btn').addEventListener('click', function() {
    sessionStorage.setItem('demo-entered', 'true');
    document.body.classList.remove('auth-locked');
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s';
    setTimeout(() => overlay.remove(), 300);
  });
})();
