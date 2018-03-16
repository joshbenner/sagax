import moment from 'moment'

export function maybeLogoutOnLoadFail (e, commit, dispatch) {
  commit('doneLoading')
  if (e.response.status === 401) {
    dispatch('logout')
  }
}

export function loader (loaderFunc, mutation) {
  return function ({ commit, dispatch, getters }) {
    if (moment().unix() - getters.lastRefresh[mutation] < 1) {
      return new Promise(() => {})
    }
    commit('startLoading')
    return loaderFunc(data => {
      commit(mutation, data)
      return Promise.resolve(data)
    })
      .then(
        () => commit('doneLoading', mutation),
        (e) => {
          maybeLogoutOnLoadFail(e, commit, dispatch)
          return Promise.resolve(e)
        }
      )
  }
}

export function isKeepaliveSilenced (silenced) {
  return silenced.check === null || silenced.check === 'keepalive'
}

export function silenceAppliesToClient (silenced, client) {
  return silenced.subscription === null || client.subscriptions.includes(silenced.subscription)
}

export function clientSilencedBy (client, silenced) {
  return silenceAppliesToClient(silenced, client) && isKeepaliveSilenced(silenced)
}
