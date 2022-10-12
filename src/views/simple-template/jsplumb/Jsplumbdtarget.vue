<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-07-14 16:58:28
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-22 16:45:45
-->
<template>
  <div>
    <div class="header" style="margin: 10px 0;text-align: right;">
      <el-button round size="small" @click="showJsplumb">流程信息</el-button>
    </div>
    <div class="dragger-wrapjs">
      <div class="left">
        <div
          class="list-item"
          type="horizontal"
          :id="`horizontal${id}`"
          draggable="true"
          @dragstart="drag($event)"
        >
          <i
            class="iconfont icon-hushi"
            i-icon="iconfont icon-hushi"
            style="font-size:30px;"
          ></i>
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
            i-icon="iconfont icon-yaowu1"
            style="font-size:24px;"
          ></i>
          <span class="text"></span>
        </div>
        <div
          class="list-item"
          style="height: 40px;width: 120px;"
          type="icon-text"
          :id="`icon-text${id}`"
          draggable="true"
          @dragstart="drag($event)"
        >
          <i
            class="iconfont icon-hushi"
            i-icon="iconfont icon-hushi"
            style="font-size:24px;"
          ></i>
          <span class="text icon-text"></span>
        </div>
      </div>
      <div
        class="right"
        :id="`right${id}`"
        @drop="drop($event)"
        @dragover="allowDrop($event)"
        @contextmenu.prevent
      ></div>
      <!-- 右击菜单 -->
      <contextjs
        :id="`operate-action${id}`"
        :page="pagePosition"
        :visble.sync="visble"
        style="z-index: 7"
      >
        <ul
          class="bg-white w-28 text-black rounded border text-gray-500 cursor-pointer curstom text-sm  border-gray-100"
        >
          <li class="px-2 py-1 border-b border-gray-100" @click="deleteNode">
            <i class="el-icon-delete mr-1" />删除节点
          </li>
          <li
            class="px-2 py-1 border-b border-gray-100"
            @click="editNode(false)"
          >
            <i class="el-icon-edit mr-1" />编辑节点
          </li>
        </ul>
      </contextjs>
      <!-- 右击菜单 -->
      <!-- 右击菜单 -->
      <contextjs
        :id="`line-action${id}`"
        :page="pagePosition"
        :visble.sync="lineVisble"
        style="z-index: 7"
      >
        <ul
          class="bg-white w-28 text-black rounded border text-gray-500 cursor-pointer curstom text-sm  border-gray-100"
        >
          <li
            class="px-2 py-1 border-b border-gray-100"
            @click="deleteLineConnect"
          >
            <i class="el-icon-delete mr-1" />删除连线
          </li>
          <li
            class="px-2 py-1 border-b border-gray-100"
            @click="isShowEditLineDialog"
          >
            <i class="el-icon-edit mr-1" />编辑连线
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
          <Monaco ref="monacoTarget" v-model="jsonList" isShowLanguage />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="
              reloadData
            "
            size="small"
          >
            保 存
          </el-button>
        </span>
      </el-dialog>
      <!-- 弹出框 -->
      <!-- 编辑节点 -->
      <el-dialog
        title="编辑节点信息"
        :visible.sync="dialogEditVisible"
        width="320px"
        custom-class="edit-node-dialog"
        :close-on-click-modal="false"
      >
        <el-form
          :model="editRuleForm"
          status-icon
          ref="editRuleForm"
          label-width="50px"
          class="demo-editRuleForm"
        >
          <el-form-item label="图标">
            <el-input v-model="editRuleForm.icon"></el-input>
          </el-form-item>
          <el-form-item label="名字">
            <el-input v-model="editRuleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="
              editNode(true);
              dialogEditVisible = false;
            "
            size="small"
          >
            保 存
          </el-button>
        </span>
      </el-dialog>
      <!-- 编辑节点 -->
      <!-- 编辑连线 -->
      <el-dialog
        title="编辑连线信息"
        :visible.sync="dialogEditLineVisible"
        width="320px"
        custom-class="edit-node-dialog"
        :close-on-click-modal="false"
      >
        <el-form
          :model="editLineRuleForm"
          status-icon
          ref="editRuleForm"
          label-width="50px"
          class="demo-editRuleForm"
        >
          <el-form-item label="标签">
            <el-input v-model="editLineRuleForm.label"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="
              editNodeLine();
              dialogEditLineVisible = false;
            "
            size="small"
          >
            保 存
          </el-button>
        </span>
      </el-dialog>
      <!-- 编辑连线 -->
    </div>
    <pre
      v-if="false"
      style="position: fixed;top: 0;left: 0;background: white;height: 100vh;overflow: auto;"
    >
      {{ jsonList }}
    </pre>
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
    },
    percent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pagePosition: {},
      visble: false,
      lineVisble: false,
      dialogVisible: false,
      dialogEditVisible: false,
      dialogEditLineVisible: false,
      jsonList: {
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
            noDarag: true
          },
          {
            id: "nodeB",
            type: "vertical",
            name: "流程B-节点B",
            left: "351px",
            top: "96px",
            icon: "iconfont icon-yiliao-copy",
            status: "error"
          },
          {
            id: "nodeC",
            name: "流程B-节点C",
            type: "horizontal",
            left: "354px",
            top: "351px",
            icon: "iconfont icon-yiliao21",
            status: "warning"
          },
          {
            id: "nodeD",
            name: "B-节点D",
            type: "icon-text",
            left: "723px",
            top: "215px",
            icon: "iconfont icon-yiliao23",
            status: "running"
          }
        ],
        lineList: [
          {
            from: "nodeA",
            to: "nodeB",
            label: "条件A",
            error: true
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
      },
      editRuleForm: {},
      editLineRuleForm: {}
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
    // 真实id
    idString(id) {
      return id.slice(0, -this.id.length)
    },
    showJsplumb() {
      this.dialogVisible = true;
      this.$refs.monacoTarget?.setValue(this.jsonList);
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
      const uqid = Math.random()
        .toString(36)
        .substr(3, 10);
      const _uid = sourceId + uqid
      clonedNode.setAttribute("id", _uid + this.id); // 修改一下id 值，避免id 重复

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

      /* 修改数据 */
      const { nodeList } = this.jsonList;
      nodeList.push({
        id: _uid,
        type: clonedNode.getAttribute("type"),
        left: _left,
        top: _top,
        icon: clonedNode.querySelector("i").getAttribute("i-icon")
      });
      /* 修改数据 */

      this._addPoint(_uid + this.id);
      (id => {
        // 设置允许拖拽
        this._draggable(id);
        // 监听右击事件
        document.getElementById(id).addEventListener("contextmenu", ev => {
          ev.preventDefault();
          this.showMenu(ev, id);
        });
      })(_uid + this.id);
    },
    // 右击节点
    showMenu(ev, id) {
      this.pagePosition = { pageX: ev.pageX, pageY: ev.pageY };
      this.nodeId = id;
      this.visble = true;
    },
    // 右击连线
    lineShowMenu(ev, conn) {
      this.pagePosition = { pageX: ev.pageX, pageY: ev.pageY };
      this.nodeIdConn = conn;
      this.lineVisble = true;
    },
    isShowEditLineDialog() {
      const { sourceId, targetId } = this.nodeIdConn;
      const conn = this.jsplumb
        .getConnections({
          source: sourceId,
          target: targetId
        })
        .filter(item => {
          return this.nodeIdConn.id === item.id;
        })[0];
      this.$set(this.editLineRuleForm, "label", conn.getLabel());
      this.dialogEditLineVisible = true;
    },
    // 编辑连线
    editNodeLine() {
      const { sourceId, targetId } = this.nodeIdConn;
      const { label } = this.editLineRuleForm;
      const conn = this.jsplumb
        .getConnections({
          source: sourceId,
          target: targetId
        })
        .filter(item => {
          return this.nodeIdConn.id === item.id;
        })[0];
      const lable = conn.getLabel() || "";
      conn.setLabel(label);
      if (!label) {
        conn.removeClass("flowLabel");
      } else {
        conn.addClass("flowLabel");
      }
      this.dialogEditLineVisible = false;

      /* 修改数据 */
      const { lineList } = this.jsonList
      for (let i = 0; i < lineList.length; i++) {
        if (lineList[i].from === this.idString(sourceId) && lineList[i].to === this.idString(targetId) && (lineList[i].label === lable || (!lable && !lineList[i].label))) {
          lineList[i].label = label
          break
        }
      }
      /* 修改数据 */
    },
    // 数据重绘
    reloadData() {
      this.jsplumb?.deleteEveryConnection();
      this.jsplumb?.deleteEveryEndpoint();
      document.getElementById(`right${this.id}`).innerHTML = "";
      try {
        const jsonList = JSON.parse(this.$refs.monacoTarget.getValue());
        if (!jsonList.nodeList || !jsonList.lineList) {
          this.$message.warning('流程对象需要包含nodeList、lineList属性')
          return
        }
        this.jsonList = jsonList;
        this._initConnect(jsonList);
        this.dialogVisible = false;
      } catch(err) {
        this.$message.warning('初始化对象必须是json对象')
        this.dialogVisible = false;
      }
    },
    createdList(list) {
      var root = document.getElementById(`right${this.id}`);
      var fragment = document.createDocumentFragment();
      for (let i = 0; i < list.length; i++) {
        const sourceNode = document.querySelector(
          `.left .list-item[type=${list[i].type}]`
        );
        const clonedNode = sourceNode.cloneNode(true);
        if (list[i].icon) {
          clonedNode.querySelector("i").classList = `anchor ${list[i].icon}`;
          clonedNode.querySelector("i").setAttribute("i-icon", list[i].icon);
        }
        list[i].name &&
          (clonedNode.querySelector(".text").innerHTML = list[i].name);
        list[i].status && clonedNode.classList.add(list[i].status);
        clonedNode.setAttribute("draggable", false);
        const _uid = list[i].id + this.id
        clonedNode.setAttribute("id", _uid);
        clonedNode.style.top = list[i].top;
        clonedNode.style.left = list[i].left;
        fragment.appendChild(clonedNode);
        /* 分片绑定事件 */
        fragment
          .getElementById(_uid)
          .addEventListener("contextmenu", ev => {
            ev.preventDefault();
            this.showMenu(ev, _uid);
          });
        /* 分片绑定事件 */
      }
      root.appendChild(fragment);
    },
    // 删除节点
    deleteNode() {
      this.jsplumb.remove(this.nodeId);
      this.visble = false;
      /* 修改数据 */
      const { lineList, nodeList } = this.jsonList
      this.jsonList.nodeList = nodeList.filter(item => {
        return item.id !== this.idString(this.nodeId)
      })
      this.jsonList.lineList = lineList.filter(item => {
        return ![item.from, item.to].includes(this.idString(this.nodeId))
      })
      /* 修改数据 */
    },
    // 编辑节点
    editNode(flag) {
      const dom = document.querySelector(`#${this.nodeId}`);
      const i = dom.querySelector("i");
      const span = dom.querySelector("span");
      if (flag) {
        const { icon, name } = this.editRuleForm;
        span.innerHTML = name;
        i.classList = `anchor ${icon}`;
        i.setAttribute("i-icon", icon);
        this.dialogEditVisible = false;
        /* 修改数据 */
        const { nodeList } = this.jsonList
        for (let i = 0; i < nodeList.length; i++) {
          if (nodeList[i].id === this.idString(this.nodeId)) {
            nodeList[i].icon = icon
            nodeList[i].name = name
            break
          }
        }
        /* 修改数据 */
      } else {
        this.$set(this.editRuleForm, "icon", i.getAttribute("i-icon") || "");
        this.$set(this.editRuleForm, "name", span.innerHTML);
        this.dialogEditVisible = true;
      }
    },
    // 添加拖拽
    _draggable(id) {
      this.jsplumb.draggable(id, {
        containment: "parent", // 限制拖拽区域
        stop: node => {
          // 拖拽结束回调
          /* 修改数据 */
          const { id } = node.el
          const { finalPos } = node
          const { nodeList } = this.jsonList
          const _left =
            this.percent ? ((finalPos[0] / this.wrapOffsetWidth) * 100).toFixed(2)+ '%' : finalPos[0] + "px";
          const _top =
            this.percent ? ((finalPos[1] / this.wrapOffsetHeight) * 100).toFixed(2) + '%' : finalPos[1] + "px";
          for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].id === this.idString(id)) {
              nodeList[i].left = _left
              nodeList[i].top = _top
              break
            }
          }
          /* 修改数据 */
        }
      }); // , { grid: [20, 20] } 拖拽步长
    },
    // 添加一个连接点
    _addPoint(sourceId) {
      this.jsplumb.makeSource(sourceId, {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        filter: ".anchor",
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
        filter: ".anchor",
        filterExclude: false,
        // 是否允许自己连接自己
        anchor: "Continuous",
        allowLoopback: true,
        dropOptions: { hoverClass: "ef-drop-hover" }
      });
    },
    // 删除连接
    deleteLineConnect() {
      this.$confirm("确认删除连线", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 修改数据 */
          const { sourceId, targetId } = this.nodeIdConn
          const lable = this.nodeIdConn.getLabel()
          const { lineList } = this.jsonList
          for(let i = 0; i < lineList.length; i++) {
            if (lineList[i].from == this.idString(sourceId) && lineList[i].to == this.idString(targetId) && lineList[i].label == lable) {
              lineList.splice(i, 1);
              break
            }
          }
          /* 修改数据 */

          // 删除链接线
          this.jsplumb.deleteConnection(this.nodeIdConn); // detach
        })
        .catch(() => {});
    },
    // 添加一个连线
    _connect(obj, item) {
      const connect = this.jsplumb.connect(
        {
          ...obj
        },
        {
          label: item.label,
          //     events:{
          //       mouseover:function(labelOverlay, originalEvent) { 
          //         console.log(item)
          //       }
          //     },
          paintStyle: {
            stroke: item.error ? "#F18383" : "#7AB02C",
            strokeWidth: 2,
            outlineWidth: 15,
            outlineStroke: "transparent"
          },
          endpointStyle: {
            radius: 6,
            fill: item.error ? "#F18383" : "#7AB02C"
          }, // 端口样式
          // 动态锚点、提供了4个方向 Continuous、AutoDefault
          anchor: "Continuous",
          labelStyle: {
            cssClass: item?.label ? "flowLabel" : ""
          }
        }
      );
    },
    // 根据json绘制流程图
    _initConnect(list) {
      const { nodeList, lineList } = list;
      this.createdList(nodeList);
      nodeList.forEach(item => {
        this._addPoint(item.id + this.id);
        if (!item.noDarag) {
          this._draggable(item.id + this.id);
        }
      });
      lineList.forEach(item => {
        this._connect(
          {
            source: item.from + this.id,
            target: item.to + this.id
            // overlays: [
            //   [
            //     "Label",
            //     {
            //       label: item.label ? item.label : "",
            //       // 设置连线上面的label样式
            //       labelStyle: {
            //         cssClass: item.label ? 'flowLabel' : "",
            //       },
            //       events: {
            //         click: (con, ev) => {
            //           this.$prompt('请输入标签', '提示', {
            //             inputValue: con.getLabel(),
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //           }).then(({ value }) => {
            //             con.setLabel(value)
            //           }).catch(() => {});
            //         }
            //       }
            //     }
            //   ]
            // ]
          },
          item
        );
      });
    },
    // 初始化流程图盒子
    initJsPlumb() {
      this.jsplumb = jsPlumb.getInstance({
        // Connector: ["traight", { curviness: 80 }],
        Connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
        PaintStyle: {
          stroke: "#7AB02C",
          strokeWidth: 2,
          // 设置外边线的颜色，默认设置透明，这样别人就看不见了，点击线的时候可以不用精确点击，参考 https://blog.csdn.net/roymno2/article/details/72717101
          outlineStroke: "transparent",
          // 线外边的宽，值越大，线的点击范围越大
          outlineWidth: 15
        }, // 连线样式
        EndpointStyle: { radius: 7, fill: "#7AB02C" }, // 端口样式
        HoverPaintStyle: { cursor: "pointer", stroke: "#ec9f2e" },
        EndpointHoverStyle: { fill: "#ec9f2e" },
        DragOptions: { cursor: "pointer", zIndex: 2000 }, //拖动时鼠标停留在该元素上显示指针，通过css控制
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
          ]
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
          this.jsplumb.bind("beforeDrop", conn => {
            // 建立连接前修改后台数据
            if (conn.sourceId === conn.targetId) {
              this.$message.warning("不能连接自己");
              return false;
            } else {
              /* 修改数据 */
              const { lineList } = this.jsonList
              const { sourceId, targetId } = conn
              lineList.push({
                "from": this.idString(sourceId),
                "to": this.idString(targetId)
              })
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
.dragger-wrapjs
  height: 500px
  display: flex
  .left
    flex: 0 0 250px
    display flex
    justify-content flex-start
    flex-wrap: wrap
    align-content: flex-start
    .list-item
      margin: 0 3px 5px 0
  /deep/ .right
    margin-left 8px
    user-select none
    flex: 1
    border 1px solid #ccc
    position relative
    overflow auto
    .list-item
      position absolute
      .anchor
        cursor crosshair
/deep/ .list-item
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
  .icon-text
    position: initial;
    display: inline-block;
    width: 80px;
    text-align: center;
  &.success,&.warning,&.running,&.error
    color: white
    .icon-text
      color: white
  &.success
    background: #67c23a
  &.warning
    background: #e6a23c
  &.running
    background: #909399
  &.error
    background: #f56c6c
  &:hover
    z-index 10
/deep/ .vertical
  height: 40px;
/deep/ .icon-text
  height: 40px;
  width: 120px;
  display: flex
  .iconfont
    flex: 0 0 40px
    text-align: center;
  .text
    flex: 1
    position: initial
    display: flex
    align-items: center
  &.success,&.warning,&.running,&.error
    .text
      color: white
      
/deep/ .jtk-endpoint
  z-index 5
/deep/ .aLabel
  color red
/deep/ .edit-node-dialog .el-dialog__body {
  padding: 10px 40px 0;
}
/deep/ .jtk-overlay:hover {
  z-index 10
}
/deep/ .jtk-overlay.flowLabel:not(.aLabel) {
  padding: 4px 10px;
  background-color: white;
  color: #565758 !important;
  border: 1px solid #E0E3E7;
  border-radius: 5px;
}
</style>
