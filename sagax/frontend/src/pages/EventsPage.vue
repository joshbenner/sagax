<template>
  <div class="events-table-container">
    <p>Table will go here.</p>
    <b-button variant="success">Vue Btn</b-button>
  </div>
</template>

<script>
// import config from '../services/config'
import api from '../services/api'

export default {
  name: 'EventsPage',
  data () {
    return {
      loading: false,
      events: []
    }
  },
  created () {
    this.loading = true
    api.getEvents(data => {
      this.events = data
      this.loading = false
    })
  }

}
</script>

<style lang="scss" scoped>

</style>
