import get from 'lodash/get'
import moment from 'moment'

import ClientName from './ClientName'
import CheckStatus from './CheckStatus'

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
  timeAgo: (val) => moment.unix(val).fromNow(),
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
  render (h) {
    return h(
      'v-client-table',
      {
        scopedSlots: this.$vnode.data.scopedSlots,
        class: {'s-table': true},
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
        columnsClasses: this.colClasses
      }
    }
  }
}
