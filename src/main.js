import { createApp } from "vue";

import App from "./App.vue";
import "@/assets/less/index.less";
import router from "./router";

//这里ElementPlus我们使用完整引入
import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; //引入组件库样式
import * as ElementPlusIconVue from "@element-plus/icons-vue"; // 3. 引入 Element Plus 的所有图标
import { createPinia } from "pinia";
import "@/api/mock.js";
import api from "@/api/api";

const app = createApp(App); // 4. 创建 Vue 实例
const pinia = createPinia();

app.config.globalProperties.$api = api;
app.use(router); // 5. 注册路由
app.use(ElementPlus); //6. 注册 ElementPlus 组件库
for (const [key, component] of Object.entries(ElementPlusIconVue)) {
  // 7. 全局注册所有图标（以后页面随便用图标）
  app.component(key, component);
}
app.use(pinia);

app.mount("#app"); //挂载
