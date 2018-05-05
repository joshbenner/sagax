import get from 'lodash/get'
import merge from 'lodash/merge'
import keys from 'lodash/keys'
import isArray from 'lodash/isArray'
import round from 'lodash/round'

import ClientName from '../components/ClientName'
import CheckName from '../components/CheckName'
import CheckStatus from '../components/CheckStatus'
import TimeAgo from '../components/TimeAgo'
import SilenceExpire from '../components/SilenceExpire'
import SilenceId from '../components/SilenceId'
import SilenceDelete from '../components/SilenceDelete'
import Copyable from '../components/Copyable'
import ClientEventList from '../components/ClientEventList'
import Timestamp from '../components/Timestamp'
import AggregateStates from '../components/AggregateStates'
import AggregateName from '../components/AggregateName'

import clientStore from '../store/clients'

import { changeRatio } from '../services/flap'

export function getFormatter (fieldSpec) {
  let formatter = get(formatters, get(fieldSpec, 'formatter', '_d'), formatters._d)
  return function (item, h) {
    return formatter(get(item, fieldSpec.key, ''), item, h, fieldSpec)
  }
}

function componentTemplate (component, valProp, itemProp) {
  return function (val, item, h, fieldSpec) {
    let data = {props: {}}
    if (valProp !== null) {
      data.props[valProp || 'val'] = val
    }
    if (typeof itemProp !== 'undefined') {
      data.props[itemProp] = item
    }
    if (fieldSpec.formatter_options) {
      data.props = merge(data.props, fieldSpec.formatter_options)
    }
    return h(component, data)
  }
}

function bullets (val, h, type) {
  if (!isArray(val)) {
    return ''
  }
  return h(type, {}, val.map((v) => h('li', {}, [v])))
}

function statusPill (val, item, h) {
  let variant = get({0: 'success', 1: 'warning', 2: 'danger'}, val, 'info')
  let text = get({0: 'OK', 1: 'Warning', 2: 'Critical'}, val, 'UNKNOWN')
  return h(
    'b-badge',
    {
      props: {
        pill: true,
        variant: variant
      }
    },
    [text]
  )
}

function jsonTreeExpanded (data, item, h, fieldSpec) {
  return h(
    'tree-view',
    {
      props: {
        data: data,
        options: {
          rootObjectKey: fieldSpec.key
        }
      }
    }
  )
}

function jsonTreeCollapsed (data, item, h, fieldSpec) {
  return h(
    'tree-view',
    {
      props: {
        data: data,
        options: {
          rootObjectKey: fieldSpec.key,
          maxDepth: 0
        }
      }
    }
  )
}

function checkName (val, item, h) {
  let itemKeys = keys(item)
  if (itemKeys.includes('action')) {
    // Event item.
    return h(
      CheckName,
      { props: { clientName: item.client.name, check: item.check } }
    )
  } else if (itemKeys.includes('check') && itemKeys.includes('client')) {
    // Result item.
    return h(
      CheckName,
      { props: { clientName: item.client, check: item.check } }
    )
  }
}

function keyvals (data, item, h) {
  return h(
    'div',
    {
      class: {
        keyvals: true
      }
    },
    keys(data).map((key) => {
      return h(
        'div',
        { class: { keyval: true } },
        [
          h('label', { class: { 'keyval-key': true } }, [key]),
          h('span', { class: { 'keyval-val': true } }, [data[key]])
        ]
      )
    })
  )
}

function iframe (val, item, h, fieldSpec) {
  return h(
    'iframe',
    {
      attrs: {
        height: get(fieldSpec, 'formatter_options.height', 200),
        width: '100%',
        src: val,
        frameborder: 0
      }
    }
  )
}

function image (val, item, h) {
  return h(
    'img',
    { attrs: { src: val } }
  )
}

function link (val, item, h, fieldSpec) {
  return h(
    'a',
    {
      attrs: {
        href: val,
        target: get(fieldSpec, 'formatter_options.target', '_blank')
      }
    },
    [get(fieldSpec, 'formatter_options.text', val)]
  )
}

function _default (val, item, h) {
  let str = val + ''
  if (str.startsWith('http://') || str.startsWith('https://')) {
    return h('a', {attrs: {href: str, target: '_blank'}}, [str])
  } else {
    return val
  }
}

function bold (val, item, h) {
  return h(
    'span',
    { class: ['field-bold'] },
    [val]
  )
}

// Formatter templates that frontend config can designate for rendering cell.
const formatters = {
  _d: _default,
  orderedList: (val, item, h) => bullets(val, h, 'ol'),
  unorderedList: (val, item, h) => bullets(val, h, 'ul'),
  timeAgo: componentTemplate(TimeAgo, 'timestamp'),
  checkName: checkName,
  clientName: componentTemplate(ClientName, 'clientName'),
  checkStatus: componentTemplate(CheckStatus, 'status'),
  silenceExpire: componentTemplate(SilenceExpire, null, 'entry'),
  silenceId: componentTemplate(SilenceId, null, 'entry'),
  silenceIdPart: (val, item, h) => bold(val || '(all)', item, h),
  silenceDelete: componentTemplate(SilenceDelete, 'silenceId'),
  clientIsSilenced: (name) => clientStore.getters.clientIsSilenced(name) ? 'Yes' : 'No',
  jsonTree: jsonTreeExpanded,
  jsonTreeExpanded,
  jsonTreeCollapsed,
  commaList: (val) => val.join(', '),
  statusPill,
  changePercentage: (history) => `${round(changeRatio(history) * 100, 0)}%`,
  yesno: (val) => val ? 'Yes' : 'No',
  copyable: componentTemplate(Copyable, 'value'),
  iframe,
  image,
  link,
  keyvals,
  bold,
  clientEventList: componentTemplate(ClientEventList, null, 'client'),
  timestamp: componentTemplate(Timestamp, 'unix'),
  aggregateStates: componentTemplate(AggregateStates, 'results'),
  aggregateName: componentTemplate(AggregateName, 'aggregateName')
}
