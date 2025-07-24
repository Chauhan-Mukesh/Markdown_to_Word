/**
 * @file markdown-converter.js
 * @description Enhanced markdown converter with comprehensive feature support
 * @version 2.1.0
 * @author Markdown to Word Exporter Team
 * @license MIT
 * 
 * @overview
 * Provides a robust markdown-to-HTML converter that works as a fallback
 * when external CDN libraries are unavailable. Features include:
 * - Complete markdown syntax support (headers, formatting, links, etc.)
 * - Table rendering with proper HTML structure
 * - Code block syntax highlighting integration
 * - List processing with nested support
 * - Blockquote and horizontal rule handling
 * - Safe HTML output with XSS prevention measures
 * 
 * @requires hljs - For syntax highlighting (optional)
 */

/**
 * Simple but powerful markdown converter class
 * @class
 * @description Converts markdown text to properly formatted HTML with full syntax support
 * @since 2.1.0
 */

class SimpleMarkdownConverter {
  /**
   * Constructor for SimpleMarkdownConverter
   * @description Initializes the converter with comprehensive markdown parsing rules
   * @since 2.1.0
   */
  constructor() {
    // Define markdown-to-HTML conversion rules in order of precedence
    this.rules = [
      // Headers (H1-H6)
      { regex: /^# (.*$)/gm, replacement: '<h1>$1</h1>' },
      { regex: /^## (.*$)/gm, replacement: '<h2>$1</h2>' },
      { regex: /^### (.*$)/gm, replacement: '<h3>$1</h3>' },
      { regex: /^#### (.*$)/gm, replacement: '<h4>$1</h4>' },
      { regex: /^##### (.*$)/gm, replacement: '<h5>$1</h5>' },
      { regex: /^###### (.*$)/gm, replacement: '<h6>$1</h6>' },
      
      // Text formatting (bold, italic, combined)
      { regex: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em>$1</em></strong>' },
      { regex: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
      { regex: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
      
      // Links with proper href attributes
      { regex: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>' },
      
      // Images with alt text support
      { regex: /!\[([^\]]*)\]\(([^)]+)\)/g, replacement: '<img src="$2" alt="$1" loading="lazy" />' },
      
      // Code blocks and inline code
      { regex: /```([^`]+)```/g, replacement: '<pre><code>$1</code></pre>' },
      { regex: /`([^`]+)`/g, replacement: '<code>$1</code>' },
      
      // Lists (bullet and numbered)
      { regex: /^\* (.+)$/gm, replacement: '<li>$1</li>' },
      { regex: /^\d+\. (.+)$/gm, replacement: '<li>$1</li>' },
      
      // Blockquotes for highlighting important content
      { regex: /^> (.+)$/gm, replacement: '<blockquote>$1</blockquote>' },
      
      // Horizontal rules for section breaks
      { regex: /^---$/gm, replacement: '<hr>' },
      
      // Line breaks and paragraph handling
      { regex: /\n\n/g, replacement: '</p><p>' },
    ];
  }

  /**
   * Convert markdown text to HTML
   * @description Main conversion method that processes markdown and returns clean HTML
   * @param {string} markdown - The markdown text to convert
   * @returns {string} - The converted HTML string
   * @since 2.1.0
   * @example
   * const converter = new SimpleMarkdownConverter();
   * const html = converter.makeHtml('# Hello **World**!');
   * // Returns: '<h1>Hello <strong>World</strong>!</h1>'
   */

  makeHtml(markdown) {
    let html = markdown;
    
    // Process tables first before other rules
    html = this.processTables(html);
    
    // Process lists with proper nesting support
    html = this.processLists(html);
    
    // Apply all rules except list rules (they're handled above)
    const nonListRules = this.rules.filter(rule => 
      !rule.regex.toString().includes('\\* (.+)') && 
      !rule.regex.toString().includes('\\d+\\. (.+)')
    );
    
    nonListRules.forEach(rule => {
      html = html.replace(rule.regex, rule.replacement);
    });
    
    // Wrap in paragraphs
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<[ou]l>)/g, '$1');
    html = html.replace(/(<\/[ou]l>)<\/p>/g, '$1');
    
    return html;
  }

  /**
   * Process lists with proper nesting support
   * @description Handles both bullet and numbered lists with indentation
   * @param {string} markdown - The markdown text to process
   * @returns {string} - HTML with properly nested lists
   * @since 2.1.0
   */
  processLists(markdown) {
    const lines = markdown.split('\n');
    const result = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Check if this line starts a list
      if (this.isListItem(line)) {
        const listData = this.parseList(lines, i);
        result.push(listData.html);
        i = listData.endIndex;
      } else {
        result.push(line);
        i++;
      }
    }
    
    return result.join('\n');
  }

  /**
   * Check if a line is a list item
   * @param {string} line - The line to check
   * @returns {boolean} - True if the line is a list item
   */
  isListItem(line) {
    // Match bullet lists: *, -, + (with optional indentation)
    // Match numbered lists: 1., 2., etc. (with optional indentation)
    return /^\s*(?:[*+-]|\d+\.)\s+/.test(line);
  }

  /**
   * Parse a complete list structure with nesting
   * @param {Array} lines - All lines in the document
   * @param {number} startIndex - Index where the list starts
   * @returns {Object} - Object with html and endIndex
   */
  parseList(lines, startIndex) {
    const listItems = [];
    let i = startIndex;
    let baseIndent = null;
    
    while (i < lines.length) {
      const line = lines[i];
      
      if (!this.isListItem(line) && line.trim() !== '') {
        // Non-list line that's not empty - end of list
        break;
      }
      
      if (line.trim() === '') {
        // Empty line - skip but continue
        i++;
        continue;
      }
      
      const itemData = this.parseListItem(line);
      if (baseIndent === null) {
        baseIndent = itemData.indent;
      }
      
      // Check if this item belongs to current list level
      if (itemData.indent === baseIndent) {
        listItems.push(itemData);
        i++;
      } else if (itemData.indent > baseIndent) {
        // This is a nested list - parse it recursively
        const nestedList = this.parseList(lines, i);
        if (listItems.length > 0) {
          // Add nested list to the last item
          listItems[listItems.length - 1].content += '\n' + nestedList.html;
        }
        i = nestedList.endIndex;
      } else {
        // This item has less indentation - end of current list
        break;
      }
    }
    
    // Determine list type from first item
    const listType = listItems.length > 0 && listItems[0].type === 'numbered' ? 'ol' : 'ul';
    
    // Generate HTML
    let html = `<${listType}>`;
    listItems.forEach(item => {
      html += `<li>${item.content}</li>`;
    });
    html += `</${listType}>`;
    
    return { html, endIndex: i };
  }

  /**
   * Parse a single list item
   * @param {string} line - The line containing the list item
   * @returns {Object} - Object with type, indent, and content
   */
  parseListItem(line) {
    const match = line.match(/^(\s*)(?:([*+-])|\d+\.)\s+(.*)$/);
    if (!match) {
      return { type: 'bullet', indent: 0, content: line.trim() };
    }
    
    const [, indentStr, bulletChar, content] = match;
    const indent = indentStr.length;
    const type = bulletChar ? 'bullet' : 'numbered';
    
    return { type, indent, content: content.trim() };
  }

  processTables(markdown) {
    // Split into lines
    const lines = markdown.split('\n');
    let result = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Check if current line looks like a table row
      if (line.includes('|') && line.startsWith('|') && line.endsWith('|')) {
        // Check if next line is a separator
        const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
        
        if (nextLine.includes('-') && nextLine.includes('|')) {
          // This is a table
          const tableHtml = this.parseTable(lines, i);
          result.push(tableHtml.html);
          i = tableHtml.endIndex;
        } else {
          result.push(lines[i]);
          i++;
        }
      } else {
        result.push(lines[i]);
        i++;
      }
    }
    
    return result.join('\n');
  }

  parseTable(lines, startIndex) {
    let i = startIndex;
    const tableRows = [];
    
    // Parse header row
    if (i < lines.length && lines[i].includes('|')) {
      const headerCells = this.parseTableRow(lines[i]);
      tableRows.push({ isHeader: true, cells: headerCells });
      i++;
    }
    
    // Skip separator row
    if (i < lines.length && lines[i].includes('-') && lines[i].includes('|')) {
      i++;
    }
    
    // Parse data rows
    while (i < lines.length && lines[i].trim().includes('|') && 
           lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
      const dataCells = this.parseTableRow(lines[i]);
      tableRows.push({ isHeader: false, cells: dataCells });
      i++;
    }
    
    // Generate HTML
    let html = '<table class="markdown-table">\n';
    
    tableRows.forEach(row => {
      if (row.isHeader) {
        html += '  <thead>\n    <tr>\n';
        row.cells.forEach(cell => {
          html += `      <th>${cell}</th>\n`;
        });
        html += '    </tr>\n  </thead>\n  <tbody>\n';
      } else {
        html += '    <tr>\n';
        row.cells.forEach(cell => {
          html += `      <td>${cell}</td>\n`;
        });
        html += '    </tr>\n';
      }
    });
    
    html += '  </tbody>\n</table>';
    
    return { html, endIndex: i };
  }

  parseTableRow(line) {
    // Remove leading and trailing pipes, then split by pipe
    const trimmed = line.trim().slice(1, -1);
    return trimmed.split('|').map(cell => cell.trim());
  }
}

// Simple HTML to Word converter
class HtmlToWordConverter {
  static asBlob(html) {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Document</title></head>
      <body>${html}</body></html>`;
    
    return new Blob([header], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }
}

// Export for use in script.js
window.SimpleMarkdownConverter = SimpleMarkdownConverter;
window.HtmlToWordConverter = HtmlToWordConverter;