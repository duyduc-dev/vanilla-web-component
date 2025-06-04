import './components/app-link.js';

class AppRouter {
  /**
   * @param {string} rootElementId - The id of the root element
   * @param {Array} routes - An object mapping route names to template functions
   */
  constructor(rootElementId = 'app', routes = []) {
    this.rootElement = document.getElementById(rootElementId);

    if (!this.rootElement) {
      console.error(`Root element with id "${rootElementId}" not found`);
      return;
    }

    this.routes = new Map(
      routes.map((route) => [safeRoute(route.path), route])
    );

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

    // Initial navigation
    this.handleNavigation();
  }

  /**
   * Navigate to a specific route
   * @param {string} routeName
   */
  navigate(routeName) {
    window.location.hash = `#/${safeRoute(routeName)}`;
  }

  /**
   * Handle hash navigation events
   */
  handleNavigation() {
    const path = safeRoute(window.location.hash);
    let routeName = path;
    this.renderRoute(routeName);
  }

  /**
   * Render a specific route
   * @param {string} routeName
   */
  renderRoute(routeName) {
    if (routeName && !this.routes.has(safeRoute(routeName))) {
      console.warn(`Route "${routeName}" not found`);
      this.rootElement.innerHTML =
        this.routes.get('*')?.template() || `<h1>404 - Not Found</h1>`;
      return;
    }
    console.log('Current route', this.routes.get(routeName));
    this.currentRoute = routeName;
    this.rootElement.innerHTML = this.routes
      .get(`${safeRoute(routeName)}` || '/')
      ?.template();
  }
}

function safeRoute(params = '') {
  const path = params
    .replace(/^#\/?/, '')
    .replace(/\/$/, '')
    .replace(/^\//, '')
    .replace(/\/\//g, '/');
  return path || '/';
}

export default AppRouter;
