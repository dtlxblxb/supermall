import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const state = {
  cartList: []
}

const store = new Vuex.Store({
  /*
  state: {
    cartList: []
  },
  */
  state,
  /*
  mutations: {
    addCart (state, payload) {
      let oldProduct = null
      for (const item of state.cartList) {
        if (item.iid === payload.iid) {
          oldProduct = item
        }
      }
      if (oldProduct) {
        oldProduct.count += 1
      } else {
        payload.count = 1
        state.cartList.push(payload)
      }
      const oldProduct = state.cartList.find(item => item.iid === payload.iid)
      if (oldProduct) {
        oldProduct.count += 1
      } else {
        payload.count = 1
        state.cartList.push(payload)
      }
    }
    addCounter (state, payload) {
      payload.count++
    },
    addToCart (state, payload) {
      state.cartList.push(payload)
    }
  },
  */
  mutations,
  /*
  actions: {
    addCart (context, payload) {
      const oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      if (oldProduct) {
        context.commit('addCounter', oldProduct)
      } else {
        payload.count = 1
        context.commit('addToCart', payload)
      }
    }
  }
  */
  actions,
  getters
})

export default store
