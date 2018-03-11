<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
  created () {
    let seconds = this.getConfig('refresh_interval', 5)
    this.timer = setInterval(
      () => this.$store.dispatch('refreshAll'),
      seconds * 1000
    )
    this.$store.dispatch('refreshAll')
  },
  beforeDestroy () {
    clearInterval(this.timer)
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
@import 'vue-multiselect/dist/vue-multiselect.min.css';
@import 'styles/style.scss';
</style>
