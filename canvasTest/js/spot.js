/**
 * Created by GodzBin on 2016/6/21.
 */
// 点 的对象
function Spot(x, y, width, color) {
    this.x = x || 0;
    this.y = y || 0;
    // 设置随机移动的参数
    this.x_move_num = Math.random() * Math.pow(-1,parseInt(Math.random()*10));
    this.y_move_num = Math.random() * Math.pow(-1,parseInt(Math.random()*10));
    this.width = width || 100;
    this.color = color || "#fff";
    this.running = function (_ctx) {
        this._ctx = _ctx;
        this.DrawGarp();
    };
    this.DrawGarp = function () {
        this._ctx.beginPath();
        this._ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2, true);
        this._ctx.closePath();
        this._ctx.fillStyle = this.color;
        this._ctx.fill();
        this.move();
    };
    this.move = function(){
        var ctx_width = this._ctx.canvas.width;
        var ctx_height = this._ctx.canvas.height;
        if (this.x - this.width < 0 || this.x + this.width > ctx_width) {
            this.x_move_num = this.x_move_num * -1;
        }
        if (this.y - this.width < 0 ||  this.y + this.width > ctx_height) {
            this.y_move_num = this.y_move_num * -1;
        }
        this.x += 1 * this.x_move_num;
        this.y += 2 * this.y_move_num;
    };
};

