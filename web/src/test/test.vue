<!--  -->
<template>
  <div>
    <el-button @click="show">点击</el-button>
    <el-dialog v-model="videoDialogVisible" width="680px" heigth="400px">
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const videoDialogVisible = ref(false)
function show() {
  videoDialogVisible = true
}
</script>

<style lang="less" scoped></style>
