<!-- 底图切换工具 -->
<template>
  <div class="basemap-toggle">
    <el-popover placement="left" :width="510" trigger="click">
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
          <el-col :span="4" @click="basemapToggle(1)"
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
          <el-col :span="4" @click="basemapToggle(2)"
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
          <el-col :span="4" @click="basemapToggle(3)"
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
          <el-col :span="4" @click="basemapToggle(4)"
            ><div class="grid-content ep-bg-purple" />
            <el-image
              style="
                width: 80px;
                height: 80px;
                border-radius: 2px;
                cursor: pointer;
              "
              :src="require(`@/assets/images/MapLogo/星图矢量.jpg`)"
              fit="cover"
            />
            <h6 style="cursor: pointer">星图矢量</h6>
          </el-col>
          <el-col :span="4" @click="basemapToggle(5)"
            ><div class="grid-content ep-bg-purple" />
            <el-image
              style="
                width: 80px;
                height: 80px;
                border-radius: 2px;
                cursor: pointer;
              "
              :src="require(`@/assets/images/MapLogo/星图影像.jpg`)"
              fit="cover"
            />
            <h6 style="cursor: pointer">星图影像</h6>
          </el-col>
          <el-col :span="4" @click="basemapToggle(6)"
            ><div class="grid-content ep-bg-purple" />
            <el-image
              style="
                width: 80px;
                height: 80px;
                border-radius: 2px;
                cursor: pointer;
              "
              :src="require(`@/assets/images/MapLogo/星图地形.jpg`)"
              fit="cover"
            />
            <h6 style="cursor: pointer">星图地形</h6>
          </el-col>
        </el-row>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
const emit = defineEmits(['basemapToggle'])

defineProps({
  basemapImage: {
    type: String,
  },
})

function basemapToggle(index) {
  emit('basemapToggle', index)
}
</script>

<style scoped>
/*底图切换工具*/
.basemap-toggle {
  position: fixed;
  text-align: center;
  right: 9px;
  bottom: 35px;
  opacity: 0.9;
  z-index: 9;
  cursor: pointer;
}

:deep(.basemap-toggle .el-card) {
  width: 80px;
  height: 80px;
  cursor: pointer;
  --el-card-border-radius: 4px;
  --el-card-padding: 0px;
}

.basemap-toggle :deep(.el-card .el-card__body) {
  padding: 0px;
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

.basemap-toggle-row :deep(.el-row) {
  height: 80px;
  padding-left: 1px;
}
.basemap-toggle-row :deep(.is-guttered) {
  height: 80px;
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
