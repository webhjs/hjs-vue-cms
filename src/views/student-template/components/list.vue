<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-09-29 11:46:12
 * @LastEditors: 金苏
 * @LastEditTime: 2021-10-09 13:24:34
-->
<template>
  <div class="h-full w-full flex flex-col">
    <div class="w-1/2 margin h-14">
      <scroll-tag id="__uniq" mode="vertical" @prev="switchPrev" @next="switchNext" showPosition :animation="300">
        <i class="fa fa-angle-left" slot="leftIcon"/>
        <i class="fa fa-angle-right" slot="rightIcon"/>
        <span class="mr-1" style="display: inline-block;height: 100%" v-for="i in numbers" :key="i">--------{{ i }}--------|</span>
        <div class="border" slot="closed">
          <i class="el-icon-circle-close" />
        </div>
      </scroll-tag>
    </div>
    <el-select v-model="value1" multiple placeholder="请选择" filterable>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div class="h-80 mt-8 flex-1 flex flex-col">
      {{ hellow }}
      <div class="flex-1 relative">
        <monaco ref="monacoPreviewResource" id="monacoResource" v-model="hellow" />
      </div>
    </div>
  </div>
</template>
<script>
import ScrollTag from 'hjs-scroll'
import Monaco from "@/components/Monaco";
export default {
  components: {
    ScrollTag,
    Monaco
  },
  data(){
    return {
      hellow: 'my care',
      numbers: 2,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value1: ''
    }
  },
  methods: {
    switchPrev(oper, posi) {
      console.log(oper, posi);
    },
    switchNext(oper, posi) {
      console.log(oper, posi);
    }
  }
}
</script>
<style lang="stylus" scoped>
.margin
  margin 0 auto
.border
  width: 26px;
  height: 100%;
  font-size: 24px;
  background: white;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  width: 30px;
  border-left: 1px solid #eee;
  font-size: 20px;
</style>