<!-- 灌区一张图 -->
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

//天地图token
const tdtoken = '92abf9017d78cd71a3ae51d0874b6578'
//星图token
const xttoken =
  'cec6f2d6a92d3cc95a61b873df5da5ffa1f4d2846fcf61ce384aa91aa0ca0141'
//geoserver路径
const geoserverUrl = 'http://192.168.188.8:8086'
//版权
const attributions =
  '<a href="http://www.xinhuigs.com/" target="_blank">&copy;&nbsp;&nbsp;2022&nbsp;&nbsp;Xinhui&nbsp;Group&nbsp;&nbsp;&nbsp;All&nbsp;Rights&nbsp;Reserved.</a> '

/* 底图 */
//天地图注记图层
const tdcvaLayer = new TileLayer({
  title: '天地图注记',
  source: new XYZ({
    url:
      'http://t5.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' +
      tdtoken,
    //wrapX: false,
    attributions: attributions,
    crossOrigin: 'anonymous',
  }),
  visible: true,
})
layers.unshift(tdcvaLayer)
//天地图矢量图层
const tdvecLayer = new TileLayer({
  title: '天地图矢量',
  source: new XYZ({
    url:
      'http://t5.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' +
      tdtoken,
    //wrapX: false,
    attributions: attributions,
    crossOrigin: 'anonymous',
  }),
  visible: true,
})
layers.unshift(tdvecLayer)
//天地图影像图层
const tdimgLayer = new TileLayer({
  title: '天地图影像',
  source: new XYZ({
    url:
      'http://t5.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' +
      tdtoken,
    //wrapX: false,
    attributions: attributions,
    crossOrigin: 'anonymous',
    maxZoom: 18,
  }),
  visible: false,
})
layers.unshift(tdimgLayer)
//天地图地形图层
const tdterLayer = new TileLayer({
  title: '天地图地形',
  source: new XYZ({
    url:
      'http://t5.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=' +
      tdtoken,
    //wrapX: false,
    attributions: attributions,
    crossOrigin: 'anonymous',
  }),
  visible: false,
})
layers.unshift(tdterLayer)
//星图矢量图层
const xtvecLayer = new TileLayer({
  title: '星图矢量',
  source: new XYZ({
    url:
      'https://tiles1.geovisearth.com/base/v1/vec/{z}/{x}/{y}?format=png&tmsIds=w&token=' +
      xttoken,
    //wrapX: false,
    attributions: attributions,
    crossOrigin: 'anonymous',
    maxZoom: 16,
  }),
  visible: false,
})
layers.unshift(xtvecLayer)
//星图影像注记
const xtciaLayer = new TileLayer({
  title: '星图影像注记',
  source: new XYZ({
    url:
      'https://tiles1.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=png&tmsIds=w&token=' +
      xttoken,
    //wrapX: false,
    attributions: attributions,
    crossOrigin: 'anonymous',
  }),
  visible: false,
})
layers.unshift(xtciaLayer)
//星图影像图层
const xtimgLayer = new TileLayer({
  title: '星图影像',
  source: new XYZ({
    url:
      'https://tiles1.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=' +
      xttoken,
    //wrapX: false,
    attributions: attributions,
    crossOrigin: 'anonymous',
    maxZoom: 18,
  }),
  visible: false,
})
layers.unshift(xtimgLayer)
//星图地形
const xtterLayer = new TileLayer({
  title: '星图地形',
  source: new XYZ({
    url:
      'https://tiles1.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=png&tmsIds=w&token=' +
      xttoken,
    //wrapX: false,
    attributions: attributions,
    crossOrigin: 'anonymous',
    maxZoom: 11,
  }),
  visible: false,
})
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
  //addLayersToMap()

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
const geoserverLayres = [
  //王庄灌区
  {
    value: 'xhis:irrigation_wz_reservoir_polygon',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_reservoir_polygon',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_boundary_outer',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_boundary_outer',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_boundary_inner',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_boundary_inner',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_canal_main',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_canal_main',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_canal_trunk',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_canal_trunk',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_canal_branch',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_canal_branch',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_canal_small_br',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_canal_small_br',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_canal_head_dit',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_canal_head_dit',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_pipeline_trunk',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_pipeline_trunk',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_drainage_trunk',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_drainage_trunk',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_drainage_branch',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_drainage_branch',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_drainage_small_br',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_drainage_small_br',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_drainage_head_dit',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_drainage_head_dit',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_d_mana_place',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_d_mana_place',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_d_mana_station',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_d_mana_station',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_e_pivot',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_e_pivot',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_e_sluice',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_e_sluice',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_e_pump',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_e_pump',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_e_flume',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_e_flume',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_e_culvert',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_e_culvert',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_e_siphon',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_e_siphon',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_e_basin',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_e_basin',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_e_bridge',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_e_bridge',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_e_doumen',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_e_doumen',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
  {
    value: 'xhis:irrigation_wz_wm_equipment',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:irrigation_wz_wm_equipment',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 1,
      visible: false,
    }),
  },
]
geoserverLayres.forEach((layerObject, index) => {
  if (layerObject) {
    layers.push(layerObject.layer)
  }
})

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
      (dataArray[24] && dataArray[24][3])

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
  // {
  //   id: 1,
  //   label: '曹店灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  // },
  // {
  //   id: 2,
  //   label: '崔家泵站灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 201,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //       children: [
  //         {
  //           id: 20101,
  //           label: '渠首',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20102,
  //           label: '水闸',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20103,
  //           label: '水闸线',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20104,
  //           label: '泵站',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20105,
  //           label: '水电站',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20106,
  //           label: '渡槽',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20107,
  //           label: '渡槽线',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20108,
  //           label: '隧洞',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20109,
  //           label: '隧洞线',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20110,
  //           label: '涵洞',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20111,
  //           label: '涵洞线',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20112,
  //           label: '倒虹吸',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20113,
  //           label: '倒虹吸线',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20114,
  //           label: '陡坡',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20115,
  //           label: '跌水',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20116,
  //           label: '沉沙池',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20117,
  //           label: '桥梁',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20118,
  //           label: '桥梁线',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20119,
  //           label: '斗门',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20120,
  //           label: '机井',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20121,
  //           label: '溢洪道',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20122,
  //           label: '大坝点',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 20123,
  //           label: '大坝线',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       id: 202,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //       children: [
  //         {
  //           id: 2021,
  //           label: '量水设施',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       id: 203,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //       children: [
  //         {
  //           id: 2031,
  //           label: '管理局',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2032,
  //           label: '管理所',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2033,
  //           label: '管理站',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2034,
  //           label: '灌溉试验站',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       id: 204,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //       children: [
  //         {
  //           id: 2041,
  //           label: '总干渠',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2042,
  //           label: '干渠',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2043,
  //           label: '分干渠',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2044,
  //           label: '支渠',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2045,
  //           label: '斗渠',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       id: 205,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //       children: [
  //         {
  //           id: 2051,
  //           label: '总干管',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2052,
  //           label: '干管',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2053,
  //           label: '分干管',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2054,
  //           label: '支管',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2055,
  //           label: '斗管',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       id: 206,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //       children: [
  //         {
  //           id: 2061,
  //           label: '总干灌排',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2062,
  //           label: '干灌排',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2063,
  //           label: '分干灌排',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2064,
  //           label: '支灌排',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2065,
  //           label: '斗灌排',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       id: 207,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //       children: [
  //         {
  //           id: 2071,
  //           label: '总干沟',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2072,
  //           label: '干沟',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2073,
  //           label: '分干沟',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2074,
  //           label: '支沟',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2075,
  //           label: '斗沟',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2076,
  //           label: '截流沟',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       id: 208,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //       children: [
  //         {
  //           id: 2081,
  //           label: '圩堤',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2082,
  //           label: '一类堤',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2083,
  //           label: '二类堤',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2084,
  //           label: '三类堤',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       id: 209,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //       children: [
  //         {
  //           id: 2091,
  //           label: '水库',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2092,
  //           label: '圩口',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2093,
  //           label: '滩面',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2094,
  //           label: '湖泊',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2095,
  //           label: '山塘',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       id: 310,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //       children: [
  //         {
  //           id: 2001,
  //           label: '灌区外边界',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //         {
  //           id: 2002,
  //           label: '灌区内边界',
  //           layerName: '',
  //           visible: false,
  //           disabled: true,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 3,
  //   label: '丁家泵站灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 301,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 302,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 303,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 304,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 305,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 306,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 307,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 308,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 309,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 310,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   label: '丁字路灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 401,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 402,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 403,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 404,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 405,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 406,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 407,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 408,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 409,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 410,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   label: '东水源灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 501,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 502,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 503,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 504,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 505,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 506,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 507,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 508,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 509,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 510,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 6,
  //   label: '付窝二号灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 601,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 602,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 603,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 604,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 605,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 606,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 607,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 608,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 609,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 610,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 7,
  //   label: '宫家灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 701,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 702,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 703,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 704,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 705,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 706,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 707,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 708,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 709,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 710,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 8,
  //   label: '纪冯灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 801,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 802,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 803,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 804,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 805,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 806,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 807,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 808,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 809,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 810,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 9,
  //   label: '垦东灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 901,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 902,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 903,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 904,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 905,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 906,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 907,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 908,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 909,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 910,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 11,
  //   label: '路庄灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 111,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 112,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 113,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 114,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 115,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 116,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 117,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 118,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 119,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 120,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 12,
  //   label: '麻湾灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 121,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 122,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 123,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 124,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 125,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 126,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 127,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 128,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 129,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 130,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 13,
  //   label: '胜利灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 131,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 132,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 133,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 134,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 135,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 136,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 137,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 138,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 139,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 140,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 14,
  //   label: '十八户灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 141,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 142,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 143,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 144,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 145,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 146,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 147,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 148,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 149,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 150,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 15,
  //   label: '双河灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  // {
  //   id: 151,
  //   label: '界限',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  // },
  // {
  //   id: 152,
  //   label: '管理机构',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  // },
  // {
  //   id: 153,
  //   label: '建筑物',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  // },
  // {
  //   id: 154,
  //   label: '计量',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  // },

  // {
  //   id: 155,
  //   label: '输水渠系',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  // },
  // {
  //   id: 156,
  //   label: '管道',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  // },
  // {
  //   id: 157,
  //   label: '灌排结合',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  // },
  // {
  //   id: 158,
  //   label: '排水沟系',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  // },
  // {
  //   id: 159,
  //   label: '堤防',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  // },
  // {
  //   id: 160,
  //   label: '水系',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  // },
  //   ],
  // },
  {
    id: 16,
    label: '王庄灌区',
    layerName: '',
    visible: false,
    children: [
      {
        id: 161,
        label: '界限',
        layerName: '',
        visible: false,
        children: [
          {
            id: 1611,
            label: '灌区外边界',
            layerName: 'xhis:irrigation_wz_boundary_outer',
            visible: false,
          },
          {
            id: 1612,
            label: '灌区内边界',
            layerName: 'xhis:irrigation_wz_boundary_inner',
            visible: false,
          },
        ],
      },
      {
        id: 162,
        label: '管理机构',
        layerName: '',
        visible: false,
        children: [
          {
            id: 1622,
            label: '管理所',
            layerName: 'xhis:irrigation_wz_d_mana_place',
            visible: false,
          },
          {
            id: 1623,
            label: '管理站',
            layerName: 'xhis:irrigation_wz_d_mana_station',
            visible: false,
          },
        ],
      },

      {
        id: 163,
        label: '建筑物',
        layerName: '',
        visible: false,
        children: [
          {
            id: 16301,
            label: '渠首',
            layerName: 'xhis:irrigation_wz_e_pivot',
            visible: false,
          },
          {
            id: 16302,
            label: '水闸',
            layerName: 'xhis:irrigation_wz_e_sluice',
            visible: false,
          },
          {
            id: 16304,
            label: '泵站',
            layerName: 'xhis:irrigation_wz_e_pump',
            visible: false,
          },
          {
            id: 16306,
            label: '渡槽',
            layerName: 'xhis:irrigation_wz_e_flume',
            visible: false,
          },
          {
            id: 16310,
            label: '涵洞',
            layerName: 'xhis:irrigation_wz_e_culvert',
            visible: false,
          },
          {
            id: 16312,
            label: '倒虹吸',
            layerName: 'xhis:irrigation_wz_e_siphon',
            visible: false,
          },
          {
            id: 16316,
            label: '沉沙池',
            layerName: 'xhis:irrigation_wz_e_basin',
            visible: false,
          },
          {
            id: 16317,
            label: '桥梁',
            layerName: 'xhis:irrigation_wz_e_bridge',
            visible: false,
          },
          {
            id: 16319,
            label: '斗门',
            layerName: 'xhis:irrigation_wz_e_doumen',
            visible: false,
          },
          // {
          //   id: 16320,
          //   label: '机井',
          //   layerName: '',
          //   visible: false,
          //   disabled: true,
          // },
        ],
      },
      {
        id: 164,
        label: '计量',
        layerName: '',
        visible: false,
        children: [
          {
            id: 1641,
            label: '量水设施',
            layerName: 'xhis:irrigation_wz_wm_equipment',
            visible: false,
          },
        ],
      },
      {
        id: 165,
        label: '输水渠系',
        layerName: '',
        visible: false,
        children: [
          {
            id: 1651,
            label: '总干渠',
            layerName: 'xhis:irrigation_wz_canal_main',
            visible: false,
          },
          {
            id: 1652,
            label: '干渠',
            layerName: 'xhis:irrigation_wz_canal_trunk',
            visible: false,
          },
          {
            id: 1653,
            label: '分干渠',
            layerName: 'xhis:irrigation_wz_canal_branch',
            visible: false,
          },
          {
            id: 1654,
            label: '支渠',
            layerName: 'xhis:irrigation_wz_canal_small_br',
            visible: false,
          },
          {
            id: 1665,
            label: '斗渠',
            layerName: 'xhis:irrigation_wz_canal_head_dit',
            visible: false,
          },
        ],
      },
      {
        id: 166,
        label: '管道',
        layerName: '',
        visible: false,
        children: [
          {
            id: 1662,
            label: '干管',
            layerName: 'xhis:irrigation_wz_pipeline_trunk',
            visible: false,
          },
        ],
      },
      {
        id: 167,
        label: '灌排结合',
        layerName: '',
        visible: false,
        children: [
          {
            id: 1672,
            label: '干灌排',
            layerName: 'xhis:irrigation_wz_drainage_trunk',
            visible: false,
          },
          {
            id: 1673,
            label: '分干灌排',
            layerName: 'xhis:irrigation_wz_drainage_branch',
            visible: false,
          },
          {
            id: 1674,
            label: '支灌排',
            layerName: 'xhis:irrigation_wz_drainage_small_br',
            visible: false,
          },
          {
            id: 1675,
            label: '斗灌排',
            layerName: 'xhis:irrigation_wz_drainage_head_dit',
            visible: false,
          },
        ],
      },
      {
        id: 170,
        label: '水系',
        layerName: '',
        visible: false,
        children: [
          {
            id: 1701,
            label: '水库',
            layerName: 'xhis:irrigation_wz_reservoir_polygon',
            visible: false,
          },
        ],
      },
    ],
  },
  // {
  //   id: 17,
  //   label: '五七灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 171,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 172,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 173,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 174,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 175,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 176,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 177,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 178,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 179,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 180,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 18,
  //   label: '一号灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 181,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 182,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 183,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 184,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 185,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 186,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 187,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 188,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 189,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 190,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
  // {
  //   id: 19,
  //   label: '预备河灌区',
  //   layerName: '',
  //   visible: false,
  //   disabled: true,
  //   children: [
  //     {
  //       id: 191,
  //       label: '建筑物',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 192,
  //       label: '计量',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 193,
  //       label: '管理机构',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 194,
  //       label: '输水渠系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 195,
  //       label: '管道',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 196,
  //       label: '灌排结合',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 197,
  //       label: '排水沟系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 198,
  //       label: '堤防',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 199,
  //       label: '水系',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //     {
  //       id: 200,
  //       label: '界限',
  //       layerName: '',
  //       visible: false,
  //       disabled: true,
  //     },
  //   ],
  // },
]
//图层展开id
const defaultExpandedKeys = '16,161,162,163,164,165,166,167,168,169,170'
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
