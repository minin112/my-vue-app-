<template>
  <el-row class="home" :gutter="20">
    <!-- 列与列之间间距20px -->
    <el-col :span="8" style="margin-top: 20px">
      <!-- 每一栏占8格（总24格）-->
      <!-- 首页左上方卡片 -->
      <el-card shadow="hover">
        <div class="user">
          <img :src="getImageUrl('user')" class="user" />
          <div class="user-info">
            <p class="user-info-admin">admin</p>
            <p class="user-info-p">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间：<span>2026-4-19</span></p>
          <p>上次登录地点：<span>浙江</span></p>
        </div>
      </el-card>
      <!-- 首页左下方表格卡片 -->
      <el-card class="user-table" shadow="hover">
        <el-table :data="tableData">
          <!-- 绑定表格数据 -->
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          >
            <!-- v-for循环生成表格列
             key为左边字段名
             val为右边中文
            :prop="key" → 对应数据字段
            :label="val" → 表头中文标题-->
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <!-- 首页右上方count卡片 -->
      <div class="count-card">
        <el-card
          :body-style="{ display: 'flex', padding: 0 }"
          v-for="item in CountData"
          :key="item.name"
          shadow="hover"
        >
          <component
            :is="item.icon"
            class="icons"
            :style="{ backgroundColor: item.color }"
          ></component>
          <div class="detail">
            <div class="num">￥{{ item.value }}</div>
            <div class="txt">{{ item.name }}</div>
          </div>
        </el-card>
      </div>
      <!-- 首页右下方图表卡片 -->
      <el-card class="top-echart" shadow="hover" style="margin-top: 10px">
        <div ref="echart" style="height: 200px"></div>
      </el-card>

      <div class="graph">
        <el-card>
          <div ref="userEchart" style="height: 200px"></div>
        </el-card>
        <el-card>
          <div ref="videoEchart" style="height: 200px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from "vue"; //ref从vue库中按需导入
import * as echarts from "echarts"; // echarts 库 只提供默认导出
// import axios from "axios"; //axios 库 只提供默认导出
const { proxy } = getCurrentInstance(); //获取当前组件的实例对象

//组件挂载完成后执行，调用接口获取表格数据
// 页面一进来就自动执行
// axios({
//   url: "/api/home/getTableData", //要请求的后台地址
//   method: "GET", //请求方式get拿数据
// }).then((res) => {
//   //请求成功后执行
//   // 判断：后台返回的状态码是不是 200（200代表成功）
//   // 打印成功拿到的表格数据
//   // 把拿到的数据赋值给表格，让表格显示
//   if (res.data.code === 200) {
//     console.log(res.data.data.tableData);
//     tableData.value = res.data.data.tableData;
//   }
//   //用Mock在本地造假数据，骗过 axios，让页面能正常渲染。
// });

const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
};

const CountData = ref([]);
const tableData = ref([]);
const tableLabel = ref({
  name: "课程",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总购买",
});
const chartData = ref([]);
const observer = ref(null);

//这个是折线图和柱状图 两个图表共用的公共配置
const xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: "#333",
  },
  legend: {
    top: 0,
  },
  grid: {
    left: "20%",
  },
  // 提示框
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    axisLabel: {
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
});
//这个是饼图的配置
const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: 0,
  },
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: [],
});

const getCountData = async () => {
  const data = await proxy.$api.getCountData();
  CountData.value = data;
  // console.log(data);
};
const getTableData = async () => {
  const data = await proxy.$api.getTableData();
  tableData.value = data.tableData;
  // console.log(data.tableData); //打印成功拿到的表格数据
};
const getChartData = async () => {
  const { orderData, videoData, userData } = await proxy.$api.getChardata();
  // console.log(orderData);

  //对第一个图表的xAxis和series赋值
  xOptions.xAxis.data = orderData.date; //设置x轴日期
  xOptions.series = Object.keys(orderData.data[0]).map((val) => {
    return {
      name: val,
      data: orderData.data.map((item) => item[val]),
      type: "line",
    };
  }); //设置多条折线数据，每一条代表一个品牌
  const oneEcharts = echarts.init(proxy.$refs["echart"]); //初始化图表
  oneEcharts.setOption(xOptions);

  //柱状图
  xOptions.xAxis.data = userData.map((item) => item.date);
  xOptions.series = [
    {
      name: "新增用户",
      data: userData.map((item) => item.new),
      type: "bar",
    },
    {
      name: "活跃用户",
      data: userData.map((item) => item.active),
      type: "bar",
    },
  ];
  //two
  const TwoEcharts = echarts.init(proxy.$refs["userEchart"]);
  TwoEcharts.setOption(xOptions);

  //饼图
  pieOptions.series = [
    {
      data: videoData,
      type: "pie",
    },
  ];
  //three
  const ThreeEcharts = echarts.init(proxy.$refs["videoEchart"]);
  ThreeEcharts.setOption(pieOptions);

  //ResizeObserver 如果监视的容器大小变化，如果改变会执行传递的回调
  observer.value = new ResizeObserver((entries) => {
    oneEcharts.resize();
    TwoEcharts.resize();
    ThreeEcharts.resize();
  });
  //如果这个容器存在
  if (proxy.$refs["echart"]) {
    //则调用监视器的observe方法，监视这个容器的大小
    observer.value.observe(proxy.$refs["echart"]);
  }
};

//生命周期钩子
onMounted(() => {
  getTableData();
  getCountData();
  getChartData();
});
</script>

<style scoped lang="less">
.home {
  height: 100%;
  overflow-y: auto;
  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 5%;
      margin-right: 40px;
    }
    .user-info {
      p {
        line-height: 40px;
      }
      .user-info-admin {
        font-size: 30px;
      }
      .user-info-p {
        color: #666;
      }
    }
  }
  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #666;
      span {
        color: #666;
        margin-left: 30px;
      }
    }
  }
  .user-table {
    margin-top: 20px;
  }
  .count-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 10px;
    }
    .icons {
      width: 40px;
      height: auto;
      font-size: 20px;
      text-align: center;
      line-height: 60px;
      color: #fff;
    }
    .detail {
      display: flex;
      margin-left: 10px;
      flex-direction: column;
      justify-content: center;
      .num {
        font-size: 16px;
        margin-bottom: 5px;
      }
      .txt {
        font-size: 12px;
        color: #666;
      }
    }
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 48%;
      height: 250px;
    }
  }
}
</style>
