import { createRouter, createWebHistory } from 'vue-router'

import BasicView from '~/views/HomeView/index.vue'
import ReactivityView from '~/views/ReactivityView/index.vue'
import ComputedView from '~/views/ComputedView/index.vue'
import ClassAndStyleView from '~/views/ClassAndStyleView/index.vue'

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

    {
      path: '/computed/:id?',
      component: ComputedView,
    },

    {
      path: '/class-and-style',
      component: ClassAndStyleView,
    },
  ],
})

export default router
