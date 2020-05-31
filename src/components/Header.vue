<template>
  <header id="header">
    <div class="container">
      <div class="header-menu">
        <img class="sp sp-hunb" src="@/assets/img/sp-hunb.png" @click="toggleSpMenu" />
        <h1>
          <router-link to="/">今日の積み上げメーカー（仮）</router-link>
        </h1>
        <div v-show="signInStateFinished">
          <ul v-if="isSpMenuActive" class="flex-box">
            <li>
              <router-link to="/about" @click.native="toggleSpMenu">使い方</router-link>
            </li>
            <template v-if="signInState">
              <li>
                <span class="a-css sub-btn" @click="logout" style="background: #636465">ログアウト</span>
              </li>
              <li>
                <router-link to="/admin" class="sub-btn" @click.native="toggleSpMenu">管理画面</router-link>
              </li>
            </template>
            <template v-else>
              <li>
                <router-link to="/sign-up" class="sub-btn" @click.native="toggleSpMenu">会員登録</router-link>
              </li>
              <li>
                <router-link
                  to="/login"
                  class="sub-btn"
                  @click.native="toggleSpMenu"
                  style="background:#509ede;"
                >ログイン</router-link>
              </li>
            </template>
            <li>
              <router-link
                to="/make"
                class="sub-btn"
                @click.native="toggleSpMenu"
                style="background:#009633;"
              >積み上げを記録する</router-link>
            </li>
            <div class="sp-shadow" @click="toggleSpMenu"></div>
          </ul>
        </div>
        <!-- v-show="this.$store.getters.getSignInFinished" -->
      </div>
    </div>
  </header>
</template>

<script>
import "../plugin/firebase";
import { firebaseAuth } from "../plugin/firebase";
export default {
  name: "Header",
  data: function() {
    return {
      isSpMenuActive: false
    };
  },
  created: function() {
    // firebaseでログインしているか確認
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("actionSetSignIn", true);
        this.$store.dispatch("actionSetUser", user.uid);
      }
      this.$store.dispatch("actionSignInFinished");
    });
  },
  computed: {
    signInState: function() {
      return this.$store.getters.getSignIn;
    },
    signInStateFinished: function() {
      return this.$store.getters.getSignInFinished;
    }
  },
  mounted: function() {
    // ウィンドウ幅でPCかSPか判定
    this.setIsSpMenu();
    window.addEventListener("resize", this.setIsSpMenu, false);
  },
  methods: {
    async logout() {
      await firebaseAuth
        .signOut()
        .catch(error => alert(`ログアウト時にエラーが発生しました (${error})`));
      this.$store.dispatch("actionSetSignIn", false);
      this.$store.commit("setUserPictData", "");
      this.$router.push(
        "/",
        () => {},
        () => {}
      );

      // sp時メニュー閉じる
      this.toggleSpMenu();
    },
    setIsSpMenu() {
      if (window.parent.screen.width > 750) {
        this.isSpMenuActive = true;
      } else {
        this.isSpMenuActive = false;
      }
    },
    toggleSpMenu() {
      if (window.parent.screen.width < 751) {
        this.isSpMenuActive = !this.isSpMenuActive;
      }
    }
  }
};
</script>

<style scoped lang="scss">
#header {
  position: relative;
  z-index: 10;
  font-size: 14px;
  background: $main;
  padding: 1.2em 0;
  color: #fff;
  a,
  .a-css {
    font-weight: bold;
    color: #fff;
  }
}
.header-menu {
  @media #{$pc} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  h1 {
    margin-right: auto;
    font-size: 120%;
  }
  .flex-box {
    align-items: center;
    a,
    .a-css {
      margin-left: 1.4em;
    }
  }
  @media #{$sp} {
    h1 {
      text-align: center;
    }
    .sp-hunb {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      padding: 10px;
      box-sizing: content-box;
    }
    .flex-box {
      position: absolute;
      width: 100%;
      top: 100%;
      left: 0;
      justify-content: center;
      flex-wrap: wrap;
      background-color: $main;
      z-index: -1;
      .sp-shadow {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        width: 100%;
        height: 100%;
        z-index: -1;
      }
      li {
        display: block;
        width: 100%;
        padding: 0.6em 20px;
      }
      a,
      .a-css {
        margin: 0;
      }
    }
  }
}
</style>

