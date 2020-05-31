import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Make from './views/Make.vue'
import Content from './views/Content.vue'
import SignUp from './views/SignUp.vue'
import Login from './views/Login.vue'
import Admin from './views/Admin.vue'
import About from './views/About.vue'
import News from './views/News.vue'
import Privacy from './views/Privacy.vue'
import Term from './views/Term.vue'
import Contact from './views/Contact.vue'
import NotFound from './views/NotFound.vue'

import './plugin/firebase'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/make',
      name: 'make',
      component: Make
    },
    {
      path: '/content/:content_id',
      name: 'content',
      component: Content
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUp
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/news',
      name: 'news',
      component: News
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: Privacy
    },
    {
      path: '/term',
      name: 'term',
      component: Term
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  // ページ移動時に一番上にスクロール
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})