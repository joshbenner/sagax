<template>
  <span class="silence-expire">
    <span class="silence-expire-time"
          v-if="expires >= 0"
          v-b-tooltip="tooltip">
      {{ whenExpire }}
    </span>
    <span class="silence-expire-never"
          v-if="expires < 0 && !entry.expire_on_resolve">
      Never
    </span>
    <span class="silence-expire-on-resolve"
          v-if="entry.expire_on_resolve">
      When resolved
    </span>
  </span>
</template>

<script>
import moment from 'moment-timezone'

export default {
  name: 'SilenceExpire',
  props: ['expires', 'entry'],
  computed: {
    whenExpire () {
      return moment.unix(moment().unix() + this.expires).fromNow()
    },
    tooltip () {
      let tz = moment.tz.guess()
      let now = moment().unix()
      return {
        title: moment.unix(now + this.expires).tz(tz).format(this.timestampFormat)
      }
    },
    timestampFormat () {
      return this.getConfig('timestamp_format', 'YYYY-MM-DD HH:mm')
    }
  }
}
</script>
