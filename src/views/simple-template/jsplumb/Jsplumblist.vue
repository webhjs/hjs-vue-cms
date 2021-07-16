<!--
 * @Descripttion: 
 * @version: 
 * @Author: morning
 * @Date: 2020-12-16 09:24:39
 * @LastEditors: 金苏
 * @LastEditTime: 2021-07-16 16:58:55
-->
<template>
  <div fluid class="contain">
    <div class="merage-warp">
      <!-- <el-botton @click="changeList">sure</el-botton> -->
      <div class="merage-left" v-if="isMerge && mergeIsMergeList.length">
        <el-row class="merge-li">
          <el-col
            v-for="(item, index) in mergeIsMergeList"
            :key="item.source.id"
            class="li"
          >
            <el-col :span="12">
              {{ item.source.name }}
            </el-col>
            <el-col :span="12">
              {{ item.target.name }}
              <i
                class="el-icon-circle-close icon"
                @click="removeItem(item, index)"
              />
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div id="merageRight" class="merage-right">
        <div id="diagramContainer">
          <ul class="left" v-if="comSourceList.length">
            <li
              v-for="source in comSourceList"
              class="item"
              :key="source.id"
              :id="source.unique"
            >
              {{ source.name }}
            </li>
          </ul>
          <ul class="right" v-if="comTargetList.length">
            <li
              v-for="target in comTargetList"
              class="item"
              :key="target.id"
              :id="target.unique"
            >
              {{ target.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPlumb } from 'jsplumb'
const common = {
  connector: ['Bezier'], // ['Straight', Flowchart, StateMachine] 连线类型
  endpoint: 'Dot', // 链接点样式 Rectangle
  anchor: ['Left', 'Right'], // 链接边
  paintStyle: { stroke: '#4caf50', strokeWidth: 3 },
  hoverPaintStyle: {
    stroke: 'lightblue'
  },
  endpointStyle: {
    fill: 'transparent',
    outlineStroke: 'green',
    outlineWidth: 1,
    radius: 5
  },
  endpointHoverStyle: {
    fill: 'transparent',
    outlineStroke: 'lightblue',
    outlineWidth: 2
  },
  overlays: [['Arrow', { width: 10, length: 10, location: 1 }]]
}
const style = {
  endpoint: 'Dot',
  // 公共样式
  paintStyle: {
    outlineStroke: 'green',
    strokeWidth: 1,
    radius: 5
  },
  hoverPaintStyle: {
    outlineStroke: 'lightblue'
  },
  connectorStyle: {
    stroke: '#4caf50',
    strokeWidth: 3 // 线条和箭头杨色
  },
  connectorHoverStyle: {
    stroke: 'lightblue'
  }
}
export default {
  name: 'jsplumb',
  props: {
    sourceList: Array,
    targetList: Array,
    isMerge: Boolean,
    relationArray: Array,
    multipleNum: {
      type: Number,
      default: -1
    }
  },
  computed: {
    comSourceList() {
      return this.sourceList.map((item) => {
        return {
          ...item,
          unique: item.name + '__Source'
        }
      })
    },
    comTargetList() {
      return this.targetList.map((item) => {
        return {
          ...item,
          unique: item.name + '__Target'
        }
      })
    },
    comRelationArray() {
      return this.relationArray.map((item) => {
        return {
          sourceId: item.fromcolumn + '__Source',
          targetId: item.name + '__Target',
          oragin: item
        }
      })
    }
  },
  data() {
    return {
      mergeIsMergeList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initJsPlumb()
    })
  },
  watch: {
    comRelationArray(newValue) {
      this.jsplumb?.deleteEveryConnection()
      this.$nextTick(() => {
        newValue.forEach((item) => {
          this.jsplumb.connect(
            {
              source: item.sourceId,
              target: item.targetId
            },
            common
          )
        })
      })
    },
    comSourceList(newValue) {
      this.jsplumb?.deleteEveryEndpoint()
      this.$nextTick(() => {
        newValue.forEach((item) => {
          this.jsplumb.makeSource(
            String(item.unique),
            {
              connectorOverlays: [
                [
                  'Arrow',
                  {
                    width: 10,
                    length: 10,
                    location: 1
                  }
                ]
              ],
              anchors: ["Left", "Right"],
              maxConnections: this.multipleNum // 设置连接点最多可以连接几条线
            },
            style
          )
        })
      })
    },
    comTargetList(newValue) {
      this.jsplumb?.deleteEveryEndpoint()
      this.$nextTick(() => {
        newValue.forEach((item) => {
          this.jsplumb.makeTarget(
            String(item.unique),
            {
              anchors: ["Left", "Right"],
              maxConnections: this.multipleNum
            },
            style
          )
        })
      })
    },
    isMerge: {
      handler(newValue) {
        if (newValue) {
          this.mergeIsMergeList = []
          const tempsourceList = this.sourceList?.concat()
          const temptargetList = this.targetList?.concat()
          const tempRelationArray = this.relationArray?.concat()
          this.sourceList.forEach((source, index) => {
            this.targetList.forEach((target, inx) => {
              if (source.name === target.name) {
                this.mergeIsMergeList.push({
                  source,
                  target
                })
                // 自动匹配连线
                tempRelationArray.push({
                  fromcolumn: source.name,
                  name: target.name
                })
                tempsourceList.splice(index, 1)
                temptargetList.splice(inx, 1)
              }
            })
          })
          this.$emit('update:sourceList', tempsourceList)
          this.$emit('update:targetList', temptargetList)
          this.$emit('update:relationArray', tempRelationArray)
          this.$nextTick(() => {
            // 连线
            this.comRelationArray.forEach((item) => {
              this.jsplumb.connect(
                {
                  source: item.sourceId,
                  target: item.targetId
                },
                common
              )
            })
          })
        } else {
          const tempsourceList = this.sourceList?.concat()
          const temptargetList = this.targetList?.concat()
          let tempRelationArray = this.relationArray?.concat()
          this.mergeIsMergeList.forEach((item) => {
            tempsourceList.push(item.source)
            temptargetList.push(item.target)
            tempRelationArray = tempRelationArray.filter(
              (fit) => fit.name !== item.target.name
            )
          })
          this.mergeIsMergeList = []
          this.$emit('update:sourceList', tempsourceList)
          this.$emit('update:targetList', temptargetList)
          this.$emit('update:relationArray', tempRelationArray)
          this.$nextTick(() => {
            // 连线
            this.comRelationArray.forEach((item) => {
              this.jsplumb.connect(
                {
                  source: item.sourceId,
                  target: item.targetId
                },
                common
              )
            })
          })
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.jsplumb.destroy()
  },
  methods: {
    // changeList() {
    //   this.$emit('update:relationArray', {})
    // },
    regirsterElement() {
      // 连线之前先把连线的关系清除
      // this.jsplumb.reset()

      this.comSourceList.forEach((item) => {
        this.jsplumb.makeSource(
          String(item.unique),
          {
            connectorOverlays: [
              [
                'Arrow',
                {
                  width: 10,
                  length: 10,
                  location: 1
                }
              ]
            ],
            anchor: ["Left", "Right"],
            maxConnections: this.multipleNum
          },
          style
        )
      })
      this.comTargetList.forEach((item) => {
        this.jsplumb.makeTarget(
          String(item.unique),
          {
            anchor: ["Left", "Right"],
            maxConnections: this.multipleNum
          },
          style
        )
      })
      this.comRelationArray.forEach((item) => {
        this.jsplumb.connect(
          {
            source: item.sourceId,
            target: item.targetId
          },
          common
        )
      })
    },
    initJsPlumb() {
      this.jsplumb = jsPlumb.getInstance({
        Container: 'diagramContainer'
      })
      // this.jsplumb.setContainer('diagramContainer')
      this.jsplumb.importDefaults({
        ConnectionsDetachable: false
      })
      this.jsplumb.bind('click', (conn) => {
        this.$confirm('确认删除子连线', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const tempRelation = this.relationArray.filter((item) => {
            return (
              item.fromcolumn !== conn.sourceId.replace(/__Source/g, '') ||
              item.name !== conn.targetId.replace(/__Target/g, '')
            )
          })
          this.$emit('update:relationArray', tempRelation)
          // 删除链接线
          this.jsplumb.deleteConnection(conn) // detach
        })
      })
      this.regirsterElement()
      this.jsplumb.bind('beforeDrop', (conn) => {
        // console.log(conn.sourceId.replace(/(.*?)__Source/g, $1))
        // 连线监听
        const tempRelation = this.relationArray.concat()
        tempRelation.push({
          fromcolumn: conn.sourceId.replace(/__Source/g, ''),
          name: conn.targetId.replace(/__Target/g, '')
        })
        this.$emit('update:relationArray', tempRelation)
        return true
      })
    },
    removeItem(item, index) {
      const tempsourceList = this.sourceList?.concat()
      const temptargetList = this.targetList?.concat()
      tempsourceList.push(item.source)
      temptargetList.push(item.target)
      this.mergeIsMergeList.splice(index, 1)
      if (!this.mergeIsMergeList.length) {
        this.$emit('update:isMerge', false)
      }
      this.$emit('update:sourceList', tempsourceList)
      this.$emit('update:targetList', temptargetList)
      this.$nextTick(() => {
        // 连线
        this.comRelationArray.forEach((item) => {
          this.jsplumb.connect(
            {
              source: item.sourceId,
              target: item.targetId
            },
            common
          )
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.contain
  padding: 12px 0
  .merage-warp
    display: flex
    justify-content: space-between
    height: 290px
    .merage-left
      overflow: auto
      padding: 10px
      flex: 0 0 35%
      border: 1px solid #ccc
      margin-right: 20px
      display: flex
      justify-content: space-between
      .merge-li
        width: 100%
        border: 1px solid #ccc
        .li
          word-wrap: break-word
          margin: 0
          padding: 0 10px
          width: 100%
          line-height: 25px
          min-height: 30px
          border-bottom: 1px solid #ccc
          user-select: none
          position: relative
          .icon
            position: absolute
            right: 3px
            top: 8px
            cursor: pointer
    .merage-right
      flex: 1
      height: 100%
      #diagramContainer
        position: relative
        padding: 10px
        margin: 0 auto
        height: 100%
        overflow: scroll
        border: 1px solid #ccc
        border-radius: 5px
        .left,.right
          display: inline-block
          width: 25%
          margin: 0
          padding: 0
          border-top: 1px solid #ccc
        .left
          position: absolute
          left: 8px
        .right
          position: absolute
          right: 0
.item
  list-style: none
  word-wrap: break-word
  margin: 0
  padding: 0 10px
  width: 100%
  line-height: 25px
  min-height: 30px
  border-bottom: 1px solid #ccc
  border-right: 1px solid #ccc
  border-left: 1px solid #ccc
  user-select: none
</style>
