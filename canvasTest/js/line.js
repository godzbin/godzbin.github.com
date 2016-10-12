/**
 * Created by GodzBin on 2016/6/22.
 */
//两点相连的线 的对象
function Line(obj1, obj2, color) {
    this.obj1 = obj1;
    this.obj2 = obj2;
    this.color = color || "#fff";
    this.running = function (_ctx) {
        this._ctx = _ctx;
        this.DrawGarp();
    };
    this.DrawGarp = function () {
        var startX = this.obj1.x || 0;
        var startY = this.obj1.y || 0;
        var endX = this.obj2.x || 0;
        var endY = this.obj2.y || 0;
        this._ctx.fillStyle= this.color;
        this._ctx.strokeStyle = this.color;
        this._ctx.beginPath();
        this._ctx.moveTo(startX, startY);
        this._ctx.lineTo(endX,endY);
        this._ctx.fill();
        this._ctx.stroke();
        this._ctx.closePath();
    };
}