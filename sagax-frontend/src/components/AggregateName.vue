<template>
  <span class="aggregate-name">
    <router-link :to="link">{{ aggregateName }}</router-link>
  </span>
</template>

<script>
export default {
  name: 'AggregateName',
  props: {
    aggregateName: {
      required: true,
      type: String
    }
  },
  computed: {
    link () {
      return {
        name: 'aggregateDetail',
        params: { aggregateName: this.aggregateName }
      }
    }
  }
}
</script>
