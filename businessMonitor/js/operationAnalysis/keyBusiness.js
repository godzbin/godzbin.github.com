$(function() {
    kendo.culture("zh-CN");
    $tools.getNav("../nav/header.html", ".header-nav-main", nav.setHeaderNav);
    $tools.getNav("../nav/operationAnalysis.html", ".content-left", nav.setLeftNav);
    main.ctrl.init();
});
var nav = {
    setHeaderNav: function() {
        $(".header-nav-bg3").addClass("action");
    },
    setLeftNav: function() {
        $("#businessAnalysis").collapse("show");
        $(".content-left-nav1-open").addClass("action");
    },
};
var configs = {
    area: [{
        name: "广州市",
        value: 0,
    }],
    channel: [{
        name: "营业厅前台",
        value: 1
    }, {
        name: "电渠",
        value: 2
    }],
    busiName: [{
        name: "重置密码（未身份确认的预付费）",
        value: 668
    }],
    box: {
        area: "#area",
        channel: "#channel",
        busiName: "#busiName",
        time: "#time",
        handlingRadialGauge: "#handlingRadialGauge",
        durationRadialGauge: "#durationRadialGauge",
        rateRadialGauge: "#rateRadialGauge",
        stepDatailsGrid: "#stepDatailsGrid",
        busiStepChar: "#busiStepChar",
        customerRetentionRateChar: "#customerRetentionRateChar",
        trendHandling: "#trendHandling",
        trendRate: "#trendRate",
        trendDuration: "#trendDuration",
        stepDatails: "#stepDatails",
        stepDuration: "#stepDuration"
    },
    charNodeBackground: ["#30BCFF", "#6E797F"],
    rangesColor: ["#5EEF5A", "#00A3F4", "#FFB522", "#FF3131"],
    stepDatails: {
        busiStep: "busiStep",
        busiHandling: "busiHandling",
        duration: "duration",
        rate: "rate",
    },
    stepDatails_text: {
        busiStep: "业务步骤",
        busiHandling: "业务量",
        duration: "步骤时长",
        rate: "步骤成功率",
    },
    url: {
        getTime: "app_view_getTimeIntervals",
        getTopKPIsByBusiType: "app_view_getTopKPIsByBusiType",
        getChartDataByBusiType: "app_view_getChartDataByBusiType"
    },
    Env: {
        bpcMonitor: "bpcMonitor",
    },
    busiStep: [{
        name: "进入密码重置界面",
        handling: 120,
        duration: 120,
        rate: 100,
        wait: 19
    }, {
        name: "9选3校验后点击”下一步“按钮",
        handling: 120,
        duration: 120,
        rate: 100,
        wait: 19
    }, {
        name: "点击提交按钮",
        handling: 120,
        duration: 120,
        rate: 100,
        wait: 19
    }, {
        name: "信息确认界面点击确定后返回办理结果反馈",
        handling: 120,
        duration: 120,
        rate: 100,
        wait: 19
    }]
};
var main = {
    view: {
        init: function() {
            $tools.kendoComboBox(configs.box.area, "name", "value", []);
            $tools.kendoComboBox(configs.box.channel, "name", "value", []);
            $tools.kendoComboBox(configs.box.busiName, "name", "value", []);
            $tools.kendoComboBox(configs.box.time, "NAME", "VALUE", []);
            this.createHandlingRadialGauge();
            this.createDurationRadialGauge();
            this.createRateRadialGauge();
            this.createStepDatailsGrid();
            this.createCustomerRetentionRateChar();
            // this.createBusiStepChar();
            this.createTrendHandling();
            this.createTrendRate();
            this.createTrendDuration();
        },
        getRanges: function(value) {
            var minorUnit = parseFloat(value / 4);
            var ranges = [];
            for (var i = 0, l = 4; i < l; i++) {
                ranges.push({
                    from: minorUnit * i,
                    to: minorUnit * (i + 1),
                    color: configs.rangesColor[i]
                });
            }
            return ranges;
        },
        createHandlingRadialGauge: function() {
            var value = 1000;
            var ranges = this.getRanges(value);
            var minorUnit = parseFloat(value / 4);
            $(configs.box.handlingRadialGauge).kendoRadialGauge({
                pointer: {
                    value: 0
                },
                height: 150,
                scale: {
                    minorUnit: minorUnit,
                    startAngle: -30,
                    endAngle: 210,
                    max: value,
                    labels: {
                        position: "outside"
                    },
                    majorTicks: {
                        size: 1,
                    },
                    majorUnit: minorUnit,
                    rangeSize: 5,
                    ranges: ranges
                }
            });
        },
        createDurationRadialGauge: function() {
            var value = 30;
            var ranges = this.getRanges(value);
            var minorUnit = parseFloat(value / 4);
            $(configs.box.durationRadialGauge).kendoRadialGauge({
                pointer: {
                    value: 0
                },
                height: 150,
                scale: {
                    minorUnit: minorUnit,
                    startAngle: -30,
                    endAngle: 210,
                    max: value,
                    labels: {
                        position: "outside"
                    },
                    majorTicks: {
                        size: 1,
                    },
                    majorUnit: minorUnit,
                    rangeSize: 5,
                    ranges: ranges
                }
            });
        },
        createRateRadialGauge: function() {
            var value = 100;
            var ranges = this.getRanges(value);
            var minorUnit = parseFloat(value / 4);
            $(configs.box.rateRadialGauge).kendoRadialGauge({
                pointer: {
                    value: 0
                },
                height: 150,
                scale: {
                    minorUnit: minorUnit,
                    startAngle: -30,
                    endAngle: 210,
                    max: value,
                    labels: {
                        position: "outside"
                    },
                    majorTicks: {
                        size: 1,
                    },
                    majorUnit: minorUnit,
                    rangeSize: 5,
                    ranges: ranges
                }
            });
        },
        createStepDatailsGrid: function() {
            $(configs.box.stepDatailsGrid).kendoGrid({
                height: 180,

                columns: [{
                    field: configs.stepDatails.busiStep,
                    title: configs.stepDatails_text.busiStep,
                }, {
                    field: configs.stepDatails.busiHandling,
                    title: configs.stepDatails_text.busiHandling,
                }, {
                    field: configs.stepDatails.duration,
                    title: configs.stepDatails_text.duration,
                }, {
                    field: configs.stepDatails.rate,
                    title: configs.stepDatails_text.rate,
                }]
            });
        },
        createCustomerRetentionRateChar: function() {
            $(configs.box.customerRetentionRateChar).kendoChart({
                dataSource: [{
                    name: "选择产品",
                    value: 90
                }, {
                    name: "身份确认",
                    value: 80
                }, {
                    name: "经费",
                    value: 70
                }, {
                    name: "提交",
                    value: 70
                }],
                chartArea: {
                    height: 180,
                },
                legend: {
                    position: "bottom",
                    visible: false
                },
                seriesDefaults: {
                    type: "line",
                    stack: true
                },
                series: [{
                    field: "value",
                    name: "name",
                    border: {
                        width: 0
                    },
                    color: configs.charNodeBackground[0]
                }],
                categoryAxis: {
                    field: "name",
                    majorGridLines: {
                        visible: false
                    }
                },
                valueAxis: {
                    majorUnit: 20,
                    visible: true,
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}",
                    color: "#fff"
                }
            });
        },
        createTrendHandling: function() {
            $(configs.box.trendHandling).kendoChart({
                chartArea: {
                    height: 200,
                },
                legend: {
                    position: "bottom",
                },
                seriesDefaults: {
                    type: "area",
                    area: {
                        line: {
                            style: "smooth"
                        }
                    },
                    opacity: 0.8
                },
                series: [{
                    field: "total",
                    name: "全过程业务量",
                    color: $tools.color[0]
                }, {
                    field: "success",
                    name: "全过程提交成功量",
                    color: $tools.color[1]
                }],
                categoryAxis: {
                    field: "time",
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        rotation: "-45",
                        template: function(obj) {
                            return obj.value.split(" ")[1].substr(0, 5);
                        }
                    }
                },
                valueAxis: {
                    // majorUnit: 20,
                    visible: true,
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}",
                    color: "#fff"
                }
            });
        },
        createTrendRate: function() {
            $(configs.box.trendRate).kendoChart({

                chartArea: {
                    height: 200,
                },
                legend: {
                    position: "bottom",
                    // visible: false
                },
                seriesDefaults: {
                    type: "area",
                    // stack: true
                    area: {
                        line: {
                            style: "smooth"
                        }
                    },
                    opacity: 0.8
                },
                series: [{
                    field: "rate",
                    name: "全过程成功率",
                    color: $tools.color[2]
                }],
                categoryAxis: {
                    field: "time",
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        rotation: "-45",
                        template: function(obj) {
                            return obj.value.split(" ")[1].substr(0, 5);
                        }
                    }
                },
                valueAxis: {
                    majorUnit: 20,
                    visible: true,
                    labels: {
                        format: "{0}%"
                    },
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}%",
                    color: "#fff"
                }
            });
        },
        createTrendDuration: function() {
            $(configs.box.trendDuration).kendoChart({
                chartArea: {
                    height: 200,
                },
                legend: {
                    position: "bottom",
                    // visible: false
                },
                seriesDefaults: {
                    type: "area",
                    area: {
                        line: {
                            style: "smooth",

                        },
                        opacity: 0.8
                    }
                },
                series: [{
                    field: "duration",
                    name: "全过程业务时长",
                    color: $tools.color[3]
                }],
                categoryAxis: {
                    field: "time",
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        rotation: "-45",
                        template: function(obj) {
                            return obj.value.split(" ")[1].substr(0, 5);
                        }
                    }
                },
                valueAxis: {
                    labels: {
                        format: "{0}ms"
                    },
                    visible: true,
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}",
                    color: "#fff"
                }
            });
        },

    },
    ctrl: {
        init: function() {
            main.view.init();
            this.getArea();
            this.getChannel();
            this.getTime();
            this.listenerStep();
            this.listenerChannelChange();
            this.listenerTimeChange();
            this.listenerBusiName();
        },
        getArea: function() {
            main.model.getArea();
        },
        setArea: function(data) {
            var kendoComboBox = $(configs.box.area).data("kendoComboBox")
            kendoComboBox.dataSource.data(data);
            if (data[0]) {
                kendoComboBox.value(data[0]["value"]);
            }
        },
        getChannel: function() {
            main.model.getChannel();
        },
        setChannel: function(data) {
            var kendoComboBox = $(configs.box.channel).data("kendoComboBox");
            kendoComboBox.dataSource.data(data);
            if (data[0]) {
                kendoComboBox.value(data[0]["value"]);
            }
            main.ctrl.getBusiName();
        },
        getBusiName: function() {
            var channel = $(configs.box.channel).val();
            main.model.getBusiName();
        },
        setBusiName: function(data) {
            var kendoComboBox = $(configs.box.busiName).data("kendoComboBox");
            kendoComboBox.dataSource.data(data);
            if (data[0]) {
                kendoComboBox.value(data[0]["value"]);
            }
        },
        listenerChannelChange: function() {
            $(configs.box.channel).change(this.getAllBusi);
        },
        listenerTimeChange: function() {
            $(configs.box.time).change(this.getAllBusi);
        },
        listenerBusiName: function() {
            $(configs.box.busiName).change(this.getAllBusi);
        },
        getAllBusi: function() {
            var channel = parseInt($(configs.box.channel).val());
            var busiName = parseInt($(configs.box.busiName).val());
            var time = parseInt($(configs.box.time).val());
            main.ctrl.getTopKPIsByBusiType(channel, time, busiName);
            main.ctrl.getChartDataByBusiType(channel, time, busiName);
            main.ctrl.getBusiStep();
        },
        getTime: function() {
            main.model.getTime();
        },
        setTime: function(data) {
            var kendoComboBox = $(configs.box.time).data("kendoComboBox");
            kendoComboBox.dataSource.data(data);
            if (data[0]) {
                kendoComboBox.value(data[0]["VALUE"]);
            }
            main.ctrl.getAllBusi();
        },

        getTopKPIsByBusiType: function(channel, time, busiName) {
            var params = {
                CHANNEL: channel,
                TIME_INTERVAL: time,
                BUSI_TYPE: busiName
            };
            main.model.getTopKPIsByBusiType(params);
        },
        setTopKPIsByBusiType: function(data) {
            console.log(data);
            var rate = 0;
            if (data["TOTAL_SUBMIT_STEP_SYS_FAILED_COUNT"]) {
                rate = ((1 - data["TOTAL_SUBMIT_STEP_SYS_FAILED_COUNT"] / data["TOTAL_TRANS_COUNT"]) * 100).toFixed(2);
            } else {
                rate = 100;
            }
            main.ctrl.setHandling(data["TOTAL_TRANS_COUNT"]);
            main.ctrl.setDuration(parseFloat((data["TOTAL_BUSI_USED_TIME"] / 1000000).toFixed(2)));
            main.ctrl.setRate(rate);
            // main.ctrl.setHandling()
        },
        setHandling: function(value) {
            $("#processHandling").find(".value").html(value);
            $(configs.box.handlingRadialGauge).data("kendoRadialGauge").value(value);
        },
        setDuration: function(value) {
            $("#processDuration").find(".value").html(value + "s");
            $(configs.box.durationRadialGauge).data("kendoRadialGauge").value(value);
        },
        setRate: function(value) {
            $("#processRate").find(".value").html(value + "%");
            $(configs.box.rateRadialGauge).data("kendoRadialGauge").value(value);
        },
        getChartDataByBusiType: function(channel, time, busiName) {
            var params = {
                CHANNEL: channel,
                TIME_INTERVAL: time,
                BUSI_TYPE: busiName
            };
            main.model.getChartDataByBusiType(params);
            $tools.loading();
        },
        setChartDataByBusiType: function(data) {
            console.log(data);
            var handling = [];
            var rate = [];
            var duration = [];
            for (var i = 0, l = data.length; i < l; i++) {

                handling.push({
                    time: data[i]["time"],
                    total: data[i]["totalTransCount"],
                    success: data[i]["totalTransCount"] - data[i]["sysFailedCount"]
                });
                rate.push({
                    time: data[i]["time"],
                    rate: (data[i]["totalTransCount"] / data[i]["totalTransCount"] - data[i]["sysFailedCount"]) * 100 || 0

                });
                duration.push({
                    time: data[i]["time"],
                    duration: parseInt(data[i]["busiUsedTime"] / 1000) || data[i]["busiUsedTime"]
                });
            }
            console.log(handling);
            main.ctrl.setHandlingChar(handling);
            main.ctrl.setRateChar(rate);
            main.ctrl.setDurationChar(duration);
            $tools.closeLoading();
        },
        setHandlingChar: function(data) {
            $(configs.box.trendHandling).data("kendoChart").dataSource.data(data);
        },
        setRateChar: function(data) {
            $(configs.box.trendRate).data("kendoChart").dataSource.data(data);
        },
        setDurationChar: function(data) {
            console.log(data);
            $(configs.box.trendDuration).data("kendoChart").dataSource.data(data);
        },
        getBusiStep: function() {
            main.model.getBusiStep();
        },
        setBusiStep: function(data) {
            main.ctrl.setBusiStepChar(data);
            
        },
        setBusiStepChar: function() {
            var setpTop = '<div class="stepTop"></div>';
            var setp = '<div class="step{{index}} step" value=' + "'" + '{{data}}' + "'" + '>{{name}}</div>' +
                ' <div class="stop-magin{{index}} stop-magin" value=' + "'" + '{{data}}' + "'" + '></div>';
            var setp_html = "";
            var setps = [];
            for (var i = 0, l = data.length; i < l; i++) {
                setp_html = setp.replace(/{{name}}/g, data[i]["name"])
                    .replace(/{{index}}/g, i + 1)
                    .replace(/{{data}}/g, JSON.stringify(data[i]));
                setps.push(setp_html);
            }
            $("#busiStepChar").html(setpTop + setps.join(""));
            main.ctrl.listenerStep();
        },
        listenerStep: function() {
            $(".step").mouseover(this.showStep);
            $(".step").mouseout(this.hideStep);
            $(".stop-magin").mouseover(this.showStepMagin);
            $(".stop-magin").mouseout(this.hideStepMagin);
        },
        showStep: function() {
            var id = $(this).attr("value");
            var bg = $(this).css("background-color");
            var x = $(this).offset().left + $(this).width() + 100;
            var y = $(this).offset().top - 20;

            var data = $.parseJSON($(this).attr("value"));
            main.ctrl.showStepDatailsBox(bg, x, y, data);
        },
        hideStep: function() {
            $(configs.box.stepDatails).hide();
        },
        showStepDatailsBox: function(bg, x, y, data) {
            var data = data || {
                name: "",
                handling: 0,
                duration: 0,
                rate: 0
            };
            $(configs.box.stepDatails).find(".title").html("步骤：" + data.name);
            $(configs.box.stepDatails).find(".handling").html("业务量:" + data.handling);
            $(configs.box.stepDatails).find(".duration").html("步骤时长:" + data.duration + "s");
            $(configs.box.stepDatails).find(".rate").html("步骤成功率:" + data.rate + "%");
            $(configs.box.stepDatails).css({
                "background-color": bg,
                top: y,
                left: x
            });
            $(configs.box.stepDatails).show();
        },

        showStepMagin: function() {
            var id = $(this).attr("value");
            console.log($(this).offset().top);
            var bg = $(this).css("background-color");
            var x = $(this).offset().left + $(this).width() + 100;
            var y = $(this).offset().top - 20;

            var data = $.parseJSON($(this).attr("value"));
            main.ctrl.showStepMaginBox(bg, x, y, data);
        },
        hideStepMagin: function() {
            $(configs.box.stepDuration).hide();
        },
        showStepMaginBox: function(bg, x, y, data) {
            var data = data || {
                name: "",
                wait: 0,
            };
            $(configs.box.stepDuration).find(".title").html("步骤:" + data.name);
            $(configs.box.stepDuration).find(".wait").html("等待时间:" + data.wait + "s");
            $(configs.box.stepDuration).css({
                "background-color": bg,
                top: y,
                left: x
            });
            $(configs.box.stepDuration).show();
        }
    },
    model: {
        getArea: function() {
            main.ctrl.setArea(configs.area);
        },
        getChannel: function() {
            main.ctrl.setChannel(configs.channel);
        },
        getBusiName: function() {
            main.ctrl.setBusiName(configs.busiName);
        },
        getTime: function() {
            $tools.loadData(configs.url.getTime,
                null,
                main.ctrl.setTime, null, configs.Env.bpcMonitor);
        },
        getTopKPIsByBusiType: function(params) {
            $tools.loadData(configs.url.getTopKPIsByBusiType,
                params,
                main.ctrl.setTopKPIsByBusiType, null, configs.Env.bpcMonitor);
        },
        getChartDataByBusiType: function(params) {
            $tools.loadData(configs.url.getChartDataByBusiType,
                params,
                main.ctrl.setChartDataByBusiType, null, configs.Env.bpcMonitor);
        },
        getBusiStep: function() {
            main.ctrl.setBusiStep(configs.busiStep)
        }
    },
};