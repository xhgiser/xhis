<!-- 地图工具 -->
<template>
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
  <div class="map-tool">
    <el-button-group>
      <el-popover placement="bottom" trigger="click">
        <template #reference>
          <el-button type="default" :icon="Upload">导出</el-button>
        </template>
        <div class="map-tool-item">
          <el-button type="default" text @click="exportJpeg">导出JPEG</el-button
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
          <el-button type="default" @click="lineMeasure" text
            >距离测量</el-button
          ><br />
          <el-button type="default" @click="areaMeasure" text
            >面积测量</el-button
          ><br />
          <el-button type="default" @click="stopMeasure" text
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
        ><el-button type="default" :icon="ZoomOut" @click="zoomOut"></el-button
      ></el-tooltip>

      <el-tooltip content="定位" placement="bottom" effect="light"
        ><el-button type="default" :icon="Location" @click="locate"></el-button
      ></el-tooltip>

      <el-tooltip content="默认视图" placement="bottom" effect="light"
        ><el-button type="default" :icon="House" @click="reset"></el-button
      ></el-tooltip>
    </el-button-group>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import {
  Upload,
  Download,
  Coordinate,
  RefreshRight,
  Brush,
  ZoomIn,
  ZoomOut,
  Location,
  House,
  Close,
} from '@element-plus/icons-vue'

defineProps({
  coordinates: {
    type: Array,
  },
})

const emit = defineEmits([
  'reset',
  'locate',
  'zoomOut',
  'zoomIn',
  'rotate',
  'clear',
  'lineMeasure',
  'areaMeasure',
  'stopMeasure',
  'importKml',
  'importKmz',
  'importShp',
  'importShpZip',
  'importGeojson',
  'exportJpeg',
  'exportPdf',
  'exportKml',
  'closeUpload',
])

function reset() {
  emit('reset')
}
function locate() {
  emit('locate')
}
function zoomOut() {
  emit('zoomOut')
}
function zoomIn() {
  emit('zoomIn')
}
function rotate() {
  emit('rotate')
}
function clear() {
  emit('clear')
}
function lineMeasure() {
  emit('lineMeasure')
}
function areaMeasure() {
  emit('areaMeasure')
}
function stopMeasure() {
  emit('stopMeasure')
}
function importKml() {
  emit('importKml')
}
function importKmz() {
  emit('importKmz')
}
function importShp() {
  emit('importShp')
}
function importShpZip() {
  emit('importShpZip')
}
function importGeojson() {
  emit('importGeojson')
}
function exportJpeg() {
  emit('exportJpeg')
}
function exportPdf() {
  emit('exportPdf')
}
function exportKml() {
  emit('exportKml')
}
function closeUpload() {
  emit('closeUpload')
}
</script>

<style scoped>
/*地图工具*/
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
.map-tool-item .el-button /deep/ {
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
</style>
