/**
 * Main JavaScript file
 * Imports and registers all custom elements and provides a simple router
 */

// Import components
import './components/containers/app-container.js';
import { memoize } from './utils/index.js';
import { routes } from './routes.js';
// Import base classes and utilities

// Register custom elements

/**
 * AppRouter class
 * Simple router for single page application with web components
 */
class AppRouter {
  /**
   * @param {string} rootElementId - The id of the root element
   * @param {Object} routes - An object mapping route names to template functions
   */
  constructor(rootElementId = 'app', routes = {}) {
    this.rootElement = document.getElementById(rootElementId);

    if (!this.rootElement) {
      console.error(`Root element with id "${rootElementId}" not found`);
      return;
    }

    this.routes = { ...routes };
    this.currentRoute = null;

    // Bind methods
    this.navigate = this.navigate.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);

    // Initialize the router
    this.init();
  }

  /**
   * Initialize the router
   */
  init() {
    // Listen for hash changes
    window.addEventListener('hashchange', this.handleNavigation);

    // Delegate link clicks for navigation
    document.body.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.hasAttribute('data-route')) {
        e.preventDefault();
        const route = e.target.getAttribute('href').replace(/^#\/?/, '');
        this.navigate(route);
      }
    });

    // Initial navigation
    this.handleNavigation();
  }

  /**
   * Navigate to a specific route
   * @param {string} routeName
   */
  navigate(routeName) {
    window.location.hash = `#/${routeName === 'home' ? '' : routeName}`;
  }

  /**
   * Handle hash navigation events
   */
  handleNavigation() {
    const path = window.location.hash.replace(/^#\/?/, '');
    let routeName = path || 'home';
    if (!this.routes[routeName]) {
      routeName = 'home';
      window.location.hash = '#/';
    }
    this.renderRoute(routeName);
  }

  /**
   * Render a specific route
   * @param {string} routeName
   */
  renderRoute(routeName) {
    if (!this.routes[routeName]) {
      console.error(`Route "${routeName}" not found`);
      return;
    }

    this.currentRoute = routeName;
    this.rootElement.innerHTML = '';

    // Content
    const contentContainer = document.createElement('div');
    contentContainer.className = 'app-content';
    contentContainer.innerHTML = memoize(() => this.routes[routeName]())();
    this.rootElement.appendChild(contentContainer);
  }

  initializeCounter(container) {
    const addButton = container.querySelector('#add-counter');
    if (addButton) {
      addButton.addEventListener('click', () => {
        const countersContainer = container.querySelector(
          '#counters-container',
        );
        const counter = document.createElement('button-counter');
        counter.setAttribute(
          'label',
          `Counter ${countersContainer.children.length + 1}`,
        );
        countersContainer.appendChild(counter);
      });
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('Web Components application initialized');
  window.appRouter = new AppRouter('app', routes);
});
