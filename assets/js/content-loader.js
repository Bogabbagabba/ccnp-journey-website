## Step 5: Updated Content Loader JavaScript

Create `assets/js/content-loader.js`:
```javascript
// Content Management System for CCNP Journey

class ContentManager {
    constructor() {
        this.entries = [];
        this.currentEntry = null;
        this.filters = {
            category: 'all',
            tags: [],
            difficulty: 'all',
            status: 'all'
        };
    }

    async loadEntries() {
        try {
            const response = await fetch('content/entries.json');
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
        // Split frontmatter and content
        const parts = markdown.split('---');
        const frontmatterText = parts[1];
        const content = parts.slice(2).join('---').trim();

        // Parse frontmatter
        const frontmatter = {};
        frontmatterText.split('\n').forEach(line => {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                let value = match[2].trim();
                // Parse arrays
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = JSON.parse(value);
                }
                // Parse quotes
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                frontmatter[match[1]] = value;
            }
        });

        return {
            frontmatter,
            content: this.markdownToHtml(content)
        };
    }

    markdownToHtml(markdown) {
        // Basic markdown parsing (you could use a library like marked.js for more features)
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gm, '<h3 style="color: #00FFFF; margin-top: 20px;">$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 style="color: #00FFFF; margin-top: 25px; border-bottom: 1px solid #00FF00; padding-bottom: 5px;">$1</h2>')
            .replace(/^# (.*$)/gm, '<h1 style="color: #FFB000; margin-bottom: 15px;">$1</h1>')
            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                return `<div class="code-block">
                    <div class="code-header">
                        <span>${lang ? lang.toUpperCase() + ' Configuration' : 'Code Block'}</span>
                        <button class="copy-btn" onclick="copyCodeBlock(this)">COPY</button>
                    </div>
                    <div class="code-content">${code.trim()}</div>
                </div>`;
            })
            // Inline code
            .replace(/`([^`]+)`/g, '<code style="background: #001122; padding: 2px 4px; border: 1px solid #00FFFF; color: #00FFFF;">$1</code>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #FFB000;">$1</strong>')
            // Lists
            .replace(/^- (.+$)/gm, '<li style="margin-left: 20px; color: #00FF00;">• $1</li>')
            // Line breaks
            .replace(/\n/g, '<br>');

        return html;
    }

    renderEntry(entry, content) {
        const difficulty = '★'.repeat(entry.frontmatter.difficulty) + '☆'.repeat(5 - entry.frontmatter.difficulty);
        const statusColors = {
            'completed': '#00FF00',
            'in-progress': '#FFB000', 
            'planned': '#00FFFF'
        };

        return `
            <div class="journal-entry" data-entry-id="${entry.frontmatter.title}">
                <div class="entry-header">${entry.frontmatter.title}</div>
                <div class="entry-meta">
                    DATE: ${entry.frontmatter.date} | 
                    CATEGORY: ${entry.frontmatter.category} | 
                    DIFFICULTY: ${difficulty} |
                    STATUS: <span style="color: ${statusColors[entry.frontmatter.status]}">${entry.frontmatter.status.toUpperCase()}</span>
                </div>
                <div class="entry-content">
                    ${content.content}
                </div>
                <div class="entry-tags">
                    ${entry.frontmatter.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }

    async displayEntries(container = '.main-content') {
        const entries = await this.loadEntries();
        const containerEl = document.querySelector(container);
        
        if (!containerEl) return;

        let html = '';
        for (const entryMeta of entries) {
            const entry = await this.loadEntry(entryMeta.filename);
            if (entry) {
                html += this.renderEntry(entry, entry);
            }
        }

        containerEl.innerHTML = html + this.getCommandLine() + this.getAsciiArt();
    }

    getCommandLine() {
        return `
            <div class="command-line">
                <span class="prompt">root@ccnp-lab:~$</span>
                <input type="text" class="command-input" placeholder="Enter command or search..." />
                <span class="cursor">_</span>
            </div>
        `;
    }

    getAsciiArt() {
        return `
            <div class="ascii-art">
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CONTENT   │────▶│   MANAGER   │────▶│   DISPLAY   │
│   FILES     │     │   SYSTEM    │     │   ENGINE    │
│   (.md)     │     │             │     │  (HTML)     │
└─────────────┘     └─────────────┘     └─────────────┘
      │                     │                     │
      ▼                     ▼                     ▼
 Markdown Files         JSON Index           Cyberpunk UI
            </div>
        `;
    }
}

// Initialize content manager
const contentManager = new ContentManager();

// Copy function for code blocks
function copyCodeBlock(button) {
    const codeContent = button.parentElement.nextElementSibling;
    const text = codeContent.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'COPIED!';
        button.style.color = '#00FF00';
        setTimeout(() => {
            button.textContent = 'COPY';
            button.style.color = '#FFB000';
        }, 2000);
    });
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', () => {
    contentManager.displayEntries();
});