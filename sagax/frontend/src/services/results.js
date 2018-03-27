import bus from './bus'
import store from '../store'
import router from '../router'

export const resultMixin = {
  methods: {
    deleteResult (clientName, checkName) {
      bus.$emit('show-result-delete-modal', clientName, checkName)
    },
    deleteResultConfirmed (clientName, checkName) {
      store.dispatch('deleteResult', {clientName, checkName})
        .then(() => {
          let cr = router.currentRoute
          if (cr.name === 'resultDetail' &&
            cr.params.clientName === clientName &&
            cr.params.checkName === checkName) {
            router.replace({ name: 'clientDetail', params: { clientName } })
          }
          this.$notify({
            group: 'main',
            type: 'success',
            title: 'Success',
            text: `Deleted result for ${clientName}/${checkName}`
          })
        })
    }
  }
}
