$(document).ready(function () {
    main.init();
    main.textareaPlaceholder();
    main.initSlide();
    setInterval(function () {
        main.nextSlide();
    }, 5000);
});
var main = {
    isLoadAmount: false,
    init: function () {
        main.initNewTab();
        main.initScroll();
    },
    initNewTab: function () {
        $(".new-right-tab-header-box").click(function () {
            if (!$(this).hasClass("action")) {
                $(".new-right-tab-header-box").removeClass("action");
                $(this).addClass("action");
                if ($(this).hasClass("anJie-new-header")) {
                    $(".anJie-new").show();
                    $(".hangNeiDongTai").hide();
                } else {
                    $(".anJie-new").hide();
                    $(".hangNeiDongTai").show();
                }
            }
        });
    },
    initScroll: function () {
        $(document).scroll(function () {
            var mainTop = $(document).scrollTop();
            var newTop = $(".new").offset().top;
            if (mainTop + 300 > newTop && !main.isLoadAmount) {
                main.setAmount();
            }
        });
    },
    setAmount: function () {
        main.isLoadAmount = true;
        var values = $(".amount-main-box-value");
        var length = values.length;
        var max = 0;
        for (var i = 0; i < length; i++) {
            var value = parseInt($(values[i]).find("p").text());
            max < value && (max = value);
        }
        var maxHeight = 160;
        for(var i = 0; i < length; i++){
            var value = parseInt($(values[i]).find("p").text());
            var rate =  value/max;
            var height = maxHeight * rate;
            // $(values[i]).height(height);
            $(values[i]).animate({height: height}, 1000);
        }
    },
    //多行文本框的提示语显示
    textareaPlaceholder: function () {
        var textarea = $(".model-table-form-textarea");
        var placeholder = $(".model-table-form-textarea-placeholder");
        textarea.focus(function () {
            placeholder.hide();
        });
        textarea.blur(function () {
            if (textarea.val() === "") {
                placeholder.show();
            }
        });
    },
    getSlideBoxs: function () {
        return $(".slide-img-box");
    },
    initSlide: function () {
        $(".slide-ctrl-before").click(this.beforeSlide);
        $(".slide-ctrl-next").click(this.nextSlide);
    },
    beforeSlide: function () {
        var boxs = main.getSlideBoxs();
        var length = boxs.length;
        for (var i = 0; i < length; i++) {
            var box = $(boxs[i]);
            if (box.hasClass("action")) {
                box.removeClass("action");
                box.css("left", "0");
                box.animate({left: "100%"}, 1000);
                var prevBox = box.prev();
                if (!prevBox.length || prevBox.hasClass("slide-img-model")) {
                    prevBox = $(boxs[length - 1]);
                }
                prevBox.css("left", "-100%");
                if (prevBox) {
                    prevBox.animate({"left": "0"}, 1000);
                    prevBox.addClass("action");
                }
                return;
            }
        }
    },
    nextSlide: function () {
        var boxs = main.getSlideBoxs();
        var length = boxs.length;
        for (var i = 0; i < length; i++) {
            var box = $(boxs[i]);
            if (box.hasClass("action")) {
                box.removeClass("action");
                box.css("left", "0");
                box.animate({left: "-100%"}, 1000);
                var nextBox = box.next();
                if (!nextBox.length) {
                    nextBox = $(boxs[0]);
                }
                nextBox.css("left", "100%");
                if (nextBox) {
                    nextBox.animate({"left": "0"}, 1000);
                    nextBox.addClass("action");
                }
                return;
            }
        }
    }
};