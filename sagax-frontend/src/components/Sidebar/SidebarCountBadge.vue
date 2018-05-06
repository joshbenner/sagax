<template>
  <b-badge v-if="count > 0" pill :variant="variant">{{count}}</b-badge>
</template>

<script>
export default {
  props: {
    counter: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      default: 'info'
    }
  },
  computed: {
    count () {
      return this.$store.getters[this.counter]
    }
  }
}
</script>
