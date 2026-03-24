import { createRouter, createWebHistory } from 'vue-router'

import BasicView from '~/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BasicView,
    },
  ],
})

export default router
