<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-04-07 10:49:33
 * @LastEditors: 金苏
 * @LastEditTime: 2021-04-07 11:29:28
-->
<template>
  <transition name="fade" mode="out-in">
    <div
      :id="id"
      @contextmenu.prevent.stop=""
      ref="userContain"
      v-show="visble"
    >
      <slot></slot>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return { firstInit: [] };
  },
  props: {
    page: {
      type: Object,
      default() {
        return {
          pageX: 0,
          pageY: 0
        };
      }
    },
    visble: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: "_menu_warp"
    }
  },
  watch: {
    page: {
      handler(val, old) {
        this.$nextTick(() => {
          this.computedPosition(val);
        });
      },
      deep: true
    }
  },
  methods: {
    computedPosition(pos) {
      let doc = document.getElementById(this.id),
        h = parseInt(window.getComputedStyle(doc).height),
        w = parseInt(window.getComputedStyle(doc).width),
        // ch = window.screen.availHeight,
        // cw = window.screen.availWidth,
        dh = document.documentElement.clientHeight,
        dw = document.documentElement.clientWidth,
        dzoom = this.detectZoom() / 100;
      if (pos.pageX + w > dw) {
        doc.style.left = pos.pageX - w + "px";
      } else {
        doc.style.left = pos.pageX + "px";
      }
      if (pos.pageY + h > dh) {
        doc.style.top = pos.pageY - h + "px";
      } else {
        doc.style.top = pos.pageY + "px";
      }
      this.firstInit = [
        parseInt(doc.style.top),
        parseInt(doc.style.left),
        dzoom
      ];
    },
    comPagePos() {
      let doc = document.getElementById(this.id),
        dzoom = this.detectZoom() / 100;
      doc.style.top = (this.firstInit[0] / dzoom) * this.firstInit[2] + "px";
      doc.style.left = (this.firstInit[1] / dzoom) * this.firstInit[2] + "px";
      this.$nextTick(() => {
        let docs = document.getElementById(this.id),
          h = parseInt(window.getComputedStyle(docs).height),
          w = parseInt(window.getComputedStyle(docs).width),
          dh = document.documentElement.clientHeight,
          dw = document.documentElement.clientWidth;
        if (parseInt(docs.style.left) + w > dw) {
          docs.style.left = parseInt(docs.style.left) - w + "px";
        }
        if (parseInt(docs.style.top) + h > dh) {
          docs.style.top = parseInt(docs.style.top) - h + "px";
        }
      });
    },
    detectZoom() {
      //缩放比列
      let ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase();
      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      } else if (~ua.indexOf("msie")) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
      } else if (
        window.outerWidth !== undefined &&
        window.innerWidth !== undefined
      ) {
        ratio = window.outerWidth / window.innerWidth;
      }
      if (ratio) {
        ratio = Math.round(ratio * 100);
      }
      return ratio;
    },
    docClick(e) {
      this.$nextTick(() => {
        this.$emit("update:visble", false);
      });
    },
    windowResizeScroll() {
      let timer = null;
      if (timer) {
        clearInterval(timer);
      }
      timer = setTimeout(this.comPagePos(), 300);
    }
  },
  mounted() {
    let doc = document.getElementById(this.id);
    doc.style.display = "inline";
    doc.style.position = "fixed";
    doc.style.zIndex = 500;
    if (!this.visble) {
      doc.style.display = "none";
    }
    document.addEventListener("click", this.docClick, true);
    document.addEventListener("contextmenu", this.docClick, true);
    window.addEventListener("resize", this.windowResizeScroll, true);
    window.addEventListener("scroll", this.windowResizeScroll, true);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.docClick, true);
    document.removeEventListener("contextmenu", this.docClick, true);
    window.removeEventListener("resize", this.windowResizeScroll, true);
    window.removeEventListener("scroll", this.windowResizeScroll, true);
  }
};
</script>
<style scoped>
/* #menu_wrapper{ display: inline; position: fixed; } */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
