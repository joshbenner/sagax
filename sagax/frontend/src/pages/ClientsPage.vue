<template>
  <b-card>
    <s-table :items="clients"
             :fields="fields"
             class="client-table"
             :row-class-callback="rowClass"/>
  </b-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ClientsPage',
  computed: {
    ...mapState({ clients: state => state.clients.clients }),
    ...mapGetters(['maxStatusByClient']),
    fields () {
      return this.getConfig('fields.client_list', [])
    }
  },
  created () {
    return this.$store.dispatch('getClients')
  },
  methods: {
    rowClass (row) {
      switch (this.maxStatusByClient[row.name]) {
        case 0:
          return 'client-ok'
        case 1:
          return 'client-warn text-warning'
        case 2:
          return 'client-crit text-danger'
        default:
          return 'client-unknown text-info'
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/core-variables';

.client-table {
  @each $status, $color in $client-status-colors {
    tr.client-#{$status}  {
      border-left: 10px solid $color;
    }
  }
}
</style>
