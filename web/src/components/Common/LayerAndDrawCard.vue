<!--  -->
<template>
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
</template>

<script setup>
import { ref, defineEmits } from 'vue'

import { Search, CopyDocument, EditPen } from '@element-plus/icons-vue'

const props = defineProps({
  map: {
    type: Object,
  },
  defaultProps: {
    type: Object,
  },
  layersData: {
    type: Array,
  },
})

const emits = defineEmits(['layerTreeClick'])

//图层与标绘两个按钮按下样式切换
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

//图层控制
function layerTreeClick(data, check) {
  emits('layerTreeClick')
}
</script>

<style scoped>
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
