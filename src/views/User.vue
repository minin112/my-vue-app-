<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const handleClick = () => {
  console.log("click");
};

const { proxy } = getCurrentInstance();
// 通过 getCurrentInstance() 获取的组件实例，用于访问挂载的 API 方法
const getUserData = async () => {
  let data = await proxy.$api.getUsrData(config);
  console.log(data);
  tableData.value = data.list.map((item) => ({
    ...item, // 展开运算符 ...item 等于把 item 里的内容全部展开
    sexLabel: item.sex === 1 ? "男" : "女",
  }));
  config.total = data.count;
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

const formInline = reactive({
  keyWord: "",
});
const config = reactive({
  name: "",
  total: 0,
  page: 1,
});
const handleSearch = () => {
  config.name = formInline.keyWord;
  getUserData();
};
const handleChange = (page) => {
  config.page = page;
  getUserData();
};
const handleDelete = (val) => {
  ElMessageBox.confirm("你确定要删除吗？").then(async () => {
    await proxy.$api.deleteUser({ id: val.id });
    ElMessage({
      message: "删除成功",
      type: "success",
      showClose: true,
    });
    getUserData();
  });
};

onMounted(() => {
  getUserData();
}); //Vue 生命周期钩子，页面加载完成后自动执行
</script>

<template>
  <div class="user-header">
    <el-button type="primary">新增用户</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input
          placeholder="请输入用户名"
          v-model="formInline.keyWord"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
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
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <!--scope插槽 是一个对象，包含当前行的数据。scope.row 是指当前行的数据 -->
          <el-button type="primary" size="small" @click="handleClick">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pager"
      background
      layout="prev,pager,next"
      size="medium"
      :total="config.total"
      @current-change="handleChange"
    />
  </div>
</template>

<style scoped lang="less">
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table {
  position: relative;
  height: 520px;
  overflow-y: auto;
  .pager {
    position: absolute;
    bottom: 30px;
    right: 30px;
  }
  .el-table {
    width: 100%;
    height: 500px;
  }
}
</style>
