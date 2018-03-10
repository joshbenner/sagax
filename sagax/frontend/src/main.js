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

Vue.use(Vuex)

Vue.component('b-button', bButton)
Vue.component('b-badge', bBadge)
Vue.component('b-link', bLink)
Vue.component('b-table', bTable)
Vue.component('b-card', bCard)

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
