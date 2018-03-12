import moment from 'moment'

export const timeMixin = {
  methods: {
    timeAgo (value) {
      return moment.unix(value).fromNow()
    }
  }
}
