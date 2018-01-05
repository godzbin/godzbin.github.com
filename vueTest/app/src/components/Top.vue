<template>
  <div class="godz-nav">
      <Menu mode="horizontal nav"  active-name="1">
        <div class="layout-logo">注意，这是一个logo</div>
        <Row>
            <Col span="3" offset="1">
                <ButtonGroup>
                    <Button class="red-btn">
                        <Icon type="chevron-left" color="#fff"></Icon>
                    </Button>
                    <Button class="red-btn">
                        <Icon type="chevron-right" color="#fff"></Icon>
                    </Button>
                </ButtonGroup>
            </Col>
            <Col span="3">
                <Input class="search-input" v-model="value4" icon="ios-search" color="#f0f0f0" placeholder="搜索" style="width: 200px"></Input>
            </Col>
            <Col span="3" offset="7">
                <Avatar icon="person" />
                <Dropdown trigger="custom" :visible="visible" style="margin-left: 20px">
                    <Button class="username-btn" type="text" @click="handleOpen">某某某 <Icon type="arrow-down-b" color="#FFFFFF"></Icon></Button>
                    <DropdownMenu slot="list">
                        <p>常用于各种自定义下拉内容的场景。</p>
                        <div style="text-align: right;margin:10px;">
                            <Button type="primary" @click="handleClose">关闭</Button>
                        </div>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="3">
                <Button type="text"><Icon type="tshirt-outline" color="#f0f0f0" size="22"></Icon></Button>
                <Button type="text"><Icon type="ios-email-outline" color="#f0f0f0"  size="22"></Icon></Button>
                <Button type="text"><Icon type="ios-gear-outline" color="#f0f0f0"  size="22"></Icon></Button>
            </Col>
        </Row>
      </Menu>
  </div>
</template>
<script>
export default {
  name: "godz-nav",
  data() {
    return {
      visible: false
    };
  },
  methods: {
    handleOpen() {
      this.visible = !this.visible ;
    },
    handleClose() {
      this.visible = false;
    }
  }
};
</script>
<style>
.godz-nav {
    height: 60px;
    position: absolute;
    width: 100%;
}
.godz-nav .nav{
    background: #C62F2F;
}
.layout-logo {
  font-size: 12px;
  width: 150px;
  height: 30px;
  background: #a60000;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
  color: #fff;
  line-height: 30px;
}
.godz-nav .red-btn{
    height: 30px;
    border:1px #960000 solid;
    background: #C62F2F;
}
.godz-nav .search-input input{
    border-radius: 20px;
    background: #960000;
    border: 0;
    color:#f0f0f0;
}
.godz-nav .username-btn{
    color:#f0f0f0;
    overflow: hidden;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
}
</style>

