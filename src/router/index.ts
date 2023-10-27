import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  NavigationGuardNext,
} from "vue-router";
import routes from "./routes";
import { checkAuthorization } from "src/util/utils";

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : createWebHistory;

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createHistory(process.env.VUE_ROUTER_BASE),
});

Router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const publicPages = ["/login"];

    const authRequired = !publicPages.includes(to.path);

    if (authRequired && !checkAuthorization() && to.path !== "/login") {
      return next("/login");
    } else if (to.path === "/login" && checkAuthorization()) {
      return next("/default");
    }

    next();
  }
);

export default Router;
