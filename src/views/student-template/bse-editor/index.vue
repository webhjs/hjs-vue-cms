<template>
  <div class="h-full w-full flex flex-col">
    <el-input v-model="input" placeholder=""></el-input>
    <div id="bse-edit" class="flex-1"></div>
  </div>
</template>
<script lang="ts">
import BSE from "./BSE.umd.min.js"
export default {
  data() {
    return {
      str: '',
      input: ''
    }
  },
  mounted() {
    new BSE.Editor({ el: document.querySelector('#bse-edit') })
  }
}
</script>
<style scoped>
@import url("./BSE.css");
</style>
