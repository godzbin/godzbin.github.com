function GC(stage_bg, stage_main, stage_top) {
    /* 场景 */
    this._stage_bg = stage_bg;
    this._stage_main = stage_main;
    this._stage_top = stage_top;
    this.init();
};
GC.prototype = {
    _points: [],
    _pointSet: [],
    init: function () {
        for (var i = 0, l = 20; i < l; i++) {
            this.setPoint();
        }
        for(var i = 0, l = 50; i < l; i++){
            this.get2pointAndLine();
        }
    },
    get2pointAndLine: function () {
        var that = this,
            s = that._stage_main;
        var PointA = that.getPoint();
        var PointB = that.getPoint();
        var line = new Line(PointA, PointB, "#008bd3", s.sh / 1135 * 4, false);
        s.addChild(line);
        s.addChild(PointA);
        s.addChild(PointB);

        var obj = new function () {
            this.p1 = PointA;
            this.p2 = PointB;
            //this.x = (KWhaleUtils.getRandomOne2Numer(10) - 5) / 10;
            //this.y = (KWhaleUtils.getRandomOne2Numer(10) - 5) / 10;
        };
        that._pointSet.push(obj);
    },
    setPoint: function () {
        var that = this,
            s = that._stage_main;
        var rdx = s.sw * (KWhaleUtils.getRandomOne2Numer(10) / 12);
        var rdy = s.sh * (KWhaleUtils.getRandomOne2Numer(10) / 12);
        var point = new Shape.Circle({x: rdx, y: rdy}, 10, "gray");
        point.moveX = (KWhaleUtils.getRandomOne2Numer(4) - 2) / 10;
        point.moveY = (KWhaleUtils.getRandomOne2Numer(4) - 2) / 10;
        this._points.push(point);
    },
    getPoint: function(){
        var ran =  KWhaleUtils.getRandomOne2Numer(this._points.length-1);
        var point = this._points[ran];
        return point;
    },
    move: function () {
        var that = this,
            s = that._stage_main;
        if (that._points.length == 0) {
            return;
        }
        for (var i = 0, len = that._points.length; i < len; i++) {
            var ele = that._points[i];
            ele.x += ele.moveX;
            ele.y += ele.moveY;
            if(ele.x <0 || ele.x> s.sw){
                ele.x = s.sw * (KWhaleUtils.getRandomOne2Numer(10) / 12);
                ele.moveX = (KWhaleUtils.getRandomOne2Numer(4) - 2) / 10;
                ele.moveY = (KWhaleUtils.getRandomOne2Numer(4) - 2) / 10;
            }
            if(ele.y < 0 || ele.y> s.sh){
                ele.y = s.sh * (KWhaleUtils.getRandomOne2Numer(10) / 12);
                ele.moveX = (KWhaleUtils.getRandomOne2Numer(4) - 2) / 10;
                ele.moveY = (KWhaleUtils.getRandomOne2Numer(4) - 2) / 10;
            }
            //var ele = that._pointSet[i];
            //ele.p1.x += ele.x;
            //ele.p1.y -= ele.y;
            //ele.p2.x -= ele.x;
            //ele.p2.y += ele.y;
        }
    }
};