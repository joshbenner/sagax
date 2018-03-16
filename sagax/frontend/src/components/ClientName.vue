<template>
  <span class="client-name">
    {{ clientName }}
  </span>
</template>

<script>
export default {
  name: 'ClientName',
  props: {
    clientName: {
      required: true,
      type: String
    }
  },
  computed: {
    client () {
      return this.$store.getters.getClient(this.clientName)
    },
    silenced () {
      return this.$store.getters.silencedClients.map((c) => c.name).includes(this.clientName)
    }
  }
}
</script>
