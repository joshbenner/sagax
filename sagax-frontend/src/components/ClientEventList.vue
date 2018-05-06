<template>
  <ul class="client-event-list">
    <li v-for="(event, index) in events"
        :key="index"
        :class="classes(event)">
      {{ summary(event) }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ClientEventList',
  props: {
    client: {
      required: true,
      type: Object
    }
  },
  computed: {
    events () {
      return this.$store.getters.eventsForClient(this.client.name)
    }
  },
  methods: {
    summary (event) {
      return event.check.output.split('\n')[0]
    },
    classes (event) {
      return {
        'event-ok': event.check.status === 0,
        'event-warn': event.check.status === 1,
        'event-crit': event.check.status === 2,
        'event-unknown': !([0, 1, 2].includes(event.check.status))
      }
    }
  }
}
</script>

<style lang="scss">
.client-event-list {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
</style>
