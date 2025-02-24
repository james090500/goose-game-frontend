import { createApp } from 'vue'

import App from './App.vue'
const app = createApp(App)

// Install the store instance as a plugin
import store from './store'
app.use(store)

// Mount the app
app.mount('#app')
