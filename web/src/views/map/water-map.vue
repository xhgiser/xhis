<!-- 水利一张图 -->
<template #reference>
  <div id="map">
    <el-button color="#626aef" @click="test" class="test">test</el-button>
    <div class="left-card">
      <div class="toggle-button">
        <el-card>
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
      <div class="layer-card">
        <el-card shadow="never">
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
            :default-checked-keys="[1, 2, 3, 4]"
            :props="defaultProps"
            @check-change="layerTreeClick"
          />
        </el-card>
      </div>
    </div>
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
import { XYZ, TileWMS, OSM } from 'ol/source'
import Overlay from 'ol/Overlay'
import PropertyPopup from '@/components/Common/PropertyPopup.vue'
import { Search, CopyDocument, EditPen } from '@element-plus/icons-vue'

//地图初始化变量
const map = ref()
const target = 'map'
let layers = []

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
    children: [
      {
        id: 11,
        label: '河流',
        layerName: 'xhis:water_river',
      },
      {
        id: 12,
        label: '调水工程',
        layerName: '',
      },
      {
        id: 13,
        label: '干渠',
        layerName: '',
      },
      {
        id: 14,
        label: '支渠',
        layerName: '',
      },
      {
        id: 15,
        label: '排沟',
        layerName: '',
      },
      {
        id: 16,
        label: '水库',
        layerName: '',
        children: [
          {
            id: 41,
            label: '大中型',
            layerName: 'xhis:water_reservoir_large',
          },
          {
            id: 42,
            label: '小（Ⅰ）型',
            layerName: 'xhis:water_reservoir_small1',
          },
          {
            id: 43,
            label: '小（Ⅱ）型',
            layerName: 'xhis:water_reservoir_small2',
          },
        ],
      },
      {
        id: 17,
        label: '灌区',
        layerName: '',
      },
      {
        id: 18,
        label: '沉砂池',
        layerName: '',
      },
    ],
  },
  {
    id: 2,
    label: '水工建筑物',
    layerName: '',
    children: [
      {
        id: 19,
        label: '水闸',
        layerName: '',
        children: [
          {
            id: 44,
            label: '引进水闸',
            layerName: 'xhis:water_gate_diversion_intake',
          },
          {
            id: 45,
            label: '节制闸',
            layerName: 'xhis:water_gate_control',
          },
          {
            id: 46,
            label: '分泄洪闸',
            layerName: 'xhis:water_gate_flood_spill',
          },
          {
            id: 47,
            label: '排退水闸',
            layerName: 'xhis:water_gate_drain',
          },
          {
            id: 48,
            label: '挡潮闸',
            layerName: 'xhis:water_gate_tide',
          },
        ],
      },
      {
        id: 20,
        label: '橡胶坝',
        layerName: 'xhis:water_rubber_dam',
      },
      {
        id: 21,
        label: '泵站',
        layerName: 'xhis:water_pumping_station',
      },
      {
        id: 22,
        label: '涵洞',
        layerName: '',
      },
      {
        id: 23,
        label: '堤防',
        layerName: '',
      },
    ],
  },
  {
    id: 3,
    label: '监测站',
    layerName: '',
    children: [
      {
        id: 25,
        label: '水文站',
        layerName: '',
      },
      {
        id: 26,
        label: '水位站',
        layerName: '',
      },
      {
        id: 27,
        label: '气象站',
        layerName: '',
      },
    ],
  },
  {
    id: 4,
    label: '自然事件',
    layerName: '',
    children: [
      {
        id: 27,
        label: '洪水',
        layerName: '',
      },
      {
        id: 28,
        label: '台风',
        layerName: '',
      },
    ],
  },
]

//获取geoserver发布的所有图层，存放于geoserverLayers
let layerArray = []
let geoserverLayers = []
function getGeoserverLayer(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      getGeoserverLayer(arr[i].children)
    } else {
      layerArray = arr[i].layerName
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
        })
        geoserverLayers.unshift(layer)
      }
    }
  }
}
getGeoserverLayer(layersData)
layers = layers.concat(geoserverLayers)

//天地图注记图层
const tdtzjlayer = new TileLayer({
  title: '天地图矢量图层注记',
  source: new XYZ({
    url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=9970c29ec3f3482ac1448cd57b16685d',
    wrapX: false,
  }),
})
layers.unshift(tdtzjlayer)
//天地图图层
const tdtlayer = new TileLayer({
  title: '天地图矢量图层',
  source: new XYZ({
    url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=9970c29ec3f3482ac1448cd57b16685d',
    wrapX: false,
  }),
})
layers.unshift(tdtlayer)

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

const view = new View({
  center: [118.655626, 37.502069],
  projection: 'EPSG:4326', //指定投影
  zoom: 10,
})

//属性弹窗相关
let propertyTableData = ref([])
let tableFeatureName = ref('')
let popupInfo = reactive({})
let propertiesInfo = reactive({})
let newArray = ref([])

//左侧卡片相关
//图层标绘两个按钮按下样式切换
const selecttc = ref('false')
const selectbh = ref(null)
function clicktc() {
  selecttc.value = 'false'
  selectbh.value = null
}
function clickbh() {
  selecttc.value = null
  selectbh.value = 'false'
}

//图层过滤输入框
const input = ref('')

//初始化地图
function initMap() {
  map.value = new Map({
    target: target,
    layers: layers,
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

//图层控制
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

//属性查询
function getClickInfo() {
  const popup = new Overlay({
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

//测试
function test() {
  console.log(geoserverLayers.value)
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

.left-card {
  position: absolute;
  transform: translate(30px, 30px);
  opacity: 0.95;
  width: 300px;
  z-index: 9;
}

.toggle-button /deep/ .el-card__body {
  padding: 0px;
  text-align: center;
}
.toggle-button /deep/ el-button {
  display: inline-block;
  margin-left: 0px;
}

.toggle-button-select /deep/ {
  margin-left: 0px;
  font-size: 20px;
  padding: 0px;
  width: 149px;
}

/* 选中文字颜色 */
.toggle-button-select.el-button--info.is-text.is-has-bg /deep/ {
  color: #46a0fe;
  /* font-weight: bolder; */
}

.layer-search {
  margin-bottom: 13px;
}

.test {
  position: absolute;
  z-index: 99;
}
</style>
