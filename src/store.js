import Vue from 'vue'
import Vuex from 'vuex'

import { firebaseDB } from './plugin/firebase'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    makeImage: "",
    userId: "",
    userName: "",
    userPictData: "",
    isSignIn: false,
    isSignInFinished: false,
    isLoading: false,
  },
  mutations: {
    setImage(state, image) {
      state.makeImage = image;
    },
    setUserId(state, uid) {
      state.userId = uid;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setUserPictData(state, pictData) {
      state.userPictData = pictData;
    },
    setSignIn(state, isSignIn) {
      state.isSignIn = isSignIn; // firebaseのログイン状態の判定
    },
    setSignInFinished(state) {
      state.isSignInFinished = true; // firebaseのログイン状態の判定が完了しかた（完了するまでヘッダーメニューを表示させない）
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
  },
  actions: {
    async actionSetUser(context, userId) {
      context.commit('setUserId', userId);
      const userData = await firebaseDB.collection("users").where('userId', "==", userId)
        .get();

      let userName = '';
      userData.forEach(function (item) {
        userName = item.data().name;
      });
      context.commit('setUserName', userName);

      // userの投稿画像情報を取得
      const userContentSnapShot = await firebaseDB
        .collection("contents")
        .where("userId", "==", userId)
        .get();
      const userContentData = [];
      userContentSnapShot.forEach(function (item) {
        userContentData.push(item.data());
      });
      context.commit('setUserPictData', userContentData);

    },
    actionSetSignIn(context, flag) {
      context.commit('setSignIn', flag);
    },
    actionSignInFinished(context) {
      context.commit('setSignInFinished');
    },

  },
  getters: {
    getSignIn(state) {
      return state.isSignIn;
    },
    getSignInFinished(state) {
      return state.isSignInFinished;
    },
    getUserId(state) {
      return state.userId;
    },
    getUserName(state) {
      return state.userName;
    },
    getMakeImage(state) {
      return state.makeImage;
    },
    getLoading(state) {
      return state.isLoading;
    },
    getUserPictData(state) {
      return state.userPictData;
    }
  }
})