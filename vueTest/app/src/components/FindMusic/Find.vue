<template>
  <div class="find-muise">
    <Menu></Menu>
    <div class="content">
        <Recommend></Recommend>
    </div>
  </div>
</template>
<script>
    import Menu from "./Menu.vue";
    import Recommend from "./Recommend.vue";
    export default{
        name: "findMusic",
        components:{
          Menu,
          Recommend
        }
    }
</script>
