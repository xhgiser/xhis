<!--  -->
<template>
  <div id="popup">
    <div id="rectangle">
      <h3 class="table-title">{{ tableFeatureName }}</h3>
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
defineProps({
  propertyTableData: {
    type: Array,
  },
  tableFeatureName: {
    type: String,
  },
})
</script>

<style scoped>
#popup {
  position: relative;
  transform: translate(-40px, 10px);
  width: 350px;
  height: auto;
}

#rectangle {
  position: relative;
  width: 350px;
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
  padding-left: 10px;
  color: #5e616d;
}
</style>
