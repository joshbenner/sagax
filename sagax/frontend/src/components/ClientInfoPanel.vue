<template>
  <b-card class="client-info-panel"
          :title="clientName">

  </b-card>
</template>

<script>
export default {
  name: 'ClientInfoPanel',
  props: {
    clientName: {
      type: String,
      required: true
    }
  },
  computed: {
    client () {
      return this.$store.getters.getClient(this.clientName)
    }
  }
}
</script>
