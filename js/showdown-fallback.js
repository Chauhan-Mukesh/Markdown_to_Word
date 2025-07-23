// Minimal Showdown.js fallback for basic Markdown conversion
class ShowdownFallback {
  constructor(options = {}) {
    this.options = options;
  }

  makeHtml(markdown) {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\_\_(.*\_\_)/gim, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    html = html.replace(/\_(.*)\\_/gim, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]*)`/gim, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>');
    
    // Line breaks
    html = html.replace(/\n$/gim, '<br />');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\+ (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
    
    // Numbered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Paragraphs
    html = html.replace(/\n\n/gim, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Clean up
    html = html.replace(/<p><\/p>/gim, '');
    html = html.replace(/<p>(<h[1-6]>)/gim, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/gim, '$1');
    html = html.replace(/<p>(<blockquote>)/gim, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/gim, '$1');
    html = html.replace(/<p>(<ul>)/gim, '$1');
    html = html.replace(/(<\/ul>)<\/p>/gim, '$1');
    html = html.replace(/<p>(<pre>)/gim, '$1');
    html = html.replace(/(<\/pre>)<\/p>/gim, '$1');
    
    return html;
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.showdown = { Converter: ShowdownFallback };
}