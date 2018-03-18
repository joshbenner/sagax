<template>
  <b-card>
    <s-table :items="silenced"
             :fields="fields"
             class="silenced-table"/>
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
