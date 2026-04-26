/**
 * 整个项目api的管理
 * 管理接口
 *
 */
//引入封装好的request工具（axios）
import request from "./request";

//请求首页左侧的表格的数据
export default {
  // home组件 左侧表格数据获取
  getTableData() {
    return request({
      url: "/api/home/getTableData",
      method: "get",
    });
  },
};
