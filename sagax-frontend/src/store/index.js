import Vue from 'vue'
import Vuex from 'vuex'

import moment from 'moment'
import get from 'lodash/get'
import keys from 'lodash/keys'
import bus from '../services/bus'
import api from '../services/api'
import auth from '../services/auth'
import router from '../router'

import { maybeLogoutOnLoadFail } from './utils'
import config from './config'
import events from './events'
import clients from './clients'
import silenced from './silenced'
import results from './results'
import checks from './checks'
import aggregates from './aggregates'

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
    silenced,
    results,
    checks,
    aggregates
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
      commit('clearResults')
      commit('clearChecks')
      commit('clearAggregates')
    },
    refreshAll ({ dispatch, commit, getters }) {
      bus.$emit('refreshing-all')
      commit('startLoading')
      api.getRefresh(getters.resultClientToRefresh, getters.getDetailedAggregates, getters.fullAggregateName)
        .then(({ data }) => {
          commit('setEvents', data.events)
          commit('setClients', data.clients)
          commit('setSilenced', data.silenced)
          commit('setChecks', data.checks)
          commit('setAggregates', data.aggregates)
          if (keys(data).includes('results')) {
            commit('setResults', data.results)
          }
          if (keys(data).includes('full_aggregate')) {
            commit('setFullAggregate', data.full_aggregate)
          }
          commit('doneLoading', [
            'setEvents',
            'setClients',
            'setSilenced',
            'setChecks',
            'setAggregates'])
          bus.$emit('refreshed-all')
        })
        .catch((e) => maybeLogoutOnLoadFail(e, commit, dispatch))
    }
  },
  getters: {
    lastRefresh: (state) => state.lastRefresh,
    username: (state) => state.user.username
  }
})
