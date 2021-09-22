<template>
  <div class="tabs-view-container relative w-full" v-if="visitedTabsView.length">
    <div class="absolute w-full">
      <el-tabs type="border-card">
        <el-tab-pane
          v-for="tag in visitedTabsView"
          :key="tag.path"
          :name="tag.path"
        >
          <router-link
            slot="label"
            class="tags-view-item"
            :class="isActive(tag) ? 'active' : ''"
            :to="tag"
          >
            <div @contextmenu.prevent.stop="contextmenu($event, tag)" class="tag-pane">
              {{ tag.label }}
              <i class='el-icon-close close' @click.prevent.stop="handleClose(tag)"></i>
            </div>
          </router-link>
        </el-tab-pane>
      </el-tabs>
    </div>
    <menuCom id="custom_menuwarp" :page="pagePosition" :visble.sync="visble">
      <ul
        class="bg-white w-28 text-black rounded border text-gray-500 cursor-pointer curstom text-sm  border-gray-100"
      >
        <li class="px-2 py-1 border-b border-gray-100" @click="reload">
          <i class="el-icon-refresh mr-1" />刷新
        </li>
        <li class="px-2 py-1 border-b border-gray-100" @click="delCurrentTabsview">
          <i class="el-icon-circle-close mr-1" />关闭当前
        </li>
        <li class="px-2 py-1 border-gray-100" @click="delOtherTabsview">
          <i class="el-icon-circle-close mr-1" />关闭其它
        </li>
        <li class="px-2 py-1 border-gray-100" @click="delAllTabsview">
          <i class="el-icon-circle-close mr-1" />关闭全部
        </li>
      </ul>
    </menuCom>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import MenuCom from 'hjs-contextmenu';
export default {
  components: {
    MenuCom
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
        this.layoutTheme.reload()
      } else {
        this.layoutTheme.reload(this.tagData.path)
        this.$router.push(this.tagData.path)
      }
      this.visble = false;
    },
    delCurrentTabsview() {
      if (this.visitedTabsView.length === 1 && this.tagData.path === '/home') {
        this.visble = false;
        return
      }
      this.handleClose(this.tagData);
    },
    delOtherTabsview() {
      this.layoutTheme.removeOtherCacheAll(this.tagData)
      this.delAllVisitedOtherTabsView(this.tagData).then(res => {
        if (this.$route.path !== this.tagData.path) { this.$router.push({path: this.tagData.path}) }
        this.visble = false;
      });
    },
    delAllTabsview() {
      if (this.visitedTabsView.length === 1 && this.tagData.path === '/home') {
        this.visble = false;
        return
      }
      this.layoutTheme.removeCacheAll()
      // const route = this.generateRoute();
      const route = [];
      this.delAllVisitedTabsView(route).then(res => {
        this.$router.push('/')
        this.visble = false;
      });
    },
    contextmenu(ev, tag) {
      this.tagData = tag
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
      if (this.visitedTabsView.length === 1 && tag.path === '/home') {
        return
      }
      this.layoutTheme.removeCache(tag.path)
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
.tabs-view-container
  height: 40px;
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
ul.curstom
  li:hover
    background #ecf5ff
    color #409EFF
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
    transition width .4s ease
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
      margin-left 5px
      overflow hidden
      width 0px
    &:hover
      color #409eff
      &:before
        background-color #80bcf9
      .close
        width 14px
.tabs-view-container {
  /deep/ .el-tabs--border-card>.el-tabs__content,/deep/ .el-tabs__item,
  /deep/ .el-tabs--top.el-tabs--border-card>.el-tabs__header .el-tabs__item:nth-child(2) {
    padding:0 4px
  }
  /deep/ .el-tabs--border-card,/deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active,/deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item {
    background: transparent
    box-shadow: none
    border: none
  }
  /deep/ .el-tabs--border-card>.el-tabs__header {
    padding 0 8px
  }
  /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: #909399;
  }
  /deep/ .el-tabs__nav-next,/deep/ .el-tabs__nav-prev {
    line-height: 38px;
  }
}
</style>
