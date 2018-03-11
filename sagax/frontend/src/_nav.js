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
          getter: 'silencedClientCount',
          variant: 'info'
        },
        {
          getter: 'okClientCount',
          variant: 'success'
        }
      ]
    }
  ]
}
