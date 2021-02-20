import Toast from './Toast'

const obj = {}

obj.install = function (Vue) { // Vue.use(toast)就会执行install函数
  // document.body.appendChild(Toast.$el)

  const ToastContrustor = Vue.extend(Toast)
  const toast = new ToastContrustor()
  toast.$mount(document.createElement('div'))
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast
}
export default obj
