import { getFormatter } from '../services/formatters'

export default {
  name: 'Formatter',
  props: {
    field: {
      required: true,
      type: Object
    },
    item: {
      required: true,
      type: Object
    }
  },
  render (h) {
    let formatted = getFormatter(this.field)(this.item, h)
    let VNode = this.$vnode.constructor
    return formatted instanceof VNode ? formatted : this._v(formatted)
  }
}
