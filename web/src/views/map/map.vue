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
  { path: 'river-map', title: '水利一张图' },
  { path: 'water-map', title: '水务一张图' },
  { path: 'irrigation-map', title: '灌区一张图' },
  { path: 'pipe-map', title: '管线一张图' },
  { path: 'plan-map', title: '规划一张图' },
  { path: 'geology-map', title: '地质一张图' },
]
</script>
<style lang="less" scoped></style>
