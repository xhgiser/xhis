<!-- 规划一张图 -->
<template>
  <div id="map">
    <!-- 图层与标绘工具 -->
    <LayerAndDraw
      :selecttc="selecttc"
      :selectbh="selectbh"
      :layersTree="layersTree"
      :defaultExpandedKeys="defaultExpandedKeys"
      :defaultCheckedKeys="defaultCheckedKeys"
      @clicktc="clicktc"
      @clickbh="clickbh"
      @layerTreeClick="layerTreeClick"
      @drawFeatures="drawFeatures"
    ></LayerAndDraw>
    <!-- 地图工具 -->
    <MapTool
      :coordinates="coordinates"
      @reset="reset"
      @locate="locate"
      @zoomOut="zoomOut"
      @zoomIn="zoomIn"
      @rotate="rotate"
      @clear="clear"
      @lineMeasure="lineMeasure"
      @areaMeasure="areaMeasure"
      @stopMeasure="stopMeasure"
      @importKml="importKml"
      @importKmz="importKmz"
      @importShp="importShp"
      @importShpZip="importShpZip"
      @importGeojson="importGeojson"
      @exportJpeg="exportJpeg"
      @exportPdf="exportPdf"
      @exportKml="exportKml"
      @closeUpload="closeUpload"
    ></MapTool>
    <!-- 底图切换工具 -->
    <BasemapToggle
      :basemapImage="basemapImage"
      @basemapToggle="basemapToggle"
    ></BasemapToggle>
    <!-- 属性查询弹窗 -->
    <PropertyPopup
      :propertyTableData="propertyTableData"
      :tableFeatureName="tableFeatureName"
      @closePopup="closePopup"
    ></PropertyPopup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Map, View } from 'ol'
import * as control from 'ol/control'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { XYZ, TileWMS, OSM, Vector as VectorSource } from 'ol/source'
import Overlay from 'ol/Overlay'
import { defaults as defaultInteractions } from 'ol/interaction'
import 'ol/ol.css'
import { toStringHDMS } from 'ol/coordinate'
import Feature from 'ol/Feature'
import Geolocation from 'ol/Geolocation'
import Point from 'ol/geom/Point'
import { Circle, Fill, Stroke, Style, Text } from 'ol/style'
import MeasureTool from '@/utils/measure'
import KML from 'ol/format/KML'
import GeoJSON from 'ol/format/GeoJSON'
import Draw from 'ol/interaction/Draw'
import { jsPDF } from 'jspdf'
import { saveAs } from 'file-saver'

import LayerAndDraw from '@/components/Common/LayerAndDraw'
import MapTool from '@/components/Common/MapTool'
import BasemapToggle from '@/components/Common/BasemapToggle'
import PropertyPopup from '@/components/Common/PropertyPopup'

import MapConfig from '@/config/map-config'

/* 地图定义 */
const map = ref(null)
const view = new View({
  center: [118.7, 37.4],
  projection: 'EPSG:4326', //指定投影
  zoom: 12,
})
let layers = []

/* 底图 */
//天地图注记图层
const tdcvaLayer = MapConfig.tdcvaLayer
layers.unshift(tdcvaLayer)
//天地图矢量图层
const tdvecLayer = MapConfig.tdvecLayer
layers.unshift(tdvecLayer)
//天地图影像图层
const tdimgLayer = MapConfig.tdimgLayer
layers.unshift(tdimgLayer)
//天地图地形图层
const tdterLayer = MapConfig.tdterLayer
layers.unshift(tdterLayer)
//星图矢量图层
const xtvecLayer = MapConfig.xtvecLayer
layers.unshift(xtvecLayer)
//星图影像注记
const xtciaLayer = MapConfig.xtciaLayer
layers.unshift(xtciaLayer)
//星图影像图层
const xtimgLayer = MapConfig.xtimgLayer
layers.unshift(xtimgLayer)
//星图地形
const xtterLayer = MapConfig.xtterLayer
layers.unshift(xtterLayer)

/* 地图初始化 */
function initMap() {
  map.value = new Map({
    target: 'map',
    layers: layers,
    view: view,
    controls: control
      .defaults({
        // attribution: false, //禁用右下角的地图属性组件
        rotate: false, //禁用旋转组件 alt+shift true旋转交互时会有一个旋转控件显示出来
        zoom: false, //禁用右上角缩放组件
      })
      .extend([
        new control.ScaleLine({
          units: 'metric',
          bar: true,
          //单位包括：degrees：度数；imperial：imperial inch；us：us incn；nautical：nautical mile；metric：千米
        }), //比例尺控件
        new control.OverviewMap({
          className: 'ol-overviewmap',
          collapsed: false,
          collapsible: true,
          rotateWithView: true,
          tipLabel: '鹰眼',
          layers: [
            new TileLayer({
              title: '星图地球矢量',
              source: new XYZ({
                url:
                  'https://tiles1.geovisearth.com/base/v1/vec/{z}/{x}/{y}?format=png&tmsIds=w&token=' +
                  MapConfig.xttoken,
                crossOrigin: 'anonymous',
              }),
            }),
          ],
        }), //鹰眼控件
        new control.Attribution({
          collapsed: false,
        }), //版权信息不可折叠
        //new control.FullScreen(), //全屏
        new control.MousePosition({
          coordinateFormat: function (e) {
            return toStringHDMS(e)
            let stringifyFunc = createStringXY(4)
            let str = stringifyFunc(e)
            return (
              'X: ' + str.split(',')[0] + '&nbsp;' + ' Y: ' + str.split(',')[1]
            )
          },
          projection: 'ESPG:4326',
        }), //鼠标位置坐标
      ]),
    interactions: defaultInteractions({
      doubleClickZoom: false, //是否需要双击缩放
    }),
  })
  //geoserver图层添加至地图
  addLayersToMap()

  //属性查询
  getClickInfo()

  //鼠标经过图层变小手
  pointermoveChange()

  //当前定位点添加至地图
  new VectorLayer({
    map: map.value,
    source: new VectorSource({
      features: [positionFeature],
      wrapX: false,
    }),
  })

  //导入本地文件
  addKmlLayer()
  addKmzLayer()
  addShpLayer()
  addShpZipLayer()
  addGeojsonLayer()
}

/* geoserver图层添加至地图 */
const geoserverLayres = MapConfig.planLayers
function addLayersToMap() {
  geoserverLayres.forEach((layerObject, index) => {
    if (layerObject) {
      map.value.addLayer(layerObject.layer)
    }
  })
}

/* 鼠标经过geoserver图层变小手 */
function pointermoveChange() {
  //鼠标经过图层变小手
  map.value.on('pointermove', function (evt) {
    if (evt.dragging) {
      return
    }

    let dataArray = []
    geoserverLayres.forEach((layerObject) => {
      const data = layerObject.layer.getData(evt.pixel)
      dataArray.push(data)
    })
    //console.log(dataArray.length)
    const dataJudge =
      (dataArray[0] && dataArray[0][3]) ||
      (dataArray[1] && dataArray[1][3]) ||
      (dataArray[2] && dataArray[2][3]) ||
      (dataArray[3] && dataArray[3][3]) ||
      (dataArray[4] && dataArray[4][3]) ||
      (dataArray[5] && dataArray[5][3]) ||
      (dataArray[6] && dataArray[6][3]) ||
      (dataArray[7] && dataArray[7][3]) ||
      (dataArray[8] && dataArray[8][3]) ||
      (dataArray[9] && dataArray[9][3]) ||
      (dataArray[10] && dataArray[10][3]) ||
      (dataArray[11] && dataArray[11][3]) ||
      (dataArray[12] && dataArray[12][3]) ||
      (dataArray[13] && dataArray[13][3]) ||
      (dataArray[14] && dataArray[14][3]) ||
      (dataArray[15] && dataArray[15][3]) ||
      (dataArray[16] && dataArray[16][3]) ||
      (dataArray[17] && dataArray[17][3]) ||
      (dataArray[18] && dataArray[18][3]) ||
      (dataArray[19] && dataArray[19][3]) ||
      (dataArray[20] && dataArray[20][3]) ||
      (dataArray[21] && dataArray[21][3]) ||
      (dataArray[22] && dataArray[22][3]) ||
      (dataArray[23] && dataArray[23][3]) ||
      (dataArray[24] && dataArray[24][3]) ||
      (dataArray[25] && dataArray[25][3]) ||
      (dataArray[26] && dataArray[26][3]) ||
      (dataArray[27] && dataArray[27][3]) ||
      (dataArray[28] && dataArray[28][3]) ||
      (dataArray[29] && dataArray[29][3]) ||
      (dataArray[30] && dataArray[30][3]) ||
      (dataArray[31] && dataArray[31][3]) ||
      (dataArray[32] && dataArray[32][3]) ||
      (dataArray[33] && dataArray[33][3]) ||
      (dataArray[34] && dataArray[34][3]) ||
      (dataArray[35] && dataArray[35][3]) ||
      (dataArray[36] && dataArray[36][3]) ||
      (dataArray[37] && dataArray[37][3]) ||
      (dataArray[38] && dataArray[38][3]) ||
      (dataArray[39] && dataArray[39][3]) ||
      (dataArray[40] && dataArray[40][3]) ||
      (dataArray[41] && dataArray[41][3]) ||
      (dataArray[42] && dataArray[42][3]) ||
      (dataArray[43] && dataArray[43][3]) ||
      (dataArray[44] && dataArray[44][3])

    const hit = dataJudge

    map.value.getTargetElement().style.cursor = hit ? 'pointer' : ''
  })
}

/* 获取点击处属性信息 */
let propertyTableData = ref([])
let tableFeatureName = ref('')
let popupInfo = reactive({})
let propertiesInfo = reactive({})
let newArray = ref([])
let popup
function getClickInfo() {
  popup = new Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  })

  map.value.on('singleclick', function (evt) {
    geoserverLayres.forEach((layerObject) => {
      if (layerObject.layer.getVisible()) {
        const coordinate = evt.coordinate
        const viewResolution = /** @type {number} */ (view.getResolution())
        const url = layerObject.layer
          .getSource()
          .getFeatureInfoUrl(coordinate, viewResolution, 'EPSG:4326', {
            INFO_FORMAT: 'application/json',
            FEATURE_COUNT: 1,
          })
        if (url) {
          fetch(url)
            .then((response) => response.text())
            .then((json) => {
              propertyTableData.value.length = 0
              popupInfo = JSON.parse(json)
              if (popupInfo.features.length) {
                let data = popupInfo.features[0].properties
                propertiesInfo = Object.keys(data).reduce((newData, key) => {
                  //更换字段为别名，字段映射表里若无该字段将删除
                  let newKey = MapConfig.fieldMap[key]
                  if (newKey) {
                    newData[newKey] = data[key]
                  } else {
                    delete data[key]
                  }
                  return newData
                }, {})
                //弹窗标题
                tableFeatureName.value =
                  popupInfo.features[0].properties.name ||
                  popupInfo.features[0].properties.rivername ||
                  popupInfo.features[0].properties.floodname ||
                  popupInfo.features[0].properties.irrname ||
                  popupInfo.features[0].properties.gxlx ||
                  popupInfo.features[0].properties.dlmc ||
                  popupInfo.features[0].properties.unitname ||
                  popupInfo.features[0].properties.dcname ||
                  popupInfo.features[0].properties.lsname ||
                  '属性查询'
                for (let [key, value] of Object.entries(propertiesInfo)) {
                  newArray = { key: key, value: value }
                  propertyTableData.value.push(newArray)
                }
                popup.setPosition(coordinate)
                map.value.addOverlay(popup)
              }
            })
        }
      }
    })

    //点击空白处关闭弹窗
    if (tableFeatureName.value != '') {
      popup.setPosition(undefined)
    }
  })
}

//点击关闭按钮关闭弹窗
function closePopup() {
  popup.setPosition(undefined)
}

/* 图层与标绘 */
//geoserver图层树结构
const layersTree = [
  {
    id: 1,
    label: '国土调查土地利用',
    layerName: '',
    visible: false,
    children: [
      {
        id: 2,
        label: '采矿用地',
        layerName: 'xhis:plan_gtdc_ckyd',
        visible: false,
      },
      {
        id: 3,
        label: '城镇村道路用地',
        layerName: 'xhis:plan_gtdc_czcdlyd',
        visible: false,
      },
      {
        id: 4,
        label: '城镇住宅用地',
        layerName: 'xhis:plan_gtdc_czzzyd',
        visible: false,
      },
      {
        id: 5,
        label: '干渠',
        layerName: 'xhis:plan_gtdc_ganq',
        visible: false,
      },
      {
        id: 6,
        label: '港口码头用地',
        layerName: 'xhis:plan_gtdc_gkmtyd',
        visible: false,
      },
      {
        id: 7,
        label: '高教用地',
        layerName: 'xhis:plan_gtdc_gjyd',
        visible: false,
      },
      {
        id: 8,
        label: '工业用地',
        layerName: 'xhis:plan_gtdc_gyyd',
        visible: false,
      },
      {
        id: 9,
        label: '公路用地',
        layerName: 'xhis:plan_gtdc_glyd',
        visible: false,
      },
      {
        id: 10,
        label: '公用设施用地',
        layerName: 'xhis:plan_gtdc_gyssyd',
        visible: false,
      },
      {
        id: 11,
        label: '公园与绿地',
        layerName: 'xhis:plan_gtdc_gyyld',
        visible: false,
      },
      {
        id: 12,
        label: '沟渠',
        layerName: 'xhis:plan_gtdc_gouq',
        visible: false,
      },
      {
        id: 13,
        label: '管道运输用地',
        layerName: 'xhis:plan_gtdc_gdysyd',
        visible: false,
      },
      {
        id: 14,
        label: '灌木林地',
        layerName: 'xhis:plan_gtdc_gmld',
        visible: false,
      },
      {
        id: 15,
        label: '广场用地',
        layerName: 'xhis:plan_gtdc_gcyd',
        visible: false,
      },
      {
        id: 16,
        label: '果园',
        layerName: 'xhis:plan_gtdc_gy',
        visible: false,
      },
      {
        id: 17,
        label: '旱地',
        layerName: 'xhis:plan_gtdc_hd',
        visible: false,
      },
      {
        id: 18,
        label: '河流水面',
        layerName: 'xhis:plan_gtdc_hlsm',
        visible: false,
      },
      {
        id: 19,
        label: '机场用地',
        layerName: 'xhis:plan_gtdc_jcyd',
        visible: false,
      },
      {
        id: 20,
        label: '机关团体新闻出版用地',
        layerName: 'xhis:plan_gtdc_jgttxwcbyd',
        visible: false,
      },
      {
        id: 21,
        label: '交通服务场站用地',
        layerName: 'xhis:plan_gtdc_jtfwczyd',
        visible: false,
      },
      {
        id: 22,
        label: '科教文卫用地',
        layerName: 'xhis:plan_gtdc_kjwwyd',
        visible: false,
      },
      {
        id: 23,
        label: '可调整人工牧草地',
        layerName: 'xhis:plan_gtdc_ktzrgmcd',
        visible: false,
      },
      {
        id: 24,
        label: '坑塘水面',
        layerName: 'xhis:plan_gtdc_ktsm',
        visible: false,
      },
      {
        id: 25,
        label: '空闲地',
        layerName: 'xhis:plan_gtdc_kxd',
        visible: false,
      },
      {
        id: 26,
        label: '裸土地',
        layerName: 'xhis:plan_gtdc_ltd',
        visible: false,
      },
      {
        id: 27,
        label: '内陆滩涂',
        layerName: 'xhis:plan_gtdc_nltt',
        visible: false,
      },
      {
        id: 28,
        label: '农村道路',
        layerName: 'xhis:plan_gtdc_ncdl',
        visible: false,
      },
      {
        id: 29,
        label: '农村宅基地',
        layerName: 'xhis:plan_gtdc_nczjd',
        visible: false,
      },
      {
        id: 30,
        label: '其他草地',
        layerName: 'xhis:plan_gtdc_qtcd',
        visible: false,
      },
      {
        id: 31,
        label: '其他林地',
        layerName: 'xhis:plan_gtdc_qtld',
        visible: false,
      },
      {
        id: 32,
        label: '其他园地',
        layerName: 'xhis:plan_gtdc_qtyd',
        visible: false,
      },
      {
        id: 33,
        label: '乔木林地',
        layerName: 'xhis:plan_gtdc_qmld',
        visible: false,
      },
      {
        id: 34,
        label: '人工牧草地',
        layerName: 'xhis:plan_gtdc_rgmcd',
        visible: false,
      },
      {
        id: 35,
        label: '商业服务业设施用地',
        layerName: 'xhis:plan_gtdc_syfwyssyd',
        visible: false,
      },
      {
        id: 36,
        label: '设施农用地',
        layerName: 'xhis:plan_gtdc_ssnyd',
        visible: false,
      },
      {
        id: 37,
        label: '水工建筑用地',
        layerName: 'xhis:plan_gtdc_sgjzyd',
        visible: false,
      },
      {
        id: 38,
        label: '水浇地',
        layerName: 'xhis:plan_gtdc_sjd',
        visible: false,
      },
      {
        id: 39,
        label: '水库水面',
        layerName: 'xhis:plan_gtdc_sksm',
        visible: false,
      },
      {
        id: 40,
        label: '水田',
        layerName: 'xhis:plan_gtdc_st',
        visible: false,
      },
      {
        id: 41,
        label: '特殊用地',
        layerName: 'xhis:plan_gtdc_tsyd',
        visible: false,
      },
      {
        id: 42,
        label: '铁路用地',
        layerName: 'xhis:plan_gtdc_tlyd',
        visible: false,
      },
      {
        id: 43,
        label: '物流仓储用地',
        layerName: 'xhis:plan_gtdc_wlccyd',
        visible: false,
      },
      {
        id: 44,
        label: '沿海滩涂',
        layerName: 'xhis:plan_gtdc_yhtt',
        visible: false,
      },
      {
        id: 45,
        label: '盐碱地',
        layerName: 'xhis:plan_gtdc_yjd',
        visible: false,
      },
      {
        id: 46,
        label: '盐田',
        layerName: 'xhis:plan_gtdc_yt',
        visible: false,
      },
      {
        id: 47,
        label: '养殖坑塘',
        layerName: 'xhis:plan_gtdc_yzkt',
        visible: false,
      },
    ],
  },
]
//图层展开id
const defaultExpandedKeys = '1'
//图层选择id
const defaultCheckedKeys = ''

//图层标绘两个按钮按下样式切换
const selecttc = ref('false')
const selectbh = ref(null)
function clicktc() {
  selecttc.value = 'false'
  selectbh.value = null
  document.getElementById('layer-card').style.display = 'block'
  document.getElementById('draw-card').style.display = 'none'
}
function clickbh() {
  selecttc.value = null
  selectbh.value = 'false'
  document.getElementById('layer-card').style.display = 'none'
  document.getElementById('draw-card').style.display = 'block'
}

//图层控制
function layerTreeClick(data, check) {
  const layers = map.value.getLayers().array_
  layers.forEach((layer) => {
    if (
      //geoserver图层不能添加title属性
      !('title' in layer.values_) &&
      data.layerName == layer.values_.source.params_.LAYERS
    ) {
      layer.setVisible(check)
    }
  })
}

//标绘
const draw = ref(null)
const drawSource = new VectorSource({
  wrapX: false,
})
function drawFeatures(value) {
  map.value.removeInteraction(draw.value)
  ElMessage({
    showClose: true,
    message: '按Esc键结束标绘',
    center: true,
    duration: 6000,
    type: 'warning',
  })

  document.onkeyup = function (e) {
    if (e.code == 'Escape') {
      map.value.removeInteraction(draw.value)
    }
  }

  let type
  switch (value) {
    case '点标绘':
      type = 'Point'
      break
    case '线标绘':
      type = 'LineString'
      break
    case '面标绘':
      type = 'Polygon'
      break
  }
  draw.value = new Draw({
    source: drawSource,
    type: type,
  })
  map.value.addInteraction(draw.value)
  const drawLayer = new VectorLayer({
    title: '标绘图层',
    source: drawSource,
  })
  map.value.addLayer(drawLayer)
}

/* 地图工具 */
//默认视图
const zoom = view.getZoom()
const center = view.getCenter()
const rotation = view.getRotation()
function reset() {
  map.value.getView().setZoom(zoom)
  map.value.getView().setCenter(center)
  map.value.getView().setRotation(rotation)
}

//定位
let geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(),
})
geolocation.setTracking(true)

const positionFeature = new Feature()
positionFeature.setStyle(
  new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({
        color: '#3399CC',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  })
)

//直接获取的定位坐标有偏移,手动修正
let falseCoordinates = []
let coordinates = []
geolocation.on('change:position', function () {
  falseCoordinates = geolocation.getPosition()
  coordinates[0] = falseCoordinates[0] + 0.1735
  coordinates[1] = falseCoordinates[1] - 0.0679
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null)
})

function locate() {
  //console.log(coordinates)
  map.value.getView().animate({
    center: coordinates,
    duration: 2000,
  })
}

//缩小
function zoomOut() {
  let zoom = map.value.getView().getZoom()
  map.value.getView().setZoom(zoom - 1)
}

//放大
function zoomIn() {
  let zoom = map.value.getView().getZoom()
  map.value.getView().setZoom(zoom + 1)
}

//旋转
function rotate() {
  map.value
    .getView()
    .setRotation(map.value.getView().getRotation() + Math.PI / 2)
}

//清屏
function clear() {
  //清除测量图层，中间参数为空
  MeasureTool.measure(map.value, '', false)
  //清除导入的图层
  kmlSource.clear()
  shpSource.clear()
  geojsonSource.clear()
  //清除标绘图层
  drawSource.clear()
  // if (map.value.getControls().array_.length == 5) {
  //   map.value.removeControl(map.value.getControls().array_[4])
  //console.log(map.value.getControls().array_[4])
  //}
}

/* 地图工具 */
//距离测量
function lineMeasure() {
  MeasureTool.measure(map.value, 'length', true)
}

//面积测量
function areaMeasure() {
  MeasureTool.measure(map.value, 'area', true)
}

//停止测量
function stopMeasure() {
  MeasureTool.measure(map.value, '', false)
}

//导入
const jsZip = require('jszip')
const shapefile = require('shapefile')
const kmlSource = new VectorSource({
  wrapX: false,
  format: new KML({
    extractStyles: false,
  }),
})
const shpSource = new VectorSource({
  wrapX: false,
})
const geojsonSource = new VectorSource({
  wrapX: false,
  format: new GeoJSON({}),
})

//随机生成RGBA颜色
function randomRgbaColor() {
  var r = Math.floor(Math.random() * 256) //随机生成256以内r值
  var g = Math.floor(Math.random() * 256) //随机生成256以内g值
  var b = Math.floor(Math.random() * 256) //随机生成256以内b值
  var alpha = 1 // Math.random(); //随机生成1以内a值
  return `rgb(${r},${g},${b},${alpha})` //返回rgba(r,g,b,a)格式颜色
}
//关闭导入对话框
function closeUpload() {
  document.getElementById('import-kml').style.display = 'none'
  document.getElementById('import-kmz').style.display = 'none'
  document.getElementById('import-shp').style.display = 'none'
  document.getElementById('import-shp-zip').style.display = 'none'
  document.getElementById('import-Geojson').style.display = 'none'
}
//导入KML
function importKml() {
  closeUpload()
  document.getElementById('import-kml').style.display = 'block'
}
function addKmlLayer() {
  let fileselect = document.querySelector('#kml-file')
  fileselect.addEventListener(
    'change',
    function (e) {
      let files = e.target.files
      let filetype = files[0].name.split('.')[1]
      // console.log('文件类型' + filetype)
      if (files.length === 0 || filetype != 'kml') {
        ElMessageBox.alert('请重新上传kml格式的文件！', '文件选择错误', {
          confirmButtonText: '确定',
        })
        return
      }
      let reader = new FileReader()
      reader.readAsText(files[0]) //读取KML文件的形式

      reader.onload = function (evt) {
        let shparray = evt.target.result

        // let allFeatures=new KML().readFeatures(shparray,
        let allFeatures = kmlSource.getFormat().readFeatures(shparray, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326',
        })

        kmlSource.addFeatures(allFeatures)

        kmlSource.forEachFeature(function (feature) {
          let style = new Style({
            fill: new Fill({ color: '#8fb2c9' }),
            stroke: new Stroke({ color: 'orange' }),
            text: new Text({
              text: feature.get('name'),
              font: '12px Calibri,sans-serif',
              fill: new Fill({ color: '#000' }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
            }),
          })
          feature.setStyle(style)
        })
      }
    }.bind()
  )
  const kmlLayer = new VectorLayer({
    title: 'kml图层',
    source: kmlSource,
  })
  map.value.addLayer(kmlLayer)
}
//导入KMZ
function importKmz() {
  closeUpload()
  document.getElementById('import-kmz').style.display = 'block'
}
function addKmzLayer() {
  let fileselect = document.querySelector('#kmz-file')
  fileselect.addEventListener(
    'change',
    function (e) {
      let files = e.target.files
      let filetype = files[0].name.substring(files[0].name.lastIndexOf('.') + 1)
      // console.log('文件类型' + filetype)
      if (files.length === 0 || filetype != 'kmz') {
        ElMessageBox.alert('请重新上传kml格式的文件！', '文件选择错误', {
          confirmButtonText: '确定',
        })
        return
      }
      let zip = new jsZip()
      zip.loadAsync(files[0]).then(function (zip11) {
        //读取包含kml的文件,这是示例最难点
        const kmlFile = zip
          .file(/.kml$/i)[0]
          .async('string')
          .then((item) => {
            let allFeatures = new KML().readFeatures(item, {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:4326',
            })
            kmlSource.addFeatures(allFeatures)

            kmlSource.forEachFeature(function (feature) {
              let style = new Style({
                fill: new Fill({
                  color: '#8fb2c9',
                }),
                stroke: new Stroke({
                  color: 'orange',
                }),
                image: new Circle({
                  //点样式
                  radius: 10,
                  fill: new Fill({ color: randomRgbaColor() }),
                  stroke: new Stroke({ color: '#fff', width: 2 }),
                }),
                text: new Text({
                  text: feature.get('name') || ' ',
                  font: '12px Calibri,sans-serif',
                  fill: new Fill({ color: '#000' }),
                  stroke: new Stroke({ color: '#fff', width: 2 }),
                  offsetX: '20',
                  offsetY: '20',
                }),
              })
              feature.setStyle(style)
            })
          })
      })
    }.bind()
  )
  const kmzLayer = new VectorLayer({
    title: 'kmz图层',
    source: kmlSource,
  })
  map.value.addLayer(kmzLayer)
}
//导入SHP
function importShp() {
  closeUpload()
  document.getElementById('import-shp').style.display = 'block'
}
function addShpLayer() {
  let fileselect = document.querySelector('#shp-file')
  fileselect.addEventListener(
    'change',
    function (e) {
      // console.log(e)
      let files = e.target.files
      let filetype = files[0].name.split('.')[1]
      // console.log('文件类型' + filetype)
      if (files.length === 0 || filetype != 'shp') {
        ElMessageBox.alert('请重新上传shp格式的文件！', '文件选择错误', {
          confirmButtonText: '确定',
        })
        return
      }
      let reader = new FileReader()
      reader.readAsArrayBuffer(files[0]) //获取数组数据

      reader.onload = function (evt) {
        let shparray = evt.target.result
        shapefile
          .open(shparray)
          .then((source) =>
            source.read().then(function log(result) {
              if (result.done) return
              var feature = new GeoJSON().readFeature(result.value, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:4326',
              })
              let style = new Style({
                fill: new Fill({
                  color: '#00f',
                }),
                stroke: new Stroke({
                  width: 2,
                  color: '#ff0',
                }),
                image: new Circle({
                  //点样式
                  radius: 5,
                  fill: new Fill({
                    color: '#ff0000',
                  }),
                  text: new Text({
                    font: '12px sans-serif', // 设置字体
                    maxAngle: 30,
                    textAlign: 'right',
                    offsetx: 30, // 设置文字偏移量
                    offsetY: 20,
                    text: 'text', // 文字描述
                    fill: new Fill({
                      color: '#666',
                    }),
                  }),
                }),
              })
              feature.setStyle(style)
              shpSource.addFeature(feature)
              return source.read().then(log)
            })
          )
          .catch((error) => console.error(error.stack))
      }
    }.bind()
  )
  const shpLayer = new VectorLayer({
    title: 'shp图层',
    source: shpSource,
  })
  map.value.addLayer(shpLayer)
}
//导入SHP.ZIP
function importShpZip() {
  closeUpload()
  document.getElementById('import-shp-zip').style.display = 'block'
}
function addShpZipLayer() {
  let fileselect = document.querySelector('#shp-zip-file')
  fileselect.addEventListener(
    'change',
    function (e) {
      let files = e.target.files
      let filetype = files[0].name.substring(files[0].name.lastIndexOf('.') + 1)
      // console.log('文件类型' + filetype)
      if (files.length === 0 || filetype != 'zip') {
        ElMessageBox.alert('请重新上传zip格式的文件！', '文件选择错误', {
          confirmButtonText: '确定',
        })
        return
      }
      let zip = new jsZip()
      zip.loadAsync(files[0]).then(function (zip11) {
        //注意 shp文件要显示成arraybuffer的形式
        zip
          .file(/.shp$/i)[0]
          .async('arraybuffer')
          .then((item) => {
            //console.log(item)

            shapefile
              .open(item)
              .then((source) =>
                source.read().then(function log(result) {
                  if (result.done) return
                  var feature = new GeoJSON().readFeature(result.value, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:4326',
                  })
                  // console.log(feature)
                  let style = new Style({
                    fill: new Fill({
                      color: 'yellow',
                    }),
                    stroke: new Stroke({
                      color: 'blue',
                      width: 2,
                    }),
                    image: new Circle({
                      //点样式
                      radius: 10,
                      fill: new Fill({
                        color: randomRgbaColor(),
                      }),
                      stroke: new Stroke({
                        color: '#fff',
                        width: 2,
                      }),
                    }),
                    text: new Text({
                      text: feature.get('name') || ' ',
                      font: '12px Calibri,sans-serif',
                      fill: new Fill({
                        color: '#000',
                      }),
                      stroke: new Stroke({
                        color: '#fff',
                        width: 2,
                      }),
                      offsetX: '20',
                      offsetY: '20',
                    }),
                  })
                  feature.setStyle(style)
                  shpSource.addFeature(feature)
                  return source.read().then(log)
                })
              )
              .catch((error) => console.error(error.stack))
          })
      })
    }.bind()
  )
  const shpZipLayer = new VectorLayer({
    title: 'shp.zip图层',
    source: shpSource,
  })
  map.value.addLayer(shpZipLayer)
}
//导入GEOJSON
function importGeojson() {
  closeUpload()
  document.getElementById('import-Geojson').style.display = 'block'
}
function addGeojsonLayer() {
  let fileselect = document.querySelector('#geojson-file')
  fileselect.addEventListener(
    'change',
    function (e) {
      let files = e.target.files
      let filetype = files[0].name.split('.')[1]
      //console.log('文件类型' + filetype)
      if (files.length === 0 || filetype != 'json') {
        if (files.length === 0 || filetype != 'geojson') {
          ElMessageBox.alert(
            '请重新上传json或geojson格式的文件！',
            '文件选择错误',
            {
              confirmButtonText: '确定',
            }
          )
          return
        }
      }
      let reader = new FileReader()
      reader.readAsText(files[0]) //读取KML文件的形式
      reader.onload = function (evt) {
        let shparray = evt.target.result

        // let allFeatures=new GeoJSON().readFeatures(shparray,
        let allFeatures = geojsonSource.getFormat().readFeatures(shparray, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326',
        })
        //console.log(allFeatures)
        geojsonSource.addFeatures(allFeatures)

        geojsonSource.forEachFeature(function (feature) {
          let style = new Style({
            fill: new Fill({
              color: 'orange',
            }),
            stroke: new Stroke({
              color: 'blue',
            }),
            text: new Text({
              text: feature.get('name'),
              font: '12px Calibri,sans-serif',
              fill: new Fill({
                color: '#000',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
            }),
          })
          feature.setStyle(style)
        })
      }
    }.bind()
  )
  const geojsonLayer = new VectorLayer({
    title: 'Geojson图层',
    source: geojsonSource,
  })
  map.value.addLayer(geojsonLayer)
}

//导出
//导出JPEG
function exportJpeg() {
  map.value.once('rendercomplete', () => {
    const mapCanvas = document.createElement('canvas')
    const size = map.value.getSize()
    mapCanvas.width = size[0]
    mapCanvas.height = size[1]
    const mapContext = mapCanvas.getContext('2d')
    Array.prototype.forEach.call(
      map.value
        .getViewport()
        .querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
      function (canvas) {
        if (canvas.width > 0) {
          const opacity =
            canvas.parentNode.style.opacity || canvas.style.opacity
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity)

          const backgroundColor = canvas.parentNode.style.backgroundColor
          if (backgroundColor) {
            mapContext.fillStyle = backgroundColor
            mapContext.fillRect(0, 0, canvas.width, canvas.height)
          }

          let matrix
          const transform = canvas.style.transform
          if (transform) {
            matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number)
          } else {
            matrix = [
              parseFloat(canvas.style.width) / canvas.width,
              0,
              0,
              parseFloat(canvas.style.height) / canvas.height,
              0,
              0,
            ]
          }

          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          )
          mapContext.drawImage(canvas, 0, 0)
        }
      }
    )
    mapContext.globalAlpha = 1
    if (navigator.msSaveBlob) {
      // link download attribute does not work on MS browsers
      navigator.msSaveBlob(mapCanvas.msToBlob(), 'Map.jpg')
    } else {
      const link = document.getElementById('image-download')
      link.href = mapCanvas.toDataURL()
      link.click()
    }
  })
  map.value.renderSync()
}
//导出PDF
function exportPdf() {
  map.value.once('rendercomplete', () => {
    const mapCanvas = document.createElement('canvas')
    const size = map.value.getSize()
    // 设定尺寸为A4(297*210),设定分辨率为150dpi
    const width = Math.round((297 * 150) / 25.4)
    const height = Math.round((210 * 150) / 25.4)

    mapCanvas.width = width
    mapCanvas.height = height

    const mapContext = mapCanvas.getContext('2d')
    Array.prototype.forEach.call(
      map.value
        .getViewport()
        .querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
      function (canvas) {
        if (canvas.width > 0) {
          const opacity =
            canvas.parentNode.style.opacity || canvas.style.opacity
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity)

          // console.log(canvas.width)
          // console.log(canvas.height)

          const backgroundColor = canvas.parentNode.style.backgroundColor
          if (backgroundColor) {
            mapContext.fillStyle = backgroundColor
            mapContext.fillRect(0, 0, canvas.width, canvas.height)
          }

          let matrix
          const transform = canvas.style.transform
          if (transform) {
            matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number)
          } else {
            matrix = [
              parseFloat(canvas.style.width) / canvas.width,
              0,
              0,
              parseFloat(canvas.style.height) / canvas.height,
              0,
              0,
            ]
          }

          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          )
          mapContext.drawImage(canvas, 0, 0)
        }
      }
    )
    mapContext.globalAlpha = 1
    // 导出地图pdf
    const pdf = new jsPDF('landscape', undefined, [width, height])
    pdf.addImage(mapCanvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, width, height)
    pdf.save('Map.pdf')
  })
  map.value.renderSync()
}
//导出KML
function exportKml() {
  //设置feature的style和名字
  drawSource.forEachFeature(function (feature) {
    let style = new Style({
      fill: new Fill({
        color: 'transparent',
      }),
      stroke: new Stroke({
        color: 'red',
      }),
    })
    feature.setStyle(style)
    feature.setProperties({
      name: 'kml',
    })
  })

  let features = drawSource.getFeatures()
  if (features.length !== 0) {
    let kmlData = new KML().writeFeaturesNode(features)
    const str = new XMLSerializer().serializeToString(kmlData)
    //console.log(str)
    saveAs(
      new Blob([str], {
        type: 'text/plain;charset=utf-8',
      }),
      `Draw.kml`
    )
  } else {
    ElMessageBox.alert('请先进行标绘！', 'KML导出错误', {
      confirmButtonText: '确定',
    })
  }
}

/* 底图切换 */
const basemapImage = ref('')
basemapImage.value = '天地图矢量'
function basemapToggle(index) {
  switch (index) {
    case 1:
      basemapImage.value = '天地图矢量'
      tdcvaLayer.setVisible(true)
      tdvecLayer.setVisible(true)
      tdimgLayer.setVisible(false)
      tdterLayer.setVisible(false)
      xtvecLayer.setVisible(false)
      xtciaLayer.setVisible(false)
      xtimgLayer.setVisible(false)
      xtterLayer.setVisible(false)
      break
    case 2:
      basemapImage.value = '天地图影像'
      tdcvaLayer.setVisible(true)
      tdvecLayer.setVisible(false)
      tdimgLayer.setVisible(true)
      tdterLayer.setVisible(false)
      xtvecLayer.setVisible(false)
      xtciaLayer.setVisible(false)
      xtimgLayer.setVisible(false)
      xtterLayer.setVisible(false)
      break
    case 3:
      basemapImage.value = '天地图地形'
      tdcvaLayer.setVisible(false)
      tdvecLayer.setVisible(false)
      tdimgLayer.setVisible(false)
      tdterLayer.setVisible(true)
      xtvecLayer.setVisible(false)
      xtciaLayer.setVisible(false)
      xtimgLayer.setVisible(false)
      xtterLayer.setVisible(false)
      break
    case 4:
      basemapImage.value = '星图矢量'
      tdcvaLayer.setVisible(false)
      tdvecLayer.setVisible(false)
      tdimgLayer.setVisible(false)
      tdterLayer.setVisible(false)
      xtvecLayer.setVisible(true)
      xtciaLayer.setVisible(false)
      xtimgLayer.setVisible(false)
      xtterLayer.setVisible(false)
      break
    case 5:
      basemapImage.value = '星图影像'
      tdcvaLayer.setVisible(false)
      tdvecLayer.setVisible(false)
      tdimgLayer.setVisible(false)
      tdterLayer.setVisible(false)
      xtvecLayer.setVisible(false)
      xtciaLayer.setVisible(true)
      xtimgLayer.setVisible(true)
      xtterLayer.setVisible(false)
      break
    case 6:
      basemapImage.value = '星图地形'
      tdcvaLayer.setVisible(false)
      tdvecLayer.setVisible(false)
      tdimgLayer.setVisible(false)
      tdterLayer.setVisible(false)
      xtvecLayer.setVisible(false)
      xtciaLayer.setVisible(true)
      xtimgLayer.setVisible(false)
      xtterLayer.setVisible(true)
      break
  }
}

onMounted(() => {
  initMap()
})
</script>
<style scoped></style>
