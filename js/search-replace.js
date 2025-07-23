/**
 * @file search-replace.js
 * @description Find and replace functionality for the markdown editor
 */

class SearchReplace {
  constructor(textarea) {
    this.textarea = textarea;
    this.searchModal = null;
    this.currentSearchIndex = -1;
    this.searchMatches = [];
    this.setupSearchModal();
  }

  /**
   * Create and setup the search/replace modal
   */
  setupSearchModal() {
    // Create modal HTML
    const modalHTML = `
      <div id="search-modal" class="search-modal" style="display: none;">
        <div class="search-modal-content draggable">
          <div class="search-modal-header drag-handle">
            <h3>🔍 Find & Replace</h3>
            <button class="search-close" onclick="searchReplace.closeModal()">&times;</button>
          </div>
          <div class="search-inputs">
            <div class="search-row">
              <label>Find:</label>
              <input type="text" id="search-input" placeholder="Search text...">
              <button onclick="searchReplace.findNext()">▼ Next</button>
              <button onclick="searchReplace.findPrevious()">▲ Previous</button>
            </div>
            <div class="search-row">
              <label>Replace:</label>
              <input type="text" id="replace-input" placeholder="Replace with...">
              <button onclick="searchReplace.replace()">Replace</button>
              <button onclick="searchReplace.replaceAll()">Replace All</button>
            </div>
            <div class="search-options">
              <label><input type="checkbox" id="case-sensitive"> Case sensitive</label>
              <label><input type="checkbox" id="whole-word"> Whole word</label>
              <label><input type="checkbox" id="use-regex"> Regular expression</label>
            </div>
            <div class="search-status">
              <span id="search-count">No matches</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal to document
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.searchModal = document.getElementById('search-modal');

    // Setup draggable functionality
    this.setupDraggable();

    // Setup event listeners
    document.getElementById('search-input').addEventListener('input', () => {
      this.performSearch();
    });

    // Setup keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        this.openModal();
      }
      if (e.key === 'Escape' && this.searchModal.style.display !== 'none') {
        this.closeModal();
      }
    });
  }

  /**
   * Open the search modal
   */
  openModal() {
    this.searchModal.style.display = 'block';
    document.getElementById('search-input').focus();
    
    // If text is selected in textarea, use it as search term
    const selectedText = this.textarea.value.substring(
      this.textarea.selectionStart,
      this.textarea.selectionEnd
    );
    if (selectedText) {
      document.getElementById('search-input').value = selectedText;
      this.performSearch();
    }
  }

  /**
   * Close the search modal
   */
  closeModal() {
    this.searchModal.style.display = 'none';
    this.clearHighlights();
    this.textarea.focus();
  }

  /**
   * Perform search and highlight matches
   */
  performSearch() {
    const searchTerm = document.getElementById('search-input').value;
    if (!searchTerm) {
      this.searchMatches = [];
      this.updateSearchCount();
      return;
    }

    const text = this.textarea.value;
    const caseSensitive = document.getElementById('case-sensitive').checked;
    const wholeWord = document.getElementById('whole-word').checked;
    const useRegex = document.getElementById('use-regex').checked;

    let pattern;
    try {
      if (useRegex) {
        pattern = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
      } else {
        let escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (wholeWord) {
          escapedTerm = `\\b${escapedTerm}\\b`;
        }
        pattern = new RegExp(escapedTerm, caseSensitive ? 'g' : 'gi');
      }
    } catch (e) {
      this.searchMatches = [];
      this.updateSearchCount();
      return;
    }

    this.searchMatches = [];
    let match;
    while ((match = pattern.exec(text)) !== null) {
      this.searchMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0]
      });
    }

    this.currentSearchIndex = this.searchMatches.length > 0 ? 0 : -1;
    this.updateSearchCount();
    this.highlightCurrentMatch();
  }

  /**
   * Find next match
   */
  findNext() {
    if (this.searchMatches.length === 0) return;
    
    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchMatches.length;
    this.highlightCurrentMatch();
    this.updateSearchCount();
  }

  /**
   * Find previous match
   */
  findPrevious() {
    if (this.searchMatches.length === 0) return;
    
    this.currentSearchIndex = this.currentSearchIndex <= 0 
      ? this.searchMatches.length - 1 
      : this.currentSearchIndex - 1;
    this.highlightCurrentMatch();
    this.updateSearchCount();
  }

  /**
   * Replace current match
   */
  replace() {
    if (this.currentSearchIndex < 0 || this.currentSearchIndex >= this.searchMatches.length) return;

    const replaceText = document.getElementById('replace-input').value;
    const match = this.searchMatches[this.currentSearchIndex];
    
    // Replace text
    const text = this.textarea.value;
    const newText = text.substring(0, match.start) + replaceText + text.substring(match.end);
    this.textarea.value = newText;
    
    // Trigger input event
    this.textarea.dispatchEvent(new Event('input'));
    
    // Update search matches
    this.performSearch();
  }

  /**
   * Replace all matches
   */
  replaceAll() {
    if (this.searchMatches.length === 0) return;

    const replaceText = document.getElementById('replace-input').value;
    let text = this.textarea.value;
    
    // Replace from end to beginning to maintain indices
    for (let i = this.searchMatches.length - 1; i >= 0; i--) {
      const match = this.searchMatches[i];
      text = text.substring(0, match.start) + replaceText + text.substring(match.end);
    }
    
    this.textarea.value = text;
    this.textarea.dispatchEvent(new Event('input'));
    
    const count = this.searchMatches.length;
    this.performSearch();
    
    if (window.notificationSystem) {
      window.notificationSystem.success(`Replaced ${count} occurrences`);
    } else {
      alert(`Replaced ${count} occurrences`);
    }
  }

  /**
   * Highlight current match in textarea
   */
  highlightCurrentMatch() {
    if (this.currentSearchIndex < 0 || this.currentSearchIndex >= this.searchMatches.length) return;

    const match = this.searchMatches[this.currentSearchIndex];
    this.textarea.setSelectionRange(match.start, match.end);
    this.textarea.focus();
  }

  /**
   * Clear all highlights
   */
  clearHighlights() {
    // For now, just clear selection
    this.textarea.setSelectionRange(0, 0);
  }

  /**
   * Update search count display
   */
  updateSearchCount() {
    const countElement = document.getElementById('search-count');
    if (this.searchMatches.length === 0) {
      countElement.textContent = 'No matches';
    } else {
      countElement.textContent = `${this.currentSearchIndex + 1} of ${this.searchMatches.length}`;
    }
  }

  /**
   * Setup draggable functionality for the search modal
   */
  setupDraggable() {
    const modal = this.searchModal.querySelector('.search-modal-content');
    const header = this.searchModal.querySelector('.drag-handle');
    let isDragging = false;
    let startX, startY, initialX, initialY;

    header.style.cursor = 'move';

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = modal.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      modal.style.position = 'fixed';
      modal.style.left = initialX + 'px';
      modal.style.top = initialY + 'px';
      modal.style.transform = 'none';
      
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newX = Math.max(0, Math.min(window.innerWidth - modal.offsetWidth, initialX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - modal.offsetHeight, initialY + deltaY));
      
      modal.style.left = newX + 'px';
      modal.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
}

// CSS styles for search modal
const searchModalCSS = `
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  min-width: 500px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

.search-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.search-modal-header h3 {
  margin: 0;
  color: white;
}

.search-inputs {
  padding: 1.5rem;
}

.search-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
  padding: 0.5rem;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.search-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.search-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.search-row label {
  min-width: 60px;
  font-weight: bold;
}

.search-row input[type="text"] {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-row button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: background 0.2s;
}

.search-row button:hover {
  background: #f5f5f5;
}

.search-options {
  display: flex;
  gap: 15px;
  margin: 15px 0;
}

.search-options label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.search-status {
  text-align: center;
  padding: 10px;
  color: #666;
  font-size: 14px;
}

/* Dark mode styles */
body.dark-mode .search-modal-content {
  background: #455a64;
  color: #eceff1;
}

body.dark-mode .search-modal-header {
  border-color: #546e7a;
}

body.dark-mode .search-modal-header h3 {
  color: #eceff1;
}

body.dark-mode .search-row input[type="text"] {
  background: #546e7a;
  color: #eceff1;
  border-color: #708090;
}

body.dark-mode .search-row button {
  background: #546e7a;
  color: #eceff1;
  border-color: #708090;
}

body.dark-mode .search-row button:hover {
  background: #37474f;
}
`;

// Add CSS to document
const searchStyleSheet = document.createElement('style');
searchStyleSheet.textContent = searchModalCSS;
document.head.appendChild(searchStyleSheet);

window.SearchReplace = SearchReplace;