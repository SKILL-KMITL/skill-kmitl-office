// Core
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { ApolloClient, DefaultOptions } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import VueApollo from "vue-apollo";
import VueSweetalert2 from "vue-sweetalert2";
import OneGraphAuth from "onegraph-auth";
import env from "./environment";

// Scss
import "@/assets/scss/index.scss";

// Plugins
import vuetify from "@/plugins/vuetify";

// Init
Vue.config.productionTip = false;

const auth = new OneGraphAuth({
  appId: env.ONEGRAPH_APP_ID
});

// const client = new ApolloClient({
//   uri: env.GRAPHQL_URI,
//   request: (operation: any) =>
//     operation.setContext({ headers: auth.authHeaders() })
// });

// const apolloProvider = new VueApollo({
//   defaultClient: client
// });

/* ------------------------------ Apollo setup ------------------------------ */
const httpLink = new HttpLink({
  uri: env.GRAPHQL_URI
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: auth.authHeaders()
  });
  return forward(operation);
});

const link = ApolloLink.from([authMiddleware, httpLink]);

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore"
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all"
  }
};

// Create the apollo client
const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: defaultOptions
});

// Create apollo provider
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

Vue.prototype.$apolloProvider = apolloProvider;

/* --------------------------------- Render --------------------------------- */
Vue.use(VueApollo);
Vue.use(VueSweetalert2);
new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
