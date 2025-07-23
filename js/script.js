/**
 * @file script.js
 * @description Enhanced core logic for Markdown to Word exporter with advanced features
 */

// Grab DOM elements
const input = document.getElementById('markdown-input');
const clearBtn = document.getElementById('clear-btn');
const themeBtn = document.getElementById('theme-btn');
const previewBtn = document.getElementById('preview-btn');
const exportBtn = document.getElementById('export-btn');
const downloadWordBtn = document.getElementById('download-word-btn');
const downloadHtmlBtn = document.getElementById('download-html-btn');
const downloadTxtBtn = document.getElementById('download-txt-btn');
const loadBtn = document.getElementById('load-btn');
const saveMdBtn = document.getElementById('save-md-btn');
const refreshBtn = document.getElementById('refresh-btn');
const previewPane = document.getElementById('preview-pane');
const spinner = document.getElementById('spinner');
const titleInput = document.getElementById('doc-title');
const authorInput = document.getElementById('doc-author');
const dateInput = document.getElementById('doc-date');

// Initialize components
let converter, fileManager, editorToolbar, templates, searchReplace, printExport;

// Wait for all scripts to load
window.addEventListener('DOMContentLoaded', () => {
  converter = new SimpleMarkdownConverter();
  fileManager = new FileManager();
  editorToolbar = new EditorToolbar(input);
  templates = new DocumentTemplates();
  searchReplace = new SearchReplace(input);
  printExport = new PrintExport();
  
  // Make searchReplace globally available for modal
  window.searchReplace = searchReplace;
  
  // Initialize features
  initializeTemplates();
  initializeFormattingToolbar();
  initializeAutosave();
  restoreAutosavedContent();
  initializeNewFeatures();
});

/**
 * Initialize document templates
 */
function initializeTemplates() {
  const templateContainer = document.getElementById('template-container');
  templates.createTemplateSelector(templateContainer, (content) => {
    if (input.value.trim() === '' || confirm('Replace current content with template?')) {
      input.value = content;
      input.dispatchEvent(new Event('input'));
    }
  });
}

/**
 * Initialize formatting toolbar
 */
function initializeFormattingToolbar() {
  document.getElementById('bold-btn').onclick = () => editorToolbar.makeBold();
  document.getElementById('italic-btn').onclick = () => editorToolbar.makeItalic();
  document.getElementById('code-btn').onclick = () => editorToolbar.makeCode();
  document.getElementById('link-btn').onclick = () => editorToolbar.insertLink();
  document.getElementById('image-btn').onclick = () => editorToolbar.insertImage();
  document.getElementById('header-btn').onclick = () => editorToolbar.insertHeader();
  document.getElementById('list-btn').onclick = () => editorToolbar.insertList();
  document.getElementById('quote-btn').onclick = () => editorToolbar.insertBlockquote();
  document.getElementById('table-btn').onclick = () => editorToolbar.insertTable();
  document.getElementById('hr-btn').onclick = () => editorToolbar.insertHorizontalRule();
}

/**
 * Initialize auto-save functionality with validation
 */
function initializeAutosave() {
  try {
    fileManager.enableAutosave(() => {
      const content = input.value;
      // Basic content validation
      if (content.length > 1000000) { // 1MB limit
        throw new Error('Document too large for auto-save');
      }
      return content;
    });
  } catch (error) {
    console.error('Auto-save initialization failed:', error);
  }
}

/**
 * Restore auto-saved content
 */
function restoreAutosavedContent() {
  const autosaved = fileManager.restoreAutosaved();
  if (autosaved && autosaved.trim()) {
    if (confirm('Restore auto-saved content?')) {
      input.value = autosaved;
      input.dispatchEvent(new Event('input'));
    } else {
      fileManager.clearAutosaved();
    }
  }
}

/**
 * Initialize new advanced features
 */
function initializeNewFeatures() {
  // Search functionality
  document.getElementById('search-btn').onclick = () => searchReplace.openModal();
  
  // Print functionality  
  document.getElementById('print-btn').onclick = () => {
    const title = titleInput.value || 'Document';
    printExport.printDocument(title);
  };
  
  // Additional export options
  document.getElementById('download-standalone-btn').onclick = () => exportDocument('standalone');
  document.getElementById('download-pdf-btn').onclick = () => exportDocument('pdf');
}

// Make renderPreview globally available
window.renderPreview = renderPreview;

/**
 * Toggle button states based on input with validation
 */
input.addEventListener('input', () => {
  const content = input.value.trim();
  const hasContent = content.length > 0;
  const isValidContent = content.length <= 1000000; // 1MB limit
  
  previewBtn.disabled = !hasContent || !isValidContent;
  exportBtn.disabled = !hasContent || !isValidContent;
  
  // Auto-format tables on input
  autoFormatTables();
  
  // Show warning for large documents
  if (content.length > 500000) { // 500KB warning
    showContentWarning('Large document detected. Performance may be affected.');
  }
});

/**
 * Auto-format markdown tables
 */
function autoFormatTables() {
  const content = input.value;
  const lines = content.split('\n');
  let formatted = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('|') && lines[i].trim().startsWith('|')) {
      // Basic table formatting - ensure proper spacing
      const cells = lines[i].split('|').map(cell => cell.trim());
      const formattedLine = '| ' + cells.slice(1, -1).join(' | ') + ' |';
      if (lines[i] !== formattedLine) {
        lines[i] = formattedLine;
        formatted = true;
      }
    }
  }
  
  if (formatted) {
    const cursorPos = input.selectionStart;
    input.value = lines.join('\n');
    input.setSelectionRange(cursorPos, cursorPos);
  }
}

/**
 * Show content warning
 */
function showContentWarning(message) {
  const existing = document.querySelector('.content-warning');
  if (existing) return;
  
  const warning = document.createElement('div');
  warning.className = 'content-warning';
  warning.innerHTML = `
    <div style="background: #ff9800; color: white; padding: 0.5rem; border-radius: 4px; margin: 0.5rem; font-size: 0.85rem; display: flex; align-items: center; justify-content: space-between;">
      <span>⚠️ ${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;">×</button>
    </div>
  `;
  document.querySelector('#editor-panel').insertBefore(warning, input);
  
  setTimeout(() => {
    if (warning.parentNode) {
      warning.parentNode.removeChild(warning);
    }
  }, 10000);
}

/**
 * File management handlers
 */
loadBtn.addEventListener('click', () => {
  fileManager.loadFile((content, filename) => {
    input.value = content;
    input.dispatchEvent(new Event('input'));
    // Update title from filename
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    titleInput.value = nameWithoutExt;
  });
});

saveMdBtn.addEventListener('click', () => {
  const filename = (titleInput.value || 'document').replace(/\s+/g, '_') + '.md';
  fileManager.saveAsMarkdown(input.value, filename);
});

/**
 * Clears editor and resets preview
 */
clearBtn.addEventListener('click', () => {
  if (input.value.trim() && !confirm('Clear all content? This cannot be undone.')) {
    return;
  }
  input.value = '';
  previewPane.innerHTML = '<em>Enter Markdown and click Preview...</em>';
  previewBtn.disabled = true;
  exportBtn.disabled = true;
  fileManager.clearAutosaved();
});

/**
 * Toggle dark/light theme
 */
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
});

// Restore theme preference
if (localStorage.getItem('dark-mode') === 'true') {
  document.body.classList.add('dark-mode');
}

/**
 * Render Markdown to HTML in preview pane with security
 */
function renderPreview() {
  try {
    const content = input.value;
    
    // Basic security validation
    if (content.length > 1000000) {
      throw new Error('Content too large to preview');
    }
    
    // Sanitize content - remove potentially dangerous elements
    const sanitizedContent = sanitizeMarkdown(content);
    const html = converter.makeHtml(sanitizedContent);
    
    // Additional HTML sanitization
    const sanitizedHtml = sanitizeHtml(html);
    previewPane.innerHTML = sanitizedHtml;
    
  } catch (error) {
    previewPane.innerHTML = `<div style="color: #d32f2f; padding: 1rem; border: 1px solid #d32f2f; border-radius: 4px; background: #ffebee;">
      <strong>❌ Preview Error</strong><br>
      ${error.message}
    </div>`;
  }
}

/**
 * Basic markdown sanitization
 */
function sanitizeMarkdown(content) {
  // Remove script tags and event handlers
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');
}

/**
 * Basic HTML sanitization
 */
function sanitizeHtml(html) {
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove script tags and dangerous attributes
  const scripts = temp.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  const elements = temp.querySelectorAll('*');
  elements.forEach(el => {
    // Remove event handlers
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on') || attr.value.includes('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return temp.innerHTML;
}
previewBtn.addEventListener('click', renderPreview);
refreshBtn.addEventListener('click', renderPreview);

/**
 * Export handlers
 */
downloadWordBtn.addEventListener('click', async () => {
  await exportDocument('word');
});

downloadHtmlBtn.addEventListener('click', async () => {
  await exportDocument('html');
});

downloadTxtBtn.addEventListener('click', async () => {
  await exportDocument('text');
});

/**
 * Enhanced document export with multiple formats
 */
async function exportDocument(format) {
  spinner.style.display = 'inline-block';
  exportBtn.disabled = true;

  const filename = (titleInput.value || 'document').replace(/\s+/g, '_');
  
  try {
    switch (format) {
      case 'word':
        await exportToWord(filename);
        break;
      case 'html':
        await exportToHtml(filename);
        break;
      case 'text':
        await exportToText(filename);
        break;
      case 'standalone':
        await exportToStandalone(filename);
        break;
      case 'pdf':
        await exportToPDF(filename);
        break;
    }
  } catch (err) {
    console.error('Export error:', err);
    
    // Show user-friendly error message
    const errorMsg = err.message || 'An unknown error occurred';
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="background: #f44336; color: white; padding: 1rem; border-radius: 4px; margin: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
        <strong>❌ Export Failed</strong><br>
        ${errorMsg}<br>
        <small>Please try again or check your document content.</small>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  } finally {
    spinner.style.display = 'none';
    exportBtn.disabled = false;
  }
}

/**
 * Export to Word document
 */
async function exportToWord(filename) {
  const bodyHtml = converter.makeHtml(input.value);
  const headerHtml = `
    <h1 style="text-align:center;">${titleInput.value || 'Document'}</h1>
    <p style="text-align:right; font-size:0.9em;">By ${authorInput.value || 'Unknown'} | ${dateInput.value || new Date().toLocaleDateString()}</p>
    <hr />`;
  
  const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>
        @page { margin:1in; }
        body { font-family:'Calibri',sans-serif; line-height: 1.6; }
        h1, h2, h3, h4, h5, h6 { color: #2c3e50; margin-top: 1em; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #3498db; padding-left: 20px; margin: 20px 0; color: #7f8c8d; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style></head><body>
      ${headerHtml}
      ${bodyHtml}
    </body></html>`;

  const blob = HtmlToWordConverter.asBlob(fullHtml);
  fileManager.downloadBlob(blob, `${filename}.docx`);
}

/**
 * Export to HTML
 */
async function exportToHtml(filename) {
  const html = converter.makeHtml(input.value);
  fileManager.saveAsHtml(html, `${filename}.html`);
}

/**
 * Export to plain text
 */
async function exportToText(filename) {
  fileManager.saveAsText(input.value, `${filename}.txt`);
}

/**
 * Export to standalone HTML
 */
async function exportToStandalone(filename) {
  printExport.downloadStandaloneHTML(
    input.value,
    titleInput.value || 'Document',
    authorInput.value,
    dateInput.value
  );
}

/**
 * Export to PDF
 */
async function exportToPDF(filename) {
  printExport.exportToPDF(titleInput.value || 'Document');
}

// Set default date to today
if (!dateInput.value) {
  dateInput.value = new Date().toISOString().split('T')[0];
}

// Enhanced Keyboard Shortcuts and Help Modal
class KeyboardShortcuts {
  constructor() {
    this.helpModal = document.getElementById('help-modal');
    this.helpBtn = document.getElementById('help-btn');
    this.helpClose = document.getElementById('help-close');
    
    this.statsModal = document.getElementById('stats-modal');
    this.statsBtn = document.getElementById('stats-btn');
    this.statsClose = document.getElementById('stats-close');
    
    this.initializeHelpModal();
    this.initializeStatsModal();
    this.bindKeyboardShortcuts();
  }

  initializeHelpModal() {
    // Help button click
    this.helpBtn?.addEventListener('click', () => {
      this.showHelp();
    });

    // Close help modal
    this.helpClose?.addEventListener('click', () => {
      this.hideHelp();
    });

    // Close on outside click
    this.helpModal?.addEventListener('click', (e) => {
      if (e.target === this.helpModal) {
        this.hideHelp();
      }
    });
  }

  initializeStatsModal() {
    // Stats button click
    this.statsBtn?.addEventListener('click', () => {
      this.showStats();
    });

    // Close stats modal
    this.statsClose?.addEventListener('click', () => {
      this.hideStats();
    });

    // Close on outside click
    this.statsModal?.addEventListener('click', (e) => {
      if (e.target === this.statsModal) {
        this.hideStats();
      }
    });
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // F1 - Show help
      if (e.key === 'F1') {
        e.preventDefault();
        this.showHelp();
        return;
      }

      // Escape - Close modals
      if (e.key === 'Escape') {
        this.hideHelp();
        this.hideStats();
        // Close other modals too
        document.querySelectorAll('.modal').forEach(modal => {
          modal.style.display = 'none';
        });
        return;
      }

      // Ctrl/Cmd combinations
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            editorToolbar?.formatBold();
            break;
          case 'i':
            e.preventDefault();
            editorToolbar?.formatItalic();
            break;
          case 'k':
            e.preventDefault();
            editorToolbar?.formatLink();
            break;
          case '`':
            e.preventDefault();
            editorToolbar?.formatCode();
            break;
          case 'f':
            e.preventDefault();
            searchReplace?.showModal();
            break;
          case 'p':
            e.preventDefault();
            if (!previewBtn.disabled) {
              previewBtn.click();
            }
            break;
          case 's':
            e.preventDefault();
            fileManager?.saveMarkdown();
            this.showSaveNotification();
            break;
          case 'enter':
            e.preventDefault();
            if (!exportBtn.disabled) {
              downloadWordBtn?.click();
            }
            break;
          case 'e':
            e.preventDefault();
            this.showStats();
            break;
        }
      }
    });
  }

  showHelp() {
    if (this.helpModal) {
      this.helpModal.style.display = 'block';
      // Focus the close button for accessibility
      this.helpClose?.focus();
    }
  }

  hideHelp() {
    if (this.helpModal) {
      this.helpModal.style.display = 'none';
    }
  }

  showStats() {
    if (this.statsModal) {
      this.calculateDocumentStats();
      this.statsModal.style.display = 'block';
      this.statsClose?.focus();
    }
  }

  hideStats() {
    if (this.statsModal) {
      this.statsModal.style.display = 'none';
    }
  }

  calculateDocumentStats() {
    const input = document.getElementById('markdown-input');
    const text = input?.value || '';
    
    // Basic counts
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    
    // Advanced counts
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const headers = (text.match(/^#{1,6}\s+/gm) || []).length;
    const codeBlocks = (text.match(/```[\s\S]*?```/g) || []).length;
    const links = (text.match(/\[([^\]]*)\]\(([^)]*)\)/g) || []).length;
    const lists = (text.match(/^[\s]*[-*+]\s+/gm) || []).length;
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    
    // Advanced calculations
    const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0;
    const avgSentencesPerParagraph = paragraphs > 0 ? Math.round(sentences / paragraphs) : 0;
    
    // Readability assessment
    const readabilityLevel = this.getReadabilityLevel(avgWordsPerSentence, sentences, words);
    const targetAudience = this.getTargetAudience(readabilityLevel);
    
    // Update UI
    this.updateStatsDisplay({
      words,
      chars,
      charsNoSpaces,
      paragraphs,
      sentences,
      readingTime,
      avgWordsPerSentence,
      avgSentencesPerParagraph,
      headers,
      codeBlocks,
      links,
      lists,
      readabilityLevel,
      targetAudience
    });
  }

  updateStatsDisplay(stats) {
    document.getElementById('word-count').textContent = stats.words.toLocaleString();
    document.getElementById('char-count').textContent = stats.chars.toLocaleString();
    document.getElementById('char-no-spaces').textContent = stats.charsNoSpaces.toLocaleString();
    document.getElementById('paragraph-count').textContent = stats.paragraphs.toLocaleString();
    document.getElementById('sentence-count').textContent = stats.sentences.toLocaleString();
    document.getElementById('reading-time').textContent = stats.readingTime;
    
    document.getElementById('avg-words-sentence').textContent = stats.avgWordsPerSentence;
    document.getElementById('avg-sentences-paragraph').textContent = stats.avgSentencesPerParagraph;
    document.getElementById('header-count').textContent = stats.headers;
    document.getElementById('code-block-count').textContent = stats.codeBlocks;
    document.getElementById('link-count').textContent = stats.links;
    document.getElementById('list-count').textContent = stats.lists;
    
    document.getElementById('readability-level').textContent = stats.readabilityLevel;
    document.getElementById('target-audience').textContent = stats.targetAudience;
  }

  getReadabilityLevel(avgWordsPerSentence, sentences, words) {
    if (words < 50) return 'Too short to analyze';
    
    // Simple readability assessment based on sentence length
    if (avgWordsPerSentence <= 10) return 'Very Easy';
    if (avgWordsPerSentence <= 15) return 'Easy';
    if (avgWordsPerSentence <= 20) return 'Moderate';
    if (avgWordsPerSentence <= 25) return 'Difficult';
    return 'Very Difficult';
  }

  getTargetAudience(readabilityLevel) {
    switch (readabilityLevel) {
      case 'Very Easy': return 'Elementary school';
      case 'Easy': return 'Middle school';
      case 'Moderate': return 'High school';
      case 'Difficult': return 'College level';
      case 'Very Difficult': return 'Graduate level';
      default: return 'General readers';
    }
  }

  showSaveNotification() {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.textContent = '💾 Document saved locally';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.85rem;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }
}

// Initialize keyboard shortcuts
let keyboardShortcuts;
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    keyboardShortcuts = new KeyboardShortcuts();
  }, 100);
});

// Add slide animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);