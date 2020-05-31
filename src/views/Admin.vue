<template>
  <div class="Admin">
    <div class="mv">
      <h1>
        <span class="ttl">管理画面</span>
      </h1>
    </div>

    <div class="container">
      <div class="content">
        <h2 class="add-tac">{{this.$store.getters.getUserName}}さんの過去の積み上げ（最新のものから表示）</h2>
        <p class="add-tac">
          <router-link to="/make">» 新しい積み上げを記録する</router-link>
        </p>

        <h3>表示を絞り込む</h3>
        <div class="sort-box">
          <span class="sort-box-list">
            <input type="checkbox" id="checkShowAll" v-model="checkShowAll" />
            <label for="checkShowAll">全て表示</label>
          </span>
          <span class="sort-box-list" v-for="(item) in tagList" v-bind:key="item.id">
            <input
              type="checkbox"
              :value="item"
              v-model="contentSortTag"
              :disabled="checkShowAll"
              :id="item"
            />
            <label :for="item">{{ item }}</label>
          </span>
        </div>
        <div class="content-data-wrap">
          <div class="flex-box">
            <div
              class="content-data col-xs-6 col-sm-12"
              v-for="(item) in showContentData"
              :key="item.date"
            >
              <router-link :to="{name:'content',params:{content_id:item.contentId}}">
                <figure>
                  <div class="content-data-img-wrap">
                    <img :src="item.url" alt />
                  </div>
                  <figcaption>
                    <span v-if="item.tag.length > 0">タグ：{{item.tag.join(',')}}</span>
                    日付：{{item.date.slice(0,11)}}
                  </figcaption>
                </figure>
              </router-link>
            </div>
            <div class="col-sm-12" v-if="showContentDataNum < sortContentDataNum">
              <div class="btn-wrap">
                <div class="btn a-css" @click="addContentShowPageState">もっとみる</div>
              </div>
            </div>
          </div>
          <!-- .flex-box -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { firebaseAuth } from "../plugin/firebase.js";
import CONSTANT from "@/config.js";
import store from "@/store";
export default {
  name: "Admin",
  data: function() {
    return {
      contentData: [],
      checkShowAll: true,
      tagList: CONSTANT.CONTENT_TAGS,
      contentSortTag: [],
      contentShowPageState: 1,
      contentDataShowNum: 4
    };
  },
  created: function() {},
  beforeRouteEnter(to, from, next) {
    // ログインしていないのに「/admin」にアクセスされたら「/」へリダイレクト
    firebaseAuth.onAuthStateChanged(function(user) {
      if (user) {
        next();
      } else {
        next({
          path: "/"
        });
      }
    });
    store.commit("setLoading", false);
  },
  computed: {
    showContentData() {
      return this.sortCheckContent().slice(0, this.showContentDataNum);
    },
    sortContentDataNum() {
      return this.sortCheckContent().length;
    },
    // 表示する画像の数
    showContentDataNum() {
      return this.contentShowPageState * this.contentDataShowNum;
    }
  },
  methods: {
    sortCheckContent() {
      const vueThis = this;
      let returnUserData = [];
      const storeUserPictData = this.$store.getters.getUserPictData;
      if (storeUserPictData.length > 0) {
        returnUserData = storeUserPictData.filter(function(item) {
          if (!vueThis.checkShowAll) {
            // 特定のタグでソート
            if (item.tag) {
              if (
                vueThis.checkTwoArrayOverlap(item.tag, vueThis.contentSortTag)
              ) {
                return item;
              }
            }
          } else {
            return item;
          }
        });
      } else {
        returnUserData = [];
      }
      // 日付でソート
      returnUserData.sort(function(a, b) {
        console.log(a.date);
        return a.date < b.date ? 1 : -1;
      });
      console.log(returnUserData);
      return returnUserData;
    },
    // 2つの配列に1つでも同じのものがあるかチェック
    checkTwoArrayOverlap(arr1, arr2) {
      return (
        [...arr1, ...arr2].filter(
          item => arr1.includes(item) && arr2.includes(item)
        ).length > 0
      );
    },
    addContentShowPageState() {
      this.contentShowPageState++;
    }
  }
};
</script>
<style lang="scss" scoped>
.sort-box {
  margin: 0 0 1.2em;
  .sort-box-list {
    margin: 0 1em 0 0;
  }
}
input:disabled + label {
  opacity: 0.6;
  color: #888;
}
.content-data {
  a {
    display: block;
    text-decoration: none;
    color: inherit;
  }
  .content-data-img-wrap {
    width: 100%;
    height: 0;
    padding-top: 52.5%;
    position: relative;
    > img {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  figcaption {
    margin: 0.3em 0 0;
  }
}
</style>
