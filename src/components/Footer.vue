<template>
  <footer id="footer">
    <div class="footer-menu">
      <div class="container">
        <div class="flex-box">
          <router-link to="/about">アバウト</router-link>
          <router-link to="/news">お知らせ</router-link>
          <router-link to="/privacy">プライバシーポリシー</router-link>
          <router-link to="/term">利用規約</router-link>
          <router-link to="/contact">お問い合わせ</router-link>
        </div>
      </div>
    </div>
    <div class="footer-btm">
      <div class="container">
        <p class="copyr">&copy; tsumiageday.com（仮）</p>
        <p class="maker">
          Make by:
          <a href="https://co.uetani33.net" target="_blank">co.uetani33.net</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped lang="scss">
.footer-menu {
  background-color: $main;
  font-size: 13px;
  padding: 1.6em 0;
  color: #fff;
  border-bottom: 1px solid #6f7579;
  a {
    color: #fff;
  }
  @media #{$sp} {
    .flex-box {
      justify-content: space-around;
      a {
        margin: 0.2em 0;
      }
    }
  }
}
.footer-btm {
  font-size: 12px;
  padding: 1em 0;
  text-align: center;
  background-color: $lmain;
  color: #fff;
  a {
    color: #fff;
    text-decoration: underline;
  }
  .container {
    position: relative;
  }
  .copyr {
  }
  .maker {
    position: absolute;
    top: 0;
    right: 0;
  }
  @media #{$sp} {
    .copyr {
      text-align: left;
    }
  }
}
</style>
