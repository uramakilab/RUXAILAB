import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

Vue.config.productionTip = false

const options = {
  newestOnTop: true,
  position: 'top-right',
  draggable: true,
  pauseOnHover: true,
  closeOnClick: true,
  timeout: 4000,
}
Vue.use(Toast, options)

new Vue({
  router,
  store,
  vuetify,
  i18n,

  render: (h) => h(App),
}).$mount('#app')
