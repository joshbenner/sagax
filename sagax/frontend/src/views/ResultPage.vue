<template>
  <b-row class="check-page">
    <b-col lg="12" xl="4">
      <client-info-panel :clientName="clientName" />
    </b-col>
    <b-col lg="12" xl="8">
      <result-info-panel :clientName="clientName" :checkName="checkName" />
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'ResultPage',
  computed: {
    clientName () {
      return this.$route.params.clientName
    },
    checkName () {
      return this.$route.params.checkName
    }
  }
}
</script>
