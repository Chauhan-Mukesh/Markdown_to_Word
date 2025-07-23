/**
 * @file script.js
 * @description Enhanced core logic for Markdown to Word exporter with advanced features
 * @version 2.0.0
 * @author Markdown to Word Exporter Team
 * @license MIT
 */

// DOM element references for the main application components
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

// Component instances - initialized on DOM load
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
    if (input.value.trim() === '') {
      input.value = content;
      input.dispatchEvent(new Event('input'));
      showNotification('Template loaded successfully! 📋', 'success', 3000);
    } else {
      showCustomConfirm(
        '📋 Replace Content',
        'Replace current content with template?',
        (confirmed) => {
          if (confirmed) {
            input.value = content;
            input.dispatchEvent(new Event('input'));
            showNotification('Template loaded successfully! 📋', 'success', 3000);
          }
        }
      );
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
      // Basic content validation - removed size restriction
      if (content.length > 10000000) { // 10MB limit for auto-save only
        console.warn('Document very large, auto-save may be slow');
      }
      return content;
    });
  } catch (error) {
    console.error('Auto-save initialization failed:', error);
  }
}

/**
 * Restore auto-saved content using custom confirmation modal
 * @description Prompts user to restore auto-saved content with a custom modal instead of browser confirm
 */
function restoreAutosavedContent() {
  const autosaved = fileManager.restoreAutosaved();
  if (autosaved && autosaved.trim()) {
    // Use custom confirmation modal to avoid browser dialog suppression
    showCustomConfirm(
      '💾 Restore Content',
      'Auto-saved content found. Would you like to restore it?',
      (confirmed) => {
        if (confirmed) {
          input.value = autosaved;
          input.dispatchEvent(new Event('input'));
          showNotification('Auto-saved content restored! 💾', 'success', 3000);
        } else {
          fileManager.clearAutosaved();
          showNotification('Auto-saved content discarded 🗑️', 'info', 2000);
        }
      }
    );
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
  
  // Statistics functionality
  document.getElementById('stats-btn').onclick = () => {
    updateStats();
    document.getElementById('stats-modal').style.display = 'block';
  };
  
  // Help functionality
  document.getElementById('help-btn').onclick = () => {
    document.getElementById('help-modal').style.display = 'block';
  };
  
  // Additional export options
  document.getElementById('download-standalone-btn').onclick = () => exportDocument('standalone');
  document.getElementById('download-pdf-btn').onclick = () => exportDocument('pdf');
  
  // Initialize collapsible tools
  initializeToolsToggle();
  
  // Initialize master toolbar toggle
  initializeToolbarMasterToggle();
  
  // Initialize custom confirmation
  initializeCustomConfirmation();
  
  // Add smooth scrolling and animations
  addSmoothScrolling();
  enhanceButtonAnimations();
}

// Make renderPreview globally available
window.renderPreview = renderPreview;

/**
 * Toggle button states based on input with validation and debounced updates
 */
let debounceTimer;
input.addEventListener('input', () => {
  const content = input.value.trim();
  const hasContent = content.length > 0;
  const isValidContent = content.length <= 10000000; // 10MB limit for live preview
  
  previewBtn.disabled = !hasContent || !isValidContent;
  exportBtn.disabled = !hasContent || !isValidContent;
  
  // Debounced auto-formatting to improve performance
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    autoFormatTables();
    
    // Auto-preview for small documents
    if (content.length < 10000 && hasContent) {
      renderPreview();
    }
  }, 300);
  
  // Show warning for very large documents
  if (content.length > 2000000) { // 2MB warning
    showContentWarning('Very large document detected. Performance may be affected for live preview.');
  }
});

/**
 * Debounced auto-format markdown tables
 */
function autoFormatTables() {
  const content = input.value;
  if (content.length > 50000) return; // Skip for very large documents
  
  const lines = content.split('\n');
  let formatted = false;
  
  for (let i = 0; i < lines.length && i < 1000; i++) { // Limit processing
    if (lines[i].includes('|') && lines[i].trim().startsWith('|')) {
      // Basic table formatting - ensure proper spacing
      const cells = lines[i].split('|').map(cell => cell.trim());
      if (cells.length > 2) { // Valid table row
        const formattedLine = '| ' + cells.slice(1, -1).join(' | ') + ' |';
        if (lines[i] !== formattedLine) {
          lines[i] = formattedLine;
          formatted = true;
        }
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
  if (input.value.trim()) {
    showCustomConfirm(
      '🗑️ Clear Document',
      'Clear all content? This cannot be undone.',
      (confirmed) => {
        if (confirmed) {
          input.value = '';
          previewPane.innerHTML = '<em>Enter Markdown and click Preview...</em>';
          previewBtn.disabled = true;
          exportBtn.disabled = true;
          fileManager.clearAutosaved();
          showNotification('Document cleared successfully! 🗑️', 'success', 3000);
        }
      }
    );
  } else {
    showNotification('Document is already empty! 📄', 'info', 2000);
  }
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
 * Render Markdown to HTML in preview pane with security and performance optimization
 */
function renderPreview() {
  try {
    const content = input.value;
    
    // Show loading state for large documents
    if (content.length > 10000) {
      previewPane.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;"><div class="spinner" style="display: inline-block;"></div><br>Rendering preview...</div>';
    }
    
    // Use setTimeout for non-blocking processing
    setTimeout(() => {
      try {
        // Basic security validation - increased size limit
        if (content.length > 10000000) { // 10MB limit for preview
          throw new Error('Content too large to preview (max 10MB)');
        }
        
        // Sanitize content - remove potentially dangerous elements
        const sanitizedContent = sanitizeMarkdown(content);
        const html = converter.makeHtml(sanitizedContent);
        
        // Additional HTML sanitization
        const sanitizedHtml = sanitizeHtml(html);
        previewPane.innerHTML = sanitizedHtml;
        
        // Process image placeholders for preview
        processImagePlaceholders();
        
        // Add copy-to-clipboard for code blocks
        addCodeBlockFeatures();
        
      } catch (error) {
        previewPane.innerHTML = `<div style="color: #d32f2f; padding: 1rem; border: 1px solid #d32f2f; border-radius: 4px; background: #ffebee;">
          <strong>❌ Preview Error</strong><br>
          ${error.message}
        </div>`;
      }
    }, content.length > 10000 ? 100 : 0);
    
  } catch (error) {
    previewPane.innerHTML = `<div style="color: #d32f2f; padding: 1rem; border: 1px solid #d32f2f; border-radius: 4px; background: #ffebee;">
      <strong>❌ Preview Error</strong><br>
      ${error.message}
    </div>`;
  }
}

/**
 * Add interactive features to code blocks
 */
function addCodeBlockFeatures() {
  const codeBlocks = previewPane.querySelectorAll('pre');
  codeBlocks.forEach(block => {
    // Add copy button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy';
    copyBtn.style.cssText = `
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(0,0,0,0.7);
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-size: 0.8rem;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    `;
    
    block.style.position = 'relative';
    block.appendChild(copyBtn);
    
    // Show/hide copy button on hover
    block.addEventListener('mouseenter', () => copyBtn.style.opacity = '1');
    block.addEventListener('mouseleave', () => copyBtn.style.opacity = '0');
    
    // Copy functionality
    copyBtn.addEventListener('click', () => {
      const code = block.querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
      }).catch(() => {
        copyBtn.textContent = '❌ Failed';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
      });
    });
  });
}

/**
 * Process image placeholders in preview
 */
function processImagePlaceholders() {
  if (!window.imageManager || !previewPane) return;
  
  // Find all image links with # references (our placeholders)
  const imageLinks = previewPane.querySelectorAll('img[src^="#"]');
  
  imageLinks.forEach(img => {
    const imageId = img.src.substring(1); // Remove the # prefix
    const imageData = window.imageManager.images.get(imageId);
    
    if (imageData) {
      // Create a placeholder div to replace the broken image
      const placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder';
      placeholder.style.cssText = `
        display: inline-block;
        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
        border: 2px dashed #2196f3;
        border-radius: 8px;
        padding: 12px 16px;
        margin: 8px;
        font-size: 0.9rem;
        color: #1976d2;
        cursor: pointer;
        transition: all 0.2s ease;
        max-width: 300px;
        vertical-align: top;
      `;
      
      placeholder.innerHTML = `
        🖼️ ${imageData.name}
        <div style="font-size: 0.75rem; color: #666; margin-top: 4px;">
          ${imageData.type} • ${window.imageManager.formatFileSize(imageData.size)}
          ${imageData.width ? `• ${imageData.width}×${imageData.height}px` : ''}
          <br><span style="color: #1976d2;">Click to preview</span>
        </div>
      `;
      
      // Add click handler to show image preview
      placeholder.addEventListener('click', () => {
        window.imageManager.createImagePreview(imageId);
      });
      
      // Add hover effect
      placeholder.addEventListener('mouseenter', () => {
        placeholder.style.background = 'linear-gradient(135deg, #bbdefb, #90caf9)';
        placeholder.style.transform = 'translateY(-2px)';
        placeholder.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
      });
      
      placeholder.addEventListener('mouseleave', () => {
        placeholder.style.background = 'linear-gradient(135deg, #e3f2fd, #bbdefb)';
        placeholder.style.transform = 'translateY(0)';
        placeholder.style.boxShadow = 'none';
      });
      
      // Replace the broken image with our placeholder
      img.parentNode.replaceChild(placeholder, img);
    }
  });
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
 * Enhanced document export with multiple formats and security
 */
async function exportDocument(format) {
  // Validate input before processing
  const content = input.value.trim();
  if (!content) {
    showUserNotification('⚠️ Cannot export empty document', 'warning');
    return;
  }
  
  // Expand image placeholders for export
  const expandedContent = window.imageManager ? window.imageManager.expandImagesForExport(content) : content;
  
  // Removed size restriction for export - allow any size
  if (expandedContent.length > 50000000) { // 50MB warning only
    showUserNotification('⚠️ Very large document - export may take some time', 'warning');
  }

  spinner.style.display = 'inline-block';
  exportBtn.disabled = true;

  // Sanitize filename
  const rawFilename = titleInput.value || 'document';
  const filename = sanitizeFilename(rawFilename);
  
  try {
    switch (format) {
      case 'word':
        await exportToWord(filename, expandedContent);
        break;
      case 'html':
        await exportToHtml(filename, expandedContent);
        break;
      case 'text':
        await exportToText(filename, expandedContent);
        break;
      case 'standalone':
        await exportToStandalone(filename, expandedContent);
        break;
      case 'pdf':
        await exportToPDF(filename);
        break;
      default:
        throw new Error('Unknown export format');
    }
    
    showUserNotification(`✅ Successfully exported as ${format.toUpperCase()}`, 'success');
    
  } catch (err) {
    console.error('Export error:', err);
    
    // Show user-friendly error message
    const errorMsg = err.message || 'An unknown error occurred';
    showUserNotification(`❌ Export Failed: ${errorMsg}`, 'error');
    
  } finally {
    spinner.style.display = 'none';
    exportBtn.disabled = false;
  }
}

/**
 * Sanitize filename for security
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9\-_\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 100) // Limit length
    || 'document'; // Fallback name
}

/**
 * Show user notification with different types
 */
function showUserNotification(message, type = 'info') {
  const colors = {
    success: '#4caf50',
    warning: '#ff9800', 
    error: '#f44336',
    info: '#2196f3'
  };
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideInRight 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  notification.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; margin-left: 0.5rem;">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
}

/**
 * Export to Word document
 */
async function exportToWord(filename, content = null) {
  const markdownContent = content || input.value;
  const bodyHtml = converter.makeHtml(markdownContent);
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
        img { max-width: 100%; height: auto; margin: 10px 0; }
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
async function exportToHtml(filename, content = null) {
  const markdownContent = content || input.value;
  const html = converter.makeHtml(markdownContent);
  fileManager.saveAsHtml(html, `${filename}.html`);
}

/**
 * Export to plain text
 */
async function exportToText(filename, content = null) {
  const markdownContent = content || input.value;
  fileManager.saveAsText(markdownContent, `${filename}.txt`);
}

/**
 * Export to standalone HTML
 */
async function exportToStandalone(filename, content = null) {
  const markdownContent = content || input.value;
  printExport.downloadStandaloneHTML(
    markdownContent,
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
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

/**
 * Image upload and management functionality
 */
function handleImageUpload() {
  const fileInput = document.getElementById('image-upload');
  fileInput.click();
}

// Initialize image upload event listener
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('image-upload');
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      
      // Show loading indicator
      showUserNotification('📁 Uploading images...', 'info');
      
      try {
        let imagePromises;
        if (window.imageManager && window.imageManager.processImageFile) {
          // Use new image manager
          imagePromises = files.map(file => window.imageManager.processImageFile(file));
        } else {
          // Fallback to old method (shouldn't happen, but just in case)
          console.warn('ImageManager not available, using fallback');
          imagePromises = files.map(file => processImageFileFallback(file));
        }
        const imageResults = await Promise.all(imagePromises);
        
        // Insert images into markdown
        const cursor = input.selectionStart;
        const imageMarkdown = imageResults.join('\n\n');
        const newContent = input.value.slice(0, cursor) + '\n\n' + imageMarkdown + '\n\n' + input.value.slice(cursor);
        
        input.value = newContent;
        input.dispatchEvent(new Event('input'));
        
        // Set cursor after inserted images
        const newCursor = cursor + imageMarkdown.length + 4;
        input.setSelectionRange(newCursor, newCursor);
        input.focus();
        
        showUserNotification(`✅ Successfully uploaded ${files.length} image(s)`, 'success');
        
        // Clear the file input
        fileInput.value = '';
        
      } catch (error) {
        console.error('Image upload error:', error);
        showUserNotification('❌ Failed to upload images: ' + error.message, 'error');
      }
    });
  }
});

/**
 * Fallback image processing function
 */
async function processImageFileFallback(file) {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error(`${file.name} is not an image file`));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 50);
      resolve(`![${fileName}](${base64Data}){.center width=80%}`);
    };
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/**
 * Enhanced image support in markdown converter
 */
function enhanceImageSupport() {
  // Add CSS for image positioning
  const imageCSS = `
    .preview img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin: 10px 0;
    }
    
    .preview img.center {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    
    .preview img.right {
      float: right;
      margin-left: 20px;
      margin-bottom: 10px;
    }
    
    .preview img.left {
      float: left;
      margin-right: 20px;
      margin-bottom: 10px;
    }
    
    .preview img.float-left {
      float: left;
      margin: 0 20px 10px 0;
    }
    
    .preview img.float-right {
      float: right;
      margin: 0 0 10px 20px;
    }
    
    .preview .image-container {
      clear: both;
      margin: 20px 0;
    }
    
    .preview .image-caption {
      font-style: italic;
      text-align: center;
      color: #666;
      font-size: 0.9em;
      margin-top: 5px;
    }
  `;
  
  const imageStyleSheet = document.createElement('style');
  imageStyleSheet.textContent = imageCSS;
  document.head.appendChild(imageStyleSheet);
  
  // Process images in preview after render
  const originalRenderPreview = window.renderPreview;
  window.renderPreview = function() {
    if (originalRenderPreview) {
      originalRenderPreview();
    }
    processImagesInPreview();
  };
}

/**
 * Process images in preview to apply positioning
 */
function processImagesInPreview() {
  const previewPane = document.getElementById('preview-pane');
  if (!previewPane) return;
  
  const images = previewPane.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt') || '';
    
    // Parse markdown-style attributes from the image's parent text
    const imgElement = img.parentElement;
    if (imgElement && imgElement.innerHTML) {
      const imgHTML = imgElement.innerHTML;
      
      // Look for attribute syntax: {.class width=50% height=auto}
      const attrMatch = imgHTML.match(/\{([^}]+)\}/);
      if (attrMatch) {
        const attrs = attrMatch[1];
        
        // Parse classes
        const classMatches = attrs.match(/\.([a-zA-Z-]+)/g);
        if (classMatches) {
          classMatches.forEach(cls => {
            img.classList.add(cls.substring(1)); // Remove the dot
          });
        }
        
        // Parse width
        const widthMatch = attrs.match(/width=([^}\s]+)/);
        if (widthMatch) {
          img.style.width = widthMatch[1];
        }
        
        // Parse height
        const heightMatch = attrs.match(/height=([^}\s]+)/);
        if (heightMatch) {
          img.style.height = heightMatch[1];
        }
        
        // Remove the attribute text from display
        imgElement.innerHTML = imgElement.innerHTML.replace(/\{[^}]+\}/, '');
      }
    }
    
    // Add click handler for image preview
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => showImagePreview(src, alt));
  });
}

/**
 * Show image preview modal
 */
function showImagePreview(src, alt) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('image-preview-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'image-preview-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 90vw; max-height: 90vh; text-align: center;">
        <span class="close" onclick="this.parentElement.parentElement.style.display='none'">&times;</span>
        <img id="preview-image" style="max-width: 100%; max-height: 80vh; object-fit: contain;" />
        <p id="preview-caption" style="margin-top: 10px; font-style: italic; color: #666;"></p>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Update modal content
  document.getElementById('preview-image').src = src;
  document.getElementById('preview-caption').textContent = alt || 'Image Preview';
  modal.style.display = 'block';
}

/**
 * Enhanced caching and storage management
 */
class EnhancedStorage {
  constructor() {
    this.storageKey = 'markdown_editor_data';
    this.cacheKey = 'markdown_editor_cache';
    this.settingsKey = 'markdown_editor_settings';
    
    // Initialize cache cleanup
    this.cleanupOldCache();
    
    // Set up periodic cache management
    setInterval(() => this.cleanupOldCache(), 60000); // Every minute
  }
  
  /**
   * Save document with enhanced metadata
   */
  saveDocument(content, metadata = {}) {
    try {
      const document = {
        content,
        metadata: {
          title: metadata.title || 'Untitled Document',
          author: metadata.author || '',
          lastModified: new Date().toISOString(),
          wordCount: content.trim().split(/\s+/).length,
          characterCount: content.length,
          ...metadata
        },
        version: '1.0'
      };
      
      // Save to localStorage with compression for large documents
      if (content.length > 100000) { // 100KB threshold
        document.compressed = true;
        document.content = this.compressContent(content);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(document));
      
      // Also save to cache for quick access
      this.updateCache(document);
      
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      // Fallback: try to save without metadata
      try {
        localStorage.setItem(this.storageKey + '_backup', content);
        return false; // Partial save
      } catch (backupError) {
        throw new Error('Storage quota exceeded. Please clear some space and try again.');
      }
    }
  }
  
  /**
   * Load document with fallback options
   */
  loadDocument() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) {
        // Try backup
        const backup = localStorage.getItem(this.storageKey + '_backup');
        if (backup) {
          return { content: backup, metadata: { title: 'Recovered Document' } };
        }
        return null;
      }
      
      const document = JSON.parse(saved);
      
      // Decompress if needed
      if (document.compressed) {
        document.content = this.decompressContent(document.content);
      }
      
      return document;
    } catch (error) {
      console.error('Load failed:', error);
      
      // Try to recover from backup
      const backup = localStorage.getItem(this.storageKey + '_backup');
      if (backup) {
        return { content: backup, metadata: { title: 'Recovered Document' } };
      }
      
      return null;
    }
  }
  
  /**
   * Simple compression for large text content
   */
  compressContent(content) {
    // Simple run-length encoding for spaces and newlines
    return content
      .replace(/\s{2,}/g, (match) => `\\s{${match.length}}`)
      .replace(/\n{2,}/g, (match) => `\\n{${match.length}}`);
  }
  
  /**
   * Decompress content
   */
  decompressContent(compressed) {
    return compressed
      .replace(/\\s\{(\d+)\}/g, (match, count) => ' '.repeat(parseInt(count)))
      .replace(/\\n\{(\d+)\}/g, (match, count) => '\n'.repeat(parseInt(count)));
  }
  
  /**
   * Update cache with recent documents
   */
  updateCache(document) {
    try {
      let cache = JSON.parse(localStorage.getItem(this.cacheKey) || '[]');
      
      // Add to cache (limit to 10 recent documents)
      cache.unshift({
        id: Date.now(),
        title: document.metadata.title,
        preview: document.content.substring(0, 200) + '...',
        lastModified: document.metadata.lastModified,
        wordCount: document.metadata.wordCount
      });
      
      // Keep only recent 10
      cache = cache.slice(0, 10);
      
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.error('Cache update failed:', error);
    }
  }
  
  /**
   * Clean up old cache entries
   */
  cleanupOldCache() {
    try {
      const cache = JSON.parse(localStorage.getItem(this.cacheKey) || '[]');
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const cleaned = cache.filter(item => 
        new Date(item.lastModified) > weekAgo
      );
      
      if (cleaned.length !== cache.length) {
        localStorage.setItem(this.cacheKey, JSON.stringify(cleaned));
      }
    } catch (error) {
      console.error('Cache cleanup failed:', error);
    }
  }
  
  /**
   * Get storage usage information
   */
  getStorageInfo() {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length;
        }
      }
      
      return {
        used: totalSize,
        usedMB: (totalSize / 1024 / 1024).toFixed(2),
        available: 5 * 1024 * 1024 - totalSize, // Assume 5MB limit
        availableMB: ((5 * 1024 * 1024 - totalSize) / 1024 / 1024).toFixed(2)
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  /**
   * Save user settings
   */
  saveSettings(settings) {
    try {
      const currentSettings = this.loadSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(this.settingsKey, JSON.stringify(newSettings));
      return true;
    } catch (error) {
      console.error('Settings save failed:', error);
      return false;
    }
  }
  
  /**
   * Load user settings
   */
  loadSettings() {
    try {
      const settings = localStorage.getItem(this.settingsKey);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Settings load failed:', error);
      return {};
    }
  }
}

// Initialize enhanced storage
const enhancedStorage = new EnhancedStorage();

// Update the existing autosave to use enhanced storage
function updateAutosaveWithEnhancedStorage() {
  const originalSaveMethod = fileManager.enableAutosave;
  if (originalSaveMethod && typeof originalSaveMethod === 'function') {
    // Override the autosave to use enhanced storage
    setInterval(() => {
      const content = input.value;
      if (content.trim()) {
        enhancedStorage.saveDocument(content, {
          title: document.getElementById('doc-title')?.value || 'Untitled',
          author: document.getElementById('doc-author')?.value || '',
          date: document.getElementById('doc-date')?.value || ''
        });
      }
    }, 5000); // Every 5 seconds
  }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    enhanceImageSupport();
    updateAutosaveWithEnhancedStorage();
    initializeMobileToolbar();
    
    // Load saved settings
    const settings = enhancedStorage.loadSettings();
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }, 500);
});

/**
 * Initialize mobile toolbar functionality
 */
function initializeMobileToolbar() {
  const toolbar = document.getElementById('toolbar');
  const primaryActions = toolbar?.querySelector('.primary-actions');
  
  if (!toolbar || !primaryActions) return;
  
  // Add click handler for mobile toolbar expansion
  function toggleToolbar() {
    if (window.innerWidth <= 768) {
      toolbar.classList.toggle('expanded');
    }
  }
  
  // Add click listener to primary actions area on mobile
  if (window.innerWidth <= 768) {
    primaryActions.addEventListener('click', (e) => {
      // Only toggle if clicking on the primary actions area, not on buttons
      if (e.target === primaryActions || e.target.classList.contains('section-label')) {
        toggleToolbar();
      }
    });
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      toolbar.classList.remove('expanded');
    }
  });
}

/**
 * Initialize master toolbar collapse functionality
 * @description Provides ability to collapse/expand the entire toolbar for more editing space
 */
function initializeToolbarMasterToggle() {
  const masterToggle = document.getElementById('toolbar-master-toggle');
  const toolbarTitle = document.querySelector('.toolbar-title');
  const toolbar = document.getElementById('toolbar');
  const toolbarSections = document.getElementById('toolbar-sections');
  
  if (!masterToggle || !toolbar || !toolbarSections) {
    console.warn('Toolbar master toggle elements not found');
    return;
  }
  
  // Load saved state from localStorage
  const isCollapsed = localStorage.getItem('toolbarCollapsed') === 'true';
  const isMobileExpanded = localStorage.getItem('toolbarMobileExpanded') === 'true';
  
  if (isCollapsed) {
    toolbar.classList.add('collapsed');
    masterToggle.textContent = '▼';
    masterToggle.classList.add('collapsed');
  }
  
  // Set mobile expanded state
  if (isMobileExpanded && window.innerWidth <= 768) {
    toolbar.classList.add('expanded');
  }
  
  /**
   * Toggle toolbar collapse state
   * @param {boolean} fromMobile - Whether the toggle is triggered from mobile interaction
   */
  const toggleToolbar = (fromMobile = false) => {
    const isCurrentlyCollapsed = toolbar.classList.contains('collapsed');
    
    if (isCurrentlyCollapsed) {
      // Expand toolbar
      toolbar.classList.remove('collapsed');
      masterToggle.textContent = '▲';
      masterToggle.classList.remove('collapsed');
      localStorage.setItem('toolbarCollapsed', 'false');
      showNotification('Toolbar expanded 📖', 'info', 2000);
    } else {
      // Collapse toolbar
      toolbar.classList.add('collapsed');
      masterToggle.textContent = '▼';
      masterToggle.classList.add('collapsed');
      localStorage.setItem('toolbarCollapsed', 'true');
      showNotification('Toolbar collapsed 📁 - More editing space!', 'info', 2000);
    }
    
    // On mobile, also handle the mobile expansion
    if (fromMobile || window.innerWidth <= 768) {
      handleMobileToolbarToggle();
    }
  };
  
  /**
   * Handle mobile-specific toolbar expansion
   */
  const handleMobileToolbarToggle = () => {
    if (window.innerWidth <= 768) {
      const isMobileExpanded = toolbar.classList.contains('expanded');
      
      if (isMobileExpanded) {
        toolbar.classList.remove('expanded');
        localStorage.setItem('toolbarMobileExpanded', 'false');
      } else {
        toolbar.classList.add('expanded');
        localStorage.setItem('toolbarMobileExpanded', 'true');
      }
    }
  };
  
  // Add click event listeners
  masterToggle.addEventListener('click', () => toggleToolbar(false));
  
  // On mobile, clicking the toolbar title toggles mobile expansion
  if (toolbarTitle) {
    toolbarTitle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        handleMobileToolbarToggle();
      }
    });
    
    // Add cursor pointer style for mobile
    toolbarTitle.style.cursor = window.innerWidth <= 768 ? 'pointer' : 'default';
  }
  
  // Handle window resize to update mobile behavior
  window.addEventListener('resize', () => {
    if (toolbarTitle) {
      toolbarTitle.style.cursor = window.innerWidth <= 768 ? 'pointer' : 'default';
    }
    
    // Reset mobile expanded state on desktop
    if (window.innerWidth > 768) {
      toolbar.classList.remove('expanded');
    }
  });
  
  // Add keyboard shortcut (Ctrl+T) for toolbar toggle
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 't') {
      e.preventDefault();
      toggleToolbar(false);
    }
  });
}

/**
 * Initialize collapsible tools section
 */
function initializeToolsToggle() {
  const toolsToggle = document.getElementById('tools-toggle');
  const toolsButtons = document.getElementById('tools-buttons');
  
  if (!toolsToggle || !toolsButtons) return;
  
  // Load saved state
  const isCollapsed = localStorage.getItem('toolsCollapsed') === 'true';
  if (isCollapsed) {
    toolsButtons.classList.add('collapsed');
    toolsToggle.textContent = '▶';
    toolsToggle.classList.add('collapsed');
  }
  
  toolsToggle.addEventListener('click', () => {
    const isCurrentlyCollapsed = toolsButtons.classList.contains('collapsed');
    
    if (isCurrentlyCollapsed) {
      toolsButtons.classList.remove('collapsed');
      toolsToggle.textContent = '▼';
      toolsToggle.classList.remove('collapsed');
      localStorage.setItem('toolsCollapsed', 'false');
      showNotification('Tools section expanded 📖', 'info', 2000);
    } else {
      toolsButtons.classList.add('collapsed');
      toolsToggle.textContent = '▶';
      toolsToggle.classList.add('collapsed');
      localStorage.setItem('toolsCollapsed', 'true');
      showNotification('Tools section collapsed 📁', 'info', 2000);
    }
  });
}

/**
 * Initialize custom confirmation modal
 */
function initializeCustomConfirmation() {
  const modal = document.getElementById('confirmation-modal');
  const cancelBtn = document.getElementById('confirmation-cancel');
  const confirmBtn = document.getElementById('confirmation-confirm');
  
  if (!modal || !cancelBtn || !confirmBtn) return;
  
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    if (window.currentConfirmCallback) {
      window.currentConfirmCallback(false);
    }
  });
  
  confirmBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    if (window.currentConfirmCallback) {
      window.currentConfirmCallback(true);
    }
  });
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      if (window.currentConfirmCallback) {
        window.currentConfirmCallback(false);
      }
    }
  });
}

/**
 * Custom confirmation dialog
 */
function showCustomConfirm(title, message, callback) {
  const modal = document.getElementById('confirmation-modal');
  const titleEl = document.getElementById('confirmation-title');
  const messageEl = document.getElementById('confirmation-message');
  
  if (!modal || !titleEl || !messageEl) return;
  
  titleEl.textContent = title;
  messageEl.textContent = message;
  window.currentConfirmCallback = callback;
  
  modal.style.display = 'block';
}

/**
 * Add smooth scrolling
 */
function addSmoothScrolling() {
  // Smooth scroll to sections
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Enhance button animations
 */
function enhanceButtonAnimations() {
  // Add ripple effect to buttons
  document.querySelectorAll('.btn, .format-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      // Don't add ripple if already exists
      if (this.querySelector('.ripple')) return;
      
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      ripple.classList.add('ripple');
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove();
        }
      }, 600);
    });
  });
}

// Add CSS for ripple animation if not already present
if (!document.querySelector('#ripple-style')) {
  const style = document.createElement('style');
  style.id = 'ripple-style';
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}