import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);

// options
const opts = {
  customProperties: true,
  theme: {
    light: true,
    themes: {
      light: {
        primary: "#F47B3E",
        primary2: "#E35205",
        white2: "#F6F6FA"
      }
    }
  }
};

// subscription
export default new Vuetify(opts);
