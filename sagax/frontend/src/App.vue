<template>
  <div id="app">
    <page-header/>
    <navigation/>
    <router-view/>
  </div>
</template>

<script>
import {loadConfig} from './services/config'
import PageHeader from './components/PageHeader'
import Navigation from './components/Navigation'

export default {
  name: 'App',
  components: {
    PageHeader,
    Navigation
  },

  created () {
    loadConfig()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
