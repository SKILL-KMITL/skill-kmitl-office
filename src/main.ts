// Core
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";
import VueSweetalert2 from "vue-sweetalert2";
import OneGraphAuth from "onegraph-auth";

// Scss
import "@/assets/scss/index.scss";

// Plugins
import vuetify from "@/plugins/vuetify";

// Init
Vue.config.productionTip = false;

const auth = new OneGraphAuth({
  appId: "df4d06d4-c224-44d0-a660-63a685705e51"
});
const client = new ApolloClient({
  uri: "http://localhost:8080/v1/graphql",
  request: (operation: any) =>
    operation.setContext({ headers: auth.authHeaders() })
});

const apolloProvider = new VueApollo({
  defaultClient: client
});

Vue.use(VueApollo);
Vue.use(VueSweetalert2);

// Render
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  apolloProvider
}).$mount("#app");
