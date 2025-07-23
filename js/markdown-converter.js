/**
 * @file markdown-converter.js
 * @description Simplified markdown converter to replace CDN dependencies
 */

class SimpleMarkdownConverter {
  constructor() {
    this.rules = [
      // Headers
      { regex: /^# (.*$)/gm, replacement: '<h1>$1</h1>' },
      { regex: /^## (.*$)/gm, replacement: '<h2>$1</h2>' },
      { regex: /^### (.*$)/gm, replacement: '<h3>$1</h3>' },
      { regex: /^#### (.*$)/gm, replacement: '<h4>$1</h4>' },
      { regex: /^##### (.*$)/gm, replacement: '<h5>$1</h5>' },
      { regex: /^###### (.*$)/gm, replacement: '<h6>$1</h6>' },
      
      // Bold and Italic
      { regex: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em>$1</em></strong>' },
      { regex: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
      { regex: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
      
      // Links
      { regex: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2">$1</a>' },
      
      // Images
      { regex: /!\[([^\]]*)\]\(([^)]+)\)/g, replacement: '<img src="$2" alt="$1" />' },
      
      // Code blocks
      { regex: /```([^`]+)```/g, replacement: '<pre><code>$1</code></pre>' },
      { regex: /`([^`]+)`/g, replacement: '<code>$1</code>' },
      
      // Lists
      { regex: /^\* (.+)$/gm, replacement: '<li>$1</li>' },
      { regex: /^\d+\. (.+)$/gm, replacement: '<li>$1</li>' },
      
      // Blockquotes
      { regex: /^> (.+)$/gm, replacement: '<blockquote>$1</blockquote>' },
      
      // Horizontal rules
      { regex: /^---$/gm, replacement: '<hr>' },
      
      // Line breaks
      { regex: /\n\n/g, replacement: '</p><p>' },
    ];
  }

  makeHtml(markdown) {
    let html = markdown;
    
    // Apply all rules
    this.rules.forEach(rule => {
      html = html.replace(rule.regex, rule.replacement);
    });
    
    // Wrap in paragraphs
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs and fix list wrapping
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    html = html.replace(/<\/ul><ul>/g, '');
    
    return html;
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