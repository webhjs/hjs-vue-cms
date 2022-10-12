<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-07-14 16:58:28
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-22 16:44:29
-->
<template>
  <div>
    <div class="header" style="margin: 10px 0; text-align: right">
      <el-button round size="small" @click="chageJsonData">无刷更新</el-button>
    </div>
    <div class="dragger-wrap" v-flow-drag v-flow-wheel>
      <div class="right" :id="`right${id}`">
        <template v-for="item in jsonList.nodeList">
          <NodeItem :key="item.id" :id="id" :data="item" />
        </template>
      </div>
    </div>
    <pre
      v-if="false"
      style="
        position: fixed;
        top: 0;
        left: 0;
        background: white;
        height: 100vh;
        overflow: auto;
      "
    >
      {{ jsonList }}
    </pre>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import Contextjs from "hjs-contextmenu";
import Monaco from "@/components/Monaco";
import NodeItem from "./components/node-item-circular";
export default {
  components: {
    Contextjs,
    Monaco,
    NodeItem,
  },
  props: {
    id: {
      type: String,
      default: "jsplumb",
    },
    percent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      jsonList: {
        "name": "流程B",
        "nodeList": [
            {
                "id": "verticaljs1f1j5qahabs",
                "type": "vertical",
                "left": "0.75%",
                "top": "10.40%",
                "icon": "iconfont icon-yaowu1"
            },
            {
                "id": "verticaljs1zozgmrhjjr",
                "type": "vertical",
                "left": "14.45%",
                "top": "10.20%",
                "status": "running",
                "icon": "iconfont icon-yaowu1"
            },
            {
                "id": "verticaljs1px4nar8il",
                "type": "vertical",
                "left": "27.82%",
                "top": "10.00%",
                "status": "success",
                "icon": "iconfont icon-yaowu1"
            },
            {
                "id": "verticaljs1ene0rtw1n",
                "type": "vertical",
                "left": "42.36%",
                "top": "32.80%",
                "status": "warning",
                "icon": "iconfont icon-yaowu1"
            },
            {
                "id": "verticaljs1jujzsdjm5c",
                "type": "vertical",
                "left": "42.36%",
                "top": "58.40%",
                "icon": "iconfont icon-yaowu1"
            },
            {
                "id": "verticaljs1ukbklqs7ma",
                "type": "vertical",
                "left": "42.44%",
                "top": "80.80%",
                "status": "error",
                "toptip": "03.65秒",
                "name": "节点A",
                "icon": "iconfont icon-yaowu1"
            },
            {
                "id": "verticaljs1xhuqg8ds8q",
                "type": "vertical",
                "left": "62.71%",
                "top": "32.40%",
                "icon": "iconfont icon-yaowu1"
            },
            {
                "id": "verticaljs1wdryxrdxc",
                "type": "vertical",
                "left": "78.65%",
                "top": "11.20%",
                "status": "warning",
                "toptip": "0.65秒",
                "name": "节点B",
                "icon": "iconfont icon-yaowu1"
            },
            {
                "id": "verticaljs1tglg42loy",
                "type": "vertical",
                "left": "90.95%",
                "top": "11.00%",
                "icon": "iconfont icon-yaowu1"
            }
        ],
        "lineList": [
            {
                "from": "verticaljs1px4nar8il",
                "to": "verticaljs1wdryxrdxc"
            },
            {
                "from": "verticaljs1f1j5qahabs",
                "to": "verticaljs1zozgmrhjjr"
            },
            {
                "from": "verticaljs1zozgmrhjjr",
                "to": "verticaljs1px4nar8il"
            },
            {
                "from": "verticaljs1px4nar8il",
                "to": "verticaljs1ene0rtw1n"
            },
            {
                "from": "verticaljs1px4nar8il",
                "to": "verticaljs1jujzsdjm5c"
            },
            {
                "from": "verticaljs1px4nar8il",
                "to": "verticaljs1ukbklqs7ma"
            },
            {
                "from": "verticaljs1ene0rtw1n",
                "to": "verticaljs1xhuqg8ds8q"
            },
            {
                "from": "verticaljs1xhuqg8ds8q",
                "to": "verticaljs1wdryxrdxc"
            },
            {
                "from": "verticaljs1jujzsdjm5c",
                "to": "verticaljs1wdryxrdxc"
            },
            {
                "from": "verticaljs1wdryxrdxc",
                "to": "verticaljs1tglg42loy"
            }
        ]
      }
    };
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.jsplumb.destroy();
  },
  mounted() {
    this.$nextTick(() => {
      this.initJsPlumb();
    });
  },
  methods: {
    // 数据更新
    chageJsonData() {
      this.reloadData({
        name: "流程B",
        nodeList: [
          {
            id: "nodeA",
            name: "节点A-不可拖拽",
            type: "horizontal",
            left: "18px",
            top: "223px",
            icon: "iconfont icon-hushi3",
            status: "success",
            noDarag: true,
          },
          {
            id: "nodeB",
            type: "vertical",
            name: "流程B-节点B",
            left: "351px",
            top: "96px",
            icon: "iconfont icon-yiliao-copy",
            status: "error",
          },
          {
            id: "nodeC",
            name: "流程B-节点C",
            type: "horizontal",
            left: "354px",
            top: "351px",
            icon: "iconfont icon-yiliao21",
            status: "warning",
          },
          {
            id: "nodeD",
            name: "B-节点D",
            type: "icon-text",
            left: "723px",
            top: "215px",
            icon: "iconfont icon-yiliao23",
            status: "running",
          },
        ],
        lineList: [
          {
            from: "nodeA",
            to: "nodeB",
            label: "条件A",
            error: true,
          },
          {
            from: "nodeA",
            to: "nodeC",
            label: "条件B",
          },
          {
            from: "nodeB",
            to: "nodeD",
          },
          {
            from: "nodeC",
            to: "nodeD",
          },
        ],
      });
    },
    // 数据重绘
    reloadData(jsonList) {
      this.jsplumb?.deleteEveryConnection();
      this.jsplumb?.deleteEveryEndpoint();
      try {
        if (!jsonList.nodeList || !jsonList.lineList) {
          this.$message.warning("流程对象需要包含nodeList、lineList属性");
          return;
        }
        this.jsonList = jsonList;
        this.$nextTick(() => {
          this._initConnect(jsonList);
          this.dialogVisible = false;
        });
      } catch (err) {
        this.$message.warning("初始化对象必须是json对象");
        this.dialogVisible = false;
      }
    },
    // 真实id
    idString(id) {
      return id.slice(0, -this.id.length);
    },
    // 添加一个连接点
    _addPoint(sourceId) {
      this.jsplumb.makeSource(sourceId, {
        filter: ".anchor",
        filterExclude: false,
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        anchor: "Continuous",
        // 是否允许自己连接自己
        allowLoopback: true,
        maxConnections: 1,
        onMaxConnections: function (info, e) {
          console.log(`超过了最大值连线: ${info.maxConnections}`);
        },
      });
      this.jsplumb.makeTarget(sourceId, {
        filter: ".anchor",
        filterExclude: false,
        // 是否允许自己连接自己
        anchor: "Continuous",
        allowLoopback: true,
        maxConnections: 1,
        dropOptions: { hoverClass: "ef-drop-hover" },
      });
    },
    // 添加一个连线
    _connect(obj, item) {
      const connect = this.jsplumb.connect(
        {
          ...obj,
        },
        {
          label: item.label,
          paintStyle: {
            stroke: item.error ? "#F18383" : "#999",
            strokeWidth: 1,
            outlineWidth: 1,
            outlineStroke: "transparent",
          },
          endpointStyle: {
            radius: 4,
            fill: item.error ? "#F18383" : "#999",
          }, // 端口样式
          // 动态锚点、提供了4个方向 Continuous、AutoDefault
          // anchor: "Continuous",
          anchor: ['Left', 'Right', 'Top', 'Bottom', [0.3, 0, 0, -1], [0.7, 0, 0, -1], [0.3, 1, 0, 1], [0.7, 1, 0, 1]],
          labelStyle: {
            cssClass: item?.label ? "flowLabel" : "",
          },
        }
      );
    },
    // 根据json绘制流程图
    _initConnect(list) {
      const { nodeList, lineList } = list;
      nodeList.forEach((item) => {
        this._addPoint(item.id + this.id);
      });
      lineList.forEach((item) => {
        this._connect(
          {
            source: item.from + this.id,
            target: item.to + this.id
          },
          item
        );
      });
    },
    // 初始化流程图盒子
    initJsPlumb() {
      this.jsplumb = jsPlumb.getInstance({
        // Connector: ["Bezier", { curviness: 60 }],
        Connector: [
          "Flowchart",
          { stub: [10, 10], gap: 10, cornerRadius: 5, alwaysRespectStubs: true },
        ],
        PaintStyle: {
          stroke: "#7AB02C",
          strokeWidth: 2,
          // 设置外边线的颜色，默认设置透明，这样别人就看不见了，点击线的时候可以不用精确点击，参考 https://blog.csdn.net/roymno2/article/details/72717101
          outlineStroke: "transparent",
          // 线外边的宽，值越大，线的点击范围越大
          outlineWidth: 15,
        }, // 连线样式
        EndpointStyle: { radius: 7, fill: "#7AB02C" }, // 端口样式
        HoverPaintStyle: { cursor: "pointer", stroke: "#ec9f2e" },
        EndpointHoverStyle: { fill: "#ec9f2e" },
        DragOptions: { cursor: "pointer", zIndex: 2000 }, //拖动时鼠标停留在该元素上显示指针，通过css控制
        ConnectionOverlays: [
          [
            "Arrow", // 箭头样式
            {
              location: 1,
              visible: true,
              width: 8,
              length: 8,
              id: "ARROW",
              events: {
                click: function () {
                  alert("you clicked on the arrow overlay");
                },
              },
            },
          ],
          // [
          //   "Label", // 连线lable样式
          //   {
          //     location: 0.5,
          //     visible: true,
          //     id: "h_con",
          //     cssClass: "aLabel",
          //     events: {
          //       tap: function() {
          //         alert("hey");
          //       }
          //     }
          //   }
          // ]
        ],
        Container: `right${this.id}`,
      });
      this.jsplumb.ready(() => {
        // this.jsplumb.setContainer(`right${this.id}`)
        this.jsplumb.importDefaults({
          ConnectionsDetachable: false,
        });
        // 会使整个jsPlumb立即重绘。
        this.jsplumb.setSuspendDrawing(false, true);

        this.jsplumb.batch(() => {
          this.jsplumb.bind("beforeDrop", (conn) => {
            // 建立连接前修改后台数据
            if (conn.sourceId === conn.targetId) {
              this.$message.warning("不能连接自己");
              return false;
            } else {
              /* 修改数据 */
              const { lineList } = this.jsonList;
              const { sourceId, targetId } = conn;
              lineList.push({
                from: this.idString(sourceId),
                to: this.idString(targetId),
              });
              /* 修改数据 */
              return true;
            }
          });
          this.jsplumb.bind("contextmenu", (conn, originalEvent) => {
            originalEvent.preventDefault();
            this.lineShowMenu(originalEvent, conn);
          });
          // 监听连线事件
          // this.jsplumb.bind("connection", function(connInfo, originalEvent) {
          //   const connection = connInfo.connection;
          //   connection.getOverlay("h_con").setLabel("ggg"); // 连线lbale标签内容
          // });
          this.$nextTick(() => {
            this._initConnect(this.jsonList);
            /* 屏幕resize */
            const element = document.querySelector(`#right${this.id}`);
            let resizeTimer = null;
            const callback = (event, ui) => {
              if (resizeTimer) {
                clearTimeout(resizeTimer);
              }
              resizeTimer = setTimeout(() => {
                // 重新适配屏幕
                this.jsplumb.repaintEverything();
                this.wrapOffsetWidth = element.offsetWidth;
                this.wrapOffsetHeight = element.offsetHeight;
              }, 100);
            };
            this.observer = new ResizeObserver(callback);
            this.observer.observe(element);
            /* 屏幕resize */
          });
        });
      });

      // 销毁旧版本jsPlumbDemoLoaded这个方法
      jsPlumb.fire("jsPlumbDemoLoaded", this.jsplumb);
    },
  },
};
</script>
<style lang="stylus" scoped>
.dragger-wrap
  height: 500px
  display: flex
  border 1px solid #ccc
  overflow: hidden
  .right
    margin-left 8px
    user-select none
    flex: 1
    position relative
    overflow auto
    /deep/ .list-item
      position absolute
/deep/ .list-item
  height 50px
  width 50px
  display flex
  justify-content center
  align-items center
  border 1px solid #ccc
  z-index: 7
  color: white
  box-shadow: 2px 2px 19px #e0dfdf
  border-radius: 100%
  position: relative
  padding: 3px;
  border: 3px solid currentColor;
  background-color: currentColor;
  background-clip: content-box;
  .text
    white-space:nowrap;
    position: absolute;
    bottom: -25px;
    color: currentColor;
  .toptip
    white-space:nowrap;
    position: absolute;
    top: -25px;
    color: currentColor;
  &.success,&.warning,&.running,&.error
    color: white
  &.success
    color: #67c23a
  &.warning
    color: #e6a23c
  &.running
    color: #909399
  &.error
    color: #f56c6c
  &:hover
    z-index 10
</style>
