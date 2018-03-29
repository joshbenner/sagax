<template>
  <b-modal id="unsilenceModal"
           ref="modal"
           title="Confirm Clear Silence Entries"
           centered
           size="lg"
           ok-title="Delete Entries"
           :ok-disabled="selected.length < 1"
           @ok="deleteClicked"
           @show="onShow">
    <s-table :items="entriesToRemove"
             :fields="fields"
             name="unsilenceList"
             :small="true"
             :striped="false"
             count-text=""
             v-model="selected"
             :showCheckboxes="true"
             checkboxValuePath="id"
             :enable-search="false"/>
  </b-modal>
</template>

<script>
import api from '../services/api'
import range from 'lodash/range'

export default {
  name: 'UnsilenceModal',
  props: {
    silenceIds: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selected: []
    }
  },
  computed: {
    entriesToRemove () {
      return this.$store.getters.allSilenced.filter(
        (s) => this.silenceIds.includes(s.id))
    },
    fields () {
      return Array.from(this.getConfig('fields.unsilence_list', []))
    },
    selectedIds () {
      return this.selected.map((s) => this.silenceIds[s])
    }
  },
  methods: {
    show () {
      this.$refs.modal.show()
    },
    onShow () {
      this.$nextTick(() => { this.selected = range(this.silenceIds.length) })
    },
    deleteClicked () {
      api.clearSilenced(this.selectedIds).then((r) => {
        r.data.results.map(({ id, status, data }) => {
          if (status > 200 && status < 300) {
            this.$notify({
              group: 'main',
              type: 'success',
              title: 'Silence Cleared',
              text: `Cleared silence: ${id}`
            })
          } else {
            console.log({id, status, data})
            this.$notify({
              group: 'main',
              type: 'error',
              title: 'Silence Not Cleared',
              text: `Failed to clear silence: ${id}`
            })
          }
          this.$store.dispatch('getSilenced', {force: true})
        })
      })
    }
  }
}
</script>
