// Enhanced HTML to DOCX converter fallback with better Word compatibility
class HtmlDocxFallback {
  static asBlob(htmlString, options = {}) {
    // Create a comprehensive Word-compatible HTML document
    const wordDocument = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="utf-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word">
    <meta name="Originator" content="Microsoft Word">
    <link rel="File-List" href="filelist.xml">
    <style>
        /* Word-compatible styles */
        @page {
            size: 8.5in 11.0in;
            margin: 1.0in 1.0in 1.0in 1.0in;
            mso-header-margin: .5in;
            mso-footer-margin: .5in;
            mso-paper-source: 0;
        }
        
        body {
            font-family: Calibri, sans-serif;
            font-size: 11pt;
            line-height: 1.15;
            margin: 0;
            padding: 0;
            background: white;
            color: black;
        }
        
        h1, h2, h3, h4, h5, h6 {
            font-family: Calibri, sans-serif;
            font-weight: bold;
            margin-top: 12pt;
            margin-bottom: 6pt;
            line-height: 1.15;
        }
        
        h1 { font-size: 16pt; color: #2F5597; }
        h2 { font-size: 14pt; color: #2F5597; }
        h3 { font-size: 12pt; color: #1F4E79; }
        h4 { font-size: 11pt; color: #1F4E79; }
        h5 { font-size: 11pt; font-style: italic; }
        h6 { font-size: 11pt; font-style: italic; }
        
        p {
            margin-top: 0pt;
            margin-bottom: 6pt;
            font-size: 11pt;
            font-family: Calibri, sans-serif;
        }
        
        strong, b {
            font-weight: bold;
        }
        
        em, i {
            font-style: italic;
        }
        
        code {
            font-family: Consolas, 'Courier New', monospace;
            font-size: 10pt;
            background-color: #F2F2F2;
            padding: 1pt 3pt;
            border: 1pt solid #CCCCCC;
        }
        
        pre {
            font-family: Consolas, 'Courier New', monospace;
            font-size: 10pt;
            background-color: #F8F8F8;
            border: 1pt solid #CCCCCC;
            padding: 6pt;
            margin: 6pt 0;
            white-space: pre-wrap;
        }
        
        pre code {
            background: transparent;
            border: none;
            padding: 0;
        }
        
        blockquote {
            margin: 6pt 0 6pt 36pt;
            padding-left: 12pt;
            border-left: 3pt solid #CCCCCC;
            font-style: italic;
            color: #666666;
        }
        
        ul, ol {
            margin: 6pt 0;
            padding-left: 24pt;
        }
        
        li {
            margin-bottom: 3pt;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 6pt 0;
            font-size: 11pt;
        }
        
        th, td {
            border: 1pt solid #CCCCCC;
            padding: 3pt 6pt;
            text-align: left;
            vertical-align: top;
        }
        
        th {
            background-color: #F2F2F2;
            font-weight: bold;
        }
        
        a {
            color: #0563C1;
            text-decoration: underline;
        }
        
        hr {
            border: none;
            border-top: 1pt solid #CCCCCC;
            margin: 12pt 0;
        }
        
        img {
            max-width: 100%;
            height: auto;
        }
        
        .task-list {
            list-style: none;
            padding-left: 0;
        }
        
        .task-list-item {
            margin-bottom: 3pt;
        }
        
        .task-list-item input {
            margin-right: 6pt;
        }
        
        del {
            text-decoration: line-through;
            color: #666666;
        }
        
        /* Ensure proper page breaks */
        h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
        }
        
        pre, blockquote, table {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
${htmlString}
</body>
</html>`;

    // Create blob with proper MIME type for Word
    return new Blob([wordDocument], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
  }

  // Alternative method for better compatibility
  static asRTF(htmlString) {
    // Convert HTML to RTF format (simpler but more compatible)
    let rtf = '{\\rtf1\\ansi\\deff0 {\\fonttbl\\f0 Times New Roman;\\f1 Calibri;}}';
    
    // Clean HTML and convert to RTF
    let text = htmlString
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '{\\f1\\fs32\\b $1\\b0\\par\\par}')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '{\\f1\\fs28\\b $1\\b0\\par\\par}')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '{\\f1\\fs24\\b $1\\b0\\par\\par}')
      .replace(/<h[4-6][^>]*>(.*?)<\/h[4-6]>/gi, '{\\f1\\fs20\\b $1\\b0\\par\\par}')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\\par\\par')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '{\\b $1\\b0}')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '{\\b $1\\b0}')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '{\\i $1\\i0}')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '{\\i $1\\i0}')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '{\\f0\\fs20 $1}')
      .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '{\\f0\\fs20 $1\\par}')
      .replace(/<br\s*\/?>/gi, '\\par')
      .replace(/<hr\s*\/?>/gi, '\\par\\line\\par')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '\\tab $1\\par')
      .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1')
      .replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '{\\i $1\\i0\\par}')
      .replace(/<[^>]*>/g, '') // Remove all other HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    rtf += text + '}';
    
    return new Blob([rtf], { 
      type: 'application/rtf' 
    });
  }
}

// Make available globally
if (typeof window !== 'undefined' && !window.htmlDocx) {
  window.htmlDocx = HtmlDocxFallback;
  // Initialize fallback HTML to DOCX converter
}