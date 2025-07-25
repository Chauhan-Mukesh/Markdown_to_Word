/**
 * @file error-handler.js
 * @description Enhanced error handling and user feedback system for MarkdownForge
 * @version 1.0.0
 * @author MarkdownForge Team
 */

class ErrorHandler {
  constructor() {
    this.errorCount = 0;
    this.lastError = null;
    this.errorHistory = [];
    this.maxErrorHistory = 10;
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    
    this.setupGlobalErrorHandling();
    this.setupUnhandledPromiseRejection();
  }

  /**
   * Setup global error handling for uncaught errors
   */
  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      this.handleError(new Error(event.message), {
        type: 'javascript',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        severity: 'error'
      });
    });
  }

  /**
   * Setup handling for unhandled promise rejections
   */
  setupUnhandledPromiseRejection() {
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(new Error(event.reason), {
        type: 'promise',
        severity: 'error'
      });
      event.preventDefault(); // Prevent console error
    });
  }

  /**
   * Main error handling method
   * @param {Error} error - The error object
   * @param {Object} context - Additional context information
   */
  handleError(error, context = {}) {
    this.errorCount++;
    this.lastError = error;
    
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context: context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      id: this.generateErrorId()
    };

    // Add to error history
    this.addToHistory(errorInfo);

    // Determine severity and handle accordingly
    const severity = context.severity || this.determineSeverity(error);
    
    switch (severity) {
      case 'critical':
        this.handleCriticalError(errorInfo);
        break;
      case 'error':
        this.handleRegularError(errorInfo);
        break;
      case 'warning':
        this.handleWarning(errorInfo);
        break;
      default:
        this.handleInfo(errorInfo);
    }

    // Log for development
    if (this.isDevelopment()) {
      console.error('MarkdownForge Error:', errorInfo);
    }

    return errorInfo.id;
  }

  /**
   * Handle critical errors that break core functionality
   */
  handleCriticalError(errorInfo) {
    NotificationSystem.show({
      type: 'error',
      title: '🚨 Critical Error',
      message: 'A critical error occurred. The application may not function properly.',
      persistent: true,
      actions: [
        {
          text: 'Reload Page',
          action: () => window.location.reload()
        },
        {
          text: 'Report Issue',
          action: () => this.showErrorReportDialog(errorInfo)
        }
      ]
    });

    // Attempt graceful degradation
    this.attemptGracefulDegradation(errorInfo);
  }

  /**
   * Handle regular errors
   */
  handleRegularError(errorInfo) {
    let message = 'An error occurred while processing your request.';
    let actions = [];

    // Provide context-specific messages
    if (errorInfo.context.type === 'export') {
      message = 'Failed to export document. Please try again or try a different format.';
      actions.push({
        text: 'Retry Export',
        action: () => this.retryAction(errorInfo.context.retryFunction)
      });
    } else if (errorInfo.context.type === 'file-load') {
      message = 'Failed to load file. Please check the file format and try again.';
    } else if (errorInfo.context.type === 'save') {
      message = 'Failed to save document. Your changes may be lost.';
      actions.push({
        text: 'Retry Save',
        action: () => this.retryAction(errorInfo.context.retryFunction)
      });
    }

    NotificationSystem.show({
      type: 'error',
      title: '❌ Error',
      message: message,
      timeout: 8000,
      actions: actions
    });
  }

  /**
   * Handle warnings
   */
  handleWarning(errorInfo) {
    let message = errorInfo.message;
    
    // Context-specific warning messages
    if (errorInfo.context.type === 'storage-quota') {
      message = 'Storage quota exceeded. Auto-save may not work properly.';
    } else if (errorInfo.context.type === 'cdn-fallback') {
      message = 'Using fallback libraries. Some features may be limited.';
    }

    NotificationSystem.show({
      type: 'warning',
      title: '⚠️ Warning',
      message: message,
      timeout: 5000
    });
  }

  /**
   * Handle informational messages
   */
  handleInfo(errorInfo) {
    NotificationSystem.show({
      type: 'info',
      title: 'ℹ️ Information',
      message: errorInfo.message,
      timeout: 3000
    });
  }

  /**
   * Determine error severity based on error characteristics
   */
  determineSeverity(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'warning';
    }
    
    if (message.includes('quota') || message.includes('storage')) {
      return 'warning';
    }
    
    if (message.includes('syntax') || message.includes('parse')) {
      return 'error';
    }
    
    if (message.includes('cannot read') || message.includes('undefined')) {
      return 'critical';
    }
    
    return 'error';
  }

  /**
   * Retry an action with exponential backoff
   */
  async retryAction(actionFunction, actionId = null) {
    if (!actionFunction) return;

    const id = actionId || this.generateErrorId();
    const currentAttempts = this.retryAttempts.get(id) || 0;

    if (currentAttempts >= this.maxRetries) {
      NotificationSystem.show({
        type: 'error',
        title: 'Max Retries Exceeded',
        message: 'Unable to complete action after multiple attempts.',
        timeout: 5000
      });
      return;
    }

    try {
      // Show retry notification
      NotificationSystem.show({
        type: 'info',
        title: 'Retrying...',
        message: `Attempt ${currentAttempts + 1} of ${this.maxRetries}`,
        timeout: 2000
      });

      // Exponential backoff
      const delay = Math.pow(2, currentAttempts) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      this.retryAttempts.set(id, currentAttempts + 1);
      await actionFunction();
      
      // Success - clear retry count
      this.retryAttempts.delete(id);
      
      NotificationSystem.show({
        type: 'success',
        title: '✅ Success',
        message: 'Action completed successfully.',
        timeout: 3000
      });

    } catch (error) {
      this.handleError(error, { 
        type: 'retry', 
        originalAction: actionId,
        attempt: currentAttempts + 1 
      });
    }
  }

  /**
   * Attempt graceful degradation for critical errors
   */
  attemptGracefulDegradation(errorInfo) {
    try {
      // Disable problematic features
      if (errorInfo.context.component === 'preview') {
        document.getElementById('preview-panel')?.classList.add('disabled');
        NotificationSystem.show({
          type: 'warning',
          title: 'Preview Disabled',
          message: 'Live preview temporarily disabled due to errors.',
          timeout: 5000
        });
      }
      
      if (errorInfo.context.component === 'export') {
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
          exportBtn.disabled = true;
          exportBtn.title = 'Export temporarily unavailable';
        }
      }
      
      // Enable safe mode
      this.enableSafeMode();
      
    } catch (degradationError) {
      console.error('Failed to perform graceful degradation:', degradationError);
    }
  }

  /**
   * Enable safe mode with limited functionality
   */
  enableSafeMode() {
    document.body.classList.add('safe-mode');
    
    NotificationSystem.show({
      type: 'warning',
      title: '🛡️ Safe Mode',
      message: 'Application is running in safe mode with limited features.',
      persistent: true,
      actions: [
        {
          text: 'Exit Safe Mode',
          action: () => this.exitSafeMode()
        }
      ]
    });
  }

  /**
   * Exit safe mode
   */
  exitSafeMode() {
    document.body.classList.remove('safe-mode');
    
    // Re-enable features
    document.getElementById('preview-panel')?.classList.remove('disabled');
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.title = '';
    }
    
    NotificationSystem.show({
      type: 'success',
      title: 'Safe Mode Disabled',
      message: 'All features have been re-enabled.',
      timeout: 3000
    });
  }

  /**
   * Show error report dialog
   */
  showErrorReportDialog(errorInfo) {
    const modal = document.createElement('div');
    modal.className = 'modal error-report-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>🐛 Report Error</h3>
        <p>Help us improve MarkdownForge by reporting this error.</p>
        
        <div class="error-details">
          <h4>Error Details:</h4>
          <pre>${JSON.stringify(errorInfo, null, 2)}</pre>
        </div>
        
        <div class="user-feedback">
          <h4>What were you doing when this error occurred?</h4>
          <textarea id="error-feedback" placeholder="Describe what you were doing..." rows="4"></textarea>
        </div>
        
        <div class="modal-actions">
          <button id="copy-error-info" class="btn btn-secondary">📋 Copy Error Info</button>
          <button id="cancel-report" class="btn btn-secondary">Cancel</button>
          <button id="submit-report" class="btn btn-primary">Submit Report</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Event listeners
    modal.querySelector('#copy-error-info').addEventListener('click', () => {
      const errorText = JSON.stringify(errorInfo, null, 2);
      navigator.clipboard.writeText(errorText).then(() => {
        NotificationSystem.show({
          type: 'success',
          title: 'Copied to Clipboard',
          message: 'Error information copied to clipboard.',
          timeout: 2000
        });
      });
    });
    
    modal.querySelector('#cancel-report').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#submit-report').addEventListener('click', () => {
      const feedback = modal.querySelector('#error-feedback').value;
      this.submitErrorReport(errorInfo, feedback);
      document.body.removeChild(modal);
    });
  }

  /**
   * Submit error report (placeholder for actual implementation)
   */
  submitErrorReport(errorInfo, userFeedback) {
    // In a real implementation, this would send to an error tracking service
    console.log('Error report submitted:', { errorInfo, userFeedback });
    
    NotificationSystem.show({
      type: 'success',
      title: 'Report Submitted',
      message: 'Thank you for reporting this error. We\'ll investigate it.',
      timeout: 5000
    });
  }

  /**
   * Add error to history
   */
  addToHistory(errorInfo) {
    this.errorHistory.unshift(errorInfo);
    if (this.errorHistory.length > this.maxErrorHistory) {
      this.errorHistory = this.errorHistory.slice(0, this.maxErrorHistory);
    }
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if running in development mode
   */
  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.protocol === 'file:';
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return {
      totalErrors: this.errorCount,
      lastError: this.lastError,
      errorHistory: this.errorHistory,
      activeRetries: this.retryAttempts.size
    };
  }

  /**
   * Clear error history
   */
  clearHistory() {
    this.errorHistory = [];
    this.errorCount = 0;
    this.lastError = null;
    this.retryAttempts.clear();
  }

  /**
   * Export error log for debugging
   */
  exportErrorLog() {
    const errorLog = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      stats: this.getErrorStats(),
      history: this.errorHistory
    };

    const blob = new Blob([JSON.stringify(errorLog, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `markdownforge-error-log-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
}

// Create global error handler instance
window.ErrorHandler = new ErrorHandler();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
}