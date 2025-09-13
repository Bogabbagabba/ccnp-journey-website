class ContentManager {
    constructor() {
        this.entries = [];
    }

    async loadEntries() {
        if (this.entries.length > 0) return this.entries; // Cache check
        try {
            const response = await fetch('content/entries/entries.json');
            const data = await response.json();
            this.entries = data.entries || [];
            return this.entries;
        } catch (error) {
            console.error('Failed to load entries:', error);
            return [];
        }
    }

    async loadEntry(filename) {
        try {
            const response = await fetch(`content/entries/${filename}`);
            const markdown = await response.text();
            return this.parseMarkdown(markdown);
        } catch (error) {
            console.error('Failed to load entry:', error);
            return null;
        }
    }

    parseMarkdown(markdown) {
        const parts = markdown.split('---');
        if (parts.length < 3) return { frontmatter: {}, content: marked.parse(markdown) };
        
        const frontmatterText = parts[1];
        const content = parts.slice(2).join('---').trim();
        const frontmatter = {};

        frontmatterText.split('\n').forEach(line => {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                let value = match[2].trim().replace(/['"]+/g, '');
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.substring(1, value.length - 1).split(',').map(item => item.trim().replace(/['"]+/g, ''));
                }
                frontmatter[match[1]] = value;
            }
        });
        
        // Use the marked.js library to parse markdown content
        return { frontmatter, content: marked.parse(content) };
    }
    
    renderEntry(entryMeta, entryContent) {
        const difficulty = '★'.repeat(entryMeta.difficulty) + '☆'.repeat(5 - entryMeta.difficulty);
        const statusColors = { 'completed': '#00FF00', 'in-progress': '#FFB000', 'planned': '#00FFFF' };

        return `
            <div class="journal-entry" data-entry-id="${entryMeta.id}">
                <div class="entry-header">${entryMeta.title}</div>
                <div class="entry-meta">
                    DATE: ${entryMeta.date} | CATEGORY: ${entryMeta.category} | DIFFICULTY: ${difficulty} |
                    STATUS: <span style="color: ${statusColors[entryMeta.status]}">${entryMeta.status.toUpperCase()}</span>
                </div>
                <div class="entry-content">${entryContent.content}</div>
                <div class="entry-tags">${entryMeta.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
            </div>
        `;
    }

    async displayEntries(container = '.main-content') {
        const entriesMeta = await this.loadEntries();
        const containerEl = document.querySelector(container);
        if (!containerEl) return;

        let html = '';
        for (const entryMeta of entriesMeta) {
            const entryContent = await this.loadEntry(entryMeta.filename);
            if (entryContent) {
                html += this.renderEntry(entryMeta, entryContent);
            }
        }
        
        containerEl.innerHTML = html + this.getCommandLine();
    }

    getCommandLine() {
        return `
            <div class="command-line">
                <span class="prompt">root@ccnp-lab:~$</span>
                <input type="text" class="command-input" placeholder="Enter command or search..." autofocus />
                <span class="cursor">_</span>
            </div>
        `;
    }
}

// Initialize a single global content manager
const contentManager = new ContentManager();

// Global copy function for dynamically created buttons
function copyCodeBlock(button) {
    const codeContent = button.closest('.code-block').querySelector('pre code');
    navigator.clipboard.writeText(codeContent.textContent).then(() => {
        button.textContent = 'COPIED!';
        button.style.color = '#00FF00';
        setTimeout(() => {
            button.textContent = 'COPY';
            button.style.color = '#FFB000';
        }, 2000);
    });
}

