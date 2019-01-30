import { asyncComponent } from '@hox';

export default {
  component: asyncComponent(() => import('./notFound.component').then(module => module.default))
};
