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
  { path: 'submerge-analyze', title: '淹没分析' },
  { path: 'visualrange-analyze', title: '可视域分析' },
  { path: 'cut-analyze', title: '剖切' },
  { path: 'watersurface-analyze', title: '水面' },
  { path: 'pothole-analyze', title: '挖坑' },
]
</script>
<style lang="less" scoped></style>
