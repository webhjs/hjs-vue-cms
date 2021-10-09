<template>
  <div class="h-full w-full flex">
    <pre class="bg-white z-50 h-full overflow-auto">{{ JSON.stringify(treeData, null, 4) }}</pre>
    <dragTreeTable
      class="flex-1 flex flex-col relative border-wrap"
      ref="table"
      :data="treeData"
      @drag="onTreeDataChange"
      :isdraggable="true"
      fixed
    >
      <template #selection="{row}">
        {{ row.name }}
      </template>

      <template #action="{row}">
        <el-button type="text" @click.stop.prevent="onEdit(row, true)"
          >新增子级</el-button
        >
        <el-button type="text"
          >修改</el-button
        >
        <el-button
          type="text"
          style="color:#F56C6C"
          ><i>删除</i></el-button
        >
      </template>
    </dragTreeTable>
  </div>
</template>

<script>
import dragTreeTable from 'drag-tree-table'

export default {
  name: "treeTable",
  data() {
    return {
      treeData: {
        lists: [
          {
            "id": "40",
            "parent_id": "0",
            "order": "0",
            "name": "动物类",
            "open": true,
            "lists": [
              {
                "id": "30",
                "parent_id": "40",
                "open": true,
                "order": '0',
                "name": "老虎",
                "lists": []
              }
            ]
          }, {
            "id": "5",
            "parent_id": "0",
            "order": "1",
            "name": "昆虫类",
            "open": true,
            "lists": [
              {
                "id": "12",
                "parent_id": "5",
                "open": true,
                "order": '0',
                "name": "蚂蚁",
                "lists": []
              }
            ]
          },
          {
            "id": '19',
            "parent_id": '0',
            "order": '2',
            "name": "植物类",
            "open": true,
            "lists": []
          }
        ],
        columns: [
          {
            type: "checkbox",
            isContainChildren: true,
            width: 100,
            align: "center",
            onChange: item => {
              alert("您选中了" + item.length + "条数据");
            }
          },
          {
            type: 'selection',
            title: '名称',
            field: 'name',
            width: 200,
            align: 'center',
            formatter: (item) => {
              return '<a>' + item.name + '</a>'
            }
          },
          {
            title: '操作',
            type: 'action',
            width: 350,
            align: 'center',
            // actions: [
            //   {
            //     text: '查看角色',
            //     onclick: this.onDetail,
            //     formatter: (item) => {
            //       return '<i style="padding: 0 5px">查看角色</i>'
            //     }
            //   },
            //   {
            //     text: '编辑',
            //     onclick: this.onEdit,
            //     formatter: (item) => {
            //       return '<i>编辑</i>'
            //     }
            //   }
            // ]
          },
        ],
        custom_field: { // 自定义字段对于拖拽重要
          id: "id",
          order: "order",
          lists: "lists",
          parent_id: "parent_id"
        }
      }
    }
  },
  components: {
    dragTreeTable
  },
  methods: {
    onDetail() {
      console.log(1212)
    },
    onEdit() {
      console.log(99999999999)
    },
    onTreeDataChange(lists) {
      console.log(lists)
      this.treeData.lists = lists
    }
  }
}
</script>

<style scoped>

</style>