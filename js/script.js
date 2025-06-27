/**
 * @file script.js
 * @description Core logic for Markdown to Word exporter: handles input events,
 * theme toggle, live preview, and Word (.docx) generation.
 */

// Grab DOM elements
const input = document.getElementById('markdown-input');
const clearBtn = document.getElementById('clear-btn');
const themeBtn = document.getElementById('theme-btn');
const previewBtn = document.getElementById('preview-btn');
const downloadBtn = document.getElementById('download-btn');
const refreshBtn = document.getElementById('refresh-btn');
const previewPane = document.getElementById('preview-pane');
const spinner = document.getElementById('spinner');
const titleInput = document.getElementById('doc-title');
const authorInput = document.getElementById('doc-author');
const dateInput = document.getElementById('doc-date');
const converter = new showdown.Converter({ tables: true, simplifiedAutoLink: true });

/**
 * Toggle button states based on input
 */
input.addEventListener('input', () => {
  const hasContent = input.value.trim().length > 0;
  previewBtn.disabled = !hasContent;
  downloadBtn.disabled = !hasContent;
});

/**
 * Clears editor and resets preview
 */
clearBtn.addEventListener('click', () => {
  input.value = '';
  previewPane.innerHTML = '<em>Enter Markdown and click Preview...</em>';
  previewBtn.disabled = true;
  downloadBtn.disabled = true;
});

/**
 * Toggle dark/light theme
 */
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

/**
 * Render Markdown to HTML in preview pane
 */
function renderPreview() {
  const html = converter.makeHtml(input.value);
  previewPane.innerHTML = html;
  previewPane.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
}
previewBtn.addEventListener('click', renderPreview);
refreshBtn.addEventListener('click', renderPreview);

/**
 * Generate and download a .docx file
 */
downloadBtn.addEventListener('click', async () => {
  if (!window.htmlDocx || typeof htmlDocx.asBlob !== 'function') {
    alert('Export library missing.');
    return;
  }

  spinner.style.display = 'inline-block';
  downloadBtn.disabled = true;

  // Build HTML document
  const bodyHtml = converter.makeHtml(input.value);
  const headerHtml = `
    <h1 style="text-align:center;">${titleInput.value || 'Document'}<\/h1>
    <p style="text-align:right; font-size:0.9em;">By ${authorInput.value || 'Unknown'} | ${dateInput.value || ''}<\/p>
    <hr />`;
  const fullHtml = `<!DOCTYPE html><html><head><meta charset=\"utf-8\" /><style>
        @page { margin:1in; }
        body { font-family:'Calibri',sans-serif; }
      <\/style><\/head><body>
      ${headerHtml}
      ${bodyHtml}
    <\/body><\/html>`;

  try {
    const blob = htmlDocx.asBlob(fullHtml);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${(titleInput.value||'Report').replace(/\s+/g,'_')}.docx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error(err);
    alert('Export failed.');
  } finally {
    spinner.style.display = 'none';
    downloadBtn.disabled = false;
  }
});