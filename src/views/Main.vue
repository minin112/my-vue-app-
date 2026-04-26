<script setup>
// 放逻辑、数据、函数
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";
</script>

<template>
  <!-- 放页面结构、HTML、组件
        el-container容器 height: 100vh; /* 占满整个浏览器高度 */
        ├─ el-header顶部导航
        └─ el-container
            ├─ el-aside侧边栏菜单
            └─ el-main 主题内容-->
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 自定义左侧组件 -->
      <common-aside />
      <el-container>
        <el-header class="el-header">
          <common-header />
        </el-header>
        <el-main class="right-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
/* 写样式css */
.common-layout,
.lay-container {
  height: 100%;
}
.el-header {
  //el-header自带padding:20px
  padding: 0%;
}
</style>
