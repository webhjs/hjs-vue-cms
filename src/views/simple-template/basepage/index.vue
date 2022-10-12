<!--
 * @Descripttion: 运行环境
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-09 17:38:24
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-30 11:18:20
-->
<template>
  <div>
    <div class="h-full w-full bg-white flex flex-col">
      <div id="printid" style="overflow: auto" class="flex-1 flex p-2">
        <div class="left flex-1 border p-4">
          <el-input placeholder="输入关键字进行过滤" v-model="leftfilterText">
          </el-input>
          <el-tree
            ref="leftTree"
            show-checkbox
            node-key="menuCode"
            default-expand-all
            :filter-node-method="
              (value, data) => !value || data.menuName.indexOf(value) !== -1
            "
            :data="comDataLeft"
            :props="defaultProps"
            @check="(_, rest) => restLeftCheckbox = rest"
          >
          </el-tree>
        </div>
        <div class="mx-4">
          <el-button type="primary" @click="rightCheckbox">left</el-button>
          <el-button type="primary" @click="leftCheckbox">right</el-button>
        </div>
        <div class="right flex-1 border p-4">
          <el-input placeholder="输入关键字进行过滤" v-model="rightfilterText">
          </el-input>
          <el-tree
            ref="rightTree"
            show-checkbox
            node-key="menuCode"
            default-expand-all
            :filter-node-method="
              (value, data) => !value || data.menuName.indexOf(value) !== -1
            "
            :data="comDataRight"
            :props="defaultProps"
            @check="(_, rest) => restRightCheckbox = rest"
          >
          </el-tree>
        </div>
      </div>
      <div class="text-right p-4">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          background
          :page-sizes="[100, 200, 300, 400]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 100,
      totalRecord: 0,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      dataLeft: [
        {
          menuCode: 1,
          menuName: "一级 1",
          children: [
            {
              menuCode: 4,
              menuName: "二级 1-1",
              children: [
                {
                  menuCode: 9,
                  menuName: "三级 1-1-1",
                },
                {
                  menuCode: 10,
                  menuName: "三级 1-1-2",
                },
              ],
            },
          ],
        },
      ],
      dataRight: [
        {
          menuCode: 2,
          menuName: "一级 2",
          children: [
            {
              menuCode: 5,
              menuName: "二级 2-1",
            },
            {
              menuCode: 6,
              menuName: "二级 2-2",
            },
          ],
        },
        {
          menuCode: 3,
          menuName: "一级 3",
          children: [
            {
              menuCode: 7,
              menuName: "二级 3-1",
            },
            {
              menuCode: 8,
              menuName: "二级 3-2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "menuName",
        id: "menuCode",
      },
      leftfilterText: "",
      rightfilterText: "",
      restLeftCheckbox: {},
      restRightCheckbox: {},
    };
  },
  computed: {
    comDataLeft() {
      function itorChangePath(dataArr, path = "") {
        dataArr.forEach((it) => {
          it._parentPath = String(path);
          it._path = path ? path + "/" + it.menuCode : String(it.menuCode);
          if (it.children && it.children.length)
            itorChangePath(it.children, it._path);
        });
      }
      itorChangePath(this.dataLeft);
      return this.dataLeft;
    },
    comDataRight() {
      function itorChangePath(dataArr, path = "") {
        dataArr.forEach((it) => {
          it._parentPath = String(path);
          it._path = path ? path + "/" + it.menuCode : String(it.menuCode);
          if (it.children && it.children.length)
            itorChangePath(it.children, it._path);
        });
      }
      itorChangePath(this.dataRight);
      return this.dataRight;
    },
  },
  watch: {
    leftfilterText(newvalue) {
      this.$refs.leftTree.filter(newvalue);
    },
    rightfilterText(newvalue) {
      this.$refs.rightTree.filter(newvalue);
    },
  },
  methods: {
    serach(page) {
      page && (this.currentPage = page);
      this.api("login/logout", {
        ...this.formInline,
        page: this.currentPage,
        limit: this.pageSize,
      })
        .then((resp) => {
          if (resp.code == 200) {
            this.tableData = resp.data;
            this.totalRecord = parseInt(resp.count);
          } else {
            this.$message.error(resp.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.serach();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.serach();
    },
    filterNodeMethod(value, data) {
      console.log("11111111111111111");
      return !value || data.menuName.indexOf(value) !== -1;
    },
    // 获取树型数组匹配项目
    itorFindItem(param, payloadArr) {
      const itor = (pay) => {
        for (let p of pay) {
          if (p._path == param) {
            return p;
          } else if (p.children && p.children.length) {
            const result = itor(p.children);
            if (result) return result
          }
        }
      };
      return itor(payloadArr);
    },
    // 树转数组
    treeToArr(treeData) {
      const newTreeData = [];
      function itorData(tree) {
        tree.forEach((item) => {
          const cacheItem = JSON.parse(JSON.stringify(item));
          delete cacheItem.children;
          newTreeData.push(cacheItem);
          if (item.children) itorData(item.children);
        });
      }
      itorData(treeData);
      return newTreeData;
    },
    // 数组转树
    arrToTree(itemsArr) {
      const rootArr = [],
        redundanArr = [];
      const itemPathArr = itemsArr.map((path) => path._path);
      itemsArr.forEach((item) => {
        if (itemPathArr.includes(item._parentPath)) {
          redundanArr.push(item);
        } else {
          rootArr.push(item);
        }
      });
      const itorArrChild = (redundance) => {
        const newReduceArr = [];
        redundance.forEach((red) => {
          const find = this.itorFindItem(red._parentPath, rootArr);
          if (find) {
            if (find.children) {
              !find.children.find(f => f._path === red._path) && find.children.push(red)
            } else {
              find.children = [red]
            }
          } else newReduceArr.push(red);
        });
        newReduceArr.length && itorArrChild(newReduceArr);
      };
      itorArrChild(redundanArr);
      return rootArr;
    },
    // 数组去重
    removeMult(arr) {
      var temp = []; //建立一个临时数组
      for (var i = 0; i < arr.length; i++) {
        if (!temp.find(f => f._path == arr[i]._path)) {
          //如果临时数组里面没有这个数就把这个数存进去
          temp.push(arr[i]);
        }
      }
      return temp;
    },
    leftCheckbox() {
      const { comDataLeft } = this;
      const { checkedNodes } = this.restLeftCheckbox;
      const matchAllItem = (check, mathOriganTree) => {
        const result = [check];
        const itorAllItem = (item) => {
          const find = mathOriganTree.find((m) => item._parentPath == m._path);
          if (find) {
            result.push(find);
            itorAllItem(find);
          }
        };
        itorAllItem(check);
        return result;
      };
      const leftArr = this.treeToArr(comDataLeft);
      const leftArrCache = JSON.parse(JSON.stringify(leftArr)); 
      let newCheck = [];
      checkedNodes.forEach((check) => {
        newCheck = newCheck.concat(matchAllItem(check, leftArr));
      });
      const removeMultArr = this.removeMult(newCheck)
      const rightArr = this.treeToArr(this.comDataRight);
      const finyArr = this.removeMult(removeMultArr.concat(rightArr))
      this.dataRight = this.arrToTree(finyArr)

      const leftCheckNodePaths = checkedNodes.map(m => m._path)
      this.dataLeft = this.arrToTree(leftArrCache.filter(m => !leftCheckNodePaths.includes(m._path)))
    },
    rightCheckbox() {
      const { comDataRight } = this;
      const { checkedNodes } = this.restRightCheckbox;
      const matchAllItem = (check, mathOriganTree) => {
        const result = [check];
        const itorAllItem = (item) => {
          const find = mathOriganTree.find((m) => item._parentPath == m._path);
          if (find) {
            result.push(find);
            itorAllItem(find);
          }
        };
        itorAllItem(check);
        return result;
      };
      const rightArr = this.treeToArr(comDataRight);
      const rightArrCache = JSON.parse(JSON.stringify(rightArr)); 
      let newCheck = [];
      checkedNodes.forEach((check) => {
        newCheck = newCheck.concat(matchAllItem(check, rightArr));
      });
      const removeMultArr = this.removeMult(newCheck)
      const leftArr = this.treeToArr(this.comDataLeft);
      const finyArr = this.removeMult(removeMultArr.concat(leftArr))
      this.dataLeft = this.arrToTree(finyArr)

      const rightCheckNodePaths = checkedNodes.map(m => m._path)
      this.dataRight = this.arrToTree(rightArrCache.filter(m => !rightCheckNodePaths.includes(m._path)))
    },
  },
};
</script>

<style scoped lang="stylus">
.input-with-select {
  width: 300px;

  /deep/ .el-button--medium {
    padding: 10px 11px;
    background: #1890ff;
    color: white;
  }

  /deep/ .el-input-group__append, /deep/ .el-input-group__prepend {
    padding: 0 16px;
  }

  /deep/ .el-button--medium {
    border-radius: 0 4px 4px 0;
  }
}

/deep/ .el-form-item__label {
  color: #888;
}

.w-250 {
  width: 250px;
}

/deep/ .vertical {
  vertical-align: middle;
}
</style>
