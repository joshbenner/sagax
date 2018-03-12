import Vue from 'vue'
import Vuex from 'vuex'

import moment from 'moment'
import api from '../services/api'

import config from './config'
import events from './events'
import clients from './clients'
import silenced from './silenced'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    loading: 0,
    lastRefresh: {}
  },
  modules: {
    config,
    events,
    clients,
    silenced
  },
  mutations: {
    startLoading (state) {
      state.loading += 1
    },
    doneLoading (state, datasets) {
      state.loading -= 1
      let now = moment().unix()
      for (let ds of datasets) {
        state.lastRefresh[ds] = now
      }
    }
  },
  actions: {
    refreshAll ({ dispatch, commit }) {
      commit('startLoading')
      return new Promise((resolve) => {
        api.getRefresh(data => {
          commit('setEvents', data['events'])
          commit('setClients', data['clients'])
          commit('setSilenced', data['silenced'])
          resolve()
        })
      }).then(() => commit('doneLoading', ['setEvents', 'setClients']))
    }
  },
  getters: {
    lastRefresh: (state) => state.lastRefresh
  }
})
