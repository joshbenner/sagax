import decode from 'jwt-decode'

import { HTTP } from './http-client'

function setAuthToken (token) {
  localStorage.setItem('auth_token', token)
  HTTP.defaults.headers.Authorization = `Bearer ${token}`
}

function getAuthToken () {
  return localStorage.getItem('auth_token')
}

function delAuthToken () {
  localStorage.removeItem('auth_token')
  HTTP.defaults.headers.Authorization = ''
}

let jwt = getAuthToken()
if (jwt) {
  setAuthToken(jwt)
}

export default {
  authenticate (username, password) {
    return HTTP.post('/auth', {username: username, password: password})
      .then(
        (r) => {
          if (r.status === 200) {
            setAuthToken(r.data)
            return decode(r.data)
          }
        },
        (e) => Promise.reject(e)
      )
  },
  isAuthenticated () {
    return !!getAuthToken()
  },
  getAuthToken: getAuthToken,
  getDecodedAuthToken () {
    return decode(this.getAuthToken())
  },
  logout () {
    delAuthToken()
  }
}
