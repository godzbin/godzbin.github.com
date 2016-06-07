/**
 * Created by Administrator on 2016/1/11.
 */


function RES(){};
RES.RES_JSON = {
    /*"spfish": {
        "isLoad": false,
        "src": "img/enemy_3.png",
        "action": {
            "run": {
                "frameRate": 6,
                "frames": ["big-fish01", "big-fish02", "big-fish03"]
            }
        },
        "res": {
            "big-fish01": {"x": 1, "y": 1, "w": 328, "h": 209},
            "big-fish02": {"x": 1, "y": 212, "w": 328, "h": 209},
            "big-fish03": {"x": 1, "y": 423, "w": 328, "h": 209}
        }
    },
    "boss": {
        "isLoad": false,
        "src": "img/enemy1.png",
        "action": {
            "run": {
                "frameRate": 6,
                "frames": ["B0777C93", "603AD09C", "D481400"]
            },
            "death": {
                "frameRate": 12,
                "frames": ["83BD8CBE", "DAC236F1", "4275A267"]
            }
        },
        "res": {
            "B0777C93": {"x": 1, "y": 1, "w": 292, "h": 324},
            "603AD09C": {"x": 1, "y": 327, "w": 292, "h": 324},
            "D481400": {"x": 1, "y": 653, "w": 292, "h": 324},
            "83BD8CBE": {"x": 295, "y": 1, "w": 292, "h": 324},
            "DAC236F1": {"x": 589, "y": 1, "w": 292, "h": 324},
            "4275A267": {"x": 295, "y": 327, "w": 292, "h": 324}
        }
    },
    "p6_inside": {isLoad: false, src: "img/p6_inside.png"}*/
};

RES.load=function(progress,finish){
    var total = Object.getOwnPropertyNames(RES.RES_JSON).length;
    var count = 0;
    if(total==0){
        progress(1,1);
        finish();
        return
    }
    for(var obj in RES.RES_JSON){
        var src = RES.RES_JSON[obj].src;
        var func =function(obj){
            var image = new Image();
            image.src = src;
            if (image.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
                RES.RES_JSON[obj].isLoad=true;
                RES.DATA_SET[obj]=image;
                count++;
                progress(count,total);
                if(count==total){
                    finish();
                }
                return; // 直接返回，不用再处理onload事件
            }
            image.onload  = function () {
                RES.RES_JSON[obj].isLoad=true;
                RES.DATA_SET[obj]=image;
                count++;
                progress(count,total);
                if(count==total){
                    finish();
                }
            }
        };
        try{
            func(obj);
        }catch (e){
            console.error("err:img load:"+obj)
        }
    }
}

RES.DATA_SET={};

RES.getRES = function(resName){
    try{
        if(RES.RES_JSON[resName].isLoad) {
            var rs = RES.DATA_SET[resName];
            return rs;
        }else{
            console.error("err:img load"+resName)
        }
    }catch (e){
        console.error("err:img load:"+resName)
    }
}

RES.getSpirteRES = function(resName){
    if(RES.RES_JSON[resName].isLoad) {
        var rs = {};
        rs.img = RES.DATA_SET[resName];
        var data = RES.RES_JSON[resName];
        rs.action=data.action;
        rs.res=data.res;
        return rs;
    }else{
        alert("err:img load")
    }
}
