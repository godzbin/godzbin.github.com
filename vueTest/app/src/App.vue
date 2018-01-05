<template>
  <div id="app">
    <div class="layout">
      <Top></Top>
          <Row class="layout-content">
              <Col :span="spanLeft" class="left-nav-main">
                <Button type="text" @click="toggleClick" class="toggle-btn">
                  <Icon type="navicon" size="32"></Icon>
                </Button>
                <left-nav></left-nav>
              </Col>
              <Col :span="spanRight">
                  <div class="layout-content-main content">
                    <router-view></router-view>
                  </div>
              </Col>
          </Row>
      <Bottom></Bottom>
    </div>
</div>
</template>

<script>
import Top from "./components/Top";
import LeftNav from "./components/LeftNav";
import Bottom from "./components/Bottom";

export default {
  name: "app",
  data() {
    return {
      spanLeft: 5,
      spanRight: 9
    };
  },
  components: {
    Top,
    LeftNav,
    Bottom
  },
  methods: {
    toggleClick() {
      if (this.spanLeft === 5) {
        this.spanLeft = 2;
        this.spanRight = 22;
      } else {
        this.spanLeft = 5;
        this.spanRight = 19;
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 14px;
}
.layout {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.content {
  padding: 10px;
}
.layout-content {
  height: 100%;
  padding-top: 60px;
  padding-bottom: 80px;
}
.left-nav-main {
  padding-top: 50px;
  position: relative;
  height: 100%;
  background: #f3f3f5;
  overflow-y: hidden;
}
.toggle-btn{
  z-index: 99;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  text-align: left;
}
</style>
