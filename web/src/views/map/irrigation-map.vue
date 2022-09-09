<!-- 灌区一张图 -->
<template>
  <div id="map">
    <BaseControl></BaseControl>
  </div>
</template>

<script setup>
import BaseControl from '@/components/OpenlayersControls/BaseControl.vue'
import { onMounted } from '@vue/runtime-core'
import { Map, View } from 'ol'
import { defaults as defaultControls } from 'ol/control.js'
import TileLayer from 'ol/layer/Tile'
import { XYZ, TileWMS } from 'ol/source'

const initMap = () => {
  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        title: '天地图矢量图层',
        source: new XYZ({
          url: 'https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=3b0fcd224a241196450e4b962944f51e',
          wrapX: false,
        }),
      }),
      new TileLayer({
        title: '天地图矢量图层注记',
        source: new XYZ({
          url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=9893433c99cfb657e6ec3a92fe4068e5',
          wrapX: false,
        }),
      }),
      new TileLayer({
        source: new TileWMS({
          //不能设置为0，否则地图不展示。
          ratio: 1,
          url: 'http://192.168.188.8:8086/geoserver/xhis/wms',
          params: {
            LAYERS: 'xhis:map_irrigation_dsy',
            STYLES: '',
            VERSION: '1.1.1',
            tiled: true,
          },
          serverType: 'geoserver',
        }),
      }),
    ],

    controls: defaultControls({
      attribution: false, //禁用右下角的地图属性组件
      rotate: false, //禁用旋转组件 alt+shift true旋转交互时会有一个旋转控件显示出来
      zoom: false, //禁用右上角缩放组件
    }),
    view: new View({
      center: [118.655626, 37.502069],
      projection: 'EPSG:4326', //指定投影
      zoom: 10,
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
