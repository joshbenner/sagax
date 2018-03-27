import moment from 'moment-timezone'

export default {
  name: 'Timestamp',
  props: {
    unix: {
      required: true,
      type: Number
    },
    format: {
      required: false,
      type: String
    }
  },
  computed: {
    _format () {
      return this.format || this.getConfig('timestamp_format', 'L LT z')
    }
  },
  render (h) {
    return h(
      'span',
      { class: { timestamp: true } },
      [moment.unix(this.unix).tz(moment.tz.guess()).format(this._format)]
    )
  }
}
