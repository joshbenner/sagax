<template>
  <b-card class="client-info-panel">
    <div slot="header">
      <h2>{{ clientName }}</h2>
      <b-dropdown split variant="primary" size="sm" @click="silenceToggleClicked">
        <span slot="button-content" v-if="silenced">
          <i class="fa fa-volume-off"></i>
          Unsilence
        </span>
        <span slot="button-content" v-else>
          <i class="fa fa-volume-up"></i>
          Silence
        </span>
        <b-dropdown-item>
          <i class="fa fa-trash"></i>
          Delete
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <info-stack v-if="client" :fields="fields" :item="client" />
  </b-card>
</template>

<script>
import { clientSilencedBy } from '../services/silence'

export default {
  name: 'ClientInfoPanel',
  props: {
    clientName: {
      type: String,
      required: true
    }
  },
  computed: {
    client () {
      return this.$store.getters.getClient(this.clientName)
    },
    silenced () {
      return this.$store.getters.clientIsSilenced(this.clientName)
    },
    fields () {
      return this.getConfig('fields.client_detail', [])
    },
    clientInfo () {
      return [
        {}
      ]
    }
  },
  methods: {
    relevantSilenceIds () {
      let silences = this.$store.getters.allSilenced.filter((s) => {
        return clientSilencedBy(this.client, s)
      })
      return silences.map((s) => s.id)
    },
    silenceToggleClicked () {
      if (this.silenced) {
        this.showUnsilenceModal(this.relevantSilenceIds())
      } else {
        this.showSilenceModal(this.clientName)
      }
    }
  }
}
</script>

<style lang="scss">
.client-info-panel {
  .card-header {
    h2 {
      font-size: 1.6em;
      margin: 0;
      display: inline;
    }
    .dropdown {
      float: right;
    }
  }
}
</style>
