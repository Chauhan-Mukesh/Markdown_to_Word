/**
 * @file image-manager.js
 * @description Enhanced image management system for better editor experience
 */

class ImageManager {
  constructor() {
    this.images = new Map(); // Store image data separately
    this.imageCounter = 0;
    this.initializeImagePlaceholders();
  }

  /**
   * Generate unique image ID
   */
  generateImageId() {
    return `img_${Date.now()}_${++this.imageCounter}`;
  }

  /**
   * Process uploaded image file
   */
  async processImageFile(file) {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error(`${file.name} is not an image file`));
        return;
      }
      
      // Validate file size (max 10MB per image)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        reject(new Error(`${file.name} is too large (max 10MB)`));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const base64Data = e.target.result;
          const imageId = this.generateImageId();
          const fileName = this.sanitizeFilename(file.name.replace(/\.[^/.]+$/, ""));
          
          // Store image data separately
          this.images.set(imageId, {
            id: imageId,
            name: fileName,
            originalName: file.name,
            base64: base64Data,
            size: file.size,
            type: file.type,
            width: null,
            height: null
          });
          
          // Create compact markdown placeholder
          const imageMarkdown = `![${fileName}](#${imageId}){.center width=80%}`;
          
          // Get image dimensions for better preview
          this.getImageDimensions(base64Data).then(dimensions => {
            const imageData = this.images.get(imageId);
            if (imageData) {
              imageData.width = dimensions.width;
              imageData.height = dimensions.height;
              this.images.set(imageId, imageData);
            }
          });
          
          resolve(imageMarkdown);
        } catch (error) {
          reject(new Error(`Failed to process ${file.name}: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error(`Failed to read ${file.name}`));
      };
      
      // Read as data URL (base64)
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get image dimensions from base64 data
   */
  async getImageDimensions(base64Data) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = base64Data;
    });
  }

  /**
   * Sanitize filename for markdown
   */
  sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 50);
  }

  /**
   * Convert image placeholders to actual base64 for export
   */
  expandImagesForExport(markdownContent) {
    let expandedContent = markdownContent;
    
    // Find all image placeholders in the format ![alt](#imageId)
    const imageRegex = /!\[([^\]]*)\]\(#([^)]+)\)(\{[^}]*\})?/g;
    let match;
    
    while ((match = imageRegex.exec(markdownContent)) !== null) {
      const [fullMatch, altText, imageId, attributes] = match;
      const imageData = this.images.get(imageId);
      
      if (imageData) {
        const expandedImage = `![${altText}](${imageData.base64})${attributes || ''}`;
        expandedContent = expandedContent.replace(fullMatch, expandedImage);
      }
    }
    
    return expandedContent;
  }

  /**
   * Initialize image placeholder styling and functionality
   */
  initializeImagePlaceholders() {
    // Add CSS for image placeholders
    const imageCSS = `
      .image-placeholder {
        display: inline-block;
        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
        border: 2px dashed #2196f3;
        border-radius: 8px;
        padding: 8px 12px;
        margin: 4px;
        font-size: 0.9rem;
        color: #1976d2;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        max-width: 300px;
      }
      
      .image-placeholder:hover {
        background: linear-gradient(135deg, #bbdefb, #90caf9);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
      }
      
      .image-placeholder::before {
        content: '🖼️';
        margin-right: 6px;
        font-size: 1.1em;
      }
      
      .image-placeholder .image-info {
        display: block;
        font-size: 0.75rem;
        color: #666;
        margin-top: 2px;
      }
      
      .image-placeholder .image-actions {
        display: none;
        position: absolute;
        top: -8px;
        right: -8px;
        background: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        border: 1px solid #ddd;
        font-size: 0.8rem;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .image-placeholder:hover .image-actions {
        display: flex;
      }
      
      .image-placeholder.image-error {
        background: linear-gradient(135deg, #ffebee, #ffcdd2);
        border-color: #f44336;
        color: #d32f2f;
      }
      
      /* Dark mode support */
      body.dark-mode .image-placeholder {
        background: linear-gradient(135deg, #1a237e, #303f9f);
        border-color: #3f51b5;
        color: #e8eaf6;
      }
      
      body.dark-mode .image-placeholder:hover {
        background: linear-gradient(135deg, #303f9f, #3f51b5);
      }
      
      body.dark-mode .image-placeholder .image-info {
        color: #ccc;
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = imageCSS;
    document.head.appendChild(styleSheet);
  }

  /**
   * Create image preview modal
   */
  createImagePreview(imageId) {
    const imageData = this.images.get(imageId);
    if (!imageData) return;
    
    // Create or update image preview modal
    let modal = document.getElementById('image-preview-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'image-preview-modal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content" style="max-width: 90vw; max-height: 90vh; text-align: center;">
          <span class="close" onclick="this.parentElement.parentElement.style.display='none'">&times;</span>
          <div id="image-preview-content"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    
    const content = modal.querySelector('#image-preview-content');
    content.innerHTML = `
      <h3>📸 ${imageData.name}</h3>
      <img src="${imageData.base64}" style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);" />
      <div style="margin-top: 16px; color: #666; font-size: 0.9rem;">
        <p><strong>Original:</strong> ${imageData.originalName}</p>
        <p><strong>Size:</strong> ${this.formatFileSize(imageData.size)}</p>
        ${imageData.width ? `<p><strong>Dimensions:</strong> ${imageData.width} × ${imageData.height}px</p>` : ''}
        <p><strong>Type:</strong> ${imageData.type}</p>
      </div>
      <div style="margin-top: 16px;">
        <button onclick="imageManager.removeImage('${imageId}')" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">🗑️ Remove Image</button>
      </div>
    `;
    
    modal.style.display = 'block';
  }

  /**
   * Remove image from manager
   */
  removeImage(imageId) {
    if (this.images.has(imageId)) {
      this.images.delete(imageId);
      
      // Remove from editor
      const editor = document.getElementById('markdown-input');
      if (editor) {
        const regex = new RegExp(`!\\[[^\\]]*\\]\\(#${imageId}\\)(\\{[^}]*\\})?`, 'g');
        editor.value = editor.value.replace(regex, '');
        editor.dispatchEvent(new Event('input'));
      }
      
      // Close modal
      const modal = document.getElementById('image-preview-modal');
      if (modal) {
        modal.style.display = 'none';
      }
      
      // Show notification
      if (window.notificationSystem) {
        window.notificationSystem.success('Image removed successfully');
      }
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get all stored images
   */
  getAllImages() {
    return Array.from(this.images.values());
  }

  /**
   * Clear all images
   */
  clearAllImages() {
    this.images.clear();
  }
}

// Create global image manager instance
window.imageManager = new ImageManager();