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

// Content management integration
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code...
    
    // Load dynamic content
    if (typeof contentManager !== 'undefined') {
        contentManager.displayEntries();
    }
});

// Add search functionality to existing command processor
const originalProcessCommand = processCommand;
processCommand = function(command) {
    if (command.startsWith('search ')) {
        const query = command.substring(7);
        searchEntries(query);
        return;
    }
    originalProcessCommand(command);
};

function searchEntries(query) {
    // Implementation for searching through entries
    const entries = document.querySelectorAll('.journal-entry');
    let results = [];
    
    entries.forEach(entry => {
        const text = entry.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            results.push(entry.querySelector('.entry-header').textContent);
        }
    });
    
    const output = document.createElement('div');
    output.className = 'command-output';
    output.style.color = '#00FF00';
    output.style.marginTop = '10px';
    output.style.fontSize = '12px';
    
    if (results.length > 0) {
        output.innerHTML = `
            Search results for "${query}":<br>
            ${results.map(result => `• ${result}`).join('<br>')}
        `;
    } else {
        output.innerHTML = `No entries found matching "${query}"`;
        output.style.color = '#FFB000';
    }
    
    const commandLine = document.querySelector('.command-line');
    commandLine.parentNode.insertBefore(output, commandLine.nextSibling);
}

// Advanced Search System for CCNP Journey Terminal
// Add this to your existing main.js file

// Enhanced search functionality
class AdvancedSearch {
    constructor(entries) {
        this.entries = entries;
        this.searchHistory = [];
        this.filters = {
            tags: [],
            categories: [],
            difficulty: null,
            status: null,
            dateRange: null
        };
    }

    // Main search function with advanced features
    search(query, options = {}) {
        let results = [...this.entries];
        
        // Apply text search
        if (query) {
            results = this.textSearch(results, query);
        }
        
        // Apply filters
        if (options.tags && options.tags.length > 0) {
            results = this.filterByTags(results, options.tags);
        }
        
        if (options.category) {
            results = this.filterByCategory(results, options.category);
        }
        
        if (options.difficulty) {
            results = this.filterByDifficulty(results, options.difficulty);
        }
        
        if (options.status) {
            results = this.filterByStatus(results, options.status);
        }
        
        if (options.dateRange) {
            results = this.filterByDateRange(results, options.dateRange);
        }
        
        // Sort results by relevance
        results = this.sortByRelevance(results, query);
        
        // Store search in history
        this.searchHistory.push({ query, options, results: results.length, timestamp: new Date() });
        
        return results;
    }

    // Text search through title, content, and tags
    textSearch(entries, query) {
        const searchTerm = query.toLowerCase();
        return entries.filter(entry => {
            return (
                entry.title.toLowerCase().includes(searchTerm) ||
                entry.content.toLowerCase().includes(searchTerm) ||
                entry.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                entry.category.toLowerCase().includes(searchTerm)
            );
        });
    }

    // Filter by tags (AND operation)
    filterByTags(entries, tags) {
        return entries.filter(entry => 
            tags.every(tag => 
                entry.tags.some(entryTag => 
                    entryTag.toLowerCase().includes(tag.toLowerCase())
                )
            )
        );
    }

    // Filter by category
    filterByCategory(entries, category) {
        return entries.filter(entry => 
            entry.category.toLowerCase().includes(category.toLowerCase())
        );
    }

    // Filter by difficulty level
    filterByDifficulty(entries, difficulty) {
        if (difficulty.includes('-')) {
            const [min, max] = difficulty.split('-').map(Number);
            return entries.filter(entry => entry.difficulty >= min && entry.difficulty <= max);
        }
        return entries.filter(entry => entry.difficulty === parseInt(difficulty));
    }

    // Filter by status
    filterByStatus(entries, status) {
        return entries.filter(entry => 
            entry.status.toLowerCase() === status.toLowerCase()
        );
    }

    // Filter by date range
    filterByDateRange(entries, dateRange) {
        const [startDate, endDate] = dateRange.split(':');
        return entries.filter(entry => {
            const entryDate = new Date(entry.date);
            const start = new Date(startDate);
            const end = endDate ? new Date(endDate) : new Date();
            return entryDate >= start && entryDate <= end;
        });
    }

    // Sort results by relevance score
    sortByRelevance(entries, query) {
        if (!query) return entries;
        
        return entries.sort((a, b) => {
            const scoreA = this.calculateRelevanceScore(a, query);
            const scoreB = this.calculateRelevanceScore(b, query);
            return scoreB - scoreA;
        });
    }

    // Calculate relevance score for search results
    calculateRelevanceScore(entry, query) {
        const searchTerm = query.toLowerCase();
        let score = 0;
        
        // Title matches get highest score
        if (entry.title.toLowerCase().includes(searchTerm)) score += 10;
        
        // Tag matches get high score
        entry.tags.forEach(tag => {
            if (tag.toLowerCase().includes(searchTerm)) score += 5;
        });
        
        // Content matches get lower score
        const contentMatches = (entry.content.toLowerCase().match(new RegExp(searchTerm, 'g')) || []).length;
        score += contentMatches;
        
        // Recent entries get slight boost
        const daysSinceEntry = (new Date() - new Date(entry.date)) / (1000 * 60 * 60 * 24);
        if (daysSinceEntry < 7) score += 2;
        
        return score;
    }

    // Get search suggestions based on existing content
    getSuggestions(partial) {
        const suggestions = new Set();
        const partialLower = partial.toLowerCase();
        
        this.entries.forEach(entry => {
            // Add matching tags
            entry.tags.forEach(tag => {
                if (tag.toLowerCase().includes(partialLower)) {
                    suggestions.add(tag.toLowerCase());
                }
            });
            
            // Add matching words from titles
            entry.title.toLowerCase().split(' ').forEach(word => {
                if (word.includes(partialLower) && word.length > 3) {
                    suggestions.add(word);
                }
            });
        });
        
        return Array.from(suggestions).slice(0, 5);
    }

    // Get popular tags
    getPopularTags() {
        const tagCounts = {};
        this.entries.forEach(entry => {
            entry.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        
        return Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([tag]) => tag);
    }

    // Get search statistics
    getSearchStats() {
        return {
            totalSearches: this.searchHistory.length,
            uniqueQueries: new Set(this.searchHistory.map(s => s.query)).size,
            mostSearched: this.getMostSearchedTerms(),
            recentSearches: this.searchHistory.slice(-5)
        };
    }

    getMostSearchedTerms() {
        const termCounts = {};
        this.searchHistory.forEach(search => {
            if (search.query) {
                termCounts[search.query] = (termCounts[search.query] || 0) + 1;
            }
        });
        
        return Object.entries(termCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([term]) => term);
    }
}

// Initialize advanced search
let advancedSearch;
document.addEventListener('DOMContentLoaded', function() {
    // Wait for journalEntries to be available
    setTimeout(() => {
        if (typeof journalEntries !== 'undefined') {
            advancedSearch = new AdvancedSearch(journalEntries);
        }
    }, 100);
});

// Enhanced command processor - replace your existing processCommand function
function processCommand(command) {
    const output = document.createElement('div');
    output.style.color = '#00FF00';
    output.style.marginTop = '10px';
    output.style.fontSize = '12px';
    output.className = 'command-output';

    // Parse advanced search commands
    if (command.startsWith('search ')) {
        const searchInput = command.substring(7);
        handleAdvancedSearch(searchInput, output);
    } else if (command.startsWith('filter ')) {
        const filterInput = command.substring(7);
        handleFilterCommand(filterInput, output);
    } else if (command.startsWith('find ')) {
        const findInput = command.substring(5);
        handleQuickFind(findInput, output);
    } else {
        // Handle your existing commands
        switch(command) {
            case 'help':
                output.innerHTML = `
                    <span style="color: #00FFFF;">CCNP Terminal Search System v2.0</span><br><br>
                    <span style="color: #FFB000;">Basic Commands:</span><br>
                    • help - Show this help<br>
                    • status - Show system status<br>
                    • progress - Show CCNP progress<br>
                    • ls - List entries<br>
                    • clear - Clear terminal<br><br>
                    
                    <span style="color: #FFB000;">Search Commands:</span><br>
                    • search [term] - Basic text search<br>
                    • search "exact phrase" - Exact phrase search<br>
                    • find ospf routing - Quick multi-term search<br>
                    • filter tag:OSPF - Filter by tag<br>
                    • filter difficulty:3-5 - Filter by difficulty range<br>
                    • filter status:completed - Filter by status<br>
                    • filter date:2025-09-01:2025-09-15 - Date range<br><br>
                    
                    <span style="color: #FFB000;">Advanced Search:</span><br>
                    • search-stats - Show search statistics<br>
                    • popular-tags - Show most used tags<br>
                    • suggest [partial] - Get search suggestions<br>
                    • search-history - Show recent searches<br>
                `;
                break;
            
            case 'search-stats':
                if (advancedSearch) {
                    const stats = advancedSearch.getSearchStats();
                    output.innerHTML = `
                        <span style="color: #00FFFF;">Search Statistics</span><br>
                        ├── Total searches: ${stats.totalSearches}<br>
                        ├── Unique queries: ${stats.uniqueQueries}<br>
                        ├── Most searched: ${stats.mostSearched.join(', ') || 'None yet'}<br>
                        └── Database: ${journalEntries.length} entries indexed<br>
                    `;
                }
                break;
            
            case 'popular-tags':
                if (advancedSearch) {
                    const tags = advancedSearch.getPopularTags();
                    output.innerHTML = `
                        <span style="color: #00FFFF;">Popular Tags</span><br>
                        ${tags.map(tag => `<span class="tag" style="margin: 2px;">${tag}</span>`).join(' ')}<br><br>
                        Use: <code>filter tag:${tags[0]}</code>
                    `;
                }
                break;
            
            case 'search-history':
                if (advancedSearch) {
                    const recent = advancedSearch.searchHistory.slice(-5).reverse();
                    output.innerHTML = `
                        <span style="color: #00FFFF;">Recent Searches</span><br>
                        ${recent.map(search => 
                            `• "${search.query}" - ${search.results} results`
                        ).join('<br>') || 'No searches yet'}
                    `;
                }
                break;

            case 'status':
                const completed = journalEntries ? journalEntries.filter(e => e.status === 'completed').length : 0;
                const inProgress = journalEntries ? journalEntries.filter(e => e.status === 'in-progress').length : 0;
                output.innerHTML = `
                    [SYSTEM STATUS: OPERATIONAL]<br>
                    [SEARCH ENGINE: ADVANCED v2.0]<br>
                    [ENTRIES INDEXED: ${journalEntries ? journalEntries.length : 0}]<br>
                    [COMPLETED: ${completed}] [IN PROGRESS: ${inProgress}]<br>
                    [UPTIME: 45 days]<br>
                `;
                break;

            case 'ls':
                if (journalEntries) {
                    output.innerHTML = `
                        <span style="color: #00FFFF;">Entry Database</span><br>
                        ${journalEntries.slice(0, 5).map(entry => 
                            `• ${entry.title} <span style="color: #FFB000;">[${entry.tags.slice(0, 2).join(', ')}]</span>`
                        ).join('<br>')}<br>
                        <br>Total: ${journalEntries.length} entries | Use 'search [term]' to find specific content
                    `;
                }
                break;

            case 'clear':
                const existingOutputs = document.querySelectorAll('.command-output');
                existingOutputs.forEach(el => el.remove());
                return;

            case '':
                return;

            default:
                // Check if it might be a search suggestion
                if (command.startsWith('suggest ')) {
                    const partial = command.substring(8);
                    if (advancedSearch) {
                        const suggestions = advancedSearch.getSuggestions(partial);
                        output.innerHTML = `
                            Suggestions for "${partial}":<br>
                            ${suggestions.map(suggestion => 
                                `• <span style="color: #00FFFF; cursor: pointer;" onclick="runSuggestion('${suggestion}')">${suggestion}</span>`
                            ).join('<br>') || 'No suggestions found'}
                        `;
                    }
                } else {
                    output.innerHTML = `
                        Command '${command}' not found.<br>
                        Type 'help' for available commands or 'search [term]' to search entries.
                    `;
                    output.style.color = '#FFB000';
                }
        }
    }

    const commandLine = document.querySelector('.command-line');
    if (commandLine) {
        commandLine.parentNode.insertBefore(output, commandLine.nextSibling);
    }
}

// Handle advanced search commands
function handleAdvancedSearch(searchInput, output) {
    if (!advancedSearch) {
        output.innerHTML = 'Search engine not ready. Please wait...';
        output.style.color = '#FFB000';
        return;
    }
    
    let query = searchInput;
    let options = {};
    
    // Parse quoted phrases
    const phraseMatch = searchInput.match(/"([^"]+)"/);
    if (phraseMatch) {
        query = phraseMatch[1];
        // Exact phrase search would need more sophisticated implementation
    }
    
    const results = advancedSearch.search(query, options);
    displaySearchResults(results, query, output);
}

// Handle filter commands
function handleFilterCommand(filterInput, output) {
    if (!advancedSearch) {
        output.innerHTML = 'Search engine not ready. Please wait...';
        output.style.color = '#FFB000';
        return;
    }
    
    const options = parseFilterOptions(filterInput);
    const results = advancedSearch.search('', options);
    displaySearchResults(results, `Filter: ${filterInput}`, output);
}

// Handle quick find (multiple terms)
function handleQuickFind(findInput, output) {
    if (!advancedSearch) {
        output.innerHTML = 'Search engine not ready. Please wait...';
        output.style.color = '#FFB000';
        return;
    }
    
    const terms = findInput.split(' ');
    let results = journalEntries;
    
    // Find entries that contain ALL terms
    terms.forEach(term => {
        results = advancedSearch.textSearch(results, term);
    });
    
    displaySearchResults(results, `Find: ${findInput}`, output);
}

// Parse filter options from command
function parseFilterOptions(filterInput) {
    const options = {};
    
    if (filterInput.includes('tag:')) {
        const tagMatch = filterInput.match(/tag:(\w+)/);
        if (tagMatch) options.tags = [tagMatch[1]];
    }
    
    if (filterInput.includes('difficulty:')) {
        const diffMatch = filterInput.match(/difficulty:([\d-]+)/);
        if (diffMatch) options.difficulty = diffMatch[1];
    }
    
    if (filterInput.includes('status:')) {
        const statusMatch = filterInput.match(/status:(\w+)/);
        if (statusMatch) options.status = statusMatch[1];
    }
    
    if (filterInput.includes('date:')) {
        const dateMatch = filterInput.match(/date:([\d-:]+)/);
        if (dateMatch) options.dateRange = dateMatch[1];
    }
    
    if (filterInput.includes('category:')) {
        const catMatch = filterInput.match(/category:(\w+)/);
        if (catMatch) options.category = catMatch[1];
    }
    
    return options;
}

// Display search results in cyberpunk style
function displaySearchResults(results, query, output) {
    if (results.length === 0) {
        output.innerHTML = `
            <span style="color: #FFB000;">No results found for "${query}"</span><br>
            Try: • Different keywords • 'popular-tags' to see available tags • 'help' for search syntax
        `;
        return;
    }
    
    const maxResults = 5;
    const displayResults = results.slice(0, maxResults);
    
    output.innerHTML = `
        <span style="color: #00FFFF;">Search Results for "${query}" (${results.length} found)</span><br>
        ${displayResults.map((entry, index) => `
            <div style="margin: 10px 0; padding: 10px; border-left: 2px solid #00FF00; background: rgba(0, 50, 0, 0.1);">
                <strong style="color: #00FFFF;">${index + 1}. ${entry.title}</strong><br>
                <span style="color: #FFB000; font-size: 11px;">
                    ${entry.date} | ${entry.difficulty}★ | ${entry.status} | [${entry.tags.slice(0, 3).join(', ')}]
                </span><br>
                <span style="color: #00FF00; font-size: 12px;">
                    ${entry.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </span>
            </div>
        `).join('')}
        ${results.length > maxResults ? `<br><span style="color: #FFB000;">... and ${results.length - maxResults} more results</span>` : ''}
    `;
}

// Run suggested search
function runSuggestion(suggestion) {
    const commandInput = document.querySelector('.command-input');
    if (commandInput) {
        commandInput.value = `search ${suggestion}`;
        // Trigger the search
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        commandInput.dispatchEvent(event);
    }
}

// Auto-complete functionality for command input
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        setupAutoComplete();
    }, 500);
});

function setupAutoComplete() {
    const commandInput = document.querySelector('.command-input');
    if (commandInput) {
        commandInput.addEventListener('input', handleAutoComplete);
    }
}

function handleAutoComplete(e) {
    const value = e.target.value;
    
    if (value.startsWith('search ') && value.length > 7) {
        const partial = value.substring(7);
        if (advancedSearch && partial.length > 2) {
            const suggestions = advancedSearch.getSuggestions(partial);
            if (suggestions.length > 0) {
                // Could implement a dropdown here
                console.log('Suggestions:', suggestions);
            }
        }
    }
}