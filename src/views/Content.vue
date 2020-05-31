<template>
  <div class="img-content">
    <div class="mv">
      <h1>
        <span class="ttl">今日の積み上げ</span>
      </h1>
    </div>

    <div class="container">
      <div class="content">
        <div class="content-tsumiage-pict">
          <div v-if="this.$store.getters.getMakeImage" v-html="getStoreImgDom"></div>
          <div v-else v-html="getStorageImgDom">{{getStorageImgDom}}</div>
        </div>
        <h2 class="add-tac">積み上げをSNSでシェアする</h2>
        <ul class="sns-btn flex-box">
          <li>
            <a :href="getShareLinkTwitter" target="_blank" rel="nofollow">
              <i class="fa-3x fab fa-twitter-square twitter"></i>
            </a>
          </li>
          <li>
            <a :href="getShareLinkFB" target="_blank" rel="nofollow">
              <i class="fa-3x fab fa-facebook-square facebook"></i>
            </a>
          </li>
          <li>
            <a :href="getShareLinkLine" target="_blank" rel="nofollow">
              <i class="fa-3x fab fa-line line"></i>
            </a>
          </li>
          <li>
            <a :href="getShareLinkHatena" target="_blank" rel="nofollow">
              <i class="hatena">
                <span>B!</span>
              </i>
            </a>
          </li>
        </ul>
        <!-- 自分で画像を作った時だけ表示 -->
        <!-- ログイン訴求 -->
        <div v-if="!signInState">
          <div class="add-tac">
            <h2 class>会員登録すると積み上げの記録ができます</h2>
            <!-- <img src="@/assets/img/demo.png" alt /> -->
          </div>
          <div class="btn-wrap">
            <router-link class="btn" to="/sign-up">
              会員登録して
              <br class="sp" />積み上げの記録をする
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "../plugin/firebase";
import { firebaseStorage } from "../plugin/firebase.js";
import store from "@/store";
export default {
  name: "Content",
  data: function() {
    return {
      imageSrc: "",
      shareTitle: "今日の積み上げ",
      shareUrl: location.href.replace("content", "share").replace(/\?.*$/, ""),
      shareText: this.$route.query.text,
      hashTag: ["今日の積み上げ", "tsuimageday"]
    };
  },
  created: async function() {
    // 見せ掛けようのURLだけ「/share/パラメーター」へ変更
    // 「/share/パラメーター」は、CloudFunctionでOGPを作るページ。
    // 「/share/パラメーター」は人間のアクセスは「/content/パラメーター」へリダイレクト
    window.history.replaceState(null, null, this.shareUrl);
    const contentId = this.$route.params.content_id;
    if (contentId) {
      const firebaseStorageSnapshot = await firebaseStorage
        .ref("contents")
        .child(contentId + ".png")
        .getDownloadURL()
        .catch(() => "");
      if (firebaseStorageSnapshot) {
        this.imageSrc = firebaseStorageSnapshot;
      } else {
        this.$router.push("/");
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.path != "/make") {
      store.commit("setImage", "");
    }
    next();
    store.commit("setLoading", false);
  },
  computed: {
    signInState() {
      return this.$store.getters.getSignIn;
    },
    getStoreImgDom() {
      return '<img src="' + this.$store.getters.getMakeImage + '" />';
    },
    getStorageImgDom() {
      return '<img src="' + this.imageSrc + '" />';
    },
    getShareLinkTwitter() {
      return encodeURI(
        "https://twitter.com/intent/tweet?url=" +
          this.shareUrl +
          "&text=" +
          this.shareText +
          "&hashtags=" +
          this.hashTag
      );
    },
    getShareLinkFB() {
      return encodeURI(
        "https://www.facebook.com/sharer.php?src=bm&=" + this.shareUrl
      );
    },
    getShareLinkLine() {
      return encodeURI(
        "https://social-plugins.line.me/lineit/share?url=" + this.shareUrl
      );
    },
    getShareLinkHatena() {
      return encodeURI(
        "http://b.hatena.ne.jp/add?mode=confirm&url=" +
          this.shareUrl +
          "&title=" +
          this.shareTitle
      );
    }
  },
  methods: {}
};
</script>


<style lang="scss" scoped>
.sns-btn {
  max-width: 240px;
  margin: 0 auto;
  padding: 0;
  font-size: 16px;
  li {
  }
  a {
    text-decoration: none;
  }
  .twitter {
    color: #00acee;
  }
  .facebook {
    color: #3b5998;
  }
  .line {
    color: #6cc655;
  }
  .hatena {
    width: 42px;
    height: 43px;
    display: block;
    border-radius: 6px;
    margin: 3px 0 2px 0;
    color: #fff;
    background-color: #5d8ac1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
    span {
    }
  }
}
@media #{$sp} {
  .content-tsumiage-pict {
    margin: 0 -20px;
  }
}
</style>
