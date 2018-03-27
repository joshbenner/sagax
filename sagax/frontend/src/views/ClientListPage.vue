<template>
  <b-card>
    <s-table :items="clients"
             :fields="fields"
             class="client-table row-status-indicators"
             v-model="selected"
             :showCheckboxes="true"
             checkboxValuePath="name"
             :row-class-callback="rowClass"/>
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ClientListPage',
  data () {
    return {
      selected: []
    }
  },
  computed: {
    ...mapGetters(['maxStatusByClient']),
    fields () {
      return this.getConfig('fields.client_list', [])
    },
    clients () {
      return this.$store.getters.allClients.map((c) => Object.assign({}, c, {
        event_count: this.$store.getters.eventsForClient(c.name).length
      }))
    }
  },
  created () {
    return this.$store.dispatch('getClients')
  },
  methods: {
    rowClass (row) {
      switch (this.maxStatusByClient[row._item.name]) {
        case 0:
          return 'status-ok'
        case 1:
          return 'status-warn text-warning'
        case 2:
          return 'status-crit text-danger'
        default:
          return 'status-unknown text-info'
      }
    }
  }
}
</script>
