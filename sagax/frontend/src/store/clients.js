import api from '../services/api'
import { loader } from './utils'
import { clientSilencedBy } from '../services/silence'
import find from 'lodash/find'

const state = {
  clients: []
}

const mutations = {
  setClients (state, newClients) {
    state.clients = newClients
  },
  deleteClient (state, clientName) {
    state.clients = state.clients.filter((c) => c.name !== clientName)
  },
  clearClients (state) {
    state.clients = []
  }
}

const actions = {
  getClients: loader(api.getClients, 'setClients'),
  deleteClient ({ commit }, clientName) {
    api.deleteClient(clientName).then(() => commit('deleteClient', clientName))
  }
}

const getters = {
  allClients: (state) => state.clients,
  getClient: (state) => (name) => find(state.clients, (c) => c.name === name),
  clientsWithMaxStatus: (state, getters) => (status) => {
    let clientNames = getters.maxStatusByClient
    return state.clients.filter((c) => clientNames[c.name] === status)
  },
  okClients: (state, getters) => getters.clientsWithMaxStatus(0),
  warningClients: (state, getters) => getters.clientsWithMaxStatus(1),
  criticalClients: (state, getters) => getters.clientsWithMaxStatus(2),
  silencedClients: (state, getters) => {
    let silenced = new Set()
    getters.allSilenced.forEach((s) => {
      getters.clientsSilencedBy(s).forEach((c) => silenced.add(c))
    })
    return Array.from(silenced)
  },
  clientIsSilenced: (state, getters) => (clientName) => {
    return getters.silencedClients.map((c) => c.name).includes(clientName)
  },
  okClientCount: (state, getters) => getters.okClients.length,
  warningClientCount: (state, getters) => getters.warningClients.length,
  criticalClientCount: (state, getters) => getters.criticalClients.length,
  silencedClientCount: (state, getters) => getters.silencedClients.length,
  allSubscriptions: (state) => {
    let reducer = (subs, client) => subs.concat(client.subscriptions)
    return Array.from(new Set(state.clients.reduce(reducer, [])))
  },
  allSubsInfo: (state, getters) => {
    return getters.allSubscriptions.map((sub) => {
      let [name, type] = sub.split(':', 2).reverse().concat('group')
      return {id: sub, type, name}
    })
  },
  clientsSilencedBy: (state) => (silenced) => state.clients.filter((c) => {
    return clientSilencedBy(c, silenced)
  })
}

export default {
  state,
  mutations,
  actions,
  getters
}
