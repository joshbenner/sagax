<template>
  <v-client-table
    class="s-table"
    :data="tableData"
    :columns="columns"
    :options="options" />
</template>

<script>
import get from 'lodash/get'
import moment from 'moment'

import ClientName from './ClientName'

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
  clientName: componentTemplate(ClientName, 'clientName')
}

export default {
  name: 'STable',
  props: {
    items: {
      required: true
    },
    fields: {
      required: true
    }
  },
  computed: {
    tableData () {
      return this.items.map((item) => {
        let out = {}
        this.fields.forEach((field) => {
          out[fKey(field)] = get(item, field.key, '')
        })
        return out
      })
    },
    columns () {
      return this.fields.map(fKey)
    },
    options () {
      return {
        headings: this.fields.reduce((o, f) => {
          o[fKey(f)] = f.label
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
        skin: 'table table-striped'
      }
    }
  }
}
</script>
