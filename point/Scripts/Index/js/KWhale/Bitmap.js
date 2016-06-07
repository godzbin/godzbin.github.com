/**
 * Created by Administrator on 2016/1/10.
 * Class Name: 位图 纹理 类
 * Author: Keiling_J
 */
function Bitmap(img) {
    /* 图片资源 */
    this.img = img;
    this.width = img.width;
    this.height = img.height;
    /* 图片宽高比例 */
    this.proportion = img.width / img.height;
    /* 透明度 */
    this.alpha = 1;
    /* 3D 是否支持3D */
    this.is3D = false;
    /* 3D 拓展坐标 */
    this.z_3d = 0;
    /* 3D 围绕z轴旋转的半径 */
    this.z_r = 100;
};

Bitmap.prototype = new DisplayObject();
//alpha ; rotation ; scale ; anchor ; x ; y
Bitmap.prototype.draw = function(ctx){
    if(this.is3D){
        /* 如果支持3D  z轴的大小用scale来表现 */
        this.scale = Math.abs(this.z_r/(this.z_r-this.z_3d));
    }
    var scl = this.UseScale();
    var pos = this.UseAnchor();
    var img = this.img;
    var rotate = this.rotation;
    var anchorX = this.anchorX;
    var anchorY = this.anchorY;
    var alpha = this.alpha;
    ctx.save();
    var horizontal = 1;
    if(this.scale ==-1){
        ctx.scale(-1, 1);
        horizontal=-1;
    }
    if(alpha!=1)
        ctx.globalAlpha = alpha;
    ctx.translate((pos.x*horizontal+anchorX*scl.width*horizontal)/window["KWRatio"] , (pos.y+anchorY*scl.height)/window["KWRatio"] );
    if(rotate!=1)
        ctx.rotate(rotate * Math.PI / 180);//旋转
    this.showMask(ctx);
    ctx.drawImage(img, - anchorX*scl.width,- anchorY*scl.height, scl.width, scl.height);
    ctx.restore();
};



