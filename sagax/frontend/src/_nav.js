export default {
  items: [
    {
      name: 'Events',
      url: '/events',
      icon: 'icon-bell',
      countBadges: [
        {
          getter: 'criticalEventsCount',
          variant: 'danger'
        },
        {
          getter: 'warningEventsCount',
          variant: 'warning'
        }
      ]
    },
    {
      name: 'Clients',
      url: '/clients',
      icon: 'fa fa-server',
      countBadges: [
        {
          getter: 'criticalClientCount',
          variant: 'danger'
        },
        {
          getter: 'warningClientCount',
          variant: 'warning'
        },
        {
          getter: 'okClientCount',
          variant: 'success'
        }
      ]
    },
    {
      name: 'Central Checks',
      url: '/subscription-checks',
      icon: 'fa fa-check-square-o',
      countBadges: [
        {
          getter: 'checkCount',
          variant: 'info'
        }
      ]
    },
    {
      name: 'Silenced',
      url: '/silenced',
      icon: 'fa fa-bell-slash-o',
      countBadges: [
        {
          getter: 'silencedCount',
          variant: 'info'
        }
      ]
    }
  ]
}
