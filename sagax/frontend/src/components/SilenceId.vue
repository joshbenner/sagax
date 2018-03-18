<template>
  <span class="silence-id">
    <b-link variant="link"
              class="silence-entry-delete">
      <i class="fa fa-lg fa-trash text-danger"></i>
    </b-link>
    <span class="silence-id-id">{{ entry.id }}</span>
  </span>
</template>

<script>
export default {
  name: 'SilenceId',
  props: {
    entry: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.silence-id a {
  padding-right: 0.5em;
}
</style>
