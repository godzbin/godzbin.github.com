<template>
  <div class="left-nav">
    <Menu active-name="1-2" width="auto" :open-names="['1']">
        <MenuItem name="1-1"><Icon type="ios-search"></Icon>搜索</MenuItem>
        <MenuItem name="1-2"><Icon type="music-note"></Icon>发现音乐</MenuItem>
        <MenuItem name="1-3"><Icon type="ios-videocam-outline"></Icon>MV</MenuItem>
        <MenuItem name="1-4"><Icon type="ios-person-outline"></Icon>朋友</MenuItem>
        <MenuGroup title="我的音乐">
            <MenuItem name="2-1"><Icon type="ios-location-outline"></Icon>本地音乐</MenuItem>
            <MenuItem name="2-2"><Icon type="android-download"></Icon>下载管理</MenuItem>
            <MenuItem name="2-3"><Icon type="android-time"></Icon>最近播放</MenuItem>
            <MenuItem name="2-4"><Icon type="android-cloud-outline"></Icon>我的音乐云盘</MenuItem>
            <MenuItem name="2-5"><Icon type="flash-off"></Icon>我的电台</MenuItem>
            <MenuItem name="2-6"><Icon type="folder"></Icon>我的收藏</MenuItem>
        </MenuGroup>
        <MenuGroup title="创建的歌单">
            <MenuItem name="3-1"><Icon type="ios-heart-outline"></Icon>我喜欢的音乐</MenuItem>
        </MenuGroup>
        <MenuGroup title="收藏的歌单">
        </MenuGroup>
    </Menu>
  </div>
</template>
<script>
export default {
  name: "godz-left-nav"
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


