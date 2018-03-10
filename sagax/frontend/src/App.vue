<template>
  <router-view/>
</template>

<script>
import {loadConfig} from './services/config'

export default {
  name: 'App',

  created () {
    loadConfig()
  }
}
</script>

<style lang="scss">
$navbar-brand-logo: url('../static/img/logo.png');
$navbar-brand-minimized-logo: url('../static/img/logo-symbol.png');

@import 'font-awesome/css/font-awesome.min.css';
@import 'simple-line-icons/css/simple-line-icons.css';
@import 'bootstrap-vue/dist/bootstrap-vue.css';
@import 'bootstrap/scss/bootstrap.scss';
@import 'styles/style.scss';
</style>
