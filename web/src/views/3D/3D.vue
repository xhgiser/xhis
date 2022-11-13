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
  { path: 'real-3D', title: '实景三维模型' },
  // { path: 'manual-3D', title: '人工三维模型' },
  { path: 'bim-3D', title: 'BIM模型' },
  { path: 'terrain-3D', title: '三维地形' },
  { path: 'pointcloud-3D', title: '三维点云' },
  { path: 'video-3D', title: '航拍视频' },
  { path: 'image-3D', title: '航拍影像' },
]
</script>
<style lang="less" scoped></style>
