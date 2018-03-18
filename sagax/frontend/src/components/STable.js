import get from 'lodash/get'

import ClientName from './ClientName'
import CheckStatus from './CheckStatus'
import TimeAgo from './TimeAgo'

function fKey (field) {
  return field.key.replace('.', '_')
}

function componentTemplate (component, valProp) {
  return function (val, h, row, index) {
    let data = {
      props: {
        row: row,
        index: index
      }
    }
    data.props[valProp || 'val'] = val
    return h(component, data)
  }
}

// Formatter templates that frontend config can designate for rendering cell.
// noinspection JSUnusedGlobalSymbols
let templates = {
  _d: (val) => val,
  timeAgo: componentTemplate(TimeAgo, 'timestamp'),
  checkName: (val) => val,
  clientName: componentTemplate(ClientName, 'clientName'),
  checkStatus: componentTemplate(CheckStatus, 'status')
}

export default {
  name: 'STable',
  props: {
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
    }
  },
  watch: {
    orderBy (newVal, oldVal) {
      // Fix default order, because table is created before we have all the
      // config ready in some cases.
      if (typeof oldVal.column === 'undefined' && typeof newVal.column === 'string') {
        this.$nextTick(this.$refs.table.initOrderBy)
      }
    }
  },
  render (h) {
    return h(
      'v-client-table',
      {
        scopedSlots: this.$vnode.data.scopedSlots,
        class: {'s-table': true},
        ref: 'table',
        props: {
          data: this.tableData,
          columns: this.columns,
          options: this.options
        }
      }
    )
  },
  computed: {
    tableData () {
      return this.items.map((item) => {
        let out = {_item: item}
        this.fields.forEach((field) => {
          out[fKey(field)] = get(item, field.key, '')
        })
        return out
      })
    },
    columns () {
      return this.fields.map(fKey)
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
    colClasses () {
      return this.fields.reduce((o, f) => {
        let key = fKey(f)
        o[key] = `col-${key}`
        return o
      }, {})
    },
    orderBy () {
      for (let field of this.fields) {
        if (get(field, 'sortable', false) && get(field, 'defaultSort', false)) {
          return {
            column: fKey(field),
            ascending: field.defaultSort === 'asc'
          }
        }
      }
      return {}
    },
    sortable () {
      return this.fields.reduce((sortable, field) => {
        if (get(field, 'sortable', false)) {
          sortable.push(fKey(field))
        }
        return sortable
      }, [])
    },
    options () {
      return {
        headings: this.fields.reduce((o, f) => {
          let key = fKey(f)
          if ('label' in f) {
            o[key] = f.label
          } else if (`h__${key}` in this.$slots) {
            o[key] = () => this.$slots[`h__${key}`][0]
          }
          return o
        }, {}),
        templates: this.fields.reduce((o, f) => {
          let k = fKey(f)
          let formatterName = get(f, 'formatter', '_d')
          let formatter = get(templates, formatterName, templates._d)
          o[k] = function (h, row, index) {
            return formatter(row[k], h, row, index)
          }
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
        columnsClasses: this.colClasses,
        orderBy: this.orderBy,
        sortable: this.sortable,
        sortIcon: {
          base: 'fa',
          up: 'fa-sort-up',
          down: 'fa-sort-down',
          is: 'fa-sort'
        }
      }
    }
  }
}
