// Basic syntax highlighting fallback
class HighlightJsFallback {
  static highlightElement(element) {
    // Basic syntax highlighting for common languages
    const text = element.textContent || element.innerText;
    const language = this.detectLanguage(text);
    
    let highlighted = text;
    
    if (language === 'javascript' || language === 'js') {
      highlighted = this.highlightJavaScript(text);
    } else if (language === 'python') {
      highlighted = this.highlightPython(text);
    } else if (language === 'css') {
      highlighted = this.highlightCSS(text);
    } else if (language === 'html') {
      highlighted = this.highlightHTML(text);
    }
    
    element.innerHTML = highlighted;
    element.classList.add('hljs', `hljs-${language}`);
  }
  
  static detectLanguage(text) {
    if (text.includes('function') || text.includes('const') || text.includes('=>')) {
      return 'javascript';
    } else if (text.includes('def ') || text.includes('import ') || text.includes('print(')) {
      return 'python';
    } else if (text.includes('{') && text.includes(':') && text.includes(';')) {
      return 'css';
    } else if (text.includes('<') && text.includes('>')) {
      return 'html';
    }
    return 'text';
  }
  
  static highlightJavaScript(text) {
    return text
      .replace(/\b(function|const|let|var|if|else|for|while|return|true|false|null|undefined)\b/g, '<span class="keyword">$1</span>')
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
      .replace(/"([^"\\]|\\.)*"/g, '<span class="string">$&</span>')
      .replace(/'([^'\\]|\\.)*'/g, '<span class="string">$&</span>');
  }
  
  static highlightPython(text) {
    return text
      .replace(/\b(def|class|if|else|elif|for|while|import|from|return|True|False|None)\b/g, '<span class="keyword">$1</span>')
      .replace(/#.*$/gm, '<span class="comment">$&</span>')
      .replace(/"([^"\\]|\\.)*"/g, '<span class="string">$&</span>')
      .replace(/'([^'\\]|\\.)*'/g, '<span class="string">$&</span>');
  }
  
  static highlightCSS(text) {
    return text
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
      .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="property">$1</span>$2')
      .replace(/([{}])/g, '<span class="punctuation">$1</span>');
  }
  
  static highlightHTML(text) {
    return text
      .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '$1<span class="tag">$2</span>')
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="comment">$1</span>');
  }
}

// CSS for syntax highlighting
const highlightCSS = `
.hljs {
  background: #f8f8f8;
  padding: 0.5em;
  border-radius: 4px;
}
.hljs .keyword {
  color: #0000ff;
  font-weight: bold;
}
.hljs .string {
  color: #008000;
}
.hljs .comment {
  color: #008000;
  font-style: italic;
}
.hljs .property {
  color: #ff0000;
}
.hljs .tag {
  color: #800080;
}
.hljs .punctuation {
  color: #666;
}
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = highlightCSS;
  document.head.appendChild(style);
}

// Make available globally
if (typeof window !== 'undefined') {
  window.hljs = HighlightJsFallback;
}