<!-- 规划一张图 -->
<template>
  <div id="map"></div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from '@vue/runtime-core'
import { Map, View } from 'ol'
import { defaults as defaultControls } from 'ol/control.js'
import Tile from 'ol/layer/Tile'
import { XYZ, TileWMS, OSM } from 'ol/source'
import * as control from 'ol/control'
import 'ol/ol.css'

const map = ref(null) // 绑定地图实例的变量

// 初始化地图并渲染
function initMap() {
  // 地图实例
  map.value = new Map({
    target: 'map',
    layers: [
      // 图层
      new Tile({
        source: new OSM(), // 图层数据源
      }),
    ],
    view: new View({
      // 地图视图
      projection: 'EPSG:4326', // 坐标系，有EPSG:4326和EPSG:3857
      center: [114.064839, 22.548857], // 深圳坐标
      minZoom: 10, // 地图缩放最小级别
      zoom: 12, // 地图缩放级别（打开页面时默认级别）
    }),
  })
}

onMounted(() => {
  initMap()
})
</script>
<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
