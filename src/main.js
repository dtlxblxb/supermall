import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue() // vue实例可以向事件总线发射事件和监听事件

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
