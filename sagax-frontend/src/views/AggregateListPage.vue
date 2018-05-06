<template>
  <b-card>
    <s-table :items="aggregates"
             :fields="fields"
             name="aggregatesList"
             class="aggregates-table"/>
  </b-card>
</template>

<script>
export default {
  name: 'AggregateListPage',
  computed: {
    fields () {
      return this.getConfig('fields.aggregates_list', [])
    },
    aggregates () {
      return this.$store.getters.allAggregates
    }
  },
  created () {
    this.$store.commit('getDetailedAggregates', true)
    this.$store.dispatch('getAggregates', { force: true })
  },
  destroyed () {
    this.$store.commit('getDetailedAggregates', false)
  }
}
</script>
