import Vue from 'vue'
import Router from 'vue-router'

import BasePage from '../components/BasePage'
import EventsPage from '../pages/EventsPage'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/events',
      name: 'Home',
      component: BasePage,
      children: [
        {
          path: 'events',
          name: 'Events',
          component: EventsPage
        }
      ]
    }
  ]
})
