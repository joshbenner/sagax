<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="/events"/>
    <button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" type="button" @click="sidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-navbar-nav class="ml-auto" v-if="loggedIn" @click="logout">
      <b-nav-item>
        <i class="fa fa-lock"></i> Logout
      </b-nav-item>
      <b-nav-item disabled>
        <v-gravatar :email="email" class="img-avatar"/>
      </b-nav-item>
    </b-navbar-nav>
  </header>
</template>

<script>
import auth from '../services/auth'

export default {
  name: 'Header',
  methods: {
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    },
    logout () {
      this.$store.dispatch('logout')
    }
  },
  computed: {
    loggedIn: function () {
      return auth.isAuthenticated()
    },
    email: function () {
      return this.$store.state.user.email || ''
    }
  }
}
</script>
