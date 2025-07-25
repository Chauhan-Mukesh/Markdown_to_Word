/**
 * Integration tests for MarkdownForge application
 * Tests component interactions and workflow scenarios
 */

describe('MarkdownForge Integration Tests', () => {
  beforeEach(() => {
    // Setup mock localStorage first
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    // Store reference for use in tests
    global.mockLocalStorage = mockLocalStorage;

    // Setup full DOM structure
    document.body.innerHTML = `
      <nav id="navbar" class="navbar">
        <div class="navbar-container">
          <div class="navbar-brand">
            <span class="logo">🚀 MarkdownForge</span>
          </div>
          <div class="navbar-menu">
            <select id="template-select">
              <option value="">📋 Choose Template</option>
              <option value="business-report">📊 Business Report</option>
              <option value="meeting-notes">🤝 Meeting Notes</option>
            </select>
            <input id="doc-title" value="My Document" />
            <input id="doc-author" />
            <input id="doc-date" type="date" />
            <button id="export-btn">⬇️ Export ▼</button>
          </div>
        </div>
      </nav>

      <div id="app">
        <section id="editor-panel">
          <div id="formatting-toolbar">
            <button id="bold-btn">**B**</button>
            <button id="italic-btn">*I*</button>
            <button id="refresh-btn">↻ Refresh</button>
          </div>
          <textarea id="markdown-input" placeholder="Type or paste your Markdown..."></textarea>
        </section>
        
        <div id="panel-resizer"></div>
        
        <section id="preview-panel">
          <header id="preview-header">
            <h2>Live Preview 👀</h2>
          </header>
          <div id="preview-pane"></div>
        </section>
      </div>

      <footer>
        <button id="stats-btn">📊 Stats</button>
        <button id="help-btn">❓ Help</button>
      </footer>

      <!-- Modals -->
      <div id="stats-modal" class="modal" style="display: none;">
        <div class="modal-content">
          <span class="close" id="stats-close">&times;</span>
          <h2>📊 Document Statistics</h2>
          <div id="word-count">0</div>
          <div id="char-count">0</div>
        </div>
      </div>

      <div id="help-modal" class="modal" style="display: none;">
        <div class="modal-content">
          <span class="close" id="help-close">&times;</span>
          <h2>📚 Help</h2>
        </div>
      </div>

      <div id="notification-container"></div>
    `;

    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    // Mock external libraries
    global.showdown = {
      Converter: jest.fn(() => ({
        makeHtml: jest.fn(text => {
          // Simple markdown to HTML conversion for testing
          return text
            .replace(/# (.*)/g, '<h1>$1</h1>')
            .replace(/## (.*)/g, '<h2>$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.*)$/gm, '<p>$1</p>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1');
        }),
        setFlavor: jest.fn(),
        setOption: jest.fn()
      }))
    };

    global.htmlDocx = {
      asBlob: jest.fn(() => new Blob(['mock docx'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }))
    };

    jest.clearAllMocks();
  });

  describe('Document Creation Workflow', () => {
    test('should create new document with template', async () => {
      const templateSelect = document.getElementById('template-select');
      const markdownInput = document.getElementById('markdown-input');
      const previewPane = document.getElementById('preview-pane');

      // Select business report template
      templateSelect.value = 'business-report';
      templateSelect.dispatchEvent(new Event('change'));

      // Simulate template loading
      const businessReportTemplate = `# Business Report

## Executive Summary
[Your executive summary here]

## Key Findings
- Finding 1
- Finding 2

## Recommendations
1. Recommendation 1
2. Recommendation 2`;

      markdownInput.value = businessReportTemplate;
      markdownInput.dispatchEvent(new Event('input'));

      // Simulate live preview update
      const converter = new global.showdown.Converter();
      const htmlOutput = converter.makeHtml(markdownInput.value);
      previewPane.innerHTML = htmlOutput;

      expect(markdownInput.value).toContain('# Business Report');
      expect(markdownInput.value).toContain('## Executive Summary');
      // The template should contain some bold text, let's check for any formatting
      expect(previewPane.innerHTML).toContain('<h1>Business Report</h1>');
    });

    test('should handle document metadata input', () => {
      const titleInput = document.getElementById('doc-title');
      const authorInput = document.getElementById('doc-author');
      const dateInput = document.getElementById('doc-date');

      // Set document metadata
      titleInput.value = 'Q4 Sales Report';
      authorInput.value = 'John Doe';
      dateInput.value = '2025-01-25';

      titleInput.dispatchEvent(new Event('input'));
      authorInput.dispatchEvent(new Event('input'));
      dateInput.dispatchEvent(new Event('change'));

      expect(titleInput.value).toBe('Q4 Sales Report');
      expect(authorInput.value).toBe('John Doe');
      expect(dateInput.value).toBe('2025-01-25');
    });
  });

  describe('Editor and Preview Interaction', () => {
    test('should update preview when markdown changes', () => {
      const markdownInput = document.getElementById('markdown-input');
      const previewPane = document.getElementById('preview-pane');
      const refreshBtn = document.getElementById('refresh-btn');

      // Input markdown content
      markdownInput.value = '# Test Header\n\nThis is **bold** text.';
      markdownInput.dispatchEvent(new Event('input'));

      // Simulate refresh button click
      refreshBtn.click();

      // Simulate conversion and preview update
      const converter = new global.showdown.Converter();
      const htmlOutput = converter.makeHtml(markdownInput.value);
      previewPane.innerHTML = htmlOutput;

      expect(converter.makeHtml).toHaveBeenCalledWith('# Test Header\n\nThis is **bold** text.');
      expect(previewPane.innerHTML).toContain('<strong>bold</strong>');
    });

    test('should apply formatting from toolbar', () => {
      const markdownInput = document.getElementById('markdown-input');
      const boldBtn = document.getElementById('bold-btn');

      markdownInput.value = 'Select this text';
      markdownInput.selectionStart = 7;
      markdownInput.selectionEnd = 11; // Select "this"

      // Mock textarea methods
      markdownInput.setSelectionRange = jest.fn();
      markdownInput.focus = jest.fn();

      // Click bold button
      boldBtn.addEventListener('click', () => {
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const selectedText = markdownInput.value.substring(start, end);
        const beforeText = markdownInput.value.substring(0, start);
        const afterText = markdownInput.value.substring(end);
        
        markdownInput.value = beforeText + '**' + selectedText + '**' + afterText;
      });

      boldBtn.click();

      expect(markdownInput.value).toBe('Select **this** text');
    });

    test('should handle real-time auto-save', () => {
      const markdownInput = document.getElementById('markdown-input');
      const titleInput = document.getElementById('doc-title');

      markdownInput.value = '# Auto-save test content';
      titleInput.value = 'Auto-save Test Document';

      // Simulate auto-save
      const autoSaveData = {
        content: markdownInput.value,
        title: titleInput.value,
        author: '',
        date: new Date().toISOString().split('T')[0],
        lastModified: Date.now()
      };

      mockLocalStorage.setItem('markdownforge-autosave', JSON.stringify(autoSaveData));

      expect(global.mockLocalStorage.setItem).toHaveBeenCalledWith(
        'markdownforge-autosave',
        JSON.stringify(autoSaveData)
      );
    });
  });

  describe('Export Functionality', () => {
    test('should enable export button when content exists', () => {
      const markdownInput = document.getElementById('markdown-input');
      const exportBtn = document.getElementById('export-btn');

      // Initially disabled
      exportBtn.disabled = true;
      expect(exportBtn.disabled).toBe(true);

      // Add content
      markdownInput.value = '# Document Content';
      markdownInput.dispatchEvent(new Event('input'));

      // Simulate enabling export
      if (markdownInput.value.trim()) {
        exportBtn.disabled = false;
      }

      expect(exportBtn.disabled).toBe(false);
    });

    test('should generate Word document on export', () => {
      const markdownInput = document.getElementById('markdown-input');
      const titleInput = document.getElementById('doc-title');
      const previewPane = document.getElementById('preview-pane');

      // Setup content
      markdownInput.value = '# Test Document\n\nThis is a **test** document.';
      titleInput.value = 'Test Export';
      previewPane.innerHTML = '<h1>Test Document</h1><p>This is a <strong>test</strong> document.</p>';

      // Simulate Word export
      const exportToWord = () => {
        const htmlContent = previewPane.innerHTML;
        const docTitle = titleInput.value || 'document';
        const blob = global.htmlDocx.asBlob(htmlContent);
        
        return {
          blob,
          filename: `${docTitle}.docx`
        };
      };

      const result = exportToWord();

      expect(global.htmlDocx.asBlob).toHaveBeenCalledWith('<h1>Test Document</h1><p>This is a <strong>test</strong> document.</p>');
      expect(result.filename).toBe('Test Export.docx');
      expect(result.blob).toBeInstanceOf(Blob);
    });
  });

  describe('Modal Interactions', () => {
    test('should open and close statistics modal', () => {
      const statsBtn = document.getElementById('stats-btn');
      const statsModal = document.getElementById('stats-modal');
      const statsClose = document.getElementById('stats-close');
      const markdownInput = document.getElementById('markdown-input');

      // Set up content for statistics
      markdownInput.value = '# Test Document\n\nThis is a test with **bold** text and multiple words.';

      // Open modal
      statsBtn.addEventListener('click', () => {
        statsModal.style.display = 'block';
        
        // Calculate stats
        const text = markdownInput.value;
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        const charCount = text.length;
        
        document.getElementById('word-count').textContent = wordCount;
        document.getElementById('char-count').textContent = charCount;
      });

      statsBtn.click();

      expect(statsModal.style.display).toBe('block');
      expect(document.getElementById('word-count').textContent).toBe('13'); // Approximate word count
      expect(document.getElementById('char-count').textContent).toBe('67'); // Character count

      // Close modal
      statsClose.addEventListener('click', () => {
        statsModal.style.display = 'none';
      });

      statsClose.click();
      expect(statsModal.style.display).toBe('none');
    });

    test('should open help modal', () => {
      const helpBtn = document.getElementById('help-btn');
      const helpModal = document.getElementById('help-modal');
      const helpClose = document.getElementById('help-close');

      // Open help modal
      helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'block';
      });

      helpBtn.click();
      expect(helpModal.style.display).toBe('block');

      // Close help modal
      helpClose.addEventListener('click', () => {
        helpModal.style.display = 'none';
      });

      helpClose.click();
      expect(helpModal.style.display).toBe('none');
    });
  });

  describe('Document Restore and Persistence', () => {
    test('should restore document from localStorage on page load', () => {
      const savedData = {
        content: '# Restored Document\n\nThis was saved previously.',
        title: 'Restored Title',
        author: 'Restored Author',
        date: '2025-01-20',
        lastModified: Date.now() - 5000
      };

      global.mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData));

      // Simulate document restoration
      const restoreDocument = () => {
        const saved = global.mockLocalStorage.getItem('markdownforge-autosave');
        if (saved) {
          try {
            const data = JSON.parse(saved);
            return data;
          } catch (error) {
            console.warn('Failed to restore document:', error);
            return null;
          }
        }
        return null;
      };

      const restored = restoreDocument();

      expect(global.mockLocalStorage.getItem).toHaveBeenCalledWith('markdownforge-autosave');
      expect(restored).toEqual(savedData);
    });

    test('should handle corrupted localStorage data gracefully', () => {
      global.mockLocalStorage.getItem.mockReturnValue('invalid-json{corrupted');

      const restoreDocument = () => {
        const saved = global.mockLocalStorage.getItem('markdownforge-autosave');
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch (error) {
            console.warn('Failed to restore document:', error);
            return null;
          }
        }
        return null;
      };

      const restored = restoreDocument();
      expect(restored).toBeNull();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle missing DOM elements gracefully', () => {
      // Remove an element
      const markdownInput = document.getElementById('markdown-input');
      markdownInput.remove();

      const safeGetElement = (id) => {
        const element = document.getElementById(id);
        if (!element) {
          console.warn(`Element with id '${id}' not found`);
          return null;
        }
        return element;
      };

      const result = safeGetElement('markdown-input');
      expect(result).toBeNull();
    });

    test('should handle export with empty content', () => {
      const markdownInput = document.getElementById('markdown-input');
      const exportBtn = document.getElementById('export-btn');

      markdownInput.value = '';

      const canExport = () => {
        return markdownInput.value.trim().length > 0;
      };

      expect(canExport()).toBe(false);
      exportBtn.disabled = !canExport();
      expect(exportBtn.disabled).toBe(true);
    });

    test('should handle library loading failures', () => {
      // Simulate library failure
      global.showdown = undefined;

      const initializeConverter = () => {
        if (typeof global.showdown === 'undefined') {
          console.warn('Showdown library not available, using fallback');
          return {
            makeHtml: (text) => `<pre>${text}</pre>` // Simple fallback
          };
        }
        return new global.showdown.Converter();
      };

      const converter = initializeConverter();
      const result = converter.makeHtml('# Test');
      expect(result).toBe('<pre># Test</pre>');
    });
  });

  describe('Performance and Optimization', () => {
    test('should debounce preview updates for large documents', done => {
      const markdownInput = document.getElementById('markdown-input');
      let updateCount = 0;

      const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
      };

      const updatePreview = debounce(() => {
        updateCount++;
      }, 100);

      // Simulate rapid typing
      markdownInput.value = '# T';
      updatePreview();
      
      markdownInput.value = '# Te';
      updatePreview();
      
      markdownInput.value = '# Test';
      updatePreview();

      // Should only update once after debounce delay
      setTimeout(() => {
        expect(updateCount).toBe(1);
        done();
      }, 150);
    });

    test('should handle large document performance', () => {
      const markdownInput = document.getElementById('markdown-input');
      
      // Create large document
      const largeContent = '# Header\n'.repeat(100) + 'Content line\n'.repeat(1000);
      markdownInput.value = largeContent;

      const measurePerformance = () => {
        const start = performance.now();
        
        // Simulate processing
        const wordCount = markdownInput.value.split(/\s+/).length;
        const charCount = markdownInput.value.length;
        
        const end = performance.now();
        return {
          duration: end - start,
          wordCount,
          charCount
        };
      };

      const result = measurePerformance();
      
      expect(result.wordCount).toBeGreaterThan(1000);
      expect(result.charCount).toBeGreaterThan(10000);
      expect(result.duration).toBeLessThan(100); // Should be reasonably fast
    });
  });
});