<template>
  <b-card>
    <s-table :items="silenced"
             :fields="fields"
             :showCheckboxes="true"
             :bulkActions="bulkActions"
             v-model="selected"
             name="silencedList"
             class="silenced-table">
      <template slot="filters">
        <b-button variant="primary" @click="showSilenceModal('', '')">
          <i class="fa fa-plus"></i>
          Add Silence
        </b-button>
      </template>
    </s-table>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import isEqual from 'lodash/isEqual'

export default {
  name: 'SilencedListPage',
  data () {
    return {
      selected: [],
      bulkActions: [
        {
          label: 'Delete / Unsilence',
          icon: 'fa fa-trash',
          callback: (items) => this.showUnsilenceModal(items.map((i) => i.id))
        }
      ]
    }
  },
  watch: {
    silenced (newSilenced, oldSilenced) {
      let newIds = new Set(newSilenced.map((s) => s.id))
      let oldIds = new Set(oldSilenced.map((s) => s.id))

      if (!isEqual(newIds, oldIds)) {
        this.selected = []
      }
    }
  },
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
