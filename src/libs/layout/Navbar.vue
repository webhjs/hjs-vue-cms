<template>
  <div class="top-navbar">
    <el-menu
      ref="currentTopMenu"
      class="flex h-14 text-xl relative"
      mode="horizontal"
      router
    >
      <div class="flex flex-1 items-center" style="outline: none;">
        <el-menu-item v-if="logo" class="logo-name"  index="">
          <img
            src="@/libs/assets/imgs/logo.png"
            alt=""
            width="20px"
            height="20px"
            class="inline"
          />
          <span> {{ $t("navbar.title") }}</span>
        </el-menu-item>

        <slot name="menubtn-left" style="display: inline-block;" />

        <breadcrumb v-if="breadIsShow"></breadcrumb>
        
        <div style="outline: none;" class="flex-1 flex" id="menu-top-list-resize-id">
          <slot name="menulist" />
          <slot name="more" />
        </div>
      </div>
      <!-- class="flex w-60 justify-between items-center absolute right-10 top-1/2 bottom-1/2" -->
      <div
        class="flex w-72 justify-between items-center mr-5"
        style="outline: none;"
      >
        <el-tooltip
          effect="dark"
          :content="$t('navbar.screenfull')"
          placement="bottom"
        >
          <screenfull></screenfull>
        </el-tooltip>

        <lang-select></lang-select>

        <div @click="setLayout">
          <i class="el-icon-setting cursor-pointer" />
        </div>

        <div class="flex">
          <el-dropdown trigger="click" class="w-full">
            <div class="flex w-28">
              <img
                class="inline rounded-full"
                width="30px"
                height="30px"
                src="/static/images/avatar/1.jpg"
              />
              <div class="flex-1 flex justify-center items-center">
                <div class="w-full h-full pl-2 relative">
                  <div class="absolute w-full h-full" v-ellipsis:top=" accountInfo.username">
                    {{ accountInfo.username }}
                  </div>
                </div>
                <i class="el-icon-caret-bottom"></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/user/profile">
                <el-dropdown-item>
                  {{ $t("navbar.profile") }}
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item @click.native="logout">
                <span style="display:block;">{{ $t("navbar.logOut") }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <slot name="menubtn-right" style="display: inline-block;" />
      </div>
    </el-menu>
  </div>
</template>
<script>
import { confirm } from "@/libs/decorator/confirm";
import { mapGetters, mapActions, mapMutations } from "vuex";
import LangSelect from "@/components/Lang-select";
import Screenfull from "@/components/Screenfull";
import Breadcrumb from "./Breadcrumb";
export default {
  name: "",
  props: {
    logo: {
      type: Boolean,
      default: true
    },
    showlevel1: {
      type: Boolean,
      default: false
    },
    breadIsShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      timer: ''
    };
  },
  watch: {
    '$route.matched': {
      handler(val) {
        const route = val[val.length - 1]
        if (route.path.startsWith("/redirect/")) {
          return;
        }
        this.$nextTick(() => {
          const acitvePath = this.showlevel1 ? val[0].path || '/' : val[val.length - 1].meta.activeMenu || val[val.length - 1].path
          // if (this.timer) clearTimeout(this.timer)
          // this.timer = setTimeout(() => {
            this.$refs.currentTopMenu.activeIndex = acitvePath // elementui default-active 不会用感觉有bug 我猜可能是因为我涉及到单个子路由提升到开头
          // }, 500)
        })
      },
      immediate: true
    }
  },
  components: {
    LangSelect,
    Screenfull,
    Breadcrumb
  },
  computed: {
    // ...mapGetters(["name", "avatar"])
    ...mapGetters({
      accountInfo: "user/accountInfo"
    })
  },
  methods: {
    ...mapActions({
      userLogout: "user/logout"
    }),
    ...mapMutations({
      setDrawer: "layout/setDrawer"
    }),
    // 设置布局
    setLayout() {
      this.setDrawer(true);
    },
    @confirm("退出系统？")
    logout() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.userLogout()
        .then((_) => {
          // 为了重新实例化vue-router对象 避免bug
          location.reload();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          loading.close();
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.top-navbar /deep/ .el-menu-item {
  &:hover {
    background-color: transparent
  }
  &:focus {
    background-color: transparent
  }
}
</style>
