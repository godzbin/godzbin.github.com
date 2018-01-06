<template>
  <div class="Bottom">
    <div model="horizontal" class="layout-bottom">
        <Row>
            <Col span="2" class="muise-bg">
              <img src="../assets/muise-bg.jpg" alt="">
            </Col>
            <Col span="3" class="muise-btn">
                    <Button shape="circle" type="primary" icon="ios-skipbackward"></Button>
                    <Button size="large" shape="circle" type="primary" icon="ios-play"></Button>
                    <Button shape="circle" type="primary" icon="ios-skipforward"></Button>
            </Col>
            <Col span="16" class="text-left slider">
              <p>某某歌</p>
              <Slider v-model="value1"></Slider>
            </Col>
            <Col span="3">
              <Button type="text" size="large" icon="ios-heart-outline"></Button>
              <Button type="text" size="large" icon="volume-low"></Button>
              <Button type="text" size="large" icon="android-delete"></Button>
            </Col>
        </Row>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      value1: 2
    }
  }
}
</script>

<style>
  .layout-bottom{
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 79px;
    line-height: 79px;
    border-top: 1px #ddd solid;
    background: #fff;
  }
  .muise-bg {
    text-align: left;
  }
  .muise-bg img{
    width: 80px;
    height: 80px;
  }
  .muise-btn button{
      margin-left: 10px;
      background: #C62F2F;
      border: 0;
  }
  .muise-btn button:hover{
     background: #eb5252;
      border: 0;
  }
  .text-left{
    text-align: left;
  }
  .slider{
    padding: 20px;
    line-height: 20px;
  }
  .ivu-slider-bar{
    background: #C62F2F;
  }
  .ivu-slider-button{
    border-color: #C62F2F;
  }
  .ivu-slider-button:hover{
    border-color: #C62F2F;
  }
</style>

