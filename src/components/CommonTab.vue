<template>
  <div class="tags">
    <!-- 标签页列表 -->
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.name != 'home'"
      :effect="route.name == tag.name ? 'dark' : 'light'"
      @click="handleMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAllDataStore } from "@/stores";

const store = useAllDataStore();
const tags = computed(() => store.state.tags);
const route = useRoute();
const router = useRouter();

const handleMenu = (tag) => {
  router.push(tag.path);
  store.selectMenu(tag);
};

//关闭tab时触发
const handleClose = (tag, index) => {
  //这里执行pinia中的updateTags方法，把这个tab删除掉
  store.updateTags(tag);
  //只有当关闭的tab对应当前页面的时候，才需要做一些操作
  if (tag.path !== route.path) return;

  //tags.length，这个长度是点击之前的tabs数量-1，因为上面我们删除了一个tab
  //如果关闭的是最后一个
  if (index === store.state.tags.length) {
    //联动面包屑
    store.selectMenu(tags.value[index - 1]);
    //跳转到前一个tab
    router.push(tags.value[index - 1].path);
  } else {
    //如果不是最后一个，则让删除后处于这个索引的tab进行联动
    store.selectMenu(tags.value[index]);
    router.push(tags.value[index].path);
  }
};
</script>
<style scoped lang="less">
.tags {
  margin: 20px 0 0 20px;
  .el-tag {
    margin-right: 10px;
  }
}
</style>
