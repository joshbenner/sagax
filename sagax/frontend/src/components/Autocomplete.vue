<template>
  <div class="autocomplete">
    <b-input-group>
      <b-form-input v-model="value"
                    ref="input"
                    autocomplete="off"
                    @input="onInput"
                    @click.native="onClickInput"
                    @blur.native="onBlurInput"
                    @keydown.native="keydown"
                    @keydown.native.enter="enter"
                    @keydown.native.down="down"
                    @keydown.native.up="up"
                    :state="state"
                    :placeholder="placeholder"/>
      <b-input-group-append>
        <b-button class="autocomplete-clear fa fa-close"
                  v-if="value.length > 0"
                  tabindex="-1"
                  @click="clearInput"/>
        <b-button @click="clickDropdownButton" variant="primary" tabindex="-1">
          <i class="fa fa-caret-down"></i>
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <div class="dropdown-menu"
         :class="{'show': dropdownVisible}"
         ref="dropdown"
         role="menu">
      <div v-for="(group, groupIndex) in groupedMatches" :key="`group-${groupIndex}`">
        <h6 v-if="group.groupName" class="dropdown-header">{{group.groupName}}</h6>
        <a href="#"
           class="dropdown-item"
           v-for="(item, index) in group.options"
           :class="{'active': suggestionIsActive(item.visibleIndex)}"
           @click="selectSuggestion(item.idx)"
           :key="`item-${groupIndex}-${index}`">
          {{ item.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Autocomplete',
  props: {
    initialValue: {
      type: String,
      default: ''
    },
    suggestions: {
      type: Array,
      required: true
    },
    state: {},
    placeholder: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'initialValue'
  },
  data: function () {
    return {
      value: this.initialValue,
      open: false,
      current: 0,
      blurTimer: null
    }
  },
  watch: {
    initialValue: function (val) {
      this.value = this.initialValue
    }
  },
  computed: {
    normalizedSuggestions () {
      let index = 0
      return this.suggestions.map((opt) => {
        let out = opt
        if (typeof opt === 'string') {
          out = {value: opt, group: ''}
        }
        if (!('label' in out)) {
          out.label = out.value
        }
        out.idx = index++
        return out
      })
    },
    matches () {
      return this.normalizedSuggestions.filter((opt) => {
        return opt.value.toLowerCase().indexOf(this.value.toLowerCase()) >= 0
      })
    },
    groupedMatches () {
      let visibleIndex = 0
      let groups = new Map()
      this.matches.map((opt) => {
        opt.visibleIndex = visibleIndex++
        if (!groups.has(opt.group)) {
          groups.set(opt.group, [])
        }
        groups.get(opt.group).push(opt)
      })
      return Array.from(groups.keys()).sort().map((groupName) => {
        return {
          groupName: groupName,
          options: groups.get(groupName)
        }
      })
    },
    dropdownVisible () {
      return this.matches.length !== 0 &&
             this.open === true
    }
  },
  methods: {
    onInput (value) {
      this.setValue(value)
      this.openDropdown()
    },
    onClickInput () {
      if (!this.open && this.value === '') {
        this.openDropdown()
      }
    },
    onBlurInput (event) {
      this.blurTimer = setTimeout(this.closeDropdown, 200)
    },
    setValue (value) {
      this.$emit('input', value)
    },
    keydown (event) {
      if (event.keyCode === 27) {
        if (this.open) {
          this.closeDropdown()
          event.stopPropagation()
        }
      }
    },
    enter () {
      this.selectSuggestion(this.current)
    },
    up () {
      if (this.current > 0) {
        this.current--
      }
      this.$nextTick(this.scrollToActive)
    },
    down () {
      if (!this.open) {
        this.openDropdown()
      } else if (this.current < this.matches.length - 1) {
        this.current++
      }
      this.$nextTick(this.scrollToActive)
    },
    scrollToActive () {
      let el = this.$refs.dropdown.getElementsByClassName('active')
      if (el.length) {
        el[0].scrollIntoView({block: 'nearest', inline: 'nearest'})
      }
    },
    suggestionIsActive (visibleIndex) {
      return visibleIndex === this.current
    },
    suggestionFromVisibleIndex (visibleIndex) {
      let matches = this.matches.filter((m) => m.visibleIndex === visibleIndex)
      return matches.length ? matches[0] : null
    },
    selectSuggestion (visibleIndex) {
      this.setValue(this.suggestionFromVisibleIndex(visibleIndex).value)
      this.$nextTick(this.closeDropdown)
    },
    openDropdown () {
      this.open = true
      this.current = 0
      this.$refs.input.focus()
    },
    closeDropdown () {
      this.open = false
      if (this.blurTimer !== null) {
        clearTimeout(this.blurTimer)
      }
      this.blurTimer = null
    },
    toggleDropdown () {
      if (this.open) {
        this.closeDropdown()
      } else {
        this.openDropdown()
      }
    },
    clearInput () {
      this.setValue('')
      this.$nextTick(this.closeDropdown)
      this.$refs.input.focus()
    },
    clickDropdownButton () {
      if (this.blurTimer !== null) {
        clearTimeout(this.blurTimer)
        this.blurTimer = null
      }
      this.toggleDropdown()
    }
  }
}
</script>

<style lang="scss">
@import '../styles/bootstrap-variables';

.autocomplete {
  position: relative;

  input {
    border-right: none;

    &:focus {
      box-shadow: none;
      border-color: $gray-200;
    }
  }

  .input-group:focus-within {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  .dropdown-menu {
    width: 100%;
    max-height: 300px;
    overflow: auto;
  }

  .autocomplete-clear {
    background: transparent;
    border-left: none;
    border-color: $gray-200;
  }
}
</style>
