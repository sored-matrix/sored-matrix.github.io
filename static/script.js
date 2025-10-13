// Font Size Toggle
const fontSizeToggle = document.getElementById('font-size-toggle');
const contrastToggle = document.getElementById('contrast-toggle');
const body = document.body;

// Font size states: normal, medium, large
const fontSizes = ['normal', 'medium', 'large'];
let currentFontSizeIndex = 0;

// Load saved font size preference
const savedFontSize = localStorage.getItem('fontSize');
if (savedFontSize) {
    currentFontSizeIndex = fontSizes.indexOf(savedFontSize);
    if (currentFontSizeIndex === -1) currentFontSizeIndex = 0;
    body.classList.add('font-size-' + fontSizes[currentFontSizeIndex]);
    updateFontSizeButton();
}

// Function to update font size button text
function updateFontSizeButton() {
    const btn = fontSizeToggle.querySelector('.btn-text');
    if (currentFontSizeIndex === 0) {
        btn.textContent = 'A+';
    } else if (currentFontSizeIndex === 1) {
        btn.textContent = 'A++';
    } else {
        btn.textContent = 'A+++';
    }
}

// Toggle font size
fontSizeToggle.addEventListener('click', function() {
    // Remove current font size class
    body.classList.remove('font-size-' + fontSizes[currentFontSizeIndex]);
    
    // Move to next size (cycle through)
    currentFontSizeIndex = (currentFontSizeIndex + 1) % fontSizes.length;
    
    // Add new font size class
    body.classList.add('font-size-' + fontSizes[currentFontSizeIndex]);
    
    // Update button
    updateFontSizeButton();
    
    // Save preference
    localStorage.setItem('fontSize', fontSizes[currentFontSizeIndex]);
    
    // Announce change to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Rozmiar czcionki: ' + 
        (currentFontSizeIndex === 0 ? 'normalny' : 
         currentFontSizeIndex === 1 ? 'średni' : 'duży');
    body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
});

// High Contrast Toggle

// Check for system preference for high contrast
const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

// Check for saved preference
const savedContrast = localStorage.getItem('highContrast');

// Apply high contrast if either system prefers it or user saved preference
if (savedContrast === 'true' || (savedContrast === null && prefersHighContrast)) {
    body.classList.add('high-contrast');
    contrastToggle.setAttribute('aria-pressed', 'true');
} else {
    contrastToggle.setAttribute('aria-pressed', 'false');
}

// Listen for system preference changes
window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set a manual preference
    if (localStorage.getItem('highContrast') === null) {
        if (e.matches) {
            body.classList.add('high-contrast');
            contrastToggle.setAttribute('aria-pressed', 'true');
        } else {
            body.classList.remove('high-contrast');
            contrastToggle.setAttribute('aria-pressed', 'false');
        }
    }
});

// Toggle high contrast mode
contrastToggle.addEventListener('click', function() {
    body.classList.toggle('high-contrast');
    const isHighContrast = body.classList.contains('high-contrast');
    
    // Save preference
    localStorage.setItem('highContrast', isHighContrast);
    
    // Update ARIA state
    contrastToggle.setAttribute('aria-pressed', isHighContrast);
    
    // Announce change to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = isHighContrast ? 
        'Tryb wysokiego kontrastu włączony' : 
        'Tryb wysokiego kontrastu wyłączony';
    body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
});

// Card Click Handlers for Indicators
const dimensionCards = document.querySelectorAll('.dimension-card');
const indicatorSection = document.getElementById('indicators-section');
const indicatorContent = document.getElementById('indicator-content');

// Load indicator data from JSON file
let indicatorData = {};
let definitionsData = {};
let dataLoaded = false;

// Fetch indicators from JSON
fetch('static/indicators_for_website.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        indicatorData = data;
        console.log('Indicators loaded successfully', Object.keys(data));
        
        // Also fetch definitions
        return fetch('static/indicator_definitions.json');
    })
    .then(response => response.json())
    .then(data => {
        definitionsData = data;
        dataLoaded = true;
        console.log('Definitions loaded successfully', Object.keys(data).length, 'definitions');
    })
    .catch(error => {
        console.error('Error loading data:', error);
        dataLoaded = true;
        // Fallback to empty data if file not found
        indicatorData = {};
        definitionsData = {};
    });

// Function to display indicators
function showIndicators(dimension) {
    if (!dataLoaded) {
        console.log('Data not loaded yet, waiting...');
        setTimeout(() => showIndicators(dimension), 100);
        return;
    }
    
    const data = indicatorData[dimension];
    if (!data || !data.indicators || data.indicators.length === 0) {
        console.log('No data found for dimension:', dimension);
        indicatorContent.innerHTML = '<p class="text-center text-muted">Brak wskaźników dla tego wymiaru</p>';
        return;
    }
    
    // Build HTML for indicators
    let html = `
        <h3 class="mb-4 text-center">${data.title}</h3>
        <div class="row">
    `;
    
    data.indicators.forEach((indicator, index) => {
        // Remove leading numbers (e.g., "1. ", "2. ")
        let cleanedIndicator = indicator.replace(/^\d+\.\s*/, '');
        
        // Capitalize first letter
        cleanedIndicator = cleanedIndicator.charAt(0).toUpperCase() + cleanedIndicator.slice(1);
        
        // Preserve line breaks by converting \n to <br>
        const formattedIndicator = cleanedIndicator.replace(/\n/g, '<br>');
        
        html += `
            <div class="col-md-4 mb-3">
                <div class="indicator-item">
                    <i class="bi bi-check-circle-fill indicator-icon"></i>
                    <p>${formattedIndicator}</p>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    indicatorContent.innerHTML = html;
    
    console.log('Indicators displayed, scrolling to section...');
    
    // Smooth scroll to indicators section (respecting reduced motion preference)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
        indicatorSection.scrollIntoView({ 
            behavior: prefersReducedMotion ? 'auto' : 'smooth', 
            block: 'start' 
        });
    }, 100);
}

// Add click event listeners to all dimension cards
dimensionCards.forEach(card => {
    card.addEventListener('click', function() {
        const dimension = this.getAttribute('data-dimension');
        console.log('Card clicked, dimension:', dimension);
        showIndicators(dimension);
        
        // Add active state to clicked card
        dimensionCards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
    });
    
    // Add keyboard support
    card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

console.log('Card click handlers attached to', dimensionCards.length, 'cards');

// Full dimension titles with subtitles
const dimensionFullTitles = {
    'osiagniecia': 'OSIĄGNIĘCIA EDUKACYJNE wynikające z realizacji edukacji dostępnej',
    'uczestnictwo': 'UCZESTNICTWO umożliwiające pełen rozwój',
    'dydaktyka': 'DYDAKTYKA zapewniająca dostępność procesu edukacyjnego',
    'kadry': 'KADRY realizujące edukację dostępną',
    'zasoby': 'ZASOBY umożliwiające dostępność',
    'organizacja': 'ORGANIZACJA sprzyjająca dostępności',
    'architektura': 'ARCHITEKTURA zapewniająca dostępność',
    'cyfrowa': 'CYFROWA dostępność usług',
    'komunikacja': 'KOMUNIKACJA bez barier'
};

// Load definitions when modal is shown
const definitionsModal = document.getElementById('definitionsModal');
definitionsModal.addEventListener('show.bs.modal', function () {
    const modalBody = document.querySelector('#definitionsModalBody .definitions-list');
    
    if (!dataLoaded) {
        modalBody.innerHTML = '<p class="text-center text-muted">Ładowanie definicji...</p>';
        return;
    }
    
    if (Object.keys(definitionsData).length === 0 || Object.keys(indicatorData).length === 0) {
        modalBody.innerHTML = '<p class="text-center text-muted">Brak dostępnych definicji</p>';
        return;
    }
    
    // Build HTML - now definitionsData contains wymiar title -> definition mapping
    let html = '';
    let count = 0;
    
    // Iterate through dimensions in order
    for (const [dimension, data] of Object.entries(indicatorData)) {
        const fullTitle = dimensionFullTitles[dimension] || data.title;
        
        // Find definition for this wymiar by matching titles
        let definition = null;
        for (const [wymiarKey, def] of Object.entries(definitionsData)) {
            // Match by checking if wymiarKey contains the dimension title or vice versa
            const wymiarKeyUpper = wymiarKey.toUpperCase();
            const dataTitleUpper = data.title.toUpperCase();
            
            // Check if they share the main keyword
            if (wymiarKeyUpper.includes(dataTitleUpper.split(' ')[0]) || 
                dataTitleUpper.includes(wymiarKeyUpper.split(' ')[0])) {
                definition = def;
                break;
            }
        }
        
        if (!definition) {
            console.log('No definition found for:', dimension, data.title);
            continue; // Skip dimensions without definitions
        }
        
        count++;
        
        // Add dimension with its definition as header + text
        html += `
            <div class="dimension-definition-block">
                <h5 class="dimension-header">${fullTitle}</h5>
                <p class="definition-text">${definition}</p>
            </div>
        `;
    }
    
    if (html === '') {
        modalBody.innerHTML = '<p class="text-center text-muted">Brak dostępnych definicji</p>';
    } else {
        modalBody.innerHTML = html;
    }
});

