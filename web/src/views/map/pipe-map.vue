<!-- 管线一张图 -->
<template>
  <div id="map">
    <!-- 导出地图映射到a标签上 -->
    <a id="image-download" download="Map.jpg"></a>
    <!-- 导入对话框 -->
    <div class="import" id="import">
      <div id="import-kml">
        <el-card class="import-card">
          <template #header>
            <div class="card-header" style="display: flex; align-items: center">
              <span>导入Google KML文件</span>
              <el-button
                type="primary"
                :icon="Close"
                style="margin-left: 205px"
                @click="closeUpload"
                text
              />
            </div>
          </template>
          <div class="el-input" style="margin-top: 10px; margin-bottom: 10px">
            <div class="el-input__wrapper">
              <input
                type="file"
                id="kml-file"
                accept=".kml"
                style="margin-left: -130px; margin-top: 28px; height: 50px"
              />
            </div>
          </div>
        </el-card>
      </div>
      <div id="import-kmz">
        <el-card class="import-card">
          <template #header>
            <div class="card-header" style="display: flex; align-items: center">
              <span>导入Google KMZ文件</span>
              <el-button
                type="primary"
                :icon="Close"
                style="margin-left: 203px"
                @click="closeUpload"
                text
              />
            </div>
          </template>
          <div class="el-input" style="margin-top: 10px; margin-bottom: 10px">
            <div class="el-input__wrapper">
              <input
                type="file"
                id="kmz-file"
                accept=".kmz"
                style="margin-left: -130px; margin-top: 28px; height: 50px"
              />
            </div>
          </div>
        </el-card>
      </div>
      <div id="import-shp">
        <el-card class="import-card">
          <template #header>
            <div class="card-header" style="display: flex; align-items: center">
              <span>导入ESRI Shapefile文件</span>
              <el-button
                type="primary"
                :icon="Close"
                style="margin-left: 191px"
                @click="closeUpload"
                text
              />
            </div>
          </template>
          <div class="el-input" style="margin-top: 10px; margin-bottom: 10px">
            <div class="el-input__wrapper">
              <input
                type="file"
                id="shp-file"
                accept=".shp"
                style="margin-left: -130px; margin-top: 28px; height: 50px"
              />
            </div>
          </div>
          <a style="font-size: 5px; font-style: italic"
            >注:暂仅支持WGS84坐标系数据</a
          >
        </el-card>
      </div>
      <div id="import-shp-zip">
        <el-card class="import-card">
          <template #header>
            <div class="card-header" style="display: flex; align-items: center">
              <span>导入Shapefile.zip压缩文件</span>
              <el-button
                type="primary"
                :icon="Close"
                style="margin-left: 171px"
                @click="closeUpload"
                text
              />
            </div>
          </template>
          <div class="el-input" style="margin-top: 10px; margin-bottom: 10px">
            <div class="el-input__wrapper">
              <input
                type="file"
                id="shp-zip-file"
                accept=".zip"
                style="margin-left: -130px; margin-top: 28px; height: 50px"
              />
            </div>
          </div>
          <a style="font-size: 5px; font-style: italic"
            >注:暂仅支持WGS84坐标系数据</a
          >
        </el-card>
      </div>
      <div id="import-Geojson">
        <el-card class="import-card">
          <template #header>
            <div class="card-header" style="display: flex; align-items: center">
              <span>导入GeoJSON文件</span>
              <el-button
                type="primary"
                :icon="Close"
                style="margin-left: 227px"
                @click="closeUpload"
                text
              />
            </div>
          </template>
          <div class="el-input" style="margin-top: 10px; margin-bottom: 10px">
            <div class="el-input__wrapper">
              <input
                type="file"
                id="geojson-file"
                accept=".json,.geojson"
                style="margin-left: -130px; margin-top: 28px; height: 50px"
              />
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 左侧图层与标绘卡片 -->
    <div class="left-card">
      <div class="toggle-button">
        <el-card shadow="always">
          <el-button
            type="info"
            size="large"
            class="toggle-button-select"
            :icon="CopyDocument"
            :bg="selecttc"
            @click="clicktc"
            text
            >图层</el-button
          >
          <el-button
            type="info"
            size="large"
            class="toggle-button-select"
            :icon="EditPen"
            :bg="selectbh"
            @click="clickbh"
            text
            >标绘</el-button
          >
        </el-card>
      </div>
      <div id="layer-card">
        <el-card shadow="always">
          <div class="layer-search">
            <el-input
              v-model="input"
              placeholder="过滤图层关键字"
              class="input-with-select"
              clearable
            >
              <template #append>
                <el-button :icon="Search" />
              </template>
            </el-input>
          </div>
          <el-tree
            :data="layersData"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[1, 2, 3, 4, 16, 19]"
            :default-checked-keys="[]"
            :props="defaultProps"
            @check-change="layerTreeClick"
          />
        </el-card>
      </div>
      <div id="draw-card">
        <el-card shadow="always">
          <el-radio-group
            v-model="drawRadio"
            size="large"
            @change="drawFeatures"
          >
            <el-radio-button label="点标绘" />
            <el-radio-button label="线标绘" />
            <el-radio-button label="面标绘" />
          </el-radio-group>
        </el-card>
      </div>
    </div>
    <!-- 地图工具 -->
    <div class="map-tool">
      <el-button-group>
        <el-popover placement="bottom" trigger="click">
          <template #reference>
            <el-button type="default" :icon="Upload">导出</el-button>
          </template>
          <div class="map-tool-item">
            <el-button type="default" text @click="exportJpeg"
              >导出JPEG</el-button
            ><br />
            <el-button type="default" text @click="exportPdf">导出PDF</el-button
            ><br />
            <el-button type="default" text @click="exportKml"
              >标绘导出KML</el-button
            ><br />
          </div>
        </el-popover>

        <el-popover placement="bottom" trigger="click">
          <template #reference>
            <el-button type="default" :icon="Download">导入</el-button>
          </template>
          <div class="map-tool-item">
            <el-button type="default" text @click="importKml"
              >导入Google KML</el-button
            ><br />
            <el-button type="default" text @click="importKmz"
              >导入Google KMZ</el-button
            ><br />
            <el-button type="default" text @click="importShp"
              >导入ESRI Shapefile</el-button
            ><br />
            <el-button type="default" text @click="importShpZip"
              >导入Shapefile.zip</el-button
            ><br />
            <el-button type="default" text @click="importGeojson"
              >导入GeoJSON</el-button
            ><br />
            <!-- <el-button type="default" text>导入CSV</el-button><br /> -->
          </div>
        </el-popover>

        <el-popover placement="bottom" trigger="click">
          <template #reference>
            <el-button type="default" :icon="Coordinate">测量</el-button>
          </template>
          <div class="map-tool-item">
            <!-- <el-button type="default" @click="coordinateMeasure" text
              >鼠标坐标测量</el-button
            ><br /> -->
            <el-button type="default" @click="lineMeasure()" text
              >距离测量</el-button
            ><br />
            <el-button type="default" @click="areaMeasure()" text
              >面积测量</el-button
            ><br />
            <el-button type="default" @click="stopMeasure()" text
              >停止测量</el-button
            ><br />
          </div>
        </el-popover>

        <el-tooltip content="清屏" placement="bottom" effect="light"
          ><el-button type="default" :icon="Brush" @click="clear"></el-button
        ></el-tooltip>

        <el-tooltip content="旋转" placement="bottom" effect="light"
          ><el-button
            type="default"
            :icon="RefreshRight"
            @click="rotate"
          ></el-button
        ></el-tooltip>

        <el-tooltip content="放大" placement="bottom" effect="light"
          ><el-button type="default" :icon="ZoomIn" @click="zoomIn"></el-button
        ></el-tooltip>

        <el-tooltip content="缩小" placement="bottom" effect="light"
          ><el-button
            type="default"
            :icon="ZoomOut"
            @click="zoomOut"
          ></el-button
        ></el-tooltip>

        <el-tooltip content="定位" placement="bottom" effect="light"
          ><el-button
            type="default"
            :icon="Location"
            @click="locate"
          ></el-button
        ></el-tooltip>

        <el-tooltip content="默认视图" placement="bottom" effect="light"
          ><el-button type="default" :icon="House" @click="reset"></el-button
        ></el-tooltip>
      </el-button-group>
    </div>
    <!-- 底图切换工具 -->
    <div class="basemap-toggle">
      <el-popover placement="left" :width="350" trigger="click">
        <template #reference>
          <el-card shadow="always">
            <el-image
              style="width: 80px; height: 80px"
              :src="require(`@/assets/images/MapLogo/${basemapImage}.jpg`)"
              fit="cover"
            />
            <h6>{{ basemapImage }}</h6>
          </el-card>
        </template>
        <div class="basemap-toggle-row">
          <el-row :gutter="2">
            <el-col :span="6" @click="basemapToggle(1)"
              ><div class="grid-content ep-bg-purple" />
              <el-image
                style="
                  width: 80px;
                  height: 80px;
                  border-radius: 2px;
                  cursor: pointer;
                "
                :src="require(`@/assets/images/MapLogo/天地图矢量.jpg`)"
              />
              <h6 style="cursor: pointer">天地图矢量</h6>
            </el-col>
            <el-col :span="6" @click="basemapToggle(2)"
              ><div class="grid-content ep-bg-purple" />
              <el-image
                style="
                  width: 80px;
                  height: 80px;
                  border-radius: 2px;
                  cursor: pointer;
                "
                :src="require(`@/assets/images/MapLogo/天地图影像.jpg`)"
                fit="cover"
              />
              <h6 style="cursor: pointer">天地图影像</h6>
            </el-col>
            <el-col :span="6" @click="basemapToggle(3)"
              ><div class="grid-content ep-bg-purple" />
              <el-image
                style="
                  width: 80px;
                  height: 80px;
                  border-radius: 2px;
                  cursor: pointer;
                "
                :src="require(`@/assets/images/MapLogo/天地图地形.jpg`)"
                fit="cover"
              />
              <h6 style="cursor: pointer">天地图地形</h6>
            </el-col>
            <el-col :span="6" @click="basemapToggle(4)"
              ><div class="grid-content ep-bg-purple" />
              <el-image
                style="
                  width: 80px;
                  height: 80px;
                  border-radius: 2px;
                  cursor: pointer;
                "
                :src="require(`@/assets/images/MapLogo/OSM地图.jpg`)"
                fit="cover"
              />
              <h6 style="cursor: pointer">OSM地图</h6>
            </el-col>
          </el-row>
        </div>
      </el-popover>
    </div>
    <!-- 属性查询弹窗 -->
    <PropertyPopup
      :propertyTableData="propertyTableData"
      :tableFeatureName="tableFeatureName"
      @closePopup="closePopup"
    ></PropertyPopup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onMounted, watch } from '@vue/runtime-core'
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
import MeasureTool from '@/utils/measure.js'
import KML from 'ol/format/KML'
import GeoJSON from 'ol/format/GeoJSON'
import Draw from 'ol/interaction/Draw'
import { jsPDF } from 'jspdf'
import { saveAs } from 'file-saver'
import PropertyPopup from '@/components/Common/PropertyPopup.vue'
import { Search, CopyDocument, EditPen } from '@element-plus/icons-vue'
import {
  Coordinate,
  Upload,
  Download,
  RefreshRight,
  Brush,
  ZoomIn,
  ZoomOut,
  Location,
  House,
  UploadFilled,
  Close,
} from '@element-plus/icons-vue'

//地图定义
const map = ref(null)
const view = new View({
  center: [118.7, 37.4],
  projection: 'EPSG:4326', //指定投影
  zoom: 12,
})
let layers = []

//版权信息
const attributions =
  '<a href="http://www.xinhuigs.com/" target="_blank">Copyright&nbsp;&nbsp;&nbsp;&copy;&nbsp;&nbsp;2022 &nbsp;&nbsp;&nbsp;Xinhui&nbsp;Group&nbsp;&nbsp;&nbsp;All&nbsp;Rights&nbsp;Reserved.</a> '

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

//图层树
const defaultProps = {
  children: 'children',
  label: 'label',
}

//geoserver图层数据结构
const layersData = [
  {
    id: 1,
    label: '水系',
    layerName: '',
    visible: false,
    children: [
      {
        id: 11,
        label: '河流',
        layerName: 'xhis:water_river',
        visible: false,
      },
      {
        id: 12,
        label: '调水工程',
        layerName: '',
        visible: false,
      },
      {
        id: 13,
        label: '干渠',
        layerName: '',
        visible: false,
      },
      {
        id: 14,
        label: '支渠',
        layerName: '',
        visible: false,
      },
      {
        id: 15,
        label: '排沟',
        layerName: '',
        visible: false,
      },
      {
        id: 16,
        label: '水库',
        layerName: '',
        visible: false,
        children: [
          {
            id: 41,
            label: '大中型',
            layerName: 'xhis:water_reservoir_large',
            visible: false,
          },
          {
            id: 42,
            label: '小（Ⅰ）型',
            layerName: 'xhis:water_reservoir_small1',
            visible: false,
          },
          {
            id: 43,
            label: '小（Ⅱ）型',
            layerName: 'xhis:water_reservoir_small2',
            visible: false,
          },
        ],
      },
      // {
      //   id: 17,
      //   label: '灌区',
      //   layerName: '',
      //visible: false,
      // },
      // {
      //   id: 18,
      //   label: '沉砂池',
      //   layerName: '',
      //visible: false,
      // },
    ],
  },
  {
    id: 2,
    label: '水工建筑物',
    layerName: '',
    visible: false,
    children: [
      {
        id: 19,
        label: '水闸',
        layerName: '',
        visible: false,
        children: [
          {
            id: 44,
            label: '引进水闸',
            layerName: 'xhis:water_gate_diversion_intake',
            visible: false,
          },
          {
            id: 45,
            label: '节制闸',
            layerName: 'xhis:water_gate_control',
            visible: false,
          },
          {
            id: 46,
            label: '分泄洪闸',
            layerName: 'xhis:water_gate_flood_spill',
            visible: false,
          },
          {
            id: 47,
            label: '排退水闸',
            layerName: 'xhis:water_gate_drain',
            visible: false,
          },
          {
            id: 48,
            label: '挡潮闸',
            layerName: 'xhis:water_gate_tide',
            visible: false,
          },
        ],
      },
      {
        id: 20,
        label: '橡胶坝',
        layerName: 'xhis:water_rubber_dam',
        visible: false,
      },
      {
        id: 21,
        label: '泵站',
        layerName: 'xhis:water_pumping_station',
        visible: false,
      },
      {
        id: 22,
        label: '涵洞',
        layerName: '',
        visible: false,
      },
      // {
      //   id: 23,
      //   label: '堤防',
      //   layerName: '',
      //   visible: false,
      // },
    ],
  },
  {
    id: 3,
    label: '监测站',
    layerName: '',
    visible: false,
    children: [
      {
        id: 25,
        label: '水文站',
        layerName: 'xhis:water_hydrometrical_station',
        visible: false,
      },
      {
        id: 26,
        label: '水位站',
        layerName: '',
        visible: false,
      },
      // {
      //   id: 27,
      //   label: '气象站',
      //   layerName: '',
      //    visible: false,
      // },
    ],
  },
  {
    id: 4,
    label: '自然事件',
    layerName: '',
    visible: false,
    children: [
      {
        id: 27,
        label: '洪水',
        layerName: 'xhis:water_flood',
        visible: false,
      },
      {
        id: 28,
        label: '台风',
        layerName: 'xhis:irrigation_wz_e_doumen',
        visible: false,
      },
    ],
  },
]

//获取geoserver发布的所有图层，存放于geoserverLayers
//麻烦，后面改成图层组，CQL过滤图层组
let layerArray = []
let layerVisible = []
let geoserverLayers = []
function getGeoserverLayer(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      getGeoserverLayer(arr[i].children)
    } else {
      layerArray = arr[i].layerName
      layerVisible = arr[i].visible
      //console.log(layerArray)
      if (layerArray) {
        let layer = new TileLayer({
          source: new TileWMS({
            //不能设置为0，否则地图不展示。
            //ratio: 1,
            url: 'http://192.168.188.8:8086/geoserver/xhis/wms',
            params: {
              LAYERS: layerArray,
              STYLES: '',
              VERSION: '1.3.0',
              tiled: true,
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous',
            projection: 'EPSG:4548',
          }),
          visible: layerVisible,
        })
        geoserverLayers.push(layer)
      }
    }
  }
}
getGeoserverLayer(layersData)
layers = layers.concat(geoserverLayers)

//天地图注记图层
const tdcvaLayer = new TileLayer({
  title: '天地图注记',
  source: new XYZ({
    url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=9970c29ec3f3482ac1448cd57b16685d',
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
    url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=9970c29ec3f3482ac1448cd57b16685d',
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
    url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=9970c29ec3f3482ac1448cd57b16685d',
    //wrapX: false,
    attributions: attributions,
    crossOrigin: 'anonymous',
  }),
  visible: false,
})
layers.unshift(tdimgLayer)
//天地图地形图层
const tdterLayer = new TileLayer({
  title: '天地图地形',
  source: new XYZ({
    url: 'http://t0.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=9970c29ec3f3482ac1448cd57b16685d',
    //wrapX: false,
    attributions: attributions,
    crossOrigin: 'anonymous',
  }),
  visible: false,
})
layers.unshift(tdterLayer)
//OSM图层
const osmLayer = new TileLayer({
  title: 'OSM地图',
  source: new OSM({
    attributions: attributions,
  }),
  visible: false,
})
layers.unshift(osmLayer)

const wmsSource = new TileWMS({
  //不能设置为0，否则地图不展示。
  //ratio: 1,
  url: 'http://192.168.188.8:8086/geoserver/xhis/wms',
  params: {
    LAYERS: 'xhis:map_water',
    STYLES: '',
    VERSION: '1.3.0',
    //tiled: true,
  },
  serverType: 'geoserver',
  crossOrigin: 'anonymous',
  projection: 'EPSG:4548',
})

const wmsLayer = new TileLayer({
  source: wmsSource,
})

//左侧卡片相关
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

//图层过滤输入框
const input = ref('')

/* 图层控制 */
function layerTreeClick(data, check) {
  const layers = map.value.getLayers().array_
  for (let i = 0; i < layers.length; i++) {
    if (
      !('title' in layers[i].values_) &&
      data.layerName == layers[i].values_.source.params_.LAYERS
    ) {
      layers[i].setVisible(check)
    }
  }
}

//标绘
const drawRadio = ref('')
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
    duration: 5000,
  })

  document.onkeydown = function (e) {
    if (e.code == 'Escape') {
      drawRadio.value = ''
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

//初始化地图
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
              source: new OSM(),
            }),
          ],
        }), //鹰眼控件
        new control.Attribution({
          collapsed: false,
        }), //版权信息不可折叠
      ]),
    interactions: defaultInteractions({
      // altShiftDragRotate: true, //是否需要 Alt-Shift-drag 旋转
      // onFocusOnly: false,
      doubleClickZoom: false, //是否需要双击缩放
      // keyboard: true, //是否需要键盘交互
      // mouseWheelZoom: true, //是否需要鼠标滚轮缩放
      // shiftDragZoom: true, //是否需要按住 Shift 键拖动缩放
      // dragPan: true, //是否需要拖动平移
      // pinchRotate: true, //是否需要捏合旋转
      // pinchZoom: true, //是否需要捏合缩放
      //zoomDelta: 2, //使用键盘或双击缩放时的缩放级别增量
      //zoomDuration: 2000, //缩放动画的持续时间
    }),
  })
  //属性查询
  getClickInfo()
  //当前定位点添加至地图
  new VectorLayer({
    map: map.value,
    source: new VectorSource({
      features: [positionFeature],
      wrapX: false,
    }),
  })

  //测量绘制添加至地图
  // map.value.addLayer(measureVector)

  //导入本地文件
  addKmlLayer()
  addKmzLayer()
  addShpLayer()
  addShpZipLayer()
  addGeojsonLayer()
}

/* 属性查询 */
let propertyTableData = ref([])
let tableFeatureName = ref('')
let popupInfo = reactive({})
let propertiesInfo = reactive({})
let newArray = ref([])
let popup
function getClickInfo() {
  popup = new Overlay({
    element: document.getElementById('popup'),
    //autoPan: true,
  })
  //有bug：关闭的图层也能查询到属性
  map.value.on('singleclick', function (evt) {
    const coordinate = evt.coordinate
    const viewResolution = /** @type {number} */ (view.getResolution())
    const url = wmsSource.getFeatureInfoUrl(
      coordinate,
      viewResolution,
      'EPSG:4326',
      { INFO_FORMAT: 'application/json', FEATURE_COUNT: 99999 }
    )
    if (url) {
      fetch(url)
        .then((response) => response.text())
        .then((json) => {
          tableFeatureName.value = ''
          propertyTableData.value.length = 0
          popupInfo = JSON.parse(json)
          propertiesInfo = popupInfo.features[0].properties
          tableFeatureName.value = popupInfo.features[0].properties.名称
          for (let [key, value] of Object.entries(propertiesInfo)) {
            newArray = { key: key, value: value }
            propertyTableData.value.push(newArray)
          }
          popup.setPosition(coordinate)
          map.value.addOverlay(popup)
        })
    }

    //点击空白处关闭弹窗
    if (tableFeatureName.value != '') {
      popup.setPosition(undefined)
    }
  })

  //鼠标经过图层变小手
  map.value.on('pointermove', function (evt) {
    if (evt.dragging) {
      return
    }
    //方法有问题，只有最后一个图层有效
    for (let i = 0; i < geoserverLayers.length; i++) {
      let data = geoserverLayers[i].getData(evt.pixel)
      let hit = data && data[3] > 0 // transparent pixels have zero for data[3]
      map.value.getTargetElement().style.cursor = hit ? 'pointer' : ''
    }
  })
}

//点击关闭按钮关闭弹窗
function closePopup() {
  popup.setPosition(undefined)
}

/* 地图工具 */
const zoom = view.getZoom()
const center = view.getCenter()
const rotation = view.getRotation()
//默认视图
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
  coordinates[0] = falseCoordinates[0] + 0.1811
  coordinates[1] = falseCoordinates[1] - 0.0634
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

//测量
//点坐标测量
let mousePositionControl
function coordinateMeasure() {
  clear()
  mousePositionControl = new control.MousePosition({
    coordinateFormat: function (e) {
      return toStringHDMS(e)
      // let stringifyFunc = createStringXY(4)
      // let str = stringifyFunc(e)
      // return 'X: ' + str.split(',')[0] + '&nbsp;' + ' Y: ' + str.split(',')[1]
    },
    projection: 'ESPG:4326',
  })
  map.value.addControl(mousePositionControl)
}

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
      osmLayer.setVisible(false)
      break
    case 2:
      basemapImage.value = '天地图影像'
      tdcvaLayer.setVisible(true)
      tdvecLayer.setVisible(false)
      tdimgLayer.setVisible(true)
      tdterLayer.setVisible(false)
      osmLayer.setVisible(false)
      break
    case 3:
      basemapImage.value = '天地图地形'
      tdcvaLayer.setVisible(false)
      tdvecLayer.setVisible(false)
      tdimgLayer.setVisible(false)
      tdterLayer.setVisible(true)
      osmLayer.setVisible(false)
      break
    case 4:
      basemapImage.value = 'OSM地图'
      tdcvaLayer.setVisible(false)
      tdvecLayer.setVisible(false)
      tdimgLayer.setVisible(false)
      tdterLayer.setVisible(false)
      osmLayer.setVisible(true)
      break
  }
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

/*图层控制与标绘组件*/
.left-card {
  position: absolute;
  transform: translate(8px, 8px);
  opacity: 0.95;
  width: 300px;
  z-index: 9;
}

.toggle-button ::v-deep .el-card__body {
  padding: 0px;
  text-align: center;
}
.toggle-button ::v-deep el-button {
  display: inline-block;
  margin-left: 0px;
}

.toggle-button-select ::v-deep {
  margin-left: 0px;
  font-size: 20px;
  padding: 0px;
  width: 149px;
}

/* 选中文字颜色 */
.toggle-button-select.el-button--info.is-text.is-has-bg ::v-deep {
  color: #46a0fe;
  /* font-weight: bolder; */
}

/* 图层卡片 */
.layer-search {
  margin-bottom: 13px;
}

/* 标绘卡片 */
#draw-card {
  display: none;
  text-align: center;
}

/*地图工具组件css*/
.map-tool {
  position: absolute;
  right: 8px;
  top: 69px;
  opacity: 0.9;
  z-index: 9;
}

.map-tool-item {
  text-align: center;
}
.map-tool-item .el-button ::v-deep {
  margin-left: 0px;
  padding: 0px;
  width: 125px;
}

/* 上传对话框 */
.import {
  /* display: none; */
  position: fixed;
  left: 38%;
  top: 69px;
  width: 450px;
  height: auto;
  background-color: #ffffff;
  opacity: 0.9;
  z-index: 12;
}

#import-kml,
#import-kmz,
#import-shp,
#import-shp-zip,
#import-Geojson {
  display: none;
}

/*底图切换工具*/
.basemap-toggle {
  position: absolute;
  text-align: center;
  right: 9px;
  bottom: 41px;
  opacity: 0.9;
  z-index: 9;
}

.basemap-toggle .el-card ::v-deep {
  width: 80px;
  height: 80px;
  cursor: pointer;
  --el-card-border-radius: 4px;
  --el-card-padding: 0px;
}

.basemap-toggle .el-card .el-card__body ::v-deep {
  height: 80px;
}

.basemap-toggle h6 {
  color: #91b9cf;
  font-family: '微软雅黑';
  font-weight: 600;
  text-shadow: 0 0 0.5px #333738;
  margin: 0;
  transform: translate(0%, -150%);
}

.basemap-toggle-row .el-row ::v-deep {
  height: 80px;
  padding-left: 1px;
}

.basemap-toggle-row {
  text-align: center;
}

.basemap-toggle-row h6 {
  color: #91b9cf;
  font-family: '微软雅黑';
  font-weight: 600;
  text-shadow: 0 0 0.5px #333738;
  margin: 0;
  transform: translate(0%, -150%);
}

.basemap-toggle-row .el-image {
  transition: all 0.3s;
}

.basemap-toggle-row .el-image:hover {
  transform: scale(1.04);
}
</style>
