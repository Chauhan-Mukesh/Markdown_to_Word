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
 * Initialize auto-save functionality
 */
function initializeAutosave() {
  fileManager.enableAutosave(() => input.value);
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
 * Toggle button states based on input
 */
input.addEventListener('input', () => {
  const hasContent = input.value.trim().length > 0;
  previewBtn.disabled = !hasContent;
  exportBtn.disabled = !hasContent;
});

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
 * Render Markdown to HTML in preview pane
 */
function renderPreview() {
  const html = converter.makeHtml(input.value);
  previewPane.innerHTML = html;
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
    console.error(err);
    alert(`Export failed: ${err.message}`);
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
    
    this.initializeHelpModal();
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