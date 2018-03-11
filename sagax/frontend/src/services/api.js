import { HTTP } from './http-client'

function getter (path) {
  return function (cb) {
    HTTP.get(path)
      .then(r => cb(r.data))
      .catch(e => console.log('Failed getting path: ', e))
  }
}

export default {
  getConfig: getter('config'),
  getRefresh: getter('refresh'),
  getEvents: getter('events'),
  getClients: getter('clients'),
  getSilenced: getter('silenced')
}
