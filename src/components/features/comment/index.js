import BaseComponent from '../../../core/BaseComponent.js';

class CommentPage extends BaseComponent {
  template() {
    return `
      <div class="home-page">
        <h1>Welcome to the Comment Page</h1>
        <p>This is a simple home page component.</p>
      </div>
    `;
  }
}

customElements.define('comment-page', CommentPage);
