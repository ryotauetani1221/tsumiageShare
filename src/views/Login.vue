<template>
  <div class="Login">
    <div class="mv">
      <h1>
        <span class="ttl">ログイン画面</span>
      </h1>
    </div>

    <div class="container">
      <div class="content">
        <form @submit.prevent="login">
          <div>
            <dl>
              <dt>メールアドレス</dt>
              <dd>
                <input type="text" placeholder="例）tanakataro@gmail.com" v-model="userMail" />
              </dd>
            </dl>
          </div>
          <div>
            <dl>
              <dt>パスワード</dt>
              <dd>
                <input type="password" placeholder="パスワード" v-model="userPassword" />
              </dd>
            </dl>
          </div>
          <div>
            <div class="btn-wrap">
              <button class="btn a-css" type="submit">ログイン</button>
              <button
                class="btn a-css twitter-btn"
                type="button"
                v-on:click="twitterLogin"
              >twitterログイン</button>
            </div>
          </div>
          <p class="add-tr">
            <router-link to="/sign-up">» 新規登録はこちらから</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import "../plugin/firebase";
import firebase from "firebase";
import { firebaseAuth, firebaseDB } from "../plugin/firebase.js";
export default {
  name: "Login",
  data: function() {
    return {
      userMail: "",
      userPassword: ""
    };
  },
  methods: {
    async login() {
      const firebaseLogin = await firebaseAuth
        .signInWithEmailAndPassword(this.userMail, this.userPassword)
        .catch(err => {
          switch (err.code) {
            case "auth/invalid-email":
              alert("メールアドレスの形式がおかしいです。");
              break;
            case "auth/wrong-password":
              alert("パスワードが間違っています。");
              break;
            case "auth/user-not-found":
              alert("パスワードかメールアドレスが間違えています。");
              break;
            default:
              alert(
                "何らかの問題が発生しています。管理者までお問い合わせお願いします。"
              );
          }
        });
      if (firebaseLogin && firebaseLogin.operationType === "signIn") {
        this.$store.commit("setSignIn", true);
        this.$router.push("/admin");
      }
    },
    async twitterLogin() {
      const provider = new firebase.auth.TwitterAuthProvider();
      firebaseAuth.useDeviceLanguage();

      const twitterFirebaseLogin = await firebaseAuth
        .signInWithPopup(provider)
        .catch(function() {
          alert(
            "twitter登録に失敗しました。管理者までお問い合わせお願いします。"
          );
        });

      if (
        twitterFirebaseLogin &&
        twitterFirebaseLogin.operationType === "signIn"
      ) {
        // ログイン成功
        if (twitterFirebaseLogin.additionalUserInfo.isNewUser) {
          // 新規ユーザーの場合
          firebaseDB.collection("users").add({
            userId: twitterFirebaseLogin.user.uid,
            name: twitterFirebaseLogin.user.displayName,
            profImage: twitterFirebaseLogin.user.photoURL
          });
        }
        this.$store.commit("setSignIn", true);
        this.$router.push("/admin");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
form {
  max-width: 600px;
  margin: 0 auto;
  font-size: 18px;
  dl {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
  }
  dt {
    font-weight: bold;
    width: 8em;
  }
  dd {
    width: calc(100% - 9em);
    input {
      width: 100%;
      box-sizing: border-box;
      border-radius: 6px;
      border: #dfdfdf 2px solid;
      padding: 0.2em 0.4em;
      min-height: 2em;
      display: block;
    }
  }
}
</style>
