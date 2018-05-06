import Vue from 'vue'
import Router from 'vue-router'

import { inHTMLData } from 'xss-filters'

import BasePage from '../views/BasePage'
import LoginPage from '../views/LoginPage'
import EventListPage from '../views/EventListPage'
import ClientListPage from '../views/ClientListPage'
import SilencedListPage from '../views/SilencedListPage'
import ClientPage from '../views/ClientPage'
import ResultPage from '../views/ResultPage'
import SubscriptionCheckListPage from '../views/SubscriptionCheckListPage'
import AggregateListPage from '../views/AggregateListPage'
import AggregatePage from '../views/AggregatePage'

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
          meta: { label: 'Clients', defaultChild: 'clientList' },
          component: {template: '<router-view />'},
          children: [
            {
              path: '',
              name: 'clientList',
              component: ClientListPage,
              meta: { hide: true }
            },
            {
              path: ':clientName',
              meta: {
                label: (item, route) => inHTMLData(route.params.clientName),
                defaultChild: 'clientDetail'
              },
              component: {template: '<router-view />'},
              children: [
                {
                  path: '',
                  name: 'clientDetail',
                  meta: { hide: true },
                  component: ClientPage
                },
                {
                  path: ':checkName',
                  name: 'resultDetail',
                  component: ResultPage,
                  meta: { label: (item, route) => inHTMLData(route.params.checkName) }
                }
              ]
            }
          ]
        },
        {
          path: 'subscription-checks',
          name: 'subscriptionChecks',
          component: SubscriptionCheckListPage,
          meta: { label: 'Central Checks' }
        },
        {
          path: 'silenced',
          name: 'silenced',
          component: SilencedListPage,
          meta: { label: 'Silenced' }
        },
        {
          path: 'aggregates',
          component: {template: '<router-view />'},
          meta: { label: 'Aggregates', defaultChild: 'aggregateList' },
          children: [
            {
              path: '',
              name: 'aggregateList',
              component: AggregateListPage,
              meta: { hide: true }
            },
            {
              path: ':aggregateName',
              name: 'aggregateDetail',
              meta: {
                label: (item, route) => inHTMLData(route.params.aggregateName)
              },
              component: AggregatePage
            }
          ]
        }
      ]
    }
  ]
})
