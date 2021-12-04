<!--
 * @name: 
 * @Descripttion: 下拉表格
 * @Author: Morning
 * @Date: 2021-03-27 16:38:21
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-03 17:17:01
-->

<template>
  <div style="display: flex;">
    <el-table
      id="targetDome"
      :data="tableData"
      border
      style="width: 100%"
      height="250"
    >
      <el-table-column fixed prop="date" label="日期" width="150">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
      <el-table-column prop="province" label="省份" width="120">
      </el-table-column>
      <el-table-column prop="city" label="市区" width="120"> </el-table-column>
      <el-table-column prop="address" label="地址" width="300">
      </el-table-column>
      <el-table-column prop="zip" label="邮编" width="120"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      id="sourceDome"
      :data="tableData"
      border
      style="width: 100%"
      height="250"
    >
      <el-table-column fixed prop="date" label="日期" width="150">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
      <el-table-column prop="province" label="省份" width="120">
      </el-table-column>
      <el-table-column prop="city" label="市区" width="120"> </el-table-column>
      <el-table-column prop="address" label="地址" width="300">
      </el-table-column>
      <el-table-column prop="zip" label="邮编" width="120"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "DropDownTable",
  data() {
    return {
      tableData: []
    };
  },
  watch: {
    tableData() {
      document
        .querySelector("#targetDome .el-table__body-wrapper")
        ?.addEventListener("scroll", this.targetFuc, false);
      document
        .querySelector("#sourceDome .el-table__body-wrapper")
        ?.addEventListener("scroll", this.sourceFuc, false);
    }
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    targetFuc(e) {
      document
        .querySelector("#sourceDome .el-table__body-wrapper")
        .removeEventListener("scroll", this.sourceFuc, false);
      const { scrollTop, scrollLeft } = e.srcElement;
      document.querySelector(
        "#sourceDome .el-table__body-wrapper"
      ).scrollTop = scrollTop;
      document.querySelector(
        "#sourceDome .el-table__body-wrapper"
      ).scrollLeft = scrollLeft;
      if (this.sourceTimer) clearTimeout(this.sourceTimer);
      this.sourceTimer = setTimeout(() => {
        document
          .querySelector("#sourceDome .el-table__body-wrapper")
          ?.addEventListener("scroll", this.sourceFuc, false);
      }, 500);
    },
    sourceFuc(e) {
      document
        .querySelector("#targetDome .el-table__body-wrapper")
        .removeEventListener("scroll", this.targetFuc, false);
      const { scrollTop, scrollLeft } = e.srcElement;
      document.querySelector(
        "#targetDome .el-table__body-wrapper"
      ).scrollTop = scrollTop;
      document.querySelector(
        "#targetDome .el-table__body-wrapper"
      ).scrollLeft = scrollLeft;
      if (this.targetTimer) clearTimeout(this.targetTimer);
      this.targetTimer = setTimeout(() => {
        document
          .querySelector("#targetDome .el-table__body-wrapper")
          ?.addEventListener("scroll", this.targetFuc, false);
      }, 500);
    }
  },
  mounted() {
    setTimeout(() => {
      this.tableData = [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333
        }
      ];
    }, 3000);
  }
};
</script>

<style></style>
