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
    <SilenceModal ref="silenceModal"
                  :initialSubscription="silenceSubscription"
                  :initialCheck="silenceCheck"/>
    <UnsilenceModal ref="unsilenceModal"
                    :silenceIds="silenceIdsToDelete"/>
    <notifications group="main"/>
  </div>
</template>

<script>
import nav from '../_nav'
import auth from '../services/auth'
import bus from '../services/bus'

import AppHeader from '../components/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import AppAside from '../components/Aside'
import AppFooter from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import SilenceModal from '../components/SilenceModal'
import UnsilenceModal from '../components/UnsilenceModal'

export default {
  name: 'BasePage',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb,
    SilenceModal,
    UnsilenceModal
  },
  data () {
    return {
      nav: nav.items,
      silenceSubscription: '',
      silenceCheck: '',
      silenceIdsToDelete: []
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
  mounted () {
    bus.$on('show-silence-modal', this.showSilenceModal)
    bus.$on('show-unsilence-modal', this.showUnsilenceModal)
  },
  created () {
    let authenticated = auth.isAuthenticated()
    if (authenticated) {
      this.$store.commit('loggedIn', auth.getDecodedAuthToken())
    }
    if (!this.getConfig('require_authentication') || authenticated) {
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
    },
    showSilenceModal (subscription, check) {
      this.silenceSubscription = subscription || ''
      this.silenceCheck = check || ''
      this.$refs.silenceModal.show()
    },
    showUnsilenceModal (silenceIds) {
      this.silenceIdsToDelete = silenceIds
      this.$refs.unsilenceModal.show()
    }
  }
}
</script>
