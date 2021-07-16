<!--
 * @name: 
 * @Descripttion: 下拉表格
 * @Author: Morning
 * @Date: 2021-03-27 16:38:21
 * @LastEditors: 金苏
 * @LastEditTime: 2021-05-11 14:37:40
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
    <el-button type="primary" @click="exportExcel">导出</el-button>
  </div>
</template>

<script>
import export_excel from "hjs-xlsx";
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
    /* 导出样式表格网上方法 */
    exportExcel() {
      const tHeader = [
        "船名",
        "船长",
        "货种",
        "载重吨",
        "净吨",
        "锚地",
        "预抵时间",
        "下锚时间",
        "预靠泊位"
      ]; //表头
      const title = ["锚地船舶", "", "", "", "", "", "", "", ""]; //标题
      //表头对应字段
      const filterVal = ["orgName", "dbNum"];
      const list = this.tableData;
      const data = this.formatJson(filterVal, list);
      data.map(item => {
        console.log(item)
        item.map((i, index) => {
          if (!i) {
            item[index] = "";
          }
        });
      });
      // console.log(data)
      // return
      const merges = ["A1:I1", "A2:B2"]; //合并单元格
      export_excel({
        title: title,
        header: tHeader,
        data,
        merges,
        filename: "锚地船舶",
        autoWidth: true,
        bookType: "xlsx",
        cellStyle: [
          {
            range: ["A1"],
            style: {
              font: {
                name: "宋体",
                sz: 18,
                //  color: {rgb: "ff0000"},
                bold: true,
                italic: false,
                underline: false
              },
              alignment: {
                horizontal: "center",
                vertical: "center"
              },
              fill: {
                fgColor: { rgb: "FCFF40" }
              }
            }
          },
          {
            range: ["A2:I2", "A3:B3"],
            style: {
              font: {
                // name: '宋体',
                sz: 14,
                // color: {rgb: "ff0000"},
                bold: true,
                italic: false,
                underline: false
              },
              fill: {
                fgColor: { rgb: "cccccc" }
              },
              alignment: {
                horizontal: "center",
                vertical: "center",
                // wrapText: "false" 文字是否换行
              }
            }
          }
        ]
      });
    },
    /* 格式化数据 */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
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
