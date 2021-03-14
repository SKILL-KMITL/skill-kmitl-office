// Core
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Scss
import "@/assets/scss/index.scss";

// Plugins
import vuetify from "@/plugins/vuetify";

// Init
Vue.config.productionTip = false;

// Render
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
