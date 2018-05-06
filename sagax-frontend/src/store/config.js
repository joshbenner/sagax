import get from 'lodash/get'
import api from '../services/api'
import { loader } from './utils'

const state = {
  config: {}
}

const mutations = {
  setConfig (state, newConfig) {
    state.config = newConfig
  }
}

const actions = {
  loadConfig: loader(api.getConfig, 'setConfig')
}

const getters = {
  getConfig: (state) => (key, defaultVal = null) => {
    return get(state.config, key, defaultVal)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
