<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { el } from "element-plus/es/locale/index.mjs";
const handleClick = () => {
  console.log("click");
};

const { proxy } = getCurrentInstance();
// 通过 getCurrentInstance() 获取的组件实例，用于访问挂载的 API 方法
const getUserData = async () => {
  let data = await proxy.$api.getUsrData(config);
  // console.log(data);
  tableData.value = data.list.map((item) => ({
    ...item, // 展开运算符 ...item 等于把 item 里的内容全部展开
    sexLabel: item.sex == 1 ? "男" : "女",
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
    // 调用删除接口
    await proxy.$api.deleteUser({ id: val.id });
    ElMessage({
      message: "删除成功",
      type: "success",
      showClose: true,
    });
    getUserData();
  });
};
const handleAdd = () => {
  // 新增用户
  action.value = "add";
  dialogVisible.value = true;
};
const handleEdit = (val) => {
  // 编辑用户
  action.value = "edit";
  dialogVisible.value = true; // 显示弹窗
  // 等待 nextTick 执行，确保表单元素渲染完成
  //等页面渲染完在执行里面的代码
  nextTick(() => {
    Object.assign(formUser, { ...val, sex: "" + val.sex }); // 合并对象，将 val 中的属性赋值给 formUser
  });
};
const handleReset = () => {
  formInline.keyWord = "";
  config.name = "";
  getUserData();
};

const action = ref("add");
const dialogVisible = ref(false);
const formUser = reactive({
  sex: "0",
});
// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr: [{ required: true, message: "地址是必填项" }],
});
const handleClose = () => {
  // 关闭弹窗时，清空表单数据
  dialogVisible.value = false;
  proxy.$refs["userForm"].resetFields(); //清空表单数据
};
const handleCancel = () => {
  // 取消弹窗时，清空表单数据
  dialogVisible.value = false;
  proxy.$refs["userForm"].resetFields(); //清空表单数据
};
const onSubmit = () => {
  //先验证
  proxy.$refs["userForm"].validate(async (valid) => {
    if (valid) {
      let res = null;
      if (action.value === "add") {
        res = await proxy.$api.addUser(formUser);
      } else {
        res = await proxy.$api.editUser(formUser);
      }
      if (res) {
        dialogVisible.value = false;
        proxy.$refs["userForm"].resetFields(); //清空表单数据
        getUserData();
      }
    } else {
      ElMessage({
        message: "请填写完整信息",
        showClose: true,
        type: "warning",
      });
    }
  });
};

onMounted(() => {
  getUserData();
}); //Vue 生命周期钩子，页面加载完成后自动执行
</script>

<template>
  <!-- 用户列表页面 -->
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input
          placeholder="请输入用户名"
          v-model="formInline.keyWord"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 用户列表表格 -->
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
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
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
      size="small"
      :total="config.total"
      @current-change="handleChange"
    />
  </div>

  <!--  Element Plus 的对话框组件，用于弹出模态窗口 -->
  <!-- 	控制对话框显示/隐藏
        对话框标题（动态）
        对话框宽度
        关闭前的回调 -->
  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
    <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
    <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="formUser.birth"
              type="date"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
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
.select-clearn {
  display: flex;
}
</style>
