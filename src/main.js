import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import toast from 'components/common/toast'

import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'

Vue.use(toast)
Vue.use(VueLazyload, {
  loading: require('./assets/img/common/placeholder.png')
})

// 解决移动端300ms延迟
FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue() // vue实例可以向事件总线发射事件和监听事件

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
