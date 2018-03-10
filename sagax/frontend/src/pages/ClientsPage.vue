<template>
  <b-card>
    <b-table :items="clients" :fields="fields" striped/>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ClientsPage',
  computed: {
    ...mapState({ clients: state => state.clients.clients }),
    fields () {
      return this.getConfig('fields.client_list', [])
    }
  },
  created () {
    return this.$store.dispatch('getClients')
  }
}
</script>
