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

function getRefresh (resultsClientName) {
  let path = 'refresh'
  if (resultsClientName) {
    path += `?results_client=${resultsClientName}`
  }
  return HTTP.get(path)
}

export default {
  getConfig: getter('config'),
  getRefresh: getRefresh,
  getEvents: getter('events'),
  getClients: getter('clients'),
  getSilenced: getter('silenced'),
  postSilenced: postSilenced,
  clearSilenced: clearSilenced,
  allResults: getter('results'),
  clientResults: (clientName) => HTTP.get(`/results/${clientName}`),
  deleteClient: (clientName) => HTTP.delete(`/clients/${clientName}`),
  deleteResult: (clientName, checkName) => HTTP.delete(`/results/${clientName}/${checkName}`)
}
