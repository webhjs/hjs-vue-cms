<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-03-22 09:20:49
 * @LastEditors: 金苏
 * @LastEditTime: 2021-06-29 11:03:29
-->
<template>
  <div id="app" class="text-customBase">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import "@/libs/assets/custom-theme/science-blue.css"; // 夏日主题
import("@/libs/assets/custom-theme/theme-summer.css"); // 深蓝主题
import("@/libs/assets/custom-theme/sapphire-blue.css"); // 宝石蓝主题
import { addClass } from "@/libs/utils";

export default {
  name: "app",
  computed: {
    ...mapGetters({
      theme: "layout/theme"
    })
  },
  watch: {
    theme: {
      handler(newValue) {
        document.body.className = "";
        addClass(document.body, newValue);
      },
      immediate: true
    }
  }
};
</script>

<style>
@import "./libs/assets/style/index.css";
@import "./libs/assets/style/custom.css";
@import "./libs/assets/style/windcss.css";
.el-dialog {
  overflow: hidden;
  border-radius: 6px;
}
.el-dialog .el-dialog__header {
  padding: 10px;
  background-color: #f2f2f2;
}
.el-dialog .el-dialog__header .el-dialog__headerbtn {
  top: 12px;
}
.el-dialog .el-dialog__body {
  padding: 15px 20px;
}
.my-tooltip-inner {
  word-break: break-all;
}
</style>
