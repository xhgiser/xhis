<!--  -->
<template>
  <div>
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-aside"
      :default-active="activeIndex"
      text-color="#fff"
      @select="handleSelect"
    >
      <template v-for="(item, index) in itemList">
        <template v-if="item.children">
          <el-sub-menu :index="item.title" :key="index">
            <template #title>
              <el-icon><Grid /></el-icon>
              <span>{{ item.title }}</span>
            </template>

            <el-menu-item
              class="aside-menu-item"
              v-for="(item2, index) in item.children"
              :index="item2.path"
              :key="index"
              >{{ item2.title }}
            </el-menu-item>
          </el-sub-menu>
        </template>
        <!-- 二级菜单 -->
        <template v-else>
          <el-menu-item class="aside-menu-item" :index="item.path" :key="index"
            >{{ item.title }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Grid } from '@element-plus/icons-vue'

const router = useRouter()

defineProps({
  itemList: {
    type: Array,
    default: () => [],
  },
})

const indexPath = router.currentRoute.value.fullPath.split('/')[2]

const activeIndex = computed(() => {
  return indexPath
  //return router.currentRoute.value.path
})

// watch(
//   () => router.currentRoute.value.path,
//   (toPath) => {
//     //要执行的方法
//     let indexPath = router.currentRoute.value.path.split('/')[2]
//     console.log(indexPath)
//     const activeIndex = computed(() => {
//       return indexPath
//     })

//     console.log(activeIndex)
//   },
//   { immediate: true, deep: true }
// )

function handleSelect(path) {
  router.push({
    path,
  })
}
</script>

<style lang="less" scoped>
@import url(@/common/el-container.css);
</style>
