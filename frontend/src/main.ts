// import './assets/main.css';
import './assets/tailwind.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import 'vfonts/Lato.css'; // 👈 Tambahkan ini
import { createNaiveUI } from './naive'; // 👈 Buat helper untuk naive ui

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(createNaiveUI());

// Initialize auth store
import { useAuthStore } from './stores/auth';
import { useThemeStore } from './stores/theme';

const authStore = useAuthStore();
const themeStore = useThemeStore();

// Initialize auth and theme from localStorage
authStore.initializeAuth();
themeStore.initializeTheme();

app.mount('#app');
