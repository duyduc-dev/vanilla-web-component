/**
 * ButtonCounter Component
 * A custom element that implements a simple counter button.
 *
 * @class ButtonCounter
 * @extends {BaseComponent}
 *
 * @attribute {number} initial-count - Optional initial count value
 * @attribute {string} label - Button text label (default: "Click me")
 */
import BaseComponent from '../../core/BaseComponent.js';

export default class ButtonCounter extends BaseComponent {
  /**
   * Create a new ButtonCounter component
   */
  constructor() {
    super({
      initialState: {
        count: 0,
        label: 'Click me',
      },
    });

    // Bind methods
    this.increment = this.increment.bind(this);
  }

  /**
   * List attributes to observe for changes
   * @returns {string[]} Array of attribute names to observe
   */
  static get observedAttributes() {
    return ['initial-count', 'label'];
  }

  /**
   * Declare events that persist through re-renders
   */
  declareEvents() {
    this.declareEvent('button', 'click', this.increment);
  }

  /**
   * Set up component when connected to DOM
   */
  onConnected() {
    // Set initial count from attribute if provided
    const initialCount = this.getAttributeValue('initial-count', 0);
    if (initialCount !== 0) {
      this.setState({ count: initialCount });
    }

    // Set label from attribute if provided
    const label = this.getAttributeValue('label');
    if (label) {
      this.setState({ label });
    }
  }

  /**
   * Increment counter and update state
   */
  increment() {
    const currentCount = this.getStateValue('count');
    this.setState({ count: currentCount + 1 });
  }

  /**
   * Component styles
   * @returns {string} CSS styles
   */
  styles() {
    return `
            :host {
                display: block;
                margin: 20px 0;
            }

            button {
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                font-size: 16px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            button:hover {
                background-color: #45a049;
            }

            .counter {
                margin-left: 10px;
                font-weight: bold;
            }
        `;
  }

  /**
   * Component template
   * @returns {string} HTML template
   */
  template() {
    const { count, label } = this.getState();

    return `
            <div>
                <button>${label}</button>
                <span class="counter">Count: ${count}</span>
            </div>
        `;
  }
}

customElements.define('button-counter', ButtonCounter);
