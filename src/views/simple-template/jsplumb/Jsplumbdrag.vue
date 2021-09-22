<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-07-14 16:58:28
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-22 16:23:44
-->
<template>
<div>
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
        <i class='iconfont icon-yiliaoqixie' style='font-size:30px; color:#333'></i>
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
        style="height: 40px;width: 120px;"
        type="icon-text"
        :id="`icon-text${id}`"
        draggable="true"
        @dragstart="drag($event)"
      >
        <i class="iconfont icon-hushi" i-icon="icon-hushi" style="font-size:24px;"></i>
        <span class="text icon-text"></span>
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
  </div>
</div>
</template>

<script>
import { jsPlumb } from "jsplumb";
export default {
  props: {
    id: {
      type: String,
      default: 'jsplumb'
    },
    percent: {
      type: Boolean,
      default: false
    }
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

      const tempLeft = (offsetX - sourceOffsetX + scrollLeft > 0
          ? offsetX - sourceOffsetX + scrollLeft
          : 0)
      const tempTop = (offsetY - sourceOffsetY + scrollTop > 0
          ? offsetY - sourceOffsetY + scrollTop
          : 0)
      const _left =
        this.percent ? ((tempLeft / this.wrapOffsetWidth) * 100).toFixed(2)+ '%' : tempLeft + "px";
      const _top =
        this.percent ? ((tempTop / this.wrapOffsetHeight) * 100).toFixed(2) + '%' : tempTop + "px";
      clonedNode.style.left = _left;
      clonedNode.style.top = _top;
      ev.target.appendChild(clonedNode); // 目标节点
  
      Array.from([ // 四个方向连接点
        [
          [0.20, 0],
          [0.20, 1],
          [1, 0.20],
          [0, 0.20]
        ],
        [
          [0.45, 1],
          [1, 0.45],
          [0.45, 0],
          [0, 0.45]
        ],
        [
          [0, 0.65],
          [0.65, 1],
          [1, 0.65],
          [0.65, 0]
        ],
        [
          [1, 0.85],
          [0.85, 0],
          [0.85, 1],
          [0, 0.85]
        ],
      ]).forEach(pos => {
        this._addEndPoint(sourceId + timer, pos) 
      }); // 四个方向连接点
      // 设置允许拖拽
      this.jsplumb.draggable(sourceId + timer, { grid: [20, 20] });
    },
    // 添加一个连接点
    _addEndPoint(sourceId, anchors) {
      this.jsplumb.addEndpoint(sourceId, {
        endpoint: "Dot",
        paintStyle: {
          stroke: "#7AB02C",
          fill: "transparent",
          radius: 7,
          strokeWidth: 1
        },
        hoverPaintStyle: {
          fill: "#216477",
          stroke: "#216477"
        },
        overlays: [
          [
            "Label",
            {
              location: [0.5, -0.5],
              // label: pos.slice(0, 2), // 四个方向连接点
              cssClass: "endpointTargetLabel",
              visible: false // 不显示拖拽点标签
            }
          ]
        ],
        // anchor: pos, // 四个方向连接点
        // anchor: ["TopCenter", "BottomCenter", "LeftMiddle", "RightMiddle"],
        anchor: anchors,
        uuid: sourceId,
        connectorStyle: { // 连线样式
          gradient: { // 线性渐变样式
            stops: [
              [0, '#00f'],
              [0.5, "rgba(198,89,30,0.7)"],
              [1, '#00f']
            ]
          },
          strokeWidth: 5,
          stroke: 'rgba(198,89,30,0.7)',  // 箭头
          dashstyle: "2 2" // 虚线
        },
        endpointsOnTop: false,
        isSource: true,
        isTarget: true,
        maxConnections: 10,
        dropOptions: { tolerance: "touch", hoverClass: "dropHover" }
      });
    },
    // 初始化流程图盒子
    initJsPlumb() {
      this.jsplumb = jsPlumb.getInstance({
        Connector: ["Bezier", { curviness: 100 }],
        // Connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
        PaintStyle: { stroke: "#7AB02C", strokeWidth: 2 },
        EndpointStyle: { radius: 9, fill: "#7AB02C" },
        HoverPaintStyle: { stroke: "#ec9f2e" },
        EndpointHoverStyle: { fill: "#ec9f2e" },
        DragOptions: { cursor: "pointer", zIndex: 2000 }, // 默认配置
        ConnectionOverlays: [
          [
            "Arrow", // 箭头样式
            {
              location: .95,
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
            return true;
          });
          this.jsplumb.bind("connection", function(connInfo, originalEvent) {
            const connection = connInfo.connection;
            connection.getOverlay("label").setLabel("ggg");
          });
          
          this._addEndPoint(`examplesource${this.id}`, 'Continuous') // 动态锚点、提供了4个方向  Continuous、AutoDefault
          this._addEndPoint(`exampletarget${this.id}`, 'AutoDefault')
          this.jsplumb.connect({uuids: [`examplesource${this.id}`, `exampletarget${this.id}` ], detachable: true, reattach: true});
          this.jsplumb.draggable(jsPlumb.getSelector(`#right${this.id} .list-item`), { grid: [20, 20] });

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
              this.wrapOffsetWidth = element.offsetWidth
              this.wrapOffsetHeight = element.offsetHeight
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
    flex: 0 0 250px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
    .list-item
      margin: 0 3px 5px 0
  .right
    margin-left 8px
    user-select none
    flex: 1
    border 1px solid #ccc
    position relative
    overflow auto
    .list-item
      position absolute
.list-item
  height 80px
  width 80px
  display flex
  justify-content center
  align-items center
  cursor pointer
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
