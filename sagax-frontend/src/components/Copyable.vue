<template>
  <span class="copyable">
    {{ value }}
    <b-link v-clipboard:copy="value"
              v-clipboard:success="onSuccess"
              v-clipboard:error="onError">
      <i class="fa fa-copy"></i>
    </b-link>
  </span>
</template>

<script>
export default {
  name: 'Copyable',
  props: {
    value: {
      required: true,
      type: String
    }
  },
  methods: {
    onSuccess () {
      this.$notify({
        group: 'main',
        type: 'success',
        title: 'Copied',
        text: 'Text copied to your clipbard'
      })
    },
    onError () {
      this.$notify({
        group: 'main',
        type: 'error',
        title: 'Copy Failed',
        text: 'Could not copy text to clipbard'
      })
    }
  }
}
</script>

<style>
.copyable a {
  display: inline-block;
  padding-left: 1em;
}
</style>
