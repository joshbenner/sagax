import moment from 'moment'

export function loader (loaderFunc, mutation) {
  return function ({ commit, getters }) {
    if (moment().unix() - getters.lastRefresh[mutation] < 1) {
      return
    }
    commit('startLoading')
    return new Promise((resolve) => {
      loaderFunc(data => {
        commit(mutation, data)
        resolve()
      })
    }).then(() => commit('doneLoading', mutation))
  }
}
