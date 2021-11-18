<!--
 * @name: 
 * @Descripttion: 第三方文档
 * @Author: Morning
 * @Date: 2021-03-27 13:41:12
 * @LastEditors: Morning
 * @LastEditTime: 2021-03-27 18:52:31
-->

<template>
  <el-container>
    <div class="document">
      <div class="listWrap flex flex-row my-2 mb-4">
        <el-card
          shadow="hover"
          v-for="item in list"
          :key="item.name"
          :class="`cursor-pointer mx-2 ${active === item.name ? 'active' : ''}`"
        >
          <el-link
            type="info"
            target="_blank"
            :underline="false"
            class="flex flex-row"
            @click="changeUrl(item)"
          >
            <img class="mr-4" :src="item.icon" />
            <div class="text-black">{{ item.name }}<br />{{ item.remark }}</div>
          </el-link>
        </el-card>
      </div>

      <iframe :src="docUrl"></iframe>
    </div>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: "v-charts",
          url: "https://v-charts.js.org/#/",
          remark: "生成常见的图表",
          icon: require("./images/v-charts.png")
        },
        // {
        //   name: "element-ui",
        //   url: "https://element.eleme.cn/#/zh-CN/component/installation",
        //   remark: "基于vue的ui框架",
        //   icon: require("./images/element-ui.png")
        // },
        {
          name: "mandalat-ui",
          url: "http://8.133.185.32/fr/mandalat-ui/",
          remark: "基于vue的ui框架",
          icon: require("./images/mandalat-ui1.png")
        },
        {
          name: "tailwind-css",
          url: "https://www.tailwindcss.cn/docs/installation",
          remark: "可定制css样式库",
          icon: require("./images/tailwind-css.png")
        },
        {
          name: "vuex-pathify",
          url: "https://davestewart.github.io/vuex-pathify/#/?id=home",
          remark: "vuex封装库",
          icon: require("./images/vuexpathify.svg")
        },
        {
          name: "mockjs",
          url: "http://mockjs.com/examples.html",
          remark: "生成随机数据",
          icon: require("./images/mockjs.png")
        },
        
      ],
      active: "v-charts",
      docUrl: "https://v-charts.js.org/#/"
    };
  },

  methods: {
    changeUrl(item) {
      this.docUrl = item.url;
      this.active = item.name;
    }
  }
};
</script>
<style lang="stylus" scoped>
.document
  width 100%
  .listWrap
    img
      height 2rem

    .el-card.active
      border 1px solid #c60

    >>> .el-card__body
      padding 1rem
      
    >>> .el-link--inner
      display flex 
      flex-direction row 
      flex-wrap nowrap

  iframe
    width 100%
    height calc(100vh - 15rem)
</style>
