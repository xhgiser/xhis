<!-- 档案申请管理 -->
<template>
  <div class="loading">
    <el-image :src="require('@/assets/images/loading-new.gif')" />
    <span>即将上线 . . .</span>
  </div>
</template>

<script setup></script>

<style scoped>
.loading {
  width: 100%;
  height: 100%;
  text-align: center;
}

:deep(.el-image) {
  height: 800px;
}

.loading span {
  display: block;
  color: rgb(255, 255, 255);
  font-size: 50px;
}
</style>
