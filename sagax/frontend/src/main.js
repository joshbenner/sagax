// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'

import { configMixin } from './services/config'
import silenceMixin from './services/silence'

import bRow from 'bootstrap-vue/es/components/layout/row'
import bCol from 'bootstrap-vue/es/components/layout/col'
import bButton from 'bootstrap-vue/es/components/button/button'
import bBadge from 'bootstrap-vue/es/components/badge/badge'
import bLink from 'bootstrap-vue/es/components/link/link'
import bTable from 'bootstrap-vue/es/components/table/table'
import bCard from 'bootstrap-vue/es/components/card/card'
import bCardBody from 'bootstrap-vue/es/components/card/card-body'
import bModal from 'bootstrap-vue/es/components/modal/modal'
import bModalDirective from 'bootstrap-vue/es/directives/modal/modal'
import bForm from 'bootstrap-vue/es/components/form/form'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import bInputGroup from 'bootstrap-vue/es/components/input-group/input-group'
import bInputGroupText from 'bootstrap-vue/es/components/input-group/input-group-text'
import bInputGroupPrepend from 'bootstrap-vue/es/components/input-group/input-group-prepend'
import bInputGroupAppend from 'bootstrap-vue/es/components/input-group/input-group-append'
import bFormRadioGroup from 'bootstrap-vue/es/components/form-radio/form-radio-group'
import bFormRadio from 'bootstrap-vue/es/components/form-radio/form-radio'
import bSelect from 'bootstrap-vue/es/components/form-select/form-select'
import bCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
import bNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav'
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'
import bNavItemDropdown from 'bootstrap-vue/es/components/nav/nav-item-dropdown'
import vBToolTip from 'bootstrap-vue/es/directives/tooltip/tooltip'
import Multiselect from 'vue-multiselect'
import Autocomplete from './components/Autocomplete'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import Notifications from 'vue-notification'
import Gravatar from 'vue-gravatar'
import { ClientTable } from 'vue-tables-2'
import STable from './components/STable'
import ClientInfoPanel from './components/ClientInfoPanel'

Vue.use(Vuex)
Vue.use(Notifications)
Vue.use(ClientTable, {}, false, 'bootstrap4')

Vue.component('b-row', bRow)
Vue.component('b-col', bCol)
Vue.component('b-button', bButton)
Vue.component('b-badge', bBadge)
Vue.component('b-link', bLink)
Vue.component('b-table', bTable)
Vue.component('b-card', bCard)
Vue.component('b-card-body', bCardBody)
Vue.component('b-modal', bModal)
Vue.directive('b-modal', bModalDirective)
Vue.component('b-form', bForm)
Vue.component('b-form-group', bFormGroup)
Vue.component('b-form-input', bFormInput)
Vue.component('b-input-group', bInputGroup)
Vue.component('b-input-group-text', bInputGroupText)
Vue.component('b-input-group-prepend', bInputGroupPrepend)
Vue.component('b-input-group-append', bInputGroupAppend)
Vue.component('b-form-radio', bFormRadio)
Vue.component('b-form-radio-group', bFormRadioGroup)
Vue.component('b-form-select', bSelect)
Vue.component('b-form-checkbox', bCheckbox)
Vue.component('multiselect', Multiselect)
Vue.component('autocomplete', Autocomplete)
Vue.component('flat-pickr', flatPickr)
Vue.component('b-navbar-nav', bNavbarNav)
Vue.component('b-nav-item', bNavItem)
Vue.component('b-nav-item-dropdown', bNavItemDropdown)
Vue.component('v-gravatar', Gravatar)
Vue.directive('b-tooltip', vBToolTip)
Vue.component('client-info-panel', ClientInfoPanel)

Vue.component('s-table', STable)

Vue.config.productionTip = false

Vue.mixin(configMixin)
Vue.mixin(silenceMixin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    return this.$store.dispatch('loadConfig')
  }
})
