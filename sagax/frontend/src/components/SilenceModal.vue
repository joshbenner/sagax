<template>
  <b-modal id="silenceModal"
           title="Silence Events"
           centered
           ok-title="Create Entry"
           @ok="createEntry"
           @show="showModal">
    <b-form>
      <b-form-group label="Reason for Silencing"
                    label-for="silenceReason">
        <b-form-input v-model="reason"
                      type="text"
                      placeholder="Enter a reason for silencing"/>
      </b-form-group>

      <b-form-group label="Subscription"
                    label-for="silenceSub">
        <autocomplete id="silenceSub"
                      :suggestions="clientSuggestions"
                      v-model="subscription"
                      placeholder="Select or enter a subscription to silence"/>
      </b-form-group>

      <b-form-group label="Check"
                    label-for="silenceCheck">
        <autocomplete id="silenceCheck"
                      :suggestions="checkSuggestions"
                      v-model="check"
                      placeholder="Select or enter the check to silence"/>
      </b-form-group>

      <b-card header="Timing" class="timing-form-group">

        <b-form-group horizontal
                      label="Begins:"
                      label-for="silenceBegins">
          <b-form-input v-if="!useBegin" plaintext value="Immediately" class="begin-immediately"/>
          <b-button v-if="!useBegin"
                    variant="secondary"
                    @click="useBegin = true">
            <i class="fa fa-clock-o"></i>
            Schedule
          </b-button>
          <b-input-group>
            <flat-pickr v-if="useBegin"
                        v-model="expireBeginDateTime"
                        :config="beginPickrConfig"
                        class="form-control"
                        id="silenceBegins"
                        placeholder="Select date/time"/>
            <b-input-group-append>
              <b-button v-if="useBegin"
                        variant="danger"
                        @click="useBegin = false">
                <i class="fa fa-close"></i>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group horizontal
                      label="Expires:"
                      label-for="silenceExpireMode">
          <b-form-select id="silenceExpireMode"
                         v-model="expireMode"
                         :options="expireModes"
                         :select-size="1" />
        </b-form-group>

        <b-form-group v-if="expireMode === 'after'"
                      horizontal
                      label="After:"
                      label-for="silenceExpireAfter"
                      description="A duration of time. Examples: 10m, 3 days, 2 hours">
          <autocomplete v-model="expireAfterTime"
                        :suggestions="expireAfterTimeSuggestions"
                        :state="expireAfterTimeValid"/>
        </b-form-group>

        <b-form-group v-if="expireMode === 'at'"
                      horizontal
                      label="On date/time:"
                      label-for="silencedExpireAt">
          <flat-pickr v-model="expireDateTime"
                      :config="expirePickrConfig"
                      class="form-control"
                      id="silenceExpireAt"
                      placeholder="Select date/time"/>
        </b-form-group>
      </b-card>
    </b-form>
  </b-modal>
</template>

<script>
import capitalize from 'lodash/capitalize'
import api from '../services/api'
import parseDuration from 'parse-duration'
import moment from 'moment'

function defaultData () {
  return {
    subscription: '',
    check: '',
    useBegin: false,
    expireBeginDateTime: '',
    expireMode: 'resolve',
    expireModes: [
      { value: 'resolve', text: 'When check resolves' },
      { value: 'after', text: 'After interval of time' },
      { value: 'at', text: 'At a specific time' },
      { value: 'never', text: 'Never (remove manually)' }
    ],
    expireAfterTime: '',
    expireDateTime: null,
    allResults: [],
    beginPickrConfig: {
      dateFormat: 'Y-m-d H:i',
      enableTime: true,
      static: true,
      allowInput: true,
      wrap: true
    },
    expirePickrConfig: {
      dateFormat: 'Y-m-d H:i',
      enableTime: true,
      static: true,
      allowInput: true
    },
    reason: ''
  }
}

export default {
  name: 'SilenceModal',
  data: defaultData,
  computed: {
    expireAfterTimeSuggestions: function () {
      return this.getConfig('silence_intervals', [
        '15 minutes',
        '1 hour',
        '1 day'
      ])
    },
    expireAfterTimeSeconds: function () {
      return parseDuration(this.expireAfterTime) / 1000
    },
    expireAfterTimeValid: function () {
      return this.expireAfterTimeSeconds >= 1
    },
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
      if (this.subscription.startsWith('client:')) {
        let client = this.subscription.split(':', 2)[1]
        let clientResults = this.allResults.filter((r) => r.client === client)
        return clientResults.map((r) => {
          return {
            value: r.check.name,
            label: r.check.name,
            group: 'Checks'
          }
        })
      }
      return []
    }
  },
  methods: {
    showModal: function () {
      api.allResults((results) => {
        this.allResults = results
      })
      if (this.expireAfterTime === '') {
        this.expireAfterTime = this.getConfig('silence_interval_default', '2 hours')
      }
    },
    resetForm: function () {
      Object.assign(this.$data, defaultData())
    },
    // Build it at submit-time rather than generate. Saves cycles, and assures
    // that times are calculate when the button is pressed.
    buildSilencedEntry: function () {
      let silenced = {
        reason: this.reason
      }
      if (this.useBegin) {
        silenced.begin = moment(this.expireBeginDateTime).unix()
      }
      if (this.subscription.trim() !== '') {
        silenced.subscription = this.subscription
      }
      if (this.check.trim() !== '') {
        silenced.check = this.check
      }
      switch (this.expireMode) {
        case 'resolve':
          silenced.expire_on_resolve = true
          break
        case 'after':
          silenced.expire = this.expireAfterTimeSeconds
          break
        case 'at':
          silenced.expire = moment(this.expireDateTime).unix() - moment().unix()
          break
      }
      return silenced
    },
    createEntry: function () {
      let silenced = this.buildSilencedEntry()
      console.log(silenced)
      api.postSilenced(silenced).then((r) => {
        if (r.status === 201) {
          this.$notify({
            group: 'main',
            type: 'success',
            title: 'Silence entry created',
            text: 'The silence entry was succesfully created in Sensu'
          })
        } else {
          console.log(r)
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Error creating silence entry',
            text: 'Something went wrong. See the console for more info.'
          })
        }
      })
      this.resetForm()
    }
  }
}
</script>

<style>
.timing-form-group .form-row label {
  text-align: right;
}
.timing-form-group .begin-immediately {
  display: inline-block;
  width: 7em;
  margin: 0;
}
</style>
