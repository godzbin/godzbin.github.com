/**
 * Created by Keiling on 2016/3/4.
 */
var Form = (function(){
    //用于实时更新 Form 对象的 位置 大小
    function reflash(obj){
        obj.ele.style.width = obj.width/window["KWRatio"]*obj.scale +"px";
        obj.ele.style.height = obj.height/window["KWRatio"]*obj.scale +"px";
        obj.ele.style.top = (obj.y-obj.height *obj.anchorY*obj.scale)/window["KWRatio"] +"px";
        obj.ele.style.left = (obj.x-obj.width *obj.anchorX*obj.scale)/window["KWRatio"] +"px";
        obj.ele.style.opacity = obj.alpha;
        obj.ele.style.fontSize=obj.height/window["KWRatio"]*obj.scale*0.7+"px";
        obj.ele.style.lineHeight=obj.height/window["KWRatio"]*obj.scale+"px";
    }

    // 用于绘制文本 todo:尚未实现 anchor scale 默认anchorX=0，anchorY=1，scale=1
    var Text = function(x,y,w,h){
        this.normal_Text="";
        this.x = x;
        this.y = y;
        this.alpha=1;
        this.scale = 1;
        this.anchorX=0;
        this.anchorY=0;
        this.width = w*this.scale ;
        this.height = h*this.scale ;
        this.ele = document.createElement("input");
        this.ele.type="text";
        this.ele.style.position = "absolute";
        this.ele.style.width = this.width/window["KWRatio"]*this.scale +"px";
        this.ele.style.height = this.height/window["KWRatio"]*this.scale +"px";
        this.ele.style.top = (this.y-this.height *this.anchorY)/window["KWRatio"] +"px";
        this.ele.style.left = (this.x-this.width *this.anchorX)/window["KWRatio"] +"px";
        this.ele.style.opacity = this.alpha;
        this.ele.style.fontFamily="微软雅黑";
        this.ele.style.fontSize=(this.height/8*2.4)/window["KWRatio"]*this.scale+"px";
        this.ele.style.lineHeight=this.height/window["KWRatio"]*this.scale+"px";
        document.body.appendChild(this.ele);
        var that = this;
        this.ele.onblur=function(){
            if(that.ele.value==""){
                that.ele.value=that.normal_Text;
                return
            }else{
                return;
            }
        }
        this.ele.onfocus=function(){
            if(that.ele.value==that.normal_Text){
                that.ele.value="";
                return
            }else{
                return;
            }
        }
    };
    Text.prototype.setNormalText=function(txt){
        this.normal_Text=txt;
        this.ele.value=txt;
    };
    Text.prototype.draw=function (ctx){
        reflash(this)
    };
    //销毁Text 对象
    Text.prototype.destroy=function(stage){
        if(stage)
            stage.removeChild(this);
        document.body.removeChild(this.ele);
    }
    Text.prototype.getValue = function(){
        return this.ele.value;
    }

    var Textarea = function(x,y,w,h){
        this.normal_Text="";
        this.x = x;
        this.y = y;
        this.alpha=1;
        this.scale = 1;
        this.anchorX=0;
        this.anchorY=0;
        this.width = w*this.scale ;
        this.height = h*this.scale ;
        this.ele = document.createElement("textarea");
        this.ele.style.position = "absolute";
        this.ele.style.width = this.width/window["KWRatio"]*this.scale +"px";
        this.ele.style.height = this.height/window["KWRatio"]*this.scale +"px";
        this.ele.style.top = (this.y-this.height *this.anchorY)/window["KWRatio"] +"px";
        this.ele.style.left = (this.x-this.width *this.anchorX)/window["KWRatio"] +"px";
        this.ele.style.opacity = this.alpha;
        this.ele.style.fontFamily="微软雅黑";
        document.body.appendChild(this.ele);
        var that = this;
        this.ele.onblur=function(){
            if(that.ele.value==""){
                that.ele.value=that.normal_Text;
                return
            }else{
                return;
            }
        }
        this.ele.onfocus=function(){
            if(that.ele.value==that.normal_Text){
                that.ele.value="";
                return
            }else{
                return;
            }
        }
    };
    Textarea.prototype.setFontSize = function(size){
        this.ele.style.fontSize = size/window["KWRatio"]*this.scale+"px";
    };
    Textarea.prototype.setNormalText=function(txt){
        this.normal_Text=txt;
        this.ele.value=txt;
    };
    Textarea.prototype.draw=function (ctx){
        reflash(this)
    };
    //销毁Text 对象
    Textarea.prototype.destroy=function(stage){
        if(stage)
            stage.removeChild(this);
        document.body.removeChild(this.ele);
    }
    Textarea.prototype.getValue = function(){
        return this.ele.value;
    }


    //用于创建下拉选择控件
    var Select = function(x,y,w,h){
        this.x = x;
        this.y = y;
        this.alpha=1;
        this.scale = 1;
        this.anchorX=0;
        this.anchorY=0;
        this.width = w*this.scale ;
        this.height = h*this.scale ;
        this.ele = document.createElement("select");
        this.ele.style.position = "absolute";
        this.ele.style.width = this.width/window["KWRatio"]*this.scale +"px";
        this.ele.style.height = this.height/window["KWRatio"]*this.scale +"px";
        this.ele.style.top = (this.y-this.height *this.anchorY)/window["KWRatio"] +"px";
        this.ele.style.left = (this.x-this.width *this.anchorX)/window["KWRatio"] +"px";
        this.ele.style.opacity = this.alpha;
        this.ele.style.fontFamily="微软雅黑";
        this.ele.style.fontSize=(this.height/8*2.4)/window["KWRatio"]*this.scale+"px";
        this.ele.style.lineHeight=this.height/window["KWRatio"]*this.scale+"px";
        document.body.appendChild(this.ele);
    };
    //设置下拉框控件的 列表 参数[列表名1,列表名2]
    Select.prototype.setItem=function (arr){
        this.ele.innerHTML="";
        for(var i= 0,len=arr.length;i<len;i++){
            var item = document.createElement("option");
            item.text = arr[i]
            this.ele.appendChild(item);
        }
    }
    Select.prototype.draw=function (ctx){
        reflash(this)
    }
    //销毁
    Select.prototype.destroy=function(stage){
        stage.removeChild(this);
        document.body.removeChild(this.ele);
    }
    return {
        Text:Text,
        Select:Select,
        Textarea:Textarea
    }
}());
