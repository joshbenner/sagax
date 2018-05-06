import bus from './bus'

export const rawMixin = {
  methods: {
    showRaw (type, name, data) {
      bus.$emit('show-raw', type, name, data)
    }
  }
}
