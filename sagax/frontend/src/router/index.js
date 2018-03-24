import Vue from 'vue'
import Router from 'vue-router'

import { inHTMLData } from 'xss-filters'

import BasePage from '../views/BasePage'
import LoginPage from '../views/LoginPage'
import EventListPage from '../views/EventListPage'
import ClientListPage from '../views/ClientListPage'
import SilencedListPage from '../views/SilencedListPage'
import ClientPage from '../views/ClientPage'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { label: 'Login' }
    },
    {
      path: '/',
      redirect: '/events',
      name: 'home',
      component: BasePage,
      meta: { label: 'Home' },
      children: [
        {
          path: 'events',
          name: 'events',
          meta: { label: 'Events' },
          component: EventListPage
        },
        {
          path: 'clients',
          meta: { label: 'Clients' },
          component: {template: '<router-view />'},
          children: [
            {
              path: '',
              name: 'clientList',
              component: ClientListPage,
              meta: { label: 'Clients', hide: true }
            },
            {
              path: ':clientName',
              name: 'clientDetail',
              component: ClientPage,
              meta: { label: (item, route) => inHTMLData(route.params.clientName) }
            }
          ]
        },
        {
          path: 'silenced',
          name: 'silenced',
          component: SilencedListPage,
          meta: { label: 'Silenced' }
        }
      ]
    }
  ]
})
