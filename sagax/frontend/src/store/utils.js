export function loader (loaderFunc, mutation) {
  return function ({ commit, getters }) {
    if (getters.sinceLastRefresh < 1) {
      return
    }
    commit('startLoading')
    return new Promise((resolve) => {
      loaderFunc(data => {
        commit(mutation, data)
        resolve()
      })
    }).then(() => commit('doneLoading'))
  }
}
