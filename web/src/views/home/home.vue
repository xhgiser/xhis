<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <div class="block text-center">
          <el-carousel>
            <el-carousel-item v-for="(item, index) in homePic" :key="index">
              <el-image
                :src="require(`@/assets/images/HomePic` + item.slice(1))"
                class="homeimage"
                fit="fill"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import Header from '@/components/Layout/Header.vue'

let homePic = []

const files = require
  .context('@/assets/images/HomePic', true, /\.*\.jpg|jpge|png$/)
  .keys()

homePic = files
</script>
<style lang="less" scoped>
.block,
.el-carousel,
.el-main {
  padding: 0;
  height: 100%;
}
:deep(.el-carousel__container) {
  height: 100%;
}
// .el-carousel__item h3 {
//   color: #475669;
//   opacity: 0.75;
//   margin: 0;
//   text-align: center;
// }

.homeimage {
  height: 100%;
  width: 100%;
}
</style>
