import { createRouter, createWebHistory } from 'vue-router';
import FigureSearchPage from './pages/FigureSearchPage.vue';
import NotFound from './components/NotFound.vue';

const routes = [
  {
    path: '/:pathMatch(.*)*',
    component: FigureSearchPage,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
