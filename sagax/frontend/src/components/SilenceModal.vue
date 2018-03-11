<template>
  <b-modal id="silenceModal" title="Silence Events">
    <b-form @submit="onSubmit">
      <b-form-group label="Client or Subscription"
                    label-for="silenceSub"
                    description="Client or subscription to be silenced">
        <autocomplete id="silenceSub"
                      :suggestions="clientSuggestions"
                      v-model="client"/>
      </b-form-group>
      <b-form-group label="Check to Silence"
                    label-for="silenceCheck"
                    description="Check to be silenced on client(s)">
        <autocomplete id="silenceCheck"
                      :suggestions="checkSuggestions"
                      v-model="check"/>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import capitalize from 'lodash/capitalize'

export default {
  name: 'SilenceModal',
  data: function () {
    return {
      client: '',
      check: ''
    }
  },
  computed: {
    clientSuggestions: function () {
      return Array.from(this.$store.getters.allSubsInfo).map((opt) => {
        return {
          value: opt.id,
          label: opt.name,
          group: capitalize(opt.type) + 's'
        }
      })
    },
    checkSuggestions: function () {
      return []
    }
  },
  methods: {
    onSubmit: function () {
      return 1
    }
  }
}
</script>
