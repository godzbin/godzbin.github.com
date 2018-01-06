<template>
  <div id="app">
    <div class="layout">
      <Top></Top>
          <Row class="layout-content">
              <Col :span="spanLeft" class="left-nav-main">
                <Button type="text" @click="toggleClick" class="toggle-btn">
                  <Icon type="navicon" size="32"></Icon>
                </Button>
                <left-nav :is-show-text="isShowText"></left-nav>
              </Col>
              <Col :span="spanRight" class="layout-content-main">
                    <transition name="fade" mode="out-in" appear>
                    <router-view></router-view>
                    </transition>
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
      spanRight: 19,
      isShowText: true
    };
  },
  components: {
    Top,
    LeftNav,
    Bottom
  },
  methods: {
    toggleClick() {
      var self = this;
      if (this.spanLeft === 5) {
        this.spanLeft = 1;
        this.spanRight = 23;
        self.isShowText = false;
      } else {
        this.spanLeft = 5;
        this.spanRight = 19;
        setTimeout(function() {
          self.isShowText = true;
        }, 300);
      }
    }
  }
};
</script>
<style>
@import url("./assets/css/app.css");
</style>


