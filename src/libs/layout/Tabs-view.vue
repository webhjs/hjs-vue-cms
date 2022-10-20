<template>
  <div
    class="tabs-view-container"
    v-if="visitedTabsView.length"
  >
    <div class="container">
      <scroll-tag showPosition id="__routeTabs" :animation="300">
        <draggable class="draggable-wrap" :options="{ animation: 300 }">
          <div
            v-for="tag in visitedTabsView"
            :key="tag.path"
            class="draggable"
          >
            <router-link
              slot="label"
              class="tags-view-item"
              :class="isActive(tag) ? 'active' : ''"
              :to="tag"
            >
              <div
                @contextmenu.prevent.stop="contextmenu($event, tag)"
                class="tag-pane"
              >
                {{ tag.label }}
                <i
                  class="el-icon-close close"
                  @click.prevent.stop="handleClose(tag)"
                ></i>
              </div>
            </router-link>
          </div>
        </draggable>
        <el-popover
          slot="closed"
          placement="bottom-end"
          width="105"
          ref="opearPover"
          popper-class="opear-pover"
          trigger="click"
        >
          <ul class="menu-dropdown curstom">
            <li
              class="menu-li"
              @click="
                $refs.opearPover.doClose();
                delOtherTabsview();
              "
            >
              <i class="el-icon-circle-close" />关闭其它
            </li>
            <li
              class="menu-li"
              @click="
                $refs.opearPover.doClose();
                delAllTabsview();
              "
            >
              <i class="el-icon-circle-close" />关闭全部
            </li>
          </ul>
          <div class="closed-wrap" slot="reference">
            <i class="el-icon-circle-close" />
          </div>
        </el-popover>
      </scroll-tag>
    </div>
    <menuCom id="custom_menuwarp" :page="pagePosition" :visble.sync="visble">
      <ul
        class="menu-dropdown curstom"
      >
        <li class="menu-li" @click="reload">
          <i class="el-icon-refresh" />刷新
        </li>
        <li
          class="menu-li"
          @click="delCurrentTabsview"
        >
          <i class="el-icon-circle-close" />关闭当前
        </li>
        <li class="menu-li" @click="delOtherTabsview(tagData)">
          <i class="el-icon-circle-close" />关闭其它
        </li>
        <li class="menu-li" @click="delAllTabsview">
          <i class="el-icon-circle-close" />关闭全部
        </li>
      </ul>
    </menuCom>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import MenuCom from "hjs-contextmenu";
import ScrollTag from "hjs-scroll";
import draggable from "vuedraggable";
export default {
  components: {
    MenuCom,
    ScrollTag,
    draggable
  },
  data() {
    return {
      visble: false,
      pagePosition: {},
      tagData: {}
    };
  },
  inject: {
    layoutTheme: {
      //函数式组件取值不一样
      default: () => ({})
    }
  },
  created() {
    this.addTabsView();
  },
  computed: {
    ...mapGetters(["visitedTabsView"])
  },
  methods: {
    ...mapActions([
      "addVisitedTabsView",
      "delVisitedTabsView",
      "delAllVisitedTabsView",
      "delAllVisitedOtherTabsView"
    ]),
    reload() {
      if (this.isActive(this.tagData)) {
        this.layoutTheme.reload();
      } else {
        this.layoutTheme.reload(this.tagData.path);
        this.$router.push(this.tagData.path);
      }
      this.visble = false;
    },
    delCurrentTabsview() {
      if (this.visitedTabsView.length === 1 && this.tagData.path === "/home") {
        this.visble = false;
        return;
      }
      this.handleClose(this.tagData);
    },
    delOtherTabsview(tagData) {
      const path = Object.prototype.toString.call(tagData) === '[object Object]' ? tagData.path : this.$route.path
      this.tagData = this.visitedTabsView.filter(fit => {
        return fit.path === path;
      })[0];
      this.layoutTheme.removeOtherCacheAll(this.tagData);
      this.delAllVisitedOtherTabsView(this.tagData).then(_ => {
        console.log(_)
        if (this.$route.path !== this.tagData.path) {
          this.$router.push({ path: this.tagData.path });
        }
        this.visble = false;
      });
    },
    delAllTabsview() {
      if (this.visitedTabsView.length === 1 && this.tagData.path === "/home") {
        this.visble = false;
        return;
      }
      this.layoutTheme.removeCacheAll();
      // const route = this.generateRoute();
      const route = [];
      this.delAllVisitedTabsView(route).then(res => {
        this.$router.push("/");
        this.visble = false;
      });
    },
    contextmenu(ev, tag) {
      this.tagData = tag;
      this.pagePosition = {
        pageX: ev.pageX,
        pageY: ev.pageY
      };
      this.visble = true;
    },
    addTabsView() {
      const route = this.generateRoute();
      if (!route) {
        return false;
      }
      this.addVisitedTabsView(this.generateRoute());
    },
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name;
    },
    handleClose(tag) {
      if (this.visitedTabsView.length === 1 && tag.path === "/home") {
        return;
      }
      this.layoutTheme.removeCache(tag.path);
      this.delVisitedTabsView(tag).then(tags => {
        // 如果关闭的是当前显示的页面，就去到前一个 tab-view 页面
        if (this.isActive(tag)) {
          const lastTag = tags.slice(-1)[0];
          // 前一个 tab-view 页面存在，就跳；不存在就到首页
          if (lastTag) {
            this.$router.push(lastTag.path);
          } else {
            this.$router.push("/");
          }
        }
        this.visble = false;
      });
    }
  },
  watch: {
    $route() {
      // console.log(this.$route)
      this.addTabsView();
    }
  }
};
</script>

<style lang="stylus" scoped>
.menu-dropdown
  background white
  padding: 5px 0;
  width 100px
  color: #000
  border-radius 4px
  cursor pointer
  font-size: 14px
.menu-li
  padding: 5px 10px
  border-bottom 1px solid #eee
/deep/ .offset-wrap
  height: 100%;
.tabs-view-container
  height: 40px;
  position relative
  width 100%
  // relative w-full
  &:after
    position absolute
    bottom 0
    left 0
    content ''
    height 1px
    width 100%
    background linear-gradient(90deg,#f100db,#00eced,#0c76e5,green,#ff0,orange,red)
  .tags-view-item
    .el-tag
      margin 0 8px
      &:first-child
        margin-left 0
  .container
    position absolute
    height: 100%
    width: 100%
    .draggable-wrap
      height: 100%
    .draggable
      display inline-block
      height: 100%
      margin 0 5px
ul.curstom
  li:hover
    background #eee
.tags-view-item
  display block
  height 100%
  padding 4px 0
  &.active
    color #409eff
    .tag-pane
      .close
        width 14px
      &::before
        background-color #409eff
  .tag-pane
    height 100%
    padding 0 10px
    display flex
    align-items center
    justify-content space-between
    border 1px solid #e8eaec
    border-radius 3px
    background #ffffff
    &:before
      display inline-block
      content ''
      width 10px
      height 10px
      border-radius 100%
      background-color #e8eaec
      margin-right 5px
    .close
      transition width .4s ease
      margin-left 5px
      overflow hidden
      width 0px
    &:hover
      color #409eff
      &:before
        background-color #80bcf9
      .close
        width 14px
.closed-wrap
  width: 26px;
  height: 100%;
  font-size: 24px;
  background: white;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  width: 35px;
  border-left: 1px solid #eee;
  font-size: 20px;
</style>
<style lang="stylus">
.opear-pover
  min-width auto
  padding 5px 0
</style>
