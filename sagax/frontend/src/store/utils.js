import moment from 'moment'
import get from 'lodash/get'

export function maybeLogoutOnLoadFail (e, commit, dispatch) {
  commit('doneLoading')
  if (e.response.status === 401) {
    dispatch('logout')
  }
}

export function loader (loaderFunc, mutation) {
  return function ({ commit, dispatch, getters }, opts) {
    let force = get(opts, 'force', false)
    let sinceLast = moment().unix() - getters.lastRefresh[mutation]

    if (sinceLast < 1 && !force) {
      return new Promise(() => {})
    }
    commit('startLoading')
    return loaderFunc()
      .then(
        ({ data }) => {
          commit(mutation, data)
          commit('doneLoading', mutation)
        },
        (e) => {
          maybeLogoutOnLoadFail(e, commit, dispatch)
          return Promise.resolve(e)
        }
      )
  }
}
