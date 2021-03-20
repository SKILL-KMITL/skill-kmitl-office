import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { authMiddleware, isLoggedIn, titleMiddleware } from "./middleware";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: () => import("@/views/Router.vue"),
    children: [
      {
        path: "dashboard",
        alias: "",
        component: () => import("@/views/dashboard/Dashboard.vue"),
        children: [
          {
            path: "overview",
            alias: "",
            name: "DOverview",
            component: () => import("@/views/dashboard/Overview.vue")
          },
          {
            path: "career",
            name: "DCareer",
            component: () => import("@/views/dashboard/Career.vue"),
            meta: {
              requiresAuth: 1,
              title: "Manage Career"
            }
          },
          {
            path: "course",
            name: "DCourse",
            component: () => import("@/views/dashboard/Course.vue"),
            meta: {
              requiresAuth: 1,
              title: "Manage Course"
            }
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

titleMiddleware(router);
authMiddleware(router);
isLoggedIn();

export default router;
