<template>
  <b-card>
    <s-table :items="checks"
             :fields="fields"
             :showCheckboxes="true"
             :bulkActions="bulkActions"
             v-model="selected"
             name="subscriptionCheckList"
             class="subscription-check-list">
    </s-table>
  </b-card>
</template>

<script>
export default {
  name: 'SubscriptionCheckListPage',
  data () {
    return {
      selected: [],
      bulkActions: [
        {
          label: 'Request Check',
          icon: 'fa fa-refresh',
          callback: (items) => items.map((check) => this.requestCheck(check.name))
        }
      ]
    }
  },
  computed: {
    checks () {
      return this.$store.getters.allChecks
    },
    fields () {
      return this.getConfig('fields.subscription_check_list', [])
    }
  }
}
</script>
