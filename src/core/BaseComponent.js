/**
 * BaseComponent
 *
 * A base class for creating Web Components with enhanced functionality:
 * - Simplified lifecycle management
 * - State management with automatic rendering
 * - Attribute handling utilities
 * - Event binding with automatic cleanup
 * - Template rendering helpers
 *
 * @class BaseComponent
 * @extends {HTMLElement}
 */
export default class BaseComponent extends HTMLElement {
  /**
   * Create a new BaseComponent instance
   * @param {Object} options - Component options
   * @param {boolean} options.useShadow - Whether to use Shadow DOM (default: true)
   * @param {string} options.shadowMode - Shadow DOM mode (default: 'open')
   * @param {Object} options.initialState - Initial component state
   */
  constructor(options = {}) {
    super();

    // Configuration with defaults
    this._config = {
      useShadow: true,
      shadowMode: 'open',
      initialState: {},
      ...options,
    };

    // Initialize shadow DOM if configured
    if (this._config.useShadow) {
      this.attachShadow({ mode: this._config.shadowMode });
    }

    // Initialize state management
    this.state = { ...this._config.initialState };
    this._boundEvents = new Map();
    this._eventBindings = [];

    // Bind methods to this instance
    this._render = this._render.bind(this);
    this.setState = this.setState.bind(this);
    this.bindEvent = this.bindEvent.bind(this);
    this.declareEvent = this.declareEvent.bind(this);
    this._applyEventBindings = this._applyEventBindings.bind(this);
  }

  /**
   * List of observed attributes that trigger attributeChangedCallback
   * Override this in subclasses to watch specific attributes
   * @returns {string[]} Array of attribute names to observe
   */
  static get observedAttributes() {
    return [];
  }

  /**
   * Called when the element is inserted into the DOM
   * Sets up initial rendering and event listeners
   */
  connectedCallback() {
    // Set up event declarations if the component has a declareEvents method
    if (typeof this.declareEvents === 'function') {
      this.declareEvents();
    }

    // Perform initial render
    this._render();

    // Call user-defined connected hook if it exists
    if (typeof this.onConnected === 'function') {
      this.onConnected();
    }
  }

  /**
   * Called when the element is removed from the DOM
   * Cleans up event listeners and resources
   */
  disconnectedCallback() {
    // Clean up all bound events
    this._unbindAllEvents();

    // Call user-defined disconnected hook if it exists
    if (typeof this.onDisconnected === 'function') {
      this.onDisconnected();
    }
  }

  /**
   * Called when an observed attribute changes
   * @param {string} name - Name of the attribute
   * @param {string} oldValue - Previous attribute value
   * @param {string} newValue - New attribute value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      // Update internal state to match attribute
      this.state[name] = this._parseAttributeValue(newValue);

      // Call user-defined attribute changed hook if it exists
      if (typeof this.onAttributeChanged === 'function') {
        this.onAttributeChanged(name, oldValue, newValue);
      }

      // Re-render the component
      this._render();
    }
  }

  /**
   * Parse attribute values, converting string representations to appropriate types
   * @param {string} value - Attribute value to parse
   * @returns {any} Parsed value
   * @private
   */
  _parseAttributeValue(value) {
    if (value === null) return null;
    if (value === 'true' || value === '') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (value === 'undefined') return undefined;
    if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);

    // Try to parse as JSON if it looks like an object or array
    if (
      (value.startsWith('{') && value.endsWith('}')) ||
      (value.startsWith('[') && value.endsWith(']'))
    ) {
      try {
        return JSON.parse(value);
      } catch (e) {
        // If parsing fails, return the raw string
        return value;
      }
    }

    return value;
  }

  /**
   * Updates component state and triggers a re-render
   * @param {Object} newState - Object containing state updates
   * @param {boolean} shouldRender - Whether to re-render after state update (default: true)
   */
  setState(newState, shouldRender = true) {
    // Update state
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };

    // Re-render the component if needed
    if (shouldRender) {
      this._render();
    }

    // Call user-defined state changed hook if it exists
    if (typeof this.onStateChanged === 'function') {
      this.onStateChanged(prevState, this.state);
    }
  }



  /**
   * Get attribute value with type conversion
   * @param {string} name - Attribute name
   * @param {any} defaultValue - Default value if attribute doesn't exist
   * @returns {any} Parsed attribute value
   */
  getAttributeValue(name, defaultValue = null) {
    if (!this.hasAttribute(name)) return defaultValue;
    return this._parseAttributeValue(this.getAttribute(name));
  }

  getAttrs() {
    return this.attributes
      ? [...this.attributes].reduce((acc, attr) => {
          acc[attr.name] = this._parseAttributeValue(attr.value);
          return acc;
        }, {})
      : {};
  }

  /**
   * Set attribute with proper type serialization
   * @param {string} name - Attribute name
   * @param {any} value - Attribute value
   */
  setAttributeValue(name, value) {
    if (value === null || value === undefined) {
      this.removeAttribute(name);
    } else if (typeof value === 'boolean') {
      if (value) {
        this.setAttribute(name, '');
      } else {
        this.removeAttribute(name);
      }
    } else if (typeof value === 'object') {
      this.setAttribute(name, JSON.stringify(value));
    } else {
      this.setAttribute(name, value.toString());
    }
  }

  /**
   * Binds an event listener to an element with automatic cleanup
   * @param {Element} element - DOM element to bind event to
   * @param {string} eventName - Name of the event
   * @param {Function} handler - Event handler function
   * @param {Object} options - Event listener options
   * @returns {Function} Function to remove the event listener
   */
  bindEvent(element, eventName, handler, options = {}) {
    if (!element) return () => {};

    // Get a pre-bound handler if it exists, otherwise bind it
    let boundHandler;

    // Create a unique key for this event binding
    const bindingKey = this._getEventBindingKey(element, eventName, handler);

    // Check if we already have a bound version of this handler
    const existingBinding = [...this._boundEvents.values()].find(
      (binding) => binding.bindingKey === bindingKey
    );

    if (existingBinding) {
      boundHandler = existingBinding.handler;
    } else {
      boundHandler = handler.bind(this);
    }

    element.addEventListener(eventName, boundHandler, options);

    // Store for automatic cleanup
    const key = `${eventName}-${this._boundEvents.size}`;
    this._boundEvents.set(key, {
      element,
      eventName,
      handler: boundHandler,
      options,
      bindingKey,
    });

    // Return function to remove this specific event listener
    return () => {
      element.removeEventListener(eventName, boundHandler, options);
      this._boundEvents.delete(key);
    };
  }

  /**
   * Generate a unique key for an event binding
   * @param {Element} element - DOM element
   * @param {string} eventName - Event name
   * @param {Function} handler - Event handler
   * @returns {string} Unique key for this binding
   * @private
   */
  _getEventBindingKey(element, eventName, handler) {
    // Use handler's name or its string representation as part of the key
    const handlerKey = handler.name || handler.toString().slice(0, 20);
    return `${eventName}-${handlerKey}`;
  }

  /**
   * Unbind all event listeners
   * @private
   */
  _unbindAllEvents() {
    this._boundEvents.forEach(({ element, eventName, handler, options }) => {
      element.removeEventListener(eventName, handler, options);
    });
    this._boundEvents.clear();
  }

  /**
   * Declare a persistent event binding that will survive re-renders
   * @param {string} selector - CSS selector for the element
   * @param {string} eventName - Name of the event
   * @param {Function} handler - Event handler function
   * @param {Object} options - Event listener options
   * @returns {void}
   */
  declareEvent(selector, eventName, handler, options = {}) {
    this._eventBindings.push({
      selector,
      eventName,
      handler,
      options,
    });
  }

  /**
   * Apply all declared event bindings
   * @private
   */
  _applyEventBindings() {
    // Clear any existing event bindings first
    this._unbindAllEvents();

    // Apply all declared event bindings
    this._eventBindings.forEach(({ selector, eventName, handler, options }) => {
      const element = this.$(selector);
      if (element) {
        this.bindEvent(element, eventName, handler, options);
      }
    });
  }

  /**
   * Helper to query elements within component
   * @param {string} selector - CSS selector
   * @returns {Element|null} Found element or null
   */
  $(selector) {
    return this.shadowRoot
      ? this.shadowRoot.querySelector(selector)
      : this.querySelector(selector);
  }

  /**
   * Helper to query all elements within component
   * @param {string} selector - CSS selector
   * @returns {NodeList} List of found elements
   */
  $$(selector) {
    return this.shadowRoot
      ? [...this.shadowRoot.querySelectorAll(selector)]
      : [...this.querySelectorAll(selector)];
  }

  /**
   * Generates HTML template with component state
   * Override this in subclasses to define component template
   * @returns {string} HTML template string
   */
  template() {
    return '';
  }

  /**
   * Generates CSS styles for the component
   * Override this in subclasses to define component styles
   * @returns {string} CSS styles string
   */
  styles() {
    return '';
  }

  /**
   * Renders the component template to the DOM
   * @private
   */
  _render() {
    const target = this.shadowRoot || this;

    // Combine styles and template
    const styles = this.styles();
    const template = this.template();
    const styleTag = styles ? `<style>${styles}</style>` : '';
    target.innerHTML = styleTag + template;

    // Reapply all declared event bindings
    this._applyEventBindings();

    // Call user-defined render hook if it exists
    if (typeof this.onRendered === 'function') {
      this.onRendered();
    }
  }
}
