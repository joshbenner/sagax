import Vue from 'vue'
import Vuex from 'vuex'

import moment from 'moment'
import get from 'lodash/get'
import bus from '../services/bus'
import api from '../services/api'
import auth from '../services/auth'
import router from '../router'

import { maybeLogoutOnLoadFail } from './utils'
import config from './config'
import events from './events'
import clients from './clients'
import silenced from './silenced'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    loading: 0,
    lastRefresh: {},
    user: {
      username: null,
      email: null
    }
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
      if (datasets) {
        for (let ds of datasets) {
          state.lastRefresh[ds] = now
        }
      }
    },
    loggedIn (state, { username, email }) {
      state.user.username = username
      state.user.email = email
    },
    loggedOut (state) {
      state.user.username = null
      state.user.email = null
    }
  },
  actions: {
    login ({ commit }, { username, password }) {
      return auth.authenticate(username, password)
        .then(
          (token) => {
            commit('loggedIn', {
              username: get(token, 'username', ''),
              email: get(token, 'email', '')
            })
            router.replace('/')
            return Promise.resolve(true)
          },
          () => Promise.resolve(false)
        )
    },
    logout ({ commit }) {
      auth.logout()
      commit('loggedOut')
      router.replace('/login')
      commit('clearEvents')
      commit('clearClients')
      commit('clearSilenced')
    },
    refreshAll ({ dispatch, commit }) {
      bus.$emit('refreshing-all')
      commit('startLoading')
      api.getRefresh(data => {
        commit('setEvents', data['events'])
        commit('setClients', data['clients'])
        commit('setSilenced', data['silenced'])
      })
        .then(() => {
          commit('doneLoading', ['setEvents', 'setClients', 'setSilenced'])
          bus.$emit('refreshed-all')
        })
        .catch((e) => maybeLogoutOnLoadFail(e, commit, dispatch))
    }
  },
  getters: {
    lastRefresh: (state) => state.lastRefresh
  }
})
