<template>
  <el-aside :width="width">
    <!-- 折叠 -->
    <el-menu
      background-color="#545c64"
      text-color="#ffffff"
      height="100%"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activeMenu"
    >
      <h3 v-show="!isCollapse">通用后台管理系统</h3>
      <h3 v-show="isCollapse">后台</h3>

      <el-menu-item
        v-for="item in noChildren"
        :index="item.path"
        :key="item.path"
        @click="handleMenu(item)"
      >
        <!--v-for="item in noChildren"
                循环渲染 没有子菜单 的菜单项（首页、商品管理、用户管理）
                :index="item.path"
                菜单的唯一标识，路由跳转用点击会自动跳转到 item.path
                :key="item.path"
                Vue 循环必须加 key，保证列表更新正确-->
        <component class="icons" :is="item.icon"></component>
        <!--动态渲染 Element 图标-->
        <span>{{ item.label }}</span>
      </el-menu-item>
      <!-- <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item> -->

      <el-sub-menu
        v-for="item in hasChildren"
        :index="item.path"
        :key="item.path"
      >
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <!--动态渲染 Element 图标-->
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="subItem in item.children"
            :index="subItem.path"
            :key="subItem.path"
            @click="handleMenu(subItem)"
          >
            <component class="icons" :is="subItem.icon"></component>
            <!--动态渲染 Element 图标-->
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, computed } from "vue"; //ref定义会变的数据;computed定义自动计算的值
import { useAllDataStore } from "@/stores";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const handleMenu = (item) => {
  router.push(item.path); //点击菜单项，跳转到对应的路由
  store.selectMenu(item);
};
const route = useRoute(); //route.path获取当前路径
const activeMenu = computed(() => route.path);

// const list = ref([
//   {
//     path: "/home",
//     name: "home",
//     label: "首页",
//     icon: "house",
//     url: "Home",
//   },
//   {
//     path: "/mall",
//     name: "mall",
//     label: "商品管理",
//     icon: "video-play",
//     url: "Mall",
//   },
//   {
//     path: "/user",
//     name: "user",
//     label: "用户管理",
//     icon: "user",
//     url: "User",
//   },
//   {
//     path: "other",
//     label: "其他",
//     icon: "location",
//     children: [
//       {
//         path: "/page1",
//         name: "page1",
//         label: "页面1",
//         icon: "setting",
//         url: "Page1",
//       },
//       {
//         path: "/page2",
//         name: "page2",
//         label: "页面2",
//         icon: "setting",
//         url: "Page2",
//       },
//     ],
//   },
// ]);
const list = computed(() => store.state.menuList);

//没有子菜单的项
const noChildren = computed(() => list.value.filter((item) => !item.children));
//有子菜单的项
const hasChildren = computed(() => list.value.filter((item) => item.children));

// 1. 拿到全局状态仓库（Pinia）
const store = useAllDataStore();
// 2. 监听仓库里的 isCollapse 状态
const isCollapse = computed(() => store.state.isCollapse);
// 3. 根据是否折叠，动态计算侧边栏宽度
const width = computed(() => (store.state.isCollapse ? "64px" : "180px"));
</script>

<style>
.icons {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.el-menu {
  border-right: none;
  h3 {
    line-height: 48px;
    color: white;
    text-align: center;
  }
}
.el-aside {
  height: 100vh;
  background-color: #545c64;
}
</style>
