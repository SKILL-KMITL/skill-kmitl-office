import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

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
            component: () => import("@/views/dashboard/Career.vue")
          },
          {
            path: "course",
            name: "DCourse",
            component: () => import("@/views/dashboard/Course.vue")
          },
          {
            path: "graph",
            name: "DGraph",
            component: () => import("@/views/dashboard/Graph.vue")
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

export default router;
