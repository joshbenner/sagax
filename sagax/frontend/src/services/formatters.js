import get from 'lodash/get'
import merge from 'lodash/merge'
import keys from 'lodash/keys'

import ClientName from '../components/ClientName'
import CheckName from '../components/CheckName'
import CheckStatus from '../components/CheckStatus'
import TimeAgo from '../components/TimeAgo'
import SilenceExpire from '../components/SilenceExpire'
import SilenceId from '../components/SilenceId'
import SilenceDelete from '../components/SilenceDelete'

import clientStore from '../store/clients'

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
  return h(type, {}, val.map((v) => h('li', {}, [v])))
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
  if (itemKeys.includes('check') && itemKeys.includes('client')) {
    // This is a result item.
    return h(
      CheckName,
      { props: { clientName: item.client, check: item.check } }
    )
  }
}

// Formatter templates that frontend config can designate for rendering cell.
const formatters = {
  _d: (val) => val,
  orderedList: (val, item, h) => bullets(val, h, 'ol'),
  unorderedList: (val, item, h) => bullets(val, h, 'ul'),
  timeAgo: componentTemplate(TimeAgo, 'timestamp'),
  checkName: checkName,
  clientName: componentTemplate(ClientName, 'clientName'),
  checkStatus: componentTemplate(CheckStatus, 'status'),
  silenceExpire: componentTemplate(SilenceExpire, null, 'entry'),
  silenceId: componentTemplate(SilenceId, null, 'entry'),
  silenceIdPart: (val) => val || '(all)',
  silenceDelete: componentTemplate(SilenceDelete, 'silenceId'),
  clientIsSilenced: (name) => clientStore.getters.clientIsSilenced(name) ? 'Yes' : 'No',
  jsonTree: jsonTreeExpanded,
  jsonTreeExpanded,
  jsonTreeCollapsed
}
