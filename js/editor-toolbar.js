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
   * Insert a table
   */
  insertTable() {
    const table = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    this.insertText(table, '', '');
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    this.textarea.addEventListener('keydown', (e) => {
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
  }
}

window.EditorToolbar = EditorToolbar;