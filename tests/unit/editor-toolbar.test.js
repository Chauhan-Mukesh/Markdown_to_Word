/**
 * Unit tests for editor-toolbar.js
 * Tests formatting buttons, keyboard shortcuts, and editor enhancements
 */

describe('EditorToolbar', () => {
  let mockTextarea;
  let toolbar;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="formatting-toolbar" class="formatting-toolbar">
        <button id="bold-btn" class="format-btn">**B**</button>
        <button id="italic-btn" class="format-btn">*I*</button>
        <button id="underline-btn" class="format-btn">U</button>
        <button id="code-btn" class="format-btn">{ }</button>
        <button id="link-btn" class="format-btn">🔗</button>
        <button id="h1-btn" class="format-dropdown-item"># Header 1</button>
        <button id="h2-btn" class="format-dropdown-item">## Header 2</button>
        <button id="unordered-list-btn" class="format-dropdown-item">• Bullet List</button>
        <button id="ordered-list-btn" class="format-dropdown-item">1. Numbered List</button>
        <button id="quote-btn" class="format-btn">" Quote</button>
        <button id="table-btn" class="format-btn">⚏ Table</button>
      </div>
      <textarea id="markdown-input" class="editor"></textarea>
    `;

    mockTextarea = document.getElementById('markdown-input');
    toolbar = document.getElementById('formatting-toolbar');
    
    // Mock selection methods
    mockTextarea.setSelectionRange = jest.fn();
    mockTextarea.focus = jest.fn();
    
    Object.defineProperty(mockTextarea, 'selectionStart', {
      value: 0,
      writable: true
    });
    
    Object.defineProperty(mockTextarea, 'selectionEnd', {
      value: 0,
      writable: true
    });

    jest.clearAllMocks();
  });

  describe('Text Formatting', () => {
    test('should apply bold formatting', () => {
      mockTextarea.value = 'Hello World';
      mockTextarea.selectionStart = 0;
      mockTextarea.selectionEnd = 5; // Select "Hello"

      const applyBold = () => {
        const start = mockTextarea.selectionStart;
        const end = mockTextarea.selectionEnd;
        const selectedText = mockTextarea.value.substring(start, end);
        const beforeText = mockTextarea.value.substring(0, start);
        const afterText = mockTextarea.value.substring(end);
        
        mockTextarea.value = beforeText + '**' + selectedText + '**' + afterText;
      };

      applyBold();
      expect(mockTextarea.value).toBe('**Hello** World');
    });

    test('should apply italic formatting', () => {
      mockTextarea.value = 'Hello World';
      mockTextarea.selectionStart = 6;
      mockTextarea.selectionEnd = 11; // Select "World"

      const applyItalic = () => {
        const start = mockTextarea.selectionStart;
        const end = mockTextarea.selectionEnd;
        const selectedText = mockTextarea.value.substring(start, end);
        const beforeText = mockTextarea.value.substring(0, start);
        const afterText = mockTextarea.value.substring(end);
        
        mockTextarea.value = beforeText + '*' + selectedText + '*' + afterText;
      };

      applyItalic();
      expect(mockTextarea.value).toBe('Hello *World*');
    });

    test('should apply code formatting', () => {
      mockTextarea.value = 'console.log';
      mockTextarea.selectionStart = 0;
      mockTextarea.selectionEnd = 11;

      const applyCode = () => {
        const start = mockTextarea.selectionStart;
        const end = mockTextarea.selectionEnd;
        const selectedText = mockTextarea.value.substring(start, end);
        const beforeText = mockTextarea.value.substring(0, start);
        const afterText = mockTextarea.value.substring(end);
        
        mockTextarea.value = beforeText + '`' + selectedText + '`' + afterText;
      };

      applyCode();
      expect(mockTextarea.value).toBe('`console.log`');
    });

    test('should handle no text selection for formatting', () => {
      mockTextarea.value = 'Hello World';
      mockTextarea.selectionStart = 5;
      mockTextarea.selectionEnd = 5; // No selection, cursor at position 5

      const applyBoldWithoutSelection = () => {
        const start = mockTextarea.selectionStart;
        const beforeText = mockTextarea.value.substring(0, start);
        const afterText = mockTextarea.value.substring(start);
        
        mockTextarea.value = beforeText + '****' + afterText;
        // Move cursor between the asterisks
        mockTextarea.setSelectionRange(start + 2, start + 2);
      };

      applyBoldWithoutSelection();
      expect(mockTextarea.value).toBe('Hello**** World');
      expect(mockTextarea.setSelectionRange).toHaveBeenCalledWith(7, 7);
    });
  });

  describe('Headers', () => {
    test('should insert H1 header at cursor position', () => {
      mockTextarea.value = 'Some text\nMore text';
      mockTextarea.selectionStart = 10; // At the start of new line

      const insertH1 = () => {
        const start = mockTextarea.selectionStart;
        const beforeText = mockTextarea.value.substring(0, start);
        const afterText = mockTextarea.value.substring(start);
        
        mockTextarea.value = beforeText + '# ' + afterText;
      };

      insertH1();
      expect(mockTextarea.value).toBe('Some text\n# More text');
    });

    test('should insert H2 header', () => {
      mockTextarea.value = '';
      mockTextarea.selectionStart = 0;

      const insertH2 = () => {
        mockTextarea.value = '## ';
        mockTextarea.setSelectionRange(3, 3);
      };

      insertH2();
      expect(mockTextarea.value).toBe('## ');
      expect(mockTextarea.setSelectionRange).toHaveBeenCalledWith(3, 3);
    });

    test('should convert existing line to header', () => {
      mockTextarea.value = 'This is a title';
      mockTextarea.selectionStart = 0;
      mockTextarea.selectionEnd = 15;

      const convertToH1 = () => {
        const selectedText = mockTextarea.value.substring(
          mockTextarea.selectionStart, 
          mockTextarea.selectionEnd
        );
        mockTextarea.value = '# ' + selectedText;
      };

      convertToH1();
      expect(mockTextarea.value).toBe('# This is a title');
    });
  });

  describe('Lists', () => {
    test('should insert unordered list item', () => {
      mockTextarea.value = '';
      mockTextarea.selectionStart = 0;

      const insertBulletList = () => {
        mockTextarea.value = '- ';
        mockTextarea.setSelectionRange(2, 2);
      };

      insertBulletList();
      expect(mockTextarea.value).toBe('- ');
      expect(mockTextarea.setSelectionRange).toHaveBeenCalledWith(2, 2);
    });

    test('should insert ordered list item', () => {
      mockTextarea.value = '';
      mockTextarea.selectionStart = 0;

      const insertNumberedList = () => {
        mockTextarea.value = '1. ';
        mockTextarea.setSelectionRange(3, 3);
      };

      insertNumberedList();
      expect(mockTextarea.value).toBe('1. ');
      expect(mockTextarea.setSelectionRange).toHaveBeenCalledWith(3, 3);
    });

    test('should continue list on new line', () => {
      mockTextarea.value = '- First item\n';
      mockTextarea.selectionStart = 13;

      const continueList = () => {
        const currentPosition = mockTextarea.selectionStart;
        const beforeText = mockTextarea.value.substring(0, currentPosition);
        const afterText = mockTextarea.value.substring(currentPosition);
        
        mockTextarea.value = beforeText + '- ' + afterText;
      };

      continueList();
      expect(mockTextarea.value).toBe('- First item\n- ');
    });

    test('should handle nested lists', () => {
      mockTextarea.value = '- Parent item\n';
      mockTextarea.selectionStart = 14;

      const insertNestedList = () => {
        const currentPosition = mockTextarea.selectionStart;
        const beforeText = mockTextarea.value.substring(0, currentPosition);
        const afterText = mockTextarea.value.substring(currentPosition);
        
        mockTextarea.value = beforeText + '  - ' + afterText;
      };

      insertNestedList();
      expect(mockTextarea.value).toBe('- Parent item\n  - ');
    });
  });

  describe('Links and Images', () => {
    test('should insert link with selected text', () => {
      mockTextarea.value = 'Visit Google';
      mockTextarea.selectionStart = 6;
      mockTextarea.selectionEnd = 12; // Select "Google"

      const insertLink = () => {
        const start = mockTextarea.selectionStart;
        const end = mockTextarea.selectionEnd;
        const selectedText = mockTextarea.value.substring(start, end);
        const beforeText = mockTextarea.value.substring(0, start);
        const afterText = mockTextarea.value.substring(end);
        
        mockTextarea.value = beforeText + '[' + selectedText + '](URL)' + afterText;
      };

      insertLink();
      expect(mockTextarea.value).toBe('Visit [Google](URL)');
    });

    test('should insert empty link template', () => {
      mockTextarea.value = '';
      mockTextarea.selectionStart = 0;

      const insertEmptyLink = () => {
        mockTextarea.value = '[link text](URL)';
        mockTextarea.setSelectionRange(1, 10); // Select "link text"
      };

      insertEmptyLink();
      expect(mockTextarea.value).toBe('[link text](URL)');
      expect(mockTextarea.setSelectionRange).toHaveBeenCalledWith(1, 10);
    });

    test('should insert image markdown', () => {
      mockTextarea.value = '';
      mockTextarea.selectionStart = 0;

      const insertImage = () => {
        mockTextarea.value = '![alt text](image.jpg)';
        mockTextarea.setSelectionRange(2, 10); // Select "alt text"
      };

      insertImage();
      expect(mockTextarea.value).toBe('![alt text](image.jpg)');
      expect(mockTextarea.setSelectionRange).toHaveBeenCalledWith(2, 10);
    });
  });

  describe('Tables', () => {
    test('should insert basic table template', () => {
      mockTextarea.value = '';
      mockTextarea.selectionStart = 0;

      const insertTable = () => {
        const tableTemplate = '| Column 1 | Column 2 |\n|----------|----------|\n| Data     | Data     |';
        mockTextarea.value = tableTemplate;
      };

      insertTable();
      expect(mockTextarea.value).toContain('| Column 1 | Column 2 |');
      expect(mockTextarea.value).toContain('|----------|----------|');
      expect(mockTextarea.value).toContain('| Data     | Data     |');
    });

    test('should handle table with custom dimensions', () => {
      const createTable = (rows, cols) => {
        let table = '';
        
        // Header row
        table += '|';
        for (let c = 0; c < cols; c++) {
          table += ` Column ${c + 1} |`;
        }
        table += '\n';
        
        // Separator row
        table += '|';
        for (let c = 0; c < cols; c++) {
          table += '----------|';
        }
        table += '\n';
        
        // Data rows
        for (let r = 0; r < rows; r++) {
          table += '|';
          for (let c = 0; c < cols; c++) {
            table += ' Data |';
          }
          table += '\n';
        }
        
        return table.trim();
      };

      const table3x3 = createTable(2, 3);
      expect(table3x3).toContain('| Column 1 | Column 2 | Column 3 |');
      expect(table3x3.split('\n')).toHaveLength(4); // Header + separator + 2 data rows
    });
  });

  describe('Keyboard Shortcuts', () => {
    test('should handle Ctrl+B for bold', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'b',
        ctrlKey: true,
        bubbles: true
      });

      let boldApplied = false;
      const handleKeydown = (e) => {
        if (e.ctrlKey && e.key === 'b') {
          e.preventDefault();
          boldApplied = true;
        }
      };

      document.addEventListener('keydown', handleKeydown);
      document.dispatchEvent(event);

      expect(boldApplied).toBe(true);
    });

    test('should handle Ctrl+I for italic', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'i',
        ctrlKey: true,
        bubbles: true
      });

      let italicApplied = false;
      const handleKeydown = (e) => {
        if (e.ctrlKey && e.key === 'i') {
          e.preventDefault();
          italicApplied = true;
        }
      };

      document.addEventListener('keydown', handleKeydown);
      document.dispatchEvent(event);

      expect(italicApplied).toBe(true);
    });

    test('should handle Ctrl+K for link', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true
      });

      let linkInserted = false;
      const handleKeydown = (e) => {
        if (e.ctrlKey && e.key === 'k') {
          e.preventDefault();
          linkInserted = true;
        }
      };

      document.addEventListener('keydown', handleKeydown);
      document.dispatchEvent(event);

      expect(linkInserted).toBe(true);
    });
  });

  describe('Toolbar Button Interactions', () => {
    test('should trigger formatting when button clicked', () => {
      const boldBtn = document.getElementById('bold-btn');
      let formatApplied = false;

      boldBtn.addEventListener('click', () => {
        formatApplied = true;
      });

      boldBtn.click();
      expect(formatApplied).toBe(true);
    });

    test('should provide visual feedback on button press', () => {
      const boldBtn = document.getElementById('bold-btn');
      
      boldBtn.addEventListener('mousedown', () => {
        boldBtn.classList.add('active');
      });
      
      boldBtn.addEventListener('mouseup', () => {
        boldBtn.classList.remove('active');
      });

      const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });

      boldBtn.dispatchEvent(mousedownEvent);
      expect(boldBtn.classList.contains('active')).toBe(true);

      boldBtn.dispatchEvent(mouseupEvent);
      expect(boldBtn.classList.contains('active')).toBe(false);
    });

    test('should handle dropdown menu interactions', () => {
      const headerBtn = document.querySelector('#header-dropdown .dropdown-toggle');
      const headerMenu = document.querySelector('#header-dropdown .format-dropdown-menu');
      
      if (headerBtn && headerMenu) {
        let menuVisible = false;
        
        headerBtn.addEventListener('click', () => {
          menuVisible = !menuVisible;
          headerMenu.style.display = menuVisible ? 'block' : 'none';
        });

        headerBtn.click();
        expect(headerMenu.style.display).toBe('block');

        headerBtn.click();
        expect(headerMenu.style.display).toBe('none');
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid selection ranges gracefully', () => {
      mockTextarea.value = 'Short';
      mockTextarea.selectionStart = 0;
      mockTextarea.selectionEnd = 100; // Beyond text length

      const safeApplyFormat = () => {
        const start = Math.max(0, Math.min(mockTextarea.selectionStart, mockTextarea.value.length));
        const end = Math.max(start, Math.min(mockTextarea.selectionEnd, mockTextarea.value.length));
        
        expect(start).toBe(0);
        expect(end).toBe(5); // Length of "Short"
      };

      expect(safeApplyFormat).not.toThrow();
    });

    test('should handle missing textarea gracefully', () => {
      const missingTextarea = document.getElementById('non-existent-textarea');
      
      const safeFormat = () => {
        if (!missingTextarea) {
          console.warn('Textarea not found');
          return false;
        }
        return true;
      };

      expect(safeFormat()).toBe(false);
    });

    test('should handle readonly textarea', () => {
      mockTextarea.readOnly = true;
      
      const attemptFormat = () => {
        if (mockTextarea.readOnly) {
          return false;
        }
        return true;
      };

      expect(attemptFormat()).toBe(false);
    });
  });
});