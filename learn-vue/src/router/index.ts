import { createRouter, createWebHistory } from 'vue-router'

import BasicView from '~/views/HomeView/index.vue'
import ReactivityView from '~/views/ReactivityView/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BasicView,
    },

    {
      path: '/reactivity',
      component: ReactivityView,
    },
  ],
})

export default router
