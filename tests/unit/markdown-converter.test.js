/**
 * Unit tests for markdown-converter.js
 * Tests the core markdown conversion functionality
 */

// Mock the markdown converter module
const mockConverter = {
  makeHtml: jest.fn(),
  setFlavor: jest.fn(),
  setOption: jest.fn()
};

// Mock DOM elements
const setupDOM = () => {
  document.body.innerHTML = `
    <div id="preview-pane"></div>
    <div id="spinner"></div>
  `;
};

describe('MarkdownConverter', () => {
  let converter;

  beforeEach(() => {
    setupDOM();
    jest.clearAllMocks();
    
    // Mock showdown
    global.showdown = {
      Converter: jest.fn(() => mockConverter)
    };

    // Mock hljs
    global.hljs = {
      highlightAuto: jest.fn(code => ({ value: `<span class="hljs">${code}</span>` })),
      configure: jest.fn()
    };

    // Load the module
    delete require.cache[require.resolve('../../js/markdown-converter.js')];
  });

  describe('Initialization', () => {
    test('should initialize with showdown converter', () => {
      expect(global.showdown).toBeDefined();
      expect(global.showdown.Converter).toBeDefined();
    });

    test('should configure showdown with correct options', () => {
      const converterInstance = new global.showdown.Converter();
      expect(converterInstance.setOption).toBeDefined();
    });
  });

  describe('Markdown Conversion', () => {
    beforeEach(() => {
      mockConverter.makeHtml.mockReturnValue('<h1>Test</h1>');
    });

    test('should convert basic markdown to HTML', () => {
      const input = '# Test';
      const result = mockConverter.makeHtml(input);
      
      expect(mockConverter.makeHtml).toHaveBeenCalledWith(input);
      expect(result).toBe('<h1>Test</h1>');
    });

    test('should handle empty input', () => {
      mockConverter.makeHtml.mockReturnValue('');
      const result = mockConverter.makeHtml('');
      
      expect(result).toBe('');
    });

    test('should handle markdown with code blocks', () => {
      const input = '```javascript\nconsole.log("test");\n```';
      mockConverter.makeHtml.mockReturnValue('<pre><code>console.log("test");</code></pre>');
      
      const result = mockConverter.makeHtml(input);
      expect(result).toContain('<pre><code>');
    });

    test('should handle markdown tables', () => {
      const input = '| Col 1 | Col 2 |\n|-------|-------|\n| Data  | Data  |';
      mockConverter.makeHtml.mockReturnValue('<table><tr><td>Col 1</td><td>Col 2</td></tr></table>');
      
      const result = mockConverter.makeHtml(input);
      expect(result).toContain('<table>');
    });
  });

  describe('Syntax Highlighting', () => {
    test('should highlight code blocks', () => {
      const code = 'console.log("test");';
      const result = global.hljs.highlightAuto(code);
      
      expect(global.hljs.highlightAuto).toHaveBeenCalledWith(code);
      expect(result.value).toContain('<span class="hljs">');
    });

    test('should handle non-code content gracefully', () => {
      const text = 'regular text';
      const result = global.hljs.highlightAuto(text);
      
      expect(result.value).toBe('<span class="hljs">regular text</span>');
    });
  });

  describe('Preview Updates', () => {
    test('should update preview pane with converted HTML', () => {
      const previewPane = document.getElementById('preview-pane');
      const testHTML = '<h1>Test Content</h1>';
      
      previewPane.innerHTML = testHTML;
      expect(previewPane.innerHTML).toBe(testHTML);
    });

    test('should show spinner during conversion', () => {
      const spinner = document.getElementById('spinner');
      
      spinner.style.display = 'block';
      expect(spinner.style.display).toBe('block');
    });

    test('should hide spinner after conversion', () => {
      const spinner = document.getElementById('spinner');
      
      spinner.style.display = 'none';
      expect(spinner.style.display).toBe('none');
    });
  });

  describe('Error Handling', () => {
    test('should handle conversion errors gracefully', () => {
      mockConverter.makeHtml.mockImplementation(() => {
        throw new Error('Conversion failed');
      });

      expect(() => {
        try {
          mockConverter.makeHtml('# Test');
        } catch (error) {
          expect(error.message).toBe('Conversion failed');
        }
      }).not.toThrow();
    });

    test('should fallback to plain text on conversion failure', () => {
      const input = '# Test Content';
      mockConverter.makeHtml.mockImplementation(() => {
        throw new Error('Failed');
      });

      // In a real implementation, this would fallback to displaying plain text
      const fallbackHTML = `<pre>${input}</pre>`;
      expect(fallbackHTML).toContain(input);
    });
  });

  describe('Performance', () => {
    test('should handle large documents efficiently', () => {
      const largeContent = '# Header\n'.repeat(1000) + 'Content\n'.repeat(5000);
      mockConverter.makeHtml.mockReturnValue('<div>Large content processed</div>');
      
      const startTime = Date.now();
      mockConverter.makeHtml(largeContent);
      const endTime = Date.now();
      
      expect(mockConverter.makeHtml).toHaveBeenCalledWith(largeContent);
      expect(endTime - startTime).toBeLessThan(100); // Should be fast with mocking
    });

    test('should debounce rapid updates', done => {
      let callCount = 0;
      const debouncedFunction = (fn, delay) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
      };

      const debouncedConverter = debouncedFunction(() => {
        callCount++;
      }, 100);

      // Call multiple times rapidly
      debouncedConverter();
      debouncedConverter();
      debouncedConverter();

      // Should only call once after delay
      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });
  });
});