import { createApp } from "vue";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import App from "./App.vue";

import router from "./router";
import store from "./store";
// import { pusher } from "./pusher";
import Echo from "laravel-echo";

import "../src/assets/js/dashboard";

// custom ui packs
import "../node_modules/sweetalert2/dist/sweetalert2.min.css";

// frest ui

import "./assets/scss/app.scss";
import "./assets/scss/dashboard.scss";
import "../src/frestui/assets/vendor/libs/popper/popper";
import "../src/frestui/assets/vendor/js/bootstrap";

// 3rd party
import VueClickAway from "vue3-click-away";
// import './registerServiceWorker'

// let store = useStore();
let token = store.state.auth.token;
// window.Pusher = require("pusher-js");
// window.Echo = new Echo({
//   broadcaster: "pusher",
//   key: pusher.key,
//   cluster: pusher.cluster,
// });

createApp(App)
  .use(store)
  .use(router)
  .use(VueClickAway)
  .use(autoAnimatePlugin)
  .mount("#app");
