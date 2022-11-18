<!-- 实景三维模型 -->
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
    // terrainProvider: new Cesium.ArcGISTiledElevationTerrainProvider({
    //   url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
    // }),
    // terrainProvider: new Cesium.EllipsoidTerrainProvider(),
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

/* 添加geoserver发布的wms图层 */
// viewer.value.imageryLayers.addImageryProvider(
//   new Cesium.WebMapServiceImageryProvider({
//     url: 'http://192.168.188.8:8086/geoserver/xhis/wms',
//     layers: 'xhis:map_water',
//     parameters: {
//       FORMAT: 'image/png',
//       TRANSPARENT: true,
//     },
//   })
// )

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
        value: 'DongYing_NanZhangCun',
        label: '南张村',
      },
    ],
  },
  {
    value: 'JiNing',
    label: '济宁市',
    children: [
      {
        value: 'JiNing_BaiMaHe',
        label: '白马河',
      },
      {
        value: 'JiNing_BaiMaHeYouAnFenHongHanDongZha',
        label: '白马河右岸分洪涵洞闸',
      },
      {
        value: 'JiNing_ChenZhaiXiangJiaoBa',
        label: '陈寨橡胶坝',
      },
      {
        value: 'JiNing_GuangFuHe',
        label: '洸府河',
      },
      {
        value: 'JiNing_HongQiZha',
        label: '红旗闸',
      },
      {
        value: 'JiNing_HuaCunShuiKuYiHongDaoZha',
        label: '华村水库溢洪道闸',
      },
      {
        value: 'JiNing_HuangYinJIZha',
        label: '黄阴集闸',
      },
      {
        value: 'JiNing_LinSiXiangJiaoBa',
        label: '临泗橡胶坝',
      },
      {
        value: 'JiNing_LongWanDianZha',
        label: '龙湾店闸',
      },
      {
        value: 'JiNing_LongWanTaoShuiKuYiHongDaoZha',
        label: '龙湾套水库溢洪道闸',
      },
      {
        value: 'JiNing_MoTingShuiKu',
        label: '莫亭水库',
      },
      {
        value: 'JiNing_NiShanShuiKuYiHongDaoZha',
        label: '尼山水库溢洪道闸',
      },
      {
        value: 'JiNing_ShengTaiYiHaoXiangJiaoBa',
        label: '生态一号橡胶坝',
      },
      {
        value: 'JiNing_ShuYuanXiangJiaoBa',
        label: '书院橡胶坝',
      },
      {
        value: 'JiNing_SiBinXiangJiaoBa',
        label: '泗滨橡胶坝',
      },
      {
        value: 'JiNing_SiHe',
        label: '泗河',
      },
      {
        value: 'JiNing_XiWeiShuiKu',
        label: '西苇水库',
      },
      {
        value: 'JiNing_XiWeiShuiKuYiHongDaoZha',
        label: '西苇水库溢洪道闸',
      },
    ],
  },
  {
    value: 'LinYi',
    label: '临沂市',
    children: [
      {
        value: 'LinYi_HuangBuZha',
        label: '黄埠闸',
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
  DongYing_XinHuiDaSha: { longitude: '118.6475', latitude: '37.397' },
  DongYing_NanZhangCun: { longitude: '118.3314', latitude: '37.423' },
  JiNing_BaiMaHe: { longitude: '116.6977', latitude: '35.14' },
  JiNing_BaiMaHeYouAnFenHongHanDongZha: {
    longitude: '116.7076',
    latitude: '35.17',
  },
  JiNing_ChenZhaiXiangJiaoBa: { longitude: '116.9621', latitude: '35.641' },
  JiNing_GuangFuHe: { longitude: '116.6253', latitude: '35.290' },
  JiNing_HongQiZha: { longitude: '117.0906', latitude: '35.625' },
  JiNing_HuaCunShuiKuYiHongDaoZha: {
    longitude: '117.4768',
    latitude: '35.691',
  },
  JiNing_HuangYinJIZha: { longitude: '117.4457', latitude: '35.633' },
  JiNing_LinSiXiangJiaoBa: { longitude: '117.1943', latitude: '35.668' },
  JiNing_LongWanDianZha: { longitude: '116.8511', latitude: '35.61' },
  JiNing_LongWanTaoShuiKuYiHongDaoZha: {
    longitude: '117.2895',
    latitude: '35.59',
  },
  JiNing_MoTingShuiKu: { longitude: '117.1405', latitude: '35.339' },
  JiNing_NiShanShuiKuYiHongDaoZha: {
    longitude: '117.1956',
    latitude: '35.487',
  },
  JiNing_ShengTaiYiHaoXiangJiaoBa: {
    longitude: '117.2375',
    latitude: '35.683',
  },
  JiNing_ShuYuanXiangJiaoBa: { longitude: '116.9945', latitude: '35.63' },
  JiNing_SiBinXiangJiaoBa: { longitude: '117.0650', latitude: '35.624' },
  JiNing_SiHe: { longitude: '116.6764', latitude: '35.243' },
  JiNing_XiWeiShuiKu: { longitude: '117.028', latitude: '35.408' },
  JiNing_XiWeiShuiKuYiHongDaoZha: { longitude: '117.0246', latitude: '35.385' },
  LinYi_HuangBuZha: { longitude: '118.3997', latitude: '35.429' },
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
      url: 'http://192.168.188.8/3DTiles/' + value[1] + '/tileset.json',
      shadows: false,
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      //maximumScreenSpaceError: 256, // 数值加大，能让最终成像变模糊
      skipScreenSpaceErrorFactor: 16,
      skipLevels: 1,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: true, // 如果为true则不会在已加载完概况房屋后，自动从中心开始超清化房屋
      cullWithChildrenBounds: true,
      cullRequestsWhileMoving: true,
      cullRequestsWhileMovingMultiplier: 10, // 值越小能够更快的剔除
      preloadWhenHidden: true,
      preferLeaves: true,
      maximumMemoryUsage: 128, // 内存分配变小有利于倾斜摄影数据回收，提升性能体验
      progressiveResolutionHeightFraction: 0.5, // 数值偏于0能够让初始加载变得模糊
      dynamicScreenSpaceErrorDensity: 0.1, // 数值加大，能让周边加载变快
      dynamicScreenSpaceErrorFactor: 1, // 不知道起了什么作用没，反正放着吧先
      dynamicScreenSpaceError: true, // 根据测试，有了这个后，会在真正的全屏加载完之后才清晰化房屋
    })
    // .readyPromise.then((tileSet) => {
    //   viewer.value.scene.primitives.add(tileSet) // 将倾斜摄影实体加载到地图上
    //   //changeHeight(tileSet, 310) // 将此 tileSet 提高 310 米
    // })
  )
  viewer.value.camera.flyTo({
    // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
    // fromDegrees()方法，将经纬度和高程转换为世界坐标
    destination: Cesium.Cartesian3.fromDegrees(
      +modelLngLatDeg[value[1]].longitude,
      +modelLngLatDeg[value[1]].latitude,
      800
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

// 可通过此函数，来修改 tileSet 的高度
// function changeHeight(tileSet, height) {
//   height = Number(height)
//   if (isNaN(height)) {
//     return
//   }
//   const cartographic = Cesium.Cartographic.fromCartesian(
//     tileSet.boundingSphere.center
//   )
//   const surface = Cesium.Cartesian3.fromRadians(
//     cartographic.longitude,
//     cartographic.latitude,
//     cartographic.height
//   )
//   const offset = Cesium.Cartesian3.fromRadians(
//     cartographic.longitude,
//     cartographic.latitude,
//     height
//   )
//   const translation = Cesium.Cartesian3.subtract(
//     offset,
//     surface,
//     new Cesium.Cartesian3()
//   )
//   tileSet.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
// }
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
