export const AppRoute = {
  HOME: '/',
  BLOG: '/home/blog',
  COMMENT: '/comment',
};

export const routes = [
  {
    path: AppRoute.HOME,
    template: () => `
      <main-layout>
        <home-page></home-page>
      </main-layout>
    `,
  },
];
