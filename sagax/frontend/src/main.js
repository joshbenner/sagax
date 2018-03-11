// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'

import { timeMixin } from './services/time'
import { configMixin } from './services/config'

import bButton from 'bootstrap-vue/es/components/button/button'
import bBadge from 'bootstrap-vue/es/components/badge/badge'
import bLink from 'bootstrap-vue/es/components/link/link'
import bTable from 'bootstrap-vue/es/components/table/table'
import bCard from 'bootstrap-vue/es/components/card/card'
import bModal from 'bootstrap-vue/es/components/modal/modal'
import bModalDirective from 'bootstrap-vue/es/directives/modal/modal'
import bForm from 'bootstrap-vue/es/components/form/form'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import bInputGroup from 'bootstrap-vue/es/components/input-group/input-group'
import bInputGroupAppend from 'bootstrap-vue/es/components/input-group/input-group-append'
import Multiselect from 'vue-multiselect'
import Autocomplete from './components/Autocomplete'

Vue.use(Vuex)

Vue.component('b-button', bButton)
Vue.component('b-badge', bBadge)
Vue.component('b-link', bLink)
Vue.component('b-table', bTable)
Vue.component('b-card', bCard)
Vue.component('b-modal', bModal)
Vue.directive('b-modal', bModalDirective)
Vue.component('b-form', bForm)
Vue.component('b-form-group', bFormGroup)
Vue.component('b-form-input', bFormInput)
Vue.component('b-input-group', bInputGroup)
Vue.component('b-input-group-append', bInputGroupAppend)
Vue.component('multiselect', Multiselect)
Vue.component('autocomplete', Autocomplete)

Vue.config.productionTip = false

Vue.mixin(timeMixin)
Vue.mixin(configMixin)

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
