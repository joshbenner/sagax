import { HTTP } from './http-client'

function getter (path) {
  return function (cb) {
    return HTTP.get(path).then(r => cb(r.data))
  }
}

function postSilenced (silenced) {
  return HTTP.post('/silenced', silenced)
}

function clearSilenced (silenceIds) {
  return HTTP.post('/clear', {ids: silenceIds})
}

export default {
  getConfig: getter('config'),
  getRefresh: getter('refresh'),
  getEvents: getter('events'),
  getClients: getter('clients'),
  getSilenced: getter('silenced'),
  postSilenced: postSilenced,
  clearSilenced: clearSilenced,
  allResults: getter('results')
}
