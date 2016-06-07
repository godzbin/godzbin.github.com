/**
 * Created by Keiling on 2016/3/2.
 * get:anchorX=0,anchorY=1,不可设置
 * get:scale 不可设置
 */
function Text(text,fontFamily,fontSize,color) {
    this.text = text;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.color = color;
    this.ele = null;
    this.bold="";
    this.getRealSize();
};

Text.prototype=new DisplayObject();

Text.prototype.getRealSize=function(){
    if(World.ISTEST){
        console.log("Text is no suppor the attribute of 'anchor'and 'scale'")
    }
    this.ele = document.createElement("span");
    this.ele.style.position = "absolute";
    this.ele.style.backgroundColor = "red";
    this.ele.style.fontFamily=this.fontFamily;
    this.ele.style.fontSize=this.fontSize/window["KWRatio"]+"px";
    this.ele.style.lineHeight=this.fontSize/window["KWRatio"]+"px";
    this.ele.innerHTML=this.text;
    document.body.appendChild(this.ele);
    this.width = this.ele.offsetWidth*window["KWRatio"];
    this.height = this.ele.offsetHeight*window["KWRatio"];
    document.body.removeChild(this.ele);
    this.ele=null;
};
Text.prototype.UseAnchor = function(){
    var pos = {x:0,y:0};
    pos.x = this.x;
    pos.y = this.y;
    return pos;
};

Text.prototype.draw = function(ctx){
    var pos = {x:0,y:0};
    pos.x = this.x;
    pos.y = this.y;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate((pos.x)/window["KWRatio"] , (pos.y)/window["KWRatio"] );
    ctx.rotate(this.rotation * Math.PI / 180);//旋转
    ctx.font=this.bold+ " "+(this.fontSize/window["KWRatio"])+"px "+this.fontFamily ;
    ctx.fillStyle=this.color;
    ctx.fillText(this.text,0,0)//(pos.x+this.anchorX*scl.width) ,(pos.y+this.anchorY*scl.height))
    ctx.restore();
};