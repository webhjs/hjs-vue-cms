<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-11 09:11:27
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-15 16:08:22
-->
<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="450px"
    append-to-body
  >
    <el-form
      label-width="60px"
      :model="formInline"
      size="small"
      :rules="rules"
      ref="projectForm"
    >
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input
          type="password"
          v-model="formInline.oldPwd"
          maxlength="20"
          show-password
        >
          <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input
          type="password"
          v-model="formInline.newPwd"
          maxlength="20"
          show-password
        >
          <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
      <el-button type="primary" @click="submitFormline" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      formInline: {},
      rules: {
        resourceId: [
          { required: true, message: "请选择资源", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    isShow() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.projectForm.clearValidate()
      })
    },
    submitFormline () {
      this.$refs.projectForm.validate(async (valid) => {
        if (valid) {
          await this.api('login/updatePwd', this.formInline);
          this.dialogVisible = false
          this.$message.success('密码修改成功')
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.width-95
  width: 100%;
  margin-right: 6px;
/deep/ .el-form--label-top .el-form-item__label {
  padding: 0px
}
</style>
