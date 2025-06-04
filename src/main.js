// Import components
import { routes } from './routes.js';
import AppRouter from './core/Router.js';

const register = async () => {
  const data = await import('./components/register.js');
  console.log('UI components registered:', data);
};
register();

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('Web Components application initialized');
  window.appRouter = new AppRouter('app', routes);
});
