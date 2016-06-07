/**
 * Created by Administrator on 2016/1/10.
 */
//舞台类
function Stage(canvas) {
    canvas.height = window.innerHeight || document.documentElement.clientHeight;
    canvas.width = window.innerWidth || document.documentElement.clientWidth;
    this.ctx = canvas.getContext("2d");
    this.isAction = true;
    this.displayObjectSet = [];
    this.canvas = canvas;
    this.sw = canvas.width;
    this.sh = canvas.height;
};
Stage.prototype.removeAllDisplayObject = function(){
    this.displayObjectSet = [];
};
Stage.prototype.worldDraw = function(){
    if(this.isAction) {
        this.canvas.width=this.canvas.width;
        //this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        var objset = this.displayObjectSet;
        for (var i = 0, len = objset.length; i < len; i++) {
            if(objset[i].isAlive) {
                if(objset[i].alpha!=0)
                    objset[i].draw(this.ctx);
                if(objset[i].isAutoReflash ){
                    objset[i].evtObject.reflashAttribute();
                }
            }
        }
        var physicalSet = KPhysical.PhysicalSet;
        for (var j = 0, jlen = physicalSet.length; jlen>0&&j < jlen; j++) {
            physicalSet[j].runPhysical();
        }
    }
};
Stage.DISPLAY_OBJECT_COUNT=0;

Stage.prototype.addChild = function (disObj) {
    disObj.z = Stage.DISPLAY_OBJECT_COUNT;
    Stage.DISPLAY_OBJECT_COUNT++;
    this.displayObjectSet.push(disObj);
};

Stage.prototype.removeChild = function (disObj) {
    var objset = this.displayObjectSet;
    for (var i = 0, len = objset.length; i < len; i++) {
        if(objset[i]==disObj){
            this.displayObjectSet.splice(i,1);
            Stage.DISPLAY_OBJECT_COUNT--;
        }
    }
};

Stage.prototype.reflashZ=function() {
    var objset = this.displayObjectSet;
    for (var i = 0, len = objset.length; i < len; i++) {
        for (var j = i + 1, len = objset.length; j < len; j++) {
            if (objset[i].z > objset[j].z) {
                var temp = objset[j];
                objset[j] = objset[i];
                objset[i] = temp;
            }
        }
    }
}