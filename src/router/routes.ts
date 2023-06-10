import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // {
  //   path: '/',
  //   component: () => import('pages/LoginService.vue'),
  // },
  {
    path: '/Default',
    component: () => import('layouts/Default.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { path: '/Agenda', component: () => import('pages/Schedule.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
