<template>
  <b-row class="aggregate-page">
    <b-col lg="12" xl="4">
      <b-card class="aggregate-info-panel">
        <div slot="header">
          <h2>{{ aggregateName }}</h2>
        </div>
        <info-stack v-if="aggregate" :fields="infoFields" :item="aggregate" />
      </b-card>
    </b-col>
    <b-col lg="12" xl="8">
      <b-card>
        <div class="aggregate-check"
             v-for="(clients, check, idx) in checks"
             :key="`ag-chk-${idx}`">
          <h3>{{ check }}</h3>
          <s-table :items="clients"
                   :fields="resultFields"
                   name="aggregateResults"
                   count-text=""
                   :enableSearch="false"
                   class="aggregate-result-table"/>
        </div>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
const severityCodes = {
  ok: 0,
  warning: 1,
  critical: 2,
  unknown: 3,
  stale: 4
}

export default {
  name: 'AggregatePage',
  computed: {
    infoFields () {
      return this.getConfig('fields.aggregate_detail', [])
    },
    resultFields () {
      return this.getConfig('fields.aggregate_result_list', [])
    },
    aggregateName () {
      return this.$route.params.aggregateName
    },
    aggregate () {
      let aggregate = this.$store.getters.fullAggregate

      if (!aggregate) return aggregate

      let clients = new Set()
      let checks = new Set()

      for (let severity of Object.keys(aggregate.results)) {
        aggregate.results[severity].forEach((check) => {
          checks.add(check.check)
          check.summary.forEach((result) => {
            result.clients.forEach((c) => clients.add(c))
          })
        })
      }

      aggregate.clients = Array.from(clients).sort()
      aggregate.checks = Array.from(checks).sort()

      return aggregate
    },
    results () {
      return this.aggregate ? this.aggregate.results : {}
    },
    checks () {
      let checks = {}

      for (let severity of Object.keys(this.results)) {
        this.results[severity].forEach((check) => {
          if (!(check.check in checks)) {
            checks[check.check] = []
          }
          check.summary.forEach((result) => {
            result.clients.forEach((client) => {
              checks[check.check].push({
                client: client,
                output: result.output,
                status: severityCodes[severity]
              })
            })
          })
        })
      }

      return checks
    }
  },
  created () {
    this.$store.commit('getDetailedAggregates', false)
    this.$store.commit('setFullAggregateName', this.aggregateName)
    this.$store.dispatch('refreshAll')
  },
  destroyed () {
    this.$store.commit('setFullAggregateName', null)
  }
}
</script>

<style>
.aggregate-info-panel .aggregate-states {
  line-height: 1em;
}
</style>
