<script>
import get from 'lodash/get'
import formatters from '../services/formatters'

function renderItemField (item, field, h) {
  let formatter = get(formatters, get(field, 'formatter', '_d'), formatters._d)
  return h(
    'div',
    { class: { 'info-stack-field': true } },
    [
      h(
        'label',
        { class: { 'info-stack-label': true } },
        [field.label ? field.label : '']
      ),
      h(
        'span',
        { class: { 'info-stack-value': true } },
        [formatter(item[field.key], h, {_item: item}, 0)]
      )
    ]
  )
}

export default {
  name: 'InfoStack',
  props: {
    fields: {
      type: Array,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  render: function (h) {
    return h(
      'div',
      { class: { 'info-stack': true } },
      this.fields.map((f) => renderItemField(this.item, f, h))
    )
  }
}
</script>

<style lang="scss">
.info-stack {
  line-height: 2em;

  .info-stack-field {
    display: table-row;

    .info-stack-label {
      display: table-cell;
      text-align: right;
      font-weight: bold;

      &:after {
        content: ':';
        font-weight: bold;
      }
    }

    .info-stack-value {
      display: table-cell;
      padding-left: 0.5em;

      ul, ol {
        padding-left: 1.2em;
        margin-bottom: 0;
        line-height: 1.5em;
      }
    }

  }

}
</style>
