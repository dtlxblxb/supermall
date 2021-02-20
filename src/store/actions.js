import { ADD_COUNTER, ADD_TO_CART } from './mutations-types'

export default {
  addCart (context, payload) {
    return new Promise((resolve, reject) => {
      const oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      if (oldProduct) {
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前商品数量加一')
      } else {
        payload.count = 1
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')
      }
    })
  }
}
