import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)


app.config.errorHandler = (err, info) => {
  console.error('Vue error:', err, info)
}

app.mount('#app') 