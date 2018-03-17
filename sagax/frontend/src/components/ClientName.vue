<template>
  <span class="client-name" :class="statusClass">
    <b-button variant="link"
              v-b-tooltip="silenceTooltip"
              class="client-silence"
              v-if="!silenced"
              @click="showSilenceModal(`client:${clientName}`)">
      <i class="fa fa-lg fa-volume-up"></i>
    </b-button>
    <b-button variant="link"
              class="client-unsilence"
              v-if="silenced">
      <i class="fa fa-lg fa-volume-off text-danger"></i>
    </b-button>
    {{ clientName }}
  </span>
</template>

<script>
import get from 'lodash/get'

const statusClasses = {
  0: 'ok',
  1: 'warn',
  2: 'crit',
  3: 'unknown'
}

export default {
  name: 'ClientName',
  props: {
    clientName: {
      required: true,
      type: String
    }
  },
  computed: {
    silenceTooltip () {
      return {
        title: `Silence all checks for ${this.clientName}`,
        placement: 'bottom',
        container: 'body',
        delay: {show: 2000}
      }
    },
    client () {
      return this.$store.getters.getClient(this.clientName)
    },
    silenced () {
      return this.$store.getters.clientIsSilenced(this.clientName)
    },
    status () {
      return this.$store.getters.maxStatusOfClient(this.clientName)
    },
    statusClass () {
      return get(statusClasses, this.status, 'unknown')
    }
  }
}
</script>

<style>
.client-name button {
  padding: 0 2px 1px 0;
  width: 2em;
}
.client-name button .fa-stack {
  line-height: 1.2em;
  height: 1.2em;
  width: 1.2em;
}
</style>
