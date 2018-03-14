<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <SilenceModal/>
    <notifications group="main"/>
  </div>
</template>

<script>
import nav from '../_nav'
import auth from '../services/auth'

import AppHeader from '../components/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import AppAside from '../components/Aside'
import AppFooter from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import SilenceModal from '../components/SilenceModal'

export default {
  name: 'BasePage',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb,
    SilenceModal
  },
  data () {
    return {
      nav: nav.items
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  },
  created () {
    if (!this.getConfig('require_authentication') || auth.isAuthenticated()) {
      this.startRefresh()
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    startRefresh () {
      let seconds = this.getConfig('refresh_interval', 5)
      this.timer = setInterval(
        () => this.$store.dispatch('refreshAll'),
        seconds * 1000
      )
      this.$store.dispatch('refreshAll')
    }
  }
}
</script>
