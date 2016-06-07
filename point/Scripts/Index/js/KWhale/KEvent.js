/**
 * Created by Keiling on 2016/2/27.
 */
//事件绑定类 参数（要绑定事件的显示对象，{type:"要绑定的事件名"}，回调函数：事件触发执行）
function KEvent(disobj,evtobj,call){
    disobj.evtObject=this;
    disobj.isAutoReflash = false;
    this.disobj=disobj;
    this.isAutoFreshAfterEvent =true;
    this.ele = document.createElement("div");
    this.ele.style.position = "absolute";
    this.ele.style.top = (this.disobj.y-this.disobj.height*this.disobj.anchorY)/window["KWRatio"] +"px";
    this.ele.style.left = (this.disobj.x-this.disobj.width*this.disobj.anchorX)/window["KWRatio"] +"px";
    //this.ele.style.backgroundColor = "blue";
    //this.ele.style.opacity = "0.2";
    //this.ele.style.visibility = "none";
    this.ele.style.width = this.disobj.width*this.disobj.scale/window["KWRatio"]+"px";
    this.ele.style.height = this.disobj.height*this.disobj.scale/window["KWRatio"]+"px";
    document.body.appendChild(this.ele);
    this.times = evtobj.times||null;
    KEvent.EventSet.push(this.ele);
    switch (evtobj.type){
        case "touchstart":
            this.TOUCHBEGIN(call);
            break;
        case "touchend":
            this.TOUCHEND(call);
            break;
        case "touchmove":
            this.TOUCHMOVE(call);
            break;
        case "touchstartandmove":
            this.TOUCHBEGINANDMOVE(call);
            break;
        case "touchout":
            this.TOUCHOUT(call);
            break;
    }
};
KEvent.EventSet=[];
KEvent.Remove = function(ele) {
    //console.log(KEvent.EventSet.length)
    for (var i = 0, len = KEvent.EventSet.length; i < len; i++) {
        if (KEvent.EventSet[i] == ele) {
            KEvent.EventSet.splice(i, 1);
            len = KEvent.EventSet.length;
            //console.log(i+"_"+KEvent.EventSet.length)
        }
    }
};
KEvent.RemoveAllEventObj = function(ele) {
    for (var i = 0, len = KEvent.EventSet.length; i < len; i++) {
        var ele = KEvent.EventSet[i];
        document.body.removeChild(ele);
    }
    KEvent.EventSet=[];
};
KEvent.prototype.TOUCHBEGIN = function(call){
    var that = this;
    this.ele.addEventListener("touchstart",function(evt){
        //document.body.removeChild(that.ele);
        evt.preventDefault();
        call(evt);
        that.reflashAttribute();
    },false);
    if(World.ISTEST) {
        this.ele.addEventListener("mousedown", function (evt) {
            call(evt);
            //document.body.removeChild(that.ele)
            that.reflashAttribute();
        }, true)
    }

};
KEvent.prototype.TOUCHEND = function(call){
    var that = this;
    this.ele.addEventListener("touchend",function(evt){
        evt.preventDefault();
        call(evt);
        that.reflashAttribute();
    },false);
    if(World.ISTEST) {
        this.ele.addEventListener("mouseup", function (evt) {
            evt.preventDefault();
            call(evt);
            that.reflashAttribute();
        }, false)
    }
};
KEvent.prototype.TOUCHMOVE = function(call){
    var that = this;
    this.ele.addEventListener("touchmove",function(evt){
        evt.preventDefault();
        call(evt);
        that.reflashAttribute();
    },false);
    if(World.ISTEST) {
        this.ele.addEventListener("mousemove", function (evt) {
            evt.preventDefault();
            call(evt);
            that.reflashAttribute();
        }, false)
    }
};
KEvent.prototype.TOUCHOUT = function(call){
    var that = this;
    this.ele.addEventListener("touchout",function(evt){
        evt.preventDefault();
        call(evt);
        that.reflashAttribute();
    },false);
    if(World.ISTEST) {
        this.ele.addEventListener("mouseout", function (evt) {
            evt.preventDefault();
            call(evt);
            that.reflashAttribute();
        }, false)
    }
};
KEvent.prototype.TOUCHBEGINANDMOVE = function(call){
    var that = this;
    var begin = false;
    var start_pos={};
    this.TOUCHBEGIN(function(){
        begin=true;
        var x = that.disobj.x
        var y = that.disobj.y
        start_pos={x:x,y:y};
        call[0]();
    });
    this.TOUCHEND(function(evt){
        begin=false;
        var x = that.disobj.x
        var y = that.disobj.y
        start_pos={x:x,y:y};
        call[2]();
    });
    this.TOUCHMOVE(function(evt){
        if(begin){
            var x = Number(evt.clientX); //页面触点X坐标
            var y = Number(evt.clientY); //页面触点Y坐标
            var sx = x-start_pos.x;
            var sy = y-start_pos.y;
            evt.sx=sx;
            evt.sy=sy;
            call[1](evt);
        }
    });
    this.TOUCHOUT(function(evt){
        if(begin){
            begin=false;
            var x = that.disobj.x
            var y = that.disobj.y
            start_pos={x:x,y:y};
            call[2]();
        }
    });
};

//摇一摇事件绑定
KEvent.shakeCall;
var SHAKE_THRESHOLD = 500; //鎽囨檭鐨勬晱鎰熷害;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;
KEvent.deviceMotionHandler=function (eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    document.body.innerHTML = x + "_" + y + "_" + z;
    if ((curTime - last_update) > 100 ) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var t3;
        var t1;
        var t2;
        var t4;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
            KEvent.shakeCall();
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}

//添加摇一摇
KEvent.ADDSHAKE=function(call) {
    KEvent.shakeCall=call;
    if (window.DeviceMotionEvent) {
        //获取移动速度，得到device移动时相对之前某个时间的差值比
        window.addEventListener('devicemotion',KEvent.deviceMotionHandler, false);
    } else {
        alert('您好，你目前所用的设置好像不支持重力感应哦！');
    }
};
//移除摇一摇监听事件
KEvent.REMOVESHAKE=function(){
    window.removeEventListener('devicemotion', KEvent.deviceMotionHandler, false);
};
KEvent.prototype.destory=function(){
    document.body.removeChild(this.ele);
    KEvent.Remove(this.ele);
};
KEvent.prototype.reAdd=function(){
    document.body.appendChild(this.ele);
};
KEvent.prototype.reflashAttribute=function(){
    if(!this.isAutoFreshAfterEvent){
        return;
    }
    this.ele.style.position = "absolute";
    this.ele.style.top = (this.disobj.y-this.disobj.height*this.disobj.scale*this.disobj.anchorY)/window["KWRatio"] +"px";
    this.ele.style.left = (this.disobj.x-this.disobj.width*this.disobj.scale*this.disobj.anchorX)/window["KWRatio"] +"px";
    //this.ele.style.backgroundColor = "red";
    //this.ele.style.opacity = "0.5";
    this.ele.style.width = this.disobj.width*this.disobj.scale/window["KWRatio"]+"px";
    this.ele.style.height = this.disobj.height*this.disobj.scale/window["KWRatio"]+"px";
}
/*
 slide 滑动根据
 */
KEvent.start_pos={};
KEvent.end_pos={};
//KEvent.slideCall 用于绑定滑动触发事件 接收一个参数 用于判断滑动方向
KEvent.slideCall;
KEvent.slideBegin = function (evt) {
    var touch = evt.touches[0]; //获取第一个触点
    var x = Number(touch.pageX); //页面触点X坐标
    var y = Number(touch.pageY); //页面触点Y坐标
    KEvent.start_pos = {x: x, y: y};
};
KEvent.slideMove = function (evt) {
    var touch = evt.touches[0]; //获取第一个触点
    var x = Number(touch.pageX); //页面触点X坐标
    var y = Number(touch.pageY); //页面触点Y坐标
    KEvent.end_pos = {x: x, y: y};
};
KEvent.slideEnd = function (evt) {
    var rotation = KWhaleUtils.getRotationBy2Point(KEvent.start_pos, KEvent.end_pos);
    var dis = KWhaleUtils.distPoint(KEvent.start_pos, KEvent.end_pos);
    if (dis > 30) {
        if(45<=rotation&&rotation<135){
            KEvent.slideCall("bot")
        }
        if(135<=rotation&&rotation<225){
            KEvent.slideCall("left")
        }
        if(225<=rotation&&rotation<315){
            KEvent.slideCall("top")
        }
        if(315<=rotation&&rotation<=360||0<=rotation&&rotation<45){
            KEvent.slideCall("right")
        }
    }
}

//绑定页面滑动事件
KEvent.ADDSLIDE = function (call) {
    document.body.addEventListener("touchstart", KEvent.slideBegin, false);
    document.body.addEventListener("touchmove", KEvent.slideMove, false);
    document.body.addEventListener("touchend", KEvent.slideEnd, false);
    KEvent.slideCall=call;
}
KEvent.REMOVESLIDE = function () {
    document.body.removeEventListener("touchstart", KEvent.sildeBegin, false);
    document.body.removeEventListener("touchmove", KEvent.sildeMove, false);
    document.body.removeEventListener("touchend", KEvent.slideEnd, false);
}