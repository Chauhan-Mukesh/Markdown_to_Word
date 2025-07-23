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
   * Show notification
   * @param {string} message - The message to display
   * @param {string} type - Type of notification: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in milliseconds (0 for persistent)
   */
  show(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Create notification content
    const icon = this.getIcon(type);
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
      </div>
    `;

    // Add to container
    this.container.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add('notification-show');
    }, 10);

    // Auto remove if duration is set
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }

    return notification;
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
    if (this.container) {
      this.container.innerHTML = '';
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