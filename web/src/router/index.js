import { createRouter, createWebHashHistory } from 'vue-router'

// 路由规则
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/home')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
