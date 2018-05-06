import api from './api'

export const checkMixin = {
  methods: {
    requestCheck (checkName, subscribers, reason) {
      api.requestCheck(checkName, subscribers, reason).then(({ status }) => {
        if (status >= 200 && status < 300) {
          this.$notify({
            group: 'main',
            type: 'success',
            title: 'Success',
            text: `Requested check for ${checkName}`
          })
        } else {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Error',
            text: `Failed to request check`
          })
        }
      })
    }
  }
}
