import Vue from 'vue'
import Router from 'vue-router'

import BasePage from '../pages/BasePage'
import LoginPage from '../pages/LoginPage'
import EventsPage from '../pages/EventsPage'
import ClientsPage from '../pages/ClientsPage'
import SilencedPage from '../pages/SilencedPage'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
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
        },
        {
          path: 'clients',
          name: 'Clients',
          component: ClientsPage
        },
        {
          path: 'silenced',
          name: 'Silenced',
          component: SilencedPage
        }
      ]
    }
  ]
})
