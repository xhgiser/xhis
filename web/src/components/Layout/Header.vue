<template>
  <el-row style="height: 100%">
    <el-col :span="7">
      <h1 id="website-title">新汇集团工程信息化平台</h1>
    </el-col>

    <el-col :span="14">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-header"
        mode="horizontal"
        background-color="#454b52"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item
          class="header-menu-item"
          v-for="(item, index) in itemList"
          :index="item.path"
          :key="index"
          >{{ item.title }}</el-menu-item
        >
      </el-menu>
    </el-col>

    <el-col :span="3">
      <div class="header-user">
        <!-- 用户头像 -->
        <el-avatar :icon="UserFilled" />
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-info" trigger="click">
          <span class="el-dropdown-link">
            {{ userInfo.name }}<i class="el-icon-caret-bottom"></i
          ></span>
          <template v-slot:dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item disabled>{{
                userInfo.user_department
              }}</el-dropdown-item> -->
              <el-dropdown-item disabled>个人中心</el-dropdown-item>
              <el-dropdown-item @click="loginout" divided>{{
                ifLogin
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { computed, watch, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled } from '@element-plus/icons-vue'
import { getUserInfo } from '@/api/index'

const router = useRouter()
//console.log(router)

const itemList = [
  { path: '/home', title: '首页' },
  { path: '/map', title: '一张图' },
  { path: '/project', title: '工程沙盘' },
  { path: '/3D', title: '三维展示' },
  { path: '/analyze', title: '综合分析' },
  { path: '/apply', title: '档案申请' },
  { path: '/data', title: '数据管理' },
  { path: '/admin', title: '后台管理' },
]

const indexPath = '/' + router.currentRoute.value.fullPath.split('/')[1]

const activeIndex = computed(() => {
  return indexPath
  //return router.currentRoute.value.path
})

function handleSelect(path) {
  //console.log(localStorage.token)
  router.push({
    path,
  })
}

const ifLogin = ref('点击登录')

/**
 * 获取用户信息
 */
const userInfo = reactive({
  name: '未登录',
  user_department: '',
  user_type: '',
})
//用户信息接口的调用
const getUserInfoData = async () => {
  const res = await getUserInfo()
  if (res?.name && res?.user_department && res?.user_type) {
    userInfo.name = res.name
    userInfo.user_department = res.user_department
    userInfo.user_type = res.user_type
    ifLogin.value = '退出登录'
  }
}

function loginout() {
  localStorage.removeItem('token')
  router.push({
    path: '/login',
  })
}

onMounted(() => {
  getUserInfoData()
})
</script>
<style scoped></style>
