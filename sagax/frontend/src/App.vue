<template>
  <div>
    <router-view/>
    <link v-for="(url, idx) in extraCSS"
          :key="`extra-css-${idx}`"
          rel="stylesheet"
          type="text/css"
          :href="url" />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    extraCSS () {
      return this.getConfig('extra_css', [])
    }
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
