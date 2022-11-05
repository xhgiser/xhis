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
    title: '水利工程',
    children: [
      { path: 'hydro-project', title: '水利水电工程' },
      { path: 'waterhub-project', title: '水利枢纽工程' },
      { path: 'farmwater-project', title: '农田水利工程' },
      { path: 'watersoil-project', title: '水土保持工程' },
      { path: 'watersupply-project', title: '给排水工程' },
      { path: 'flood-project', title: '防洪工程' },
      { path: 'channel-project', title: '航道整治工程' },
      { path: 'riverbasin-project', title: '跨流域开发工程' },
      { path: 'port-project', title: '港口工程' },
    ],
  },
  {
    title: '勘察工程',
    children: [
      { path: 'hydroinvestigate-project', title: '水利水电勘察工程' },
      { path: 'brigeinvestigate-project', title: '桥梁勘察工程' },
      { path: 'buildinginvestigate-project', title: '房建勘察工程' },
      { path: 'underinvestigate-project', title: '地下勘察工程' },
      { path: 'lineinvestigate-project', title: '线路勘察工程' },
      { path: 'disastersinvestigate-project', title: '地质灾害勘察工程' },
      { path: 'pipeinvestigate-project', title: '管道勘察工程' },
    ],
  },
  {
    title: '测绘工程',
    children: [
      { path: 'geodeticsurvey-project', title: '大地测量' },
      { path: 'engineersurvey-project', title: '工程测量' },
      { path: 'photosurvey-project', title: '航空摄影测量' },
      { path: 'boundarysurvey-project', title: '界线与不动产测绘' },
      { path: 'gis-project', title: '地理信息工程' },
      { path: 'oceansurvey-project', title: '海洋工程' },
    ],
  },
  {
    title: '建设工程',
    children: [
      { path: 'construction-project', title: '建筑工程' },
      { path: 'civil-project', title: '土木工程' },
      { path: 'electromechanical-project', title: '机电工程' },
    ],
  },
]
</script>
<style lang="less" scoped></style>
