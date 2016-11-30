<template>
  <div id="app">
      <div class="app-content">
        <router-view class="app-content-main"></router-view>
      </div>
      <nav class="app-nav" @touchstart="touchNav">
        <li><router-link to='/index' index="1" v-bind:class="{'active': nav == 1}">电影</router-link></li>
        <li><router-link to='/second'  index="2" v-bind:class="{'active': nav == 2}">电视剧</router-link></li>
        <li><router-link to='/first'  index="3" v-bind:class="{'active': nav == 3}">图书</router-link></li>
        <li><router-link to='/first'  index="4" v-bind:class="{'active': nav == 4}">我的</router-link></li>
      </nav>
  </div>
</template>

<script>
require('./assets/css/public.scss');
export default {
  name: 'app',
  data () {
    return {
      msg: 'hello world',
      nav: 1
    }
  },
  methods: {
    touchNav(e){
      console.log(e);
      var target = e.target;
      if(target.tagName == "A"){
        this.nav = target.getAttribute("index");
      }
    }
  }
}
</script>

<style>
  
</style>
