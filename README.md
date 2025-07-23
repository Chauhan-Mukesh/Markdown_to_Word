# 🚀 Advanced Markdown → Word Exporter 🤖

A comprehensive, feature-rich Web App that transforms your Markdown into polished Word documents with advanced editing capabilities, multiple export formats, and professional templates. Features modern UI, dark/light themes, real-time collaboration tools, and works seamlessly across all major browsers.

🔗 **Live Demo**: [https://chauhan-mukesh.github.io/Markdown_to_Word/](https://chauhan-mukesh.github.io/Markdown_to_Word/)

![Screenshot Preview](./screenshot.png)

## ✨ Features

### 📝 **Enhanced Editor**
- 🔄 **Live Preview**: Instant Markdown → HTML conversion
- 🛠️ **Formatting Toolbar**: Visual buttons for bold, italic, links, tables, headers, lists
- ⌨️ **Keyboard Shortcuts**: Ctrl+B (bold), Ctrl+I (italic), Ctrl+K (link), Ctrl+` (code)
- 🔍 **Find & Replace**: Advanced search with regex support, case sensitivity, whole word matching
- 💾 **Auto-Save**: Automatic local storage backup every 30 seconds with visual indicators

### 📋 **Document Templates**
- 📊 **Business Report**: Professional report template with sections
- 🤝 **Meeting Notes**: Structured meeting documentation
- 💼 **Project Proposal**: Complete proposal template with timeline
- 📖 **README Documentation**: Software documentation template
- 📚 **Tutorial Guide**: Step-by-step tutorial format
- ✉️ **Formal Letter**: Professional correspondence template

### 📁 **File Management**
- 📂 **Load Files**: Import markdown files from your device
- 💾 **Save Markdown**: Export current content as .md file
- 🔄 **Auto-Save**: Persistent local storage with recovery options

### 📤 **Multi-Format Export**
- 📄 **Word (.docx)**: Professional Word documents with custom metadata
- 🌐 **HTML**: Clean, styled HTML with embedded CSS
- 🌐 **Standalone HTML**: Self-contained HTML file for sharing
- 📝 **Plain Text**: Raw markdown or plain text export
- 📑 **PDF**: Print-to-PDF functionality with optimized layouts
- 🖨️ **Print**: Print-optimized formatting with proper page breaks

### 🎨 **User Experience**
- 🌓 **Dark/Light Themes**: Seamless toggle with persistent settings
- 🚀 **Animations**: Smooth button interactions and loading states
- 📱 **Responsive Design**: Adapts from mobile to desktop
- ♿ **Accessibility**: Keyboard navigation and screen reader support
- 🧩 **Cross-Browser**: Chrome, Firefox, Edge, Safari, IE11+

## 📦 Installation & Usage

```bash
# Clone repo
git clone https://github.com/Chauhan-Mukesh/Markdown_to_Word.git
cd Markdown_to_Word

# Open in browser (no build required)
open index.html
# OR serve locally
python -m http.server 8000
```

## ✨ How To Use 📖

1. **📋 Choose Template**: Select from 7 pre-built templates or start blank
2. **✍️ Write Content**: Use the editor with formatting toolbar and shortcuts
3. **🔍 Preview**: See live formatted preview as you type
4. **💾 Save/Load**: Manage your markdown files and auto-saved drafts
5. **🔍 Find & Replace**: Use Ctrl+F for advanced search and replace
6. **📥 Export**: Choose from multiple export formats
7. **🖨️ Print**: Use print-optimized layouts for physical documents

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | **Bold** text |
| `Ctrl+I` | *Italic* text |
| `Ctrl+K` | Insert [link] |
| `Ctrl+`` | `Inline code` |
| `Ctrl+F` | Find & Replace |
| `Escape` | Close modals |

## 🗂️ Project Structure

```plaintext
Markdown_to_Word/
├── css/
│   └── style.css                 # Comprehensive styles & themes
├── js/
│   ├── script.js                 # Main application logic
│   ├── markdown-converter.js     # Custom markdown parser
│   ├── file-manager.js           # File operations & auto-save
│   ├── editor-toolbar.js         # Formatting tools & shortcuts
│   ├── document-templates.js     # Pre-built templates
│   ├── search-replace.js         # Find & replace functionality
│   └── print-export.js           # Print & PDF export
├── index.html                    # Application entry point
├── screenshot.png                # Preview image
└── README.md                     # This documentation
```

## 🛠️ Technical Features

- **🔧 No Dependencies**: Self-contained with custom markdown parser
- **💾 Local Storage**: Auto-save and theme persistence
- **🎯 Event-Driven**: Responsive UI with real-time updates
- **📐 CSS Grid/Flexbox**: Modern responsive layout
- **🎨 CSS Custom Properties**: Dynamic theming system
- **⚡ Performance Optimized**: Minimal DOM manipulation
- **🔒 Privacy-First**: All processing happens locally

## 🛠️ Browser Support

| Browser        | Supported Versions |
| -------------- | ------------------ |
| Chrome         | Latest & 2 prior   |
| Firefox        | Latest & 2 prior   |
| Edge           | Latest & 2 prior   |
| Safari         | Latest & 2 prior   |
| Internet Expl. | 11+                |

## 🚀 Advanced Features

### Document Templates
- **Smart Templates**: Context-aware templates with dynamic dates
- **Template Variables**: Automatic author and date insertion
- **Custom Layouts**: Professional formatting for different document types

### Export Options
- **Rich Word Documents**: Proper styling, headers, and metadata
- **Standalone HTML**: Fully self-contained with embedded styles
- **Print Optimization**: Page breaks, margins, and typography tuned for printing
- **Multiple Formats**: One-click export to various formats

### Editor Enhancements
- **Visual Toolbar**: Intuitive formatting buttons with tooltips
- **Smart Auto-Save**: Intelligent saving with conflict resolution
- **Advanced Search**: Regex support, case sensitivity, whole word matching
- **Keyboard First**: Full keyboard navigation and shortcuts

---

> **Enhanced with Modern Web Technologies** 🔧

---

This project is licensed under the [GNU General Public License v3.0](LICENSE).
