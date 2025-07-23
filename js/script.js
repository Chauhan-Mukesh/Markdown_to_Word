/**
 * @file script.js
 * @description Enhanced Markdown to Word exporter with multiple export formats,
 * templates, auto-save, statistics, and more features.
 */

// Wait for libraries to load
let showdownReady = false;
let htmlDocxReady = false;
let highlightReady = false;

// Check if libraries are loaded
function checkLibraries() {
  showdownReady = typeof showdown !== 'undefined';
  htmlDocxReady = typeof htmlDocx !== 'undefined';
  highlightReady = typeof hljs !== 'undefined';
}

// Retry mechanism
let retryCount = 0;
const maxRetries = 10;
function waitForLibraries() {
  checkLibraries();
  if (!showdownReady && retryCount < maxRetries) {
    retryCount++;
    setTimeout(waitForLibraries, 500);
    return;
  }
  initializeApp();
}

// Document templates
const templates = {
  resume: `# John Doe
## Software Developer

### Contact Information
- **Email:** john.doe@email.com
- **Phone:** (555) 123-4567
- **LinkedIn:** linkedin.com/in/johndoe

### Summary
Experienced software developer with 5+ years in web development...

### Experience
#### Senior Developer - Tech Company (2020-Present)
- Developed and maintained web applications
- Led a team of 3 developers
- Improved system performance by 40%

### Education
#### Bachelor of Computer Science
University Name (2015-2019)

### Skills
- Programming: JavaScript, Python, Java
- Frameworks: React, Node.js, Django
- Tools: Git, Docker, AWS`,

  report: `# Executive Summary Report

**Author:** [Your Name]  
**Date:** ${new Date().toLocaleDateString()}  
**Department:** [Department Name]

## Executive Summary
This report presents findings and recommendations regarding...

## Introduction
The purpose of this report is to...

## Methodology
The research was conducted using...

## Key Findings
1. **Finding One:** Description of the first key finding
2. **Finding Two:** Description of the second key finding
3. **Finding Three:** Description of the third key finding

## Analysis
### Data Analysis
The collected data shows...

### Trends Observed
- Trend 1
- Trend 2
- Trend 3

## Recommendations
Based on the findings, we recommend:

1. **Immediate Actions:** 
2. **Short-term Goals:** 
3. **Long-term Strategy:** 

## Conclusion
In conclusion, this report demonstrates...`,

  letter: `[Your Name]  
[Your Address]  
[City, State ZIP Code]  
[Email Address]  
[Phone Number]

[Date]

[Recipient Name]  
[Recipient Title]  
[Company Name]  
[Address]  
[City, State ZIP Code]

Dear [Recipient Name],

I am writing to you regarding [subject of letter].

[Body paragraph 1 - introduce the purpose]

[Body paragraph 2 - provide details/support]

[Body paragraph 3 - conclude and specify any action needed]

Thank you for your time and consideration. I look forward to hearing from you.

Sincerely,

[Your Name]  
[Your Title]`,

  article: `# How to Write Engaging Content

**Published:** ${new Date().toLocaleDateString()}  
**Author:** [Your Name]  
**Reading Time:** 5 minutes

## Introduction
Writing engaging content is both an art and a science...

## The Fundamentals

### 1. Know Your Audience
Understanding your target audience is crucial because...

### 2. Craft Compelling Headlines
Your headline is the first thing readers see...

### 3. Structure Your Content
Well-structured content helps readers...

## Advanced Techniques

### Using Storytelling
Stories create emotional connections...

### Data and Statistics
Support your points with credible data...

## Conclusion
Creating engaging content requires practice and persistence...

## Call to Action
What will you write about next? Share your thoughts in the comments below!`
};

// Main application class
class MarkdownEditor {
  constructor() {
    this.converter = null;
    this.autosaveTimer = null;
    this.initElements();
    this.bindEvents();
    this.loadFromStorage();
    this.initAutosave();
  }

  initElements() {
    // Input elements
    this.input = document.getElementById('markdown-input');
    this.titleInput = document.getElementById('doc-title');
    this.authorInput = document.getElementById('doc-author');
    this.dateInput = document.getElementById('doc-date');
    
    // Buttons
    this.clearBtn = document.getElementById('clear-btn');
    this.themeBtn = document.getElementById('theme-btn');
    this.templatesBtn = document.getElementById('templates-btn');
    this.statsBtn = document.getElementById('stats-btn');
    this.previewBtn = document.getElementById('preview-btn');
    this.exportBtn = document.getElementById('export-btn');
    this.tocBtn = document.getElementById('toc-btn');
    this.refreshBtn = document.getElementById('refresh-btn');
    
    // Export options
    this.exportWord = document.getElementById('export-word');
    this.exportHtml = document.getElementById('export-html');
    this.exportPdf = document.getElementById('export-pdf');
    this.exportTxt = document.getElementById('export-txt');
    
    // Other elements
    this.previewPane = document.getElementById('preview-pane');
    this.spinner = document.getElementById('spinner');
    this.autosaveIndicator = document.getElementById('autosave-indicator');
    
    // Modals
    this.statsModal = document.getElementById('stats-modal');
    this.templatesModal = document.getElementById('templates-modal');
    
    // Set default date
    this.dateInput.value = new Date().toISOString().split('T')[0];
  }

  bindEvents() {
    // Input events
    this.input.addEventListener('input', () => this.onInputChange());
    this.input.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    
    // Button events
    this.clearBtn.addEventListener('click', () => this.clearEditor());
    this.themeBtn.addEventListener('click', () => this.toggleTheme());
    this.templatesBtn.addEventListener('click', () => this.showTemplates());
    this.statsBtn.addEventListener('click', () => this.showStats());
    this.previewBtn.addEventListener('click', () => this.renderPreview());
    this.refreshBtn.addEventListener('click', () => this.renderPreview());
    this.tocBtn.addEventListener('click', () => this.generateTOC());
    
    // Export events
    this.exportWord.addEventListener('click', (e) => { e.preventDefault(); this.exportDocument('word'); });
    this.exportHtml.addEventListener('click', (e) => { e.preventDefault(); this.exportDocument('html'); });
    this.exportPdf.addEventListener('click', (e) => { e.preventDefault(); this.exportDocument('pdf'); });
    this.exportTxt.addEventListener('click', (e) => { e.preventDefault(); this.exportDocument('txt'); });
    
    // Modal events
    this.bindModalEvents();
    
    // Template events
    this.bindTemplateEvents();
  }

  bindModalEvents() {
    // Close modals when clicking X or outside
    document.querySelectorAll('.close').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        e.target.closest('.modal').style.display = 'none';
      });
    });
    
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
      }
    });
  }

  bindTemplateEvents() {
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        const templateType = card.getAttribute('data-template');
        this.loadTemplate(templateType);
      });
    });
  }

  onInputChange() {
    const hasContent = this.input.value.trim().length > 0;
    this.previewBtn.disabled = !hasContent;
    this.exportBtn.disabled = !hasContent;
    this.tocBtn.disabled = !hasContent;
    
    // Trigger autosave
    this.scheduleAutosave();
  }

  handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 's':
          e.preventDefault();
          this.saveToStorage();
          break;
        case 'p':
          e.preventDefault();
          this.renderPreview();
          break;
        case 'Enter':
          e.preventDefault();
          this.exportDocument('word');
          break;
      }
    }
  }

  clearEditor() {
    this.input.value = '';
    this.previewPane.innerHTML = '<em>Enter Markdown and click Preview...</em>';
    this.previewBtn.disabled = true;
    this.exportBtn.disabled = true;
    this.tocBtn.disabled = true;
    localStorage.removeItem('markdown-content');
    localStorage.removeItem('doc-metadata');
  }

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  loadTemplate(templateType) {
    if (templates[templateType]) {
      this.input.value = templates[templateType];
      this.onInputChange();
      this.templatesModal.style.display = 'none';
      this.renderPreview();
    }
  }

  showTemplates() {
    this.templatesModal.style.display = 'block';
  }

  showStats() {
    this.calculateStats();
    this.statsModal.style.display = 'block';
  }

  calculateStats() {
    const text = this.input.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    
    document.getElementById('word-count').textContent = words;
    document.getElementById('char-count').textContent = chars;
    document.getElementById('char-no-spaces').textContent = charsNoSpaces;
    document.getElementById('paragraph-count').textContent = paragraphs;
    document.getElementById('reading-time').textContent = readingTime + ' min';
  }

  renderPreview() {
    if (!this.converter) {
      alert('Markdown library not loaded yet. Please wait and try again.');
      return;
    }
    
    const html = this.converter.makeHtml(this.input.value);
    this.previewPane.innerHTML = html;
    
    // Highlight code blocks if available
    if (highlightReady) {
      this.previewPane.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
    }
  }

  generateTOC() {
    if (!this.converter) return;
    
    const html = this.converter.makeHtml(this.input.value);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const headers = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headers.length === 0) {
      alert('No headers found to generate table of contents');
      return;
    }
    
    let toc = '## Table of Contents\n\n';
    headers.forEach((header, index) => {
      const level = parseInt(header.tagName[1]);
      const indent = '  '.repeat(level - 1);
      const title = header.textContent;
      const anchor = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      toc += `${indent}- [${title}](#${anchor})\n`;
    });
    
    // Insert TOC at the beginning
    const lines = this.input.value.split('\n');
    const titleLine = lines.findIndex(line => line.startsWith('# '));
    const insertIndex = titleLine >= 0 ? titleLine + 1 : 0;
    
    lines.splice(insertIndex, 0, '', toc);
    this.input.value = lines.join('\n');
    this.onInputChange();
    this.renderPreview();
  }

  async exportDocument(format) {
    if (!this.converter) {
      alert('Export library not loaded yet. Please wait and try again.');
      return;
    }

    this.spinner.style.display = 'inline-block';
    this.exportBtn.disabled = true;

    try {
      const filename = (this.titleInput.value || 'Document').replace(/\s+/g, '_');
      
      switch(format) {
        case 'word':
          await this.exportWord(filename);
          break;
        case 'html':
          this.exportHtmlFile(filename);
          break;
        case 'pdf':
          this.exportPdfFile(filename);
          break;
        case 'txt':
          this.exportTxtFile(filename);
          break;
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed: ' + err.message);
    } finally {
      this.spinner.style.display = 'none';
      this.exportBtn.disabled = false;
    }
  }

  async exportWord(filename) {
    if (!htmlDocxReady) {
      alert('Word export library not available');
      return;
    }

    const bodyHtml = this.converter.makeHtml(this.input.value);
    const headerHtml = `
      <h1 style="text-align:center;">${this.titleInput.value || 'Document'}</h1>
      <p style="text-align:right; font-size:0.9em;">By ${this.authorInput.value || 'Unknown'} | ${this.dateInput.value || ''}</p>
      <hr />`;
    
    const fullHtml = `<!DOCTYPE html><html><head>
      <meta charset="utf-8" />
      <style>
        @page { margin:1in; }
        body { font-family:'Calibri',sans-serif; line-height: 1.6; }
        h1, h2, h3 { color: #2c3e50; }
        blockquote { border-left: 4px solid #3498db; padding-left: 1em; margin: 1em 0; }
        code { background: #f8f9fa; padding: 0.2em 0.4em; border-radius: 3px; }
        pre { background: #f8f9fa; padding: 1em; border-radius: 4px; overflow-x: auto; }
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        th, td { border: 1px solid #ddd; padding: 0.5em; text-align: left; }
        th { background: #f2f2f2; font-weight: bold; }
      </style>
    </head><body>
      ${headerHtml}
      ${bodyHtml}
    </body></html>`;

    const blob = htmlDocx.asBlob(fullHtml);
    this.downloadBlob(blob, `${filename}.docx`);
  }

  exportHtmlFile(filename) {
    const bodyHtml = this.converter.makeHtml(this.input.value);
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.titleInput.value || 'Document'}</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        h1, h2, h3 { color: #2c3e50; }
        blockquote { border-left: 4px solid #3498db; padding-left: 1em; margin: 1em 0; background: #f8f9fa; }
        code { background: #f8f9fa; padding: 0.2em 0.4em; border-radius: 3px; }
        pre { background: #f8f9fa; padding: 1em; border-radius: 4px; overflow-x: auto; }
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        th, td { border: 1px solid #ddd; padding: 0.5em; text-align: left; }
        th { background: #f2f2f2; font-weight: bold; }
    </style>
</head>
<body>
    <header>
        <h1>${this.titleInput.value || 'Document'}</h1>
        <p><strong>Author:</strong> ${this.authorInput.value || 'Unknown'} | <strong>Date:</strong> ${this.dateInput.value || new Date().toLocaleDateString()}</p>
        <hr>
    </header>
    <main>
        ${bodyHtml}
    </main>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    this.downloadBlob(blob, `${filename}.html`);
  }

  exportPdfFile(filename) {
    // For PDF export, we'll create an HTML version optimized for printing
    const bodyHtml = this.converter.makeHtml(this.input.value);
    const printHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${this.titleInput.value || 'Document'}</title>
    <style>
        @page { margin: 1in; }
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; }
        h1 { font-size: 18pt; text-align: center; margin-bottom: 0.5em; }
        h2 { font-size: 16pt; margin-top: 1em; }
        h3 { font-size: 14pt; margin-top: 0.8em; }
        .header { text-align: center; margin-bottom: 2em; }
        .metadata { text-align: right; font-size: 10pt; margin-bottom: 1em; }
        @media print { 
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${this.titleInput.value || 'Document'}</h1>
        <div class="metadata">By ${this.authorInput.value || 'Unknown'} | ${this.dateInput.value || new Date().toLocaleDateString()}</div>
        <hr>
    </div>
    ${bodyHtml}
    <script>window.print();</script>
</body>
</html>`;

    // Open in new window for printing to PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printHtml);
    printWindow.document.close();
  }

  exportTxtFile(filename) {
    const text = this.input.value;
    const header = `${this.titleInput.value || 'Document'}\n` +
                  `Author: ${this.authorInput.value || 'Unknown'}\n` +
                  `Date: ${this.dateInput.value || new Date().toLocaleDateString()}\n` +
                  `${'='.repeat(50)}\n\n`;
    
    const fullText = header + text;
    const blob = new Blob([fullText], { type: 'text/plain' });
    this.downloadBlob(blob, `${filename}.txt`);
  }

  downloadBlob(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }

  // Auto-save functionality
  initAutosave() {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }

  scheduleAutosave() {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
    }
    this.autosaveTimer = setTimeout(() => {
      this.saveToStorage();
    }, 2000); // Save after 2 seconds of inactivity
  }

  saveToStorage() {
    try {
      localStorage.setItem('markdown-content', this.input.value);
      localStorage.setItem('doc-metadata', JSON.stringify({
        title: this.titleInput.value,
        author: this.authorInput.value,
        date: this.dateInput.value
      }));
      this.showAutosaveIndicator();
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  loadFromStorage() {
    try {
      const savedContent = localStorage.getItem('markdown-content');
      if (savedContent) {
        this.input.value = savedContent;
        this.onInputChange();
      }

      const savedMetadata = localStorage.getItem('doc-metadata');
      if (savedMetadata) {
        const metadata = JSON.parse(savedMetadata);
        if (metadata.title) this.titleInput.value = metadata.title;
        if (metadata.author) this.authorInput.value = metadata.author;
        if (metadata.date) this.dateInput.value = metadata.date;
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
  }

  showAutosaveIndicator() {
    this.autosaveIndicator.classList.add('show');
    setTimeout(() => {
      this.autosaveIndicator.classList.remove('show');
    }, 2000);
  }
}

// Initialize app when libraries are ready
function initializeApp() {
  if (showdownReady) {
    const editor = new MarkdownEditor();
    editor.converter = new showdown.Converter({ 
      tables: true, 
      simplifiedAutoLink: true,
      headerLevelStart: 1,
      strikethrough: true,
      tasklists: true
    });
    console.log('Markdown Editor initialized successfully');
  } else {
    console.warn('Showdown library not available - some features will be disabled');
    // Initialize with limited functionality
    const editor = new MarkdownEditor();
  }
}

// Start the initialization process
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(waitForLibraries, 100);
});