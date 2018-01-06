<template>
  <div class="left-nav">
    <Menu active-name="1-2" width="auto" :open-names="['1']">
        <MenuItem name="1-1" titile="搜索"><Icon type="ios-search" ></Icon><span v-if="isShowText">搜索</span></MenuItem>
        <MenuItem name="1-2"><Icon type="music-note"></Icon><span v-if="isShowText">发现音乐</span></MenuItem>
        <MenuItem name="1-3"><Icon type="ios-videocam-outline"></Icon><span v-if="isShowText">MV</span></MenuItem>
        <MenuItem name="1-4"><Icon type="ios-person-outline"></Icon><span v-if="isShowText">朋友</span></MenuItem>
        <MenuGroup :title="isShowText ? '我的音乐':''" v-if="isShowText">
            <MenuItem name="2-1"><Icon type="ios-location-outline"></Icon><span v-if="isShowText">本地音乐</span></MenuItem>
            <MenuItem name="2-2"><Icon type="android-download"></Icon><span v-if="isShowText">下载管理</span></MenuItem>
            <MenuItem name="2-3"><Icon type="android-time"></Icon><span v-if="isShowText">最近播放</span></MenuItem>
            <MenuItem name="2-4"><Icon type="android-cloud-outline"></Icon><span v-if="isShowText">我的音乐云盘</span></MenuItem>
            <MenuItem name="2-5"><Icon type="flash-off"></Icon><span v-if="isShowText">我的电台</span></MenuItem>
            <MenuItem name="2-6"><Icon type="folder"></Icon><span v-if="isShowText">我的收藏</span></MenuItem>
        </MenuGroup>
        <MenuGroup :title="isShowText ? '创建的歌单':''" v-if="isShowText">
            <MenuItem name="3-1"><Icon type="ios-heart-outline"></Icon><span v-if="isShowText">我喜欢的音乐</span></MenuItem>
        </MenuGroup>
        <MenuGroup :title="isShowText? '收藏的歌单' :''" v-if="isShowText">
        </MenuGroup>
    </Menu>
  </div>
</template>
<script>
export default {
  name: "godz-left-nav",
  props:{
      isShowText:{
          type:Boolean,
          default: true
      }
  }
};
</script>
<style>
.left-nav {
  height: 100%;
  overflow-y: scroll;
  background: #f3f3f5;
  text-align: left;

}
.left-nav::-webkit-scrollbar{
    width:2px;
    height: 10px;
    background-color: #f5f5f5;
}
.ivu-menu-item-group{
  padding-top: 15px;
}
</style>


