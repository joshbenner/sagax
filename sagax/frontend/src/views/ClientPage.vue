<template>
  <div class="client-page">
    <client-info-panel :clientName="clientName" />
  </div>
</template>

<script>
export default {
  name: 'ClientPage',
  computed: {
    clientName () {
      return this.$route.params.clientName
    },
    client () {
      return this.$store.getters.getClient(this.clientName)
    }
  }
}
</script>
