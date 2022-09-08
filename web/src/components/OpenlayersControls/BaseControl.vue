<!--  -->
<template>
  <div class="MapTool">
    <el-button-group>
      <el-popover placement="bottom" :width="400" trigger="click">
        <template #reference>
          <el-button type="info" :icon="CopyDocument">底图切换</el-button>
        </template>
        <el-row :gutter="10">
          <el-col v-for="(item, index) in baseMap" :key="index" :span="8">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '145px',
                cursor: 'pointer',
              }"
            >
              <img
                :src="require(`@/assets/images/MapLogo/${item.name}.jpg`)"
                class="basemapimage"
              />
              <div style="padding: 0px" class="basemapname">
                <el-button text class="button" size="default">{{
                  item.name
                }}</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-popover>

      <el-popover
        placement="bottom"
        :width="300"
        trigger="click"
        :disabled="!disabled"
        :auto-close="0"
        :hide-after="9999999"
      >
        <template #reference>
          <el-button type="info" :icon="Suitcase" @click="disabled = !disabled"
            >测量工具</el-button
          >
        </template>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '90px',
                cursor: 'pointer',
              }"
            >
              <div class="measureicon" style="background-color: #5e616d">
                <img
                  src="@/assets/images/Measure/空间距离.png"
                  class="measureimage"
                />
              </div>
              <el-button text class="measurebutton" size="default">
                空间距离
              </el-button>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '90px',
                cursor: 'pointer',
              }"
            >
              <div class="measureicon" style="background-color: #5e616d">
                <img
                  src="@/assets/images/Measure/贴地距离.png"
                  class="measureimage"
                />
              </div>
              <el-button text class="measurebutton" size="default">
                贴地距离
              </el-button>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '90px',
                cursor: 'pointer',
              }"
            >
              <div class="measureicon" style="background-color: #5e616d">
                <img
                  src="@/assets/images/Measure/剖面.png"
                  class="measureimage"
                />
              </div>
              <el-button text class="measurebutton" size="default">
                剖面
              </el-button>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '90px',
                cursor: 'pointer',
              }"
            >
              <div class="measureicon" style="background-color: #5e616d">
                <img
                  src="@/assets/images/Measure/水平面积.png"
                  class="measureimage"
                />
              </div>
              <el-button text class="measurebutton" size="default">
                水平面积
              </el-button>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '90px',
                cursor: 'pointer',
              }"
            >
              <div class="measureicon" style="background-color: #5e616d">
                <img
                  src="@/assets/images/Measure/贴地面积.png"
                  class="measureimage"
                />
              </div>
              <el-button text class="measurebutton" size="default">
                贴地面积
              </el-button>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '90px',
                cursor: 'pointer',
              }"
            >
              <div class="measureicon" style="background-color: #5e616d">
                <img
                  src="@/assets/images/Measure/方位角.png"
                  class="measureimage"
                />
              </div>
              <el-button text class="measurebutton" size="default">
                方位角
              </el-button>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '90px',
                cursor: 'pointer',
              }"
            >
              <div class="measureicon" style="background-color: #5e616d">
                <img
                  src="@/assets/images/Measure/三角测量.png"
                  class="measureimage"
                />
              </div>
              <el-button text class="measurebutton" size="default">
                三角测量
              </el-button>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '90px',
                cursor: 'pointer',
              }"
            >
              <div class="measureicon" style="background-color: #5e616d">
                <img
                  src="@/assets/images/Measure/坐标测量.png"
                  class="measureimage"
                />
              </div>
              <el-button text class="measurebutton" size="default">
                坐标测量
              </el-button>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '90px',
                cursor: 'pointer',
              }"
            >
              <div class="measureicon" style="background-color: #5e616d">
                <img
                  src="@/assets/images/Measure/高差.png"
                  class="measureimage"
                />
              </div>
              <el-button text class="measurebutton" size="default">
                高差
              </el-button>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-card
              shadow="hover"
              :body-style="{
                padding: '0px',
                height: '135px',
                cursor: 'pointer',
              }"
            >
              <div class="measureresult">
                <div>
                  单位:&nbsp;&nbsp;&nbsp;&nbsp;
                  <el-select
                    v-model="value"
                    class="m-2"
                    placeholder="自动"
                    style="width: 70%"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in unitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <br />
                <div>结果:</div>
                <br />
                <div style="text-align: center">
                  <el-button
                    type="warning"
                    plain
                    style="width: 90%"
                    @click="disabled = !disabled"
                    >清除测量结果</el-button
                  >
                </div>
              </div>
            </el-card>
          </el-col></el-row
        >
      </el-popover>

      <el-tooltip
        :disabled="disabled"
        content="鹰眼"
        placement="bottom"
        effect="light"
        ><el-button
          type="info"
          :icon="Connection"
          @click="disabled = !disabled"
        ></el-button
      ></el-tooltip>

      <el-tooltip
        :disabled="disabled"
        content="分屏"
        placement="bottom"
        effect="light"
        ><el-button
          type="info"
          :icon="ScaleToOriginal"
          @click="disabled = !disabled"
        ></el-button
      ></el-tooltip>

      <el-tooltip
        :disabled="disabled"
        content="全屏"
        placement="bottom"
        effect="light"
        ><el-button
          type="info"
          :icon="FullScreen"
          @click="disabled = !disabled"
        ></el-button
      ></el-tooltip>

      <el-tooltip
        :disabled="disabled"
        content="默认视图"
        placement="bottom"
        effect="light"
        ><el-button type="info" :icon="House" @click="reset"></el-button
      ></el-tooltip>
    </el-button-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import {
  CopyDocument,
  Suitcase,
  ScaleToOriginal,
  FullScreen,
  House,
  Connection,
} from '@element-plus/icons-vue'

const disabled = ref(false)

const baseMap = [
  {
    name: '天地图矢量',
  },
  {
    name: '天地图影像',
  },
  {
    name: '天地图地形',
  },
  {
    name: '谷歌矢量',
  },
  {
    name: '谷歌影像',
  },
  {
    name: '谷歌地形',
  },
  {
    name: 'OSM地图',
  },
  {
    name: 'ArcGIS矢量',
  },
  {
    name: 'ArcGIS影像',
  },
  {
    name: '腾讯矢量',
  },
  {
    name: '腾讯影像',
  },
  {
    name: '百度矢量',
  },
  {
    name: '百度影像',
  },
  {
    name: '高德矢量',
  },
  {
    name: '高德影像',
  },
]
const value = ref('')
const unitOptions = [
  {
    value: 'Option1',
    label: '米',
  },
  {
    value: 'Option2',
    label: '千米',
  },
  {
    value: 'Option3',
    label: '海里',
  },
  {
    value: 'Option4',
    label: '丈',
  },
]

function selectChange() {}

function reset() {
  disabled = !disabled
  let view = map.getView()
  view.setZoom(zoom)
  view.setRotation(rotation)
  view.setCenter(center)
}
</script>

<style scoped>
.MapTool {
  position: absolute;
  right: 20px;
  top: 80px;
  opacity: 80%;
  z-index: 99;
}

.button {
  width: 120px;
  height: 26px;
}
.el-card__header {
  padding: 0px 0px;

  border: none;
}
.el-col {
  margin-bottom: 10px;
}
.el-col:last-child {
  margin-bottom: 0;
}

.basemapimage {
  vertical-align: top;
  height: 120px;
  width: 120px;
}

.measureicon {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin: auto;
  margin-top: 10px;
  text-align: center;
  vertical-align: top;
}

.measureimage {
  position: absolute;
  width: 60px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.measurebutton {
  width: 100%;
  height: 26px;
  margin-top: 5px;
}

.measureresult {
  padding: 5px;
}
</style>
