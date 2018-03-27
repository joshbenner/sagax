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
    <b-modal id="confirm-client-delete"
             ref="clientDeleteModal"
             :title="`Confirm delete client ${deleteClientName}?`"
             ok-title="Delete Client"
             @ok="deleteClientConfirmed(deleteClientName)">
      Are you sure you want to delete {{ deleteClientName }}?
    </b-modal>
    <b-modal id="confirm-result-delete"
             ref="resultDeleteModal"
             size="lg"
             :title="`Confirm delete result for ${deleteClientName} / ${deleteCheckName}`"
             ok-title="Delete Result"
             @ok="deleteResultConfirmed(deleteClientName, deleteCheckName)">
      <p>Are you sure you want to delete the result for
        {{ deleteClientName }} / {{ deleteCheckName }}?</p>
      <p>If the check is still active, this result will reappear.</p>
    </b-modal>
    <b-modal id="raw-viewer"
             ref="rawViewer"
             size="lg"
             :title="`Raw data for ${rawType} ${rawName}`"
             :ok-only="true">
      <pre v-highlightjs="JSON.stringify(rawData, null, 2)"><code class="JSON"></code></pre>
    </b-modal>
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
      silenceIdsToDelete: [],
      deleteClientName: '',
      deleteCheckName: '',
      rawType: '',
      rawName: '',
      rawData: {}
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
    bus.$on('show-client-delete-modal', this.showClientDeleteModal)
    bus.$on('show-result-delete-modal', this.showResultDeleteModal)
    bus.$on('show-raw', this.showRawModal)
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
    },
    showClientDeleteModal (clientName) {
      this.deleteClientName = clientName
      this.$refs.clientDeleteModal.show()
    },
    showResultDeleteModal (clientName, checkName) {
      this.deleteClientName = clientName
      this.deleteCheckName = checkName
      this.$refs.resultDeleteModal.show()
    },
    showRawModal (type, name, data) {
      this.rawType = type
      this.rawName = name
      this.rawData = data
      this.$refs.rawViewer.show()
    }
  }
}
</script>
