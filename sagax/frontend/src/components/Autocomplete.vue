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
                  @click="clearInput"/>
        <b-button @click="clickDropdownButton" variant="primary">
          <i class="fa fa-caret-down"></i>
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <div class="dropdown-menu" :class="{'show': dropdownVisible}" role="menu">
      <div v-for="(group, groupIndex) in groupedMatches" :key="`group-${groupIndex}`">
        <h6 v-if="group.groupName" class="dropdown-header">{{group.groupName}}</h6>
        <a href="#"
           class="dropdown-item"
           v-for="(item, index) in group.options"
           :class="{'active': suggestionIsActive(item.idx)}"
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
    value: {
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
  data: function () {
    return {
      open: false,
      current: 0,
      blurTimer: null
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
      let groups = new Map()
      this.matches.map((opt) => {
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
      } else if (this.open === false) {
        this.openDropdown()
      }
    },
    enter () {
      this.selectSuggestion(this.current)
    },
    up () {
      if (this.current > 0) {
        this.current--
      }
    },
    down () {
      if (this.current < this.matches.length - 1) {
        this.current++
      }
    },
    suggestionIsActive (index) {
      return index === this.current
    },
    selectSuggestion (index) {
      this.setValue(this.normalizedSuggestions[index].value)
      this.closeDropdown()
    },
    openDropdown () {
      this.open = true
      this.current = 0
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
      this.closeDropdown()
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

<style scoped>
  .autocomplete {
    position: relative;
  }
  .dropdown-menu {
    width: 100%;
    max-height: 500px;
    overflow: auto;
  }
</style>
