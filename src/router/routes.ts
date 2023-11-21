import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("pages/LoginService.vue"),
  },
  {
    path: "/",
    component: () => import("layouts/Default.vue"),
    children: [
      // { path: "", component: () => import("pages/Home.vue") },
      { path: "/agenda", component: () => import("pages/Schedule.vue") },
      { path: "/pacientes", component: () => import("pages/Patients.vue") },
      { path: "/fluxo-caixa", component: () => import("pages/CashFlow.vue") },
      { path: "", component: () => import("pages/Dashboard.vue") },
      {
        path: "/contas-a-pagar",
        component: () => import("pages/BillToPay.vue"),
      },
      {
        path: "/contas-a-receber",
        component: () => import("pages/BillToReceive.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
