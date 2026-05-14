import { createRouter, createWebHashHistory } from "vue-router";

//制定路由规则，跳转页面
const routes = [
  {
    path: "/", //访问网址/ 自动显示Main.vue页面
    name: "main",
    component: () => import("@/views/Main.vue"),
    redirect: "/home",
    // redirect路由重定向，访问main路径时自动跳转到home
    children: [],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404.vue"),
  },
];

const router = createRouter({
  //设置路由的模式
  history: createWebHashHistory(),
  routes,
});

export default router;
