<template>
  <b-card>
    <b-table :items="silenced" :fields="fields" striped/>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SilencedPage',
  computed: {
    ...mapState({ silenced: state => state.silenced.silenced }),
    fields () {
      return this.getConfig('fields.silenced_list', [])
    }
  },
  created () {
    return this.$store.dispatch('getSilenced')
  }
}
</script>
