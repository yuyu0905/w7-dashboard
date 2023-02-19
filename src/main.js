import { createApp } from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import App from './App.vue'
import router from './router'

import { date } from './methods/dateFormat'

const app = createApp(App)
app.config.globalProperties.$dateFormat = { date }

app.use(router)
app.use(VueAxios, axios)
app.component('VueLoading', Loading)
app.mount('#app')
