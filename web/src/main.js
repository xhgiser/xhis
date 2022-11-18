import { createApp } from 'vue'
import App from './App.vue'
import './common/base.css'
import './common/el-container.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/index'

import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(VueVideoPlayer).mount('#app')
