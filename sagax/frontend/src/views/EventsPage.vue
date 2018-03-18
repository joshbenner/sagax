<template>
  <b-card>
    <s-table :items="events"
             :fields="fields"
             class="event-table"
             :row-class-callback="rowClass"/>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'EventsPage',
  computed: {
    ...mapState({ events: state => state.events.events }),
    fields () {
      return this.getConfig('fields.event_list', [])
    }
  },
  created () {
    return this.$store.dispatch('getEvents')
  },
  methods: {
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
