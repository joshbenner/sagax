import Vue from 'vue'
import Router from 'vue-router'

import BasePage from '../views/BasePage'
import LoginPage from '../views/LoginPage'
import EventsPage from '../views/EventsPage'
import ClientsPage from '../views/ClientsPage'
import SilencedPage from '../views/SilencedPage'

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
