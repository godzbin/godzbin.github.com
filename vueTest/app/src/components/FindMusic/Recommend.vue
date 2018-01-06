<template>
  <div class="recommend-page">
    <Carousel class="carousel-box" autoplay  v-model="value1" loop dots="outside">
        <CarouselItem>
            <div class="demo-carousel"><img src="../../assets/muise-bg.jpg" alt=""></div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel"><img src="../../assets/muise-bg.jpg" alt=""></div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel"><img src="../../assets/muise-bg.jpg" alt=""></div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel"><img src="../../assets/muise-bg.jpg" alt=""></div>
        </CarouselItem>
    </Carousel>
    <Row class="row title-box">
        <Col class="title" span="5" >推荐表单</Col>
        <Col class="more-btn" span="5" offset="14">更多</Col>
    </Row>
    <Row>
        <Col  class="song-list-box">
            <div class="song-list-img">
                <img src="../../assets/beiduofen.png" alt="">
            </div>
            <p>每日歌曲推荐</p>
        </Col>
        <Col  class="song-list-box" v-for="item in list" :key="item">
            <div class="song-list-img">
                <img src="../../assets/beiduofen.png" alt="">
            </div>
            <p>每日歌曲推荐</p>
        </Col>
    </Row>
    <Row class="row title-box">
        <Col class="title" span="5" >独家放送</Col>
        <Col class="more-btn" span="5" offset="14">更多</Col>
    </Row>
    <Row>
        <Col span="8" class="list-box-2">
            <div class="song-list-img">
                <img src="../../assets/muise-bg.jpg" alt="">
            </div>
            <p>你是我们的信仰</p>
        </Col>
        <Col span="8" class="list-box-2">
            <div class="song-list-img">
                <img src="../../assets/muise-bg.jpg" alt="">
            </div>
            <p>你是我们的信仰</p>
        </Col>
        <Col span="8" class="list-box-2">
            <div class="song-list-img">
                <img src="../../assets/muise-bg.jpg" alt="">
            </div>
            <p>你是我们的信仰</p>
        </Col>
    </Row>
    <Row class="row title-box">
        <Col class="title" span="5" >最新音乐</Col>
        <Col class="more-btn" span="5" offset="14">更多</Col>
    </Row>
    <Row>
        <Col span="12" v-for="(item,index) in songList" :key="item">
            <div class="song-box">
                {{index + 1}}
                <img src="" alt="">
                <div class="song-info">
                    {{item.name}}
                </div>
            </div>
        </Col>
    </Row>
    <Row class="row title-box">
        <Col class="title" span="5" >推荐MV</Col>
        <Col class="more-btn" span="5" offset="14">更多</Col>
    </Row>
    <Row>
        <Col span="8" class="list-box-2">
            <div class="song-list-img">
                <img src="../../assets/muise-bg.jpg" alt="">
            </div>
            <p>你是我们的信仰</p>
        </Col>
        <Col span="8" class="list-box-2">
            <div class="song-list-img">
                <img src="../../assets/muise-bg.jpg" alt="">
            </div>
            <p>你是我们的信仰</p>
        </Col>
        <Col span="8" class="list-box-2">
            <div class="song-list-img">
                <img src="../../assets/muise-bg.jpg" alt="">
            </div>
            <p>你是我们的信仰</p>
        </Col>
    </Row>
    <Row class="row title-box">
        <Col class="title" span="5" >主播电台</Col>
        <Col class="more-btn" span="5" offset="14">更多</Col>
    </Row>
    <Row>
        <Col span="12" v-for="(item,index) in songList" :key="item">
            <div class="song-box">
                {{index + 1}}
                <img src="" alt="">
                <div class="song-info">
                    {{item.name}}
                </div>
            </div>
        </Col>
    </Row>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                value1: 0,
                list:["","","","","","","","",""],
                songList:[{name:"11"},{name:"11"},{name:"11"},{name:"11"}]
            }
        }
    }
</script>
<style>
    .carousel-box{
        margin-top: 10px;
    }
    .demo-carousel img{
        width: 100%;
        max-height: 200px;
    }
    .title-box{
        border-bottom: 1px #ddd solid;
        line-height: 40px;
    }
    .title{
        text-align: left;
        font-size: 16px;
    }
    .more-btn{
        font-size: 12px;
        text-align: right;
    }
    .song-list-box{
        float: left;
        width: 20%;
        padding: 10px;
        text-align: left;
    }
    .song-list-img{
        min-height: 150px;
        background: #fff;
    }

    .song-list-img img{
        width: 100%;
    }
    .list-box-2{
        padding: 10px; 
        text-align: left;
    }
</style>

