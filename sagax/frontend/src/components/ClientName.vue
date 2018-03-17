<template>
  <span class="client-name" :class="statusClass">
    <b-link variant="primary" v-b-tooltip.bottom="`Silence all checks for ${clientName}`">
      <i class="fa fa-lg fa-volume-up"></i>
    </b-link>
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
