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
       fsadfsd 
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
      }
    };
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
    }
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
