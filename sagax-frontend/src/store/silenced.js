import api from '../services/api'
import { loader } from './utils'
import { silencedAppliesToCheck } from '../services/silence'

const state = {
  silenced: []
}

const mutations = {
  setSilenced (state, newSilenced) {
    state.silenced = newSilenced
  },
  clearSilenced (state) {
    state.silenced = []
  }
}

const actions = {
  getSilenced: loader(api.getSilenced, 'setSilenced')
}

const getters = {
  allSilenced: (state) => state.silenced,
  silencedCount: (state) => state.silenced.length,
  silencesForCheck: (state, getters) => (clientName, checkName) => {
    let client = getters.getClient(clientName)
    return getters.allSilenced.filter((s) => silencedAppliesToCheck(s, client, checkName))
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
