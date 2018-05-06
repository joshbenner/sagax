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
        <select-filter :title="healthFilterTitle"
                       :options="healthFilterOptions"
                       v-model="filter.health"
                       none-option="(none)"
                       @input="healthFilter"/>
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
        subscription: '',
        health: ''
      },
      healthFilterOptions: [
        'OK',
        'Not OK',
        'Warning',
        'Critical',
        'Unknown'
      ],
      customFilters: [
        {
          name: 'subscription',
          callback: (row, query) => row._item.subscriptions.includes(query)
        },
        {
          name: 'health',
          callback: ({ _item }, health) => {
            let status = this.$store.getters.maxStatusOfClient(_item.name)
            switch (health) {
              case 'OK':
                return status === 0
              case 'Not OK':
                return status !== 0
              case 'Warning':
                return status === 1
              case 'Critical':
                return status === 2
              case 'Unknown':
                return status < 0 || status > 2
            }
          }
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
    },
    healthFilterTitle () {
      return this.filter.health ? `Health: ${this.filter.health}` : 'No Health Filter'
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
    },
    healthFilter (val) {
      this.filter.health = val
      tableEvent.$emit('vue-tables.clientList.filter::health', val)
    }
  }
}
</script>
