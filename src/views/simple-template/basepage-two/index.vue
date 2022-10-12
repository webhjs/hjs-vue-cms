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
            node-key="sn"
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
          <el-button type="primary" @click="leftCheckbox">left</el-button>
          <el-button type="primary" @click="rightCheckbox">right</el-button>
        </div>
        <div class="right flex-1 border p-4">
          <el-input placeholder="输入关键字进行过滤" v-model="rightfilterText">
          </el-input>
          <el-tree
            ref="rightTree"
            show-checkbox
            node-key="sn"
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataLeft: [],
      dataRight: [],
      defaultProps: {
        children: "children",
        label: "menuName",
        id: "menuCode",
      },
      leftfilterText: "",
      rightfilterText: "",
      restLeftCheckbox: {},
      restRightCheckbox: {}
    };
  },
  watch: {
    leftfilterText(newvalue) {
      this.$refs.leftTree.filter(newvalue);
    },
    rightfilterText(newvalue) {
      this.$refs.rightTree.filter(newvalue);
    }
  },
  computed: {
    comDataRight() {
      let newCheck = []
      JSON.parse(JSON.stringify(this.dataRight)).forEach((check) => {
        newCheck = newCheck.concat(this.matchAllItem(check, JSON.parse(JSON.stringify(this.allRight))));
      });
      return this.arrToTree(this.removeMult(newCheck))
    },
    comDataLeft() {
      let newCheck = []
      JSON.parse(JSON.stringify(this.dataLeft)).forEach((check) => {
        newCheck = newCheck.concat(this.matchAllItem(check, JSON.parse(JSON.stringify(this.allRight))));
      });
      return this.arrToTree(this.removeMult(newCheck))
    }
  },
  mounted() {
    setTimeout(() => {
      this.allRight = [
        {
          menuCode: 1,
          sn: 1,
          menuName: "一级 1",
          parentCode: null
        },
        {
          menuCode: 4,
          sn: 4,
          menuName: "二级 1-1",
          parentCode: 1
        },
        {
          menuCode: 9,
          sn: 9,
          menuName: "三级 1-1-1",
          parentCode: 4
        },
        {
          menuCode: 10,
          sn: 10,
          menuName: "三级 1-1-2",
          parentCode: 4
        },
        {
          menuCode: 2,
          sn: 2,
          menuName: "一级 2",
          parentCode: null,
        },
        {
          menuCode: 5,
          sn: 5,
          menuName: "二级 2-1",
          parentCode: 2
        },
        {
          menuCode: 6,
          sn: 6,
          menuName: "二级 2-2",
          parentCode: 2
        },
        {
          menuCode: 3,
          sn: 3,
          menuName: "一级 3",
          parentCode: null
        },
        {
          menuCode: 7,
          sn: 7,
          menuName: "二级 3-1",
          parentCode: 3
        },
        {
          menuCode: 8,
          sn: 8,
          menuName: "二级 3-2",
          parentCode: 3
        },
      ]
      setTimeout(() => {
        const tempLeft = [
          1, 4, 9, 10
        ]
        this.dataLeft = tempLeft.map(m => {
          return this.allRight.find(l => l.sn === m)
        })
        this.dataRight = this.allRight.filter(f => !this.dataLeft.find(s => s.menuCode == f.menuCode))
      }, 2000)
    })
  },
  methods: {
    // 获取树型数组匹配项目
    itorFindItem(param, payloadArr) {
      const itor = (pay) => {
        for (let p of pay) {
          if (p.menuCode == param) {
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
      const itemPathArr = itemsArr.map((path) => path.menuCode);
      itemsArr.forEach((item) => {
        if (itemPathArr.includes(item.parentCode)) {
          redundanArr.push(item);
        } else {
          rootArr.push(item);
        }
      });
      const itorArrChild = (redundance) => {
        const newReduceArr = [];
        redundance.forEach((red) => {
          const find = this.itorFindItem(red.parentCode, rootArr);
          if (find) {
            if (find.children) {
              !find.children.find(f => f.menuCode === red.menuCode) && find.children.push(red)
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
        if (!temp.find(f => f.menuCode == arr[i].menuCode)) {
          //如果临时数组里面没有这个数就把这个数存进去
          temp.push(arr[i]);
        }
      }
      return temp;
    },
    // 匹配数组中所有符合条件的父子级
    matchAllItem(check, mathOriganTree) {
      const result = [check];
      const itorAllItem = (item) => {
        const find = mathOriganTree.find((m) => item.parentCode == m.menuCode);
        if (find) {
          result.push(find);
          itorAllItem(find);
        }
      };
      itorAllItem(check);
      return result;
    },
    leftCheckbox() {
      const { checkedNodes } = this.restRightCheckbox;
      const checkedNodesCache = JSON.parse(JSON.stringify(checkedNodes)).map(m => ({ ...m, children: null}))
      this.dataLeft = this.dataLeft.concat(checkedNodesCache)
      this.dataRight = this.dataRight.filter(f => !checkedNodesCache.find(s => f.sn == s.sn))
    },
    rightCheckbox() {
      const { checkedNodes } = this.restLeftCheckbox;
      const checkedNodesCache = JSON.parse(JSON.stringify(checkedNodes)).map(m => ({ ...m, children: null}))
      this.dataRight = this.dataRight.concat(checkedNodesCache)
      this.dataLeft = this.dataLeft.filter(f => !checkedNodesCache.find(s => f.sn == s.sn))
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
