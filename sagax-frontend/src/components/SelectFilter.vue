<template>
  <b-dropdown :text="title" :variant="variant">
    <b-dropdown-item v-if="noneOption"
                     @click="selectItem('')"
                     :active="this.multiple ? (value === []) : value === ''">
      <i v-if="get(icons, '', false)" :class="icons['']"></i>
      {{ noneOption }}
    </b-dropdown-item>
    <b-dropdown-item v-for="(opt, idx) in options"
                     :key="idx"
                     :active="isActive(opt)"
                     @click="selectItem(opt)">
      <i v-if="get(icons, opt, false)" :class="icons[opt]"></i>
      {{ opt }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import get from 'lodash/get'

export default {
  name: 'SelectFilter',
  props: {
    title: {
      type: String,
      default: 'Select to filter'
    },
    options: {
      type: Array,
      required: true
    },
    icons: {
      type: Object,
      default: () => {}
    },
    noneOption: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {}
  },
  computed: {
    variant () {
      if (this.multiple) {
        return this.value.length ? 'primary' : 'light'
      }
      return this.value ? 'primary' : 'light'
    }
  },
  methods: {
    get,
    selectItem (item) {
      if (this.multiple) {
        if (item === '') {
          this.$emit('input', [])
        } else {
          this.$emit('input', this.value.concat([item]))
        }
      } else {
        this.$emit('input', item)
      }
    },
    isActive (item) {
      return this.multiple ? this.value.includes(item) : this.value === item
    }
  }
}
</script>
