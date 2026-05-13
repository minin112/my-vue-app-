import { defineStore } from "pinia";
import { ref } from "vue";

//作用：全局共享数据 → 任何组件都能用这里的变量和方法。

// 用 ref 定义，就是 state
// 作用：存放全局变量、用户信息、token、状态数据
// 所有组件都能读取、修改这些数据

// 用 computed 定义，就是 getters
// 作用：派生数据、做计算、格式化数据、有缓存
// state 变，它自动跟着变

// 普通函数，就是 actions
// 作用：封装修改 state 的逻辑
// 可以写同步、异步代码，直接改数据

// mutations 是 Vuex 中用来同步修改 state 的模块
// Vuex 规定只能通过 mutations 修改数据，不能直接改 state
// Pinia 废弃了 mutations，写法更简洁
// Pinia 直接在 actions 中修改数据即可，无需中转

function initState() {
  return {
    isCollapse: false,
    tags: [
      {
        path: "/home",
        name: "home",
        label: "首页",
        icon: "home",
      },
    ],
    currentMenu: null,
    menuList: [],
    token: "",
  };
}
export const useAllDataStore = defineStore("allData", () => {
  //创建一个 Pinia 仓库，第一个参数是唯一 ID。

  const state = ref(initState());

  function selectMenu(val) {
    if (val.name === "home") {
      state.value.currentMenu = null;
    } else {
      let index = state.value.tags.findIndex((item) => item.name === val.name);
      index === -1 ? state.value.tags.push(val) : "";
    }
  } //切换左侧菜单

  function updateTags(tag) {
    let index = state.value.tags.findIndex((item) => item.name === tag.name);
    state.value.tags.splice(index, 1);
  } //删除标签

  function updateMenuList(val) {
    state.value.menuList = val;
  }

  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
  };
});
