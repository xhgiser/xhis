import { createRouter, createWebHashHistory } from 'vue-router'

//路由配置
const router = createRouter({
  history: createWebHashHistory(), //选择hash路由
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: () => import('@/views/user/login.vue'),
    },
    {
      path: '/home',
      component: () => import('@/views/home/home.vue'),
    },
    {
      path: '/map',
      component: () => import('@/views/map/map.vue'),
      /**
       * 未登录用户将被拦截
       * 开发时先注释掉,上线运行需取消
       */
      // meta: {
      //   isAuth: true,
      // },
    },
  ],
})

//路由拦截
router.beforeEach((to, from, next) => {
  if (to.meta.isAuth) {
    if (localStorage.getItem('token')) {
      next()
    } else {
      ElMessage({
        message: '请先登录后访问',
        type: 'warning',
      })
    }
  } else {
    next()
  }
})

export default router
