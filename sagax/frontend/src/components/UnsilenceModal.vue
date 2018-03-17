<template>
  <b-modal id="unsilenceModal"
           ref="modal"
           title="Confirm Clear Silence Entries"
           centered
           size="lg"
           ok-title="Delete Entries">
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
    toggleAllSelected (checked) {
      this.selected = checked ? this.silenceIds : []
    }
  }
}
</script>
