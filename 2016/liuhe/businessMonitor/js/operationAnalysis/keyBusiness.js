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
        name: "重置密码",
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
        busiStep: "name",
        busiHandling: "handling",
        duration: "duration",
        rate: "rate",
    },
    stepDatails_text: {
        busiStep: "业务步骤",
        busiHandling: "业务量",
        duration: "步骤时长(ms)",
        rate: "步骤成功率",
    },
    url: {
        getTime: "app_view_getTimeIntervals",
        getTopKPIsByBusiType: "app_view_getTopKPIsBySubBusiType",
        getChartDataByBusiType: "app_view_getChartDataBySubBusiType",
        app_view_getSubBusiTypes: "app_view_getSubBusiTypes",
        // getBusiStep : "app_view_getBusiStep",
        getBusiStep: 'app_view_getStepInfoByBusiType'
    },
    Env: {
        bpcMonitor: "bpcMonitor",
    },
    busiStep: [{
        name: "进入密码重置界面",
        handling: 0,
        duration: 0,
        rate: 00,
        wait: 0,
        retention: 0
    }, {
        name: "9选3校验后点击”下一步“按钮",
        handling: 0,
        duration: 0,
        rate: 0,
        wait: 0,
        retention: 0
    }, {
        name: "点击提交按钮",
        handling: 0,
        duration: 0,
        rate: 0,
        wait: 0,
        retention: 0
    }, {
        name: "信息确认界面点击确定后返回办理结果反馈",
        handling: 0,
        duration: 0,
        rate: 0,
        wait: 0,
        retention: 0
    }],
    radialGauge_value: [{
        handling: 1000,
        duration: 300,
        rate: 100
    }, {
        handling: 10000,
        duration: 300,
        rate: 100
    }, {
        handling: 100000,
        duration: 300,
        rate: 100
    }]
};
var main = {
    view: {
        init: function() {
            $tools.kendoComboBox(configs.box.area, "name", "value", []);
            $tools.kendoComboBox(configs.box.channel, "name", "value", []);
            $tools.kendoComboBox(configs.box.busiName, "subBusiTypeName", "_id", []);
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
        createHandlingRadialGauge: function(value) {
            var value = value || 5000;
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
        createDurationRadialGauge: function(value) {
            var value = value || 500;
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
        createRateRadialGauge: function(value) {
            var value = value || 100;
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
                    width: 80
                }, {
                    field: configs.stepDatails.duration,
                    title: configs.stepDatails_text.duration,
                    width: 120
                }, {
                    field: configs.stepDatails.rate,
                    title: configs.stepDatails_text.rate,
                    template: function(obj) {
                        console.log(obj);
                        return obj[configs.stepDatails.rate] + "%";
                    },
                    width: 100
                }]
            });
        },
        createCustomerRetentionRateChar: function() {
            $(configs.box.customerRetentionRateChar).kendoChart({
                chartArea: {
                    height: 180,
                },
                legend: {
                    position: "bottom",
                    visible: false
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
                    field: "retention",
                    name: "name",
                    border: {
                        width: 0
                    },
                    color: $tools.color[4]
                }],
                categoryAxis: {
                    field: "name",
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        template: function(obj) {
                            var value = obj.value
                            if (obj.value.length > 8) {
                                value = obj.value.substr(0, 8) + "..";
                            }
                            return value;
                        }
                    }
                },
                valueAxis: {
                    majorUnit: 20,
                    max: 100,
                    visible: true,
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        format: "{0}%"
                    },
                },
                tooltip: {
                    visible: true,
                    template: "<p>#= category # </p> #= value #%",
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
                    template: "#= series.name # : #= value #",
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
                    max: 100,
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
                    template: "#= series.name # : #= value #%",
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
                        format: "{0}s"
                    },
                    visible: true,
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name # : #= value #s",
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
            var params = {
                CHANNEL: parseInt(channel)
            }
            main.model.getBusiName(params);
        },
        setBusiName: function(data) {
            var kendoComboBox = $(configs.box.busiName).data("kendoComboBox");
            kendoComboBox.dataSource.data(data);
            if (data[0]) {
                kendoComboBox.value(data[0]["_id"]);
            }
            main.ctrl.getAllBusi();
        },
        listenerChannelChange: function() {
            $(configs.box.channel).change(this.getBusiName);
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
            console.log($(configs.box.busiName).val());
            if (!busiName) {
                return;
            }
            if (time === "") {
                return;
            }
            main.ctrl.getTopKPIsByBusiType(channel, time, busiName);
            main.ctrl.getChartDataByBusiType(channel, time, busiName);
            main.ctrl.getBusiStep(channel, time, busiName);
            main.ctrl.setRadialGaugeValue(time);
        },
        setRadialGaugeValue: function(time) {
            main.view.createHandlingRadialGauge(configs.radialGauge_value[time]["handling"]);
            main.view.createDurationRadialGauge(configs.radialGauge_value[time]["duration"]);
            main.view.createRateRadialGauge(configs.radialGauge_value[time]["rate"]);
        },
        getTime: function() {
            main.model.getTime();
        },
        setTime: function(data) {
            var kendoComboBox = $(configs.box.time).data("kendoComboBox");
            kendoComboBox.dataSource.data(data);
            if (data[1]) {
                kendoComboBox.value(data[1]["VALUE"]);
            }
            main.ctrl.getAllBusi();
        },

        getTopKPIsByBusiType: function(channel, time, busiName) {
            var params = {
                CHANNEL: channel,
                TIME_INTERVAL: time,
                SUB_BUSI_TYPE: busiName
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
            var duration = parseFloat((data["TOTAL_BUSI_USED_TIME"] / 1000 / data["TOTAL_TRANS_COUNT"])) || 0;
            main.ctrl.setHandling(data["TOTAL_TRANS_COUNT"]);
            main.ctrl.setDuration(duration.toFixed(2));
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
            console.log(busiName);
            var params = {
                CHANNEL: channel,
                TIME_INTERVAL: time,
                SUB_BUSI_TYPE: busiName
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
                var count = data[i]["totalTransCount"];
                var failedCount = data[i]["sysFailedCount"];
                var time = data[i]["time"];
                var _rate = parseFloat((1 - failedCount / count).toFixed(2)) * 100 || 0;
                var _duration = parseInt(data[i]["busiUsedTime"] / 1000) || 0;
                handling.push({
                    time: time,
                    total: count,
                    success: count - failedCount
                });
                rate.push({
                    time: time,
                    rate: _rate
                });
                duration.push({
                    time: time,
                    duration: _duration
                });
            }
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
        getBusiStep: function(channel, time, busiName) {
            var params = {
                CHANNEL: channel,
                TIME_INTERVAL: time,
                SUB_BUSI_TYPE: busiName
            }
            main.model.getBusiStep(params);
        },
        setBusiStep: function(data) {
            configs.busiStep = [];
            for (var i = 0, l = data.stepCount; i < l; i++) {
                var busiStep = {};
                busiStep["handling"] = data["stepTransCount" + i];
                busiStep["duration"] = parseInt(data["stepSysUsedTimes" + i] / Math.pow(10, 6)) || 0;
                busiStep["rate"] = parseFloat((data["stepTransCount" + i] - data["stepsSysFailed" + i]) / data["stepTransCount" + i] * 100) || 0;
                busiStep["wait"] = parseFloat(data["stepInterval" + i] / Math.pow(10, 6)/ data["stepTransCount" + i]) || 0;
                busiStep["name"] = data["stepNames"][i];
                busiStep["wait"] = busiStep["wait"].toFixed(2);
                if (i == 0) {
                    busiStep["retention"] = 100;
                } else {
                    busiStep["retention"] = parseInt(data["stepTransCount" + i] / data["stepTransCount" + (i - 1)] * 100) || 0;
                }
                configs.busiStep.push(busiStep);
            }
            main.ctrl.setBusiStepChar(configs.busiStep);
            main.ctrl.setBusiStepGrid(configs.busiStep);
            main.ctrl.customerRetention(configs.busiStep);
        },
        customerRetention: function(data) {
            $(configs.box.customerRetentionRateChar).data("kendoChart").dataSource.data(data);
        },
        setBusiStepGrid: function(data) {
            $(configs.box.stepDatailsGrid).data("kendoGrid").dataSource.data(data);
        },
        setBusiStepChar: function(data) {
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

            var busiStepCharHeight = $("#busiStepChar").height();
            var contentHeight = $(".content-right-step-left").height();
            var padding = contentHeight - busiStepCharHeight - 100;
            if (padding > 0) {
                $("#busiStepChar").css({
                    "padding-top": padding / 2
                })
            } else {
                $("#busiStepChar").css({
                    "padding-top": 0
                })
            }
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
            var x = $(this).offset().left + $(this).width() + 60;
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
            $(configs.box.stepDatails).find(".duration").html("步骤时长:" + data.duration + "ms");
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
        getBusiName: function(params) {
            $tools.loadData(configs.url.app_view_getSubBusiTypes,
                params,
                main.ctrl.setBusiName, null, configs.Env.bpcMonitor);
            // main.ctrl.setBusiName(configs.busiName);
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
        getBusiStep: function(params) {
            // main.ctrl.setBusiStep(configs.busiStep)
            $tools.loadData(configs.url.getBusiStep,
                params,
                main.ctrl.setBusiStep, null, configs.Env.bpcMonitor);
        }
    },
};