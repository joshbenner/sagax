import Vue from 'vue'
import Router from 'vue-router'

import BasePage from '../views/BasePage'
import LoginPage from '../views/LoginPage'
import EventListPage from '../views/EventListPage'
import ClientListPage from '../views/ClientListPage'
import SilencedListPage from '../views/SilencedListPage'

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
          component: EventListPage
        },
        {
          path: 'clients',
          name: 'Clients',
          component: ClientListPage
        },
        {
          path: 'silenced',
          name: 'Silenced',
          component: SilencedListPage
        }
      ]
    }
  ]
})
