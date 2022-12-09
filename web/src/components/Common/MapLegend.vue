<!-- 地图图例 -->
<template>
  <div class="map-legend">
    <el-card :body-style="{ padding: '1px' }" shadow="always">
      <el-image class="map-legend-image" :src="MaplegendImage" fit="contain" />
    </el-card>
  </div>
</template>

<script setup>
defineProps({ MaplegendImage: { type: String } })
</script>

<style scoped>
.map-legend {
  position: fixed;
  bottom: 40px;
  margin: auto 40%;
  transform: scale(4);
  opacity: 0.9;
  z-index: 9;
}

:deep(.el-card__body) {
  display: flex;
}
</style>
