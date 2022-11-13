<!-- 航拍视频 -->
<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium'

import SuperGif from 'libgif'

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMjNmMTkyYy1hNTVjLTQwMGQtOTVjMy1lYWI5OTJjYzU5NjUiLCJpZCI6NDM1MDgsImlhdCI6MTY2Nzc4ODcyM30.W_IR7QCETFVTT7ZUbWjFcLTM6jjwUlGgmJLF5sptkkA'

//天地图服务
const token = '9970c29ec3f3482ac1448cd57b16685d'
// 服务域名
const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
// 服务负载子域
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

const viewer = ref(null)

function initCesium() {
  viewer.value = new Cesium.Viewer('cesiumContainer', {
    animation: false, //是否创建动画小器件，左下角仪表
    baseLayerPicker: false, //是否显示图层选择器，右上角图层选择按钮
    fullscreenButton: false, //是否显示全屏按钮，右下角全屏选择按钮
    geocoder: false, //是否显示geocoder 小器件，右上角查询按钮
    homeButton: false, //是否显示Home 按钮，右上角home 按钮
    infoBox: false, //是否显示信息框
    sceneModePicker: false, //是否显示3D/2D 选择器，右上角按钮
    navigationHelpButton: false, //是否显示右上角的帮助按钮
    scene3DOnly: true, //如果设置为true，则所有几何图形以3D 模式绘制以节约GPU 资源
    timeline: false, //是否显示时间轴
    selectionIndicator: false, //是否显示选取指示器组件
    shouldAnimate: false, //自动播放动画控件
    shadows: true, //是否显示光照投射的阴影
    terrainShadows: Cesium.ShadowMode.RECEIVE_ONLY, //地质接收阴影
    sceneMode: Cesium.SceneMode.SCENE3D,
    //clock: new Cesium.Clock(),
    imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
      url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=' + token,
      layer: 'img',
      style: 'default',
      tileMatrixSetID: 'w',
      format: 'tiles',
      subdomains: subdomains,
      maximumLevel: 18,
    }),
    terrainProvider: new Cesium.CesiumTerrainProvider({
      url: Cesium.IonResource.fromAssetId(1),
      requestVertexNormals: true, //顶点法线效果
      requestWaterMask: false, //水效果
    }),
  })

  window.earth = viewer.value
  viewer.value._cesiumWidget._creditContainer.style.display = 'none' //	去除版权信息
  viewer.value.scene.globe.depthTestAgainstTerrain = true //开启地形深度检测 相对于地形表面绘制
  // viewer.scene.globe.depthTestAgainstTerrain = false // 始终在顶部绘制（默认）

  //天地图注记
  viewer.value.imageryLayers.addImageryProvider(
    new Cesium.WebMapTileServiceImageryProvider({
      url:
        'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
        token,
      layer: 'cia',
      style: 'default',
      format: 'image/jpeg',
      tileMatrixSetID: 'w',
      show: true,
    })
  )
  viewer.value.camera.flyTo({
    // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
    // fromDegrees()方法，将经纬度和高程转换为世界坐标
    destination: Cesium.Cartesian3.fromDegrees(118.6475, 36.7, 100000),
    orientation: {
      // 指向 旋转角 正东为90°
      heading: 0.02,
      // 俯仰角 水平为0°
      pitch: Cesium.Math.toRadians(-45),
      //翻滚角
      roll: 0,
    },
    duration: 2,
  })
}

function initVideoBillboard() {
  viewer.value.entities.add({
    position: Cesium.Cartesian3.fromDegrees(118.6475, 37.394),
    billboard: {
      image: require('@/assets/images/CesiumBillboard/4.gif'),
      //show: true, // default
      // pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
      // eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
      scale: 2.0, // default: 1.0
      //color: Cesium.Color.LIME, // default: WHITE
      //rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
      //alignedAxis: Cesium.Cartesian3.ZERO, // default
      width: 25, // default: undefined
      height: 25, // default: undefined
    },
  })
}

onMounted(() => {
  initCesium()
  initVideoBillboard()
})
</script>

<style scoped>
@import 'cesium/widgets.css';
#cesiumContainer {
  height: 99.5%;
}

#data-select-card {
  position: absolute;
  transform: translate(8px, 8px);
  opacity: 0.95;
  width: 360px;
  z-index: 9;
  text-align: center;
}

#data-select-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#data-select-card :deep(.el-cascader) {
  width: 260px;
}

#description-card .description-header {
  text-align: center;
  align-items: center;
}

#description-card {
  margin-top: 20px;
  display: none;
}
</style>
