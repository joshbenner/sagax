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
      return
    }
    commit('startLoading')
    return new Promise((resolve) => {
      loaderFunc(data => {
        commit(mutation, data)
        resolve()
      })
    })
      .then(() => commit('doneLoading', mutation))
      .catch((e) => maybeLogoutOnLoadFail(e, commit, dispatch))
  }
}
