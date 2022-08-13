import { createRouter, createWebHashHistory } from 'vue-router'

//路由配置
const router = createRouter({
  history: createWebHashHistory(), //选择hash路由
  routes: [
    /**
     * 复制过来的,还没有配置
     */
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: () => import('../views/home/home.vue'),
      meta: {
        isAuth: true,
      },
    },
  ],
})

//路由拦截
router.beforeEach((to, from, next) => {
  if (to.meta.isAuth) {
    if (localStorage.getItem('token')) {
      next()
    } else {
      ElMessage.error('请先登录')
    }
  } else {
    next()
  }
})

export default router
