import api from '../services/api'
import { loader } from './utils'

const state = {
  aggregates: [],
  detailedAggregates: false
}

const mutations = {
  setAggregates (state, newAggregates) {
    state.aggregates = newAggregates
  },
  clearAggregates (state) {
    state.aggregates = []
  },
  getDetailedAggregates (state, detailed) {
    state.detailedAggregates = detailed
  }
}

const actions = {
  getAggregates: loader(() => api.getAggregates(true), 'setAggregates')
}

const getters = {
  allAggregates: (state) => Array.from(state.aggregates),
  getAggregate: (state) => (aggregateName) => {
    let matches = state.aggregates.filter((a) => a.name === aggregateName)
    return matches.length ? matches[0] : null
  },
  aggregateCount: (state) => state.aggregates.length,
  getDetailedAggregates: (state) => state.detailedAggregates
}

export default {
  state,
  mutations,
  actions,
  getters
}
