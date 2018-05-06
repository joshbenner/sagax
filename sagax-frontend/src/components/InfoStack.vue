<template>
  <div class="info-stack">
    <div v-for="(field, index) in fields"
         v-if="showField(field)"
         :key="`field-${index}`"
         :class="[`info-stack-field-${field.key.replace('.', '_')}`, 'info-stack-field']">
      <label class="info-stack-label">{{ field.label }}</label>
      <span class="info-stack-value" ref="value">
        <Formatter :field="field" :item="item"/>
      </span>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get'
import Formatter from './Formatter'

export default {
  name: 'InfoStack',
  components: {
    Formatter
  },
  props: {
    fields: {
      type: Array,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    skipEmpty: {
      type: Boolean,
      default: true
    },
    showPrefixed: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    showField (field) {
      return this.skipEmpty ? get(this.item, field.key) !== undefined : true
    }
  }
}
</script>

<style lang="scss">
.info-stack {

  .info-stack-field {
    display: table-row;

    & > label, & > span {
      padding: 0.2em 0;
    }

    .info-stack-label {
      display: table-cell;
      text-align: right;
      font-weight: bold;
      white-space: nowrap;
      vertical-align: top;

      &:after {
        content: ':';
        font-weight: bold;
      }
    }

    .info-stack-value {
      display: table-cell;
      padding-left: 0.5em;
      vertical-align: middle;

      ul, ol {
        padding-left: 1.2em;
        margin-bottom: 0;
        line-height: 1.5em;
      }
    }

  }

}
</style>
