<!-- 点云 -->
<template>
  <div id="cesiumContainer">
    <el-card id="data-select-card" shadow="always">
      <div class="card-header">
        <el-cascader
          placeholder="请选择或搜索数据进行浏览"
          :options="dataOption"
          filterable
          @change="flyToData"
        />
        <el-button
          class="button"
          :icon="arrowStyle"
          text
          @click="collapseDescription"
        ></el-button>
      </div>
      <el-card id="description-card" shadow="hover">
        <div class="description-header"></div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium'

import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'

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
    destination: Cesium.Cartesian3.fromDegrees(118.6475, 37.394, 1000),
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

//级联选择器数据
const dataOption = [
  {
    value: 'DongYing',
    label: '东营市',
    children: [
      {
        value: 'DongYing_XinHuiDaSha',
        label: '新汇大厦',
      },
      {
        value: 'DongYing_DaTangRenJia',
        label: '大唐人家',
      },
    ],
  },
  {
    value: 'TaiAn',
    label: '泰安市',
    children: [
      {
        value: 'TaiAn_ChaiWenHe',
        label: '柴汶河',
      },
    ],
  },
  {
    value: 'Other',
    label: '其它省市',
    children: [
      {
        value: '',
        label: '暂无数据',
        disabled: true,
      },
    ],
  },
]

//模型经纬度,由于公司处理的模型空间参考一般为投影坐标系,Cesium可能不支持投影坐标系
//所以将模型的经纬度查询后存放于数组
const modelLngLatDeg = {
  DongYing_XinHuiDaSha: { longitude: '118.6475', latitude: '37.394' },
  DongYing_DaTangRenJia: { longitude: '118.24948', latitude: '37.47898' },
  TaiAn_ChaiWenHe: { longitude: '117.911', latitude: '35.918' },
}
//折叠展开数据详细描述
const arrowStyle = ref('ArrowDownBold') //箭头类型
function collapseDescription() {
  if (arrowStyle.value == 'ArrowUpBold') {
    arrowStyle.value = 'ArrowDownBold'
    document.getElementById('description-card').style.display = 'none'
  } else {
    arrowStyle.value = 'ArrowUpBold'
    document.getElementById('description-card').style.display = 'block'
  }
}

//数据选择事件
function flyToData(value) {
  viewer.value.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: 'http://192.168.188.8/PointCloud/' + value[1] + '/tileset.json',
      shadows: false,
    })
  )
  viewer.value.camera.flyTo({
    // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
    // fromDegrees()方法，将经纬度和高程转换为世界坐标
    destination: Cesium.Cartesian3.fromDegrees(
      +modelLngLatDeg[value[1]].longitude,
      +modelLngLatDeg[value[1]].latitude,
      1000
    ),
    orientation: {
      // 指向 旋转角 正东为90°
      heading: 0,
      // 俯仰角 水平为0°
      pitch: Cesium.Math.toRadians(-60),
      //翻滚角
      roll: 0,
    },
  })
}
onMounted(() => {
  initCesium()
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
