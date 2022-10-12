<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-02 09:24:33
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-03 14:49:57
-->
<template>
  <div
    class="list-item"
    :id="data.id + id"
    :class="[data.type, data.status]"
    :style="{ top: data.top, left: data.left }"
    @contextmenu.prevent="showMenu($event, data.id)"
  >
    <span class="toptip">{{ data.toptip }}</span>
    <span class="text">{{ data.name }}</span>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      id: ''
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    showMenu(ev, id) {
      this.$emit("showMenu", ev, id);
    }
  }
};
</script>
