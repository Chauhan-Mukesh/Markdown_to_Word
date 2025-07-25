/**
 * Jest setup file for MarkdownForge tests
 * Configures DOM environment and global test utilities
 */

// Mock DOM APIs that aren't available in jsdom
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock file API
global.File = class File {
  constructor(parts, filename, properties) {
    this.name = filename;
    this.size = parts.reduce((acc, part) => acc + part.length, 0);
    this.type = properties?.type || '';
    this.lastModified = Date.now();
  }
};

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};
global.localStorage = localStorageMock;

// Mock showdown library
global.showdown = {
  Converter: jest.fn().mockImplementation(() => ({
    makeHtml: jest.fn(text => `<p>${text}</p>`),
    setFlavor: jest.fn(),
    setOption: jest.fn()
  }))
};

// Mock htmlDocx library
global.htmlDocx = {
  asBlob: jest.fn(() => new Blob(['mock docx content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }))
};

// Mock highlight.js
global.hljs = {
  highlightAuto: jest.fn(code => ({ value: code })),
  configure: jest.fn()
};

// Setup console warnings for common issues
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is deprecated')
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};

// Helper function to create DOM elements for testing
global.createMockElement = (tag, attributes = {}) => {
  const element = document.createElement(tag);
  Object.keys(attributes).forEach(key => {
    if (key === 'textContent') {
      element.textContent = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });
  return element;
};

// Helper function to simulate events
global.simulateEvent = (element, eventType, eventProperties = {}) => {
  const event = new Event(eventType, { bubbles: true, cancelable: true });
  Object.keys(eventProperties).forEach(key => {
    event[key] = eventProperties[key];
  });
  element.dispatchEvent(event);
  return event;
};

// Helper to wait for async operations
global.waitFor = (condition, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 10);
      }
    };
    check();
  });
};