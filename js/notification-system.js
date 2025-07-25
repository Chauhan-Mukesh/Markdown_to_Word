/**
 * @file notification-system.js
 * @description Advanced notification system for enhanced user experience
 * @version 2.1.0
 * @author Markdown to Word Exporter Team
 * @license MIT
 * 
 * @overview
 * Provides a modern, non-intrusive notification system that replaces
 * browser's native alert dialogs with beautiful, customizable toast notifications.
 * Features include:
 * - Multiple notification types (success, error, warning, info)
 * - Configurable duration and auto-dismiss
 * - Smooth animations and transitions
 * - Queue management for multiple notifications
 * - Mobile-responsive design
 * - Accessibility support with proper ARIA attributes
 */

/**
 * Custom notification system class
 * @class
 * @description Manages toast notifications with queue support and animations
 * @since 2.1.0
 */
class NotificationSystem {
  /**
   * Constructor for NotificationSystem
   * @description Initializes the notification system and creates the container
   * @since 2.1.0
   */
  constructor() {
    /** @type {?HTMLElement} Container element for notifications */
    this.container = null;
    
    /** @type {Array} Queue of active notifications */
    this.activeNotifications = [];
    
    /** @type {number} Maximum number of simultaneous notifications */
    this.maxNotifications = 5;
    
    /** @type {Object} Default configuration options */
    this.defaults = {
      duration: 4000,
      position: 'top-right',
      closable: true,
      pauseOnHover: true
    };
    
    this.createContainer();
  }

  /**
   * Create notification container with proper positioning
   * @description Creates and configures the main container for notifications
   * @since 2.1.0
   * @private
   */
  createContainer() {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
    }
  }

  /**
   * Show notification with enhanced options
   * @param {string|Object} messageOrOptions - The message to display or options object
   * @param {string} type - Type of notification: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in milliseconds (0 for persistent)
   */
  show(messageOrOptions, type = 'info', duration = 4000) {
    let options;
    
    // Handle both old and new API
    if (typeof messageOrOptions === 'string') {
      options = {
        message: messageOrOptions,
        type: type,
        timeout: duration
      };
    } else {
      options = messageOrOptions;
    }

    // Apply defaults
    const config = {
      type: 'info',
      timeout: 4000,
      persistent: false,
      closable: true,
      actions: [],
      ...options
    };

    const notification = document.createElement('div');
    const notificationId = this.generateId();
    notification.className = `notification notification-${config.type}`;
    notification.setAttribute('data-notification-id', notificationId);
    
    // Create notification content
    const icon = this.getIcon(config.type);
    const actionsHtml = this.createActionsHtml(config.actions);
    
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-header">
          <span class="notification-icon">${icon}</span>
          ${config.title ? `<span class="notification-title">${config.title}</span>` : ''}
          ${config.closable ? '<button class="notification-close" onclick="window.notificationSystem.removeById(\'' + notificationId + '\')" aria-label="Close notification">&times;</button>' : ''}
        </div>
        <div class="notification-body">
          <span class="notification-message">${config.message}</span>
          ${actionsHtml}
        </div>
      </div>
    `;

    // Add accessibility attributes
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    // Add to container and track
    this.container.appendChild(notification);
    this.activeNotifications.push({
      id: notificationId,
      element: notification,
      config: config
    });

    // Manage queue
    this.manageQueue();

    // Animate in
    setTimeout(() => {
      notification.classList.add('notification-show');
    }, 10);

    // Auto remove if not persistent
    if (!config.persistent && config.timeout > 0) {
      setTimeout(() => {
        this.removeById(notificationId);
      }, config.timeout);
    }

    // Add event listeners
    if (config.onClick) {
      notification.addEventListener('click', config.onClick);
    }

    // Pause on hover if enabled
    if (config.pauseOnHover !== false) {
      this.addHoverPause(notification, notificationId, config);
    }

    return notificationId;
  }

  /**
   * Remove notification by ID
   */
  removeById(notificationId) {
    const notificationData = this.activeNotifications.find(n => n.id === notificationId);
    if (notificationData) {
      this.remove(notificationData.element);
      this.activeNotifications = this.activeNotifications.filter(n => n.id !== notificationId);
      
      // Call onClose callback if provided
      if (notificationData.config.onClose) {
        notificationData.config.onClose();
      }
    }
  }

  /**
   * Remove notification with animation
   */
  remove(notification) {
    if (notification && notification.parentElement) {
      notification.classList.remove('notification-show');
      notification.classList.add('notification-hide');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.parentElement.removeChild(notification);
        }
      }, 300);
    }
  }

  /**
   * Generate unique notification ID
   */
  generateId() {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create HTML for action buttons
   */
  createActionsHtml(actions) {
    if (!actions || actions.length === 0) return '';
    
    let html = '<div class="notification-actions">';
    actions.forEach(action => {
      html += `<button class="notification-action-btn" onclick="(${action.action.toString()})()">${action.text}</button>`;
    });
    html += '</div>';
    return html;
  }

  /**
   * Manage notification queue
   */
  manageQueue() {
    if (this.activeNotifications.length > this.maxNotifications) {
      const oldestNotification = this.activeNotifications.shift();
      this.remove(oldestNotification.element);
    }
  }

  /**
   * Add hover pause functionality
   */
  addHoverPause(notification, notificationId, config) {
    let timeoutId;
    let remainingTime = config.timeout;
    let startTime = Date.now();

    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (!config.persistent && remainingTime > 0) {
        timeoutId = setTimeout(() => {
          this.removeById(notificationId);
        }, remainingTime);
      }
    };

    notification.addEventListener('mouseenter', () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        remainingTime -= (Date.now() - startTime);
      }
    });

    notification.addEventListener('mouseleave', () => {
      startTime = Date.now();
      resetTimeout();
    });

    // Start initial timeout
    resetTimeout();
  }

  /**
   * Get icon for notification type
   */
  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  /**
   * Show success notification
   */
  success(message, duration = 4000) {
    return this.show(message, 'success', duration);
  }

  /**
   * Show error notification
   */
  error(message, duration = 6000) {
    return this.show(message, 'error', duration);
  }

  /**
   * Show warning notification
   */
  warning(message, duration = 5000) {
    return this.show(message, 'warning', duration);
  }

  /**
   * Show info notification
   */
  info(message, duration = 4000) {
    return this.show(message, 'info', duration);
  }

  /**
   * Clear all notifications
   */
  clearAll() {
    this.activeNotifications.forEach(notification => {
      if (notification.config.onClose) {
        notification.config.onClose();
      }
    });
    this.activeNotifications = [];
    
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Static method to show notification (enhanced API)
   * @param {Object} options - Notification configuration
   * @returns {string} Notification ID
   */
  static show(options) {
    if (!window.notificationSystem) {
      window.notificationSystem = new NotificationSystem();
    }
    return window.notificationSystem.show(options);
  }
}
}

// Create global notification system
window.notificationSystem = new NotificationSystem();

// Convenience functions for backward compatibility
window.showNotification = (message, type = 'info', duration = 4000) => {
  return window.notificationSystem.show(message, type, duration);
};

window.showUserNotification = (message, type = 'info') => {
  return window.notificationSystem.show(message, type);
};