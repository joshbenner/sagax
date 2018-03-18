<template>
  <b-link @click="deleteClicked">
    <i class="fa fa-trash fa-lg text-danger"></i>
  </b-link>
</template>

<script>
export default {
  name: 'SilenceDelete',
  props: {
    silenceId: {
      type: String,
      required: true
    }
  },
  methods: {
    deleteClicked () {
      this.showUnsilenceModal([this.silenceId])
    }
  }
}
</script>
