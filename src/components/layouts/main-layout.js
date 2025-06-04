import BaseComponent from '../../core/BaseComponent.js';

class MainLayout extends BaseComponent {
  template() {
    return `
      <div>
        <a href="#/" class="logo">Home</a>
        <a href="#/comment/blog" class="logo">MyApp</a>

        <h1>Main Layout</h1>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('main-layout', MainLayout);
