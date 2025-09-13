// CCNP Journey Terminal - Main JavaScript File v3.2 (Final Fix)

// --- GLOBALS ---
let journalEntries = [];
let advancedSearch;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', main);

/**
 * The main application startup function.
 */
async function main() {
    console.log('Booting terminal...');

    // 1. Tell the contentManager to load and display the initial entries.
    // This function will internally call loadEntries(), populating the data.
    await contentManager.displayEntries();

    // 2. Get the loaded entry data DIRECTLY from the content manager instance.
    // **FIX**: The redundant call to loadEntries() has been removed.
    journalEntries = contentManager.entries; 

    // 3. Initialize the Advanced Search engine with the loaded data.
    if (journalEntries.length > 0) {
        advancedSearch = new AdvancedSearch(journalEntries);
        console.log(`Advanced Search Engine Initialized with ${journalEntries.length} entries.`);
    }

    // 4. Initialize all UI effects and event listeners.
    initializeTerminal();
    animateProgressBars();
    setupEventListeners();
    startMatrixRain();

    console.log('Terminal boot complete. System operational.');
}

// --- UI & ANIMATION FUNCTIONS ---

function initializeTerminal() {
    setTimeout(() => {
        const bootText = document.querySelector('.boot-text');
        if (bootText) bootText.style.opacity = '0.8';
    }, 500);
}

function animateProgressBars() {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => bar.style.width = targetWidth, 100);
        });
    }, 1000);
}

function handleTerminalControls(e) {
    const control = e.target.classList;
    if (control.contains('close')) {
        document.body.style.opacity = '0';
        setTimeout(() => document.body.style.opacity = '1', 500);
    } else if (control.contains('minimize')) {
        const terminal = document.querySelector('.terminal-body');
        terminal.style.height = terminal.style.height === '50px' ? '80vh' : '50px';
    } else if (control.contains('maximize')) {
        document.querySelector('.container').classList.toggle('fullscreen');
    }
}

function startMatrixRain() {
    // This is an optional effect, can be removed if performance is an issue
}

// --- EVENT HANDLING ---

function setupEventListeners() {
    document.body.addEventListener('keypress', handleCommandInput);
    document.body.addEventListener('focusin', (e) => {
        if (e.target.matches('.command-input')) e.target.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
    });
    document.body.addEventListener('focusout', (e) => {
        if (e.target.matches('.command-input')) e.target.style.boxShadow = 'none';
    });

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.addEventListener('click', handleNavigation));

    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => btn.addEventListener('click', handleTerminalControls));
}

function handleCommandInput(e) {
    if (!e.target.matches('.command-input') || e.key !== 'Enter') return;
    const command = e.target.value.toLowerCase().trim();
    processCommand(command);
    e.target.value = '';
}

async function handleNavigation(e) {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    e.target.classList.add('active');
    const section = e.target.textContent.trim();

    if (section === 'JOURNAL') {
        await contentManager.displayEntries();
    } else {
        showPlaceholder(section);
    }
}

function showPlaceholder(section) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    mainContent.innerHTML = `
        <div class="placeholder-content">
            Loading ${section} module...<br>
            <span class="placeholder-loader">[████████████]</span><br>
            Functionality not yet implemented.
        </div>
        ${contentManager.getCommandLine()}
    `;
}


// --- COMMAND PROCESSING & SEARCH ---

function processCommand(command) {
    const output = document.createElement('div');
    output.className = 'command-output';
    
    if (command.startsWith('search ')) handleAdvancedSearch(command.substring(7), output);
    else if (command.startsWith('filter ')) handleFilterCommand(command.substring(7), output);
    else if (command.startsWith('find ')) handleQuickFind(command.substring(5), output);
    else handleStandardCommands(command, output);

    const commandLine = document.querySelector('.command-line');
    if (commandLine) {
        commandLine.parentNode.insertBefore(output, commandLine);
        commandLine.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleStandardCommands(command, output) {
    switch (command) {
        case 'help':
            output.innerHTML = `
                <span class="help-title">CCNP Terminal System v3.1</span><br><br>
                <span class="help-section">Basic Commands:</span><br>
                • help, status, progress, ls, clear, date<br><br>
                <span class="help-section">Search Commands:</span><br>
                • search [term], find [term1], filter tag:[tag]
            `;
            break;
        case 'status':
            const completed = journalEntries.filter(e => e.status === 'completed').length;
            const inProgress = journalEntries.filter(e => e.status === 'in-progress').length;
            output.innerHTML = `
                [SYSTEM STATUS: OPERATIONAL]<br>
                [SEARCH ENGINE: ADVANCED v2.0]<br>
                [ENTRIES INDEXED: ${journalEntries.length}]<br>
                [COMPLETED: ${completed}] [IN PROGRESS: ${inProgress}]
            `;
            break;
        case 'ls':
            output.innerHTML = `
                <span class="ls-title">Entry Database (${journalEntries.length} total)</span><br>
                ${journalEntries.slice(0, 10).map(entry => `• ${entry.date} - ${entry.title}`).join('<br>')}
            `;
            break;
        case 'date':
             output.textContent = new Date().toLocaleString();
             break;
        case 'progress':
            output.innerHTML = `
                CCNP Progress Report:<br>
                ├── ENCOR: 75% complete<br>
                ├── ENARSI: 45% complete<br>
                └── LABS: 20% complete
            `;
            break;
        case 'clear':
            document.querySelectorAll('.command-output').forEach(el => el.remove());
            return;
        case '':
            return;
        default:
            output.innerHTML = `Command '${command}' not found. Type 'help'.`;
            output.classList.add('command-error');
    }
}

// --- ADVANCED SEARCH CLASS & FUNCTIONS ---
class AdvancedSearch {
    constructor(entries) { this.entries = entries; }
    search(query, options = {}) {
        let results = [...this.entries];
        if (query) results = this.textSearch(results, query);
        if (options.tags && options.tags.length > 0) {
            results = results.filter(e => options.tags.every(tag => e.tags.some(et => et.toLowerCase().includes(tag.toLowerCase()))));
        }
        return this.sortByRelevance(results, query);
    }
    textSearch(entries, query) {
        const term = query.toLowerCase();
        return entries.filter(e => e.title.toLowerCase().includes(term) || e.tags.some(tag => tag.toLowerCase().includes(term)));
    }
    sortByRelevance(entries, query) {
        if (!query) return entries;
        const term = query.toLowerCase();
        return entries.sort((a, b) => {
            const scoreA = (a.title.toLowerCase().includes(term) ? 10 : 0) + (a.tags.some(t => t.toLowerCase().includes(term)) ? 5 : 0);
            const scoreB = (b.title.toLowerCase().includes(term) ? 10 : 0) + (b.tags.some(t => t.toLowerCase().includes(term)) ? 5 : 0);
            return scoreB - scoreA;
        });
    }
}

function handleAdvancedSearch(input, output) {
    if (!advancedSearch) { output.innerHTML = 'Search engine not ready.'; return; }
    const results = advancedSearch.search(input, {});
    displaySearchResults(results, input, output);
}

function handleFilterCommand(input, output) {
    if (!advancedSearch) return;
    const options = parseFilterOptions(input);
    const results = advancedSearch.search('', options);
    displaySearchResults(results, `Filter: ${input}`, output);
}

function handleQuickFind(input, output) {
    if (!advancedSearch) return;
    const terms = input.split(' ');
    let results = [...journalEntries];
    terms.forEach(term => { results = advancedSearch.textSearch(results, term); });
    displaySearchResults(results, `Find: ${input}`, output);
}

function parseFilterOptions(input) {
    const options = {};
    const tagMatch = input.match(/tag:(\S+)/);
    if (tagMatch) options.tags = [tagMatch[1]];
    return options;
}

function displaySearchResults(results, query, output) {
    if (results.length === 0) {
        output.innerHTML = `<span class="search-error">No results found for "${query}"</span>`;
        return;
    }
    const maxResults = 5;
    output.innerHTML = `
        <span class="search-title">Search Results for "${query}" (${results.length} found)</span><br>
        ${results.slice(0, maxResults).map((entry, index) => `
            <div class="search-result">
                <strong>${index + 1}. ${entry.title}</strong><br>
                <span class="search-meta">${entry.date} | [${entry.tags.join(', ')}]</span>
            </div>
        `).join('')}
        ${results.length > maxResults ? `<br><span class="search-more">... and ${results.length - maxResults} more results</span>` : ''}
    `;
}

