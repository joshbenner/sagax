import api from '../services/api'
import { loader } from './utils'
import keys from 'lodash/keys'
import get from 'lodash/get'

function collatedResults (results) {
  return results.reduce((o, r) => {
    if (r.client in o) {
      o[r.client].push(r)
    } else {
      o[r.client] = [r]
    }
    return o
  }, {})
}

const state = {
  results: [],
  clientToRefresh: null
}

const mutations = {
  setResults (state, allResults) {
    state.results = allResults
  },
  setResultClientToRefresh (state, clientName) {
    state.clientToRefresh = clientName
  },
  clearResults (state) {
    state.results = {}
    state.clientToRefresh = null
  },
  deleteResult (state, { clientName, checkName }) {
    state.results = state.results.filter((r) => {
      return r.client !== clientName || r.check.name !== checkName
    })
  }
}

const actions = {
  getAllResults: loader(api.allResults, 'setAllResults'),
  getClientResults ({ commit }, clientName) {
    commit('startLoading')
    api.clientResults(clientName).then(
      (r) => {
        commit('setResults', r.data)
        commit('doneLoading')
      }
    )
  },
  deleteResult ({ commit }, { clientName, checkName }) {
    api.deleteResult(clientName, checkName)
      .then(() => commit('deleteResult', {clientName, checkName}))
  }
}

const getters = {
  allResults: (state) => keys(state.results).reduce((all, k) => all + state.results[k], []),
  getResult: (state) => (clientName, checkName) => {
    for (let result of state.results) {
      if (result.client === clientName && result.check.name === checkName) {
        return result
      }
    }
  },
  resultsByClient: (state) => collatedResults(state.results),
  clientResults: (state, getters) => (clientName) => get(getters.resultsByClient, clientName, []),
  resultClientToRefresh: (state) => state.clientToRefresh
}

export default {
  state,
  mutations,
  actions,
  getters
}
