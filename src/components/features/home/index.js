import BaseComponent from '../../../core/BaseComponent.js';
import { debounce, sleep } from '../../../utils/index.js';
import withTailwind from '../../hoc/withTailwind.js';
import withBaseStyle from '../../hoc/withBaseStyle.js';

import '../../ui/button-counter.js';

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

  declareEvents() {
    const { value } = this.getState();
    this.declareEvent('input', 'input', (event) => {
      const inputValue = event.target.value;
      const newValue = value + inputValue;
      this.setState({ value: newValue });
      this.focusInput();
    });
  }

  focusInput() {
    const { value } = this.getState();
    this.$('input').focus();
    this.$('input').setSelectionRange(value.length, value.length);
  }

  #handleFetchData = debounce(async (value) => {
    const { list } = this.getState();
    if (list.length > 0) return;
    this.setState({ loading: true });
    console.log(`Fetching data for value: ${value}`);
    const data = await fetch('https://jsonplaceholder.typicode.com/comments');
    const json = await data.json();
    this.focusInput();
    await sleep(5000);
    this.setState({ list: json, loading: false });
    this.focusInput();
  }, 1000);

  onStateChanged(prevState, newState) {
    if (prevState.value !== newState.value) {
      this.#handleFetchData(newState.value);
    }
  }

  template() {
    const { value, list, loading } = this.getState();
    return `
      <div class="text-red-500">
        <h1 class="test">Welcome to the Home Page</h1>
        <p class="hover:text-yellow-500 m-2 opacity-50 hover:bg-red-500 flex text-[#ff0000]">This is a simple home page component - ${value}.</p>
        <input class="input-form" type="text" value="${value}" placeholder="Type something..." />

        <br/ >
        ${loading ? '<span>Loading...</span>' : ''}
        <ul>
          ${list.map((item) => `<li>${item.name} - ${item.email}</li>`).join('')}
        </ul>
      </div>
    `;
  }
}

customElements.define(
  'home-page',
  withTailwind(
    withBaseStyle(HomePage, {
      display: 'block',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',

      '.input-form': {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
        outline: 'none',
        backgroundColor: 'red',
      },
    }),
  ),
);
