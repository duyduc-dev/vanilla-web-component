// Define your route templates as functions
import './components/features/home/index.js';
import './components/features/comment/index.js';
import './components/layouts/main-layout.js';

export const routes = {
  home: function () {
    return `
      <main-layout>
        <home-page></home-page>
      </main-layout>
    `;
  },
  'comment/blog': function () {
    return `
      <main-layout>
        <comment-page></comment-page>
      </main-layout>
    `;
  },
};
