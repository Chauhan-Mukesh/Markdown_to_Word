/**
 * @file print-export.js
 * @description Print and PDF export functionality
 */

class PrintExport {
  constructor() {
    this.setupPrintStyles();
  }

  /**
   * Setup print-specific CSS styles
   */
  setupPrintStyles() {
    const printCSS = `
      @media print {
        body {
          background: white !important;
          color: black !important;
          font-family: 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.5;
        }
        
        #app {
          display: block !important;
        }
        
        #editor-panel {
          display: none !important;
        }
        
        #preview-panel {
          width: 100% !important;
          height: auto !important;
          box-shadow: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        #preview-header {
          display: none !important;
        }
        
        .preview {
          background: white !important;
          color: black !important;
          padding: 1in !important;
          border: none !important;
          overflow: visible !important;
        }
        
        .preview h1 {
          color: black !important;
          font-size: 18pt;
          margin-top: 0;
          page-break-after: avoid;
        }
        
        .preview h2 {
          color: black !important;
          font-size: 16pt;
          page-break-after: avoid;
        }
        
        .preview h3 {
          color: black !important;
          font-size: 14pt;
          page-break-after: avoid;
        }
        
        .preview p {
          margin: 6pt 0;
          orphans: 3;
          widows: 3;
        }
        
        .preview pre {
          background: #f5f5f5 !important;
          border: 1px solid #ccc;
          padding: 10pt;
          page-break-inside: avoid;
        }
        
        .preview table {
          border-collapse: collapse;
          width: 100%;
          page-break-inside: avoid;
        }
        
        .preview th,
        .preview td {
          border: 1px solid #000;
          padding: 4pt 8pt;
        }
        
        .preview th {
          background: #f0f0f0 !important;
          font-weight: bold;
        }
        
        .preview blockquote {
          border-left: 3pt solid #666;
          margin: 0 0 0 20pt;
          padding-left: 10pt;
          font-style: italic;
        }
        
        /* Page breaks */
        .page-break {
          page-break-before: always;
        }
        
        .no-break {
          page-break-inside: avoid;
        }
      }
    `;

    const printStyleSheet = document.createElement('style');
    printStyleSheet.textContent = printCSS;
    document.head.appendChild(printStyleSheet);
  }

  /**
   * Print the current document
   */
  printDocument(title = 'Document') {
    // Update document title for print
    const originalTitle = document.title;
    document.title = title;

    // Ensure preview is rendered
    if (window.renderPreview) {
      window.renderPreview();
    }

    // Print
    window.print();

    // Restore original title
    document.title = originalTitle;
  }

  /**
   * Export as PDF (using browser's print to PDF)
   */
  exportToPDF(title = 'Document') {
    alert('To export as PDF:\n1. Use the Print button\n2. Choose "Save as PDF" as the destination\n3. Click Save');
    this.printDocument(title);
  }

  /**
   * Create a standalone HTML file for sharing
   */
  createStandaloneHTML(markdownContent, title = 'Document', author = '', date = '') {
    const converter = new SimpleMarkdownConverter();
    const bodyHtml = converter.makeHtml(markdownContent);
    
    const standaloneHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      background: #fff;
    }
    
    h1, h2, h3, h4, h5, h6 {
      color: #2c3e50;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      line-height: 1.2;
    }
    
    h1 {
      border-bottom: 2px solid #3498db;
      padding-bottom: 0.5em;
      font-size: 2.2em;
    }
    
    h2 {
      border-bottom: 1px solid #ecf0f1;
      padding-bottom: 0.3em;
      font-size: 1.8em;
    }
    
    p {
      margin: 1em 0;
      text-align: justify;
    }
    
    code {
      background: #f8f9fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.9em;
      color: #e74c3c;
    }
    
    pre {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      margin: 1.5em 0;
    }
    
    pre code {
      background: none;
      color: inherit;
      padding: 0;
    }
    
    blockquote {
      border-left: 4px solid #3498db;
      margin: 1.5em 0;
      padding: 0.5em 0 0.5em 20px;
      background: #f8f9fa;
      font-style: italic;
      color: #7f8c8d;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
      border: 1px solid #ddd;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
    }
    
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    a {
      color: #3498db;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    hr {
      border: none;
      border-top: 2px solid #ecf0f1;
      margin: 2em 0;
    }
    
    ul, ol {
      padding-left: 1.5em;
    }
    
    li {
      margin: 0.5em 0;
    }
    
    .document-header {
      text-align: center;
      border-bottom: 2px solid #3498db;
      padding-bottom: 1em;
      margin-bottom: 2em;
    }
    
    .document-meta {
      color: #7f8c8d;
      font-style: italic;
      margin-top: 0.5em;
    }
    
    @media print {
      body {
        font-size: 12pt;
        line-height: 1.4;
      }
      
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
      }
      
      table, pre, blockquote {
        page-break-inside: avoid;
      }
      
      img {
        max-width: 100%;
        page-break-inside: avoid;
      }
    }
    
    @media (max-width: 768px) {
      body {
        padding: 10px;
        font-size: 16px;
      }
      
      h1 {
        font-size: 1.8em;
      }
      
      h2 {
        font-size: 1.5em;
      }
      
      table {
        font-size: 14px;
      }
      
      pre {
        padding: 10px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="document-header">
    <h1>${title}</h1>
    <div class="document-meta">
      ${author ? `By ${author}` : ''} 
      ${author && date ? ' | ' : ''}
      ${date ? new Date(date).toLocaleDateString() : ''}
    </div>
  </div>
  
  <main>
    ${bodyHtml}
  </main>
  
  <footer style="margin-top: 3em; padding-top: 1em; border-top: 1px solid #ecf0f1; text-align: center; color: #95a5a6; font-size: 0.9em;">
    Generated with Advanced Markdown to Word Exporter
  </footer>
</body>
</html>`;

    return standaloneHTML;
  }

  /**
   * Download standalone HTML file
   */
  downloadStandaloneHTML(markdownContent, title = 'Document', author = '', date = '') {
    const html = this.createStandaloneHTML(markdownContent, title, author, date);
    const blob = new Blob([html], { type: 'text/html' });
    const filename = (title || 'document').replace(/\s+/g, '_') + '_standalone.html';
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

window.PrintExport = PrintExport;