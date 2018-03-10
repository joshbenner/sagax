import moment from 'moment'

export const timeMixin = {
  methods: {
    moment: moment,
    timeAgo (value) {
      return moment.unix(value).fromNow()
    }
  }
}
