<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <b-card no-body class="p-4">
            <b-card-body>
              <h2>Login</h2>
              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-user"></i></b-input-group-text>
                </b-input-group-prepend>
                <b-form-input placeholder="Username" v-model="username"/>
              </b-input-group>
              <b-input-group class="mb-4">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                </b-input-group-prepend>
                <b-form-input type="password" placeholder="Password" v-model="password"/>
              </b-input-group>
              <b-row>
                <b-col cols="6">
                  <b-button variant="primary" class="px-4" @click="login">Login</b-button>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data: function () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      let creds = {username: this.username, password: this.password}
      this.$store.dispatch('login', creds)
    }
  }
}
</script>
