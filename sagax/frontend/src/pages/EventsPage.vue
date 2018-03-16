<template>
  <b-card>
    <s-table :items="events" :fields="fields"/>
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
  }

}
</script>

<style lang="scss" scoped>

</style>
