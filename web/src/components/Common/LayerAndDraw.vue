<!-- 图层控制和标绘工具 -->
<template>
  <div class="left-card">
    <div class="toggle-button">
      <el-card shadow="always">
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
    <el-card shadow="always" id="layer-card">
      <div class="layer-search">
        <el-input
          v-model="filterText"
          placeholder="过滤图层关键字"
          class="input-with-select"
          clearable
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>
      <el-scrollbar max-height="545px">
        <el-tree
          ref="treeRef"
          :data="layersData"
          class="filter-tree"
          show-checkbox
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="[defaultCheckedKeys]"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @check-change="layerTreeClick"
        />
      </el-scrollbar>
    </el-card>
    <el-card shadow="always" id="draw-card">
      <el-radio-group v-model="drawRadio" size="large" @change="drawFeatures">
        <el-radio-button label="点标绘" />
        <el-radio-button label="线标绘" />
        <el-radio-button label="面标绘" />
      </el-radio-group>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { watch } from '@vue/runtime-core'
import { Search, CopyDocument, EditPen } from '@element-plus/icons-vue'

const props = defineProps({
  selecttc: {
    type: String,
  },
  selectbh: {
    type: String,
  },
  layersData: {
    type: Array,
  },
  defaultExpandedKeys: {
    type: String,
  },
  defaultCheckedKeys: {
    type: String,
  },
})

const emit = defineEmits([
  'clicktc',
  'clickbh',
  'filterNode',
  'layerTreeClick',
  'drawFeatures',
])

const filterText = ref('')
const treeRef = ref(null)
const defaultProps = {
  children: 'children',
  label: 'label',
}
watch(filterText, (val) => {
  treeRef.value.filter(val)
})

function filterNode(value, data) {
  if (!value) return true
  return data.label.includes(value)
}

function clicktc() {
  emit('clicktc')
}
function clickbh() {
  emit('clickbh')
}

function layerTreeClick(data, check) {
  emit('layerTreeClick', data, check)
}

const drawRadio = ref('')
function drawFeatures(value) {
  emit('drawFeatures', value)
}
document.onkeydown = function (e) {
  if (e.code == 'Escape') {
    drawRadio.value = ''
  }
}
</script>

<style scoped>
/*图层控制与标绘组件*/
.left-card {
  position: absolute;
  transform: translate(8px, 8px);
  opacity: 0.95;
  width: 300px;
  z-index: 9;
}

.toggle-button :deep(.el-card__body) {
  padding: 0px;
  text-align: center;
}
.toggle-button :deep(el-button) {
  display: inline-block;
  margin-left: 0px;
}
/* 图层标绘两个按钮大小 */
.toggle-button-select {
  display: inline-block;
  margin-left: 0px;
  margin-right: 0px;
  font-size: 20px;
  padding: 0px;
  width: 149px;
}
:deep(.el-button + .el-button) {
  margin-left: 0px !important;
}

:deep(.el-tree-node__expand-icon) {
  font-size: inherit;
}

/* 选中文字颜色 */
:deep(.toggle-button-select.el-button--info.is-text.is-has-bg) {
  color: #46a0fe;
  /* font-weight: bolder; */
}

/* 图层卡片 */
#layer-card {
  max-height: 600px;
  padding-bottom: 10px;
}

.layer-search {
  margin-bottom: 8px;
}

/* 标绘卡片 */
#draw-card {
  display: none;
  text-align: center;
}
</style>
