import api from '../services/api'
import { loader } from './utils'
import zipObject from 'lodash/zipObject'

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

const getters = {
  allEvents: (state) => state.events,
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
