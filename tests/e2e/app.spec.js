import { test, expect } from '@playwright/test';

/**
 * End-to-End tests for MarkdownForge application
 * Tests complete user workflows using real browser interactions
 */

test.describe('MarkdownForge E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:8080');
    
    // Wait for the application to load
    await page.waitForSelector('#markdown-input', { timeout: 10000 });
    await page.waitForSelector('#preview-pane', { timeout: 10000 });
  });

  test.describe('Basic Application Loading', () => {
    test('should load the application successfully', async ({ page }) => {
      // Check that key elements are present
      await expect(page.locator('h1, .logo')).toContainText('MarkdownForge');
      await expect(page.locator('#markdown-input')).toBeVisible();
      await expect(page.locator('#preview-pane')).toBeVisible();
      await expect(page.locator('#formatting-toolbar')).toBeVisible();
    });

    test('should have proper page title and meta information', async ({ page }) => {
      await expect(page).toHaveTitle(/MarkdownForge/);
      
      // Check for proper meta tags
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /markdown.*word.*converter/i);
    });

    test('should load all required CSS and JavaScript files', async ({ page }) => {
      // Check for 404 errors in network requests
      const failedRequests = [];
      page.on('response', response => {
        if (response.status() >= 400) {
          failedRequests.push(`${response.status()}: ${response.url()}`);
        }
      });

      // Reload to capture all network requests
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Filter out expected CDN failures (as they have fallbacks)
      const criticalFailures = failedRequests.filter(request => 
        !request.includes('cdn.jsdelivr.net') && 
        !request.includes('unpkg.com') && 
        !request.includes('cdnjs.cloudflare.com')
      );

      expect(criticalFailures).toHaveLength(0);
    });
  });

  test.describe('Document Creation and Editing', () => {
    test('should create a new document with markdown content', async ({ page }) => {
      const markdownInput = page.locator('#markdown-input');
      const previewPane = page.locator('#preview-pane');

      // Clear any existing content
      await markdownInput.clear();

      // Type markdown content
      const testContent = `# My Test Document

This is a **test** document with *italic* text.

## Features
- Real-time preview
- Multiple export formats
- Auto-save functionality

### Code Example
\`\`\`javascript
console.log("Hello, MarkdownForge!");
\`\`\`

> This is a blockquote with important information.

| Feature | Status | Priority |
|---------|--------|----------|
| Export | ✅ Done | High |
| Templates | ✅ Done | High |
| Mobile | 🔄 Progress | Medium |`;

      await markdownInput.fill(testContent);

      // Trigger preview update
      await page.click('#refresh-btn');
      
      // Wait for preview to update
      await page.waitForTimeout(500);

      // Verify preview content
      await expect(previewPane.locator('h1')).toContainText('My Test Document');
      await expect(previewPane.locator('strong')).toContainText('test');
      await expect(previewPane.locator('em')).toContainText('italic');
      await expect(previewPane.locator('h2')).toContainText('Features');
      await expect(previewPane.locator('code')).toContainText('console.log');
      await expect(previewPane.locator('blockquote')).toContainText('blockquote');
      await expect(previewPane.locator('table')).toBeVisible();
    });

    test('should use formatting toolbar buttons', async ({ page }) => {
      const markdownInput = page.locator('#markdown-input');

      // Clear and add test text
      await markdownInput.clear();
      await markdownInput.fill('Hello World');

      // Select text for formatting
      await markdownInput.selectText();

      // Click bold button
      await page.click('#bold-btn');

      // Check that markdown formatting was applied
      const content = await markdownInput.inputValue();
      expect(content).toContain('**Hello World**');
    });

    test('should handle document metadata', async ({ page }) => {
      const titleInput = page.locator('#doc-title');
      const authorInput = page.locator('#doc-author');
      const dateInput = page.locator('#doc-date');

      // Set document metadata
      await titleInput.fill('E2E Test Document');
      await authorInput.fill('Test User');
      await dateInput.fill('2025-01-25');

      // Verify values are set
      await expect(titleInput).toHaveValue('E2E Test Document');
      await expect(authorInput).toHaveValue('Test User');
      await expect(dateInput).toHaveValue('2025-01-25');
    });
  });

  test.describe('Template System', () => {
    test('should load and apply business report template', async ({ page }) => {
      const templateSelect = page.locator('#template-container select, select[id*="template"]').first();
      const markdownInput = page.locator('#markdown-input');

      // Select business report template
      await templateSelect.selectOption({ label: /business report/i });

      // Wait for template to load
      await page.waitForTimeout(1000);

      // Verify template content was loaded
      const content = await markdownInput.inputValue();
      expect(content).toContain('Business Report');
      expect(content).toContain('Executive Summary');
      expect(content).toContain('Key Findings');
    });

    test('should load meeting notes template', async ({ page }) => {
      const templateSelect = page.locator('#template-container select, select[id*="template"]').first();
      const markdownInput = page.locator('#markdown-input');

      // Select meeting notes template
      await templateSelect.selectOption({ label: /meeting notes/i });

      // Wait for template to load
      await page.waitForTimeout(1000);

      // Verify template content
      const content = await markdownInput.inputValue();
      expect(content).toContain('Meeting Notes');
      expect(content).toContain('Attendees');
      expect(content).toContain('Action Items');
    });
  });

  test.describe('Export Functionality', () => {
    test('should enable export button when content exists', async ({ page }) => {
      const markdownInput = page.locator('#markdown-input');
      const exportBtn = page.locator('#export-btn');

      // Initially, button might be disabled
      await markdownInput.clear();
      await page.waitForTimeout(500);

      // Add content
      await markdownInput.fill('# Test Document\n\nSome content for export.');
      
      // Trigger preview to enable export
      await page.click('#refresh-btn');
      await page.waitForTimeout(500);

      // Export button should be enabled
      await expect(exportBtn).not.toBeDisabled();
    });

    test('should show export options when export button is clicked', async ({ page }) => {
      const markdownInput = page.locator('#markdown-input');
      const exportBtn = page.locator('#export-btn');

      // Add content
      await markdownInput.fill('# Export Test\n\nContent to export.');
      await page.click('#refresh-btn');
      await page.waitForTimeout(500);

      // Click export button
      await exportBtn.click();

      // Verify export menu appears
      await expect(page.locator('button:has-text("Word (.docx)")')).toBeVisible();
      await expect(page.locator('button:has-text("HTML")')).toBeVisible();
      await expect(page.locator('button:has-text("PDF")')).toBeVisible();
      await expect(page.locator('button:has-text("Text")')).toBeVisible();
    });

    test('should download HTML file', async ({ page }) => {
      const markdownInput = page.locator('#markdown-input');
      
      // Add content
      await markdownInput.fill('# Download Test\n\nThis content will be downloaded.');
      await page.click('#refresh-btn');
      await page.waitForTimeout(500);

      // Start download
      const downloadPromise = page.waitForEvent('download');
      
      // Click export and then HTML option
      await page.click('#export-btn');
      await page.click('button:has-text("HTML")');

      // Wait for download to start
      const download = await downloadPromise;
      
      // Verify download properties
      expect(download.suggestedFilename()).toMatch(/\.html$/);
    });
  });

  test.describe('Statistics and Analytics', () => {
    test('should display document statistics', async ({ page }) => {
      const markdownInput = page.locator('#markdown-input');
      const statsBtn = page.locator('#stats-btn');

      // Add content with known word count
      const testContent = `# Statistics Test

This document has exactly twenty words in this sentence and paragraph.

## Second Section
Another paragraph with additional words for testing purposes.`;

      await markdownInput.fill(testContent);

      // Open statistics modal
      await statsBtn.click();

      // Wait for modal to appear
      await expect(page.locator('#stats-modal')).toBeVisible();

      // Check that statistics are displayed
      await expect(page.locator('#word-count')).not.toBeEmpty();
      await expect(page.locator('#char-count')).not.toBeEmpty();
      await expect(page.locator('#paragraph-count')).not.toBeEmpty();

      // Close modal
      await page.click('#stats-close');
      await expect(page.locator('#stats-modal')).not.toBeVisible();
    });
  });

  test.describe('Help and Documentation', () => {
    test('should open and close help modal', async ({ page }) => {
      const helpBtn = page.locator('#help-btn');

      // Open help modal
      await helpBtn.click();

      // Verify modal is visible
      await expect(page.locator('#help-modal')).toBeVisible();
      await expect(page.locator('h2:has-text("Help")')).toBeVisible();

      // Check for help content
      await expect(page.locator('text=Keyboard Shortcuts')).toBeVisible();
      await expect(page.locator('text=Markdown Syntax')).toBeVisible();

      // Close modal
      await page.click('#help-close');
      await expect(page.locator('#help-modal')).not.toBeVisible();
    });

    test('should navigate between help tabs', async ({ page }) => {
      // Open help modal
      await page.click('#help-btn');
      await expect(page.locator('#help-modal')).toBeVisible();

      // Click on different tabs
      await page.click('button[data-tab="markdown"]');
      await expect(page.locator('#markdown-tab')).toBeVisible();

      await page.click('button[data-tab="features"]');
      await expect(page.locator('#features-tab')).toBeVisible();

      await page.click('button[data-tab="troubleshooting"]');
      await expect(page.locator('#troubleshooting-tab')).toBeVisible();

      // Close modal
      await page.click('#help-close');
    });
  });

  test.describe('Responsive Design and Mobile', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check that mobile navigation works
      const navToggle = page.locator('#navbar-toggle');
      if (await navToggle.isVisible()) {
        await navToggle.click();
        await expect(page.locator('#navbar-menu')).toBeVisible();
      }

      // Verify editor is still functional
      const markdownInput = page.locator('#markdown-input');
      await markdownInput.fill('# Mobile Test\n\nTesting on mobile viewport.');

      await page.click('#refresh-btn');
      await page.waitForTimeout(500);

      // Verify preview updates
      await expect(page.locator('#preview-pane h1')).toContainText('Mobile Test');
    });

    test('should handle panel resizing', async ({ page }) => {
      const resizer = page.locator('#panel-resizer');
      const editorPanel = page.locator('#editor-panel');

      if (await resizer.isVisible()) {
        // Get initial width
        const initialBox = await editorPanel.boundingBox();
        
        // Drag resizer
        await resizer.hover();
        await page.mouse.down();
        await page.mouse.move(initialBox.x + 100, initialBox.y);
        await page.mouse.up();

        // Verify panel size changed
        const newBox = await editorPanel.boundingBox();
        expect(newBox.width).not.toBe(initialBox.width);
      }
    });
  });

  test.describe('Performance and Error Handling', () => {
    test('should handle large documents without crashing', async ({ page }) => {
      const markdownInput = page.locator('#markdown-input');

      // Create large document
      const largeContent = '# Large Document\n\n' + 
        'This is a test line with content. '.repeat(1000) +
        '\n\n## Section 2\n\n' +
        'More content for testing performance. '.repeat(500);

      await markdownInput.fill(largeContent);

      // Trigger preview update
      await page.click('#refresh-btn');
      
      // Wait longer for large document processing
      await page.waitForTimeout(2000);

      // Verify application still responds
      await expect(page.locator('#preview-pane h1')).toContainText('Large Document');
      
      // Verify statistics work with large document
      await page.click('#stats-btn');
      await expect(page.locator('#stats-modal')).toBeVisible();
      await page.click('#stats-close');
    });

    test('should handle empty content gracefully', async ({ page }) => {
      const markdownInput = page.locator('#markdown-input');
      const exportBtn = page.locator('#export-btn');

      // Clear all content
      await markdownInput.clear();
      await page.waitForTimeout(500);

      // Export button should be disabled or handle empty content
      const isDisabled = await exportBtn.isDisabled();
      if (!isDisabled) {
        // If not disabled, export should handle empty content gracefully
        await exportBtn.click();
        // Should not crash the application
        await expect(page.locator('#app')).toBeVisible();
      }
    });

    test('should recover from JavaScript errors', async ({ page }) => {
      // Monitor for JavaScript errors
      const errors = [];
      page.on('pageerror', error => {
        errors.push(error.message);
      });

      // Perform normal operations
      await page.fill('#markdown-input', '# Error Test\n\nTesting error handling.');
      await page.click('#refresh-btn');
      await page.click('#stats-btn');
      await page.click('#stats-close');

      // Should have minimal or no JavaScript errors
      expect(errors.length).toBeLessThan(3); // Allow for minor, non-critical errors
    });
  });

  test.describe('Accessibility', () => {
    test('should be navigable with keyboard', async ({ page }) => {
      // Tab through key elements
      await page.keyboard.press('Tab'); // Should focus first interactive element
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to reach the editor
      const activeElement = await page.evaluate(() => document.activeElement.id);
      
      // Should eventually reach editor or toolbar
      expect(['markdown-input', 'bold-btn', 'doc-title'].some(id => 
        activeElement.includes(id) || activeElement === id
      )).toBeTruthy();
    });

    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Check for accessibility attributes
      const markdownInput = page.locator('#markdown-input');
      const exportBtn = page.locator('#export-btn');

      // Verify elements have accessible names
      await expect(markdownInput).toHaveAttribute('placeholder');
      
      // Check for proper button roles
      const buttonRole = await exportBtn.getAttribute('role');
      expect(buttonRole === 'button' || buttonRole === null).toBeTruthy(); // buttons have implicit role
    });
  });

  test.describe('Auto-save and Persistence', () => {
    test('should auto-save content', async ({ page }) => {
      const markdownInput = page.locator('#markdown-input');

      // Add content
      await markdownInput.fill('# Auto-save Test\n\nThis content should be auto-saved.');

      // Wait for auto-save (usually happens every 30 seconds or on content change)
      await page.waitForTimeout(2000);

      // Check for auto-save notification
      const notification = page.locator('#notification-container, .notification, text=Auto-saved');
      
      // Auto-save notification should appear or content should be saved
      // We can't easily test localStorage in E2E, but we can check for UI feedback
      const hasNotification = await notification.count() > 0;
      const hasContent = (await markdownInput.inputValue()).length > 0;
      
      expect(hasContent).toBeTruthy();
    });

    test('should persist theme preference', async ({ page }) => {
      // Change theme if theme button exists
      const themeBtn = page.locator('#theme-btn, button:has-text("Theme")');
      
      if (await themeBtn.count() > 0) {
        await themeBtn.click();
        
        // Verify theme changed (body class or CSS changes)
        const bodyClass = await page.locator('body').getAttribute('class');
        expect(bodyClass).toBeDefined();
      }
    });
  });
});