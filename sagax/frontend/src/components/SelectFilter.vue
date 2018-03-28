<template>
  <b-dropdown :text="title" :variant="variant">
    <b-dropdown-item v-if="noneOption"
                     @click="selectItem('')"
                     :active="value === ''">
      {{ noneOption }}
    </b-dropdown-item>
    <b-dropdown-item v-for="(opt, idx) in options"
                     :key="idx"
                     :active="value === opt"
                     @click="selectItem(opt)">
      {{ opt }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
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
    noneOption: {
      type: String,
      default: ''
    },
    value: {
      type: String
    }
  },
  computed: {
    variant () {
      return this.value ? 'primary' : 'light'
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('input', item)
    }
  }
}
</script>
