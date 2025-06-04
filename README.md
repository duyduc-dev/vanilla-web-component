# Vanilla JS Web Components

This project demonstrates how to create and use vanilla JavaScript web components (custom elements) organized as separate files, similar to component-based frameworks. It includes a base component class that provides common functionality.

## Project Structure

- `index.html` - Main HTML file that uses the custom elements
- `src/main.js` - Imports and registers all custom elements
- `src/components/` - Directory containing all custom element definitions
- `src/core/` - Core utilities and base classes
- `src/styles/` - Directory containing global styles

## Components

The project includes the following:

1. `BaseComponent` - A base class for creating web components with enhanced functionality
2. `greeting-card` - A card component that displays a name, title, and bio with theming support
3. `button-counter` - A simple counter button component

## Features Demonstrated

- Class inheritance for component reuse
- Custom Elements API
- Shadow DOM
- Slots
- Component styling with encapsulation
- State management with automatic rendering
- Attribute observation and reactivity
- Event handling with automatic cleanup
- Lifecycle hooks

## Creating a New Component

To create a new component, extend the BaseComponent class:

```javascript
import BaseComponent from '../core/BaseComponent.js';

export default class MyComponent extends BaseComponent {
    constructor() {
        super({
            initialState: {
                // Your component's initial state
                message: 'Hello World'
            }
        });
    }
    
    // List attributes to observe
    static get observedAttributes() {
        return ['message'];
    }
    
    // Set up the component when connected
    onConnected() {
        this.bindEvent(this.$('button'), 'click', this.handleClick);
    }
    
    // Handle a button click
    handleClick() {
        this.setState({ message: 'Clicked!' });
    }
    
    // Define component styles
    styles() {
        return `
            :host { display: block; padding: 1em; }
            div { color: blue; }
        `;
    }
    
    // Define component template
    template() {
        const { message } = this.getState();
        return `
            <div>
                <h3>${message}</h3>
                <button>Click me</button>
            </div>
        `;
    }
}
```

Then register it in main.js:

```javascript
import MyComponent from './components/my-component.js';
customElements.define('my-component', MyComponent);
```

## BaseComponent Features

The BaseComponent class provides:

- **State Management**: Automatically re-renders when state changes
- **Attribute Handling**: Automatically syncs attributes with internal state
- **Event Binding**: With automatic cleanup to prevent memory leaks
- **Lifecycle Hooks**: Simplified component lifecycle management
- **DOM Helpers**: Simplified selectors and template rendering
- **Type Conversion**: Automatic handling of attribute type conversion

## Running the Project

To run this project, you need to serve it through a web server due to module loading requirements.

You can use any simple web server, for example with Python:

```bash
python -m http.server
```

Or with Node.js (after installing `http-server`):

```bash
npx http-server
```

Then visit http://localhost:8000 (or the port specified by your server).

## Learn More

To learn more about Web Components, check out:

- [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Web Components on web.dev](https://web.dev/web-components/)

