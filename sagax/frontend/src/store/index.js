import Vue from 'vue'
import Vuex from 'vuex'

import config from './config'
import events from './events'
import clients from './clients'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: 0
  },
  modules: {
    config,
    events,
    clients
  },
  mutations: {
    startLoading (state) {
      state.loading += 1
    },
    doneLoading (state) {
      state.loading -= 1
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
