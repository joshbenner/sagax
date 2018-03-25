<template>
  <s-table :items="results"
           :fields="fields"
           class="result-table"
           :enableSearch="false"
           countText="{count} results"/>
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
  }
}
</script>
