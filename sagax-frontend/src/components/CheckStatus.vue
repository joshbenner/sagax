<template>
  <b-badge :variant="variant">{{ statusName }}</b-badge>
</template>

<script>
import get from 'lodash/get'

const statusNames = {
  0: 'OK',
  1: 'WARNING',
  2: 'CRITICAL'
}

const statusVariants = {
  0: 'success',
  1: 'warning',
  2: 'danger'
}

export default {
  name: 'CheckStatus',
  props: {
    status: {
      type: Number,
      required: true
    }
  },
  computed: {
    statusName () {
      return get(statusNames, this.status, `UNKNOWN (${this.status})`)
    },
    variant () {
      return get(statusVariants, this.status, 'info')
    }
  }
}
</script>
