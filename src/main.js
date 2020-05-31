import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugin/firebase'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  store.commit("setLoading", true);
  next()
})

router.afterEach(() => {
  store.commit("setLoading", false);
})

require('./assets/scss/base.scss')