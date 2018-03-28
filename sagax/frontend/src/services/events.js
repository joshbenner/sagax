import api from './api'
import store from '../store'
import get from 'lodash/get'

const resolveErrors = {
  404: 'Event not found (or already resolved)',
  400: 'Bad request',
  500: 'Server Error'
}

export const eventMixin = {
  methods: {
    resolveEvent (clientName, checkName) {
      api.resolveEvent(clientName, checkName).then(({ status }) => {
        if (status >= 200 && status < 300) {
          store.commit('resolveEvent', {clientName, checkName})
          this.$notify({
            group: 'main',
            type: 'success',
            title: 'Success',
            text: `Resolved ${clientName}/${checkName}`
          })
        } else {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Error',
            text: get(resolveErrors, status, 'Unknown error')
          })
        }
      })
    }
  }
}
