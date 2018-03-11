import Vue from 'vue'
import Vuex from 'vuex'

import api from '../services/api'

import config from './config'
import events from './events'
import clients from './clients'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
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
  actions: {
    refreshAll ({ dispatch, commit }) {
      commit('startLoading')
      return new Promise((resolve) => {
        api.getRefresh(data => {
          commit('setEvents', data['events'])
          commit('setClients', data['clients'])
          resolve()
        })
      }).then(() => commit('doneLoading'))
    }
  }
})
