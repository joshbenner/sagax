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
  name: 'SilencedListPage',
  computed: {
    ...mapState({ silenced: state => state.silenced.silenced }),
    fields () {
      return this.getConfig('fields.silenced_list', [])
    }
  },
  created () {
    return this.$store.dispatch('getSilenced')
  },
  methods: {
    deleteClicked (silenceId) {
      this.showUnsilenceModal([silenceId])
    }
  }
}
</script>

<style>
.silenced-table td:first-child {
  width: 1%;
}
</style>
