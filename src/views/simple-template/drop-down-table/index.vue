<!--
 * @name: 
 * @Descripttion: 下拉表格
 * @Author: Morning
 * @Date: 2021-03-27 16:38:21
 * @LastEditors: 金苏
 * @LastEditTime: 2021-04-21 13:44:40
-->

<template>
  <div>
    <el-table
      class="w-full"
      :data="tableData"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="orgName" label="机构名称"> </el-table-column>
      <el-table-column prop="dbNum" label="数据库个数"> </el-table-column>
      <el-table-column prop="dbName" label="数据库名称"> </el-table-column>
      <el-table-column prop="tableNum" label="表个数"> </el-table-column>
      <el-table-column prop="tableName" label="表名称"> </el-table-column>
      <el-table-column prop="orginTableNum" label="源表数据量">
      </el-table-column>
      <el-table-column prop="targetTableNum" label="目标表数据量">
      </el-table-column>
      <el-table-column prop="progress" label="进度"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "DropDownTable",

  data() {
    return {
      tableData: [
        {
          id: 1,
          orgName: "机构a",
          dbNum: "10",
          dbName: "",
          tableNum: "12",
          tableName: "",
          orginTableNum: "200",
          targetTableNum: "200",
          progress: "100%",
          hasChildren: true
        },
        {
          id: 2,
          orgName: "机构b",
          dbNum: "10",
          dbName: "",
          tableNum: "12",
          tableName: "",
          orginTableNum: "200",
          targetTableNum: "200",
          progress: "100%",
          hasChildren: true
        },
        {
          id: 3,
          orgName: "机构c",
          dbNum: "10",
          dbName: "",
          tableNum: "12",
          tableName: "",
          orginTableNum: "200",
          targetTableNum: "200",
          progress: "100%",
          hasChildren: true
        }
      ]
    };
  },
  methods: {
    load(tree, treeNode, resolve) {
      console.log(tree, treeNode);
      setTimeout(() => {
        let arr = [...Array(3).keys()];
        let res;
        if (tree.dbName) {
          res = arr.map(i => {
            return {
              id: tree.id + "" + i,
              orgName: "",
              dbNum: "",
              dbName: "",
              tableNum: "",
              tableName: tree.dbName + "_" + "表" + "_" + i,
              orginTableNum: "100",
              targetTableNum: "100",
              progress: "100%"
            };
          });
        } else {
          res = arr.map(i => {
            return {
              id: tree.id + "" + i,
              orgName: "",
              dbNum: "",
              dbName: tree.orgName + "_" + "数据库" + "_" + i,
              tableNum: "12",
              tableName: "",
              orginTableNum: "100",
              targetTableNum: "100",
              progress: "100%",
              hasChildren: true
            };
          });
        }

        console.log(res);
        resolve(res);
      }, 1000);
    }
  }
};
</script>

<style></style>
