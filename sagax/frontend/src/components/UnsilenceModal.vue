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
             :small="true"
             :striped="false"
             count-text=""
             :enable-search="false">

      <template slot="h__checkbox">
        <b-form-checkbox plain
                         v-model="allSelected"
                         @change="toggleAllSelected"
                         :indeterminate="indeterminate"/>
      </template>

      <template slot="checkbox" slot-scope="props">
        <b-form-checkbox plain v-model="selected" :value="props.row.id" />
      </template>

    </s-table>
  </b-modal>
</template>

<script>
import difference from 'lodash/difference'
import api from '../services/api'

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
      selected: [],
      allSelected: false,
      indeterminate: false
    }
  },
  watch: {
    selected (newVal) {
      this.allSelected = (difference(this.silenceIds, newVal).length === 0)
      this.indeterminate = (!this.allSelected && newVal.length > 0)
    }
  },
  computed: {
    entriesToRemove () {
      return this.$store.getters.allSilenced.filter(
        (s) => this.silenceIds.includes(s.id))
    },
    fields () {
      let fields = Array.from(this.getConfig('fields.unsilence_list', []))
      fields.unshift({key: 'checkbox'})
      return fields
    }
  },
  methods: {
    show () {
      this.$refs.modal.show()
    },
    onShow () {
      this.$nextTick(() => { this.selected = this.silenceIds })
    },
    toggleAllSelected (checked) {
      this.selected = checked ? this.silenceIds : []
    },
    deleteClicked () {
      api.clearSilenced(this.selected).then((r) => {
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
