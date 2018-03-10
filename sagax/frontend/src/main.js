// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import bButton from 'bootstrap-vue/es/components/button/button'
import bBadge from 'bootstrap-vue/es/components/badge/badge'
import bLink from 'bootstrap-vue/es/components/link/link'

Vue.component('b-button', bButton)
Vue.component('b-badge', bBadge)
Vue.component('b-link', bLink)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
