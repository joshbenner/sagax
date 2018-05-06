import bus from './bus'
import store from '../store'
import router from '../router'

export const clientMixin = {
  methods: {
    deleteClient (clientName) {
      bus.$emit('show-client-delete-modal', clientName)
    },
    deleteClientConfirmed (clientName) {
      store.dispatch('deleteClient', clientName)
        .then(() => {
          let cr = router.currentRoute
          if (cr.name === 'clientDetail' &&
            cr.params.clientName === clientName) {
            router.replace({ name: 'clientList' })
          }
          this.$notify({
            group: 'main',
            type: 'success',
            title: 'Success',
            text: `Deleted client ${clientName}`
          })
        })
    }
  }
}
