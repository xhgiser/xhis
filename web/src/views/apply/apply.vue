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
  { path: 'electronicfiles-apply', title: '电子档案申请' },
  { path: 'paperfiles-apply', title: '实物档案申请' },
  { path: 'record-apply', title: '档案申请记录' },
]
</script>
<style lang="less" scoped></style>
