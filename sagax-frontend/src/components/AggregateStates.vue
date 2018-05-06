<template>
  <div class="aggregate-states">
    <b-badge v-if="results.ok"
             variant="success">{{ results.ok }} OK</b-badge>
    <b-badge v-if="results.warning"
             variant="warning">{{ results.warning }} Warning</b-badge>
    <b-badge v-if="results.critical"
             variant="danger">{{ results.critical }} Critical</b-badge>
    <b-badge v-if="results.unknown"
             variant="info">{{ results.unknown }} Unknown</b-badge>
    <b-badge v-if="results.stale"
             variant="light">{{ results.stale }} Stale</b-badge>
  </div>
</template>

<script>
export default {
  name: 'AggregateStates',
  props: {
    results: {
      required: true
    }
  }
}
</script>

<style>
.aggregate-states {
  font-size: 1.2em;
}
</style>
