import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { XYZ, TileWMS, OSM, Vector as VectorSource } from 'ol/source'

//天地图token
const tdtoken = '92abf9017d78cd71a3ae51d0874b6578'
//星图token
const xttoken =
  'cec6f2d6a92d3cc95a61b873df5da5ffa1f4d2846fcf61ce384aa91aa0ca0141'
//版权
const attributions =
  '<a href="http://www.xinhuigs.com/" target="_blank">&copy;&nbsp;&nbsp;2022&nbsp;&nbsp;Xinhui&nbsp;Group&nbsp;&nbsp;&nbsp;All&nbsp;Rights&nbsp;Reserved.</a> '
//geoserver路径
const geoserverUrl = 'http://192.168.188.8:8086'
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

//OSM图层,国内网络无法加载
const osmLayer = new TileLayer({
  title: 'OSM地图',
  source: new OSM({
    attributions: attributions,
  }),
  visible: false,
})

//水利一张图图层
const waterLayers = [
  {
    value: 'xhis:water_river',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_river',
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
    value: 'xhis:water_reservoir_large',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_reservoir_large',
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
    value: 'xhis:water_reservoir_small1',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_reservoir_small1',
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
    value: 'xhis:water_reservoir_small2',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_reservoir_small2',
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
    value: 'xhis:water_sluice_tide',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_sluice_tide',
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
    value: 'xhis:water_sluice_flood_diversion',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_sluice_flood_diversion',
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
    value: 'xhis:water_sluice_controlling',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_sluice_controlling',
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
    value: 'xhis:water_sluice_outlet',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_sluice_outlet',
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
    value: 'xhis:water_sluice_inlet',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_sluice_inlet',
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
    value: 'xhis:water_rubber_dam',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_rubber_dam',
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
    value: 'xhis:water_pump_station',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_pump_station',
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
    value: 'xhis:water_hydrology_station',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_hydrology_station',
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
    value: 'xhis:water_flood',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:water_flood',
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

//灌区一张图图层
const irrigationLayers = [
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

//管线一张图图层
const pipeLayers = [
  {
    value: 'xhis:pipe_yjline',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_yjline',
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
    value: 'xhis:pipe_yjpoint',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_yjpoint',
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
    value: 'xhis:pipe_jsline',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_jsline',
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
    value: 'xhis:pipe_jspoint',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_jspoint',
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
    value: 'xhis:pipe_zyline',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_zyline',
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
    value: 'xhis:pipe_zypoint',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_zypoint',
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
    value: 'xhis:pipe_lhline',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_lhline',
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
    value: 'xhis:pipe_lhpoint',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_lhpoint',
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
    value: 'xhis:pipe_ysline',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_ysline',
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
    value: 'xhis:pipe_ysjpoint',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_ysjpoint',
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
    value: 'xhis:pipe_ysbpoint',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_ysbpoint',
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
    value: 'xhis:pipe_wsline',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_wsline',
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
    value: 'xhis:pipe_wspoint',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_wspoint',
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
    value: 'xhis:pipe_hsline',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_hsline',
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
    value: 'xhis:pipe_hspoint',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_hspoint',
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
    value: 'xhis:pipe_pjline',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_pjline',
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
    value: 'xhis:pipe_pjpoint',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_pjpoint',
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
    value: 'xhis:pipe_zsline',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_zsline',
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
    value: 'xhis:pipe_zspoint',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:pipe_zspoint',
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

//规划一张图图层
const planLayers = [
  {
    value: 'xhis:plan_gtdc_ckyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_ckyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_czcdlyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_czcdlyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_czzzyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_czzzyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_ganq',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_ganq',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_gkmtyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_gkmtyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_gjyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_gjyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_gyyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_gyyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_glyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_glyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_gyssyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_gyssyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_gyyld',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_gyyld',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_gouq',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_gouq',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_gdysyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_gdysyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_gmld',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_gmld',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_gcyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_gcyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_gy',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_gy',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_hd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_hd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_hlsm',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_hlsm',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_jcyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_jcyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_jgttxwcbyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_jgttxwcbyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_jtfwczyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_jtfwczyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_kjwwyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_kjwwyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_ktzrgmcd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_ktzrgmcd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_ktsm',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_ktsm',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_kxd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_kxd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_ltd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_ltd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_nltt',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_nltt',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_ncdl',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_ncdl',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_nczjd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_nczjd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_qtcd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_qtcd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_qtld',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_qtld',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_qtyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_qtyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_qmld',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_qmld',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_rgmcd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_rgmcd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_syfwyssyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_syfwyssyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_ssnyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_ssnyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_sgjzyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_sgjzyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_sjd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_sjd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_sksm',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_sksm',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_st',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_st',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_tsyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_tsyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_tlyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_tlyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_wlccyd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_wlccyd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_yhtt',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_yhtt',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_yjd',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_yjd',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_yt',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_yt',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
  {
    value: 'xhis:plan_gtdc_yzkt',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:plan_gtdc_yzkt',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.7,
      visible: false,
    }),
  },
]

//地质一张图图层
const geologyLayers = [
  {
    value: 'xhis:geology_dzt',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:geology_dzt',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.9,
      visible: false,
    }),
  },
  {
    value: 'xhis:geology_dzdc',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:geology_dzdc',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.9,
      visible: false,
    }),
  },
  {
    value: 'xhis:geology_jx',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:geology_jx',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.9,
      visible: false,
    }),
  },
  {
    value: 'xhis:geology_lspy',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:geology_lspy',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.9,
      visible: false,
    }),
  },
  {
    value: 'xhis:geology_xbjx',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:geology_xbjx',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.9,
      visible: false,
    }),
  },
  {
    value: 'xhis:geology_tws',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:geology_tws',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.9,
      visible: false,
    }),
  },
  {
    value: 'xhis:geology_zk',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:geology_zk',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.9,
      visible: false,
    }),
  },
  {
    value: 'xhis:geology_hsk',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:geology_hsk',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.9,
      visible: false,
    }),
  },
  {
    value: 'xhis:geology_xblhy',
    layer: new TileLayer({
      source: new TileWMS({
        url: geoserverUrl + '/geoserver/xhis/wms',
        params: {
          FORMAT: 'image/png',
          VERSION: '1.1.1',
          LAYERS: 'xhis:geology_xblhy',
          TILED: true,
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        projection: 'ESPG:4326',
      }),
      zIndex: 2,
      opacity: 0.9,
      visible: false,
    }),
  },
]

//字段别名映射关系
const fieldMap = {
  //通用
  name: '名称',
  provincial: '所在省份',
  city: '所在市',
  county: '所在县区',
  village: '所在乡镇',
  hamlet: '所在村(街道)',
  remark: '备注',
  bz: '备注',
  position: '所在位置',
  longitude: '经度',
  latitude: '纬度',
  long: '经度',
  lat: '纬度',
  x: 'X坐标',
  y: 'Y坐标',
  elev: '高程',
  elevation: '高程',
  height: '高度',
  length: '长度',
  depth: '深度',
  feature: '特征',
  character: '特征',
  //shape_leng: '长度',
  //shape_area: '面积'
  //水利一张图-河流
  rivername: '河流名称',
  rivercode: '河流编码',
  uplevlname: '上一级河流名称',
  riverlngth: '河流长度(km)',
  valleyarea: '流域面积(km²)',
  provncarea: '分省面积(km²)',
  rivertype: '河流类型',
  through: '流经',
  sourcelong: '河源经度',
  sourcelat: '河源纬度',
  sourcepos: '河源所在地',
  estuarylong: '河口经度',
  estuarylat: '河口纬度',
  estuarypos: '河口所在地',
  gradient: '平均比降(‰)',
  sourceelev: '河源点高程(m)',
  estuaryele: '河口点高程(m)',
  waterdepth: '多年平均年降水深(mm)',
  runoffdept: '多年平均年径流深(mm)',
  hydrology: '水文站和水位站',
  survyflood: '实测和调查最大洪水',
  //水利一张图-水库
  regionname: '所在水资源三级区名称',
  inrivrname: '所在河流(湖泊、水库、渠道)名称',
  reservlev: '水库级别',
  reservtype: '水库类型',
  damtype: '类型',
  dammaterl: '挡水主坝类型按材料分',
  damstructr: '挡水主坝类型按结构分',
  fldbldtype: '主要泄洪建筑物型式',
  arrngepopu: '生产安置人口(万人)',
  buildstate: '工程建设情况',
  buildtime: '建成时间',
  strtbldtim: '开工时间',
  regulate: '水库调节性能',
  projlevel: '工程等别',
  maindamlev: '主坝级别',
  maindamhei: '主坝尺寸坝高(m)',
  maindamlen: '主坝尺寸坝长(m)',
  maxflood: '最大泄洪流量(m³/s)',
  elevsystem: '高程系统',
  damtopelev: '坝顶高程(m)',
  nrmlwtrlev: '正常蓄水位(m)',
  deadwtrlev: '死水位(m)',
  totalvol: '总库容(万m³)',
  benefitvol: '兴利库容(万m³)',
  deadvol: '死库容(万m³)',
  nrmllevvol: '正常蓄水位相应水面面积(km²)',
  wtrsupply: '供水',
  irrigation: '灌溉',
  aquacult: '养殖',
  other: '其它',
  designvol: '设计年供水量',
  tothoelvnv: '2011年供水量(万m³)',
  tothoelvns: '2011年供水量数据来源',
  intakeamnt: '取水口数量(个)',
  supplyobj: '供水对象',
  desnirrvol: '设计灌溉面积(万亩)',
  irrigatobj: '灌溉对象',
  rescompany: '水库管理单位名称',
  resmanage: '水库归口管理部门',
  delimit: '是否完成划界',
  confirmrit: '是否完成确权',
  //水利一张图-闸
  inirrigatn: '所在灌区(引调水工程)名称',
  isgatestat: '是否为闸站工程',
  iswtrlock: '是否为套闸工程',
  mainbldlev: '主要建筑物级别',
  sluiceopen: '闸孔数量(孔)',
  openwidth: '闸孔总净宽(m)',
  sdischarge: '过闸流量(m³/s)',
  dsretnperd: '设计洪水标准［重现期］(年)',
  ckretnperd: '校核洪水标准［重现期］(年)',
  diversion: '引水能力(万m³)',
  divruseobj: '引水用途供水对象',
  divrusenam: '引水用途灌区名称',
  istwoway: '是否为引排双向闸',
  slucompany: '水闸管理单位名称',
  slumanage: '水闸归口管理部门',
  //水利一张图-坝
  rbrdamheit: '橡胶坝坝高(m)',
  rbrdamleng: '橡胶坝坝长(m)',
  rbrdamelev: '橡胶坝坝顶高程(m)',
  //水利一张图-泵站
  pumptype: '泵站类型',
  isdvrsproj: '是否为引泉工程',
  projtask: '工程任务',
  instldisch: '装机流量(m³/s)',
  instlpower: '装机功率(kW)',
  designlift: '设计扬程(m)',
  pumptotal: '水泵数量(台)',
  pumcompany: '泵站管理单位名称',
  pummanage: '泵站归口管理部门',
  //水利一张图-测站
  statncode: '测站编码',
  statntype: '测站类型',
  statntime: '设站日期',
  statnpos: '测站地点',
  srvycntnt: '观测项目',
  extrctarea: '提取面积',
  //水利一张图-洪水
  floodname: '洪水名称',
  maxdischar: '洪峰流量',
  occurtime: '发生时间',
  //灌区一张图
  irrname: '灌区名称',
  irrtype: '灌区类型',
  dirrarea: '设计灌溉面积',
  rirrarea: '现状有效灌溉面积',
  clarea: '耕地面积',
  //angle:'要素角度',
  measure: '量水设施类别',
  //管线一张图-点
  gxlx: '管线类型',
  tsdh: '图上点号',
  wtdh: '物探点号',
  dmgc: '地面高程',
  fsw: '附属物',
  jdepth: '井底深',
  jgcz: '井盖材质',
  jgcc: '井盖尺寸',
  jscc: '井室尺寸',
  jcz: '井材质',
  jxz: '井形状(0:无井;1:圆井;2:方井;3:雨篦子)',
  pszdl: '所在道路',
  dz: '地址',
  pqsdw: '权属单位',
  pjsrq: '埋设年代',
  ptcsj: '探测时间',
  ptcdw: '探测单位',
  pjldw: '监理单位',
  //pzjx: '点号注记X',
  //pzjy: '点号注记Y',
  zt: '状态',
  dfhbm: '点符号编码',
  //dangle: '旋转角度',
  //管线一张图-线
  qdid: '起始管线点编号',
  zdid: '终止管线点编号',
  qdms: '起始管线点埋深',
  zdms: '终止管线点埋深',
  qdgc: '起始管线点高程',
  zdgc: '终止管线点高程',
  cz: '材质',
  gj: '管径',
  msfs: '埋设方式',
  yl: '压力',
  // dy: '电压(千伏)',
  // gkks: '管块孔数',
  // zyks: '占用孔数',
  // dlts: '电缆条数',
  szdl: '所在道路',
  qsdw: '权属单位',
  jsrq: '建设日期',
  lx: '流向(0:未知;1:起点-终点;2:终点-起点)',
  tgcz: '套管材质',
  tggj: '套管管径',
  syzt: '使用状态',
  gdlt: '管道流体性质',
  jldw: '监理单位',
  // zjx: '专业注记X',
  // zjy: '专业注记Y',
  //规划一张图-国土调查土地利用
  bsm: '标识码',
  ysdm: '要素代码',
  tbybh: '图斑预编号',
  tbbh: '图斑编号',
  dlbm: '地类编码',
  dlmc: '地类名称',
  qsxz: '权属性质',
  qsdwdm: '权属单位代码',
  qsdwmc: '权属单位名称',
  zldwdm: '坐落单位代码',
  zldwmc: '坐落单位名称',
  tbmj: '图斑面积',
  kcdlbm: '扣除地类编码',
  kcxs: '扣除地类系数',
  kcmj: '扣除地类面积',
  tbdlmj: '图斑地类面积',
  gdlx: '耕地类型',
  gdpdjb: '耕地坡度级别',
  xzdwkd: '线状地物宽度',
  tbxhdm: '图斑细化代码',
  tbxhmc: '图斑细化名称',
  zzsxdm: '种植属性代码',
  zzsxmc: '种植属性名称',
  gddb: '耕地等别',
  frdbs: '飞入地标识',
  czcsxm: '城镇村属性码',
  sjnf: '数据年份',
  mssm: '描述说明',
  hdmc: '海岛名称',
  //地质一张图
  dztarea: '地质体面积(万km²)',
  perimeter: '周长(百km)',
  dztsymbol: '地质体符号化',
  unitname: '单元名称',
  dclength: '断层长度(百km)',
  dcattr: '断层属性',
  dcname: '断层名称',
  dcsystem: '断层系',
  dcstatus: '断层状态',
  jxlength: '界线长度(百km)',
  lslength: '岩层长度(百km)',
  lsname: '片岩名称',
  dzx: '经度',
  dzy: '纬度',
  mothod: '方法',
}

const mapconfig = {
  tdtoken: tdtoken,
  xttoken: xttoken,
  attributions: attributions,
  geoserverUrl: geoserverUrl,
  tdcvaLayer: tdcvaLayer,
  tdvecLayer: tdvecLayer,
  tdimgLayer: tdimgLayer,
  tdterLayer: tdterLayer,
  xtvecLayer: xtvecLayer,
  xtciaLayer: xtciaLayer,
  xtimgLayer: xtimgLayer,
  xtterLayer: xtterLayer,
  osmLayer: osmLayer,
  waterLayers: waterLayers,
  irrigationLayers: irrigationLayers,
  pipeLayers: pipeLayers,
  planLayers: planLayers,
  geologyLayers: geologyLayers,
  fieldMap: fieldMap,
}

export default mapconfig
