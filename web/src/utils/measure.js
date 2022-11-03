import { ref } from 'vue'
import Draw from 'ol/interaction/Draw'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Point from 'ol/geom/Point'
import { unByKey } from 'ol/Observable'
import Overlay from 'ol/Overlay'
import { Feature } from 'ol'
import { getArea, getLength } from 'ol/sphere'
import LineString from 'ol/geom/LineString'
import Polygon from 'ol/geom/Polygon'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'

export default {
  measure(map, measureType, show) {
    var source = new VectorSource()

    /**
     * Currently drawn feature.
     * @type {module:ol/Feature~Feature}
     */
    var sketch

    /**
     * The help tooltip element.
     * @type {Element}
     */
    var helpTooltipElement

    /**
     * Overlay to show the help messages.
     * @type {module:ol/Overlay}
     */
    var helpTooltip

    /**
     * The measure tooltip element.
     * @type {Element}
     */
    var measureTooltipElement

    /**
     * Overlay to show the measurement.
     * @type {module:ol/Overlay}
     */
    var measureTooltip

    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
    var continuePolygonMsg = ''

    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
    var continueLineMsg = ''

    createMeasureTooltip()
    createHelpTooltip()

    /**
     * Handle pointer move.
     * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
     */
    var pointerMoveHandler = function (evt) {
      if (evt.dragging) {
        return
      }
      /** @type {string} */
      var helpMsg = '请点击开始绘制'
      if (sketch) {
        var geom = sketch.getGeometry()
        if (geom instanceof Polygon) {
          helpMsg = continuePolygonMsg
        } else if (geom instanceof LineString) {
          helpMsg = continueLineMsg
        }
      }

      helpTooltipElement.innerHTML = helpMsg
      helpTooltip.setPosition(evt.coordinate)

      helpTooltipElement.classList.remove('hidden')
    }

    map.on('pointermove', pointerMoveHandler)

    map.getViewport().addEventListener('mouseout', function () {
      helpTooltipElement.classList.add('hidden')
    })

    var draw = ref(null)

    var formatLength = function (line) {
      //获取投影坐标系
      var sourceProj = map.getView().getProjection()
      //ol/sphere里有getLength()和getArea()用来测量距离和区域面积，默认的投影坐标系是EPSG:3857, 其中有个options的参数，可以设置投影坐标系
      var length = getLength(line, {
        projection: sourceProj,
      })
      //var length = getLength(line);
      var output
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm'
      }
      return output
    }

    var formatArea = function (polygon) {
      //获取投影坐标系
      var sourceProj = map.getView().getProjection()
      var area = getArea(polygon, {
        projection: sourceProj,
      })
      //var area = getArea(polygon);
      //console.info(area)
      var output
      if (area > 10000) {
        output =
          Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
      } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
      }
      return output
    }
    var source
    // var layer ;
    // 获取存放feature的vectorlayer层。map初始化的时候可以添加好了
    for (let layerTmp of map.getLayers().getArray()) {
      if (layerTmp.get('name') == 'feature') {
        source = layerTmp.getSource()
      }
    }

    function addInteraction() {
      var type = measureType == 'area' ? 'Polygon' : 'LineString'
      draw.value = new Draw({
        source: source,
        type: type,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: '#0099FF',
            lineDash: [10, 10],
            width: 2,
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)',
            }),
          }),
        }),
        zIndex: 999,
      })
      map.addInteraction(draw.value)

      var listener
      draw.value.on(
        'drawstart',
        function (evt) {
          // set sketch
          sketch = evt.feature

          /** @type {module:ol/coordinate~Coordinate|undefined} */
          var tooltipCoord = evt.coordinate

          listener = sketch.getGeometry().on('change', function (evt) {
            var geom = evt.target
            var output
            if (geom instanceof Polygon) {
              output = formatArea(geom)
              tooltipCoord = geom.getInteriorPoint().getCoordinates()
            } else if (geom instanceof LineString) {
              output = formatLength(geom)
              tooltipCoord = geom.getLastCoordinate()
            }
            measureTooltipElement.innerHTML = output
            measureTooltip.setPosition(tooltipCoord)
          })

          //地图双击事件
          map.on('dblclick', function (evt) {
            var point = new Point(evt.coordinate)
            source.addFeature(new Feature(point))
            // idea = false;
          })
        },
        this
      )

      draw.value.on(
        'drawend',
        function () {
          measureTooltipElement.className = 'tooltip tooltip-static'
          measureTooltip.setOffset([0, -7])
          // unset sketch
          sketch = null
          // unset tooltip so that a new one can be created
          measureTooltipElement = null
          createMeasureTooltip()
          unByKey(listener)
          map.un('pointermove', pointerMoveHandler)
          map.removeInteraction(draw.value)
          helpTooltipElement.classList.add('hidden')
        },
        this
      )
    }

    function createHelpTooltip() {
      if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement)
      }
      helpTooltipElement = document.createElement('div')
      helpTooltipElement.className = 'tooltip hidden'
      helpTooltip = new Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
      })
      map.addOverlay(helpTooltip)
    }

    function createMeasureTooltip() {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement)
      }
      measureTooltipElement = document.createElement('div')
      measureTooltipElement.className = 'tooltip tooltip-measure'
      measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
      })
      map.addOverlay(measureTooltip)
    }
    // 量测调用
    addInteraction()

    var vector = new VectorLayer({
      name: 'lineAndArea',
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0)',
        }),
        stroke: new Stroke({
          color: '#3E9ECE',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0)',
          }),
        }),
      }),
      zIndex: 999,
    })

    if (show && measureType) {
      map.addLayer(vector)
    } else {
      map.getOverlays().clear()

      map
        .getLayers()
        .getArray()
        .forEach((layer, index, array) => {
          if (layer.get('name') == 'lineAndArea') {
            map.removeLayer(layer)
          }
        })
      map.removeInteraction(draw.value)
    }

    //   document.addEventListener('keyup',function (event) {
    //     if (event.keyCode == 13)
    //         draw.abortDrawing();
    //     else if (event.keyCode == 90 && event.ctrlKey) {
    //         console.log(draw);
    //         if (typeSelect.value== 'Circle')
    //             draw.abortDrawing();
    //         else
    //             draw.removeLastPoint()
    //     }
    // })
    //绘制结束
  },
}
