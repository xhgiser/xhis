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
      redirect: '/map/river-map',
      children: [
        {
          path: 'river-map',
          component: () => import('@/views/map/river-map.vue'),
        },
        {
          path: 'water-map',
          component: () => import('@/views/map/water-map.vue'),
        },
        {
          path: 'irrigation-map',
          component: () => import('@/views/map/irrigation-map.vue'),
        },
        {
          path: 'pipe-map',
          component: () => import('@/views/map/pipe-map.vue'),
        },
        {
          path: 'plan-map',
          component: () => import('@/views/map/plan-map.vue'),
        },
        {
          path: 'geology-map',
          component: () => import('@/views/map/geology-map.vue'),
        },
        {
          path: 'water-map',
          component: () => import('@/views/map/water-map.vue'),
        },
      ],

      /**
       * 未登录用户将被拦截
       * 开发时先注释掉,上线运行需取消
       */
      // meta: {
      //   isAuth: true,
      // },
    },
    {
      path: '/project',
      component: () => import('@/views/project/project.vue'),
      redirect: '/project/hydro-project',
      children: [
        {
          path: 'hydro-project',
          component: () => import('@/views/project/hydro-project.vue'),
        },
        {
          path: 'waterhub-project',
          component: () => import('@/views/project/waterhub-project.vue'),
        },
        {
          path: 'farmwater-project',
          component: () => import('@/views/project/farmwater-project.vue'),
        },
        {
          path: 'watersoil-project',
          component: () => import('@/views/project/watersoil-project.vue'),
        },
        {
          path: 'watersupply-project',
          component: () => import('@/views/project/watersupply-project.vue'),
        },
        {
          path: 'flood-project',
          component: () => import('@/views/project/flood-project.vue'),
        },
        {
          path: 'channel-project',
          component: () => import('@/views/project/channel-project.vue'),
        },
        {
          path: 'riverbasin-project',
          component: () => import('@/views/project/riverbasin-project.vue'),
        },
        {
          path: 'port-project',
          component: () => import('@/views/project/port-project.vue'),
        },
        {
          path: 'hydroinvestigate-project',
          component: () =>
            import('@/views/project/hydroinvestigate-project.vue'),
        },
        {
          path: 'brigeinvestigate-project',
          component: () =>
            import('@/views/project/brigeinvestigate-project.vue'),
        },
        {
          path: 'buildinginvestigate-project',
          component: () =>
            import('@/views/project/buildinginvestigate-project.vue'),
        },
        {
          path: 'underinvestigate-project',
          component: () =>
            import('@/views/project/underinvestigate-project.vue'),
        },
        {
          path: 'lineinvestigate-project',
          component: () =>
            import('@/views/project/lineinvestigate-project.vue'),
        },
        {
          path: 'disastersinvestigate-project',
          component: () =>
            import('@/views/project/disastersinvestigate-project.vue'),
        },
        {
          path: 'pipeinvestigate-project',
          component: () =>
            import('@/views/project/pipeinvestigate-project.vue'),
        },
        {
          path: 'geodeticsurvey-project',
          component: () => import('@/views/project/geodeticsurvey-project.vue'),
        },
        {
          path: 'engineersurvey-project',
          component: () => import('@/views/project/engineersurvey-project.vue'),
        },
        {
          path: 'photosurvey-project',
          component: () => import('@/views/project/photosurvey-project.vue'),
        },
        {
          path: 'boundarysurvey-project',
          component: () => import('@/views/project/boundarysurvey-project.vue'),
        },
        {
          path: 'gis-project',
          component: () => import('@/views/project/gis-project.vue'),
        },
        {
          path: 'oceansurvey-project',
          component: () => import('@/views/project/oceansurvey-project.vue'),
        },
        {
          path: 'construction-project',
          component: () => import('@/views/project/construction-project.vue'),
        },
        {
          path: 'civil-project',
          component: () => import('@/views/project/civil-project.vue'),
        },
        {
          path: 'electromechanical-project',
          component: () =>
            import('@/views/project/electromechanical-project.vue'),
        },
      ],

      /**
       * 未登录用户将被拦截
       * 开发时先注释掉,上线运行需取消
       */
      // meta: {
      //   isAuth: true,
      // },
    },
    {
      path: '/3D',
      component: () => import('@/views/3D/3D.vue'),
      redirect: '/3D/real-3D',
      children: [
        {
          path: 'real-3D',
          component: () => import('@/views/3D/real-3D.vue'),
        },
        {
          path: 'manual-3D',
          component: () => import('@/views/3D/manual-3D.vue'),
        },
        {
          path: 'bim-3D',
          component: () => import('@/views/3D/bim-3D.vue'),
        },
        {
          path: 'terrain-3D',
          component: () => import('@/views/3D/terrain-3D.vue'),
        },
        {
          path: 'pointcloud-3D',
          component: () => import('@/views/3D/pointcloud-3D.vue'),
        },
        {
          path: 'aerialvideo-3D',
          component: () => import('@/views/3D/aerialvideo-3D.vue'),
        },
        {
          path: 'dom-3D',
          component: () => import('@/views/3D/dom-3D.vue'),
        },
      ],

      /**
       * 未登录用户将被拦截
       * 开发时先注释掉,上线运行需取消
       */
      // meta: {
      //   isAuth: true,
      // },
    },
    {
      path: '/analyze',
      component: () => import('@/views/analyze/analyze.vue'),
      redirect: '/analyze/submerge-analyze',
      children: [
        {
          path: 'submerge-analyze',
          component: () => import('@/views/analyze/submerge-analyze.vue'),
        },
        {
          path: 'visualrange-analyze',
          component: () => import('@/views/analyze/visualrange-analyze.vue'),
        },
        {
          path: 'cut-analyze',
          component: () => import('@/views/analyze/cut-analyze.vue'),
        },
        {
          path: 'watersurface-analyze',
          component: () => import('@/views/analyze/watersurface-analyze.vue'),
        },
        {
          path: 'pothole-analyze',
          component: () => import('@/views/analyze/pothole-analyze.vue'),
        },
      ],

      /**
       * 未登录用户将被拦截
       * 开发时先注释掉,上线运行需取消
       */
      // meta: {
      //   isAuth: true,
      // },
    },
    {
      path: '/apply',
      component: () => import('@/views/apply/apply.vue'),
      redirect: '/apply/electronicfiles-apply',
      children: [
        {
          path: 'electronicfiles-apply',
          component: () => import('@/views/apply/electronicfiles-apply.vue'),
        },
        {
          path: 'paperfiles-apply',
          component: () => import('@/views/apply/paperfiles-apply.vue'),
        },
        {
          path: 'record-apply',
          component: () => import('@/views/apply/record-apply.vue'),
        },
      ],

      /**
       * 未登录用户将被拦截
       * 开发时先注释掉,上线运行需取消
       */
      // meta: {
      //   isAuth: true,
      // },
    },
    {
      path: '/data',
      component: () => import('@/views/data/data.vue'),
      redirect: '/data/river-data',
      children: [
        {
          path: 'river-data',
          component: () => import('@/views/data/river-data.vue'),
        },
        {
          path: 'water-data',
          component: () => import('@/views/data/water-data.vue'),
        },
        {
          path: 'irrigat-data',
          component: () => import('@/views/data/irrigat-data.vue'),
        },
        {
          path: 'pipe-data',
          component: () => import('@/views/data/pipe-data.vue'),
        },
        {
          path: 'plan-data',
          component: () => import('@/views/data/plan-data.vue'),
        },
        {
          path: 'geology-data',
          component: () => import('@/views/data/geology-data.vue'),
        },
        {
          path: 'waterengineer-data',
          component: () => import('@/views/data/waterengineer-data.vue'),
        },
        {
          path: 'investigation-data',
          component: () => import('@/views/data/investigation-data.vue'),
        },
        {
          path: 'survey-data',
          component: () => import('@/views/data/survey-data.vue'),
        },
        {
          path: 'construction-data',
          component: () => import('@/views/data/construction-data.vue'),
        },
        {
          path: 'real3D-data',
          component: () => import('@/views/data/real3D-data.vue'),
        },
        {
          path: 'manual3D-data',
          component: () => import('@/views/data/manual3D-data.vue'),
        },
        {
          path: 'bim-data',
          component: () => import('@/views/data/bim-data.vue'),
        },
        {
          path: 'terrain-data',
          component: () => import('@/views/data/terrain-data.vue'),
        },
        {
          path: 'pointcloud-data',
          component: () => import('@/views/data/pointcloud-data.vue'),
        },
        {
          path: 'aerialvideo-data',
          component: () => import('@/views/data/aerialvideo-data.vue'),
        },
        {
          path: 'dom-data',
          component: () => import('@/views/data/dom-data.vue'),
        },
        {
          path: 'statistics-data',
          component: () => import('@/views/data/statistics-data.vue'),
        },
      ],

      /**
       * 未登录用户将被拦截
       * 开发时先注释掉,上线运行需取消
       */
      // meta: {
      //   isAuth: true,
      // },
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/admin.vue'),
      redirect: '/admin/home-admin',
      children: [
        {
          path: 'home-admin',
          component: () => import('@/views/admin/home-admin.vue'),
        },
        {
          path: 'user-admin',
          component: () => import('@/views/admin/user-admin.vue'),
        },
        {
          path: 'filesapply-admin',
          component: () => import('@/views/admin/filesapply-admin.vue'),
        },
        {
          path: 'systemlog-admin',
          component: () => import('@/views/admin/systemlog-admin.vue'),
        },
      ],

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
