<template>
  <div id="app">
    <Header />

    <div id="main">
      <main>
        <transition>
          <router-view v-show="!isLoadingFlag" />
        </transition>
      </main>
    </div>

    <Footer />
  </div>
</template>
<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  name: "app",
  components: {
    Header,
    Footer
  },
  computed: {
    isLoadingFlag: function() {
      return this.$store.getters.getLoading;
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/scss/_mixin.scss";
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>