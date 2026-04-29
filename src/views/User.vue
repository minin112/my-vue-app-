<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from "vue";
const handleClick = () => {
  console.log("click");
};

const { proxy } = getCurrentInstance();
// 通过 getCurrentInstance() 获取的组件实例，用于访问挂载的 API 方法
const getUserData = async () => {
  let data = await proxy.$api.getUsrData();
  //   console.log(data);
  tableData.value = data.list.map((item) => ({
    ...item, // 展开运算符 ...item 等于把 item 里的内容全部展开
    sexLabel: item.sex === 1 ? "男" : "女",
  }));
};
const tableData = ref([]);
const tableLabel = reactive([
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "sexLabel",
    label: "性别",
  },
  {
    prop: "birth",
    label: "出生日期",
    width: "200",
  },
  {
    prop: "addr",
    label: "地址",
    width: "400",
  },
]);
onMounted(() => {
  getUserData();
}); //Vue 生命周期钩子，页面加载完成后自动执行
</script>

<template>
  <div class="user-header">
    <el-button type="primary">新增用户</el-button>
    <el-form :inline="true">
      <el-form-item label="请输入">
        <el-input placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="table">
    <el-table :data="tableData" style="width: 100%">
      <!-- 动态绑定tableData -->
      <!-- 遍历 tableLabel 数组 -->
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :width="item.width ? item.width : 125"
        :prop="item.prop"
        :label="item.label"
      />
      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #default>
          <el-button type="primary" size="small" @click="handleClick">
            编辑
          </el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="less">
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
