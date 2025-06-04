import BaseComponent from '../../../core/BaseComponent.js';
import withTailwind from '../../hoc/withTailwind.js';
import { html } from '../../../core/utils/html.js';
import { compose } from '../../../core/utils/compose.js';
import withBaseStyle from '../../hoc/withBaseStyle.js';

class HomePage extends BaseComponent {
  constructor() {
    super({
      initialState: {
        value: '',
        list: [],
        loading: false,
      },
    });
  }

  template() {
    return html`
      <p>Duck</p>
    `;
  }
}

const withHoc = compose(withTailwind, withBaseStyle());

customElements.define('home-page', withHoc(HomePage));
