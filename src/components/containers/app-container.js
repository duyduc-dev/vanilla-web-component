import BaseComponent from '../../core/BaseComponent.js';

class AppContainer extends BaseComponent {
  constructor() {
    super({
      initialState: {
        // Define any initial state properties if needed
      },
    });

    console.log('AppContainer initialized');
  }

  template() {
    return `<slot>1</slot>`;
  }
}
customElements.define('app-container', AppContainer);
