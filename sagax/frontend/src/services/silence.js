import bus from './bus'

export default {
  methods: {
    showSilenceModal (subscription, check) {
      bus.$emit('show-silence-modal', subscription, check)
    }
  }
}
