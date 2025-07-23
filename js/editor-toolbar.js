/**
 * @file editor-toolbar.js
 * @description Enhanced toolbar with formatting buttons and shortcuts
 */

class EditorToolbar {
  constructor(textarea) {
    this.textarea = textarea;
    this.setupKeyboardShortcuts();
  }

  /**
   * Insert text at cursor position
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