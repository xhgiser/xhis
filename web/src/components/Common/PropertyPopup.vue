<!--  -->
<template>
  <div id="popup">
    <div id="rectangle">
      <div style="display: flex; align-items: center; margin: 10px, auto">
        <h3 class="table-title" style="width: 300px">{{ tableFeatureName }}</h3>
        <el-button
          type="primary"
          :icon="Close"
          style="margin-left: 60px"
          @click="closePopup"
          text
        />
      </div>
      <hr style="color: grey; opacity: 0.6" />
      <el-table
        :data="propertyTableData"
        stripe
        style="width: 100%"
        table-layout="auto"
        height="250"
      >
        <el-table-column prop="key" label="属性" width="180" />
        <el-table-column prop="value" label="值" />
      </el-table>
    </div>
    <div id="triangle"></div>
  </div>
</template>

<script setup>
import { Close } from '@element-plus/icons-vue'
defineProps({
  propertyTableData: {
    type: Array,
  },
  tableFeatureName: {
    type: String,
  },
})

const emit = defineEmits(['closePopup'])

function closePopup() {
  emit('closePopup')
}
</script>

<style scoped>
#popup {
  position: relative;
  transform: translate(-40px, 10px);
  width: 380px;
  height: auto;
}

#rectangle {
  position: relative;
  width: 380px;
  height: auto;
  min-height: 30px;
  max-height: 600px;
  border: 1px solid #dedcdc;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: white;
}

#triangle {
  top: -20px;
  left: 30px;
  position: absolute;
  border-width: 10px;
  border-style: solid;
  width: 0px;
  height: 0px;
  border-color: transparent;
  border-bottom-color: #e0dede;
}
#triangle::after {
  content: '  ';
  top: -9px;
  left: -10px;
  position: absolute;
  border-width: 10px;
  border-style: solid;
  width: 0px;
  height: 0px;
  border-color: transparent;
  border-bottom-color: white;
}
.table-title {
  font-family: 'Arial', 'Microsoft YaHei';
  font-size: 20px;
  padding-left: 10px;
  color: #5e616d;
}
</style>
