import { asyncComponent } from '@hox';

export default {
  path: '/about',
  component: asyncComponent(() => import('./about.component').then(module => module.default))
};
