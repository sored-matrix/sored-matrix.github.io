// Simple password protection for static site
// Password: "43fs3ag#"

const PASSWORD_HASH = 'f8f5b86da42d5d1af12f32ff3c54f51b04f1df88c78edf713104cd130412289c';

// Check if already authenticated
if (sessionStorage.getItem('sored_auth') === 'true') {
    // Remove auth-locked class
    document.body.classList.remove('auth-locked');
} else {
    // Show password prompt
    showPasswordPrompt();
}

async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function showPasswordPrompt() {
    // Create password prompt overlay
    const overlay = document.createElement('div');
    overlay.id = 'password-overlay';
    overlay.innerHTML = `
        <div id="password-box">
            <div class="lock-icon">🔒</div>
            <h2>SORED</h2>
            <p>System Oceny Rozwoju Edukacji Dostępnej</p>
            <p style="font-size: 0.85rem; color: #999;">Wprowadź hasło aby uzyskać dostęp</p>
            <form id="password-form">
                <input 
                    type="password" 
                    id="password-input" 
                    placeholder="Hasło"
                    autocomplete="off"
                    required
                />
                <button type="submit" id="password-submit">Zaloguj się</button>
                <div id="password-error"></div>
            </form>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Focus on input
    const input = document.getElementById('password-input');
    input.focus();
    
    // Handle form submission
    const form = document.getElementById('password-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const password = input.value;
        const errorDiv = document.getElementById('password-error');
        const submitBtn = document.getElementById('password-submit');
        
        // Disable submit button during check
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sprawdzanie...';
        
        // Hash the entered password
        const enteredHash = await hashPassword(password);
        
        if (enteredHash === PASSWORD_HASH) {
            // Correct password
            sessionStorage.setItem('sored_auth', 'true');
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.5s';
            document.body.classList.remove('auth-locked');
            setTimeout(() => {
                overlay.remove();
            }, 500);
        } else {
            // Wrong password
            errorDiv.textContent = 'Nieprawidłowe hasło';
            input.value = '';
            input.focus();
            
            // Shake animation
            const box = document.getElementById('password-box');
            box.classList.add('shake');
            setTimeout(() => box.classList.remove('shake'), 500);
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Zaloguj się';
        }
    });
}
