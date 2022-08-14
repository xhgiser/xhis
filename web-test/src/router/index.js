import * as VueRouter from 'vue-router'

/* Layout */
//import Layout from '@/layout'

//路由配置
export const constantRoutes = [
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
    meta: {
      isAuth: true,
    },
  },
]

const createRouter = () =>
  VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: constantRoutes, // mode: 'history', // require service support
    scrollBehavior: () => ({
      top: 0,
    }),
  })

const router = createRouter()

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

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
