// Enhanced syntax highlighting fallback with better language support
class HighlightJsFallback {
  static highlightElement(element) {
    // Basic syntax highlighting for common languages
    const text = element.textContent || element.innerText;
    const language = this.detectLanguage(element, text);
    
    let highlighted = text;
    
    switch(language) {
      case 'javascript':
      case 'js':
        highlighted = this.highlightJavaScript(text);
        break;
      case 'python':
      case 'py':
        highlighted = this.highlightPython(text);
        break;
      case 'css':
        highlighted = this.highlightCSS(text);
        break;
      case 'html':
      case 'xml':
        highlighted = this.highlightHTML(text);
        break;
      case 'json':
        highlighted = this.highlightJSON(text);
        break;
      case 'sql':
        highlighted = this.highlightSQL(text);
        break;
      case 'bash':
      case 'sh':
        highlighted = this.highlightBash(text);
        break;
      case 'markdown':
      case 'md':
        highlighted = this.highlightMarkdown(text);
        break;
      default:
        highlighted = this.escapeHtml(text);
    }
    
    element.innerHTML = highlighted;
    element.classList.add('hljs', `language-${language}`);
    element.setAttribute('data-highlighted', 'yes');
  }
  
  static detectLanguage(element, text) {
    // Check class attribute first
    const className = element.className || '';
    const classMatch = className.match(/language-(\w+)/);
    if (classMatch) {
      return classMatch[1].toLowerCase();
    }
    
    // Detect by content patterns
    if (text.includes('function') || text.includes('const') || text.includes('=>') || text.includes('console.log')) {
      return 'javascript';
    } else if (text.includes('def ') || text.includes('import ') || text.includes('print(') || text.includes('if __name__')) {
      return 'python';
    } else if (text.match(/^\s*[.#][\w-]+\s*{/) || text.includes('color:') || text.includes('margin:')) {
      return 'css';
    } else if (text.includes('<') && text.includes('>') && text.includes('/')) {
      return 'html';
    } else if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      return 'json';
    } else if (text.includes('SELECT') || text.includes('FROM') || text.includes('WHERE')) {
      return 'sql';
    } else if (text.includes('#!/bin/bash') || text.includes('echo ') || text.includes('ls ')) {
      return 'bash';
    } else if (text.includes('#') && text.includes('*') && text.includes('[')) {
      return 'markdown';
    }
    
    return 'text';
  }
  
  static highlightJavaScript(text) {
    return this.escapeHtml(text)
      .replace(/\b(function|const|let|var|if|else|for|while|return|true|false|null|undefined|class|extends|import|export|from|async|await|try|catch|finally|throw|new|this|super|static|get|set)\b/g, '<span class="hljs-keyword">$1</span>')
      .replace(/\/\/.*$/gm, '<span class="hljs-comment">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="hljs-comment">$&</span>')
      .replace(/"([^"\\]|\\.)*"/g, '<span class="hljs-string">$&</span>')
      .replace(/'([^'\\]|\\.)*'/g, '<span class="hljs-string">$&</span>')
      .replace(/`([^`\\]|\\.)*`/g, '<span class="hljs-string">$&</span>')
      .replace(/\b\d+(\.\d+)?\b/g, '<span class="hljs-number">$&</span>')
      .replace(/\b(console|window|document|Array|Object|String|Number|Boolean|Date|Math|JSON)\b/g, '<span class="hljs-built_in">$1</span>');
  }
  
  static highlightPython(text) {
    return this.escapeHtml(text)
      .replace(/\b(def|class|if|else|elif|for|while|import|from|return|True|False|None|and|or|not|in|is|try|except|finally|raise|with|as|pass|break|continue|lambda|yield|global|nonlocal)\b/g, '<span class="hljs-keyword">$1</span>')
      .replace(/#.*$/gm, '<span class="hljs-comment">$&</span>')
      .replace(/"""[\s\S]*?"""/g, '<span class="hljs-string">$&</span>')
      .replace(/'''[\s\S]*?'''/g, '<span class="hljs-string">$&</span>')
      .replace(/"([^"\\]|\\.)*"/g, '<span class="hljs-string">$&</span>')
      .replace(/'([^'\\]|\\.)*'/g, '<span class="hljs-string">$&</span>')
      .replace(/\b\d+(\.\d+)?\b/g, '<span class="hljs-number">$&</span>')
      .replace(/\b(print|len|range|list|dict|set|tuple|str|int|float|bool|type|isinstance|hasattr|getattr|setattr)\b/g, '<span class="hljs-built_in">$1</span>');
  }
  
  static highlightCSS(text) {
    return this.escapeHtml(text)
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="hljs-comment">$&</span>')
      .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="hljs-attribute">$1</span>$2')
      .replace(/([{}();,])/g, '<span class="hljs-punctuation">$1</span>')
      .replace(/([.#][\w-]+)/g, '<span class="hljs-selector-class">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="hljs-string">$&</span>')
      .replace(/'([^']*)'/g, '<span class="hljs-string">$&</span>')
      .replace(/\b\d+(\.\d+)?(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax|deg|rad|turn|s|ms)\b/g, '<span class="hljs-number">$&</span>');
  }
  
  static highlightHTML(text) {
    return this.escapeHtml(text)
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="hljs-comment">$1</span>')
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="hljs-name">$2</span>')
      .replace(/([\w-]+)(=)/g, '<span class="hljs-attr">$1</span>$2')
      .replace(/=(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g, '=<span class="hljs-string">$1</span>');
  }
  
  static highlightJSON(text) {
    return this.escapeHtml(text)
      .replace(/"([^"\\]|\\.)*":/g, '<span class="hljs-attr">$&</span>')
      .replace(/:\s*"([^"\\]|\\.)*"/g, ': <span class="hljs-string">"$1"</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="hljs-literal">$1</span>')
      .replace(/\b\d+(\.\d+)?\b/g, '<span class="hljs-number">$&</span>')
      .replace(/([{}[\],])/g, '<span class="hljs-punctuation">$1</span>');
  }
  
  static highlightSQL(text) {
    return this.escapeHtml(text)
      .replace(/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|JOIN|INNER|LEFT|RIGHT|OUTER|ON|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|NULL|NOT|AND|OR|IN|EXISTS|LIKE|BETWEEN)\b/gi, '<span class="hljs-keyword">$1</span>')
      .replace(/--.*$/gm, '<span class="hljs-comment">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="hljs-comment">$&</span>')
      .replace(/'([^'\\]|\\.)*'/g, '<span class="hljs-string">$&</span>')
      .replace(/\b\d+(\.\d+)?\b/g, '<span class="hljs-number">$&</span>');
  }
  
  static highlightBash(text) {
    return this.escapeHtml(text)
      .replace(/#.*$/gm, '<span class="hljs-comment">$&</span>')
      .replace(/\b(echo|ls|cd|pwd|mkdir|rmdir|rm|cp|mv|grep|find|cat|less|more|head|tail|sort|uniq|wc|chmod|chown|ps|kill|top|df|du|mount|umount|wget|curl|ssh|scp|tar|gzip|gunzip|zip|unzip)\b/g, '<span class="hljs-built_in">$1</span>')
      .replace(/"([^"\\]|\\.)*"/g, '<span class="hljs-string">$&</span>')
      .replace(/'([^'\\]|\\.)*'/g, '<span class="hljs-string">$&</span>')
      .replace(/\$[\w_]+/g, '<span class="hljs-variable">$&</span>')
      .replace(/([|&;<>()])/g, '<span class="hljs-punctuation">$1</span>');
  }
  
  static highlightMarkdown(text) {
    return this.escapeHtml(text)
      .replace(/^#{1,6}\s+.*$/gm, '<span class="hljs-section">$&</span>')
      .replace(/\*\*.*?\*\*/g, '<span class="hljs-strong">$&</span>')
      .replace(/\*.*?\*/g, '<span class="hljs-emphasis">$&</span>')
      .replace(/`.*?`/g, '<span class="hljs-code">$&</span>')
      .replace(/\[.*?\]\(.*?\)/g, '<span class="hljs-link">$&</span>')
      .replace(/^[\s]*[-*+]\s+/gm, '<span class="hljs-bullet">$&</span>')
      .replace(/^\d+\.\s+/gm, '<span class="hljs-number">$&</span>')
      .replace(/^>\s+/gm, '<span class="hljs-quote">$&</span>');
  }
  
  static escapeHtml(text) {
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

// CSS for syntax highlighting
const highlightCSS = `
.hljs {
  background: #f8f8f8;
  padding: 0.5em;
  border-radius: 4px;
  color: #333;
  display: block;
  overflow-x: auto;
}

.hljs-keyword { color: #0000ff; font-weight: bold; }
.hljs-string { color: #008000; }
.hljs-comment { color: #008000; font-style: italic; }
.hljs-number { color: #0451a5; }
.hljs-built_in { color: #0451a5; font-weight: bold; }
.hljs-attribute { color: #ff0000; }
.hljs-punctuation { color: #666; }
.hljs-selector-class { color: #800080; }
.hljs-name { color: #800080; }
.hljs-attr { color: #ff0000; }
.hljs-literal { color: #0451a5; }
.hljs-variable { color: #e90; }
.hljs-section { color: #0000ff; font-weight: bold; }
.hljs-strong { font-weight: bold; }
.hljs-emphasis { font-style: italic; }
.hljs-code { background: #f0f0f0; padding: 0.1em 0.3em; border-radius: 2px; }
.hljs-link { color: #0969da; }
.hljs-bullet { color: #666; }
.hljs-quote { color: #666; font-style: italic; }

/* Dark theme support */
.dark-mode .hljs {
  background: #2d2d2d;
  color: #f8f8f2;
}

.dark-mode .hljs-keyword { color: #66d9ef; }
.dark-mode .hljs-string { color: #a6e22e; }
.dark-mode .hljs-comment { color: #75715e; }
.dark-mode .hljs-number { color: #ae81ff; }
.dark-mode .hljs-built_in { color: #66d9ef; }
.dark-mode .hljs-attribute { color: #f92672; }
.dark-mode .hljs-punctuation { color: #f8f8f2; }
.dark-mode .hljs-selector-class { color: #a6e22e; }
.dark-mode .hljs-name { color: #f92672; }
.dark-mode .hljs-attr { color: #a6e22e; }
.dark-mode .hljs-literal { color: #ae81ff; }
.dark-mode .hljs-variable { color: #fd971f; }
.dark-mode .hljs-section { color: #66d9ef; }
.dark-mode .hljs-code { background: #3a3a3a; }
.dark-mode .hljs-link { color: #66d9ef; }
.dark-mode .hljs-bullet { color: #f8f8f2; }
.dark-mode .hljs-quote { color: #75715e; }
`;

// Inject CSS if not already present
if (typeof document !== 'undefined' && !document.getElementById('highlight-fallback-css')) {
  const style = document.createElement('style');
  style.id = 'highlight-fallback-css';
  style.textContent = highlightCSS;
  document.head.appendChild(style);
}

// Make available globally
if (typeof window !== 'undefined' && !window.hljs) {
  window.hljs = HighlightJsFallback;
  // Initialize fallback highlighting if hljs is not available
}