<template>
  <b-card>
    <s-table :items="clients"
             :fields="fields"
             name="clientList"
             class="client-table row-status-indicators"
             v-model="selected"
             :showCheckboxes="true"
             :custom-filters="customFilters"
             checkboxValuePath="name"
             :row-class-callback="rowClass">

      <template slot="filters">
        <select-filter :title="subFilterTitle"
                       :options="subscriptionOptions"
                       v-model="filter.subscription"
                       none-option="(none)"
                       @input="subFilter"/>
      </template>

    </s-table>
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { Event as tableEvent } from 'vue-tables-2'

export default {
  name: 'ClientListPage',
  data () {
    return {
      selected: [],
      filter: {
        subscription: ''
      },
      customFilters: [
        {
          name: 'subscription',
          callback: (row, query) => row._item.subscriptions.includes(query)
        }
      ]
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
    },
    subscriptionOptions () {
      let all = this.clients.reduce((s, c) => s.concat(c.subscriptions), [])
      let filtered = all.filter((s) => !s.startsWith('client:'))
      return Array.from(new Set(filtered)).sort()
    },
    subFilterTitle () {
      return this.filter.subscription ? `Subscription: ${this.filter.subscription}` : 'No Subscription Filter'
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
    },
    subFilter (val) {
      this.filter.subscription = val
      tableEvent.$emit('vue-tables.clientList.filter::subscription', val)
    }
  }
}
</script>
