<template>
  <el-row style="overflow:hidden;">
    <el-col style="width: calc(100% - 215px)">
      <el-tabs class="px-2">
        <el-tab-pane v-for="(cate, index) in iconList" :key="index">
          <span slot="label">{{ cate.cateName }}</span>
          <div
            class="flex flex-wrap justify-start"
            style="height: calc(100vh - 12rem); overflow:auto;"
          >
            <div
              @click="copy(item)"
              :data-clipboard-text="
                `<i class='${thisIconClass}' style='${thisIconStyle}'></i>`
              "
              v-for="(item, index) in cate.list"
              :key="index"
              class="icon-box copy-area p-4"
            >
              <span
                class="icon"
                :class="item.value"
                :style="`${thisIconStyle}`"
              ></span>
              <span class="icon-name">{{ item.value }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>

    <el-col class="toolsBar p-4 rounded border-gray-300" :span="4">
      <div class="r-set-title">颜色</div>
      <el-color-picker v-model="iconColor"></el-color-picker>

      <div class="r-set-title">大小</div>
      <el-slider v-model="iconFontSize"></el-slider>
    </el-col>
  </el-row>
</template>

<script>
import Clipboard from "clipboard";
import iconList from "./iconData";
export default {
  data() {
    return {
      iconList: iconList,
      isShowDialog: false,
      thisIconClass: "",
      iconColor: "#333",
      iconFontSize: 30
    };
  },
  computed: {
    thisIconStyle() {
      return `font-size:${this.iconFontSize}px; color:${this.iconColor}`;
    }
  },
  methods: {
    copy(item) {
      this.thisIconClass = item.value;
      let clipboard = new Clipboard(".copy-area");
      clipboard.on("success", e => {
        this.$message.success("代码复制成功");
        this.isShowDialog = false;
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        this.$message.error("该浏览器不支持自动复制");
        clipboard.destroy();
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

.toolsBar
  position fixed
  top 18vh
  right 1vw
  width 200px
  border 1px solid #cdcdcd
  background #fff

.icon-box {
  width 120px
  display: flex;
  flex-direction: column;
  justify-items center
  align-items: center;
  cursor: pointer;

  .icon {
    font-size: 40px;
  }

  .icon-name {
    text-align: center;
    color: #99a9bf;
  }
}
</style>
