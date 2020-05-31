<template>
  <div class="SignUp">
    <div class="mv">
      <h1>
        <span class="ttl">会員登録</span>
      </h1>
    </div>

    <div class="container">
      <div class="content">
        <form @submit.prevent="signUp">
          <div>
            <dl>
              <dt>ユーザー名</dt>
              <dd>
                <input type="text" placeholder="例）田中太郎" v-model="userName" />
              </dd>
            </dl>
          </div>
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
              <p class="add-tac">
                <small>
                  ※
                  <router-link to="/term">利用規約</router-link>、
                  <router-link to="privacy">プライバシーポリシー</router-link>に同意の上ご利用ください
                </small>
              </p>
              <button class="btn a-css" type="submit">新規登録</button>
              <button
                class="btn a-css twitter-btn"
                type="button"
                v-on:click="twitterLogin"
              >twitterで登録</button>
            </div>
          </div>
          <p class="add-tr">
            <router-link to="/login">» ログインはこちらから</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import "../plugin/firebase";
import firebase from "firebase";
import { firebaseDB, firebaseAuth } from "../plugin/firebase.js";
export default {
  name: "SignUp",
  data: function() {
    return {
      userName: "",
      userMail: "",
      userPassword: ""
    };
  },
  methods: {
    async signUp() {
      if (this.userName === "") {
        alert("ユーザー名を入力してください。");
        return;
      }
      const firebaseSignup = await firebaseAuth
        .createUserWithEmailAndPassword(this.userMail, this.userPassword)
        .catch(err => {
          switch (err.code) {
            case "auth/invalid-email":
              alert(
                "メールアドレスを入力していないか、メールアドレスの形式が正しくありません。"
              );
              break;
            case "auth/weak-password":
              alert(
                "パスワードを入力していないか、6文字以下です。パスワードは6文字以上にしてください。"
              );
              break;
            case "auth/email-already-in-use":
              alert(
                "そのメールアドレスはすでに登録されています。別のメールアドレスで登録してください。"
              );
              break;
            default:
              alert(
                "サーバーエラー。何か問題が起きています。管理者に問い合わせてください。"
              );
          }
        });
      if (firebaseSignup && firebaseSignup.operationType === "signIn") {
        firebaseDB.collection("users").add({
          userId: firebaseSignup.user.uid,
          name: this.userName
        });
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
          alert("ログインに失敗しました。管理者までお問い合わせお願いします。");
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
