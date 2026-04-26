// 二次封装axios，新建一个专属请求工具request，代替axios
import axios from "axios";
import { ElMessage } from "element-plus";
import config from "@/config";
const service = axios.create({ baseURL: config.baseApi });
const NETWORK_ERROR = "网络错误...";

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器,返回数据响应
service.interceptors.response.use((res) => {
  // console.log(res.data.data);
  const { code, data, msg } = res.data;
  if (code === 200) {
    return data;
  } else {
    ElMessage.error(msg || NETWORK_ERROR);
    //  ||：左边有值，就用左边；左边没值 / 为空，就用右边默认值。
    return Promise.reject(msg || NETWORK_ERROR);
  }
});

function request(options) {
  options.method = options.method || "get"; // 如果没传请求方式，默认用 get
  // 如果是get请求，把data转换为params
  //因为get请求数据必须放params里
  //post请求数据必须放data里
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }

  //对mock的开关做处理
  let isMock = config.mock;
  if (typeof options.mock !== "undefined") {
    isMock = options.mock;
  }

  //线上环境，请求地址是真实地址
  if (config.env === "prod") {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }

  return service(options); //传回service
}

export default request; // 把这个函数导出，别的页面可以用

// 你调用 axios()
// axios 内部返回一个 Promise
// 请求发出去 → Promise 处于 pending
// Mock / 后台返回数据
// 成功：Promise 变成功 → 触发 .then()
// 失败：Promise 变失败 → 触发 .catch()
// 响应拦截器里的 return data / return Promise.reject()
// 就是控制这个 Promise 成功还是失败
