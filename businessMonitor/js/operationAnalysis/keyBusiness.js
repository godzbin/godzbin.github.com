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
    }
};
var main = {
    view: {
        init: function() {
            $tools.kendoComboBox(configs.box.area, "text", "_id", []);
            $tools.kendoComboBox(configs.box.channel, "text", "_id", []);
            $tools.kendoComboBox(configs.box.busiName, "text", "_id", []);
            $tools.kendoComboBox(configs.box.time, "text", "_id", []);
            this.createHandlingRadialGauge();
            this.createDurationRadialGauge();
            this.createRateRadialGauge();
            this.createStepDatailsGrid();
            this.createCustomerRetentionRateChar();
            this.createBusiStepChar();
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
            var value = 10000;
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
            var value = 5000;
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
        createBusiStepChar: function() {
            // $(configs.box.busiStepChar).kendoChart({
            //     dataSource: [{
            //         category: "选择产品",
            //         value: 800,
            //         color: configs.rangesColor[0],
            //     }, {
            //         category: "身份确认",
            //         value: 500,
            //         color: configs.rangesColor[1],
            //     }, {
            //         category: "经费",
            //         value: 300,
            //         color: configs.rangesColor[2],
            //     }, {
            //         category: "提交",
            //         value: 120,
            //         color: configs.rangesColor[3],
            //     }],
            //     chartArea: {
            //         height: 400,
            //         width: 300,
            //     },
            //     legend: {
            //         position: "bottom",
            //         visible: false
            //     },
            //     seriesDefaults: {
            //         labels: {
            //             visible: true,
            //             background: "transparent",
            //             color: "white",
            //             format: "{1}"
            //         },
            //         dynamicSlope: true,
            //         dynamicHeight: false,
            //     },
            //     series: [{
            //         type: "funnel",
            //         field: "value",
            //         name: "category",
            //     }],
            //     tooltip: {
            //         visible: true,
            //         format: "{0}",
            //         color: "#fff"
            //     }
            // });
        },
        createTrendHandling: function() {
            $(configs.box.trendHandling).kendoChart({
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
        createTrendRate: function() {
            $(configs.box.trendRate).kendoChart({
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
        createTrendDuration: function() {
            $(configs.box.trendDuration).kendoChart({
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
        }
    },
    ctrl: {
        init: function() {
            main.view.init();
        }
    }
};