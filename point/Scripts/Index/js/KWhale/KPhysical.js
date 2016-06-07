/**
 * Created by Keiling on 2016/3/1.
 */
//物理运动相关类
function KPhysical(displayObject,ruleObject) {
    /*revolution: {
        isRun:false,
        speed: 0.2,
        r: 100,
        rotationPoint: {x: 0, y: 0}
    }*/
    this.physicalObject = ruleObject;
    this.displayObject = displayObject;
    KPhysical.PhysicalSet.push(this);
};
KPhysical.PhysicalSet=[];
KPhysical.prototype.runPhysical = function(){
    if(this.physicalObject.revolution.isRun) {
        var x = this.physicalObject.revolution.r*2 * Math.cos(this.physicalObject.revolution.angle / 180 * Math.PI);
        var y = this.physicalObject.revolution.r*2 * Math.sin(this.physicalObject.revolution.angle / 180 * Math.PI);
        this.displayObject.x = x + this.physicalObject.revolution.rotationPoint.x;
        this.displayObject.y = y + this.physicalObject.revolution.rotationPoint.y;
        if(this.physicalObject.revolution.angle==360){
            this.physicalObject.revolution.angle=360
        }
        this.physicalObject.revolution.angle+=0.2;
    }
};

//暂停某一个绑定物理运动的显示对象
KPhysical.stopPhysicalObjctByDisplayObject = function(obj) {
    for(var i= 0,len=KPhysical.PhysicalSet.length;i<len;i++){
        if(KPhysical.PhysicalSet[i].displayObject==obj){
            KPhysical.PhysicalSet[i].physicalObject.revolution.isRun=false;
        }
    }
};