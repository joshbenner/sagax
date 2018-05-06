<template>
  <b-modal id="silenceModal"
           ref="modal"
           title="Silence Events"
           centered
           ok-title="Create Entry"
           @ok="createEntry"
           @shown="onShown">
    <b-form>
      <b-form-group label="Reason for Silencing"
                    label-for="silenceReason">
        <b-form-input v-model="reason"
                      type="text"
                      ref="reasonInput"
                      placeholder="Enter a reason for silencing"/>
      </b-form-group>

      <b-form-group label="Subscription"
                    label-for="silenceSub">
        <autocomplete id="silenceSub"
                      :suggestions="clientSuggestions"
                      v-model="subscription"
                      ref="subscription"
                      placeholder="Select or enter a subscription to silence"/>
      </b-form-group>

      <b-form-group label="Check"
                    label-for="silenceCheck">
        <autocomplete id="silenceCheck"
                      :suggestions="checkSuggestions"
                      v-model="check"
                      ref="check"
                      placeholder="Select or enter the check to silence"/>
      </b-form-group>

      <b-card header="Timing" class="timing-form-group">

        <b-form-group horizontal
                      label="Begins:"
                      label-for="silenceBegins">
          <b-form-input v-if="!useBegin"
                        plaintext
                        tabindex="-1"
                        value="Immediately"
                        class="begin-immediately"/>
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
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
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

const allSubscriptions = [{value: '*', label: 'All Clients', group: 'Clients'}]
const allChecks = [{value: '*', label: 'All Checks', group: 'Checks'}]

export default {
  name: 'SilenceModal',
  props: {
    initialSubscription: String,
    initialCheck: String
  },
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
      let subs = sortBy(Array.from(this.$store.getters.allSubsInfo).map((opt) => {
        return {
          value: opt.id,
          label: opt.name,
          group: capitalize(opt.type) + 's'
        }
      }), ['group', 'value'])
      return allSubscriptions.concat(subs)
    },
    relevantResults () {
      if (this.subscription.startsWith('client:')) {
        let client = this.subscription.split(':', 2)[1]
        return this.allResults.filter((r) => r.client === client)
      } else if (this.subscription === '' || this.subscription === '*') {
        return this.allResults
      } else {
        return this.allResults.filter((r) =>
          get(r, 'check.subscribers', []).includes(this.subscription))
      }
    },
    checkSuggestions: function () {
      return sortBy(uniqBy(allChecks.concat(this.relevantResults.map((r) => {
        return {
          value: r.check.name,
          label: r.check.name,
          group: 'Checks'
        }
      })), (v) => v.value), ['group', 'label'])
    }
  },
  methods: {
    show: function () {
      this.$refs.modal.show()
    },
    onShown: function () {
      api.allResults((results) => {
        this.allResults = results
      })
      if (this.expireAfterTime === '') {
        this.expireAfterTime = this.getConfig('silence_interval_default', '2 hours')
      }
      this.resetForm()
      this.$nextTick(() => {
        this.$refs.subscription.closeDropdown()
        this.$refs.check.closeDropdown()
        this.$refs.reasonInput.focus()
      })
    },
    resetForm: function () {
      Object.assign(this.$data, defaultData())
      this.subscription = this.initialSubscription
      this.check = this.initialCheck
    },
    // Build it at submit-time rather than generate. Saves cycles, and assures
    // that times are calculate when the button is pressed.
    buildSilencedEntry: function () {
      let silenced = {
        reason: this.reason,
        creator: this.$store.getters.username
      }
      let sub = this.subscription.trim()
      let check = this.check.trim()
      if (this.useBegin) {
        silenced.begin = moment(this.expireBeginDateTime).unix()
      }
      if (sub !== '' && sub !== '*') {
        silenced.subscription = this.subscription
      }
      if (check !== '' && check !== '*') {
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
      api.postSilenced(silenced).then((r) => {
        if (r.status === 201) {
          this.$notify({
            group: 'main',
            type: 'success',
            title: 'Silence entry created',
            text: 'The silence entry was succesfully created in Sensu'
          })
          this.$store.dispatch('getSilenced', {force: true})
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
