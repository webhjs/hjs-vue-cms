<!--
 * @Author: your name
 * @Date: 2021-02-22 10:53:23
 * @LastEditTime: 2021-03-08 15:27:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\views\home\index.vue
-->
<template>
  <fragment>
    <div :style="{ width: width,margin: '0 auto' }">
      <div class="extra">
        <slot name="extra" />
      </div>
      <div class="title">
        <slot name="title" />
      </div>
    </div>
    <div class="table-wrap" :style="{ width: width,margin: '0 auto 20px auto' }">
      <el-table
        class="custom-table"
        :data="tabledata"
        border
        size="mini"
      >
        <el-table-column label="排名" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="column in tableColumn"
          :key="column"
          align="center"
          :label="column"
        >
          <template slot-scope="scope">
            {{ scope.row[column] }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </fragment>
</template>
<script>
export default {
  props: {
    tabledata: {
      type: Array,
      default() {
        return {}
      }
    },
    width: {
      type: String,
      default: '900px'
    }
  },
  computed: {
    tableColumn() {
      const keys = []
      for (let key in this.tabledata[0]) {
        keys.push(key)
      }
      return keys
    }
  }
}
</script>
<style lang="stylus" scoped>
.extra {
  font-size: 20px
  margin: 20px 0
}
.title {
  text-align: center
  font-weight: blod
  font-size: 30px
  margin-bottom: 15px
}
</style>
