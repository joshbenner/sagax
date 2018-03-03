import Vue from 'vue'
import Router from 'vue-router'
import EventsPage from '@/pages/EventsPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/events',
      name: 'Events',
      component: EventsPage,
      alias: '/'
    }
  ]
})
