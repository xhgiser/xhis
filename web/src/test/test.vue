<template>
  <div class="container">
    <h3>vue+openlayers: 使用draw绘制多边形，导出KML文件，自定义name和style</h3>
    <p>大剑师兰特, 还是大剑师兰特</p>
    <h4>
      <el-button type="primary" size="mini" @click="drawPolygon()"
        >绘制多边形</el-button
      >
      <el-button type="danger" size="mini" @click="clearDraw()"
        >清除图形</el-button
      >
      <el-button type="info" size="mini" @click="exportKML()"
        >导出KML</el-button
      >
    </h4>
    <div id="vue-openlayers"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import Feature from 'ol/Feature'
import LayerVector from 'ol/layer/Vector'
import SourceVector from 'ol/source/Vector'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import Circle from 'ol/style/Circle'
import Draw from 'ol/interaction/Draw'
import KML from 'ol/format/KML'
import { saveAs } from 'file-saver'
export default {
  name: 'exportKML',
  data() {
    return {
      map: null,
      osmLayer: null,
      draw: null,
      source: new SourceVector({
        wrapX: false,
        useSpatialIndex: false,
        features: [],
      }),
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    exportKML() {
      //设置feature的style和名字
      this.source.forEachFeature(function (feature) {
        let style = new Style({
          fill: new Fill({
            color: '#B0C4DE',
          }),
          stroke: new Stroke({
            color: 'red',
          }),
        })
        feature.setStyle(style)
        feature.setProperties({
          name: 'kmlName',
        })
      })

      let features = this.source.getFeatures()
      let kmlData = new KML().writeFeaturesNode(features)
      const str = new XMLSerializer().serializeToString(kmlData)
      console.log(str)
      // saveAs(new Blob([str], {
      //  type: 'text/plain;charset=utf-8'
      // }), `aaa.kml`);
    },

    clearDraw() {
      this.source.clear()
    },
    drawPolygon() {
      if (this.draw !== null) {
        this.map.removeInteraction(this.draw)
      }
      let type = 'Polygon'
      this.draw = new Draw({
        source: this.source,
        type: type,
        style: new Style({
          fill: new Fill({
            color: '#fff',
          }),
          stroke: new Stroke({
            width: 2,
            color: 'blue',
          }),
        }),
      })
      this.map.addInteraction(this.draw)
      this.draw.on('drawend', (e) => {
        this.map.removeInteraction(this.draw)
      })
    },

    initMap() {
      this.osmLayer = new TileLayer({
        source: new OSM(),
      })

      let vector = new LayerVector({
        source: this.source,
        style: new Style({
          fill: new Fill({
            color: 'transparent',
          }),
          stroke: new Stroke({
            width: 2,
            color: 'blue',
          }),
        }),
      })
      this.map = new Map({
        layers: [this.osmLayer, vector],
        view: new View({
          center: [-116, -39.5],
          zoom: 8,
          projection: 'EPSG:4326',
        }),
        target: 'vue-openlayers',
      })
    },
  },
}
</script>
<style scoped>
.container {
  width: 840px;
  height: 570px;
  margin: 50px auto;
  border: 1px solid #42b983;
}

#vue-openlayers {
  width: 800px;
  height: 400px;
  margin: 0 auto;
  border: 1px solid #42b983;
}
</style>
