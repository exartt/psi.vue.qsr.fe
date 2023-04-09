import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/LoginService.vue'),
  },
  {
    path: '/index',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: 'index', component: () => import('pages/IndexPage.vue') }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes