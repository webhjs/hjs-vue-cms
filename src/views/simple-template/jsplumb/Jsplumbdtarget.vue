<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-07-14 16:58:28
 * @LastEditors: 金苏
 * @LastEditTime: 2021-07-21 16:32:14
-->
<template>
  <div>
    <div class="header" style="margin: 10px 0;text-align: right;">
      <el-button round size="small" @click="dialogVisible = true"
        >流程信息</el-button
      >
    </div>
    <div class="dragger-wrap">
      <div class="left">
        <div
          class="list-item"
          type="horizontal"
          :id="`horizontal${id}`"
          draggable="true"
          @dragstart="drag($event)"
        >
          <i class="iconfont icon-hushi" style="font-size:30px;"></i>
          <span class="text"></span>
        </div>
        <div
          class="list-item"
          style="height: 40px;"
          type="vertical"
          :id="`vertical${id}`"
          draggable="true"
          @dragstart="drag($event)"
        >
          <i
            class="iconfont icon-yaowu1"
            style="font-size:24px;"
          ></i>
          <span class="text"></span>
        </div>
      </div>
      <div
        class="right"
        :id="`right${id}`"
        @drop="drop($event)"
        @dragover="allowDrop($event)"
      ></div>
      <!-- 右击菜单 -->
      <contextjs
        id="operate-action"
        :page="pagePosition"
        :visble.sync="visble"
        style="z-index: 7"
      >
        <ul
          class="bg-white w-28 text-black rounded border text-gray-500 cursor-pointer curstom text-sm  border-gray-100"
        >
          <li class="px-2 py-1 border-b border-gray-100" @click="closeNode">
            <i class="el-icon-refresh mr-1" />删除节点
          </li>
        </ul>
      </contextjs>
      <!-- 右击菜单 -->
      <!-- 弹出框 -->
      <el-dialog title="流程数据信息" :visible.sync="dialogVisible" width="50%">
        <el-alert
          style="transform: translateY(-18px);"
          title="使用说明"
          type="warning"
          description="以下流程信息可以被存储起来，方便下一次流程加载"
          close-text="ok"
          show-icon
        />
        <div style="height: 500px">
          <Monaco v-model="jsonList" isShowLanguage />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="reloadData();dialogVisible = false" size="small">
            保 存
          </el-button>
        </span>
      </el-dialog>
      <!-- 弹出框 -->
    </div>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import Contextjs from "hjs-contextmenu";
import Monaco from "@/components/Monaco";
export default {
  components: {
    Contextjs,
    Monaco
  },
  props: {
    id: {
      type: String,
      default: "jsplumb"
    }
  },
  data() {
    return {
      pagePosition: {},
      visble: false,
      dialogVisible: false,
      jsonList: {
        name: "流程B",
        nodeList: [
          {
            id: "nodeA",
            name: "节点A-不可拖拽",
            type: "horizontal",
            left: "18px",
            top: "223px",
            icon: "icon-hushi3",
            status: "success",
            noDarag: true
          },
          {
            id: "nodeB",
            type: "vertical",
            name: "流程B-节点B",
            left: "351px",
            top: "96px",
            icon: "icon-yiliao-copy",
            status: "error"
          },
          {
            id: "nodeC",
            name: "流程B-节点C",
            type: "horizontal",
            left: "354px",
            top: "351px",
            icon: "icon-yiliao21",
            status: "warning"
          },
          {
            id: "nodeD",
            name: "流程B-节点D",
            type: "vertical",
            left: "723px",
            top: "215px",
            icon: "icon-yiliao23",
            status: "running"
          }
        ],
        lineList: [
          {
            from: "nodeA",
            to: "nodeB",
            label: "条件A"
          },
          {
            from: "nodeA",
            to: "nodeC",
            label: "条件B"
          },
          {
            from: "nodeB",
            to: "nodeD"
          },
          {
            from: "nodeC",
            to: "nodeD"
          }
        ]
      }
    };
  },
  beforeDestroy() {
    this.jsplumb.destroy();
  },
  mounted() {
    this.$nextTick(() => {
      this.initJsPlumb();
    });
  },
  methods: {
    reloadData() {
      this.jsplumb?.deleteEveryConnection();
      this.jsplumb?.deleteEveryEndpoint();
      document.getElementById(`right${this.id}`).innerHTML = "";
      this._initConnect(this.jsonList)
    },
    createdList(list) {
      var root = document.getElementById(`right${this.id}`);
      var fragment = document.createDocumentFragment();
      for (let i = 0; i < list.length; i++) {
        const sourceNode = document.querySelector(
          `.left .list-item[type=${list[i].type}]`
        );
        const clonedNode = sourceNode.cloneNode(true);
        clonedNode.querySelector("i").classList = `iconfont ${list[i].icon}`;
        clonedNode.querySelector(".text").innerHTML = `${list[i].name}`;
        clonedNode.classList.add(`${list[i].status}`);
        clonedNode.setAttribute("draggable", false);
        clonedNode.setAttribute("id", list[i].id);
        clonedNode.style.top = list[i].top;
        clonedNode.style.left = list[i].left;
        fragment.appendChild(clonedNode);
        /* 分片绑定事件 */
        fragment.getElementById(list[i].id).addEventListener("contextmenu", ev => {
          ev.preventDefault();
          this.showMenu(ev, list[i].id);
        });
        /* 分片绑定事件 */
      }
      root.appendChild(fragment);
    },
    // 删除节点
    closeNode() {
      this.jsplumb.remove(this.nodeId);
      this.visble = false;
    },
    //右击菜单
    showMenu(ev, id) {
      this.pagePosition = { pageX: ev.pageX, pageY: ev.pageY };
      this.nodeId = id;
      this.visble = true;
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    drag(ev) {
      ev.dataTransfer.setData("sourceId", ev.target.id);
      ev.dataTransfer.setData("sourceOffsetX", ev.offsetX);
      ev.dataTransfer.setData("sourceOffsetY", ev.offsetY);
    },
    drop(ev) {
      ev.preventDefault();
      const sourceId = ev.dataTransfer.getData("sourceId");
      if (!sourceId) return;
      const { offsetX, offsetY } = ev;
      const { scrollLeft, scrollTop } = ev.target;
      const sourceOffsetX = ev.dataTransfer.getData("sourceOffsetX");
      const sourceOffsetY = ev.dataTransfer.getData("sourceOffsetY");
      const sourceNode = document.getElementById(sourceId); // 源节点
      const clonedNode = sourceNode.cloneNode(true); // 克隆节点
      clonedNode.setAttribute("draggable", false);
      const timer = new Date().getTime()
      clonedNode.setAttribute("id", sourceId + timer); // 修改一下id 值，避免id 重复
      clonedNode.style.left =
        (offsetX - sourceOffsetX + scrollLeft > 0
          ? offsetX - sourceOffsetX + scrollLeft
          : 0) + "px";
      clonedNode.style.top =
        (offsetY - sourceOffsetY + scrollTop > 0
          ? offsetY - sourceOffsetY + scrollTop
          : 0) + "px";
      ev.target.appendChild(clonedNode); // 目标节点

      this._addPoint(sourceId + timer);
      (id => {
        // 设置允许拖拽
        this._draggable(id)
        // 监听右击事件
        document.getElementById(id).addEventListener("contextmenu", ev => {
          ev.preventDefault();
          this.showMenu(ev, id);
        });
      })(sourceId + timer);
    },
    // 添加拖拽
    _draggable(id) {
      this.jsplumb.draggable(id, {
        containment: 'parent',  // 限制拖拽区域
        stop: function (el) { // 拖拽回调
          console.log('stop',el)
        }
      }); // , { grid: [20, 20] } 拖拽步长
    },
    // 添加一个连接点
    _addPoint(sourceId) {
      this.jsplumb.makeSource(sourceId, {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        filter: ".iconfont",
        filterExclude: false,
        anchor: "Continuous",
        // 是否允许自己连接自己
        allowLoopback: true,
        maxConnections: -1,
        onMaxConnections: function(info, e) {
          console.log(`超过了最大值连线: ${info.maxConnections}`);
        }
      });
      this.jsplumb.makeTarget(sourceId, {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        filter: ".iconfont",
        filterExclude: false,
        // 是否允许自己连接自己
        anchor: "Continuous",
        allowLoopback: true,
        dropOptions: { hoverClass: "ef-drop-hover" }
      });
    },
    // 添加一个连线
    _connect(obj) {
      this.jsplumb.connect({
        ...obj
      }, {
        isSource: true,
        isTarget: true,
        // 动态锚点、提供了4个方向 Continuous、AutoDefault
        anchor: "Continuous",
        // 设置连线上面的label样式
        labelStyle: {
          cssClass: "flowLabel"
        },
        // 修改了jsplumb 源码，支持label 为空传入自定义style
        emptyLabelStyle: {
          cssClass: "emptyFlowLabel"
        }
      });
    },
    // 根据json绘制流程图
    _initConnect(list) {
      const { nodeList, lineList } = list;
      this.createdList(nodeList);
      nodeList.forEach(item => {
        this._addPoint(item.id);
        if (!item.noDarag) {
          this._draggable(item.id)
        }
      });
      lineList.forEach(item => {
        this._connect({
          label: item.label ? item.label : '',
          source: item.from,
          target: item.to
        });
      })
    },
    // 初始化流程图盒子
    initJsPlumb() {
      this.jsplumb = jsPlumb.getInstance({
        Connector: ["Bezier", { curviness: 60 }],
        // Connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
        PaintStyle: { stroke: "#7AB02C", strokeWidth: 2 }, // 连线样式
        EndpointStyle: { radius: 9, fill: "#7AB02C" }, // 端口样式
        HoverPaintStyle: { stroke: "#ec9f2e" },
        EndpointHoverStyle: { fill: "#ec9f2e" },
        DragOptions: { cursor: "pointer", zIndex: 2000 }, // 默认配置
        ConnectionOverlays: [
          [
            "Arrow", // 箭头样式
            {
              location: 0.95,
              visible: true,
              width: 11,
              length: 11,
              id: "ARROW",
              events: {
                click: function() {
                  alert("you clicked on the arrow overlay");
                }
              }
            }
          ],
          [
            "Label", // 连线lable样式
            {
              location: 0.5,
              id: "label",
              cssClass: "aLabel",
              events: {
                tap: function() {
                  alert("hey");
                }
              }
            }
          ]
        ],
        Container: `right${this.id}`
      });
      this.jsplumb.ready(() => {
        // this.jsplumb.setContainer(`right${this.id}`)
        this.jsplumb.importDefaults({
          ConnectionsDetachable: false
        });
        // 会使整个jsPlumb立即重绘。
        this.jsplumb.setSuspendDrawing(false, true);

        this.jsplumb.batch(() => {
          this.jsplumb.bind("click", conn => {
            this.$confirm("确认删除子连线", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              // 删除链接线
              this.jsplumb.deleteConnection(conn); // detach
            });
          });
          this.jsplumb.bind("beforeDrop", conn => {
            // 建立连接前修改后台数据
            if (conn.sourceId === conn.targetId) {
              this.$message.warning("不能连接自己");
              return false;
            } else {
              return true;
            }
          });
          // 监听连线事件
          // this.jsplumb.bind("connection", function(connInfo, originalEvent) {
          //   const connection = connInfo.connection;
          //   connection.getOverlay("label").setLabel("ggg"); // 连线lbale标签内容
          // });
          this._initConnect(this.jsonList)
        });
      });

      // 销毁旧版本jsPlumbDemoLoaded这个方法
      jsPlumb.fire("jsPlumbDemoLoaded", this.jsplumb);
    }
  }
};
</script>
<style lang="stylus" scoped>
.dragger-wrap
  height: 500px
  display: flex
  .left
    flex: 0 0 250px
    display flex
    justify-content flex-start
    flex-wrap: wrap
    align-content: flex-start
    .list-item
      margin: 0 5px 5px 0
  .right
    margin-left 8px
    user-select none
    flex: 1
    border 1px solid #ccc
    position relative
    overflow auto
    .list-item
      position absolute
      .iconfont
        cursor pointer
.list-item
  height 80px
  width 80px
  display flex
  justify-content center
  cursor move
  align-items center
  border 1px solid #ccc
  z-index: 7
  background: white
  box-shadow: 2px 2px 19px #e0dfdf
  border-radius: 5px
  position: relative
  .text
    white-space:nowrap;
    position: absolute;
    bottom: -25px;
    color: #000;
  &.success
    background: #67c23a
    color: white
  &.warning
    background: #e6a23c
    color: white
  &.running
    background: #909399
    color: white
  &.error
    background: #f56c6c
    color: white
/deep/ .jtk-endpoint
  z-index 5
/deep/ .aLabel
  color red
</style>
