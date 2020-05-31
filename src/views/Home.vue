<template>
  <div class="home">
    <div class="mv">
      <h1>
        <span class="sub-ttl">
          \
          <a
            href="https://twitter.com/search?q=%23%E4%BB%8A%E6%97%A5%E3%81%AE%E7%A9%8D%E3%81%BF%E4%B8%8A%E3%81%92&src=recent_search_click"
            target="_blank"
            rel="nofollow"
          >#今日の積み上げ</a> を記録しよう！/
        </span>
        <span class="ttl">今日の積み上げメーカー</span>
      </h1>
      <img class="mv-img" src="@/assets/img/demo.png" />
      <div class="btn-wrap">
        <router-link class="btn" to="/make">積み上げてみる</router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "home",
  data: function() {
    return {};
  },
  components: {},
  methods: {}
};
</script>

<style scoped lang="scss">
</style>
