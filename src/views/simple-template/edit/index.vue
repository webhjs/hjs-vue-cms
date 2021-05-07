<!--
 * @Author: your name
 * @Date: 2021-02-22 10:53:23
 * @LastEditTime: 2021-04-15 18:19:09
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\views\home\index.vue
-->
<template>
  <div class="containers flex flex-col">
    <input type="text" v-model="params" />
  </div>
</template>
<script>
export default {
  name: 'Test-edit',
  data() {
    return {
      params: ''
    };
  },
  mounted() {
    this.params = this.$route.params.id;
    console.log(this.params)
  }
};
</script>
