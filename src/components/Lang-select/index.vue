<!--
 * @Author: your name
 * @Date: 2021-03-17 18:21:29
 * @LastEditTime: 2021-03-25 13:08:17
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \antd-demo\src\components\lang-select\index.vue
-->
<template>
  <el-dropdown
    trigger="click"
    class="dropdown"
    @command="handleSetLanguage"
    placement="bottom-start"
  >
    <div>
      <svg-icon class="icon" src="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="language === 'zh'">
        中文
      </el-dropdown-item>
      <el-dropdown-item command="en" :disabled="language === 'en'">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  name: "LangSelect",
  computed: {
    language() {
      return this.$store.getters.language;
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("setLanguage", lang);
      // this.$notify({
      //   title: 'Info',
      //   message: 'switch language success',
      //   type: 'success',
      //   offset: 100,
      //   showClose: false
      // })
    }
  }
};
</script>
<style lang="stylus" scoped>
.dropdown {
  font-size 24px
}
.icon {
  display inline;
  font-size: 1.4rem;
}
</style>
