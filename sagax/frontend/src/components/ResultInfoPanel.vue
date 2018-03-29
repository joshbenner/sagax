<template>
  <b-card class="result-info-panel">
    <div slot="header">
      <h2>
        <i class="fa" :class="headingIconClasses"></i>
        {{ checkName }}
      </h2>
      <b-dropdown split variant="primary" size="sm" @click="silenceToggleClicked">
        <span slot="button-content" v-if="silenced">
          <i class="fa fa-volume-off"></i>
          Unsilence
        </span>
        <span slot="button-content" v-else>
          <i class="fa fa-volume-up"></i>
          Silence
        </span>

        <b-dropdown-item @click="deleteResult(clientName, checkName)">
          <i class="fa fa-trash"></i>
          Delete Result
        </b-dropdown-item>

        <b-dropdown-item @click="showRaw('result', `${clientName}/${checkName}`, result)">
          View Raw Result
        </b-dropdown-item>

        <b-dropdown-item v-if="event"
                         @click="showRaw('event', `${clientName}/${checkName}`, event)">
          View Raw Event
        </b-dropdown-item>

        <b-dropdown-item v-if="!standalone" @click="requestCheckClicked">
          Request Check
        </b-dropdown-item>

        <b-dropdown-item v-if="event" @click="resolveEvent(clientName, checkName)">
          Force Resolve
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <h3 v-if="result">Result Info</h3>
    <info-stack v-if="result"
                :fields="resultFields"
                :item="resultTokenized"/>

    <h3 v-if="event">Event Info</h3>
    <info-stack v-if="event"
                :fields="eventFields"
                :item="event"/>
  </b-card>
</template>

<script>
import { tokenReplace } from '../services/tokens'
import get from 'lodash/get'

export default {
  name: 'ResultInfoPanel',
  props: {
    clientName: {
      type: String,
      required: true
    },
    checkName: {
      type: String,
      required: true
    }
  },
  computed: {
    client () {
      return this.$store.getters.getClient(this.clientName)
    },
    relevantSilenceIds () {
      let silences = this.$store.getters.silencesForCheck(this.clientName, this.checkName)
      return silences.map((s) => s.id)
    },
    silenced () {
      return this.checkName ? (this.relevantSilenceIds.length > 0) : false
    },
    event () {
      return this.$store.getters.getEvent(this.clientName, this.checkName)
    },
    eventFields () {
      return this.getConfig('fields.result_detail_event', [])
    },
    result () {
      return this.$store.getters.getResult(this.clientName, this.checkName)
    },
    resultTokenized () {
      return tokenReplace(this.result)
    },
    resultFields () {
      return this.getConfig('fields.result_detail_result', [])
    },
    standalone () {
      return get(this.result, 'check.standalone', false)
    },
    headingIconClasses () {
      let status = this.result && this.result.check.status
      return {
        'status-ok': status === 0,
        'fa-check-circle': status === 0,
        'status-warn': status === 1,
        'fa-exclamation-triangle': status === 1,
        'status-crit': status === 2,
        'fa-times-circle': status === 2,
        'status-unknown': ![0, 1, 2].includes(status),
        'fa-question-circle': ![0, 1, 2].includes(status)
      }
    }
  },
  methods: {
    silenceToggleClicked () {
      if (this.silenced) {
        this.showUnsilenceModal(this.relevantSilenceIds)
      } else {
        this.showSilenceModal(`client:${this.clientName}:${this.checkName}`)
      }
    },
    requestCheckClicked () {
      this.requestCheck(this.checkName, [`client:${this.clientName}`])
    }
  },
  created () {
    if (this.clientName) {
      this.$store.dispatch('getClientResults', this.clientName)
    }
    this.$store.commit('setResultClientToRefresh', this.clientName)
  },
  beforeRouteUpdate () {
    if (this.clientName) {
      this.$store.dispatch('getClientResults', this.clientName)
    }
  },
  updated () {
    this.$store.commit('setResultClientToRefresh', this.clientName)
  }
}
</script>

<style lang="scss">
@import '../styles/core-variables';

.result-info-panel {
  h3 {
    font-size: 1.4em;
  }

  .info-stack {
    margin-bottom: 1.2em;
  }

  .status-ok {
    color: $green;
  }
  .status-warn {
    color: $yellow;
  }
  .status-crit {
    color: $red;
  }
  .status-unknown {
    color: $purple;
  }

  .info-stack-field-check_command .info-stack-value {
    font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }
}
</style>
