<template>
  <div class="make">
    <div class="mv">
      <h1>
        <span class="ttl">今日の積み上げを考える</span>
      </h1>
    </div>
    <div class="container">
      <div class="content">
        <div class="flex-box make-input-form">
          <div class="col-xs-3 col-sm-12">
            <div class="tag-list">
              <h2>タグ</h2>
              <div v-for="(item) in tagList" v-bind:key="item.id">
                <input type="checkbox" :value="item" v-model="tag" :id="item" />
                <label :for="item">{{ item }}</label>
              </div>
            </div>
          </div>
          <div class="col-xs-9 col-sm-12">
            <div class="task-list">
              <h2>今日の積み上げを入力してください</h2>
              <textarea @keyup="taskAdd" v-model="task" placeholder="プログラミング学習、ブログ記事制作"></textarea>
            </div>
          </div>
        </div>
        <div class="svg-wrap">
          <div class="svg" ref="svgDom">
            <svg ref="svgCard" width="1200" height="630">
              <g class="layer">
                <rect fill="#509ede" height="100%" width="100%" x="0" y="0" />
                <text x="50%" y="10%" text-anchor="middle" font-size="36" fill="#fff">#今日の積み上げ</text>
                <g>
                  <rect x="120" y="120" rx="15" ry="15" width="960" height="440" fill="#fff" />
                  <text font-size="24" x="15%" y="25%">
                    <tspan
                      x="150"
                      v-for="(item,index) in taskList"
                      v-bind:key="item.id"
                      v-bind:y="170 + index * 40"
                    >{{ item }}</tspan>
                  </text>
                </g>
                <text x="15" y="98%" fill="#fff">
                  <template v-if="tag.length > 0">タグ：</template>
                  <template v-for="(item) in tagList">
                    <template v-if="tag.indexOf(item) >= 0">{{item}}</template>
                  </template>
                </text>
                <text x="87%" y="98%" fill="#fff">tsumiageday.com</text>
              </g>
            </svg>
          </div>
        </div>
        <div class="btn-wrap">
          <div class="btn a-css" @click="svgMake">積み上げを制作する</div>
        </div>
        <div class="loading-icon-wrap" v-show="makeLoading">
          <div class="loading-icon"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CONSTANT from "@/config.js";
import "../plugin/firebase";
import { firebaseDB, firebaseStorage } from "../plugin/firebase.js";
export default {
  name: "Make",
  data: function() {
    return {
      tag: [],
      tagList: CONSTANT.CONTENT_TAGS,
      task: "",
      taskList: [],
      makeLoading: false
    };
  },
  mounted: function() {
    this.setSvgZoom();
    window.addEventListener("resize", this.setSvgZoom, false);
  },
  destroyed: function() {
    window.removeEventListener("resize", this.setSvgZoom, false);
  },
  methods: {
    getTodayDate(delimiter = "", details = false) {
      // delimiterは日付の区切り文字。引数なければ無し
      // 今日の日付をYYYYMMDDの文字列に
      const date = new Date();
      let format = "YYYY" + delimiter + "MM" + delimiter + "DD";
      format = format.replace(/YYYY/, date.getFullYear());

      // 月と日は1桁なら0をつけて2桁にする
      format = format.replace(/MM/, ("0" + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/, ("0" + date.getDate()).slice(-2));

      if (details) {
        format =
          format +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds();
      }
      return format;
    },
    makeId() {
      // 固有のIDを作る 日付 + ランダムな文字列
      const todayDateStrings = this.getTodayDate();
      const randomString = "xxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      return todayDateStrings + "-" + randomString;
    },
    setSvgZoom() {
      this.$refs.svgDom.style.zoom = window.parent.screen.width / 1200;
    },
    taskAdd() {
      const textareaList = this.task.split(/\n/);
      this.taskList = textareaList;
    },
    svgMake() {
      // 処理待ちローディング表示
      this.makeLoading = true;

      const canvas = document.createElement("canvas");
      canvas.width = CONSTANT.DATA_WIDTH;
      canvas.height = CONSTANT.DATA_HIGHT;
      const image = new Image();
      const svgData = new XMLSerializer().serializeToString(this.$refs.svgCard);
      image.src =
        "data:image/svg+xml;charset=utf-8;base64," +
        btoa(unescape(encodeURIComponent(svgData)));
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, CONSTANT.DATA_WIDTH, CONSTANT.DATA_HIGHT);
      image.onload = async () => {
        ctx.drawImage(image, 0, 0, CONSTANT.DATA_WIDTH, CONSTANT.DATA_HIGHT);
        const fileImage = canvas.toDataURL();

        this.$store.commit("setImage", fileImage);

        const contentId = this.makeId();

        // Cloud Storageにアップロード
        const upFileRef = firebaseStorage
          .ref("contents")
          .child(contentId + ".png");
        const upSnapshot = await upFileRef.putString(fileImage, "data_url");
        const dlUrl = await upSnapshot.ref.getDownloadURL();

        const upFireStoreData = await firebaseDB.collection("contents").add({
          contentId: contentId,
          url: dlUrl,
          tag: this.tag
        });

        if (this.$store.getters.getSignIn) {
          // もしログインしていれば、userId, 日付を入力
          await firebaseDB
            .collection("contents")
            .doc(upFireStoreData.id)
            .update({
              userId: this.$store.getters.getUserId,
              date: this.getTodayDate("/", true)
            });

          // ユーザーデータを更新
          this.$store.dispatch("actionSetUser", this.$store.getters.getUserId);
        }

        // snsシェア用テキスト
        let shareText = this.task;
        if (shareText.length > 15) {
          shareText = shareText + "...";
        }

        // 画像表示ページへ遷移
        this.$router.push("/content/" + contentId + "?text=" + shareText);
      };
    }
  }
};
</script>
<style scoped lang="scss" >
.make-input-form {
  margin: 0 auto;
  max-width: 900px;
}
.svg {
  width: 1200px;
  margin: 0 auto 2em;
  tspan {
  }
}
.task-list {
  textarea {
    box-sizing: border-box;
    font-size: 16px;
    border-radius: 6px;
    min-height: 10.5em;
    min-width: 100%;
    border: #dfdfdf 2px solid;
    padding: 0.2em 0.4em;
    font-size: 16px;
    display: block;
  }
}
@media (min-width: 1201px) {
  .svg {
    zoom: 1 !important;
  }
}
@media (max-width: 1200px) {
  .svg-wrap {
    margin: 0 -20px;
  }
}
</style>