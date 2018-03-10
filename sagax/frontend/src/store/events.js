import api from '../services/api'
import { loader } from './utils'

const state = {
  events: []
}

const mutations = {
  setEvents (state, newEvents) {
    state.events = newEvents
  }
}

const actions = {
  getEvents: loader(api.getEvents, 'setEvents')
}

export default {
  state,
  mutations,
  actions
}
