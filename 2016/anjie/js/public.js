/**
 * Created by GodzBin on 2016/9/23.
 */
// 回到页面顶部
$(document).ready(function () {
    $(document).scroll(function () {
        // var height = $(window).height();
        var scrollTop = $(document).scrollTop();
        if (scrollTop > 100) {
            scrollTopShow();
        } else {
            scrollTopHide();
        }
    });
    (function createScrollTop() {
        var box = $("<div title='回到页首'></div>");
        var childBox = $("<span>^</span>");
        var childBox2 = $("<span>^</span>");
        var childBoxCss = {
            display: "block",
            width: "50px",
            'text-align': "center",
            'font-size': '40px',
            'padding-top': "10px",
            'line-height': "40px",
            'color': "#fff",
            'font-family': "Bauhaus 93",
            '-webkit-transition': 'all .3s',
            '-moz-transition': 'all .3s',
            '-ms-transition': 'all .3s',
            '-o-transition': 'all .3s',
            'transition': 'all .3s'
        };
        box.addClass("scrollTop");
        childBox.addClass("scrollTopChildTop");
        box.css({
            display: "block",
            width: "50px",
            height: "50px",
            background: "#E66514",
            position: "fixed",
            right: "20px",
            bottom: "-50px",
            cursor: "pointer",
            opacity: 0,
            '-webkit-transition': 'all 1s',
            '-moz-transition': 'all 1s',
            '-ms-transition': 'all 1s',
            '-o-transition': 'all 1s',
            'transition': 'all 1s',
            'z-index': "999",
            overflow: "hidden"
        });
        childBox.css(childBoxCss);
        childBox2.css(childBoxCss);
        box.append(childBox);
        box.append(childBox2);
        box.mouseover(function(){
            childBox.css({
                'margin-top':"-50px"
            });
        }).mouseleave(function(){
            childBox.css({
                'margin-top':"0"
            });
        }).click(function(){
            $("body").animate({
                scrollTop: 0
            },500);
        });
        $("body").append(box);
    })();
    function scrollTopShow() {
        var box = $(".scrollTop");
            box.css({
                bottom: "20px",
                opacity: 1
            });
    }
    function scrollTopHide() {
        var box = $(".scrollTop");
            box.css({
                bottom: "-50px",
                opacity: 0
            });
    }
});