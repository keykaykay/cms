import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { useRouterGuards } from './guard'

const router = createRouter({
  routes: setupLayouts(generatedRoutes),
  history: createWebHistory(),
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

useRouterGuards(router)

export default router
