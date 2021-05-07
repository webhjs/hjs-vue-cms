import Vue from "vue";
import ElementUI from "element-ui";
// element全局样式
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";

import App from "@/App";
import router from "@/router";
import store from "@/store";

// 国际化
import i18n from "@/libs/lang";

Vue.use(ElementUI, {
  size: "medium",
  i18n: (key, value) => i18n.t(key, value)
});

// 集成vue架包
import { initSetup } from "@/libs/setup";
initSetup(Vue);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: h => h(App)
});
