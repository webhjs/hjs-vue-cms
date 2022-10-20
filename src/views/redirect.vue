<script>
import { setToken } from "@/libs/common/auth";
export default {
  data() {
    return {
      tooltip: "用于等三方登录...",
    };
  },
  async mounted() {
    const { query } = this.$route;
    try {
      const result = await this.api("login/SSOLogin", query);
      this.$message.success('登录成功')
      setToken(result.token);
      const path = this.$route.query.redirect || '/home'
      window.location = path
    } catch (err) {
      this.tooltip = `登录失败<span class="ml-4" style="color: red">${err}</span>`;
    }
  },
  render(h) {
    const { tooltip } = this;
    return h("div", {
      class: ["p-2"],
      domProps: {
        innerHTML: tooltip,
      },
    }); // avoid warning message
  },
};
</script>
