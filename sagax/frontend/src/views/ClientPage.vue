<template>
  <b-row class="client-page">
    <b-col lg="12" xl="4">
      <client-info-panel :clientName="clientName" />
    </b-col>
    <b-col lg="12" xl="8">
      <b-card>
        <result-table :results="results"/>
      </b-card>
    </b-col>
  </b-row>
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
    },
    results () {
      return this.$store.getters.clientResults(this.clientName)
    }
  },
  created () {
    if (this.clientName) {
      this.$store.dispatch('getClientResults', this.clientName)
    }
    this.$store.commit('setResultClientToRefresh', this.clientName)
  },
  beforeRouteUpdate () {
    if (this.clientName) {
      this.$store.dispatch('getClientResults', this.clientName)
    }
  },
  updated () {
    this.$store.commit('setResultClientToRefresh', this.clientName)
  }
}
</script>
