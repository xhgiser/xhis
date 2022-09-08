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
  {
    title: '一张图管理',
    children: [
      { path: 'river-data', title: '水利一张图' },
      { path: 'water-data', title: '水务一张图' },
      { path: 'irrigat-data', title: '灌区一张图' },
      { path: 'pipe-data', title: '管线一张图' },
      { path: 'plan-data', title: '规划一张图' },
      { path: 'geology-data', title: '地质一张图' },
    ],
  },
  {
    title: '工程管理',
    children: [
      { path: 'waterengineer-data', title: '水利工程' },
      { path: 'investigation-data', title: '勘察工程' },
      { path: 'survey-data', title: '测绘工程' },
      { path: 'construction-data', title: '建设工程' },
    ],
  },
  {
    title: '三维数据管理',
    children: [
      { path: 'real3D-data', title: '实景三维模型' },
      { path: 'manual3D-data', title: '人工三维模型' },
      { path: 'bim-data', title: 'BIM模型' },
      { path: 'terrain-data', title: '三维地形' },
      { path: 'pointcloud-data', title: '三维点云' },
      { path: 'aerialvideo-data', title: '航拍视频' },
      { path: 'dom-data', title: '数字影像' },
    ],
  },
  { path: 'statistics-data', title: '数据统计' },
]
</script>
<style lang="less" scoped></style>
