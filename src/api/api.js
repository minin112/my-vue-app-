/**
 * 整个项目api的管理
 * 管理接口
 *
 */
//引入封装好的request工具（axios）
import { mock } from "mockjs";
import request from "./request";

//请求首页左侧的表格的数据
export default {
  // home组件 左侧表格数据获取
  getTableData() {
    return request({
      url: "/home/getTableData",
      method: "get",
      // mock: true, //单个接口会覆盖全局mock配置
    });
  },
  getCountData() {
    return request({
      url: "/home/getCountData",
      method: "get",
    });
  },
  getChardata() {
    return request({
      url: "/home/getChartData",
      method: "get",
    });
  },
  getUsrData() {
    return request({
      url: "/user/getUserData",
      method: "get",
    });
  },
};
