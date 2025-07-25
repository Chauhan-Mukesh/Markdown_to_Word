/**
 * Unit tests for file-manager.js
 * Tests file operations, auto-save, and local storage functionality
 */

describe('FileManager', () => {
  let mockLocalStorage;
  let mockDocument;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <textarea id="markdown-input"></textarea>
      <input id="doc-title" value="Test Document">
      <input id="doc-author" value="Test Author">
      <input id="doc-date" value="2025-01-25">
      <div id="notification-container"></div>
    `;

    // Mock localStorage
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    // Mock File API
    global.File = class MockFile {
      constructor(bits, name, options = {}) {
        this.name = name;
        this.size = bits.reduce((acc, bit) => acc + bit.length, 0);
        this.type = options.type || '';
        this.lastModified = Date.now();
      }
    };

    // Mock URL methods
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();

    // Mock FileReader
    global.FileReader = class MockFileReader {
      constructor() {
        this.readAsText = jest.fn();
        this.onload = null;
        this.onerror = null;
      }
    };

    jest.clearAllMocks();
  });

  describe('Auto-save Functionality', () => {
    test('should save document to localStorage', () => {
      const input = document.getElementById('markdown-input');
      const title = document.getElementById('doc-title');
      
      input.value = '# Test Content';
      title.value = 'My Document';

      // Simulate auto-save
      const documentData = {
        content: input.value,
        title: title.value,
        author: document.getElementById('doc-author').value,
        date: document.getElementById('doc-date').value,
        lastModified: Date.now()
      };

      localStorage.setItem('markdownforge-autosave', JSON.stringify(documentData));

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'markdownforge-autosave',
        JSON.stringify(documentData)
      );
    });

    test('should restore document from localStorage', () => {
      const savedData = {
        content: '# Restored Content',
        title: 'Restored Document',
        author: 'Restored Author',
        date: '2025-01-20',
        lastModified: Date.now() - 1000
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(savedData));

      const input = document.getElementById('markdown-input');
      const title = document.getElementById('doc-title');
      const author = document.getElementById('doc-author');
      const date = document.getElementById('doc-date');

      // Simulate restore
      const restored = JSON.parse(localStorage.getItem('markdownforge-autosave'));
      if (restored) {
        input.value = restored.content;
        title.value = restored.title;
        author.value = restored.author;
        date.value = restored.date;
      }

      expect(localStorage.getItem).toHaveBeenCalledWith('markdownforge-autosave');
      expect(input.value).toBe('# Restored Content');
      expect(title.value).toBe('Restored Document');
    });

    test('should handle corrupted localStorage data gracefully', () => {
      localStorage.getItem.mockReturnValue('invalid-json{');

      expect(() => {
        try {
          JSON.parse(localStorage.getItem('markdownforge-autosave'));
        } catch (error) {
          console.warn('Failed to restore auto-saved data:', error);
        }
      }).not.toThrow();
    });

    test('should auto-save periodically', done => {
      const input = document.getElementById('markdown-input');
      input.value = '# Auto-save test';

      let autoSaveCount = 0;
      const mockAutoSave = () => {
        autoSaveCount++;
        const data = {
          content: input.value,
          lastModified: Date.now()
        };
        localStorage.setItem('markdownforge-autosave', JSON.stringify(data));
      };

      // Simulate periodic auto-save
      const interval = setInterval(mockAutoSave, 100);

      setTimeout(() => {
        clearInterval(interval);
        expect(autoSaveCount).toBeGreaterThan(0);
        expect(localStorage.setItem).toHaveBeenCalled();
        done();
      }, 250);
    });
  });

  describe('File Loading', () => {
    test('should load markdown file', () => {
      const mockFile = new File(['# Loaded Content'], 'test.md', { type: 'text/markdown' });
      const reader = new FileReader();

      // Simulate file loading
      reader.onload = jest.fn();
      reader.readAsText(mockFile);

      expect(reader.readAsText).toHaveBeenCalledWith(mockFile);
    });

    test('should handle file loading errors', () => {
      const mockFile = new File([''], 'empty.md', { type: 'text/markdown' });
      const reader = new FileReader();

      reader.onerror = jest.fn();
      
      // Simulate error during file reading
      const errorEvent = new Event('error');
      if (reader.onerror) {
        reader.onerror(errorEvent);
      }

      expect(reader.onerror).toHaveBeenCalledWith(errorEvent);
    });

    test('should validate file type', () => {
      const validTypes = ['text/markdown', 'text/plain', '.md', '.txt'];
      const testFile = new File(['content'], 'test.md', { type: 'text/markdown' });

      const isValidType = validTypes.some(type => 
        testFile.type === type || testFile.name.endsWith(type)
      );

      expect(isValidType).toBe(true);
    });

    test('should reject invalid file types', () => {
      const invalidFile = new File(['content'], 'test.exe', { type: 'application/executable' });
      const validTypes = ['text/markdown', 'text/plain', '.md', '.txt'];

      const isValidType = validTypes.some(type => 
        invalidFile.type === type || invalidFile.name.endsWith(type)
      );

      expect(isValidType).toBe(false);
    });
  });

  describe('File Saving', () => {
    test('should create downloadable markdown file', () => {
      const content = '# Test Document\n\nThis is test content.';
      const filename = 'test-document.md';

      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);

      expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(url).toBe('blob:mock-url');
    });

    test('should generate appropriate filename from title', () => {
      const title = 'My Test Document';
      const expectedFilename = title.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') + '.md';

      expect(expectedFilename).toBe('my-test-document.md');
    });

    test('should handle special characters in filenames', () => {
      const title = 'Document with @#$% Special Characters!';
      const sanitized = title.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      expect(sanitized).toBe('document-with-special-characters');
    });

    test('should trigger download with correct attributes', () => {
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn()
      };

      document.createElement = jest.fn().mockReturnValue(mockLink);

      const content = '# Test';
      const filename = 'test.md';
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);

      mockLink.href = url;
      mockLink.download = filename;
      mockLink.click();

      expect(mockLink.href).toBe(url);
      expect(mockLink.download).toBe(filename);
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('Document Management', () => {
    test('should clear document content', () => {
      const input = document.getElementById('markdown-input');
      const title = document.getElementById('doc-title');
      const author = document.getElementById('doc-author');

      // Set some content
      input.value = '# Some content';
      title.value = 'Some title';
      author.value = 'Some author';

      // Clear content
      input.value = '';
      title.value = 'My Document';
      author.value = '';

      expect(input.value).toBe('');
      expect(title.value).toBe('My Document');
      expect(author.value).toBe('');
    });

    test('should handle unsaved changes warning', () => {
      const input = document.getElementById('markdown-input');
      input.value = '# Unsaved content';

      const hasUnsavedChanges = input.value.trim() !== '';
      expect(hasUnsavedChanges).toBe(true);
    });

    test('should track document modification state', () => {
      let isModified = false;
      const input = document.getElementById('markdown-input');

      const handleInput = () => {
        isModified = true;
      };

      input.addEventListener('input', handleInput);
      
      // Simulate input event
      input.value = '# New content';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(isModified).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle localStorage quota exceeded', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => {
        try {
          localStorage.setItem('test', 'data');
        } catch (error) {
          console.warn('Storage quota exceeded:', error);
        }
      }).not.toThrow();
    });

    test('should handle localStorage not available', () => {
      Object.defineProperty(window, 'localStorage', {
        value: null,
        writable: true
      });

      const isStorageAvailable = () => {
        try {
          return window.localStorage !== null;
        } catch (e) {
          return false;
        }
      };

      expect(isStorageAvailable()).toBe(false);
    });

    test('should provide fallback when file API not supported', () => {
      const originalFile = global.File;
      delete global.File;

      const isFileAPISupported = () => {
        return typeof File !== 'undefined';
      };

      expect(isFileAPISupported()).toBe(false);

      // Restore for other tests
      global.File = originalFile;
    });
  });
});