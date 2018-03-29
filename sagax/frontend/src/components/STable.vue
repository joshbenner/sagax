<template>
  <v-client-table class="s-table"
                  :class="{checkboxes: showCheckboxes}"
                  ref="table"
                  :name="name"
                  :data="tableData"
                  :columns="columns"
                  :options="options">

    <template v-if="showCheckboxes" slot="h___checkbox">
      <b-form-checkbox plain
                       v-model="allSelected"
                       @change="toggleAllSelected"
                       :indeterminate="indeterminate"/>
    </template>

    <template v-if="showCheckboxes" slot="_checkbox" slot-scope="props">
      <b-form-checkbox plain
                       v-model="selected"
                       :value="props.row._idx" />
    </template>

    <template slot="beforeFilter">
      <b-dropdown text="Bulk Actions"
                  class="bulk-action-dropdown"
                  :variant="checkboxSelected.length ? 'primary' : 'light'"
                  :disabled="!checkboxSelected.length"
                  v-if="showCheckboxes">
        <b-dropdown-item v-for="(action, idx) in bulkActions"
                         :key="`bulk-${name}-${idx}`"
                         @click="action.callback(bulkItems(checkboxSelected))">
          <i v-if="action.icon" :class="[action.icon]"></i>
          {{ action.label }}
        </b-dropdown-item>
      </b-dropdown>
    </template>

    <slot name="filters" slot="afterFilter"/>
  </v-client-table>
</template>

<script>
import get from 'lodash/get'
import difference from 'lodash/difference'

import { getFormatter } from '../services/formatters'

export default {
  name: 'STable',
  props: {
    name: {
      required: true,
      type: String
    },
    items: {
      required: true
    },
    fields: {
      required: true
    },
    enableSearch: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: true
    },
    countText: {
      type: String,
      default: '{count} records'
    },
    fakeFields: {
      type: Array,
      default: () => []
    },
    rowClassCallback: {
      default: false
    },
    showCheckboxes: {
      type: Boolean,
      default: false
    },
    checkboxSelected: {
      type: Array,
      default: () => []
    },
    customFilters: {
      type: Array,
      default: () => []
    },
    bulkActions: {
      type: Array,
      default: () => []
    }
  },
  model: {
    prop: 'checkboxSelected'
  },
  data: function () {
    return {
      selected: [],
      allSelected: false,
      indeterminate: false
    }
  },
  watch: {
    checkboxSelected (newVal) {
      this.selected = newVal
    },
    selected (newVal) {
      this.allSelected = (difference(this.allSelectValues, newVal).length === 0)
      this.indeterminate = (!this.allSelected && newVal.length > 0)
      this.$emit('input', this.selected)
    },
    orderBy (newVal, oldVal) {
      // Fix default order, because table is created before we have all the
      // config ready in some cases.
      if (typeof oldVal.column === 'undefined' && typeof newVal.column === 'string') {
        this.$nextTick(this.$refs.table.initOrderBy)
      }
    }
  },
  computed: {
    _fields () {
      let fieldIndex = 0
      return this.fields.map((f) => {
        let key = f.key.replace('.', '_')
        return Object.assign({}, f, { index: `${key}_${fieldIndex++}` })
      })
    },
    tableData () {
      let idx = 0
      return this.items.map((item) => {
        let out = {_item: item, _idx: idx++}
        this._fields.forEach((field) => {
          out[field.index] = get(item, field.key, '')
        })
        return out
      })
    },
    columns () {
      let cols = this._fields.map((f) => f.index)
      if (this.showCheckboxes) {
        cols.unshift('_checkbox')
      }
      return cols
    },
    extraClasses () {
      let classes = []
      if (this.small) {
        classes.push('table-sm')
      }
      if (this.striped) {
        classes.push('table-striped')
      }
      return classes
    },
    orderBy () {
      for (let field of this._fields) {
        if (get(field, 'sortable', false) && get(field, 'defaultSort', false)) {
          return {
            column: field.index,
            ascending: field.defaultSort === 'asc'
          }
        }
      }
      return {}
    },
    sortable () {
      return this._fields.reduce((sortable, field) => {
        if (get(field, 'sortable', false)) {
          sortable.push(field.index)
        }
        return sortable
      }, [])
    },
    options () {
      return {
        headings: this._fields.reduce((o, f) => {
          if ('label' in f) {
            o[f.index] = f.label
          }
          return o
        }, {}),
        templates: this._fields.reduce((o, f) => {
          o[f.index] = (h, row) => getFormatter(f)(row._item, h)
          return o
        }, {}),
        perPage: 99999,
        perPageValues: [],
        skin: 'table ' + this.extraClasses.join(' '),
        texts: {
          filter: '',
          count: this.countText
        },
        filterable: this.enableSearch,
        rowClassCallback: this.rowClassCallback,
        orderBy: this.orderBy,
        sortable: this.sortable,
        sortIcon: {
          base: 'fa',
          up: 'fa-sort-up',
          down: 'fa-sort-down',
          is: 'fa-sort'
        },
        customFilters: this.customFilters
      }
    },
    allSelectValues () {
      return this.tableData.map((i) => i._idx)
    }
  },
  methods: {
    _get: get,
    _debug: console.log,
    toggleAllSelected (checked) {
      this.selected = checked ? this.allSelectValues : []
    },
    bulkItems (selected) {
      return this.tableData
        .filter((i) => selected.includes(i._idx))
        .map((i) => i._item)
    }
  }
}
</script>

<style lang="scss">
.s-table {
  &.checkboxes {
    tr > td:first-child {
      width: 1px;
    }
  }
}
</style>
