/**
 * Created by GodzBin on 2016/6/21.
 */

//主界面，舞台与动画；
function Main(canvasId, width, height) {
    this._canvasId = canvasId;
    this._width = width || 400;
    this._height = height || 400;
    this._Graps = [];
    this.initRunning = function () {
        var that = this;
        this.initBox();
        // 创建
        setInterval(function () {
            that.running();
        }, 24);
    };
    this.running = function () {
        this._ctx.clearRect(0, 0, this._width, this._height);
        for (var i = 0, l = this._Graps.length; i < l; i++) {
            var obj = this._Graps[i];
            this.drawGrap(obj);
        }
    };
    this.drawGrap = function (obj) {
        obj.running(this._ctx);
    };
    this.initBox = function () {
        var _canvasBox = this.getCanvasBox();
        _canvasBox.width = this._width;
        _canvasBox.height = this._height;
        this._ctx = _canvasBox.getContext('2d');
    };
    this.getCanvasBox = function () {
        var _ele = document.getElementById(this._canvasId);
        return _ele;
    };
    this.setGraps = function (obj) {
        this._Graps.push(obj);
    };
    this.initRunning();
}
// 加载完成后
window.onload = function () {
    var height = document.body.scrollHeight;
    var width = document.body.scrollWidth;
    // 创建主界面
    var main = new Main("main", width, height);
    var tests = [];
    //创建n个点 并放入主界面
    for (var i = 0, l = 15; i < l; i++) {
        var x = Math.random() * (width - 20) || 10;
        var y = Math.random() * (height - 20) || 10;
        var r = Math.random() * 5+5;
        var test = new Spot(x,y , r, "rgba(255,255,255, 0.05)");
        tests.push(test);
        main.setGraps(test);
    }
    // 创建n条线 并放入主界面
    for (var z = 0, l_l = 40; z < l_l; z++) {
        var ran = parseInt(Math.random() * tests.length);
        var ran2 = parseInt(Math.random() * tests.length);
        var line = new Line(tests[ran], tests[ran2], "rgba(255,255,255, 0.05)");
        main.setGraps(line);
    }
};

