import BaseComponent from '../../core/BaseComponent.js';
import { html } from '../../core/utils/html.js';

class AppDropdown extends BaseComponent {
  template() {
    return html` <div class="dropdown">1</div> `;
  }
}

customElements.define('app-dropdown', AppDropdown);
