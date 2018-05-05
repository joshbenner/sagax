import { HTTP } from './http-client'

function getter (path) {
  return () => HTTP.get(path)
}

function postSilenced (silenced) {
  return HTTP.post('/silenced', silenced)
}

function clearSilenced (silenceIds) {
  return HTTP.post('/clear', {ids: silenceIds})
}

function getRefresh (resultsClientName, detailedAggregates, fullAggregateName) {
  let path = 'refresh'
  let query = []

  if (resultsClientName) {
    query.push(`results_client=${resultsClientName}`)
  }
  if (detailedAggregates) {
    query.push('detailed_aggregates=1')
  }
  if (fullAggregateName !== null) {
    query.push(`full_aggregate=${fullAggregateName}`)
  }
  if (query) {
    path += '?' + query.join('&')
  }
  return HTTP.get(path)
}

export default {
  getConfig: getter('config'),
  getRefresh: getRefresh,
  getEvents: getter('events'),
  getClients: getter('clients'),
  getSilenced: getter('silenced'),
  getChecks: getter('checks'),
  postSilenced: postSilenced,
  clearSilenced: clearSilenced,
  allResults: getter('results'),
  clientResults: (clientName) => HTTP.get(`/results/${clientName}`),
  deleteClient: (clientName) => HTTP.delete(`/clients/${clientName}`),
  deleteResult: (clientName, checkName) => HTTP.delete(`/results/${clientName}/${checkName}`),
  resolveEvent: (clientName, checkName) => HTTP.post('/resolve', {
    client: clientName,
    check: checkName
  }),
  requestCheck: (checkName, subscribers, reason) => HTTP.post('/request', {
    check: checkName,
    subscribers: subscribers || [],
    reason: reason || ''
  }),
  getAggregates: (detail) => HTTP.get(`/aggregates?detail=${detail ? 1 : 0}`)
}
