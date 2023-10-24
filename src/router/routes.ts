import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("pages/LoginService.vue"),
  },
  {
    path: "/default",
    component: () => import("layouts/Default.vue"),
    children: [
      { path: "", component: () => import("pages/Home.vue") },
      { path: "/agenda", component: () => import("pages/Schedule.vue") },
      { path: "/pacientes", component: () => import("pages/Patients.vue") },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
