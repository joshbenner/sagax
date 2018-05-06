<template>
  <span class="client-name">
    <b-button variant="link"
              v-b-tooltip="silenceTooltip"
              class="client-silence"
              v-if="!silenced"
              @click="showSilenceModal(`client:${clientName}`)">
      <i class="fa fa-lg fa-volume-up"></i>
    </b-button>
    <b-button variant="link"
              class="client-unsilence"
              v-if="silenced"
              @click="showUnsilenceModal(relevantSilenceIds())">
      <i class="fa fa-lg fa-volume-off text-danger"></i>
    </b-button>
    <router-link :to="link" >{{ clientName }}</router-link>
  </span>
</template>

<script>
import { clientSilencedBy } from '../services/silence'

export default {
  name: 'ClientName',
  props: {
    clientName: {
      required: true,
      type: String
    }
  },
  computed: {
    link () {
      return {
        name: 'clientDetail',
        params: {
          clientName: this.clientName
        }
      }
    },
    silenceTooltip () {
      return {
        title: `Silence all checks for ${this.clientName}`,
        placement: 'bottom',
        container: 'body',
        delay: {show: 2000}
      }
    },
    client () {
      return this.$store.getters.getClient(this.clientName)
    },
    silenced () {
      return this.$store.getters.clientIsSilenced(this.clientName)
    }
  },
  methods: {
    relevantSilenceIds () {
      let silences = this.$store.getters.allSilenced.filter((s) => {
        return clientSilencedBy(this.client, s)
      })
      return silences.map((s) => s.id)
    }
  }
}
</script>

<style>
.client-name {
  white-space: nowrap;
}
.client-name button {
  padding: 0 2px 1px 0;
  width: 2em;
}
</style>
