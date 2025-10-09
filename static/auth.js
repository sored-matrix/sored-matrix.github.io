// Simple password protection for static site
// This is client-side protection - not cryptographically secure but provides basic access control

(function() {
    'use strict';
    
    // Password hash (SHA-256 of the password)
    // Default password: "sored2024"
    // To generate new hash, use: https://emn178.github.io/online-tools/sha256.html
    const PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // "admin"
    
    // Check if already authenticated in this session
    const isAuthenticated = sessionStorage.getItem('sored_auth') === 'true';
    
    if (!isAuthenticated) {
        // Hide the entire page content
        document.documentElement.style.visibility = 'hidden';
        
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
            <style>
                #password-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 99999;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                #password-box {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                }
                
                #password-box h2 {
                    color: #333;
                    margin-bottom: 10px;
                    font-size: 1.8rem;
                }
                
                #password-box p {
                    color: #666;
                    margin-bottom: 25px;
                    font-size: 0.95rem;
                }
                
                #password-input {
                    width: 100%;
                    padding: 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 1rem;
                    margin-bottom: 15px;
                    box-sizing: border-box;
                    transition: border-color 0.3s;
                }
                
                #password-input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                
                #password-submit {
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                #password-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }
                
                #password-submit:active {
                    transform: translateY(0);
                }
                
                #password-error {
                    color: #e74c3c;
                    font-size: 0.9rem;
                    margin-top: 10px;
                    min-height: 20px;
                }
                
                .shake {
                    animation: shake 0.5s;
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                .lock-icon {
                    font-size: 3rem;
                    margin-bottom: 20px;
                }
            </style>
            
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
        
        document.body.insertBefore(overlay, document.body.firstChild);
        
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
                setTimeout(() => {
                    overlay.remove();
                    document.documentElement.style.visibility = 'visible';
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
})();

