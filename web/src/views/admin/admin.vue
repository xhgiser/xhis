<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside>
          <Aside :itemList="itemList"></Aside>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Header from '@/components/Layout/Header.vue'
import Aside from '@/components/Layout/Aside.vue'

const itemList = [
  { path: 'home-admin', title: '首页管理' },
  { path: 'user-admin', title: '用户管理' },
  { path: 'filesapply-admin', title: '档案申请管理' },
  { path: 'systemlog-admin', title: '系统日志' },
]
</script>
<style lang="less" scoped></style>
