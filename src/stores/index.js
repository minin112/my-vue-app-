import { defineStore } from "pinia";
import { ref, watch } from "vue";

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
    routeList: [],
  };
}
export const useAllDataStore = defineStore("allData", () => {
  //创建一个 Pinia 仓库，第一个参数是唯一 ID。

  const state = ref(initState());

  //监听state变化，当token变化时，把state中的数据存储到localStorage中,实现页面刷新后数据不丢失。
  watch(
    state,
    (newObj) => {
      if (!newObj.token) return;
      localStorage.setItem("store", JSON.stringify(newObj));
    },
    { deep: true },
  );

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

  //需要传递router对象进来
  function addMenu(router, type) {
    if (type === "refresh") {
      if (JSON.parse(localStorage.getItem("store"))) {
        state.value = JSON.parse(localStorage.getItem("store"));
        state.value.routeList = [];
      } else {
        return;
      }
    }
    const menu = state.value.menuList;
    //这里**代表0或多个文件夹，*代表文件。就是把views下的文件全部导入
    const module = import.meta.glob("../views/**/*.vue");
    //这个是菜单格式化后的路由数组
    const routeArr = [];
    //格式化菜单路由
    menu.forEach((item) => {
      //如果菜单有children
      if (item.children) {
        //把children遍历格式化
        item.children.forEach((val) => {
          let url = `../views/${val.url}.vue`;
          //这里通过url取出对应的组件
          val.component = module[url];
        });
        //需要注意的是我们只需要为item.children中的菜单添加路由，所以我们把它解构出来
        routeArr.push(...item.children);
      } else {
        let url = `../views/${item.url}.vue`;
        item.component = module[url];
        routeArr.push(item);
      }
    });
    //清空饼重置路由配置
    state.value.routerList = [];
    let routers = router.getRoutes();
    routers.forEach((item) => {
      if (item.name == "main" || item.name == "login") {
        return;
      } else {
        router.removeRoute(item.name);
      }
    });

    //遍历routeArr
    routeArr.forEach((item) => {
      //addRoute方法会返回一个函数，执行这个函数会把这个路由删除
      //这里我们把每一次router.addRoute添加路由的返回值收集起来，放到state中的routeList
      //addRoute第一个参数要添加子路由的路由name，第二个是一个路由记录
      state.value.routeList.push(router.addRoute("main", item));
    });
  }

  //定义重置方法
  function clean() {
    //把保存的删除路由方法都执行一遍
    state.value.routeList.forEach((item) => {
      if (item) item();
    });
    //重置state的数据
    state.value = initState();
    //删除本地缓存，因为这个clean方法是用户退出执行的
    localStorage.removeItem("store");
  }

  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    clean,
    addMenu,
  };
});
