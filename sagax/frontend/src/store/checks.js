import api from '../services/api'
import { loader } from './utils'

const state = {
  checks: []
}

const mutations = {
  setChecks (state, newChecks) {
    state.checks = newChecks
  }
}

const actions = {
  getChecks: loader(api.getChecks, 'setChecks'),
  clearChecks (state) {
    state.checks = []
  }
}

const getters = {
  allChecks: (state) => Array.from(state.checks),
  checkCount: (state, getters) => getters.allChecks.length
}

export default {
  state,
  mutations,
  actions,
  getters
}
