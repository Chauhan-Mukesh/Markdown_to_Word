// Enhanced Showdown.js fallback for comprehensive Markdown conversion
class ShowdownFallback {
  constructor(options = {}) {
    this.options = {
      tables: true,
      simplifiedAutoLink: true,
      headerLevelStart: 1,
      strikethrough: true,
      tasklists: true,
      ...options
    };
  }

  makeHtml(markdown) {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Handle code blocks first (to prevent other processing)
    const codeBlocks = [];
    html = html.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const placeholder = `__CODEBLOCK_${codeBlocks.length}__`;
      codeBlocks.push({ lang: lang || 'text', code: code.trim() });
      return placeholder;
    });

    // Handle inline code
    const inlineCodes = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
      const placeholder = `__INLINECODE_${inlineCodes.length}__`;
      inlineCodes.push(code);
      return placeholder;
    });
    
    // Headers (with support for up to h6)
    html = html.replace(/^#{6}\s+(.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^#{5}\s+(.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#{4}\s+(.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^#{3}\s+(.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#{2}\s+(.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^#{1}\s+(.*$)/gim, '<h1>$1</h1>');
    
    // Bold and italic (handle ** before *)
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/_([^_]+?)_/g, '<em>$1</em>');
    
    // Strikethrough
    if (this.options.strikethrough) {
      html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    }
    
    // Links
    html = html.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/\[([^\]]*)\]\[([^\]]*)\]/g, '<a href="#$2">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1" />');
    
    // Horizontal rules
    html = html.replace(/^---+$/gm, '<hr>');
    html = html.replace(/^\*\*\*+$/gm, '<hr>');
    
    // Blockquotes
    html = html.replace(/^>\s*(.*$)/gim, '<blockquote>$1</blockquote>');
    html = html.replace(/<\/blockquote>\s*<blockquote>/g, '\n');
    
    // Lists
    // Unordered lists
    html = html.replace(/^[\s]*[-*+]\s+(.*$)/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    
    // Ordered lists
    html = html.replace(/^[\s]*\d+\.\s+(.*$)/gim, '<ol><li>$1</li></ol>');
    html = html.replace(/<\/ol>\s*<ol>/g, '');
    
    // Task lists
    if (this.options.tasklists) {
      html = html.replace(/^[\s]*[-*+]\s+\[\s\]\s+(.*$)/gim, '<ul class="task-list"><li class="task-list-item"><input type="checkbox" disabled> $1</li></ul>');
      html = html.replace(/^[\s]*[-*+]\s+\[x\]\s+(.*$)/gim, '<ul class="task-list"><li class="task-list-item"><input type="checkbox" checked disabled> $1</li></ul>');
      html = html.replace(/<\/ul>\s*<ul class="task-list">/g, '');
    }
    
    // Tables (basic support)
    if (this.options.tables) {
      html = html.replace(/^\|(.+)\|\s*$/gm, (match, content) => {
        const cells = content.split('|').map(cell => cell.trim());
        return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
      });
      html = html.replace(/(<tr>.*<\/tr>)/s, '<table>$1</table>');
      
      // Handle table headers (line with | --- | --- |)
      html = html.replace(/<tr><td>-+<\/td>.*?<\/tr>/g, '');
      html = html.replace(/<table><tr><td>/g, '<table><thead><tr><th>');
      html = html.replace(/<\/td><td>/g, '</th><th>');
      html = html.replace(/<\/td><\/tr><tr>/g, '</th></tr></thead><tbody><tr>');
      html = html.replace(/<td>/g, '<td>');
      html = html.replace(/<\/table>/g, '</tbody></table>');
    }
    
    // Line breaks and paragraphs
    html = html.replace(/\n\n+/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs and fix nesting
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul|<ol|<table)/g, '$1');
    html = html.replace(/(<\/ul>|<\/ol>|<\/table>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
    html = html.replace(/<br><\/p>/g, '</p>');
    html = html.replace(/<p><br>/g, '<p>');
    
    // Restore code blocks
    codeBlocks.forEach((block, index) => {
      const placeholder = `__CODEBLOCK_${index}__`;
      const codeHtml = `<pre><code class="language-${block.lang}">${this.escapeHtml(block.code)}</code></pre>`;
      html = html.replace(placeholder, codeHtml);
    });
    
    // Restore inline code
    inlineCodes.forEach((code, index) => {
      const placeholder = `__INLINECODE_${index}__`;
      html = html.replace(placeholder, `<code>${this.escapeHtml(code)}</code>`);
    });
    
    return html;
  }
  
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

// Make available globally
if (typeof window !== 'undefined' && !window.showdown) {
  window.showdown = { 
    Converter: ShowdownFallback,
    extension: () => {} // Stub for compatibility
  };
  // Initialize fallback Showdown converter
}