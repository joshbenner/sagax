import api from '../services/api'
import { loader } from './utils'

const state = {
  clients: []
}

const mutations = {
  setClients (state, newClients) {
    state.clients = newClients
  }
}

const actions = {
  getClients: loader(api.getClients, 'setClients')
}

const getters = {
  allClients: (state) => state.clients,
  clientsWithMaxStatus: (state, getters) => (status) => {
    let clientNames = getters.maxStatusByClient
    return state.clients.filter((c) => clientNames[c.name] === status)
  },
  okClients: (state, getters) => getters.clientsWithMaxStatus(0),
  warningClients: (state, getters) => getters.clientsWithMaxStatus(1),
  criticalClients: (state, getters) => getters.clientsWithMaxStatus(2),
  silencedClients: (state) => state.clients.filter((c) => c.silenced),
  okClientCount: (state, getters) => getters.okClients.length,
  warningClientCount: (state, getters) => getters.warningClients.length,
  criticalClientCount: (state, getters) => getters.criticalClients.length,
  silencedClientCount: (state, getters) => getters.silencedClients.length
}

export default {
  state,
  mutations,
  actions,
  getters
}
