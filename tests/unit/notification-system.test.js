/**
 * @file notification-system.test.js
 * @description Tests for the notification system
 */

// Mock DOM methods
Object.defineProperty(global, 'requestAnimationFrame', {
  value: (callback) => setTimeout(callback, 16),
  writable: true
});

describe('NotificationSystem', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Import and execute the notification system script
    const fs = require('fs');
    const path = require('path');
    const notificationSystemCode = fs.readFileSync(
      path.join(__dirname, '../../js/notification-system.js'), 
      'utf8'
    );
    
    // Execute the code in current context to set up global functions
    eval(notificationSystemCode);
  });

  afterEach(() => {
    // Clean up after each test
    if (global.notificationSystem) {
      global.notificationSystem.clearAll();
    }
  });

  describe('Basic functionality', () => {
    test('should create notification container', () => {
      expect(document.getElementById('notification-container')).toBeTruthy();
    });

    test('should show a notification through global function', () => {
      expect(typeof global.showNotification).toBe('function');
      const id = global.showNotification('Test message', 'info');
      expect(id).toBeTruthy();
      expect(global.notificationSystem.activeNotifications.length).toBe(1);
    });

    test('should support different notification types', () => {
      global.notificationSystem.success('Success message');
      global.notificationSystem.error('Error message');
      global.notificationSystem.warning('Warning message');
      global.notificationSystem.info('Info message');
      
      expect(global.notificationSystem.activeNotifications.length).toBe(4);
    });

    test('should clear all notifications', () => {
      global.showNotification('Test 1', 'info');
      global.showNotification('Test 2', 'info');
      expect(global.notificationSystem.activeNotifications.length).toBe(2);
      
      global.notificationSystem.clearAll();
      expect(global.notificationSystem.activeNotifications.length).toBe(0);
    });
  });

  describe('Performance features', () => {
    test('should manage queue when max notifications exceeded', async () => {
      // Set low max for testing
      global.notificationSystem.maxNotifications = 2;
      
      // Add 3 notifications
      global.notificationSystem.show('Test 1', 'info');
      global.notificationSystem.show('Test 2', 'info');
      global.notificationSystem.show('Test 3', 'info');
      
      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Should have at most 2 notifications due to queue management
      expect(global.notificationSystem.activeNotifications.length).toBeLessThanOrEqual(2);
    });

    test('should generate unique IDs', () => {
      const id1 = global.notificationSystem.generateId();
      const id2 = global.notificationSystem.generateId();
      expect(id1).not.toBe(id2);
    });

    test('should get correct icons for types', () => {
      expect(global.notificationSystem.getIcon('success')).toBe('✅');
      expect(global.notificationSystem.getIcon('error')).toBe('❌');
      expect(global.notificationSystem.getIcon('warning')).toBe('⚠️');
      expect(global.notificationSystem.getIcon('info')).toBe('ℹ️');
      expect(global.notificationSystem.getIcon('unknown')).toBe('ℹ️'); // fallback
    });
  });

  describe('Global functions', () => {
    test('should work with global showNotification', () => {
      expect(typeof global.showNotification).toBe('function');
      const id = global.showNotification('Global test');
      expect(id).toBeTruthy();
    });

    test('should work with global showUserNotification', () => {
      expect(typeof global.showUserNotification).toBe('function');
      const id = global.showUserNotification('User test');
      expect(id).toBeTruthy();
    });
  });
});