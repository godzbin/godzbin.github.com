window.onload = function () {
    // var isRun = false;
    // var isStop = 0;
    // var modeNumber = 1;

    // function getBody() {
    //     var body = document.getElementsByClassName("body");
    //     return body[0];
    // }
    // // 主要的两个div
    // function createMainDiv(className) {
    //     var mainDiv = document.createElement("div");
    //     mainDiv.className = className;
    //     mainDiv.style.height = "200px";
    //     mainDiv.style.width = "200px";
    //     getBody().appendChild(mainDiv);
    // }
    // // 动画小方块
    // function createChildDiv(className, row, col) {
    //     var childDiv = document.createElement("div");
    //     childDiv.className = className;
    //     childDiv.style.height = "40px";
    //     childDiv.style.width = "40px";
    //     childDiv.style.left = col * 50 + "px";
    //     childDiv.style.top = row * 50 + "px";
    //     getBody().appendChild(childDiv);
    // }
    // // 4*4的方块方阵
    // function createChildTable() {
    //     for (var i = 0, l = 4; i < l; i++) {
    //         for (var col_index = 0, col_l = 4; col_index < col_l; col_index++) {
    //             var childClass = "childBox ";
    //             var row = "row" + i;
    //             var col = "col" + col_index;
    //             var boxId = "box" + (i * 4 + col_index);
    //             createChildDiv(childClass + row + " " + col + " " + boxId, i, col_index);
    //         }
    //     }
    // }
    // // 行动画
    // function animationRow(row, col) {
    //     var a_row = row;
    //     var a_col = col;
    //     if (modeNumber > 0) {
    //         a_row = Math.abs(row - (3 * modeNumber));
    //         a_col = Math.abs(col - (3 * modeNumber));
    //     }
    //     var stopBoxsValue = stopBoxs();

    //     setTimeout(function () {
    //         animationColumn(row, col);
    //     }, 100 * Math.abs(a_row + a_col - stopBoxsValue));
    // }
    // // 已经结束的方块数
    // function stopBoxs() {
    //     var stopBoxsValue = 0;
    //     for (var i = 0, l = 4; i < l; i++) {
    //         for (var col_index = 3, col_l = 0; col_index >= col_l; col_index--) {
    //             var boxId = "box" + (i * 4 + col_index);
    //             var boxs = document.getElementsByClassName(boxId);
    //             var box = boxs[0];
    //             var left = col_index * 50 + 200 + 100;
    //             var boxLeft = parseInt(box.style.left + 0);
    //             if (modeNumber > 0 && boxLeft > left - 5) {
    //                 stopBoxsValue++;
    //             } else if (modeNumber < 0 && boxLeft < col_index * 50 + 5) {
    //                 stopBoxsValue++;
    //             }
    //         }
    //     }
    //     return stopBoxsValue;
    // }
    // // 列动画
    // function animationColumn(r, col_index) {
    //     var isOK = true;
    //     // var row = "row" + r;
    //     var boxId = "box" + (r * 4 + col_index);
    //     var boxs = document.getElementsByClassName(boxId);
    //     var left = col_index * 50 + 200 + 100;
    //     var box = boxs[0];

    //     var boxLeft = parseInt(box.style.left + 0);


    //     if (modeNumber > 0 && boxLeft > left - 5) {
    //         box.style.left = left + "px";
    //     } else if (modeNumber < 0 && boxLeft < col_index * 50 + 5) {
    //         box.style.left = col_index * 50 + "px";
    //     } else {
    //         box.style.left = boxLeft + (modeNumber * 5) + "px";
    //         isOK = false;
    //     }

    //     // 如果动画结束或者 停止 ，则中断setTimeOut
    //     if (isOK || isStop) {
    //         isStop > 0 && isStop--;
    //         return;
    //     }

    //     setTimeout(function () {
    //         animationColumn(r, col_index);
    //     }, 500 / 60 * Math.sin(boxLeft / left * modeNumber));
    // }
    // // 动画
    // function animation() {
    //     for (var i = 0, l = 4; i < l; i++) {
    //         for (var col_index = 3, col_l = 0; col_index >= col_l; col_index--) {
    //             animationRow(i, col_index);
    //         }
    //     }
    // }

    // var button = document.getElementsByTagName("button");
    // button[0].onclick = function () {
    //     if (this.isRun) {
    //         var runingBoxsValue = 16 - stopBoxs();
    //         this.isStop = runingBoxsValue;
    //         modeNumber = -modeNumber;
    //     }
    //     this.isRun = true;
    //     animation();
    // };
    // createMainDiv("mainBox");
    // createMainDiv("mainBox mainBox2");
    // createChildTable();

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