<template>
  <b-card>
    <s-table :items="clients"
             :fields="fields"
             class="client-table"
             v-model="selected"
             :showCheckboxes="true"
             checkboxValuePath="name"
             :row-class-callback="rowClass"/>
  </b-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ClientsPage',
  data () {
    return {
      selected: []
    }
  },
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

$status-width: 7px;

.client-table {
  thead tr {
    border-left: $status-width solid transparent;
  }
  @each $status, $color in $client-status-colors {
    tr.client-#{$status}  {
      border-left: $status-width solid $color;
    }
  }
}
</style>
