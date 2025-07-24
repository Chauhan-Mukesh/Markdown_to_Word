/**
 * @file editor-toolbar.js
 * @description Advanced editor toolbar with formatting capabilities and keyboard shortcuts
 * @version 2.1.0
 * @author Markdown to Word Exporter Team
 * @license MIT
 * 
 * @overview
 * Provides a comprehensive editor toolbar system with:
 * - Rich text formatting for markdown syntax
 * - Keyboard shortcut integration
 * - Text insertion and cursor management
 * - Template and snippet support
 * - Undo/redo functionality
 * - Selection-aware formatting operations
 */

/**
 * Enhanced editor toolbar class for markdown formatting
 * @class
 * @description Manages toolbar functionality including text formatting, shortcuts, and cursor operations
 * @since 2.1.0
 */
class EditorToolbar {
  /**
   * Constructor for EditorToolbar
   * @description Initializes the toolbar with textarea reference and keyboard shortcuts
   * @param {HTMLTextAreaElement} textarea - The textarea element to operate on
   * @since 2.1.0
   */
  constructor(textarea) {
    /** @type {HTMLTextAreaElement} Reference to the textarea element */
    this.textarea = textarea;
    
    /** @type {Array} History of text changes for undo/redo */
    this.history = [];
    
    /** @type {number} Current position in history */
    this.historyIndex = -1;
    
    /** @type {number} Maximum history entries */
    this.maxHistory = 50;
    
    this.setupKeyboardShortcuts();
    this.initializeHistory();
  }

  /**
   * Initialize history tracking for undo/redo functionality
   * @description Sets up the history system to track text changes
   * @since 2.1.0
   */
  initializeHistory() {
    // Add initial state to history
    this.addToHistory(this.textarea.value);
    
    // Track changes for history
    this.textarea.addEventListener('input', () => {
      this.debounceAddToHistory();
    });
  }

  /**
   * Add current state to history
   * @param {string} content - The content to add to history
   */
  addToHistory(content) {
    // Remove any future history if we're not at the end
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    // Add new state
    this.history.push(content);
    this.historyIndex = this.history.length - 1;
    
    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  /**
   * Debounced version of addToHistory to avoid too many history entries
   */
  debounceAddToHistory() {
    clearTimeout(this.historyTimeout);
    this.historyTimeout = setTimeout(() => {
      this.addToHistory(this.textarea.value);
    }, 1000); // Add to history after 1 second of inactivity
  }

  /**
   * Insert text at cursor position with intelligent formatting
   * @description Inserts formatted text at the current cursor position or around selected text
   * @param {string} before - Text to insert before the selection/cursor
   * @param {string} [after=''] - Text to insert after the selection/cursor
   * @param {string} [placeholder=''] - Placeholder text when no selection exists
   * @since 2.1.0
   * @example
   * toolbar.insertText('**', '**', 'bold text'); // Creates **bold text**
   */
  insertText(before, after = '', placeholder = '') {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const selectedText = this.textarea.value.substring(start, end);
    const replacement = before + (selectedText || placeholder) + after;
    
    this.textarea.value = this.textarea.value.substring(0, start) + replacement + this.textarea.value.substring(end);
    
    // Set cursor position
    const newPos = start + before.length + (selectedText || placeholder).length;
    this.textarea.setSelectionRange(newPos, newPos);
    this.textarea.focus();
    
    // Trigger input event
    this.textarea.dispatchEvent(new Event('input'));
  }

  /**
   * Insert text at the beginning of selected lines
   */
  insertAtLineStart(prefix) {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const text = this.textarea.value;
    
    // Find line boundaries
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = text.indexOf('\n', end);
    const selectedLines = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
    
    // Add prefix to each line
    const modifiedLines = selectedLines.split('\n').map(line => prefix + line).join('\n');
    
    this.textarea.value = text.substring(0, lineStart) + modifiedLines + text.substring(lineEnd === -1 ? text.length : lineEnd);
    this.textarea.focus();
    this.textarea.dispatchEvent(new Event('input'));
  }

  /**
   * Format selected text as bold
   */
  makeBold() {
    this.insertText('**', '**', 'bold text');
  }

  /**
   * Format selected text as italic
   */
  makeItalic() {
    this.insertText('*', '*', 'italic text');
  }

  /**
   * Format selected text as underline (using HTML)
   */
  makeUnderline() {
    this.insertText('<u>', '</u>', 'underlined text');
  }

  /**
   * Format selected text as strikethrough
   */
  makeStrikethrough() {
    this.insertText('~~', '~~', 'strikethrough text');
  }

  /**
   * Format selected text as inline code
   */
  makeCode() {
    this.insertText('`', '`', 'code');
  }

  /**
   * Insert a link
   */
  insertLink() {
    this.insertText('[', '](https://example.com)', 'link text');
  }

  /**
   * Insert an image
   */
  insertImage() {
    this.insertText('![', '](https://example.com/image.jpg)', 'alt text');
  }

  /**
   * Insert a code block
   */
  insertCodeBlock() {
    this.insertText('\n```\n', '\n```\n', 'code here');
  }

  /**
   * Insert a header
   */
  insertHeader(level = 1) {
    const prefix = '#'.repeat(level) + ' ';
    this.insertAtLineStart(prefix);
  }

  /**
   * Insert Header 1
   */
  insertH1() {
    this.insertHeader(1);
  }

  /**
   * Insert Header 2
   */
  insertH2() {
    this.insertHeader(2);
  }

  /**
   * Insert Header 3
   */
  insertH3() {
    this.insertHeader(3);
  }

  /**
   * Insert Header 4
   */
  insertH4() {
    this.insertHeader(4);
  }

  /**
   * Insert Header 5
   */
  insertH5() {
    this.insertHeader(5);
  }

  /**
   * Insert Header 6
   */
  insertH6() {
    this.insertHeader(6);
  }

  /**
   * Insert a bulleted list
   */
  insertList() {
    this.insertAtLineStart('- ');
  }

  /**
   * Insert a numbered list
   */
  insertNumberedList() {
    this.insertAtLineStart('1. ');
  }

  /**
   * Insert a sub bulleted list (indented)
   */
  insertSubList() {
    this.insertAtLineStart('  - ');
  }

  /**
   * Insert a sub numbered list (indented)
   */
  insertSubNumberedList() {
    this.insertAtLineStart('  1. ');
  }

  /**
   * Insert a blockquote
   */
  insertBlockquote() {
    this.insertAtLineStart('> ');
  }

  /**
   * Insert a horizontal rule
   */
  insertHorizontalRule() {
    this.insertText('\n---\n', '', '');
  }

  /**
   * Insert a table with auto-preview
   */
  insertTable() {
    const table = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    this.insertText(table, '', '');
    
    // Auto-trigger preview if available
    setTimeout(() => {
      if (window.renderPreview && typeof window.renderPreview === 'function') {
        window.renderPreview();
      }
    }, 100);
  }

  /**
   * Setup keyboard shortcuts and auto-complete
   */
  setupKeyboardShortcuts() {
    this.textarea.addEventListener('keydown', (e) => {
      // Handle auto-complete features
      if (this.handleAutoComplete(e)) {
        return;
      }
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            this.makeBold();
            break;
          case 'i':
            e.preventDefault();
            this.makeItalic();
            break;
          case 'k':
            e.preventDefault();
            this.insertLink();
            break;
          case '`':
            e.preventDefault();
            this.makeCode();
            break;
        }
      }
    });

    // Auto-format on input
    this.textarea.addEventListener('input', (e) => {
      this.handleAutoFormatting(e);
    });
  }

  /**
   * Handle auto-complete features
   */
  handleAutoComplete(e) {
    const cursor = this.textarea.selectionStart;
    const text = this.textarea.value;
    const currentLine = this.getCurrentLine(cursor);
    
    if (e.key === 'Tab') {
      e.preventDefault();
      
      // Auto-complete list items
      if (currentLine.match(/^(\s*)-\s/)) {
        this.insertText('- ', '', '');
        return true;
      }
      
      // Auto-complete numbered lists
      if (currentLine.match(/^(\s*)\d+\.\s/)) {
        const indent = currentLine.match(/^(\s*)/)[1];
        const nextNum = parseInt(currentLine.match(/\d+/)[0]) + 1;
        this.insertText(`${indent}${nextNum}. `, '', '');
        return true;
      }
      
      return true;
    }
    
    if (e.key === 'Enter') {
      // Auto-continue lists
      if (currentLine.match(/^(\s*)-\s(.*)$/)) {
        e.preventDefault();
        const indent = currentLine.match(/^(\s*)/)[1];
        this.insertText(`\n${indent}- `, '', '');
        return true;
      }
      
      if (currentLine.match(/^(\s*)\d+\.\s(.*)$/)) {
        e.preventDefault();
        const indent = currentLine.match(/^(\s*)/)[1];
        const nextNum = parseInt(currentLine.match(/\d+/)[0]) + 1;
        this.insertText(`\n${indent}${nextNum}. `, '', '');
        return true;
      }
    }
    
    return false;
  }

  /**
   * Handle auto-formatting
   */
  handleAutoFormatting(e) {
    const cursor = this.textarea.selectionStart;
    const text = this.textarea.value;
    
    // Auto-close parentheses, brackets, etc.
    if (e.inputType === 'insertText') {
      const char = e.data;
      const pairs = {
        '(': ')',
        '[': ']',
        '{': '}',
        '"': '"',
        "'": "'",
        '`': '`'
      };
      
      if (pairs[char]) {
        const before = text.substring(0, cursor);
        const after = text.substring(cursor);
        
        // Don't auto-close if next character is the same
        if (after[0] !== pairs[char]) {
          this.textarea.value = before + pairs[char] + after;
          this.textarea.setSelectionRange(cursor, cursor);
        }
      }
    }
  }

  /**
   * Get current line at cursor position
   */
  getCurrentLine(cursor) {
    const text = this.textarea.value;
    const lineStart = text.lastIndexOf('\n', cursor - 1) + 1;
    const lineEnd = text.indexOf('\n', cursor);
    return text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
  }
}

window.EditorToolbar = EditorToolbar;