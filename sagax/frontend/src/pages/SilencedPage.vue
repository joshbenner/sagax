<template>
  <b-card>
    <s-table :items="silenced"
             :fields="fields"
             class="silenced-table">
      <template slot="actions" slot-scope="props">
        <b-link @click="deleteClicked(props.row._item.id)">
          <i class="fa fa-trash fa-lg text-danger"></i>
        </b-link>
      </template>
    </s-table>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SilencedPage',
  computed: {
    ...mapState({ silenced: state => state.silenced.silenced }),
    fields () {
      let fields = Array.from(this.getConfig('fields.silenced_list', []))
      fields.unshift({label: '', key: 'actions'})
      return fields
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
