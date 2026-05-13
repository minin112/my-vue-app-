<script setup>
import { ElMessage } from "element-plus";
import { reactive, getCurrentInstance } from "vue";
import { useAllDataStore } from "@/stores";
import { useRouter } from "vue-router";
const loginForm = reactive({
  username: "",
  password: "",
});
const proxy = getCurrentInstance().proxy;
const store = useAllDataStore();
const router = useRouter();
const handleLogin = async () => {
  const res = await proxy.$api.getMenu(loginForm);
  console.log(res);
  store.updateMenuList(res.menuList); //更新菜单列表到pinia中
  store.state.token = res.token; //登录成功后，将token存储到pinia中
  store.addMenu(router); //登录成功后，动态添加路由
  router.push("/home"); //登录成功后跳转到首页
};
</script>
<template>
  <div class="body-login">
    <el-form :model="loginForm" class="login-container">
      <h1>欢迎登陆</h1>
      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="handleLogin">
          登录
        </el-button>
        <el-button class="register-btn">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped lang="less">
.body-login {
  width: 100%;
  height: 100vh;
  background-image: url("../assets/images/login.png");
  background-size: 100%;
  overflow: hidden;
}
.login-container {
  width: 320px;
  background-color: #ffffff7c;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px; //上 右 下 左
  box-shadow: 0 0 25px #eaeaea; //阴影
  margin: 250px auto; //居中
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }
  :deep(.el-form-item__content) {
    justify-content: center;
  }
  //   穿透当前组件的样式作用域,找到 .login-container 内部 Element Plus 的 .el-form-item__content 元素,让表单内容区域（按钮）水平居中对齐
}
</style>
