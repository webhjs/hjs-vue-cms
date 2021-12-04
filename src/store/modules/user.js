import { Api } from "@/api";
import { setToken, removeToken } from "@/libs/common/auth";
import { Message } from 'element-ui';

const SET_ACCOUNT_INFO = "set_account_info";
const SET_TOKEN = "set_token";

const user = {
  namespaced: true,
  state: {
    token: "",
    accountInfo: {}
  },
  mutations: {
    [SET_ACCOUNT_INFO](state, accountInfo) {
      state.accountInfo = accountInfo;
    },
    [SET_TOKEN](state, token) {
      state.token = token;
    }
  },
  actions: {
    // 用户登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        Api("login/login", userInfo)
          .then(resp => {
            if (resp.code == 200) {
              setToken(resp.data.token);
              commit(SET_TOKEN, resp.data.token);
              resolve(resp);
            } else {
              Message.error(resp.msg);
              reject(resp.msg);
            }
          })
          .catch(err => {
            Message.error(err);
            reject(err);
          });
      });
    },
    // 拉取用户信息
    pullUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        Api("login/userInfo")
          .then(resp => {
            if (resp.code == 200) {
              commit(SET_TOKEN, resp.data.token);
              commit(SET_ACCOUNT_INFO, resp.data);
              resolve(resp.data);
            } else {
              reject(resp.msg);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 用户退出登录
    logout({ commit }) {
      return new Promise((resolve) => {
        removeToken();
        commit(SET_TOKEN, "");
        commit(SET_ACCOUNT_INFO, {});
        resolve(true);
      });
    },
    // 头像更新
    doUpdateAvatar({ dispatch, commit }, imgFile) {
      return new Promise(resolve => {
        setTimeout(() => {
          // commit(SET_AVATAR, imgFile);
          resolve();
        }, 1000);
      });
    },
    /**
     * 更新用户信息
     * userInfo: 用户信息表对象
     */
    doUpdateUser({ commit }, userInfo) {
      return new Promise(resolve => {
        // commit(SET_ALL, userInfo);
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }
  },
  getters: {
    token: state => state.token,
    accountInfo: state => state.accountInfo,
  }
};

export default user;
