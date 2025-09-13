// CCNP Journey Terminal - Main JavaScript File

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTerminal();
    animateProgressBars();
    setupEventListeners();
    startMatrixRain();
});

// Boot sequence animation
function initializeTerminal() {
    // Typing effect for boot sequence
    setTimeout(() => {
        const bootText = document.querySelector('.boot-text');
        if (bootText) {
            bootText.style.opacity = '0.8';
        }
    }, 500);
}

// Progress bar animations
function animateProgressBars() {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
        });
    }, 1000);
}

// Copy code functionality
function copyCode() {
    const codeContent = document.querySelector('.code-content');
    if (codeContent) {
        const textToCopy = codeContent.textContent || codeContent.innerText;
        
        // Use modern clipboard API if available
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showCopyFeedback();
            }).catch(() => {
                // Fallback for older browsers
                fallbackCopyCode(textToCopy);
            });
        } else {
            fallbackCopyCode(textToCopy);
        }
    }
}

// Fallback copy method for older browsers
function fallbackCopyCode(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
}

// Show copy button feedback
function showCopyFeedback() {
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'COPIED!';
        copyBtn.style.color = '#00FF00';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.color = '#FFB000';
        }, 2000);
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Command line functionality
    const commandInput = document.querySelector('.command-input');
    if (commandInput) {
        commandInput.addEventListener('keypress', handleCommandInput);
        commandInput.addEventListener('focus', () => {
            commandInput.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
        });
        commandInput.addEventListener('blur', () => {
            commandInput.style.boxShadow = 'none';
        });
    }

    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Terminal control buttons (just for show)
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', handleTerminalControls);
    });
}

// Handle command line input
function handleCommandInput(e) {
    if (e.key === 'Enter') {
        const command = e.target.value.toLowerCase().trim();
        processCommand(command);
        e.target.value = '';
    }
}

// Process terminal commands
function processCommand(command) {
    const output = document.createElement('div');
    output.style.color = '#00FF00';
    output.style.marginTop = '10px';
    output.style.fontSize = '12px';

    switch(command) {
        case 'help':
            output.innerHTML = `
                Available commands:<br>
                • help - Show this help<br>
                • status - Show system status<br>
                • progress - Show CCNP progress<br>
                • clear - Clear terminal<br>
                • whoami - Display user info<br>
                • ls - List entries<br>
            `;
            break;
        case 'status':
            output.innerHTML = `
                [SYSTEM STATUS: OPERATIONAL]<br>
                [UPTIME: 45 days]<br>
                [MEMORY: 75% used]<br>
                [STORAGE: Learning mode active]<br>
            `;
            break;
        case 'progress':
            output.innerHTML = `
                CCNP Progress Report:<br>
                ├── ENCOR: 75% complete<br>
                ├── ENARSI: 45% complete<br>
                └── LABS: 20% complete<br>
                Next milestone: OSPF Redistribution
            `;
            break;
        case 'whoami':
            output.innerHTML = `
                User: Network Engineer in Training<br>
                Goal: CCNP Certification<br>
                Current Focus: OSPF & Routing Protocols<br>
                Mood: Caffeinated and Ready to Learn
            `;
            break;
        case 'ls':
            output.innerHTML = `
                Recent entries:<br>
                • ospf-area-config.md<br>
                • bgp-path-attributes.md<br>
                • eigrp-metrics.md<br>
                • stp-root-bridge.md<br>
            `;
            break;
        case 'clear':
            // Clear any previous command outputs
            const existingOutputs = document.querySelectorAll('.command-output');
            existingOutputs.forEach(el => el.remove());
            return;
        case '':
            return; // Don't show output for empty command
        default:
            output.innerHTML = `
                Command '${command}' not found.<br>
                Type 'help' for available commands.
            `;
            output.style.color = '#FFB000';
    }

    output.className = 'command-output';
    const commandLine = document.querySelector('.command-line');
    if (commandLine) {
        commandLine.parentNode.insertBefore(output, commandLine.nextSibling);
    }
}

// Handle navigation clicks
function handleNavigation(e) {
    e.preventDefault();
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    e.target.classList.add('active');
    
    // Here you would load different content based on the navigation
    const section = e.target.textContent;
    console.log(`Loading section: ${section}`);
    
    // Placeholder for future content loading
    showLoadingMessage(section);
}

// Show loading message for navigation
function showLoadingMessage(section) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = `
            <div style="color: #FFB000; text-align: center; padding: 20px;">
                Loading ${section} module...<br>
                <span style="color: #00FF00;">[████████████] 100%</span><br>
                Ready for implementation!
            </div>
        `;
        
        // Show loading message briefly
        const originalContent = mainContent.innerHTML;
        mainContent.innerHTML = loadingDiv.innerHTML;
        
        setTimeout(() => {
            mainContent.innerHTML = originalContent;
        }, 1500);
    }
}

// Handle terminal control buttons
function handleTerminalControls(e) {
    const control = e.target.classList;
    
    if (control.contains('close')) {
        // Add a fun "closing" effect
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '0.3';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 500);
    } else if (control.contains('minimize')) {
        // Minimize effect
        const terminal = document.querySelector('.terminal-body');
        terminal.style.transition = 'transform 0.3s';
        terminal.style.transform = 'scaleY(0.1)';
        setTimeout(() => {
            terminal.style.transform = 'scaleY(1)';
        }, 300);
    } else if (control.contains('maximize')) {
        // Maximize effect
        document.body.classList.toggle('fullscreen-mode');
    }
}

// Matrix rain effect (subtle)
function startMatrixRain() {
    setInterval(() => {
        if (Math.random() < 0.1) {
            createMatrixCharacter();
        }
    }, 1000);
}

// Create falling matrix characters
function createMatrixCharacter() {
    const chars = '0123456789ABCDEF';
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    const x = Math.random() * window.innerWidth;
    const y = -20; // Start above the screen
    
    const span = document.createElement('span');
    span.textContent = randomChar;
    span.style.position = 'fixed';
    span.style.left = x + 'px';
    span.style.top = y + 'px';
    span.style.color = '#00FF00';
    span.style.fontSize = '10px';
    span.style.opacity = '0.3';
    span.style.pointerEvents = 'none';
    span.style.zIndex = '999';
    span.style.transition = 'top 2s linear, opacity 2s linear';
    
    document.body.appendChild(span);
    
    // Animate the character falling
    setTimeout(() => {
        span.style.top = (window.innerHeight + 20) + 'px';
        span.style.opacity = '0';
    }, 100);
    
    // Remove the character after animation
    setTimeout(() => {
        if (span.parentNode) {
            span.parentNode.removeChild(span);
        }
    }, 2100);
}

// Utility function to add new journal entries (for future use)
function addJournalEntry(title, content, tags = [], difficulty = 1) {
    const entry = {
        title: title,
        content: content,
        tags: tags,
        difficulty: difficulty,
        date: new Date().toISOString().split('T')[0]
    };
    
    // This would integrate with your content management system
    console.log('New journal entry:', entry);
    return entry;
}

// Utility function to update progress (for future use)  
function updateProgress(category, percentage) {
    const progressBar = document.querySelector(`[data-category="${category}"] .progress-fill`);
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        
        const label = progressBar.parentNode.querySelector('.progress-label');
        if (label) {
            label.textContent = `${category.toUpperCase()} ${percentage}%`;
        }
    }
}

// Make functions available globally for HTML onclick handlers
window.copyCode = copyCode;
window.addJournalEntry = addJournalEntry;
window.updateProgress = updateProgress;