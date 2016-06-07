/**
 * Created by Keiling on 2016/2/27.
 */
// 用于 2个显示对象之间进行连线
function Line(startObj,endObj,color,lineWidth,isNewPoint){
    var helpFunc = function(obj){
        var newObj = {};
        for(i in obj){
            newObj[i]=obj[i]
        }
        return newObj;
    };
    if(isNewPoint==undefined){
        this.startObj = helpFunc(startObj);
        this.endObj = helpFunc(endObj);
    }else{
        this.startObj = startObj;
        this.endObj = endObj;
    }
    this.color = color;
    this.lineWidth = lineWidth;
    this.alpha = 1;
}
Line.prototype = new DisplayObject();
Line.prototype.draw = function(ctx){
    if(this.alpha!=1)
        ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.startObj.x/window["KWRatio"] ,this.startObj.y/window["KWRatio"] );
    ctx.lineTo(this.endObj.x/window["KWRatio"] ,this.endObj.y/window["KWRatio"] );
    ctx.stroke();
};