import { asyncComponent } from '@hox';

export default {
  path: '/',
  component: asyncComponent(() => import('./home.component').then(module => module.default))
};
