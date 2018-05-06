<template>
  <span class="time-ago" v-b-tooltip="tooltip" title="Test">{{ ago() }}</span>
</template>

<script>
import moment from 'moment-timezone'
import bus from '../services/bus'

export default {
  name: 'TimeAgo',
  props: {
    timestamp: {
      type: Number,
      required: true
    }
  },
  created () {
    bus.$on('refreshed-all', this.redraw)
  },
  destroyed () {
    bus.$off('refreshed-all', this.redraw)
  },
  computed: {
    tooltip () {
      let tz = moment.tz.guess()
      return {
        title: moment.unix(this.timestamp).tz(tz).format(this.timestampFormat),
        delay: {show: 1000}
      }
    },
    timestampFormat () {
      return this.getConfig('timestamp_format', 'YYYY-MM-DD HH:mm')
    }
  },
  methods: {
    redraw () {
      this.$forceUpdate()
    },
    ago () {
      return moment.unix(this.timestamp).fromNow()
    }
  }
}
</script>

<style>
.time-ago {
  white-space: nowrap;
}
</style>
