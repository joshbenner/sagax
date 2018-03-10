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

export default {
  state,
  mutations,
  actions
}
