/**
 * Created by Administrator on 2016/1/11.
 * 工具模块
 */
var KWhaleUtils = (function (){
    /***
     * Tween YoYo
     * ***/
    /*参数
    （要缓动的显示对象,{对象执行缓动后的属性状态}，延迟多少毫秒执行，动作执行时间，塞贝曲线TWEEN.Easing.曲线名.InOut）*/
    //来回循环
    //PS:用完记得 stop()会好点
    var Tween_YoYo = function(dspobj,obj,delay,time,ease){
        var backobj={};
        for(var name in obj){
            backobj[name]=dspobj[name];
        }
        var tweenGo = new TWEEN.Tween(dspobj)
            .to(obj, time)
            .delay(delay)
            .easing(ease);
        var tweenBack = new TWEEN.Tween(dspobj)
            .to(backobj, time)
            .delay(delay)
            .easing(ease);
        tweenGo.chain(tweenBack);
        tweenBack.chain(tweenGo);
        return tweenGo;
    };
    //单向循环
    var Tween_Loop = function(dspobj,obj,delay,time,ease){
        var tweenGo = new TWEEN.Tween(dspobj)
            .to(obj, time)
            .delay(delay)
            .repeat( Infinity )
            .easing(ease);
        return tweenGo;
    };

    //缓动一次
    var Tween = function(dspobj,obj,delay,time,ease){
        var tweenGo = new TWEEN.Tween(dspobj)
            .delay(delay)
            .to(obj, time)
            .easing(ease);
        return tweenGo;
    };

    //根据显示对象占舞台背景的高的比例 添加到舞台中
    //（舞台,显示对象,高度比）
    var AddStageByScaleH = function(stage,obj,scaleH){
        if(obj.proportion){
            obj.height = stage.sh*scaleH;
            obj.width = obj.height*obj.proportion;
            if(obj.width>stage.sw){
                obj.width=stage.sw;
                obj.height=obj.width/obj.proportion;
            }
            stage.addChild(obj);
        }
    }

    var AddStageByScaleWNoCheck = function(stage,obj,scaleW){
        if(obj.proportion){
            obj.width = stage.sw*scaleW;
            obj.height = obj.width/obj.proportion;
            stage.addChild(obj);
        }
    }
    //根据显示对象占舞台背景的高的比例 添加到舞台中 noCheck
    //（舞台,显示对象,高度比）
    var AddStageByScaleHNoCheck = function(stage,obj,scaleH){
        if(obj.proportion){
            obj.height = stage.sh*scaleH;
            obj.width = obj.height*obj.proportion;
            stage.addChild(obj);
        }
    }

    //生成随机数 1-num
    var getRandomOne2Numer=function(num){
        return Math.abs(Math.ceil(Math.random()*num));
    }
    /**
     * 根据一点及线段角度 计算另一端的点
     */
    var getPointByRotationAndPointAndLineWidth = function (obj1, rotation,dist) {
        var x = obj1.x + 2*dist*Math.cos(rotation/180*Math.PI);
        var y = obj1.y + 2*dist*Math.sin(rotation/180*Math.PI);
        return {"x":Math.ceil(x),"y":Math.ceil(y)};
    }
    //计算2点距离
    var distPoint = function(obj1, obj2) {
        return Math.sqrt((obj1.x - obj2.x) * (obj1.x - obj2.x) + (obj1.y - obj2.y) * (obj1.y - obj2.y));
    }
    //计算2点角度
    var getRotationBy2Point= function(obj1, obj2) {
        var dx = obj1.x - obj2.x,
            dy = obj1.y - obj2.y;
        return Math.atan2(dy, dx) * 180 / Math.PI + 180;
    }
    var addDomByScale = function(s,scaleH,scaleW,scaleY,innerHtml){
        var dom =  document.createElement('div');
        dom.style.position = "absolute";
        if(scaleH!="auto")
            dom.style.height = s.sh * scaleH / window["KWRatio"] + "px";
        if(scaleW!="auto")
            dom.style.width = s.sh *scaleW / window["KWRatio"] + "px";
        dom.style.top = s.sh *scaleY / window["KWRatio"] + "px";
        dom.style.fontFamily="微软雅黑";
        dom.innerHTML=innerHtml;
        document.body.appendChild(dom);
        return dom;
    }

    var getImgBySrcAndCall = function(src,call){
        var img = new Image();
        img.src = src;
        img.onload = function(){
            call(img);
        };
    }

    return {
        Tween_YoYo:Tween_YoYo,
        AddStageByScaleH:AddStageByScaleH,
        Tween_Loop:Tween_Loop,
        Tween:Tween,
        AddStageByScaleHNoCheck:AddStageByScaleHNoCheck,
        getRandomOne2Numer:getRandomOne2Numer,
        getPointByRotationAndPointAndLineWidth:getPointByRotationAndPointAndLineWidth,
        getRotationBy2Point:getRotationBy2Point,
        distPoint:distPoint,
        addDomByScale:addDomByScale,
        getImgBySrcAndCall:getImgBySrcAndCall,
        AddStageByScaleWNoCheck:AddStageByScaleWNoCheck
    };
}());