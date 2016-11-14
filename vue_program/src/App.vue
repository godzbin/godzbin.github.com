<template>
  <div id="app">
      <p>{{msg}}</p>
      <firstcomponent></firstcomponent>
      <ul>
        <li><router-link to='/first'>点我跳转到第一页</router-link></li>
        <li><router-link to='/second'>点我跳转到第二页</router-link>  </li>
      </ul>
      <router-view></router-view>
  </div>
</template>

<script>
import firstcomponent from "./component/firstcomponent.vue"
export default {
  name: 'app',
  data () {
    return {
      msg: 'hello world'
    }
  },
  components:{
    firstcomponent
  }
}
</script>

<style>
  
</style>
