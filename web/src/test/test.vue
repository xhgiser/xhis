<template>
  <div class="container">
    <h3>vue+openlayers: 上传GeoJSON文件，并在map上显示</h3>
    <p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
    <h4>
      <input
        style="margin-top: 16px"
        type="file"
        id="fileselect"
        accept=".geojson,.json"
      />
    </h4>
    <div id="vue-openlayers"></div>
  </div>
</template>
<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import SourceVector from 'ol/source/Vector'
import LayerVector from 'ol/layer/Vector'
import { Tile } from 'ol/layer'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON'

import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import Circle from 'ol/style/Circle'
import Text from 'ol/style/Text'
import Icon from 'ol/style/Icon'

export default {
  name: 'VectorJSON',
  data() {
    return {
      map: null,
      source: new SourceVector({
        wrapX: false,
        format: new GeoJSON({}),
      }),
    }
  },
  methods: {
    readFile() {
      let fileselect = document.querySelector('#fileselect')
      fileselect.addEventListener(
        'change',
        function (e) {
          let files = e.target.files
          let filetype = files[0].name.split('.')[1]
          console.log('文件类型' + filetype)
          if (files.length === 0 || filetype != 'json') {
            if (files.length === 0 || filetype != 'geojson') {
              alert('没有数据，请重新上传新文件！')
              return
            }
          }
          let reader = new FileReader()
          reader.readAsText(files[0]) //读取KML文件的形式
          let that = this
          reader.onload = function (evt) {
            let shparray = evt.target.result

            // let allFeatures=new GeoJSON().readFeatures(shparray,
            let allFeatures = that.source.getFormat().readFeatures(shparray, {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857',
            })
            console.log(allFeatures)
            that.source.addFeatures(allFeatures)

            that.source.forEachFeature(function (feature) {
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
        }.bind(this)
      )
    },

    initMap() {
      this.map = new Map({
        target: 'vue-openlayers',
        layers: [
          new Tile({
            source: new OSM(),
          }),
          new LayerVector({
            source: this.source,
          }),
        ],
        view: new View({
          projection: 'EPSG:3857',
          center: fromLonLat([8.2275, 46.8185]),
          zoom: 6,
        }),
      })
    },
  },
  mounted() {
    this.initMap()
    this.readFile()
  },
}
</script>

<style scoped>
.container {
  width: 840px;
  height: 590px;
  margin: 50px auto;
  border: 1px solid #42b983;
}

#vue-openlayers {
  width: 800px;
  height: 400px;
  margin: 0 auto;
  border: 1px solid #42b983;
  position: relative;
}
</style>
