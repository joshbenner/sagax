import api from '../services/api'
import { loader } from './utils'
import zipObject from 'lodash/zipObject'

const state = {
  events: []
}

const mutations = {
  setEvents (state, newEvents) {
    state.events = newEvents
  },
  clearEvents (state) {
    state.events = []
  },
  resolveEvent (state, { clientName, checkName }) {
    let f = (e) => e.client.name !== clientName || e.check.name !== checkName
    state.events = state.events.filter(f)
  }
}

const actions = {
  getEvents: loader(api.getEvents, 'setEvents')
}

const getters = {
  allEvents: (state) => state.events,
  getEvent: (state) => (clientName, checkName) => {
    for (let event of state.events) {
      if (event.client.name === clientName && event.check.name === checkName) {
        return event
      }
    }
    return null
  },
  eventsForClient: (state) => (clientName) => {
    return state.events.filter((e) => e.client.name === clientName)
  },
  maxStatusByClient: (state, getters) => {
    let clientNames = getters.allClients.map((c) => c.name)
    let maxStatus = zipObject(clientNames, clientNames.map(() => 0))

    for (let event of state.events) {
      let name = event.client.name
      let status = event.check.status
      // Squash unknown values to -1.
      if (!(status in [0, 1, 2])) {
        status = -1
        if (maxStatus[name] === 0) {
          maxStatus[name] = status
        }
      }
      if (maxStatus[name] < status) {
        maxStatus[name] = status
      }
    }

    return maxStatus
  },
  maxStatusOfClient: (state, getters) => (clientName) => {
    return getters.maxStatusByClient[clientName]
  },
  eventsWithStatus: (state) => (status) => {
    return state.events.filter((e) => e.check.status === status)
  },
  warningEvents: (state, getters) => getters.eventsWithStatus(1),
  criticalEvents: (state, getters) => getters.eventsWithStatus(2),
  warningEventsCount: (state, getters) => getters.warningEvents.length,
  criticalEventsCount: (state, getters) => getters.criticalEvents.length
}

export default {
  state,
  mutations,
  actions,
  getters
}
