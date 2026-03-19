import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/', name: 'HomeView', component: HomeView }],
})

// 添加百度统计
router.afterEach((to) => {
  if ((window as any)._hmt) {
    ;(window as any)._hmt.push(['_trackPageview', to.fullPath])
  }
})
