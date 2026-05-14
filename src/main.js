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
import api from "@/api/api"; //引入api.js接口
import { useAllDataStore } from "@/stores";

const pinia = createPinia();
const app = createApp(App); // 4. 创建 Vue 实例

app.config.globalProperties.$api = api; //把接口绑定到 Vue 全局身上，取名叫 $api以后在任何页面，都能直接用：
app.use(ElementPlus); //6. 注册 ElementPlus 组件库
app.use(pinia);

const store = useAllDataStore();
store.addMenu(router, "refresh");

for (const [key, component] of Object.entries(ElementPlusIconVue)) {
  // 7. 全局注册所有图标（以后页面随便用图标）
  app.component(key, component);
}
app.use(router); // 5. 注册路由
app.mount("#app"); //挂载
