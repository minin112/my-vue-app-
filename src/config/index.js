/**
 * 环境配置文件
 * 一般在企业级项目里面有三个环境
 * 开发环境
 * 测试环境
 * 线上环境
 */

const env = import.meta.env.MODE || "prod"; //默认线上环境

const EnvConfig = {
  development: {
    //开发环境
    baseApi: "/api", //开发环境的真实api地址
    mockApi: "https://mock.apifox.cn/m1/4068509-0-default/api", //开发环境的假接口地址
  },
  test: {
    //测试环境
    baseApi: "//test.future.com/api",
    mockApi: "https://mock.apifox.cn/m1/4068509-0-default/api",
  },
  prod: {
    //线上环境
    baseApi: "//future.com/api",
    mockApi: "https://mock.apifox.cn/m1/4068509-0-default/api",
  },
};

//导出环境配置
export default {
  env,
  mock: false, //是否开启假接口
  ...EnvConfig[env],
};
