// import './assets/main.css'
import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'vfonts/Lato.css' // 👈 Tambahkan ini
import { createNaiveUI } from './naive' // 👈 Buat helper untuk naive ui

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(createNaiveUI())

app.mount('#app')
