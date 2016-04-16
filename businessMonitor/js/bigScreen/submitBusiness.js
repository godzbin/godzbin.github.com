$(function() {
    kendo.culture("zh-CN");
    $tools.getNav("../nav/header.html", ".header-nav-main", nav.setHeaderNav);
    $tools.getNav("../nav/bigScreen.html", ".content-left", nav.setLeftNav);
    main.ctrl.init();
});
var nav = {
    setHeaderNav: function() {
        $(".header-nav-bg1").addClass("action");
    },
    setLeftNav: function() {
        $("#serviceStatus").collapse("show");
        $(".content-left-nav1-open").addClass("action");
    },
};
var configs = {
    area: [{
        text: "广州市",
        _id: 0
    }],
    time: [{
        text: "近5分钟",
        _id: 0
    }, {
        text: "近一个小时",
        _id: 1
    }, {
        text: "近一天",
        _id: 2
    }],
    channel: [{
        text: "前台",
        _id: 1
    }, {
        text: "电渠",
        _id: 2
    }],
    box: {
        area: "#area",
        time: "#time",
        configure: "#configure",

        businessComparisonHandling: "#businessComparisonHandling",
        businessComparisonRate: "#businessComparisonRate",
        businessComparisonDuration: "#businessComparisonDuration",
        businessComparisonAlarm: "#businessComparisonAlarm",

        handlingRadialGauge: "#handlingRadialGauge",
        rateRadialGauge: "#rateRadialGauge",
        durationRadialGauge: "#durationRadialGauge",
        alarmRadialGauge: "#alarmRadialGauge",

        handlingChar: "#handlingChar",
        rateChar: "#rateChar",
        durationChar: "#durationChar",
        alarmChar: "#alarmChar",

        businessSurvey: "#businessSurvey",
        businessAlame: "#businessAlame",

        keyBusinessHandlingChar: "#keyBusinessHandlingChar",
        keyBusinessDurationChar: "#keyBusinessDurationChar",
        keyBusinessAlarmChar: "#keyBusinessAlarmChar",
        keyBusinessRateChar: "#keyBusinessRateChar",

        businessChannelTab: ".businessChannelTab",

        // modal
        busiConfWin: "#busiConfWin",
        busiConfArea: "#busiConfArea",
        busiConfChannel: "#busiConfChannel",
        busiConfBusi: "#busiConfBusi",
        busiConfGrid: "#busiConfGrid",
        addBusiConf: ".addBusiConf",
        removeBusiConf: ".removeBusiConf",
    },
    businessSurvey: {
        name: "name",
        handling: "handling",
        duration: "duration",
        rate: "rate"
    },
    businessSurvey_text: {
        name: "业务名称",
        handling: "提交量",
        duration: "提交时长(ms)",
        rate: "提交成功率"
    },
    businessAlame: {
        name: "name",
        msg: "msg",
        alarmTime: "alarmTime",
        duration: "duration",
        status: "status"
    },
    businessAlame_text: {
        name: "业务名称",
        msg: "内容",
        alarmTime: "首次告警时间",
        duration: "告警持续时间",
        status: "状态"
    },
    busiConf_text: {
        INDEX: "序号",
        NAME: "业务名称",
        OP: "操作"
    },
    busiConf: {
        ID: "_ID",
        NAME: "NAME",
    },
    boxBackground: "#fff",
    charNodeBackground: ["#30BCFF", "#6E797F"],
    rangesColor: ["#5EEF5A", "#00A3F4", "#FFB522", "#FF3131"],
    url: {
        getTime: "app_view_getTimeIntervals",
        getBusinessComparison: "app_view_getTopKPIsOfAll",
        getBusinessChannelSurveyList: "app_view_listAggrOfBusiType",
        getBusinessChannelAlarmList: "app_view_listAlarmsOfBusiType",
        getKeyBusiness: "app_view_getChartData",
        getBusiConfList: "app_view_getMonitorBusiTypes",
        // getBusi: "getBusi"
    },
    Env: {
        bpcMonitor: "bpcMonitor",
    }
};
var main = {

    ctrl: {
        businessChannel: 1,
        init: function() {
            main.view.init();
            this.BusiConf.init();
            this.getTime();
            this.getArea();
            this.listenerTimeChange();
            this.listenerAreaChange();
            this.listenerConfigureClick();
            this.listenerBusinessChannelClick();
        },
        BusiConf: {
            busiConf: [],
            init: function() {
                // this.getChannel();
                this.listenerBusiConfAreaChange();
                this.listenerBusiConfChannelChange();
            },
            openBusiConfWin: function() {
                $(configs.box.busiConfWin).modal("show");
            },
            setArea: function(data) {
                var comboBox = $(configs.box.busiConfArea).data("kendoComboBox");
                comboBox.dataSource.data(data);
                comboBox.value(data[0]["_id"]);
                this.getBusiAndConfList();
            },
            getChannel: function() {
                main.model.getChannel();
            },
            setChannel: function(data) {
                var comboBox = $(configs.box.busiConfChannel).data("kendoComboBox");
                comboBox.dataSource.data(data);
                comboBox.value(data[0]["_id"]);
                this.getBusiAndConfList();
            },
            getBusiAndConfList: function() {
                main.ctrl.BusiConf.getBusiConfList();
            },

            listenerBusiConfAreaChange: function() {
                $(configs.box.busiConfArea).change(this.getBusiAndConfList);
            },
            listenerBusiConfChannelChange: function() {
                $(configs.box.busiConfChannel).change(this.getBusiAndConfList);
            },
            listenerAddBusiConfClick: function() {
                $(configs.box.addBusiConf).click(this.addBusiConf);
            },
            listenerRemoveBusiConfClick: function() {
                $(configs.box.removeBusiConf).click(this.removeConf);
            },
            getBusiConfList: function() {
                var area = $(configs.box.busiConfArea).val();
                var channel = parseInt($(configs.box.busiConfChannel).val());
                if (area && channel) {
                    var params = {
                        // area: area,
                        CHANNEL: channel,
                    };
                    main.model.getBusiConfList(params);
                }
            },
            setBusiConfList: function(data) {
                main.ctrl.BusiConf.busiConf = data["MONITORED"];
                var busiData = data["ALL"];
                var busiConfData = [];
                for (var i = 0, l = busiData.length; i < l; i++) {
                    for (var j = 0, c_l = busiConf.length; j < c_l; j++) {
                        if (busiConf[j] == busiData[i]["value"]) {
                            busiConfData.push({
                                _ID: busiConf[j],
                                NAME: busiData[i]["_value"]
                            });
                        }
                    }
                }
                main.ctrl.BusiConf.setBusi(busiData);

                var busiConfGrid = $(configs.box.busiConfGrid).data("kendoGrid");
                busiConfGrid.dataSource.data(data);
            },
            setBusi: function(data) {
                if (data.lenght) {
                    var comboBox = $(configs.box.busiConfBusi).data("kendoComboBox");
                    comboBox.dataSource.data(data);
                    comboBox.value(data[0]["_id"]);
                }
            },
            addBusiConf: function() {
                var channel = $(configs.box.busiConfChannel).val();
                var busiId = $(configs.box.busiConfBusi).val();
                if (busiId && channel) {
                    var busiConf = main.ctrl.BusiConf.busiConf.push(busiId);
                    var params = {
                        CHANNEL: parseInt(channel),
                        BUSI_TYPES: busiConf.join(","),
                    }
                    main.model.updateBusiConf(params);
                }
            },
            addBusiConfReturn: function() {
                main.ctrl.busiConf.getBusiConfList();
            },
            removeConf: function() {

                if (!confirm("确定要删除吗？")) {
                    return;
                }
                var channel = $(configs.box.busiConfChannel).val();
                var busiId = $(configs.box.busiConfBusi).val();
                if (busiId && channel) {

                    var busiConf = main.ctrl.BusiConf.busiConf;
                    for (var i = 0, l = busiConf.length; i < l; i++) {
                        if (busiConf[i] == parseInt(busiId)) {
                            busiConf.splice(i, 1)
                        }
                    }
                    var params = {
                        CHANNEL: parseInt(channel),
                        BUSI_TYPES: busiConf.join(","),
                    }
                    main.model.updateBusiConf(params);
                }
            },
            removeConfReturn: function() {
                main.ctrl.busiConf.getBusiConfList();
            }
        },
        getTime: function() {
            main.model.getTime();
        },
        setTime: function(data) {
            var comboBox = $(configs.box.time).data("kendoComboBox");
            comboBox.dataSource.data(data);
            comboBox.value(data[0]["VALUE"]);
            main.ctrl.getAllBusiness();
        },
        getArea: function() {
            main.model.getArea();
        },
        setArea: function(data) {
            var comboBox = $(configs.box.area).data("kendoComboBox");
            comboBox.dataSource.data(data);
            comboBox.value(data[0]["_id"]);
            main.ctrl.getAllBusiness();
            main.ctrl.BusiConf.setArea(data);
        },
        listenerTimeChange: function() {
            $(configs.box.time).change(this.getAllBusiness);
        },
        listenerAreaChange: function() {
            $(configs.box.area).change(this.getAllBusiness);
        },
        listenerConfigureClick: function() {
            $(configs.box.configure).click(this.BusiConf.openBusiConfWin);
        },
        listenerBusinessChannelClick: function() {
            $(configs.box.businessChannelTab).click(function() {
                $(configs.box.businessChannelTab).removeClass("action");
                $(this).addClass("action");
                main.ctrl.businessChannel = parseInt($(this).attr("value"));
                var time = $(configs.box.time).data("kendoComboBox").value();
                var area = $(configs.box.area).data("kendoComboBox").value();
                if (time && area) {
                    main.ctrl.getBusinessChannelList(parseInt(area), parseInt(time));
                    main.ctrl.getKeyBusiness(parseInt(area), parseInt(time));
                }
            });
        },
        getAllBusiness: function() {
            var time = $(configs.box.time).data("kendoComboBox").value();
            var area = $(configs.box.area).data("kendoComboBox").value();
            if (time && area) {
                main.ctrl.getBusinessComparison(parseInt(area), parseInt(time));
                main.ctrl.getBusinessChannelList(parseInt(area), parseInt(time));
                main.ctrl.getKeyBusiness(parseInt(area), parseInt(time));
            }
        },
        getBusinessComparison: function(area, time) {
            var params = {
                TIME_INTERVAL: parseInt(time),
            }
            main.model.getBusinessComparison(params);
        },
        getSignBusinessComparison: function(data) {
            var signData = {};
            signData.rate = (1 - data["alarmsCount"] / data["transCount"]) * 100;
            signData.handling = data["transCount"];
            signData.duration = data["lastStepSysUsedTime"] / data["transCount"] / 1000;
            signData.alarm = data["alarmsCount"];
            return signData;
        },
        setBusinessComparison: function(data) {
            var value1 = main.ctrl.getSignBusinessComparison(data[0]);
            var value2 = main.ctrl.getSignBusinessComparison(data[1]);
            console.log(value1);
            console.log(value2);
            main.ctrl.setBusinessComparisonRate(value1.rate, value2.rate);
            main.ctrl.setBusinessComparisonHandling(value1.handling, value2.handling);
            main.ctrl.setBusinessComparisonDuration(value1.duration, value2.duration);
            main.ctrl.setBusinessComparisonAlarm(value1.alarm, value2.alarm);
        },
        setBusinessComparisonRate: function(businessHall, eleChannel) {
            var totalValue = (businessHall + eleChannel) / 2;
            var titleValue = $(configs.box.businessComparisonRate).find(".value");
            var radialGauge = $(configs.box.rateRadialGauge).data("kendoRadialGauge");
            titleValue.html(totalValue + "%");
            radialGauge.value(totalValue);

            var dataSource = [{
                name: "营业厅",
                value: businessHall,
                color: configs.charNodeBackground[0]
            }, {
                name: "电渠",
                value: eleChannel,
                color: configs.charNodeBackground[1]
            }];
            var char = $(configs.box.rateChar).data("kendoChart");
            char.dataSource.data(dataSource);
        },
        setBusinessComparisonHandling: function(businessHall, eleChannel) {
            var totalValue = businessHall + eleChannel;
            var titleValue = $(configs.box.businessComparisonHandling).find(".value");
            var radialGauge = $(configs.box.handlingRadialGauge).data("kendoRadialGauge");
            titleValue.html(totalValue);
            radialGauge.value(totalValue);

            var dataSource = [{
                category: "营业厅",
                value: businessHall,
                color: configs.charNodeBackground[0]
            }, {
                category: "电渠",
                value: eleChannel,
                color: configs.charNodeBackground[1]
            }];
            var char = $(configs.box.handlingChar).data("kendoChart");
            char.dataSource.data(dataSource);
        },
        setBusinessComparisonDuration: function(businessHall, eleChannel) {
            var totalValue = parseInt((businessHall + eleChannel) / 2);


            var titleValue = $(configs.box.businessComparisonDuration).find(".value");
            var radialGauge = $(configs.box.durationRadialGauge).data("kendoRadialGauge");
            titleValue.html(totalValue + "ms");
            radialGauge.value(totalValue);

            var dataSource = [{
                name: "营业厅",
                value: businessHall,
                color: configs.charNodeBackground[0]
            }, {
                name: "电渠",
                value: eleChannel,
                color: configs.charNodeBackground[1]
            }];
            var char = $(configs.box.durationChar).data("kendoChart");
            char.dataSource.data(dataSource);
        },
        setBusinessComparisonAlarm: function(businessHall, eleChannel) {
            var totalValue = businessHall + eleChannel;
            var titleValue = $(configs.box.businessComparisonAlarm).find(".value");
            var radialGauge = $(configs.box.alarmRadialGauge).data("kendoRadialGauge");
            titleValue.html(totalValue);
            radialGauge.value(totalValue);

            var dataSource = [{
                category: "营业厅",
                value: businessHall,
                color: configs.charNodeBackground[0]
            }, {
                category: "电渠",
                value: eleChannel,
                color: configs.charNodeBackground[1]
            }];
            var char = $(configs.box.alarmChar).data("kendoChart");
            char.dataSource.data(dataSource);
        },
        getBusinessChannelList: function(area, time) {
            main.ctrl.getBusinessChannelSurveyList(area, time);
            main.ctrl.getBusinessChannelAlarmList(area, time);
        },
        getBusinessChannelSurveyList: function(area, time) {
            var params = {
                // area: area,
                TIME_INTERVAL: time,
                CHANNEL: main.ctrl.businessChannel,
                START: 0,
                COUNT: 100,
            }
            main.model.getBusinessChannelSurveyList(params);
            $tools.loading();
        },
        getBusinessChannelAlarmList: function(area, time) {
            var params = {
                // area: area,
                TIME_INTERVAL: time,
                CHANNEL: main.ctrl.businessChannel,
                START: 0,
                COUNT: 100
            }
            main.model.getBusinessChannelAlarmList(params);
            $tools.loading();
        },
        setBusinessChannelSurveyList: function(data) {
            var myData = [];
            for (var i = 0, l = data["DATA_LIST"].length; i < l; i++) {
                var d = {};
                var da = data["DATA_LIST"][i];
                d[configs.businessSurvey.name] = da["busiName"];
                d[configs.businessSurvey.handling] = da["transCount"];
                if (da["transCount"]) {
                    d[configs.businessSurvey.duration] = parseInt(da["lastStepSysUsedTime"] / da["transCount"] / 1000);
                    d[configs.businessSurvey.rate] = ((1 - da["sysFailCount"] / da["transCount"]) * 100).toFixed(2) + "%";
                } else {
                    d[configs.businessSurvey.rate] = "100%";
                    d[configs.businessSurvey.duration] = 0;
                }

                myData.push(d);
            }
            console.log(myData);
            $(configs.box.businessSurvey).data("kendoGrid").dataSource.data(myData);
            $tools.closeLoading();
        },
        setBusinessChannelAlarmList: function(data) {
            var myData = [];
            for (var i = 0, l = data["DATA_LIST"].length; i < l; i++) {
                var d = {};
                var da = data["DATA_LIST"][i];
                d[configs.businessAlame.name] = da["busiTypeName"];
                d[configs.businessAlame.msg] = da["desc"];
                d[configs.businessAlame.alarmTime] = da["occurTime"];
                d[configs.businessAlame.duration] = parseInt(da["duration"] / 1000);
                if (da["closed"]) {
                    d[configs.businessAlame.status] = "已关闭";
                } else {
                    d[configs.businessAlame.status] = "未关闭";
                }
                myData.push(d);
            }
            console.log(myData);
            $(configs.box.businessAlame).data("kendoGrid").dataSource.data(myData);
            $tools.closeLoading();
        },
        getKeyBusiness: function(area, time) {
            var params = {
                // area: area,
                TIME_INTERVAL: time,
                CHANNEL: main.ctrl.businessChannel
            }
            main.model.getKeyBusiness(params);
            $tools.loading();
        },
        setKeyBusiness: function(data) {
            var BUSI_TYPES = data["BUSI_TYPES"];
            var ALARMS_COUNT_DATA = data["ALARMS_COUNT_DATA"];
            // var LAST_STEP_SYS_USED_TIME_DATA = data["LAST_STEP_SYS_USED_TIME_DATA"];
            var LAST_STEP_SYS_USED_TIME_DATA = [];

            var TRANS_COUNT_DATA = data["TRANS_COUNT_DATA"];

            var handlingChar = [];
            var durationChar = [];
            var alarmChar = [];
            var rateChar = [];
            for (var i = 0, l = BUSI_TYPES.length; i < l; i++) {
                for (var j = 0, a_l = ALARMS_COUNT_DATA.length; j < a_l; j++) {
                    if (BUSI_TYPES[i]["_id"] == ALARMS_COUNT_DATA[j]["_id"]) {
                        alarmChar.push({
                            id: BUSI_TYPES[i]["_id"],
                            value: ALARMS_COUNT_DATA[j]["value"],
                            category: BUSI_TYPES[i]["busiName"]
                        });
                        var alarm = ALARMS_COUNT_DATA[j]["value"]
                    }
                }
                for (var z = 0, l_l = LAST_STEP_SYS_USED_TIME_DATA.length; z < l_l; z++) {
                    if (BUSI_TYPES[i]["_id"] == LAST_STEP_SYS_USED_TIME_DATA[z]["_id"]) {
                        durationChar.push({
                            id: BUSI_TYPES[i]["_id"],
                            data: LAST_STEP_SYS_USED_TIME_DATA[z]["value"],
                            name: BUSI_TYPES[i]["busiName"]
                        });
                    }
                }
                for (var k = 0, t_l = TRANS_COUNT_DATA.length; k < t_l; k++) {
                    if (BUSI_TYPES[i]["_id"] == TRANS_COUNT_DATA[k]["_id"]) {
                        handlingChar.push({
                            id: BUSI_TYPES[i]["_id"],
                            value: TRANS_COUNT_DATA[k]["value"],
                            name: BUSI_TYPES[i]["busiName"]
                        });
                        var handling = TRANS_COUNT_DATA[k]["value"]
                    }
                }

                rateChar.push({
                    id: BUSI_TYPES[i]["_id"],
                    value: parseInt((1 - alarm / handling) * 100),
                    name: BUSI_TYPES[i]["busiName"]
                });
            }
            main.ctrl.setKeyBusinessHandlingChar(handlingChar);
            main.ctrl.setKeyBusinessDurationChar(durationChar);
            main.ctrl.setKeyBusinessAlarmChar(alarmChar);
            main.ctrl.setKeyBusinessRateChar(rateChar);
        },
        setKeyBusinessHandlingChar: function(data) {
            $(configs.box.keyBusinessHandlingChar).data("kendoChart").dataSource.data(data);
        },
        setKeyBusinessDurationChar: function(data) {
            $(configs.box.keyBusinessDurationChar).data("kendoChart").dataSource.data(data);
        },
        setKeyBusinessAlarmChar: function(data) {
            $(configs.box.keyBusinessAlarmChar).data("kendoChart").dataSource.data(data);
        },
        setKeyBusinessRateChar: function(data) {
            $(configs.box.keyBusinessRateChar).data("kendoChart").dataSource.data(data);
        }
    },

    model: {
        getArea: function() {
            main.ctrl.setArea(configs.area);
        },
        getChannel: function() {
            main.ctrl.BusiConf.setChannel(configs.channel);
        },
        getTime: function() {
            $tools.loadData(configs.url.getTime,
                null,
                main.ctrl.setTime, null, configs.Env.bpcMonitor);
        },
        getBusinessComparison: function(params) {
            $tools.loadData(configs.url.getBusinessComparison,
                params,
                main.ctrl.setBusinessComparison, null, configs.Env.bpcMonitor);
        },
        getBusinessChannelSurveyList: function(params) {
            $tools.loadData(configs.url.getBusinessChannelSurveyList,
                params,
                main.ctrl.setBusinessChannelSurveyList, null, configs.Env.bpcMonitor);
        },
        getBusinessChannelAlarmList: function(params) {
            $tools.loadData(configs.url.getBusinessChannelAlarmList,
                params,
                main.ctrl.setBusinessChannelAlarmList, null, configs.Env.bpcMonitor);
        },
        getKeyBusiness: function(params) {
            $tools.loadData(configs.url.getKeyBusiness,
                params,
                main.ctrl.setKeyBusiness, null, configs.Env.bpcMonitor);
        },
        getBusi: function(params) {
            $tools.loadData(configs.url.getBusi,
                params,
                main.ctrl.BusiConf.setBusi, null, configs.Env.bpcMonitor);
        },
        getBusiConfList: function(params) {
            $tools.loadData(configs.url.getBusiConfList,
                params,
                main.ctrl.BusiConf.setBusiConfList, null, configs.Env.bpcMonitor);
        }
    },
    view: {
        init: function() {
            $tools.kendoComboBox(configs.box.area, "text", "_id", []);
            $tools.kendoComboBox(configs.box.time, "NAME", "VALUE", []);
            $tools.kendoComboBox(configs.box.busiConfArea, "text", "_id", []);
            $tools.kendoComboBox(configs.box.busiConfChannel, "text", "_id", []);
            $tools.kendoComboBox(configs.box.busiConfBusi, "text", "_id", []);

            this.BusinessComparison.init();
            this.BusinessChannel.init();
            this.KeyBusiness.init();
            this.BusiConf.createBusiConfGrid();
        },
        BusiConf: {
            createBusiConfGrid: function() {
                $(configs.box.busiConfGrid).kendoGrid({
                    height: 400,
                    columns: [{
                        field: configs.busiConf.ID,
                        title: configs.busiConf_text.INDEX,
                        width: 100,
                    }, {
                        field: configs.busiConf.NAME,
                        title: configs.busiConf_text.NAME,
                    }, {
                        field: configs.busiConf.ID,
                        title: configs.busiConf_text.OP,
                        template: "<button class='removeBusiConf btn' value=#:" + configs.busiConf.ID + "#>" + "删除</button>",
                        width: 100,
                    }]
                });
            }
        },
        BusinessComparison: {
            init: function() {
                this.createHandlingRadialGauge();
                this.createRateRadialGauge();
                this.createDurationRadialGauge();
                this.createAlarmRadialGauge();
                this.createHandlingChar();
                this.createRateChar();
                this.createDurationChar();
                this.createAlarmChar();
                // this.setIdentification();
            },
            // setIdentification: function() {
            //     $(".identification").css("background", configs.charNodeBackground[0]);
            //     $(".identification2").css("background", configs.charNodeBackground[1]);
            // },
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
            createAlarmRadialGauge: function() {
                var value = 10;
                var ranges = this.getRanges(value);
                var minorUnit = parseFloat(value / 4);
                $(configs.box.alarmRadialGauge).kendoRadialGauge({
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
            createHandlingChar: function() {
                $(configs.box.handlingChar).kendoChart({
                    legend: {
                        position: "right",
                        // visible: true,
                    },
                    height: 150,
                    chartArea: {
                        background: configs.boxBackground
                    },
                    seriesDefaults: {
                        labels: {
                            template: "#= name # - #= kendo.format('{0:P}', percentage)#",
                            position: "outsideEnd",
                            visible: false,
                            background: "transparent"
                        }
                    },
                    series: [{
                        type: "pie",
                        field: "value",
                        name: "category",
                    }],
                    tooltip: {
                        visible: true,
                        template: "#= category # : #= value #",
                        color: "#fff"
                    }
                });
            },
            createRateChar: function() {
                $(configs.box.rateChar).kendoChart({
                    border: {
                        width: 0
                    },
                    height: 150,
                    legend: {
                        position: "bottom",
                        visible: false
                    },
                    seriesDefaults: {
                        type: "column"
                    },
                    series: [{
                        field: "value",
                        name: "name",
                        markers: {
                            type: "square"
                        },
                        border: {
                            width: 0
                        }
                    }],
                    chartArea: {
                        background: configs.boxBackground
                    },
                    categoryAxis: {
                        field: "name",
                        majorGridLines: {
                            visible: false
                        }
                    },
                    valueAxis: {
                        majorUnit: 100,
                        visible: false,
                        majorGridLines: {
                            visible: false
                        }
                    },
                    tooltip: {
                        visible: true,
                        format: "NO",
                        color: "#fff"
                    }
                });
            },
            createDurationChar: function() {
                $(configs.box.durationChar).kendoChart({
                    height: 150,
                    legend: {
                        position: "bottom",
                        visible: false
                    },
                    seriesDefaults: {
                        type: "column",
                    },
                    series: [{
                        field: "value",
                        name: "name",
                        markers: {
                            type: "square"
                        },
                        border: {
                            width: 0
                        }
                    }],
                    chartArea: {
                        background: configs.boxBackground
                    },
                    categoryAxis: {
                        field: "name",
                        majorGridLines: {
                            visible: false
                        }
                    },
                    valueAxis: {
                        majorUnit: 100,
                        visible: false,
                        majorGridLines: {
                            visible: false
                        }
                    },
                    tooltip: {
                        visible: true,
                        format: "NO",
                        color: "#fff"
                    }
                });
            },
            createAlarmChar: function() {
                $(configs.box.alarmChar).kendoChart({
                    legend: {
                        position: "right"
                    },
                    height: 150,
                    chartArea: {
                        background: configs.boxBackground
                    },
                    seriesDefaults: {
                        labels: {
                            template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                            position: "outsideEnd",
                            visible: false,
                            background: "transparent"
                        }
                    },
                    series: [{
                        type: "pie",
                        field: "value",
                        name: "category"
                    }],
                    tooltip: {
                        visible: true,
                        template: "#= category # : #= value #",
                        color: "#fff"
                    }
                });
            }
        },
        BusinessChannel: {
            init: function() {
                this.createBusinessSurvey();
                this.createBusinessAlame();
            },
            createBusinessSurvey: function() {
                $(configs.box.businessSurvey).kendoGrid({
                    height: 200,
                    columns: [{
                        field: configs.businessSurvey.name,
                        title: configs.businessSurvey_text.name,
                    }, {
                        field: configs.businessSurvey.handling,
                        title: configs.businessSurvey_text.handling,
                    }, {
                        field: configs.businessSurvey.duration,
                        title: configs.businessSurvey_text.duration,
                    }, {
                        field: configs.businessSurvey.rate,
                        title: configs.businessSurvey_text.rate,
                    }]
                });
            },
            createBusinessAlame: function() {
                $(configs.box.businessAlame).kendoGrid({
                    height: 200,
                    columns: [{
                        field: configs.businessAlame.name,
                        title: configs.businessAlame_text.name,
                    }, {
                        field: configs.businessAlame.msg,
                        title: configs.businessAlame_text.msg,
                    }, {
                        field: configs.businessAlame.alarmTime,
                        title: configs.businessAlame_text.alarmTime,
                    }, {
                        field: configs.businessAlame.duration,
                        title: configs.businessAlame_text.duration,
                    }, {
                        field: configs.businessAlame.status,
                        title: configs.businessAlame_text.status,
                        width: 80,
                    }]
                });
            }
        },
        KeyBusiness: {
            init: function() {
                this.createKeyBusinessHandlingChar();
                this.createKeyBusinessDurationChar();
                this.createKeyBusinessAlarmChar();
                this.createKeyBusinessRateChar();
            },
            createKeyBusinessHandlingChar: function() {
                $(configs.box.keyBusinessHandlingChar).kendoChart({
                    legend: {
                        position: "bottom",
                        visible: false
                    },
                    seriesDefaults: {
                        type: "column",
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
                    chartArea: {
                        height: 300,
                    },
                    categoryAxis: {
                        field: "name",
                        majorGridLines: {
                            visible: false
                        },
                    },
                    valueAxis: {
                        majorUnit: 100,
                        visible: false,
                        majorGridLines: {
                            visible: false
                        }
                    },
                    tooltip: {
                        visible: true,
                        format: "NO"
                    }
                });
            },
            createKeyBusinessDurationChar: function() {
                $(configs.box.keyBusinessDurationChar).kendoChart({
                    chartArea: {
                        height: 300
                    },
                    legend: {
                        position: "bottom",
                        // visible: false
                    },
                    seriesDefaults: {
                        type: "line",
                        style: "smooth"
                    },
                    series: [{
                        name: "India",
                        data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
                    }, {
                        name: "World",
                        data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, -2.245, 4.339, 2.727]
                    }, {
                        name: "Russian Federation",
                        data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, -7.832, 4.3, 4.3]
                    }, {
                        name: "Haiti",
                        data: [-0.253, 0.362, -3.519, 1.799, 2.252, 3.343, 0.843, 2.877, -5.416, 5.590]
                    }],
                    valueAxis: {
                        labels: {
                            format: "{0}%"
                        },
                        line: {
                            visible: false
                        },
                        axisCrossingValue: -10
                    },
                    categoryAxis: {
                        categories: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011],
                        majorGridLines: {
                            visible: false
                        },
                        labels: {
                            rotation: "auto"
                        }
                    },
                    tooltip: {
                        visible: true,
                        format: "{0}%",
                        template: "#= series.name #: #= value #"
                    }
                });
            },
            createKeyBusinessAlarmChar: function() {
                $(configs.box.keyBusinessAlarmChar).kendoChart({
                    legend: {
                        position: "bottom",
                    },
                    chartArea: {
                        height: 300
                    },
                    seriesDefaults: {
                        labels: {
                            template: "#= category # - #= value#",
                            position: "outsideEnd",
                            visible: true,
                            background: "transparent"
                        }
                    },
                    series: [{
                        type: "pie",
                        field: "value",
                        name: "category",
                    }],
                    tooltip: {
                        visible: true,
                        format: "{0}"
                    }
                });
            },
            createKeyBusinessRateChar: function() {
                $(configs.box.keyBusinessRateChar).kendoChart({
                    chartArea: {
                        height: 300,
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
                        color: configs.charNodeBackground[1]
                    }],
                    categoryAxis: {
                        field: "name",
                        majorGridLines: {
                            visible: false
                        }
                    },
                    valueAxis: {
                        majorUnit: 100,
                        visible: false,
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
        }
    },

};