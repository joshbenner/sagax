<template>
  <b-card>
    <s-table :items="events"
             :fields="fields"
             name="eventList"
             class="event-table"
             :custom-filters="customFilters"
             :row-class-callback="rowClass">

      <template slot="filters">
        <select-filter :title="checkFilterTitle"
                       :options="checkFilterOptions"
                       :multiple="true"
                       v-model="filter.check"
                       none-option="Show All Checks"
                       @input="checkFilter"/>
        <select-filter :title="statusFilterTitle"
                       :options="statusFilterOptions"
                       v-model="filter.status"
                       none-option="Show All"
                       @input="statusFilter"/>
      </template>

    </s-table>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import { Event as tableEvent } from 'vue-tables-2'

export default {
  name: 'EventListPage',
  data () {
    return {
      filter: {
        check: [],
        status: ''
      },
      statusFilterOptions: [
        'Warning',
        'Critical',
        'Unknown'
      ],
      customFilters: [
        {
          name: 'check',
          callback: ({ _item }, checkNames) => {
            return checkNames.length ? checkNames.includes(_item.check.name) : true
          }
        },
        {
          name: 'status',
          callback: ({ _item }, status) => {
            switch (status) {
              case 'Warning':
                return _item.check.status === 1
              case 'Critical':
                return _item.check.status === 2
              case 'Unknown':
                return _item.check.status < 0 || _item.check.status > 2
            }
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({ events: state => state.events.events }),
    fields () {
      return this.getConfig('fields.event_list', [])
    },
    checkFilterTitle () {
      return this.filter.check.length ? `Checks: ${this.filter.check.join(', ')}` : 'All Checks'
    },
    checkFilterOptions () {
      return Array.from(new Set(this.events.map((e) => e.check.name))).sort()
    },
    statusFilterTitle () {
      return this.filter.status ? `Status: ${this.filter.status}` : 'All Statuses'
    }
  },
  created () {
    return this.$store.dispatch('getEvents')
  },
  methods: {
    checkFilter (val) {
      this.filter.check = val
      tableEvent.$emit('vue-tables.eventList.filter::check', val)
    },
    statusFilter (val) {
      this.filter.status = val
      tableEvent.$emit('vue-tables.eventList.filter::status', val)
    },
    rowClass (row) {
      switch (this.$store.getters.maxStatusByClient[row._item.client.name]) {
        case 0:
          return 'event-ok'
        case 1:
          return 'event-warn'
        case 2:
          return 'event-crit'
        default:
          return 'event-unknown'
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/core-variables';

.event-table {

}
</style>
