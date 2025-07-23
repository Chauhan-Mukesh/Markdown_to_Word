/**
 * @file navbar.js
 * @description Enhanced navbar functionality for mobile hamburger menu and responsive behavior
 * @version 2.1.0
 * @author Markdown to Word Exporter Team
 * @license MIT
 * 
 * @overview
 * Handles responsive navigation behavior including:
 * - Mobile hamburger menu with smooth animations
 * - Dropdown menu management for mobile/desktop
 * - Responsive design patterns
 * - Accessibility features (ARIA attributes, keyboard navigation)
 * - Smooth transitions and modern UX patterns
 */

/**
 * Navbar class for managing responsive navigation behavior
 * @class
 * @description Manages all navbar interactions including mobile menu, dropdowns, and responsive behavior
 * @since 2.1.0
 */

class Navbar {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navbarToggle = document.getElementById('navbar-toggle');
    this.navbarMenu = document.getElementById('navbar-menu');
    this.dropdowns = document.querySelectorAll('.dropdown');
    
    this.init();
  }
  
  init() {
    this.setupMobileToggle();
    this.setupDropdowns();
    this.setupResponsiveBehavior();
    this.setCurrentYear();
  }
  
  setupMobileToggle() {
    if (!this.navbarToggle || !this.navbarMenu) return;
    
    this.navbarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMobileMenu();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Close mobile menu when pressing escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    const isActive = this.navbarMenu.classList.contains('active');
    
    if (isActive) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.navbarMenu.classList.add('active');
    this.navbarToggle.classList.add('active');
    this.navbarToggle.setAttribute('aria-expanded', 'true');
    
    // Add smooth animation
    setTimeout(() => {
      this.navbarMenu.style.transform = 'translateY(0)';
    }, 10);
  }
  
  closeMobileMenu() {
    this.navbarMenu.classList.remove('active');
    this.navbarToggle.classList.remove('active');
    this.navbarToggle.setAttribute('aria-expanded', 'false');
  }
  
  setupDropdowns() {
    this.dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (!toggle || !menu) return;
      
      // Handle click to toggle dropdown
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns
        this.dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
            const otherMenu = otherDropdown.querySelector('.dropdown-menu');
            if (otherMenu) {
              otherMenu.classList.remove('mobile-active');
            }
          }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
        if (window.innerWidth <= 768) {
          menu.classList.toggle('mobile-active');
        }
      });
      
      // Close dropdown when clicking menu items
      const items = menu.querySelectorAll('.dropdown-item');
      items.forEach(item => {
        item.addEventListener('click', () => {
          dropdown.classList.remove('active');
          menu.classList.remove('mobile-active');
          if (window.innerWidth <= 768) {
            this.closeMobileMenu();
          }
        });
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      this.dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('active');
          const menu = dropdown.querySelector('.dropdown-menu');
          if (menu) {
            menu.classList.remove('mobile-active');
          }
        }
      });
    });
  }
  
  setupResponsiveBehavior() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
        // Close all mobile dropdowns
        this.dropdowns.forEach(dropdown => {
          const menu = dropdown.querySelector('.dropdown-menu');
          if (menu) {
            menu.classList.remove('mobile-active');
          }
        });
      }
    });
  }
  
  setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }
  
  // Animation helpers
  addSmoothTransitions() {
    // Add smooth transitions for all interactive elements
    const style = document.createElement('style');
    style.textContent = `
      .navbar-menu.active {
        animation: slideDown 0.3s ease-out;
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .dropdown-menu.mobile-active {
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
        animation: fadeIn 0.2s ease-out;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .hamburger-line {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .navbar-btn, .dropdown-toggle, .footer-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .navbar-btn:hover, .dropdown-toggle:hover, .footer-btn:hover {
        transform: translateY(-1px);
      }
      
      .navbar-btn:active, .dropdown-toggle:active, .footer-btn:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const navbar = new Navbar();
  navbar.addSmoothTransitions();
  
  // Make navbar instance globally available if needed
  window.navbar = navbar;
});

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navbar;
}