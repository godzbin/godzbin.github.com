import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import FindMusic from "@/components/FindMusic/Find.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FindMusic',
      component: FindMusic
    }
  ]
})
