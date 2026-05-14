<template>
  <div class="header">
    <div class="l-content">
      <!-- 点击按钮执行handleCollapse函数实现左侧菜单的展开/折叠 
       @click是v-on:click 的简写，绑定点击事件。-->
      <el-button size="small" @click="handleCollapse">
        <el-icon><component :is="Menu" /></el-icon>
      </el-button>
      <el-breadcrumb separator="/" class="bread"
        ><!--面包屑-->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="current" :to="current.path">{{
          current.label
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="getImageUrl('user')" class="user" /><!--动态绑定-->
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { Menu } from "@element-plus/icons-vue"; //导入图标
import { ref, computed } from "vue"; //ref定义会变的数据;computed定义自动计算的值
import { useAllDataStore } from "../stores";
import { useRouter } from "vue-router";
const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href; //获取图片 URL
};
const store = useAllDataStore();
const handleCollapse = () => {
  store.state.isCollapse = !store.state.isCollapse;
};
const router = useRouter();
const handleLoginOut = () => {
  store.clean();
  router.push("/login");
};
const current = computed(() => store.state.currentMenu);
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #333;
  padding: 20px;
}
.icons {
  width: 20px;
  height: 20px;
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 5%;
  }
}
.el-breadcrumb__inner {
  color: #fff !important;
  cursor: pointer !important;
}
</style>
