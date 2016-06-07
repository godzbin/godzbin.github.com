/**
 * Created by Administrator on 2016/1/10.
 * Class Name: 显示对象 类 （显示对象基类）
 * Author: Keiling_J
 */
function DisplayObject() {
    //坐标 X
    this.x = 0;
    //坐标 Y
    this.y = 0;
    //显示对象的宽度
    this.width = 0;
    //显示对象的高度
    this.height = 0;
    //X方向的锚点
    this.anchorX = 0;
    //Y方向的锚点
    this.anchorY = 0;
    //缩放大小
    this.scale = 1;
    //围绕锚点的旋转角度
    this.rotation = 0;
    //zIndex
    this.z = 0;
    //is obj alive
    this.isAlive=true;

    //事件绑定对象
    this.evtObject=null;

    /*{
     type:arc|rect
     option:r|(w,h)
     }*/
    this.mask=null;
}

DisplayObject.prototype.showMask = function(ctx){
    //this.mask =
    if(this.mask) {
        if (this.mask.type == "arc") {
            ctx.beginPath();
            //圆形的圆形遮罩有bug
            if(this.mask.pos){
                ctx.arc(this.mask.pos.x, this.mask.pos.y, this.mask.r / window["KWRatio"], 0, Math.PI * 2);
            }else {
                ctx.arc(0, 0, this.mask.r / window["KWRatio"], 0, Math.PI * 2);
            }
            ctx.closePath();
        }
        ctx.clip();
    }
};

DisplayObject.prototype.draw = function(ctx){};

//设置显示对象的Z
DisplayObject.prototype.setZ = function(val,stage){
    this.z=val;
    //重新刷新所有显示对象的 绘制先后顺序
    stage.reflashZ();
};

//设置锚点
DisplayObject.prototype.setAnchor = function(val){
    this.anchorX = val;
    this.anchorY = val;
};

//使用锚点 内部调用不用管
DisplayObject.prototype.UseAnchor = function(){
    var pos = {x:0,y:0};
    var scl = this.UseScale();
    pos.x = this.x-scl.width*this.anchorX;
    pos.y = this.y-scl.height*this.anchorY;
    return pos;
};

//设置显示对象的scale
DisplayObject.prototype.setScale = function(val){
    this.scale = val;
};

//内部调用无需理
DisplayObject.prototype.UseScale = function(){
    var scl = {height:0,width:0};
    scl.width = this.width*this.scale;
    scl.height = this.height*this.scale;
    return scl;
};