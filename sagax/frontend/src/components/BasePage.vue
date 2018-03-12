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
import AppHeader from '../components/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import AppAside from '../components/Aside'
import AppFooter from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import SilenceModal from '../components/SilenceModal'

export default {
  name: 'full',
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
  }
}
</script>
