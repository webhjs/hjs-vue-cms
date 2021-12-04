<!--
 * @Author: your name
 * @Date: 2021-02-22 10:53:23
 * @LastEditTime: 2021-03-29 15:27:44
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\views\home\index.vue
-->
<template>
  <div class="containers">
    <div class="row" id="pdfDom">
      <div class="golbal">
        XX市卫生健康委员会<el-divider></el-divider>
        <sub class="number">苏卫函 [2019] 153号</sub>
      </div>
      <div class="title">
        XX市卫生健康委员会<br />
        关于3月份全市全民健康信息平台互联互通<br />
        数据对接情况通报
      </div>
      <text-item :indent="false">
        各市卫生健康委,委属(管)单位:
      </text-item>
      <text-item>
        为全面推进各级各类医疗机构电子病历、居民电子健康档案与各级平台互联互通,逐步提高数据质量,现将截至2019年3月省平台与各市单位务必高度重视,认真研究存在的主要问题,尽快抓好整改落实。
      </text-item>
      <annex>
        <p slot="title">附件:</p>
        <ul slot="list">
          <li>1.各市电子病历资源库与省平台对接总体情况</li>
          <li>2.各市健康档案资源库与省平台对接总体情况</li>
          <li>3.本次数据质量与上次对比情况</li>
          <li>4.省平台数据对接及质量总体情况分析报告(市、县部分)</li>
          <li>5.委属(管)医院电子病历资源库数据对接情况</li>
          <li>6.委属(管)医院本次数据质量与上次对比情况</li>
          <li>7.省平台数据对接及质量总体情况分析报告(委属)(管)医院部分</li>
          <li>8.各市、委属(管)医院互联互通数据对接情况通报(分发)</li>
        </ul>
      </annex>
      <seal>
        <p>XX市卫生健康委员会</p>
        <p>2019年4月25日</p>
      </seal>

      <histogram-chart
        tagName="ve-histogram"
        height="450px"
        :data="histogramChartData1"
        :extend="{
          legend: {
            show: true,
            x: 'right',
            y: 20,
            itemGap: 20,
            orient: 'horizontal',
            align: 'left'
          }
        }"
        :settings="{ labelMap: labelMap }"
        :title="{ text: '三级医院对接率' }"
        percentage
      />
    </div>
    <el-button
      class="export"
      size="mini"
      type="primary"
      @click="getPdf('pdfDom', '文件名')"
    >
      导出PDF
    </el-button>
  </div>
</template>
<script>
import TextItem from "./components/Text.vue";
import Annex from "./components/Annex.vue";
import Seal from "./components/Seal.vue";
import HistogramChart from "./components/HistogramChart.vue";

export default {
  components: {
    TextItem,
    Annex,
    Seal,
    HistogramChart
  },
  data() {
    return {
      tabledata: [
        {
          地市名称: "滨州市",
          三级医院平均上传数据表数量: 21.2,
          三级医院数据表对接率: "88.33%",
          二级医院平均上传数据表数量: 13.67,
          二级医院数据表对接率: "56.94%",
          电子病历总记录数: 231464617,
          电子病历对接上传数据数量情况得分: 21.41,
          子病历对接上传数据质量情况得分: 56.69,
          综合评分: 78.1
        },
        {
          地市名称: "滨州市",
          三级医院平均上传数据表数量: 21.2,
          三级医院数据表对接率: "88.33%",
          二级医院平均上传数据表数量: 13.67,
          二级医院数据表对接率: "56.94%",
          电子病历总记录数: 231464617,
          电子病历对接上传数据数量情况得分: 21.41,
          子病历对接上传数据质量情况得分: 56.69,
          综合评分: 78.1
        },
        {
          地市名称: "滨州市",
          三级医院平均上传数据表数量: 21.2,
          三级医院数据表对接率: "88.33%",
          二级医院平均上传数据表数量: 13.67,
          二级医院数据表对接率: "56.94%",
          电子病历总记录数: 231464617,
          电子病历对接上传数据数量情况得分: 21.41,
          子病历对接上传数据质量情况得分: 56.69,
          综合评分: 78.1
        }
      ],
      histogramChartData: {
        columns: ["date", "userCount", "userOrder"],
        rows: [
          { date: "滨湖", userCount: 1393, userOrder: 1093 },
          { date: "惠山", userCount: 3530, userOrder: 3230 },
          { date: "梁溪", userCount: 2923, userOrder: 2623 },
          { date: "宜兴", userCount: 1723, userOrder: 1423 },
          { date: "锡山", userCount: 3792, userOrder: 3492 },
          { date: "江阴", userCount: 4593, userOrder: 4293 }
        ]
      },
      histogramChartData1: {
        columns: ["date", "userCount"],
        rows: [
          { date: "滨湖", userCount: 100 },
          { date: "惠山", userCount: 100 },
          { date: "梁溪", userCount: 98 },
          { date: "宜兴", userCount: 100 },
          { date: "锡山", userCount: 96.4 },
          { date: "江阴", userCount: 100 }
        ]
      },
      labelMap: {
        date: "地区",
        userCount: "九月底",
        userOrder: "三月底"
      }
    };
  }
};
</script>
<style lang="stylus" scoped>
#pdfDom
  width 940px
  padding: 20px 20px
  .golbal
    padding-top 50px
    color red
    font-size 40px
    font-weight bold
    text-align center
    position relative
    /deep/ .el-divider
      background-color red
      height 5px
    .number
      color: #000
      font-size 20px
      position absolute
      right 0
      bottom -20px
      font-weight normal
  .title
    text-align center
    font-weight 600
    margin 80px 0 50px 0
    line-height 35px
    font-size 22px
ul,li
  list-style none
  margin 0
  padding 0
  li
    padding-left 1em
.blod
  font-weight bold
.list-item
  line-height 30px
.containers
  position relative
  .export
    position fixed
    top 13.5vh
    right 2vw
</style>
