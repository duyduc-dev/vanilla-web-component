import BaseComponent from '../BaseComponent.js';

class AppLink extends BaseComponent {
  static get observedAttributes() {
    return ['to', 'class', 'options'];
  }

  declareEvents() {
    this.declareEvent('a', 'click', (event) => {
      event.preventDefault();
      const href = this.getAttributeValue('to', '#');
      if (href) {
        window.location.hash = `#/${href.replace(/^\//, '')}`;
      }
    });
  }

  template() {
    const href = this.getAttributeValue('to', '#');
    const className = this.getAttributeValue('class', '#');
    return `
      <a href="${href}" data-route="true" class="${className}">
        <slot name="link"></slot>
      </a>
    `;
  }
}

customElements.define('app-link', AppLink);
