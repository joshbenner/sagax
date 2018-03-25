<template>
  <span class="check-name">
    <b-button variant="link"
              class="check-silence"
              v-if="!silenced"
              @click="showSilenceModal(`client:${clientName}:${checkName}`)">
      <i class="fa fa-lg fa-volume-up"></i>
    </b-button>
    <b-button variant="link"
              class="check-unsilence"
              v-if="silenced"
              @click="showUnsilenceModal(relevantSilenceIds)">
      <i class="fa fa-lg fa-volume-off text-danger"></i>
    </b-button>
    {{ check.name }}
  </span>
</template>

<script>
export default {
  name: 'CheckName',
  props: {
    check: {
      required: true,
      type: Object
    },
    clientName: {
      default: '',
      type: String
    }
  },
  computed: {
    checkName () {
      return this.check ? this.check.name : ''
    },
    relevantSilenceIds () {
      let silences = this.$store.getters.silencesForCheck(this.clientName, this.checkName)
      return silences.map((s) => s.id)
    },
    silenced () {
      return this.checkName ? (this.relevantSilenceIds.length > 0) : false
    }
  }
}
</script>

<style>
.check-name button {
  padding: 0 2px 1px 0;
  width: 2em;
}
</style>
