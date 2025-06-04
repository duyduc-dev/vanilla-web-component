import BaseComponent from '../../core/BaseComponent.js';
import { html } from '../../core/utils/html.js';
import withBaseStyle from '../hoc/withBaseStyle.js';

const css = html;

class MainLayout extends BaseComponent {
  template() {
    return html`
      <div>
        <header class="header">
          <h1 class="title">MinhKhue</h1>
          <nav>
            <app-link to="/"> Home </app-link>
            <app-link to="/about">About</app-link>
            <app-link to="/contact">Contact</app-link>
          </nav>
        </header>
        <slot></slot>
      </div>
    `;
  }

  styles() {
    return css`
      .header {
        background-color: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px !important;
        height: 64px;

        .title {
          font-size: 20px;
          font-weight: bold;
          color: #343a40;
        }
      }
    `;
  }
}

customElements.define('main-layout', withBaseStyle()(MainLayout));
