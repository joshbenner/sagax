export function loader (loaderFunc, mutation) {
  return function ({ commit }) {
    commit('startLoading')
    return new Promise((resolve) => {
      loaderFunc(data => {
        commit(mutation, data)
        resolve()
      })
    }).then(() => commit('doneLoading'))
  }
}
