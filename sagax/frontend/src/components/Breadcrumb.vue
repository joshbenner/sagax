<template>
  <ol class="breadcrumb">
    <li class="breadcrumb-item" v-for="(item, index) in links" :key="index" v-if="!isHidden(item)">
      <span class="active" v-if="isLast(index)">{{ showName(item) }}</span>
      <router-link :to="item" v-else>{{ showName(item) }}</router-link>
    </li>
  </ol>
</template>

<script>
import isFunction from 'lodash/isFunction'

export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    links () {
      return this.list.map((link) => {
        return {
          name: link.name || link.meta.defaultChild,
          meta: link.meta,
          params: this.$route.params
        }
      })
    }
  },
  methods: {
    isHidden (item) {
      return item.meta && item.meta.hide
    },
    isLast (index) {
      if (index === this.list.length - 1) {
        return true
      }
      if (index === this.list.length - 2) {
        if (this.isHidden(this.list[index + 1])) {
          return true
        }
      }
      return false
    },
    showName (item) {
      let name = ''
      if (item.meta && item.meta.label) {
        if (isFunction(item.meta.label)) {
          name = item.meta.label(item, this.$route)
        } else {
          name = item.meta.label
        }
      } else if (item.name) {
        name = item.name
      }
      return name
    }
  }
}
</script>
