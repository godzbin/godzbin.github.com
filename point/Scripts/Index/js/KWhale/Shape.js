/**
 * Created by Keiling on 2016/3/4.
 */
//用于矢量绘图 矩形 圆形
var Shape = (function(){
    function Rectangle(pos,w,h,color){
        this.x = pos.x;
        this.y = pos.y;
        //0:normal 1:has Stroke 2:just Stroke
        this.fillColor = color;
        this.strokeColor = color;
        this.lineWidth = 1;
        this.type=0;
        this.width = w;
        this.height = h;
    };
    //这种方式实现继承 不太好 会因为位置的变化而 改变
    Rectangle.prototype=new DisplayObject();
    Rectangle.prototype.draw=function(ctx){
        var scl = this.UseScale();
        var pos = this.UseAnchor();
        switch (this.type){
            case 0:
                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = this.alpha;
                ctx.translate((pos.x+this.anchorX*scl.width)/window["KWRatio"] , (pos.y+this.anchorY*scl.height)/window["KWRatio"] );
                ctx.rotate(this.rotation * Math.PI / 180);//旋转
                this.showMask(ctx);
                ctx.rect(-this.anchorX*scl.width /window["KWRatio"],-this.anchorY*scl.height/window["KWRatio"],scl.width/window["KWRatio"], scl.height/window["KWRatio"]);
                ctx.fillStyle=this.fillColor;
                ctx.fill();
                ctx.restore();
                break;
            case 1:
                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = this.alpha;
                ctx.translate((pos.x+this.anchorX*scl.width)/window["KWRatio"] , (pos.y+this.anchorY*scl.height)/window["KWRatio"] );
                ctx.rotate(this.rotation * Math.PI / 180);//旋转
                this.showMask(ctx);
                ctx.rect(-this.anchorX*scl.width /window["KWRatio"],-this.anchorY*scl.height/window["KWRatio"],scl.width/window["KWRatio"], scl.height/window["KWRatio"]);
                ctx.strokeStyle=this.strokeColor;
                ctx.fillStyle=this.fillColor;
                ctx.lineWidth=this.lineWidth/window["KWRatio"]*this.scale;
                ctx.stroke();
                ctx.fill();
                ctx.restore();
                break;
            case 2:
                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = this.alpha;
                ctx.translate((pos.x+this.anchorX*scl.width)/window["KWRatio"] , (pos.y+this.anchorY*scl.height)/window["KWRatio"] );
                ctx.rotate(this.rotation * Math.PI / 180);//旋转
                this.showMask(ctx);
                ctx.rect(-this.anchorX*scl.width /window["KWRatio"],-this.anchorY*scl.height/window["KWRatio"],scl.width/window["KWRatio"], scl.height/window["KWRatio"]);
                ctx.strokeStyle=this.strokeColor;
                ctx.lineWidth=this.lineWidth/window["KWRatio"]*this.scale;
                ctx.fillStyle=this.fillColor;
                ctx.stroke();
                ctx.restore();
                break;
        }
    };

    /*are*/
    function Circle(pos,r,color){
        this.x = pos.x;
        this.y = pos.y;
        //0:normal 1:has Stroke 2:just Stroke
        this.fillColor = color;
        this.strokeColor = color;
        this.lineWidth = 1;
        this.type=0;
        this.r = r;
    }
    Circle.prototype=new DisplayObject();
    Circle.prototype.UseAnchor = function(){
        var pos = {x:0,y:0};
        var scl = this.UseScale();
        pos.x = this.x-scl.r*this.anchorX;
        pos.y = this.y-scl.r*this.anchorY;
        return pos;
    };
    Circle.prototype.UseScale = function(){
        var scl = {r:0};
        scl.r = this.r*this.scale;
        return scl;
    };
    Circle.prototype.draw=function(ctx){
        var scl = this.UseScale();
        var pos = this.UseAnchor();
        switch (this.type){
            case 0:
                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = this.alpha;
                ctx.translate((pos.x+this.anchorX*scl.r)/window["KWRatio"] , (pos.y+this.anchorY*scl.r)/window["KWRatio"] );
                ctx.rotate(this.rotation * Math.PI / 180);//旋转
                //ctx.rect(-this.anchorX*scl.width /window["KWRatio"],-this.anchorY*scl.height/window["KWRatio"],scl.width/window["KWRatio"], scl.height/window["KWRatio"]);
                this.showMask(ctx);
                ctx.arc(0,0, this.r/window["KWRatio"], 0, Math.PI * 2, true);
                ctx.fillStyle=this.fillColor;
                ctx.fill();
                ctx.restore();
                break;
            case 1:
                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = this.alpha;
                ctx.translate((pos.x+this.anchorX*scl.r)/window["KWRatio"] , (pos.y+this.anchorY*scl.r)/window["KWRatio"] );
                ctx.rotate(this.rotation * Math.PI / 180);//旋转
                //ctx.rect(-this.anchorX*scl.width /window["KWRatio"],-this.anchorY*scl.height/window["KWRatio"],scl.width/window["KWRatio"], scl.height/window["KWRatio"]);
                this.showMask(ctx);
                ctx.arc(0,0, this.r/window["KWRatio"], 0, Math.PI * 2, true);
                ctx.strokeStyle=this.strokeColor;
                ctx.lineWidth=this.lineWidth/window["KWRatio"]*this.scale;
                ctx.fillStyle=this.fillColor;
                ctx.stroke();
                ctx.fill();
                ctx.restore();
                break;
            case 2:
                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = this.alpha;
                ctx.translate((pos.x+this.anchorX*scl.r)/window["KWRatio"] , (pos.y+this.anchorY*scl.r)/window["KWRatio"] );
                ctx.rotate(this.rotation * Math.PI / 180);//旋转
                //ctx.rect(-this.anchorX*scl.width /window["KWRatio"],-this.anchorY*scl.height/window["KWRatio"],scl.width/window["KWRatio"], scl.height/window["KWRatio"]);
                this.showMask(ctx);
                ctx.arc(0,0, this.r/window["KWRatio"], 0, Math.PI * 2, true);
                ctx.strokeStyle=this.strokeColor;
                ctx.lineWidth=this.lineWidth/window["KWRatio"]*this.scale;
                ctx.fillStyle=this.fillColor;
                ctx.stroke();
                ctx.restore();
                break;
        }
    };
    return{
        Rectangle:Rectangle,
        Circle:Circle
    }
}());