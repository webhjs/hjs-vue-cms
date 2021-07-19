<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-07-14 16:58:28
 * @LastEditors: 金苏
 * @LastEditTime: 2021-07-19 17:02:04
-->
<template>
  <div class="dragger-wrap">
    <div class="left">
      <div
        class="list-item"
        :id="`yiyuan${id}`"
        draggable="true"
        @dragstart="drag($event)"
      >
        <i class="iconfont icon-yiyuan3" style="font-size:30px; color:#333"></i>
      </div>
      <div
        class="list-item"
        style="height: 40px;"
        :id="`yiliaoqixie${id}`"
        draggable="true"
        @dragstart="drag($event)"
      >
        <i
          class="iconfont icon-yiliaoqixie"
          style="font-size:30px; color:#333"
        ></i>
      </div>
      <div
        class="list-item"
        :id="`copy${id}`"
        draggable="true"
        @dragstart="drag($event)"
      >
        <i
          class="iconfont icon-yiliao-copy"
          style="font-size:30px; color:#333"
        ></i>
      </div>
      <div
        class="list-item"
        :id="`hushi3${id}`"
        draggable="true"
        @dragstart="drag($event)"
      >
        <i class="iconfont icon-hushi3" style="font-size:30px; color:#333"></i>
      </div>
    </div>
    <div
      class="right"
      :id="`right${id}`"
      @drop="drop($event)"
      @dragover="allowDrop($event)"
    >
      <div
        class="list-item"
        :id="`examplesource${id}`"
        style="top: 30px;right: 10px;"
      >
        <!-- @click="$message.warning('hellow')" -->
        <i class="iconfont icon-yiyuan3" style="font-size:30px; color:#333"></i>
      </div>
      <div
        class="list-item"
        :id="`exampletarget${id}`"
        style="top: 400px;right: 30px;"
      >
        <i
          class="iconfont icon-yiliao-copy"
          style="font-size:30px; color:#333;"
        ></i>
      </div>
    </div>
    <contextjs id="operate-action" :page="pagePosition" :visble.sync="visble" style="z-index: 7">
      <ul
        class="bg-white w-28 text-black rounded border text-gray-500 cursor-pointer curstom text-sm  border-gray-100"
      >
        <li class="px-2 py-1 border-b border-gray-100" @click="closeNode">
          <i class="el-icon-refresh mr-1" />删除节点
        </li>
      </ul>
    </contextjs>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import Contextjs from 'hjs-contextmenu'
export default {
  components: {
    Contextjs
  },
  props: {
    id: {
      type: String,
      default: "jsplumb"
    }
  },
  data() {
    return {
      inx: 0,
      pagePosition:{},
      visble:false
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
    // 删除节点
    closeNode() {
      this.jsplumb.remove(this.nodeId)
      this.visble = false
    },
    //右击菜单
    showMenu(ev, id){
      this.pagePosition = {pageX : ev.pageX , pageY : ev.pageY};
      this.nodeId = id
      this.visble = true
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
      clonedNode.setAttribute("id", sourceId + this.inx); // 修改一下id 值，避免id 重复
      clonedNode.style.left =
        (offsetX - sourceOffsetX + scrollLeft > 0 ? offsetX - sourceOffsetX + scrollLeft : 0) + "px";
      clonedNode.style.top =
        (offsetY - sourceOffsetY + scrollTop > 0 ? offsetY - sourceOffsetY + scrollTop : 0) + "px";
      ev.target.appendChild(clonedNode); // 目标节点

      this._addPoint(sourceId + this.inx);
      // 设置允许拖拽
      this.jsplumb.draggable(sourceId + this.inx, { grid: [20, 20] });
      ((id) => {
        document.getElementById(id).addEventListener('contextmenu', (ev) => {
          ev.preventDefault()
          this.showMenu(ev, id)
        }) 
      })(sourceId + this.inx)

      this.inx++;
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
              this.$message.warning('不能连接自己')
              return false
            } else {
              return true
            }
          });
          this.jsplumb.bind("connection", function(connInfo, originalEvent) {
            const connection = connInfo.connection;
            connection.getOverlay("label").setLabel("ggg"); // 连线lbale标签内容
          });

          this._addPoint(`examplesource${this.id}`);
          this._addPoint(`exampletarget${this.id}`);

          this.jsplumb.connect(
            {
              source: `examplesource${this.id}`,
              target: `exampletarget${this.id}`
            },
            {
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
            }
          );
          this.jsplumb.draggable(
            jsPlumb.getSelector(`#right${this.id}`),
            { grid: [20, 20] }
          );
          
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
            }, 100);
          };
          this.observer = new ResizeObserver(callback);
          this.observer.observe(element);
          /* 屏幕resize */
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
    justify-content space-between
    flex-wrap: wrap;
    align-content: flex-start
    .list-item
      margin-bottom: 5px
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
/deep/ .jtk-endpoint
  z-index 5
/deep/ .aLabel
  color red
</style>
