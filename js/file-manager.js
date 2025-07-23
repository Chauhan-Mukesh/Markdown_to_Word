/**
 * @file file-manager.js
 * @description File management functionality for loading/saving markdown files
 */

class FileManager {
  constructor() {
    this.autosaveKey = 'markdown-editor-content';
    this.autosaveInterval = 30000; // 30 seconds
    this.autosaveTimer = null;
  }

  /**
   * Load a markdown file from user's device
   */
  loadFile(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          callback(e.target.result, file.name);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  /**
   * Save markdown content as a file
   */
  saveAsMarkdown(content, filename = 'document.md') {
    const blob = new Blob([content], { type: 'text/markdown' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Save content as HTML file
   */
  saveAsHtml(content, filename = 'document.html') {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Save content as plain text
   */
  saveAsText(content, filename = 'document.txt') {
    const blob = new Blob([content], { type: 'text/plain' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Helper method to download a blob
   */
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Auto-save content to localStorage
   */
  enableAutosave(getContentCallback) {
    this.autosaveTimer = setInterval(() => {
      const content = getContentCallback();
      if (content.trim()) {
        localStorage.setItem(this.autosaveKey, content);
        this.showAutosaveIndicator();
      }
    }, this.autosaveInterval);
  }

  /**
   * Restore auto-saved content
   */
  restoreAutosaved() {
    return localStorage.getItem(this.autosaveKey) || '';
  }

  /**
   * Clear auto-saved content
   */
  clearAutosaved() {
    localStorage.removeItem(this.autosaveKey);
  }

  /**
   * Show auto-save indicator
   */
  showAutosaveIndicator() {
    let indicator = document.getElementById('autosave-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'autosave-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #4caf50;
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 12px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
      `;
      indicator.textContent = 'Auto-saved';
      document.body.appendChild(indicator);
    }
    
    indicator.style.opacity = '1';
    setTimeout(() => {
      indicator.style.opacity = '0';
    }, 2000);
  }

  /**
   * Disable auto-save
   */
  disableAutosave() {
    if (this.autosaveTimer) {
      clearInterval(this.autosaveTimer);
      this.autosaveTimer = null;
    }
  }
}

window.FileManager = FileManager;