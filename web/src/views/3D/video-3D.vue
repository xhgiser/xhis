<!-- 航拍视频 -->
<template>
  <div id="cesiumContainer">
    <el-dialog v-model="videoDialogVisible" :title="videoName" width="58%">
      <video-player
        class="video-player vjs-big-play-centered"
        :src="videoUrl"
        :poster="videoPoster"
        crossorigin="anonymous"
        playsinline
        controls
        :volume="0"
        :height="770"
        :playback-rates="[0.5, 1.0, 2.0, 3.0, 5.0]"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium'

import { VideoJsPlayer } from 'video.js'
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

//import SuperGif from '@/utils/libgif'

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

  //视频标牌
  initVideoBillboard()
}

//视频数据
const videoData = [
  {
    name: '草桥沟',
    url: 'http://192.168.188.8/Video/草桥沟.mp4',
    billboard: require('@/assets/images/VideoBillboard/草桥沟.png'),
    longitude: '118.4467',
    latitude: '37.6451',
  },
  {
    name: '草桥沟东干流',
    url: 'http://192.168.188.8/Video/草桥沟东干流.mp4',
    billboard: require('@/assets/images/VideoBillboard/草桥沟东干流.png'),
    longitude: '118.53066',
    latitude: '37.6442',
  },
  {
    name: '刁口河',
    url: 'http://192.168.188.8/Video/刁口河.mp4',
    billboard: require('@/assets/images/VideoBillboard/刁口河.png'),
    longitude: '118.6763',
    latitude: '37.7301',
  },
  {
    name: '东营河-开发区段',
    url: 'http://192.168.188.8/Video/东营河-开发区段.mp4',
    billboard: require('@/assets/images/VideoBillboard/东营河-开发区段.png'),
    longitude: '118.623',
    latitude: '37.4705',
  },
  {
    name: '广利河-上游至胜利机场',
    url: 'http://192.168.188.8/Video/广利河-上游至胜利机场.mp4',
    billboard: require('@/assets/images/VideoBillboard/广利河-上游至胜利机场.png'),
    longitude: '118.3782',
    latitude: '37.5702',
  },
  {
    name: '广利河-下游',
    url: 'http://192.168.188.8/Video/广利河-下游.mp4',
    billboard: require('@/assets/images/VideoBillboard/广利河-下游.png'),
    longitude: '118.8344',
    latitude: '37.4107',
  },
  {
    name: '黄河-大堤内测',
    url: 'http://192.168.188.8/Video/黄河-大堤内测.mp4',
    billboard: require('@/assets/images/VideoBillboard/黄河-大堤内侧.png'),
    longitude: '118.1417',
    latitude: '37.3833',
  },
  {
    name: '黄河-大堤外侧',
    url: 'http://192.168.188.8/Video/黄河-大堤外侧.mp4',
    billboard: require('@/assets/images/VideoBillboard/黄河-大堤外侧.png'),
    longitude: '118.1575',
    latitude: '37.392',
  },
  {
    name: '胶东调水',
    url: 'http://192.168.188.8/Video/胶东调水.mp4',
    billboard: require('@/assets/images/VideoBillboard/胶东调水.png'),
    longitude: '119.470',
    latitude: '36.7678',
  },
  {
    name: '六干排',
    url: 'http://192.168.188.8/Video/六干排.mp4',
    billboard: require('@/assets/images/VideoBillboard/六干排.png'),
    longitude: '118.6702',
    latitude: '37.5206',
  },
  {
    name: '南郊水库',
    url: 'http://192.168.188.8/Video/南郊水库.mp4',
    billboard: require('@/assets/images/VideoBillboard/南郊水库.png'),
    longitude: '118.6929',
    latitude: '37.4003',
  },
  {
    name: '太平河',
    url: 'http://192.168.188.8/Video/太平河.mp4',
    billboard: require('@/assets/images/VideoBillboard/太平河.png'),
    longitude: '118.2612',
    latitude: '37.5219',
  },
  {
    name: '挑河',
    url: 'http://192.168.188.8/Video/挑河.mp4',
    billboard: require('@/assets/images/VideoBillboard/挑河.png'),
    longitude: '118.5840',
    latitude: '37.7345',
  },
  {
    name: '五干排',
    url: 'http://192.168.188.8/Video/五干排.mp4',
    billboard: require('@/assets/images/VideoBillboard/五干排.png'),
    longitude: '118.3548',
    latitude: '37.4264',
  },
  {
    name: '五六干合排',
    url: 'http://192.168.188.8/Video/五六干合排.mp4',
    billboard: require('@/assets/images/VideoBillboard/五六干合排.png'),
    longitude: '118.3245',
    latitude: '37.47086',
  },
  {
    name: '武家大沟-东二路至西范小学',
    url: 'http://192.168.188.8/Video/武家大沟-东二路至西范小学.mp4',
    billboard: require('@/assets/images/VideoBillboard/武家大沟-东二路至西范小学.png'),
    longitude: '118.6417',
    latitude: '37.3242',
  },
  {
    name: '武家大沟-西范村至支脉河',
    url: 'http://192.168.188.8/Video/武家大沟-西范村至支脉河.mp4',
    billboard: require('@/assets/images/VideoBillboard/武家大沟-西范村至支脉河.png'),
    longitude: '118.4188',
    latitude: '37.3160',
  },
  {
    name: '小清河',
    url: 'http://192.168.188.8/Video/小清河.mp4',
    billboard: require('@/assets/images/VideoBillboard/小清河.png'),
    longitude: '118.35866',
    latitude: '37.14686',
  },
  {
    name: '阳河-东营段',
    url: 'http://192.168.188.8/Video/阳河-东营段.mp4',
    billboard: require('@/assets/images/VideoBillboard/阳河-东营段.png'),
    longitude: '118.5212',
    latitude: '36.9405',
  },
  {
    name: '溢洪河',
    url: 'http://192.168.188.8/Video/溢洪河.mp4',
    billboard: require('@/assets/images/VideoBillboard/溢洪河.png'),
    longitude: '118.58678',
    latitude: '36.5618',
  },
  {
    name: '沾利河',
    url: 'http://192.168.188.8/Video/沾利河.mp4',
    billboard: require('@/assets/images/VideoBillboard/沾利河.png'),
    longitude: '118.29615',
    latitude: '37.54136',
  },
  {
    name: '支脉河-东营段',
    url: 'http://192.168.188.8/Video/支脉河-东营段.mp4',
    billboard: require('@/assets/images/VideoBillboard/支脉河-东营段.png'),
    longitude: '118.8993',
    latitude: '37.35826',
  },
  {
    name: '织女河',
    url: 'http://192.168.188.8/Video/织女河.mp4',
    billboard: require('@/assets/images/VideoBillboard/织女河.png'),
    longitude: '118.48226',
    latitude: '36.9556',
  },
  {
    name: '白马河',
    url: 'http://192.168.188.8/Video/白马河.mp4',
    billboard: require('@/assets/images/VideoBillboard/白马河.png'),
    longitude: '116.701',
    latitude: '35.1',
  },
  {
    name: '洸府河',
    url: 'http://192.168.188.8/Video/洸府河.mp4',
    billboard: require('@/assets/images/VideoBillboard/洸府河.png'),
    longitude: '116.7447',
    latitude: '35.697',
  },
  {
    name: '济河',
    url: 'http://192.168.188.8/Video/济河.mp4',
    billboard: require('@/assets/images/VideoBillboard/济河.png'),
    longitude: '117.271',
    latitude: '35.682',
  },
  {
    name: '石莱河',
    url: 'http://192.168.188.8/Video/石莱河.mp4',
    billboard: require('@/assets/images/VideoBillboard/石莱河.png'),
    longitude: '117.463',
    latitude: '35.647',
  },
  {
    name: '泗河',
    url: 'http://192.168.188.8/Video/泗河.mp4',
    billboard: require('@/assets/images/VideoBillboard/泗河.png'),
    longitude: '116.665',
    latitude: '35.238',
  },
  {
    name: '小沂河',
    url: 'http://192.168.188.8/Video/小沂河.mp4',
    billboard: require('@/assets/images/VideoBillboard/小沂河.png'),
    longitude: '116.850',
    latitude: '35.55',
  },
]

//视频播放配置
const videoName = ref('')
const videoUrl = ref('')
const videoPoster = ref('')

//视频对话框显示控制
const videoDialogVisible = ref(false)

//视频所在位置标牌
function initVideoBillboard() {
  for (let i = 0; i < videoData.length; i++) {
    viewer.value.entities.add({
      name: videoData[i].name,
      position: Cesium.Cartesian3.fromDegrees(
        +videoData[i].longitude,
        +videoData[i].latitude
      ),
      billboard: {
        image: videoData[i].billboard,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 3, 1.5e7, 1),
        height: 27,
        width: 30,
      },
    })
  }

  //鼠标滑过标牌变小手
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)
  handler.setInputAction(function (movement) {
    const pickedObject = viewer.value.scene.pick(movement.endPosition)
    if (Cesium.defined(pickedObject)) {
      viewer.value._container.style.cursor = 'pointer'
    } else {
      viewer.value._container.style.cursor = 'default'
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  //点击标牌播放视频事件
  const handlerVideo = new Cesium.ScreenSpaceEventHandler(
    viewer.value.scene.canvas
  )
  handlerVideo.setInputAction(function (click) {
    const pick = viewer.value.scene.pick(click.position)
    if (pick) {
      console.log(pick.id._name)
      videoDialogVisible.value = true
      videoName.value = pick.id._name
      videoUrl.value = 'http://192.168.188.8/Video/' + pick.id._name + '.mp4'
      videoPoster.value = require('@/assets/images/VideoPoster/' +
        pick.id._name +
        '.jpg')
    } else {
      return
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

//视频所在位置动态标牌 备份
// const image = new Image()
// image.src = require('@/assets/images/VideoBillboard/草桥沟.gif')
// const superGif = new SuperGif({ gif: image })
// superGif.load(function () {
//   viewer.value.entities.add({
//     name: '广利河',
//     position: Cesium.Cartesian3.fromDegrees(119.47, 36.7678),
//     // label: {
//     //   text: '广利河',
//     //   font: '500 30px Helvetica', // 15pt monospace
//     //   scale: 0.5,
//     //   style: Cesium.LabelStyle.FILL,
//     //   fillColor: Cesium.Color.WHITE,
//     //   pixelOffset: new Cesium.Cartesian2(0, -60), //偏移量
//     //   showBackground: false,
//     //   // backgroundColor: new Cesium.Color(26 / 255, 196 / 255, 228 / 255, 1.0)   //背景顔色
//     // },
//     billboard: {
//       image: new Cesium.CallbackProperty(() => {
//         return superGif.get_canvas().toDataURL('image/png')
//       }, false),
//       verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//       heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
//       horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
//       scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.5, 1.5e7, 1.5),
//       height: 32,
//       width: 32,
//     },
//   })

//   //鼠标滑过标牌变小手
//   const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)
//   handler.setInputAction(function (movement) {
//     const pickedObject = viewer.value.scene.pick(movement.endPosition)
//     if (Cesium.defined(pickedObject)) {
//       viewer.value._container.style.cursor = 'pointer'
//     } else {
//       viewer.value._container.style.cursor = 'default'
//     }
//   }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

//   //点击标牌播放视频事件
//   const handlerVideo = new Cesium.ScreenSpaceEventHandler(
//     viewer.value.scene.canvas
//   )
//   handlerVideo.setInputAction(function (click) {
//     const pick = viewer.value.scene.pick(click.position)
//     if (pick && pick.id._name == '广利河') {
//       videoUrl.value = 'http://192.168.188.8/Video/五六干合排.mp4'
//       videoDialogVisible.value = true
//     } else {
//       return
//     }
//   }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
// })

onMounted(() => {
  initCesium()
})
</script>

<style scoped>
@import 'cesium/widgets.css';

#cesiumContainer {
  height: 99.5%;
}

:deep(.el-dialog) {
  left: 100px;
  top: 120px;
  margin: 0 auto;
  /* background-color: #454b52; */
  background-color: rgb(26, 25, 25);
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-dialog__header) {
  padding: 15px;
  /* padding-bottom: 25px; */
}

:deep(.el-dialog__title) {
  color: #fff;
  font-family: '微软雅黑';
  font-weight: 600;
}

:deep(.el-dialog__headerbtn) {
  top: 2px;
}
:deep(.el-dialog__close) {
  color: #fff;
}

.video-player {
  background-color: black;
  width: 100%;
}
</style>
