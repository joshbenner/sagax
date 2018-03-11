import api from '../services/api'
import { loader } from './utils'

const state = {
  silenced: []
}

const mutations = {
  setSilenced (state, newSilenced) {
    state.silenced = newSilenced
  }
}

const actions = {
  getSilenced: loader(api.getSilenced, 'setSilenced')
}

const getters = {
  allSilenced: (state) => state.silenced
}

export default {
  state,
  mutations,
  actions,
  getters
}
