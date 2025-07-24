/**
 * @file panel-resizer.js
 * @description Panel resizing functionality for editor and preview panels
 * @version 1.0.0
 * @author MarkdownForge Team
 * @license GPL-3.0
 * 
 * @overview
 * This module provides resizable panel functionality allowing users to adjust
 * the width of editor and preview panels by dragging a divider between them.
 */

class PanelResizer {
  constructor() {
    this.isResizing = false;
    this.editorPanel = document.getElementById('editor-panel');
    this.previewPanel = document.getElementById('preview-panel');
    this.resizer = document.getElementById('panel-resizer');
    this.app = document.getElementById('app');
    
    this.minPanelWidth = 300; // Minimum width for panels in pixels
    this.maxPanelRatio = 0.8; // Maximum ratio (80%) for one panel
    this.minPanelRatio = 0.2; // Minimum ratio (20%) for one panel
    
    // Debounce timer for saving
    this.saveTimer = null;
    
    this.init();
  }
  
  init() {
    if (!this.resizer || !this.editorPanel || !this.previewPanel) {
      console.warn('Panel resizer elements not found');
      return;
    }
    
    this.setupEventListeners();
    this.loadSavedSizes();
  }
  
  setupEventListeners() {
    // Mouse events
    this.resizer.addEventListener('mousedown', this.startResize.bind(this));
    document.addEventListener('mousemove', this.resize.bind(this));
    document.addEventListener('mouseup', this.stopResize.bind(this));
    
    // Enhanced touch events for mobile and tablet
    this.resizer.addEventListener('touchstart', this.startResize.bind(this), { passive: false });
    document.addEventListener('touchmove', this.resize.bind(this), { passive: false });
    document.addEventListener('touchend', this.stopResize.bind(this));
    document.addEventListener('touchcancel', this.stopResize.bind(this));
    
    // Keyboard accessibility
    this.resizer.addEventListener('keydown', this.handleKeyboard.bind(this));
    this.resizer.setAttribute('tabindex', '0');
    this.resizer.setAttribute('role', 'separator');
    this.resizer.setAttribute('aria-orientation', 'vertical');
    this.resizer.setAttribute('aria-label', 'Resize panels');
    
    // Window resize handler
    window.addEventListener('resize', this.handleWindowResize.bind(this));
    
    // Enhanced touch support for tablets - add visual feedback
    this.resizer.addEventListener('touchstart', () => {
      this.resizer.style.transform = 'scaleX(1.3)';
      this.resizer.style.boxShadow = '0 0 20px rgba(25, 118, 210, 0.3)';
    }, { passive: true });
    
    this.resizer.addEventListener('touchend', () => {
      setTimeout(() => {
        this.resizer.style.transform = '';
        this.resizer.style.boxShadow = '';
      }, 150);
    }, { passive: true });
  }
  
  startResize(e) {
    this.isResizing = true;
    this.resizer.classList.add('resizing');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    // Add smooth transition class to panels during resize
    this.editorPanel.classList.add('resizing');
    this.previewPanel.classList.add('resizing');
    
    // Add overlay to prevent iframe interactions during resize
    this.addResizeOverlay();
    
    e.preventDefault();
  }
  
  resize(e) {
    if (!this.isResizing) return;
    
    // Handle both mouse and touch events
    let clientX;
    if (e.type === 'touchmove') {
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
      } else {
        return; // No valid touch
      }
    } else {
      clientX = e.clientX;
    }
    
    if (!clientX) return;
    
    // Use requestAnimationFrame for smoother resizing
    requestAnimationFrame(() => {
      const appRect = this.app.getBoundingClientRect();
      const resizerWidth = this.resizer.offsetWidth;
      
      // Calculate new widths
      const totalWidth = appRect.width - resizerWidth;
      const mouseX = clientX - appRect.left;
      
      let editorWidth = mouseX;
      let previewWidth = totalWidth - editorWidth;
      
      // Apply constraints with smoother transitions
      const minWidth = Math.max(this.minPanelWidth, totalWidth * this.minPanelRatio);
      const maxWidth = totalWidth * this.maxPanelRatio;
      
      editorWidth = Math.max(minWidth, Math.min(maxWidth, editorWidth));
      previewWidth = totalWidth - editorWidth;
      
      // Convert to percentages with higher precision
      const editorPercent = Math.round((editorWidth / totalWidth) * 10000) / 100;
      const previewPercent = Math.round((previewWidth / totalWidth) * 10000) / 100;
      
      // Apply new sizes with smooth transitions
      this.editorPanel.style.flex = `0 0 ${editorPercent}%`;
      this.previewPanel.style.flex = `0 0 ${previewPercent}%`;
      
      // Save sizes with debouncing
      this.debouncedSave(editorPercent, previewPercent);
    });
    
    e.preventDefault();
  }
  
  stopResize() {
    if (!this.isResizing) return;
    
    this.isResizing = false;
    this.resizer.classList.remove('resizing');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Remove transition classes after a short delay for smooth finishing
    setTimeout(() => {
      this.editorPanel.classList.remove('resizing');
      this.previewPanel.classList.remove('resizing');
    }, 150);
    
    this.removeResizeOverlay();
  }
  
  handleKeyboard(e) {
    const step = 5; // 5% steps
    let editorPercent = this.getCurrentEditorPercent();
    
    switch (e.key) {
      case 'ArrowLeft':
        editorPercent = Math.max(this.minPanelRatio * 100, editorPercent - step);
        break;
      case 'ArrowRight':
        editorPercent = Math.min(this.maxPanelRatio * 100, editorPercent + step);
        break;
      case 'Home':
        editorPercent = 30; // Reset to 30%
        break;
      case 'End':
        editorPercent = 70; // Reset to 70%
        break;
      case 'Enter':
      case ' ':
        editorPercent = 55; // Reset to default 55%
        break;
      default:
        return;
    }
    
    const previewPercent = 100 - editorPercent;
    this.editorPanel.style.flex = `0 0 ${editorPercent}%`;
    this.previewPanel.style.flex = `0 0 ${previewPercent}%`;
    this.saveSizes(editorPercent, previewPercent);
    
    e.preventDefault();
  }
  
  handleWindowResize() {
    // Ensure panels maintain their relative sizes on window resize
    const savedSizes = this.getSavedSizes();
    if (savedSizes) {
      this.editorPanel.style.flex = `0 0 ${savedSizes.editor}%`;
      this.previewPanel.style.flex = `0 0 ${savedSizes.preview}%`;
    }
  }
  
  getCurrentEditorPercent() {
    const editorStyle = window.getComputedStyle(this.editorPanel);
    const flexBasis = editorStyle.flexBasis;
    return parseFloat(flexBasis);
  }
  
  addResizeOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'resize-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      z-index: 9999;
      cursor: col-resize;
    `;
    document.body.appendChild(overlay);
  }
  
  removeResizeOverlay() {
    const overlay = document.getElementById('resize-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
  
  saveSizes(editorPercent, previewPercent) {
    try {
      localStorage.setItem('panelSizes', JSON.stringify({
        editor: editorPercent,
        preview: previewPercent
      }));
    } catch (e) {
      console.warn('Could not save panel sizes to localStorage:', e);
    }
  }
  
  debouncedSave(editorPercent, previewPercent) {
    // Clear existing timer
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }
    
    // Set new timer to save after 100ms of no resize activity
    this.saveTimer = setTimeout(() => {
      this.saveSizes(editorPercent, previewPercent);
    }, 100);
  }
  
  getSavedSizes() {
    try {
      const saved = localStorage.getItem('panelSizes');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Could not load panel sizes from localStorage:', e);
      return null;
    }
  }
  
  loadSavedSizes() {
    const savedSizes = this.getSavedSizes();
    if (savedSizes && savedSizes.editor && savedSizes.preview) {
      this.editorPanel.style.flex = `0 0 ${savedSizes.editor}%`;
      this.previewPanel.style.flex = `0 0 ${savedSizes.preview}%`;
    }
  }
  
  // Public method to reset to default sizes
  resetToDefault() {
    const defaultEditor = 55;
    const defaultPreview = 45;
    
    this.editorPanel.style.flex = `0 0 ${defaultEditor}%`;
    this.previewPanel.style.flex = `0 0 ${defaultPreview}%`;
    this.saveSizes(defaultEditor, defaultPreview);
  }
}

// Initialize panel resizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.panelResizer = new PanelResizer();
});