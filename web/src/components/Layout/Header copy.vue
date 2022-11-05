<template>
  <el-row style="height: 100%">
    <el-col :span="7"
      ><div class="grid-content ep-bg-purple" />
      <!-- <div class="logo">
        <img src="@/assets/images/xhjt-logo.png" />
      </div> -->
      <h1 id="website-title">新汇集团工程信息化平台</h1>
    </el-col>
    <el-col :span="12"
      ><div class="grid-content ep-bg-purple" />
      <el-menu
        :default-active="activeIndex"
        class="el-menu-header"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="(item, index) in itemList"
          :index="item.path"
          :key="index"
          >{{ item.title }}</el-menu-item
        >
      </el-menu>
    </el-col>

    <el-col :span="5"
      ><div class="grid-content ep-bg-purple" />
      <div class="header-right">
        <div class="header-user-con">
          <!-- 用户头像 -->
          <div class="user-avator">
            <!-- <img src="../../assets/images/user.png"/> -->
            <el-icon>
              <Avatar
                style="
                  height: 30px;
                  width: 30px;
                  position: fixed;
                  right: 108px;
                  top: 15px;
                "
              />
            </el-icon>
          </div>
          <!-- 用户名下拉菜单 -->
          <el-dropdown class="user-name" trigger="click">
            <span class="el-dropdown-link">
              admin <i class="el-icon-caret-bottom"></i
            ></span>
            <!-- <span class="el-dropdown-link"> {{ username }} <i class="el-icon-caret-bottom"></i></span> -->
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item @click="loginout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar } from '@element-plus/icons-vue'

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
  router.push({
    path,
  })
}

function loginout() {
  localStorage.removeItem('userName')
  router.push({
    path: '/login',
  })
}
</script>
<style scoped>
@import url(@/assets/styles/el-container.css);
</style>
