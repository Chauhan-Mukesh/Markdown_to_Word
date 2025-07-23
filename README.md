# 🚀 Advanced Markdown → Word Exporter 🤖

A comprehensive, feature-rich Web App that transforms your Markdown into polished documents in multiple formats. Features modern UI, templates, statistics, auto-save, and works out‑of‑the‑box on all major browsers.

🔗 **Live Demo**: [https://chauhan-mukesh.github.io/Markdown_to_Word/](https://chauhan-mukesh.github.io/Markdown_to_Word/)

![Screenshot Preview](./screenshot.png)

## ✨ Enhanced Features

### 📄 **Multiple Export Formats**
- 📄 **Word (.docx)**: Professional Word documents with custom metadata
- 🌐 **HTML**: Standalone HTML files with embedded styling
- 📑 **PDF**: Print-optimized PDF generation
- 📝 **Plain Text**: Clean text export with headers

### 🎨 **Document Templates**
- 📋 **Resume**: Professional resume template
- 📊 **Report**: Business report template
- ✉️ **Letter**: Formal letter template
- 📰 **Article**: Blog article template

### 📊 **Document Analytics**
- **Word Count**: Track document length
- **Character Count**: With and without spaces
- **Paragraph Count**: Document structure analysis
- **Reading Time**: Estimated reading duration

### 🔄 **Core Features**
- 🔄 **Live Preview**: Instant Markdown → HTML via enhanced Showdown.js
- 🎨 **Dark/Light Themes**: Seamless toggle with enhanced contrast
- 🚀 **Animations**: Smooth button hovers, loading spinners, focus highlights
- 📱 **Responsive**: Optimized from mobile to desktop
- 📚 **Table of Contents**: Auto-generate TOC from headers
- 💾 **Auto-save**: Automatic local storage with visual indicator
- ⌨️ **Keyboard Shortcuts**: Ctrl+S (save), Ctrl+P (preview), Ctrl+Enter (export)
- 🧩 **Cross‑Browser**: Chrome, Firefox, Edge, Safari, IE11+

### 🔧 **Technical Improvements**
- **Fallback System**: Local libraries when CDNs are blocked
- **Error Handling**: Graceful degradation for missing dependencies
- **Modern Architecture**: ES6+ class-based design
- **Performance**: Optimized rendering and memory usage

## 📦 Installation & Usage

```bash
# Clone repo
git clone https://github.com/Chauhan-Mukesh/Markdown_to_Word.git
cd Markdown_to_Word
# Open in browser
open index.html
```

## ✨ How To Use 📖

1. ✍️ **Write or paste** your Markdown into the left editor  
2. 📄 **Load templates** using the Templates button for quick starts
3. 🔍 **Click Preview** to see the formatted result with live syntax highlighting  
4. 📊 **View Statistics** to track word count, reading time, and document metrics
5. 📚 **Generate TOC** to automatically create a table of contents from headers
6. 📥 **Export** in your preferred format: Word, HTML, PDF, or Plain Text
7. 💾 **Auto-save** keeps your work safe automatically

### ⌨️ Keyboard Shortcuts
- **Ctrl+S** (or Cmd+S): Save document
- **Ctrl+P** (or Cmd+P): Preview document  
- **Ctrl+Enter** (or Cmd+Enter): Export to Word

## 🗂️ Project Structure
```plaintext
Markdown_to_Word/
├── css/style.css              # Enhanced styles & animations
├── js/
│   ├── script.js              # Main application logic
│   ├── showdown-fallback.js   # Local Markdown parser
│   ├── html-docx-fallback.js  # Local Word export
│   └── highlight-fallback.js  # Local syntax highlighting
├── index.html                 # App entry point
├── screenshot.png             # Preview image
└── README.md                  # This documentation
```

## 🛠️ Browser Support

| Browser        | Supported Versions | Export Formats |
| -------------- | ------------------ | -------------- |
| Chrome         | Latest & 2 prior   | All formats    |
| Firefox        | Latest & 2 prior   | All formats    |
| Edge           | Latest & 2 prior   | All formats    |
| Safari         | Latest & 2 prior   | All formats    |
| Internet Expl. | 11                 | Word, HTML, Text |

## 🔧 Technical Features

- **Robust Fallback System**: Local libraries ensure functionality even when CDNs are blocked
- **Modern ES6+ Architecture**: Clean, maintainable class-based code structure  
- **Local Storage Integration**: Automatic document persistence across sessions
- **Responsive Design**: Optimized for all screen sizes and devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Efficient rendering and minimal memory footprint

## 🎯 Use Cases

- **Students**: Write and format academic papers, reports, and assignments
- **Professionals**: Create business documents, proposals, and presentations  
- **Developers**: Document APIs, write technical specifications, and create README files
- **Writers**: Draft articles, blog posts, and manuscripts with live preview
- **Teams**: Collaborate on documents with consistent formatting across platforms

---

> **Enhanced with Modern Web Technologies** 🚀  
> **Original concept built with ChatGPT** 🤖

---

This project is licensed under the [GNU General Public License v3.0](LICENSE).
