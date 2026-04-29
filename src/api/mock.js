import Mock from "mockjs"; //引入Mock库
import homeApi from "./mockData/home"; //引入假数据
//1.拦截路径 2.制造假数据
import userApi from "./mockData/user";

//拦截 axios 请求，返回假数据 Mock.mock(要拦截的地址, 请求方式, 返回假数据)
Mock.mock(/api\/home\/getTableData/, "get", homeApi.getTableData);
Mock.mock(/api\/home\/getCountData/, "get", homeApi.getCountData);
Mock.mock(/api\/home\/getChartData/, "get", homeApi.getChartData);
Mock.mock(/api\/user\/getUserDate/, "get", userApi.getUserList);
