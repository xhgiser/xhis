<!-- 水利一张图 -->
<template #reference>
  <div id="map">
    <PropertyPopup
      :propertyTableData="propertyTableData"
      :tableFeatureName="tableFeatureName"
    ></PropertyPopup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onMounted } from '@vue/runtime-core'
import { Map, View } from 'ol'
import { defaults as defaultControls } from 'ol/control.js'
import TileLayer from 'ol/layer/Tile'
import { XYZ, TileWMS } from 'ol/source'
import Overlay from 'ol/Overlay'
import PropertyPopup from '@/components/Common/PropertyPopup.vue'

const map = ref()

const target = 'map'

const layer = new TileLayer({
  title: '天地图矢量图层',
  source: new XYZ({
    url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=9893433c99cfb657e6ec3a92fe4068e5',
    wrapX: false,
  }),
})

const zjlayer = new TileLayer({
  title: '天地图矢量图层注记',
  source: new XYZ({
    url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=9893433c99cfb657e6ec3a92fe4068e5',
    wrapX: false,
  }),
})

const wmsSource = new TileWMS({
  //不能设置为0，否则地图不展示。
  ratio: 1,
  url: 'http://192.168.188.8:8086/geoserver/xhis/wms',
  params: {
    LAYERS: 'xhis:map_river',
    STYLES: '',
    VERSION: '1.1.1',
    tiled: true,
  },
  serverType: 'geoserver',
  crossOrigin: 'anonymous',
})

const wmsLayer = new TileLayer({
  source: wmsSource,
})

const view = new View({
  center: [118.655626, 37.502069],
  projection: 'EPSG:4326', //指定投影
  zoom: 10,
})

//属性弹窗相关变量
let propertyTableData = ref([])
let popupInfo = reactive({})
let tableFeatureName = ref('')
let propertiesInfo = reactive({})
let newArray = ref([])

function initMap() {
  map.value = new Map({
    target: target,
    layers: [layer, zjlayer, wmsLayer],
    controls: defaultControls({
      attribution: false, //禁用右下角的地图属性组件
      rotate: false, //禁用旋转组件 alt+shift true旋转交互时会有一个旋转控件显示出来
      zoom: false, //禁用右上角缩放组件
    }),
    view: view,
  })
  //属性查询
  getClickInfo()
}

//属性查询
function getClickInfo() {
  const popup = new Overlay({
    element: document.getElementById('popup'),
    //autoPan: true,
  })
  //控制台报错
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

  //鼠标移至要素处变小手
  map.value.on('pointermove', function (evt) {
    if (evt.dragging) {
      return
    }
    const data = wmsLayer.getData(evt.pixel)
    const hit = data && data[3] > 0 // transparent pixels have zero for data[3]
    map.value.getTargetElement().style.cursor = hit ? 'pointer' : ''
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
