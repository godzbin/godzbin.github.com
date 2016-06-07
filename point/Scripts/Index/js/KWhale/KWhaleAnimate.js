/**
 * Created by Administrator on 2016/1/12.
 */
//动画相关 暂时 不管
function KWhaleAnimate (stage) {
    KWhaleAnimate.KWHAHLE_ANIMATE_SET.push(this);
    this.isUpdateAnimate = false;
    /*rty*/
    this._isRotationY = false;
    this._rotationY_obj = {};
    this.stage = stage;
};

KWhaleAnimate.KWHAHLE_ANIMATE_SET=[];
KWhaleAnimate.update=function(){
    var arr = KWhaleAnimate.KWHAHLE_ANIMATE_SET;
    for(var i= 0,len=arr.length;i<len;i++){
        if(arr[i].isUpdateAnimate){
            if(arr[i]._isRotationY){
                arr[i]._rotationY();
                console.log("j")
            }
            //just one updte
        }
    }
};
KWhaleAnimate.prototype.start=function() {
    this.isUpdateAnimate = true;
};
KWhaleAnimate.prototype.stop=function() {
    this.isUpdateAnimate = false;
};

/***RotationY***/
KWhaleAnimate.prototype.startRotationY=function(){
    this._isRotationY = true;
};
KWhaleAnimate.prototype.stopRotationY=function(){
    this._isRotationY = false;
};
KWhaleAnimate.prototype.removeRotationY = function(){
    this.stopRotationY();
    this._rotationY_obj = {};
};
KWhaleAnimate.prototype.rotationY = function(objArr,r,rx,ry,MaxScale){
    this._rotationY_obj = {objArr:objArr,stage:this.stage,r:r,MaxScale:MaxScale,rx:rx,ry:ry};
};
KWhaleAnimate.prototype._rotationY = function(){
    var rx = this._rotationY_obj.rx;
    var ry = this._rotationY_obj.ry;
    var objArr = this._rotationY_obj.objArr;
    var stage = this._rotationY_obj.stage;
    var r= this._rotationY_obj.r;
    var MaxScale = this._rotationY_obj.MaxScale;
    for(var i = 0,len=objArr.length;i<len;i++){
        objArr[i].x = (rx+Math.sin( objArr[i].speed * Math.PI/180 ) * r);
        objArr[i].y = (ry-Math.cos( objArr[i].speed * Math.PI/180 ) * r/10);
        objArr[i].z_3d = (0+Math.cos( objArr[i].speed * Math.PI/180 ) * r);
        objArr[i].speed+=(0.1);
        if(Math.abs(r/(r-objArr[i].z_3d))>MaxScale){
            objArr[i].scale = MaxScale;
        }else{
            objArr[i].scale = Math.abs(r/(r-objArr[i].z_3d));
        }
        objArr[i].z=objArr[i].z_3d;
    }
};
