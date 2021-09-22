import { Api } from "@/api";
import { getToken, setToken, removeToken } from "@/libs/common/auth";

const SET_ACCOUNT = "SET_ACCOUNT";
const SET_TOKEN = "SET_TOKEN";
const SET_NAME = "SET_NAME";
const SET_AGE = "SET_AGE";
const SET_SEX = "SET_AEX";
const SET_AVATAR = "SET_AVATAR";
const SET_PERMISSIONS = "SET_PERMISSIONS";
const SET_TYPE = "SET_TYPE";
const SET_DESC = "SET_DESC";
const SET_ALL = "SET_ALL";

const user = {
  namespaced: true,
  state: {
    token: getToken(),
    account: "",
    name: "",
    age: 0,
    sex: "",
    avatar: "",
    permissions: "",
    type: [],
    desc: ""
  },
  mutations: {
    [SET_ACCOUNT](state, account) {
      state.account = account;
    },
    [SET_TOKEN](state, token) {
      state.token = token;
    },
    [SET_NAME](state, name) {
      state.name = name;
    },
    [SET_AGE](state, age) {
      state.age = age;
    },
    [SET_SEX](state, sex) {
      state.sex = sex;
    },
    [SET_AVATAR](state, avatar) {
      state.avatar = avatar;
    },
    [SET_PERMISSIONS](state, permissions) {
      state.permissions = permissions;
    },
    [SET_TYPE](state, type) {
      state.type = type;
    },
    [SET_DESC](state, desc) {
      state.desc = desc;
    },
    [SET_ALL](state, userInfo) {
      state = Object.assign(state, userInfo);
    }
  },
  actions: {
    // 用户登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        Api("login/login", userInfo)
          .then(resp => {
            setToken(resp.token);
            commit(SET_TOKEN, resp.token);
            return resolve(resp);
          })
          .catch(err => {
            return reject(err);
          });
      });
    },
    // 拉取用户信息
    pullUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        Api("login/userInfo")
          .then(resp => {
            commit(SET_ACCOUNT, resp.account);
            commit(SET_NAME, resp.name);
            commit(SET_AGE, resp.age);
            commit(SET_SEX, resp.sex);
            commit(SET_AVATAR, resp.avatar);
            commit(SET_PERMISSIONS, resp.permissions);
            commit(SET_TYPE, resp.type);
            commit(SET_DESC, resp.desc);
            return resolve(resp);
          })
          .catch(err => {
            return reject(err);
          });
      });
    },
    // 用户退出登录
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        Api("login/logout")
          .then(resp => {
            removeToken();
            commit(SET_TOKEN, "");
            commit(SET_NAME, "");
            return resolve();
          })
          .catch(err => {
            return reject(err);
          });
      });
    },
    // 头像更新
    doUpdateAvatar({ commit }, imgFile) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit(SET_AVATAR, imgFile);
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
        commit(SET_ALL, userInfo);
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }
  },
  getters: {
    token: state => state.token,
    name: state => state.name,
    age: state => state.age,
    avatar: state => state.avatar,
    permissions: state => state.permissions,
    allInfo: state => state
  }
};

export default user;
