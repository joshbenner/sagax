<template>
  <s-table :items="results"
           :fields="fields"
           class="result-table"
           :enableSearch="false"
           :row-class-callback="rowClass"
           countText="{count} check results"/>
</template>

<script>
export default {
  name: 'ResultTable',
  props: {
    results: {
      type: Array,
      required: true
    }
  },
  computed: {
    fields () {
      return this.getConfig('fields.result_list', [])
    }
  },
  methods: {
    rowClass (row) {
      switch (row._item.check.status) {
        case 0:
          return 'result-ok'
        case 1:
          return 'result-warn text-warning'
        case 2:
          return 'result-crit text-danger'
        default:
          return 'result-unknown text-info'
      }
    }
  }
}
</script>

<style lang="scss">
.result-table {
  .check-name {
    font-weight: 600;
  }
}
</style>
