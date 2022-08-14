import { createApp } from 'vue'
import 'normalize.css/normalize.css'
import App from './App.vue'
import './common/base.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/styles/index.scss' // global css

import store from './store'
import router from './router'
import '@/permission' // permission control

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(store).mount('#app')
