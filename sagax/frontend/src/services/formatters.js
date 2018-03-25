import ClientName from '../components/ClientName'
import CheckStatus from '../components/CheckStatus'
import TimeAgo from '../components/TimeAgo'
import SilenceExpire from '../components/SilenceExpire'
import SilenceId from '../components/SilenceId'
import SilenceDelete from '../components/SilenceDelete'

import clientStore from '../store/clients'

function componentTemplate (component, valProp, itemProp) {
  return function (val, h, row, index) {
    let data = {
      props: {
        row: row,
        index: index
      }
    }
    if (valProp !== null) {
      data.props[valProp || 'val'] = val
    }
    if (typeof itemProp !== 'undefined') {
      data.props[itemProp] = row._item
    }
    return h(component, data)
  }
}

function bullets (val, h, type) {
  return h(type, {}, val.map((v) => h('li', {}, [v])))
}

// Formatter templates that frontend config can designate for rendering cell.
export default {
  _d: (val) => val,
  orderedList: (val, h) => bullets(val, h, 'ol'),
  unorderedList: (val, h) => bullets(val, h, 'ul'),
  timeAgo: componentTemplate(TimeAgo, 'timestamp'),
  checkName: (val) => val,
  clientName: componentTemplate(ClientName, 'clientName'),
  checkStatus: componentTemplate(CheckStatus, 'status'),
  silenceExpire: componentTemplate(SilenceExpire, null, 'entry'),
  silenceId: componentTemplate(SilenceId, null, 'entry'),
  silenceIdPart: (val) => val || '(all)',
  silenceDelete: componentTemplate(SilenceDelete, 'silenceId'),
  clientIsSilenced: (name) => clientStore.getters.clientIsSilenced(name) ? 'Yes' : 'No'
}
