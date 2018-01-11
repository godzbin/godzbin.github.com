window.onload = function () {
    var sliderBox = document.getElementById("slider-box");
    var sliderMain = new SliderMain(sliderBox);
    sliderMain.createSlider(4);
    sliderMain.createSliderBox(4, 4);
    var buttons = document.getElementsByClassName("btn");
    buttons[0].onclick = function () {
        sliderMain.animation();
    };
};
function SliderMain(el) {
    this.el = el;
    this.sliderList = [];
    this.sliderBoxList = [];
    this.currPosition = 0;
    this.runRight = true;
    this.row = 4;
    this.col = 4;
    this.createSlider = function (num) {
        num = num || 1;
        for (var i = 0; i < num; i++) {
            var l = this.sliderList.length;
            var slider = new Slider({
                width: 210,
                height: 210,
                x: l * 300,
                y: 0,
                color: "#dddddd",
                el: this.el
            });
            this.sliderList.push(slider);
        }
    };
    this.animation = function () {
        if (this.currPosition === this.sliderList.length - 1) {
            this.runRight = false;
        } else if (this.currPosition === 0) {
            this.runRight = true;
        }
        if (this.runRight) {
            this.currPosition++;
        } else {
            this.currPosition--;
        }
        var slider = this.sliderList[this.currPosition];
        var x = slider.x;
        var y = slider.y;
        this.moveBox(x, y);
    };
    this.moveBox = function (mX, mY) {
        for (var i = 0, l = this.sliderBoxList.length; i < l; i++) {
            var box = this.sliderBoxList[i]
            var x = box.initX;
            var y = box.initY;
            box.sotp();
            var timeDelay = 0, delayNum = 50;
            var currRow = i / this.col;
            var currCol = i % this.col;
            if (this.runRight) {
                timeDelay = ((this.row + this.col - 1) - currRow - currCol) * delayNum;
            } else {
                timeDelay = ((this.row + this.col - 1) + currRow + currCol) * delayNum;
            }
            box.run(mX + x, mY + y, timeDelay);
        }
    };

    this.createSliderBox = function (row, col) {
        this.row = row;
        this.col = col;
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                var sliderBox = new Slider({
                    width: 40,
                    height: 40,
                    x: j * 50 + 10,
                    y: i * 50 + 10,
                    color: "#fff000",
                    el: this.el,
                });
                this.sliderBoxList.push(sliderBox);
            }
        }
    };
}
function Slider(configs) {
    this.color = configs.color || "#fff";
    this.w = configs.width || 50;
    this.h = configs.height || 50;
    this.x = configs.x || 0;
    this.y = configs.y || 0;
    this.initX = configs.x;
    this.initY = configs.y;
    this.isRun = true;
    this.parentEl = configs.el;
    this.timeIndex = 0;
    this.creactEl = function () {
        this.el = document.createElement("div");
        this.el.style.width = this.w + "px";
        this.el.style.height = this.h + "px";
        this.el.style.position = "absolute";
        this.el.style.background = this.color;
        this.renderEl();
        this.parentEl.appendChild(this.el);
    };
    this.sotp = function () {
        this.timeIndex && clearTimeout(this.timeIndex || "");
    };
    this.run = function (mX, mY, timeDelay) {
        if (!this.isRun) {
            this.isRun = true;
            return;
        }
        var self = this, isOver = 0,
            offsetNumX = 5,
            offsetNumY = 5;
        timeSin = 0;
        if (this.x > mX) {
            timeSin = Math.sin(mX / this.x);
        } else {
            timeSin = Math.sin(this.x / mX);
        }
        this.timeIndex = setTimeout(function () {
            if (self.x < mX) {
                self.x += offsetNumX;
            } else if (self.x > mX) {
                self.x -= offsetNumX;
            }
            if (self.y < mY) {
                self.y += offsetNumY;
            } else if (self.y > mY) {
                self.y -= offsetNumY;
            }
            if (Math.abs(self.x - mX) < offsetNumX) {
                self.x = mX;
                isOver++;
            }
            if (Math.abs(self.y - mY) < offsetNumY) {
                self.y = mY;
                isOver++;
            }
            self.renderEl();
            if (isOver < 2) {
                self.run(mX, mY);
            }
        }, timeDelay || 500 / 60 * timeSin);
    };
    this.renderEl = function () {
        this.el.style.top = this.y + "px";
        this.el.style.left = this.x + "px";
    };
    this.creactEl();
}