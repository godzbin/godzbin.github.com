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
    topChannel: [{
        name: "营业厅前台",
        channelId: 1,
        rate: 0,
        handling: 0,
        duration: 0,
        alarm: 0
    }, {
        name: "电渠",
        channelId: 2,
        rate: 0,
        handling: 0,
        duration: 0,
        alarm: 0
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
        INDEX: "INDEX",
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
        updateBusiConf: "app_view_updateMonitorBusiTypes",
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
            busiConfObj: {},
            init: function() {
                this.getChannel();
                this.listenerBusiConfAreaChange();
                this.listenerBusiConfChannelChange();
                this.listenerAddBusiConfClick();

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

                var busiConf = data["MONITORED"];
                var busiData = data["ALL"];
                var busiConfData = [];
                var index = 0;
                for (var i = 0, l = busiConf.length; i < l; i++) {
                    for (var j = 0, c_l = busiData.length; j < c_l; j++) {
                        if (busiConf[i] == busiData[j]["_id"]) {
                            busiConfData.push({
                                _ID: busiConf[i],
                                NAME: busiData[j]["busiName"]
                            });
                        }
                    }
                }
                var busiDataObj = {};
                for (var a = 0, b = busiData.length; a < b; a++) {
                    if (busiDataObj[busiData[a]["busiName"]]) {
                        busiDataObj[busiData[a]["busiName"]].push(busiData[a]["_id"]);
                    } else {
                        busiDataObj[busiData[a]["busiName"]] = [];
                        busiDataObj[busiData[a]["busiName"]].push(busiData[a]["_id"]);
                    }
                }

                var busiConfObj = {};
                for (var c = 0, d = busiConfData.length; c < d; c++) {
                    if (busiConfObj[busiConfData[c]["NAME"]]) {
                        busiConfObj[busiConfData[c]["NAME"]].push(busiConfData[c]["_ID"]);
                    } else {
                        busiConfObj[busiConfData[c]["NAME"]] = [];
                        busiConfObj[busiConfData[c]["NAME"]].push(busiConfData[c]["_ID"]);
                    }
                }
                main.ctrl.BusiConf.busiConfObj = busiConfObj;
                var busiConfs = [];
                main.ctrl.BusiConf.busiConf = [];
                for (t in busiConfObj) {
                    index++;
                    busiConfs.push({
                        INDEX: index,
                        NAME: t,
                        _ID: busiConfObj[t].join(",")
                    });
                    main.ctrl.BusiConf.busiConf.push(busiConfObj[t].join(","))
                }


                main.ctrl.BusiConf.setBusi(busiDataObj);

                var busiConfGrid = $(configs.box.busiConfGrid).data("kendoGrid");
                busiConfGrid.dataSource.data(busiConfs);
                main.ctrl.BusiConf.listenerRemoveBusiConfClick();
            },
            setBusi: function(data) {
                var busiData = [];
                for (i in data) {
                    busiData.push({
                        busiName: i,
                        _id: data[i].join(",")
                    })
                }
                if (busiData.length) {
                    var comboBox = $(configs.box.busiConfBusi).data("kendoComboBox");
                    comboBox.dataSource.data(busiData);
                    comboBox.value(busiData[0]["_id"]);
                }
            },
            addBusiConf: function() {
                var channel = $(configs.box.busiConfChannel).val();
                var busiId = $(configs.box.busiConfBusi).val();
                if (busiId && channel) {
                    main.ctrl.BusiConf.busiConf.push(busiId);
                    var busiConf = main.ctrl.BusiConf.busiConf
                    var params = {
                        CHANNEL: parseInt(channel),
                        BUSI_TYPES: busiConf.join(","),
                    }
                    main.model.updateBusiConf(params);
                }
            },
            updateBusiConfRetrun: function() {
                main.ctrl.BusiConf.getBusiConfList();
                main.ctrl.getAllBusiness();
            },
            removeConf: function() {

                if (!confirm("确定要删除吗？")) {
                    return;
                }
                var channel = $(configs.box.busiConfChannel).val();
                var busiName = $(this).attr("value");
                if (busiName && channel) {
                    var busiConfObj = main.ctrl.BusiConf.busiConfObj;
                    if (busiConfObj[busiName]) {
                        delete busiConfObj[busiName];
                    }
                    var busiConf = [];
                    for (i in busiConfObj) {
                        busiConf.push(busiConfObj[i].join(","))
                    }
                    var params = {
                        CHANNEL: parseInt(channel),
                        BUSI_TYPES: busiConf.join(","),
                    }
                    main.model.updateBusiConf(params);
                }
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
            if (!data) {
                return;
            }
            console.log("SignBusinessComparison");
            console.log(data);
            for (var i = 0, l = data.length; i < l; i++) {
                for (var j = 0, t_l = configs.topChannel.length; j < t_l; j++) {
                    if (data[i]["channel_id"] == configs.topChannel[j]["channelId"]) {
                        configs.topChannel[j]["sysFailCount"] = data[i]["sysFailCount"];
                        configs.topChannel[j]["rate"] = parseFloat((1 - data[i]["sysFailCount"] / data[i]["transCount"]) * 100) || 0;
                        configs.topChannel[j]["handling"] = data[i]["transCount"];
                        configs.topChannel[j]["duration"] = parseFloat(data[i]["lastStepSysUsedTime"] / data[i]["transCount"] / 1000) || 0;
                        configs.topChannel[j]["alarm"] = data[i]["alarmsCount"] || 0;
                        configs.topChannel[j]["lastStepSysUsedTime"] = data[i]["lastStepSysUsedTime"];
                    }
                }
            }
        },
        setBusinessComparison: function(data) {
            // ------------------------------------------------------
            main.ctrl.getSignBusinessComparison(data);
            var value1 = configs.topChannel[0];
            var value2 = configs.topChannel[1];
            var transCount = value1["handling"] + value2["handling"];
            var sysFailCount = value1["sysFailCount"] + value2["sysFailCount"];
            var lastStepSysUsedTime = value1["lastStepSysUsedTime"] + value2["lastStepSysUsedTime"];
            var transRate = parseFloat(((transCount - sysFailCount) / transCount) * 100) || 0;
            var transDuration = parseInt(lastStepSysUsedTime / transCount / 1000) || 0;

            main.ctrl.setBusinessComparisonRate(value1.rate, value2.rate, transRate);
            main.ctrl.setBusinessComparisonHandling(value1.handling, value2.handling);
            main.ctrl.setBusinessComparisonDuration(value1.duration, value2.duration, transDuration);
            main.ctrl.setBusinessComparisonAlarm(value1.alarm, value2.alarm);
        },
        setBusinessComparisonRate: function(businessHall, eleChannel, transRate) {
            var totalValue = transRate.toFixed(2);
            var titleValue = $(configs.box.businessComparisonRate).find(".value");
            var radialGauge = $(configs.box.rateRadialGauge).data("kendoRadialGauge");
            titleValue.html(totalValue + "%");
            radialGauge.value(totalValue);

            var dataSource = [{
                name: "营业厅",
                value: parseInt(businessHall),
                color: configs.charNodeBackground[0]
            }, {
                name: "电渠",
                value: parseInt(eleChannel),
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
        setBusinessComparisonDuration: function(businessHall, eleChannel, transDuration) {
            var totalValue = transDuration;


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
                COUNT: 300
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
                    d[configs.businessSurvey.rate] = parseInt((1 - da["sysFailCount"] / da["transCount"]) * 100) + "%";
                } else {
                    d[configs.businessSurvey.rate] = "100%";
                    d[configs.businessSurvey.duration] = 0;
                }

                myData.push(d);
            }
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
            var LAST_STEP_SYS_USED_TIME_DATA = data["LAST_STEP_SYS_USED_TIME_DATA"];

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
            };

            durationChar = main.ctrl.getDurationCharData(LAST_STEP_SYS_USED_TIME_DATA, BUSI_TYPES);
            console.log(durationChar);
            main.ctrl.setKeyBusinessHandlingChar(handlingChar);
            main.ctrl.setKeyBusinessDurationChar(durationChar, BUSI_TYPES);
            main.ctrl.setKeyBusinessAlarmChar(alarmChar);
            main.ctrl.setKeyBusinessRateChar(durationChar, BUSI_TYPES);
        },
        getDurationCharData: function(LAST_STEP_SYS_USED_TIME_DATA, BUSI_TYPES) {
            var durationChar = [];
            var l_s = LAST_STEP_SYS_USED_TIME_DATA;
            for (var z = 0, l_l = l_s.length; z < l_l; z++) {
                var TIME_DATA = {};
                for (var a = 0, l_d_l = l_s[z].length; a < l_d_l; a++) {
                    TIME_DATA["time"] = l_s[z][0]["time"];
                    for (var b = 0, bt_l = BUSI_TYPES.length; b < bt_l; b++) {
                        if (BUSI_TYPES[b]["_id"] == l_s[z][a]["_id"]) {
                            var td = parseInt(l_s[z][a]["lastStepSysUsedTime"] / 1000) || 0;
                            var busiName = "busiName" + BUSI_TYPES[b]["busiName"]
                            if (TIME_DATA[busiName]) {
                                TIME_DATA[busiName].push(td);
                            } else {
                                TIME_DATA[busiName] = [];
                                TIME_DATA[busiName].push(td);
                            }
                            var to = l_s[z][a]["totalTransCount"];
                            var fa = l_s[z][a]["sysFailedCount"];
                            var ra = parseInt((1 - fa / to) * 100) || 0;


                            var rateName = "rateName" + BUSI_TYPES[b]["busiName"];
                            if (TIME_DATA[rateName]) {
                                TIME_DATA[rateName].push(ra);
                            } else {
                                TIME_DATA[rateName] = [];
                                TIME_DATA[rateName].push(ra);
                            }
                        }
                    }
                }
                durationChar.push(TIME_DATA);
            }

            for (var x = 0, l = durationChar.length; x < l; x++) {
                for (i in durationChar[x]) {
                    if (typeof durationChar[x][i] == "object") {
                        durationChar[x][i] = main.ctrl.getArrayTotalAndAvg(durationChar[x][i]);
                    }
                }
            }
            console.log(durationChar);
            return durationChar;
        },
        getArrayTotalAndAvg: function(data) {
            var result = 0;
            for (var i = 0, l = data.length; i < l; i++) {
                result += data[i];
            }
            result = parseInt(result / l) || 0;
            return result;
        },
        setKeyBusinessHandlingChar: function(data) {
            var data_obj = {};
            for (var j = 0, l = data.length; j < l; j++) {
                if (data_obj[data[j]["name"]]) {
                    data_obj[data[j]["name"]] += data[j]["value"];
                } else {
                    data_obj[data[j]["name"]] = data[j]["value"];
                }
            }
            var chartData = [];
            for (i in data_obj) {
                chartData.push({
                    name: i,
                    value: data_obj[i]
                })
            }
            $(configs.box.keyBusinessHandlingChar).data("kendoChart").dataSource.data(chartData);
        },
        setKeyBusinessDurationChar: function(durationChar, BUSI_TYPES) {
            var duration = $(configs.box.keyBusinessDurationChar).data("kendoChart");
            var series = [];
            var result = 0;
            var data_obj = {};
            for (var i = 0, l = BUSI_TYPES.length; i < l; i++) {
                if (data_obj[BUSI_TYPES[i]["busiName"]]) {
                    data_obj[BUSI_TYPES[i]["busiName"]]++;
                } else {
                    data_obj[BUSI_TYPES[i]["busiName"]] = 1
                }
            }

            var n = 0;
            for (j in data_obj) {
                var color = "";
                if ($tools.color[n]) {
                    color = $tools.color[n];
                    n++;
                }
                series.push({
                    name: j,
                    field: "busiName" + j,
                    color: color
                });
            }
            duration.setOptions({
                series: series
            });
            duration.dataSource.data(durationChar);
        },
        setKeyBusinessAlarmChar: function(data) {
            console.log(data);
            var data_obj = {};
            for (var j = 0, l = data.length; j < l; j++) {
                if (data_obj[data[j]["category"]]) {
                    data_obj[data[j]["category"]] += data[j]["value"];
                } else {
                    data_obj[data[j]["category"]] = data[j]["value"];
                }

            }
            var chartData = [];
            var n = 0;
            for (i in data_obj) {
                var color = "";
                if ($tools.color[n]) {
                    color = $tools.color[n];
                    n++;
                }
                chartData.push({
                    category: i,
                    value: data_obj[i],
                    color: color
                })
            }
            $(configs.box.keyBusinessAlarmChar).data("kendoChart").dataSource.data(chartData);
        },
        setKeyBusinessRateChar: function(rateChar, BUSI_TYPES) {
            var rate = $(configs.box.keyBusinessRateChar).data("kendoChart");
            var series = [];
            var result = 0;
            var data_obj = {};
            console.log(series);
            for (var i = 0, l = BUSI_TYPES.length; i < l; i++) {
                if (data_obj[BUSI_TYPES[i]["busiName"]]) {
                    data_obj[BUSI_TYPES[i]["busiName"]]++;
                } else {
                    data_obj[BUSI_TYPES[i]["busiName"]] = 1
                }
            }
            var n = 0;
            for (j in data_obj) {
                var color = "";
                if ($tools.color[n]) {
                    color = $tools.color[n];
                    n++;
                }
                series.push({
                    name: j,
                    field: "rateName" + j,
                    color: color
                });
            }
            rate.setOptions({
                series: series
            });
            console.log(series);
            rate.dataSource.data(rateChar);
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
        },
        updateBusiConf: function(params) {
            $tools.loadData(configs.url.updateBusiConf,
                params,
                main.ctrl.BusiConf.updateBusiConfRetrun, null, configs.Env.bpcMonitor);
        }
    },
    view: {
        init: function() {
            $tools.kendoComboBox(configs.box.area, "text", "_id", []);
            $tools.kendoComboBox(configs.box.time, "NAME", "VALUE", []);
            $tools.kendoComboBox(configs.box.busiConfArea, "text", "_id", []);
            $tools.kendoComboBox(configs.box.busiConfChannel, "text", "_id", []);
            $tools.kendoComboBox(configs.box.busiConfBusi, "busiName", "_id", []);

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
                        field: configs.busiConf.INDEX,
                        title: configs.busiConf_text.INDEX,
                        width: 100,
                    }, {
                        field: configs.busiConf.NAME,
                        title: configs.busiConf_text.NAME,
                    }, {
                        field: configs.busiConf.ID,
                        title: configs.busiConf_text.OP,
                        template: "<button class='removeBusiConf btn' value=#:" + configs.busiConf.NAME + "#>" + "删除</button>",
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
                var minorUnit = parseInt(value / 4);
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
                var value = 12;
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
                            position: "outside",
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
                        },
                        max: 100
                    },
                    tooltip: {
                        visible: true,
                        format: "{0}%",
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
                        width: 100
                    }, {
                        field: configs.businessSurvey.duration,
                        title: configs.businessSurvey_text.duration,
                        width: 120
                    }, {
                        field: configs.businessSurvey.rate,
                        title: configs.businessSurvey_text.rate,
                        width: 100
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
                        height: 200,
                    },
                    categoryAxis: {
                        field: "name",
                        majorGridLines: {
                            visible: false
                        },
                    },
                    valueAxis: {
                        // majorUnit: 100,
                        // visible: false,
                        majorGridLines: {
                            visible: false
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: " #= category #:#= value #",
                        color: "#fff"
                    }
                });
            },
            createKeyBusinessDurationChar: function() {
                $(configs.box.keyBusinessDurationChar).kendoChart({
                    chartArea: {
                        height: 200
                    },
                    legend: {
                        position: "bottom",
                    },
                    seriesDefaults: {
                        type: "line",
                        style: "smooth",
                        markers: {
                            visible: false
                        }
                    },
                    valueAxis: {
                        labels: {
                            format: "{0}ms"
                        },

                    },
                    categoryAxis: {
                        field: "time",
                        majorGridLines: {
                            visible: false
                        },
                        labels: {
                            rotation: "auto",

                            template: function(obj) {
                                return obj.value.split(" ")[1].substr(0, 5);
                            }
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: "<p> #= category # </p> #= series.name #: #= value #ms",
                        color: "#fff"
                    }
                });
            },
            createKeyBusinessAlarmChar: function() {
                $(configs.box.keyBusinessAlarmChar).kendoChart({
                    legend: {
                        position: "right",
                    },
                    chartArea: {
                        height: 200
                    },
                    seriesDefaults: {
                        labels: {
                            template: "#= category # - #= value#",
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
            createKeyBusinessRateChar: function() {
                $(configs.box.keyBusinessRateChar).kendoChart({
                    chartArea: {
                        height: 200
                    },
                    legend: {
                        position: "bottom",
                    },
                    seriesDefaults: {
                        type: "line",
                        style: "smooth",
                        markers: {
                            visible: false
                        }
                    },
                    valueAxis: {
                        // majorUnit: 2,
                        labels: {
                            format: "{0}%"
                        },
                        max: 100,
                        // min: 80,
                        // majorGridLines: {
                        //     visible: false
                        // },
                    },
                    categoryAxis: {
                        field: "time",
                        majorGridLines: {
                            visible: false
                        },
                        majorTicks: {
                            visible: false
                        },
                        labels: {
                            rotation: "auto",
                            template: function(obj) {
                                return obj.value.split(" ")[1].substr(0, 5);
                            }
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: "<p> #= category # </p> #= series.name #: #= value #%",
                        color: "#fff"
                    }
                });
            },
        }
    },

};