<template>
  <el-container class="login-container">
    <el-button class="show-account p-3" type="text" @click="usernameTip"
      >提示帐号信息</el-button
    >
    <el-card class="animated flipInY">
      <div slot="header" class="el-card-header">
        <lang-select class="lang-select"></lang-select>

        <!-- <i class="el-icon-postcard" style="font-size: 5rem; font-weight:normal; color: #409EFF" /> -->
        <p class="block text-center py-4">
          <img class="m-auto" style="width: 3rem" src="../../libs/assets/imgs/logo.png" />
        </p>

        <h2 class="login-title">{{ $t("login.title") }}</h2>
      </div>

      <el-form
        :rules="rules"
        :model="loginForm"
        ref="loginForm"
        label-width="80px"
      >
        <el-form-item
          :label="$t('login.account')"
          prop="username"
          style="position:relative"
        >
          <el-input
            type="text"
            v-model="loginForm.username"
            @keyup.enter.native="goToPwdInput"
            maxlength="20"
          />
          <span class="svg-container svg-container_user">
            <svg-icon src="user" class="inline" />
          </span>
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input
            ref="password"
            type="password"
            v-model="loginForm.password"
            @keyup.enter.native="onLogin"
            maxlength="20"
          />
          <span class="svg-container svg-container_password">
            <svg-icon src="password" class="inline" />
          </span>
        </el-form-item>
        <el-form-item :label="$t('login.remember')" label-width="80px">
          <el-switch v-model="remember"></el-switch>
        </el-form-item>
        <el-button
          type="primary"
          @click="onLogin('loginForm')"
          :loading="loading"
          >{{ $t("login.login") }}</el-button
        >
      </el-form>
    </el-card>

    <div id="particles"></div>
  </el-container>
</template>
<script>
// import { isValidUsername } from "@/libs/utils/validate";
import LangSelect from "@/components/Lang-select";
import { saveToLocal, loadFromLocal } from "@/libs/common/local-storage";
import { mapActions } from "vuex";

/* eslint-disable*/
import particles from "particles.js";
export default {
  components: {
    LangSelect
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePwd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "mAdmin",
        password: "mandala"
      },
      remember: loadFromLocal("remember", false),
      loading: false,
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { required: true, trigger: ["blur", "change"], validator: validateUsername }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { required: true, trigger: ["blur", "change"], validator: validatePwd }
        ]
      }
    };
  },
  created() {
    // 初始化时读取localStorage用户信息
    if (loadFromLocal("remember", false)) {
      this.loginForm.username = loadFromLocal("username", "");
      this.loginForm.password = loadFromLocal("password", "");
    } else {
      this.loginForm.username = "";
      this.loginForm.password = "";
    }
  },
  methods: {
    // ...mapActions(["user/login"]),
    ...mapActions({
      login: "user/login"
    }),
    // 用户名输入框回车后切换到密码输入框
    goToPwdInput() {
      this.$refs.password.$el.getElementsByTagName("input")[0].focus();
    },
    // 登录操作
    onLogin() {
      this.$refs.password.$el.getElementsByTagName("input")[0].blur();
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.login({
            username: this.loginForm.username,
            password: this.loginForm.password
          })
            .then(resp => {
              if (resp.code == 200) {
                // 保存账号
                if (this.remember) {
                  saveToLocal("username", this.loginForm.username);
                  saveToLocal("password", this.loginForm.password);
                  saveToLocal("remember", true);
                } else {
                  saveToLocal("username", "");
                  saveToLocal("password", "");
                  saveToLocal("remember", false);
                }
                const path = this.$route.query.redirect || 'simple/home'
                window.location = path
                // this.$router.push({ path });
                this.loading = false;
              } else {
                this.$message.error(resp.msg);
                this.loading = false;
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message.error(err);
            });
        } else {
          this.loading = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    usernameTip() {
      this.$notify({
        title: "账号：admin",
        dangerouslyUseHTMLString: true,
        message: "<strong>密码：<i>123456</i></strong>",
        type: "success",
        // offset: 80,
        position: "bottom-left"
      });
    },
    // 粒子配置
    particlesJS() {
      particlesJS("particles", {
        particles: {
          number: {
            value: 15
          },
          color: {
            value: "random"
          },
          shape: {
            // type: ["image"],
            stroke: {
              width: 0,
              color: "yellow"
            },
            polygon: {
              nb_sides: 5
            }
            // image: {
            //   src: "https://neveryu.github.io/avatar/avatar.png",
            //   width: 100,
            //   height: 100
            // }
          },
          opacity: {
            value: 1,
            random: false,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 10,
            random: true,
            anim: {
              enable: true,
              speed: 10,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: false,
            distance: 150,
            color: "#ccc",
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: "random",
            random: true,
            straight: false,
            out_mode: "out",
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          // "detect_on": "canvas",
          detect_on: "window",
          events: {
            onhover: {
              enable: false,
              // "mode": "repulse"
              mode: "grab"
            },
            onclick: {
              enable: false,
              mode: "repulse"
              // "mode": "push"
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1
              }
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3
            },
            repulse: {
              distance: 200
            },
            push: {
              particles_nb: 4
            },
            remove: {
              particles_nb: 2
            }
          }
        }
      });
    }
  },
  mounted() {
    this.usernameTip();
    this.particlesJS();
  }
};
</script>
<style scoped lang="stylus">
.login-container
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  right 0
  bottom 0
  background mix(#044289, #494166) url('../../../static/images/login-background.jpg') center no-repeat
  background-size cover
  overflow hidden
  .show-account
    position absolute
    left 15px
    bottom 20px
    color var(--grey)
    background var(--white)
    font-weight 500
  .el-card
    position absolute
    top 50%
    left 50%
    margin -300px 0 0 -250px
    width 500px
    height 450px
    background #fff
    .el-card-header
      text-align center
      .lang-select
        float right
    .login-title
      font-size 1.5rem
      text-align center
    .el-input /deep/ .el-input__inner
      text-indent 12px
    .svg-container
      position absolute
      top 0
      left 5px
      color var(--gray)
      &_user
        font-size 20px
      &_password
        left 7px
        font-size 16px
    .el-button--primary
      width 100%

#particles
  width 100%
  height 100%
  background-color transparent
  background-size cover
  background-position 50% 50%
  background-repeat no-repeat
</style>
