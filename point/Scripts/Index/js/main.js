window["isCanTouch"]=true;
window.document.body.addEventListener("touchstart", function (evt) {
    if(!window["isCanTouch"])
        evt.preventDefault();
}, false);
window["isCanMove"]=false;
document.body.addEventListener('touchmove', function (event) {
    if(!window["isCanMove"])
        event.preventDefault();
}, false);
window.onload=function() {
    var base = "../../Content/Images/";
    RES.RES_JSON = {
        "logo": {isLoad: false, src: base + "img/logo.png"},
        "tap-to-start": {isLoad: false, src: base + "img/tap-to-start.png"},
        "introduction": {isLoad: false, src: base + "img/introduction.png"},
        "box1": {isLoad: false, src: base + "img/box1.png"},
        "box2": {isLoad: false, src: base + "img/box2.png"},
        "bg": {isLoad: false, src: base + "img/bg.jpg"},

            "warning": {isLoad: false, src: base + "img/warning.png"},
        "left": {isLoad: false, src: base + "img/left.png"},
        "sheep_r": {isLoad: false, src: base + "img/sheep_r.png"},
        "sheep": {
            "isLoad": false,
            "src": base +"img/sheep.png",
            "action": {
                "run": {
                    "frameRate": 24,
                    "frames": ["1","0"]
                },
                "sleep": {
                    "frameRate": 3,
                    "frames": ["2","3"]
                },
                "climb": {
                    "frameRate": 24,
                    "frames": ["4","5","6"]
                },
                "climbRun": {
                    "frameRate": 24,
                    "frames": ["7","6"]
                },
                "die": {
                    "frameRate": 24,
                    "frames": ["8","9","10","11","12","13","14","15","16","17","18","19","20","21","22"]
                }
            },
            "res": {
                "0": {
                    "x": 0,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "1": {
                    "x": 69,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "2": {
                    "x": 139,
                    "y": 1,
                    "w": 69,
                    "h": 86
                },
                "3": {
                    "x": 208,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "4": {
                    "x": 276,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "5": {
                    "x": 345,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "6": {
                    "x": 414,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "7": {
                    "x": 483,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "8": {
                    "x": 552,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "9": {
                    "x": 621,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "10": {
                    "x": 690,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "11": {
                    "x": 759,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "12": {
                    "x": 828,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "13": {
                    "x": 897,
                    "y": 0,
                    "w": 69,
                    "h": 86
                },
                "14": {
                    "x": 0,
                    "y": 86,
                    "w": 69,
                    "h": 86
                },
                "15": {
                    "x": 69,
                    "y": 86,
                    "w": 69,
                    "h": 86
                },
                "16": {
                    "x": 138,
                    "y": 86,
                    "w": 69,
                    "h": 86
                },
                "17": {
                    "x": 207,
                    "y": 86,
                    "w": 69,
                    "h": 86
                },
                "18": {
                    "x": 276,
                    "y": 86,
                    "w": 69,
                    "h": 86
                },
                "19": {
                    "x": 345,
                    "y": 86,
                    "w": 69,
                    "h": 86
                },
                "20": {
                    "x": 414,
                    "y": 86,
                    "w": 69,
                    "h": 86
                },
                "21": {
                    "x": 483,
                    "y": 86,
                    "w": 69,
                    "h": 86
                },
                "22": {
                    "x": 552,
                    "y": 86,
                    "w": 69,
                    "h": 86
                }
            }
        }
    };

    World.init();
    window.alert=function(text) {
        var sh = stage_top.sh/window["KWRatio"];
        var sw = stage_top.sw/window["KWRatio"];

        var mask = document.createElement("div");
        //box-shadow: 0 0 3px 1px #ddd;
        mask.style.boxShadow="0 0 3px 1px #ddd;";
        mask.style.position = "fixed";
        mask.style.width = sw   + "px";
        mask.style.height = sh  + "px";
        mask.style.backgroundColor = "#000";
        mask.style.opacity=0.7;
        mask.style.zIndex=9999;
        document.body.appendChild(mask);


        var wrap = document.createElement("div");
        //box-shadow: 0 0 3px 1px #ddd;
        wrap.style.boxShadow="0 0 3px 1px #ddd;";
        wrap.style.position = "fixed";
        wrap.style.width = sw / 1.4  + "px";
        wrap.style.height = sh / 4 + "px";
        wrap.style.top = (sh - sh / 4) / 2  + "px";
        wrap.style.left = (sw - sw / 1.4) / 2 + "px";
        wrap.style.borderRadius = 15  + "px";
        wrap.style.backgroundColor = "#ffffff";

        var top = document.createElement("div");
        top.style.backgroundColor = "#848484";
        top.style.width = sw / 1.4  + "px";
        top.style.height = sh / 4 / 5  + "px";
        top.style.borderTopRightRadius = 15  + "px";
        top.style.borderTopLeftRadius = 15  + "px";
        top.style.lineHeight = sh / 4 / 5  + "px";
        top.style.fontFamily = "微软雅黑";
        top.style.textAlign = "center";
        top.style.fontSize = (sh / 4 / 6 - 8) + "px";
        top.style.color = "#fff";

        top.innerHTML = "消 息";
        wrap.appendChild(top);
        var bot = document.createElement("div");
        bot.className = "webkitV";
        bot.style.width = sw / 1.4  + "px";
        bot.style.height = sh / 4 / 6 * 3.3  + "px";
        bot.style.lineHeight = sh / 4 / 6  + "px";
        bot.style.fontFamily = "微软雅黑";
        bot.style.textAlign = "center";
        bot.style.top = sh / 4 / 6 + "px";
        bot.style.fontSize = (sh / 4 / 8 - 8) + "px";
        bot.innerHTML = text;
        wrap.appendChild(bot);
        var ok = document.createElement("div");
        ok.style.width = sw / 1.4 + "px";
        ok.style.height = sh / 4 / 6 * 1.5 + "px";
        ok.style.lineHeight = sh / 4 / 6 * 1.5 + "px";
        ok.style.fontFamily = "微软雅黑";
        ok.style.textAlign = "center";
        ok.style.top = sh / 4 / 6 * 4.5 + "px";
        ok.style.borderTop = "2px solid #d0d0d0"
        ok.style.fontSize = sh / 4 / 6 - 8 + "px";
        ok.style.cursor = "pointer";
        ok.innerHTML = "确 定";
        ok.style.color = "#099aed";
        ok.addEventListener("touchstart",function(evt){
            document.body.removeChild(wrap);
            document.body.removeChild(mask);
            window["kk"]=false;
        },false);
        wrap.appendChild(ok);
        wrap.style.zIndex=10000;
        document.body.appendChild(wrap);
    };
    var canvas_bg = document.getElementById("canvas_bg");
    var stage_bg = new Stage(canvas_bg);
    var canvas_stage = document.getElementById("canvas_stage");
    var stage_main = new Stage(canvas_stage);
    var canvas_stage_top = document.getElementById("canvas_stage_top");
    var stage_top = new Stage(canvas_stage_top);
    window["gc"];
    var isloaded = false;
    var isPlayEnd = false;
    World.Go(function () {
        TWEEN.update();
        stage_main.worldDraw();
        stage_top.worldDraw();
        stage_bg.worldDraw();
        if(window["gc"]){
            window["gc"].move()
        }
        if(isPlayEnd&&isloaded){
            isPlayEnd=false;
            isloaded=false;
            document.getElementById("loadline").style.visibility="hidden";
            removeLoadingAnimate(function(){
                window["gc"] = new GC(stage_bg,stage_main,stage_top);
            });
        }
    });
    var logo_Bmp,logo_Bmp0;
    (function loading(){
        var logo_res0 = "../../Content/Images/img/hotyi_text.png";
        var logo_res = "../../Content/Images/img/hotyi_logo.png";
        KWhaleUtils.getImgBySrcAndCall(logo_res,function(logo){
            logo_Bmp0=null;
            KWhaleUtils.getImgBySrcAndCall(logo_res0,function(data){
                RES.load(setProgress, function () {
                    loaded();
                });
                logo_Bmp = new Bitmap(logo);
                KWhaleUtils.AddStageByScaleHNoCheck(stage_main,logo_Bmp,logoWeight/1135);
                logo_Bmp.anchorX=logo_Bmp.anchorY=0.5;
                logo_Bmp.x = start_x;
                logo_Bmp.y = start_y;
                logo_Bmp.alpha=0;
                logo_Bmp.z = 100;

                logo_Bmp0 = new Bitmap(data);
                KWhaleUtils.AddStageByScaleHNoCheck(stage_main,logo_Bmp0,logoWeight*1/5/1135);
                logo_Bmp0.x = (stage_main.sw - logo_Bmp0.width)/2;
                logo_Bmp0.y = logo_Bmp.y + logo_Bmp.height/2 + stage_main.sh/1135*24;
                logo_Bmp0.alpha = 0;
                logo_Bmp0.z = 100;
            });
            var start_x = stage_main.sw/2;
            var start_y = stage_main.sh/1135*479;

            var lineWeight = 142/408*22;
            var logoWeight = 142;

            var dis_x = stage_main.sh/1135*lineWeight/22*169;
            var dis_y_1 = stage_main.sh/1135*lineWeight/22*82;
            var dis_y_2 = stage_main.sh/1135*lineWeight/22*100;
            var dis_y_3 = stage_main.sh/1135*lineWeight/22*175;
            var st_point = {x:start_x,y:start_y};

            var point_11 = {x:start_x,y:start_y-dis_y_3};
            var point_12 = {x:start_x-dis_x,y:start_y+dis_y_2};
            var point_13 = {x:start_x+dis_x,y:start_y+dis_y_2};

            var time_1 = 400;//840;
            var time_2 = 300;//516;
            var time_3 = 200;//300;

            var line_1,line_2,line_3,line_31,line_32,line_21,line_22,line_11,line_12,tw1,tw11,tw12,tw2,tw21,tw22,tw3,tw31,tw32,twl;


            line_1 = new Line(st_point,st_point,"#008bd3",stage_main.sh/1135*lineWeight/KWRatio);
            tw1 = KWhaleUtils.Tween(line_1.endObj,{x:start_x-dis_x,y:start_y-dis_y_1},0,time_1,TWEEN.Easing.Back.InOut).start().onComplete(function(){
                line_11 = new Line(line_1.endObj,line_1.endObj,"#008bd3",stage_main.sh/1135*lineWeight/KWRatio);
                stage_main.addChild(line_11);
                tw11 = KWhaleUtils.Tween(line_11.endObj,point_11,0,time_2,TWEEN.Easing.Back.InOut).start();

                line_12 = new Line(line_1.endObj,line_1.endObj,"#008bd3",stage_main.sh/1135*lineWeight/KWRatio);
                stage_main.addChild(line_12);
                tw12 = KWhaleUtils.Tween(line_12.endObj,point_12,time_2,time_2,TWEEN.Easing.Back.InOut).start();
            });
            line_2 = new Line(st_point,st_point,"#008bd3",stage_main.sh/1135*lineWeight/KWRatio);
            tw2 = KWhaleUtils.Tween(line_2.endObj,{x:start_x+dis_x,y:start_y-dis_y_1},0,time_1,TWEEN.Easing.Back.InOut).start().onComplete(function(){
                line_21 = new Line(line_2.endObj,line_2.endObj,"#008bd3",stage_main.sh/1135*lineWeight/KWRatio);
                stage_main.addChild(line_21);
                tw21 = KWhaleUtils.Tween(line_21.endObj,point_13,0,time_2,TWEEN.Easing.Back.InOut).start();

                line_22 = new Line(line_2.endObj,line_2.endObj,"#008bd3",stage_main.sh/1135*lineWeight/KWRatio);
                stage_main.addChild(line_22);
                tw22 = KWhaleUtils.Tween(line_22.endObj,point_11,time_2,time_2,TWEEN.Easing.Back.InOut).start();
            });
            line_3 = new Line(st_point,st_point,"#008bd3",stage_main.sh/1135*lineWeight/KWRatio);
            tw3 = KWhaleUtils.Tween(line_3.endObj,{x:start_x,y:start_y+dis_y_3},0,time_1,TWEEN.Easing.Back.InOut).start().onComplete(function(){
                line_31 = new Line(line_3.endObj,line_3.endObj,"#008bd3",stage_main.sh/1135*lineWeight/KWRatio);
                stage_main.addChild(line_31);
                tw31 = KWhaleUtils.Tween(line_31.endObj,point_12,0,time_2,TWEEN.Easing.Back.InOut).start();

                line_32 = new Line(line_3.endObj,line_3.endObj,"#008bd3",stage_main.sh/1135*lineWeight/KWRatio);
                stage_main.addChild(line_32);
                stage_main.reflashZ();
                tw32 = KWhaleUtils.Tween(line_32.endObj,point_13,time_2,time_2,TWEEN.Easing.Back.InOut).start().onComplete(function(){
                    KWhaleUtils.Tween(logo_Bmp,{alpha:1},0,time_3,TWEEN.Easing.Quadratic.InOut).start().onComplete(function() {
                        stage_main.removeChild(line_1);
                        stage_main.removeChild(line_11);
                        stage_main.removeChild(line_12);
                        stage_main.removeChild(line_2);
                        stage_main.removeChild(line_21);
                        stage_main.removeChild(line_22);
                        stage_main.removeChild(line_3);
                        stage_main.removeChild(line_31);
                        stage_main.removeChild(line_32);
                        /*tw1.stop();
                        tw11.stop();
                        tw12.stop();
                        tw2.stop();
                        tw21.stop();
                        tw22.stop();
                        tw3.stop();
                        tw31.stop();
                        tw32.stop();*/
                    });


                    if(logo_Bmp0){
                        var t = KWhaleUtils.Tween(logo_Bmp0,{alpha:1},0,time_3,TWEEN.Easing.Quadratic.InOut).start().onComplete(function(){
                            isPlayEnd=true;
                            //t.stop();
                        });
                    }
                });
            });
            stage_main.addChild(line_1);
            stage_main.addChild(line_2);
            stage_main.addChild(line_3);
        });
    }());
    function removeLoadingAnimate(call) {
        //setTimeout(function () {
        var t1 = KWhaleUtils.Tween(logo_Bmp, {alpha: 0}, 1000, 500, TWEEN.Easing.Quadratic.InOut).start();
        var t2 = KWhaleUtils.Tween(logo_Bmp0, {alpha: 0}, 1000, 500, TWEEN.Easing.Quadratic.InOut).start().onComplete(function () {
            stage_main.removeChild(logo_Bmp);
            stage_main.removeChild(logo_Bmp0);
            call();
            //t2.stop();
            //t1.stop();
        });
        //}, 2000);
    }
    function setProgress (count,total){
        var sw = window.innerWidth || document.documentElement.clientWidth;
        var sh = window.innerHeight || document.documentElement.clientHeight;
        var ll = document.getElementById("loadline");
        //ll.style.top = "0px";
        ll.style.top = "0px";//sh/1135*1125+"px";
        ll.style.width=sw*count/total+"px";
        ll.style.height=sh/1135*10+"px";
    };
    function loaded(){
        var sw = window.innerWidth || document.documentElement.clientWidth;
        var sh = window.innerHeight || document.documentElement.clientHeight;
        var ll = document.getElementById("loadline");
        //ll.style.top = "0px";
        ll.style.top = "0px";//sh/1135*1125+"px";
        ll.style.width = sw+"px";
        ll.style.height = sh/1135*10+"px";
        isloaded = true;
    };
};