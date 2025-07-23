// Basic HTML to DOCX converter fallback
class HtmlDocxFallback {
  static asBlob(htmlString) {
    // Create a simple RTF document that Word can open
    const rtfHeader = '{\\rtf1\\ansi\\deff0 {\\fonttbl\\f0 Times New Roman;}}';
    const rtfBody = htmlString
      .replace(/<h1>(.*?)<\/h1>/g, '\\fs28\\b $1\\b0\\fs24\\par\\par')
      .replace(/<h2>(.*?)<\/h2>/g, '\\fs24\\b $1\\b0\\fs20\\par\\par')
      .replace(/<h3>(.*?)<\/h3>/g, '\\fs20\\b $1\\b0\\fs18\\par\\par')
      .replace(/<p>(.*?)<\/p>/g, '$1\\par\\par')
      .replace(/<strong>(.*?)<\/strong>/g, '\\b $1\\b0')
      .replace(/<em>(.*?)<\/em>/g, '\\i $1\\i0')
      .replace(/<br\s*\/?>/g, '\\par')
      .replace(/<hr\s*\/?>/g, '\\par\\line\\par')
      .replace(/<[^>]*>/g, '') // Remove all other HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    
    const rtfDocument = rtfHeader + rtfBody + '}';
    
    // For a more compatible approach, let's create a simple HTML file
    // that can be opened by Word
    const wordHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="Microsoft Word">
<meta name="Originator" content="Microsoft Word">
<style>
body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.15; }
h1 { font-size: 16pt; font-weight: bold; margin: 12pt 0; }
h2 { font-size: 14pt; font-weight: bold; margin: 10pt 0; }
h3 { font-size: 12pt; font-weight: bold; margin: 8pt 0; }
p { margin: 6pt 0; }
</style>
</head>
<body>
${htmlString}
</body>
</html>`;
    
    return new Blob([wordHtml], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.htmlDocx = HtmlDocxFallback;
}