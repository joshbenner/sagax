import { HTTP } from './http-client'

function authenticated () {
  return !!localStorage.getItem('auth_token')
}

function getter (path) {
  return function (cb) {
    HTTP.get(path)
      .then(r => cb(r.data))
      .catch(e => console.log(`Failed getting ${path}: `, e))
  }
}

function postSilenced (silenced) {
  return HTTP.post('/silenced', silenced)
    .catch(e => console.log('Failed creating silenced: ', e))
}

export default {
  authenticate (username, password) {
    return HTTP.post('/auth', {username: username, password: password})
      .then((r) => {
        if (r.status === 200) {
          localStorage.setItem('auth_token', r.data)
          HTTP.defaults.headers.Authorization = 'Bearer ' + r.data
        }
      })
      .catch(e => console.log('Failed authenticating: ', e))
  },
  authenticated: authenticated,
  getConfig: getter('config'),
  getRefresh: getter('refresh'),
  getEvents: getter('events'),
  getClients: getter('clients'),
  getSilenced: getter('silenced'),
  postSilenced: postSilenced,
  allResults: getter('results')
}
