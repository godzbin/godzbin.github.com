<template>
  <div class="page1">
      <!-- <Input placeholder="test"></Input> -->
      <!-- <Button @click="success">成功</Button> -->
  </div>
</template>
<script>
  export default {
    methods:{
      success(){
        this.$Message.success("这是一个成功");
      }
    }
  }
</script>
