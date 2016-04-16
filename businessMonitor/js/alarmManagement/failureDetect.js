/**
 * Created by GodzBin on 2016/2/17.
 */
$(function() {
    $tools.getNav("../nav/header.html", ".header-nav-main", $failureDetect.setHeaderNav);
    $tools.getNav("../nav/failureDetect.html", ".content-left", $failureDetect.setLeftNav);
    $failureDetect.init();
});
var alertList = {
    total: "totalCount",
    CONTENT_NAME: "CONTENT",
    CONTENT: {
        id: "busiTypeId",
        health: "healthDegree",
        name: "busiName",
        handle: "amount",
        alert: "alarmCount",
        time: "alarmStartTime",
        durationTime: "alarmDuration"
    },
    CONTENT_LIST: []
};
var alertServiceDetails = {
    total: "totalCount",
    CONTENT_NAME: "CONTENT",
    CONTENT: {
        id: "id",
        ruleId: "ruleId",
        name: "ruleDes",
        time: "alarmStartTime",
        durationTime: "alarmDuration",
        state: "status"
    },
    CONTENT_LIST: []
};
var singleBusinessInformation = {
    total: "totalCount",
    CONTENT_NAME: "CONTENT",
    CONTENT: {
        id: "id",
        name: "busiName",
        transactionChannel: "channel",
        number: "userNum",
        time: "executeTime",
        operatorNum: "operatorNum",
        durationTime: "duration",
        state: "status"
    },
    CONTENT_LIST: []
};
var commandWord = {
    total: "totalCount",
    CONTENT_NAME: "CONTENT",
    CONTENT: {
        name: "name",
        commandWord: "cmdName",
        clientIP: "dstIp",
        serverIP: "srcIp",
        responseTime: "resDuration",
        time: "time",
        returnCode: "returnCode",
        returnInfo: "message"
    },
    CONTENT_LIST: []
};
var $failureDetect = {};
$failureDetect.setHeaderNav = function() {
    $(".header-nav-bg2").addClass("action");
};
$failureDetect.setLeftNav = function() {
    $(".content-left-nav1").addClass("action");
};
$failureDetect.baseDefault = {
    getTableListUrl: "alarmPage",
    alertServiceDetailsUrl: "alarmDescPage",
    singleBusinessInformationUrl: "alarmBusiPage",
    commandWordUrl: "alarmCommPage",

    closeAlertUrl: "",
    closeAllAlertUrl: "updateAlarmPage",


    getBusinessChartUrl: "FO_chart_data",
    BT_channel: "BT_channel",
    FO_business: "FO_business",
    FO_time_period: "FO_time_period",
    FO_kpi: "FO_kpi",
    FO_chart_data: "FO_chart_data",
    FO_chart_data2: "FO_pie_data",
    //分页
    mainPageBox: ".content-right-table-main-page-box",
    alertServiceDetailsPageBox: ".alertServiceDetails-page-box",
    singleBusinessInformationPageBox: ".singleBusinessInformationTable-page-box",
    commandWordPageBox: ".commandWordTable-page-box",

    //警告图片
    well_pic: "well_pic.png",
    commonly_pic: "commonly_pic.png",
    serious_pic: "serious_pic.png",

    alertServiceDetailsId: "",
    singleBusinessInformationId: "",
    commandWordId: "",

    alertStateToOK: "已恢复",
    alertStateToWant: "等待恢复",
    closeAlertTxt: "你确定要关闭选中的警告？",
    closeAllAlertTxt: "你确定要关闭所有的警告？",
    closeOfSuccess: "关闭成功",
    closeOfFail: "关闭失败",
    closeIsNull: "未选择要关闭的内容"
};

$failureDetect.kendoComboBox = {
    busiChannel: "#busiChannel",
    businessTime: "#businessTime",
    businessName: "#businessName",
    businessIndex: "#businessLink"
};
$failureDetect.tableList = new $tools.pageDefault(0, 10, 0, 10, $failureDetect.baseDefault.mainPageBox);
$failureDetect.alertServiceDetails = new $tools.pageDefault(0, 10, 0, 10, $failureDetect.baseDefault.alertServiceDetailsPageBox);
$failureDetect.singleBusinessInformation = new $tools.pageDefault(0, 10, 0, 10, $failureDetect.baseDefault.singleBusinessInformationPageBox);
$failureDetect.commandWord = new $tools.pageDefault(0, 5, 0, 5, $failureDetect.baseDefault.commandWordPageBox);
//初始化
$failureDetect.init = function() {

    $("input").val("");

    kendo.culture("zh-CN");
    $failureDetect.initPage('#alertServiceDetails', $failureDetect.alertServiceDetails);
    $failureDetect.initPage('#singleBusinessInformation', $failureDetect.singleBusinessInformation);
    $failureDetect.initPage('#commandWord', $failureDetect.commandWord);

    $(".closeAlert").click($failureDetect.closeAlert);
    $(".closeAllAlert").click($failureDetect.closeAllAlert);
    $("#busiChannel").change($failureDetect.listenBusi);
    $(".business").change($failureDetect.getBusinessChart);
    $failureDetect.getBusiChannel();
    //$failureDetect.getBusinessName();
    $failureDetect.getBusinessTime();
    $failureDetect.getBusinessIndex();

    var minute = 1000 * 60;
    setInterval($failureDetect.getTableList, minute);
    //setInterval($failureDetect.getAlertServiceDetails, minute);
};

//关闭警告
$failureDetect.closeAlert = function() {
    var base = $failureDetect.baseDefault;
    var channel_id = $("#busiChannel").val();
    var cf = confirm(base.closeAlertTxt);
    if (cf) {
        var $mainAlert, selected = [];

        var params = {};
        params["closeAlarm"] = [];
        params["channel_id"] = parseInt(channel_id);
        var paramsName = alertList.CONTENT.id;
        if ($(this).hasClass("alertServiceDetailsClose")) {
            $mainAlert = $("input[name=alertDetails]:checked");

        } else {
            $mainAlert = $("input[name=mainAlert]:checked");
        }
        $mainAlert.each(function() {
            var value = $(this).attr("value");
            selected.push(value);
        });
        if (selected.length == 0) {
            alert(base.closeIsNull);
            return;
        }
        if ($(this).hasClass("alertServiceDetailsClose")) {
            var l = selected.length;
            var data_l = alertServiceDetails.CONTENT_LIST.length;
            var ruleId;
            var paramsList = {};
            for (var i = 0; i < l; i++) {
                for (var j = 0; j < data_l; j++) {
                    if (selected[i] == alertServiceDetails.CONTENT_LIST[j][alertServiceDetails.CONTENT.id]) {
                        ruleId = alertServiceDetails.CONTENT_LIST[j][alertServiceDetails.CONTENT.ruleId];
                    }
                }
                paramsList[alertList.CONTENT.id] = parseInt(base.alertServiceDetailsId);
                paramsList["ruleId"] = parseInt(ruleId);

                params["closeAlarm"].push(paramsList);
            }
        } else {
            params["closeAlarm"] = selected;
        }
        $tools.getData(base.closeAllAlertUrl, params, $failureDetect.closeResult);
    }
};
$failureDetect.closeAllAlert = function() {
    var channel_id = $("#busiChannel").val();
    if ($(this).hasClass("alertServiceDetailsClose")) {
        $("input[name=alertDetails]").prop("checked", "true");
    } else {
        $("input[name=mainAlert]").prop("checked", "true");
    }
    var base = $failureDetect.baseDefault;
    var params = {};
    var cf = confirm(base.closeAllAlertTxt);
    params["channel_id"] = parseInt(channel_id);
    if (cf) {
        if ($(this).hasClass("alertServiceDetailsClose")) {
            params["closeAlarm"] = [parseInt(base.alertServiceDetailsId)];
        } else {
            params["closeAlarm"] = "closeAll";
        }
        $tools.getData(base.closeAllAlertUrl, params, $failureDetect.closeResult);
    }
};
$failureDetect.closeResult = function(data) {
    var base = $failureDetect.baseDefault;
    if (data && data["STATE"] == 1) {
        alert(base.closeOfSuccess);
    } else {
        alert(base.closeOfFail);
    }
    $("#alertServiceDetails").css("display", "none");
    $("#alertServiceDetails").modal("hide");
    $failureDetect.getTableList();
};

//初始化分页
$failureDetect.initPage = function(box, obj) {
    $(box).on('hidden.bs.modal', function(e) {
        obj.total = 0;
        obj.start = 0;
    });
};


//警告列表
$failureDetect.getTableList = function(start) {
    var table = $failureDetect.tableList;
    var busiChannel = $($failureDetect.kendoComboBox.busiChannel).val();
    if (typeof start !== "undefined") {
        table.start = start;
    }
    if (busiChannel == "") {
        return;
    }
    var params = {
        startIndex: parseInt(table.start),
        pageStatus: parseInt(table.count),
        channel_id: parseInt(busiChannel)
    };
    $tools.loading();
    $tools.getData($failureDetect.baseDefault.getTableListUrl, params, $failureDetect.setTableList);
};
$failureDetect.setTableList = function(data) {
    if (data) {
        //分页
        var base = $failureDetect.tableList,
            contentVal = alertList.CONTENT;
        if (base.total != data[alertList.CONTENT_NAME][alertList.total]) {
            base.total = data[alertList.CONTENT_NAME][alertList.total];
            var baseDefault = {
                totalCount: base.total,
                showCount: base.showCount,
                limit: base.count,
                box: base.pageBox,
                callBack: $failureDetect.getTableList
            };
            $tools.callBackPagination(baseDefault);
        }
        var table_main_tr = $("#content-right-table-main-tr").html(),
            table_list = "",
            table_array = [],

            content = data[alertList.CONTENT_NAME]["resultData"],
            length = content.length;
        alertList.CONTENT_LIST = content;
        for (var i = 0; i < length; i++) {
            var health = "";
            if (content[i][contentVal.health] === "serious") {
                health = $failureDetect.baseDefault.serious_pic;
            } else if (content[i][contentVal.health] === "common") {
                health = $failureDetect.baseDefault.commonly_pic;
            } else if (content[i][contentVal.health] === "good") {
                health = $failureDetect.baseDefault.well_pic;
            }
            table_list = table_main_tr.replace(/{{id}}/g, content[i][contentVal.id])
                .replace(/{{health}}/g, health)
                .replace(/{{name}}/g, content[i][contentVal.name])
                .replace(/{{handle}}/g, content[i][contentVal.handle])
                .replace(/{{alert}}/g, content[i][contentVal.alert])
                .replace(/{{time}}/g, content[i][contentVal.time])
                .replace(/{{durationTime}}/g, parseFloat(content[i][contentVal.durationTime]).toFixed(2));
            table_array.push(table_list);
        }
        $(".content-right-table-main-tbody").html(table_array.join(""));
        $(".openAlertServiceDetails").click($failureDetect.openAlertServiceDetails);
    } else {
        $(".content-right-table-main-tbody").html("暂无数据");
    }
    $tools.closeLoading();
    if ($("#alertServiceDetails").css("display") !== "none") {
        $failureDetect.getAlertServiceDetails();
    }
};

//警告业务弹窗
$failureDetect.openAlertServiceDetails = function() {
    var alertServiceDetailsId = $(this).attr("values");
    if (!alertServiceDetailsId && alertServiceDetailsId == "") {
        return;
    }
    $failureDetect.baseDefault.alertServiceDetailsId = alertServiceDetailsId;
    $failureDetect.getAlertServiceDetails();
};
$failureDetect.getAlertServiceDetails = function(start) {
    var table = $failureDetect.alertServiceDetails;
    var busiChannel = $($failureDetect.kendoComboBox.busiChannel).val();
    if (typeof start !== "undefined") {
        table.start = start;
    }
    var params = {
        startIndex: table.start,
        pageStatus: table.count,
        channel_id: parseInt(busiChannel)
    };
    var alarmDesId = $failureDetect.baseDefault.alertServiceDetailsId;
    params["alarmDesId"] = parseInt(alarmDesId);
    console.log("getAlertServiceDetails start:" + table.start);
    $tools.getData($failureDetect.baseDefault.alertServiceDetailsUrl,
        params,
        $failureDetect.setAlertServiceDetails,
        alarmDesId);
};
$failureDetect.setAlertServiceDetails = function(data, alarmDesId) {
    if (data) {
        //分页
        $failureDetect.setAlertServiceDetailsTitle(alarmDesId);
        var base = $failureDetect.alertServiceDetails,
            contentVal = alertServiceDetails.CONTENT;
        if (base.total != data[alertServiceDetails.CONTENT_NAME][alertServiceDetails.total]) {
            base.total = data[alertServiceDetails.CONTENT_NAME][alertServiceDetails.total];
            var baseDefault = {
                totalCount: base.total,
                showCount: base.showCount,
                limit: base.count,
                box: base.pageBox,
                callBack: $failureDetect.getAlertServiceDetails
            };
            $tools.callBackPagination(baseDefault);
        }


        var table_main_tr = $("#alertServiceDetailsTable-tr").html(),
            table_list = "",
            table_array = [],
            content = data[alertServiceDetails.CONTENT_NAME]["resultData"],
            length = content.length;
        alertServiceDetails.CONTENT_LIST = content;
        for (var i = 0; i < length; i++) {
            var state = "";
            if (content[i][contentVal.state] == 1) {
                state = $failureDetect.baseDefault.alertStateToOK;
            } else if (content[i][contentVal.state] == 0) {
                state = $failureDetect.baseDefault.alertStateToWant;
            }

            table_list = table_main_tr.replace(/{{id}}/g, content[i][contentVal.id])
                .replace(/{{name}}/g, content[i][contentVal.name])
                .replace(/{{time}}/g, content[i][contentVal.time])
                .replace(/{{durationTime}}/g, parseFloat(content[i][contentVal.durationTime]).toFixed(2))
                .replace(/{{state}}/g, state);
            table_array.push(table_list);
        }
        $(".alertServiceDetailsTable-tbody").html(table_array.join(""));

        $(".openSingleBusinessInformation").click($failureDetect.openSingleBusinessInformation);
    } else {
        $(".content-right-table-main-tbody").html("暂无数据");
    }
    $("#alertServiceDetails").modal("show");
};
$failureDetect.setAlertServiceDetailsTitle = function(alarmDesId) {
    var titleBox = "#alertServiceDetailsTitle";
    var contentName = alertList.CONTENT;
    var content = alertList.CONTENT_LIST;
    var l = content.length;
    var title_name = "",
        title_content = "";
    for (var i = 0; i < l; i++) {
        if (content[i][contentName.id] == alarmDesId) {
            title_name = "<h4>" + content[i][contentName.name] + "</h4>";
            title_content += "<p>单日办理量:" + content[i][contentName.handle] + "，";
            title_content += "告警数:" + content[i][contentName.alert] + "，";
            title_content += "告警持续时长:" + parseFloat(content[i][contentName.durationTime]).toFixed(2) + "</p>";
        }
    }
    $(titleBox).html(title_name + title_content);
};
//单笔业务信息
$failureDetect.openSingleBusinessInformation = function() {
    var singleBusinessInformationId = $(this).attr("values");
    if (!singleBusinessInformationId && singleBusinessInformationId == "") {
        return;
    }
    var busiId = $failureDetect.baseDefault.alertServiceDetailsId;
    var contentName = alertList.CONTENT;
    var content = alertList.CONTENT_LIST;
    var l = content.length;
    // var busiType = "";
    // for (var i = 0; i < l; i++) {
    //     if (content[i][contentName.id] == id) {
    //         busiType = content[i][contentName.name];

    //     }
    // }
    var serviceContentName = alertServiceDetails.CONTENT;
    var serviceContent = alertServiceDetails.CONTENT_LIST;
    var serviceLenght = serviceContent.length;
    var startTime,alarmDuration;
    for (var j = 0; j < serviceLenght; j++) {
        if (serviceContent[j][serviceContentName.id] == singleBusinessInformationId) {
            startTime = serviceContent[j][serviceContentName.time];
            alarmDuration = serviceContent[j][serviceContentName.durationTime];
        }
    }
    var h = 60* 60 * 1000;
    startTime = startTime.replace("-","/");
    alarmDuration_s = parseInt(h*alarmDuration);
    endTime = $tools.dateZerofill(new Date(new Date(startTime).getTime() + alarmDuration_s));
    var channel = $("#busiChannel").val();
    var box = $failureDetect.kendoComboBox;
    $("#busiChannel").val("");
    $(box.businessName).val("");
    window.location.href = "alarmQuery.html?id="
     + singleBusinessInformationId + 
     "&channel_id=" + channel + 
     "&busiType=" + busiId +
      "&startTime=" + startTime
      +"&endTime=" + endTime;
    //$failureDetect.baseDefault.singleBusinessInformationId = singleBusinessInformationId;
    //$failureDetect.getSingleBusinessInformation();
};

/*获取业务渠道*/
$failureDetect.getBusiChannel = function() {
    var base = this.baseDefault;
    $tools.getData(base.BT_channel, null, $failureDetect.setBusiChannel, null, $tools.configs.Env);
};
$failureDetect.setBusiChannel = function(data) {
    if (data) {
        var box = $failureDetect.kendoComboBox;
        $tools.kendoComboBox(box.busiChannel, "text", "_id", data["CONTENT"]);
        $(box.busiChannel).data("kendoComboBox").value(data["CONTENT"][0]["_id"]);
        $failureDetect.getTableList();
        $failureDetect.getBusinessName();
    }
};

$failureDetect.listenBusi = function(e) {
    if ($(this).attr("id") === "busiChannel") {
        $failureDetect.getTableList();
        $failureDetect.getBusinessName();
    } else {
        $failureDetect.getBusinessChart(e);
    }
};
//获取业务名称列表
$failureDetect.getBusinessName = function() {
    var base = this.baseDefault;
    var busiChannel = $($failureDetect.kendoComboBox.busiChannel).val();
    var params = {
        channel_id: parseInt(busiChannel)
    };
    $tools.getData(base.FO_business, params, $failureDetect.setBusinessName, null, $tools.configs.Env);
};
$failureDetect.setBusinessName = function(data) {
    if (data) {
        var box = $failureDetect.kendoComboBox;
        if (data["CONTENT"].length) {
            $tools.kendoComboBox(box.businessName, "text", "_id", data["CONTENT"]);
            $(box.businessName).data("kendoComboBox").value(data["CONTENT"][0]["_id"]);
        } else {
            $tools.kendoComboBox(box.businessName, "text", "_id", []);
            $(box.businessName).data("kendoComboBox").value("");
        }

        $failureDetect.getBusinessChart();
    }
};
//获取时间列表
$failureDetect.getBusinessTime = function() {
    var base = this.baseDefault;
    $tools.getData(base.FO_time_period, null, $failureDetect.setBusinessTime, null, $tools.configs.Env);
    //var data = {
    //    businessTime: [
    //        {text: "近一个小时", value: 0},
    //        {text: "当天", value: 1}
    //    ]
    //};
    //$failureDetect.setBusinessTime(data);
};
$failureDetect.setBusinessTime = function(data) {
    if (data) {
        var box = $failureDetect.kendoComboBox;
        $tools.kendoComboBox(box.businessTime, "text", "_id", data["CONTENT"]);
        $failureDetect.getBusinessChart();
    }
};
//获取指标列表
$failureDetect.getBusinessIndex = function() {
    var base = this.baseDefault;
    $tools.getData(base.FO_kpi, null, $failureDetect.setBusinessIndex, null, $tools.configs.Env);
};
$failureDetect.setBusinessIndex = function(data) {
    if (data) {
        var box = $failureDetect.kendoComboBox;
        $tools.kendoComboBox(box.businessIndex, "text", "_id", data["CONTENT"]);
        $failureDetect.getBusinessChart();
    }
};
//图表
$failureDetect.getBusinessChart = function(e) {
    var box = $failureDetect.kendoComboBox;
    var $businessName = $(box.businessName).val();
    var $businessTime = $(box.businessTime).val();
    var $businessIndex = $(box.businessIndex).val();
    var busiChannel = $($failureDetect.kendoComboBox.busiChannel).val();
    if (busiChannel == "" || $businessName == "" || $businessTime == "" || $businessIndex == "") {
        return;
    }
    if (e) {
        console.log($(this));
        if ($(this).attr("id") == "businessName" || $(this).attr("id") == "businessTime") {
            if ($businessName !== "" && $businessTime !== "") {
                $failureDetect.getReturnChart($businessName, $businessTime);
            }
        }
    } else {
        if ($businessName !== "" && $businessTime !== "") {
            $failureDetect.getReturnChart($businessName, $businessTime);
        }
    }
    $failureDetect.BusinessChart([], [], [], [], "");
    var base = $failureDetect.baseDefault;
    var params = {
        business: parseInt($businessName),
        time_range: parseInt($businessTime),
        kpi: parseInt($businessIndex),
        channel_id: parseInt(busiChannel)
    };
    $tools.loading();
    $tools.getData(base.FO_chart_data, params, $failureDetect.setBusinessChart, $businessIndex, $tools.configs.Env);
};
$failureDetect.setBusinessChart = function(data, $businessIndex) {
    $tools.closeLoading();
    if (!data) {
        return;
    }
    var content = data["CONTENT"];
    var chart = content["chart"];
    var chartLength = chart.length;
    var categories = [];
    var duration = [];
    var alarm = [];
    var maxKPI = 0,
        minKPI = 0;
    for (var i = 0; i < chartLength; i++) {
        if (!chart[i]["kpi"]) {
            chart[i]["kpi"] = 0;
        }
        categories.push(chart[i]["ts"].split(" ")[1].substr(0, 5));
        if ($businessIndex == 2) {
            duration.push(chart[i]["kpi"].toFixed(3) * 100);
            alarm.push(chart[0]["kpi"].toFixed(3) * 100);
        } else {
            duration.push(chart[i]["kpi"].toFixed(3));
            alarm.push(chart[0]["kpi"].toFixed(3));
        }
        if (maxKPI < chart[i]["kpi"]) {
            maxKPI = chart[i]["kpi"];
        }
        if (minKPI > chart[i]["kpi"]) {
            minKPI = chart[i]["kpi"]
        }
    }
    var axisCrossingValues = [];
    var format = "";
    if ($businessIndex == 2) {
        axisCrossingValues = [minKPI.toFixed(3) * 100 - 10, maxKPI.toFixed(3) * 100 + 10];
        format = "{0}%";
    } else if ($businessIndex == 0) {
        axisCrossingValues = [minKPI.toFixed(3) - 1, 1 + (maxKPI.toFixed(3))];
        format = "{0}s";
    } else if ($businessIndex == 1) {
        axisCrossingValues = [minKPI.toFixed(3) - 100, maxKPI.toFixed(3) + 100];
        format = "{0}次";
    }
    $failureDetect.BusinessChart(alarm, duration, categories, axisCrossingValues, format);

};
$failureDetect.BusinessChart = function(alarm, duration, categories, axisCrossingValues, format) {
    $("#businessPerformance_business_chart").kendoChart({
        legend: {
            position: "bottom"
        },
        series: [{
            type: "line",
            data: alarm,
            name: "警告线  ",
            color: "#ffae00",
            axis: "wind"
        }, {
            type: "area",
            data: duration,
            name: "周期内趋势",
            color: "#73c100",
            axis: "wind"
        }],
        valueAxes: [{
            name: "wind",
            color: "#73c100",
            min: 0,
            labels: {
                format: format
            }
        }],
        categoryAxis: {
            categories: categories,
            axisCrossingValues: axisCrossingValues,
            axis: "sign",
            labels: {
                rotation: -45
            },
            justified: true
        }
    });
};
$failureDetect.getReturnChart = function($businessName, $businessTime) {
    $failureDetect.ReturnChart();
    var base = $failureDetect.baseDefault;
    var busiChannel = $($failureDetect.kendoComboBox.busiChannel).val();
    var params = {
        business: parseInt($businessName),
        time_range: parseInt($businessTime),
        channel_id: parseInt(busiChannel)
    };
    $tools.loading();
    $tools.getData(base.FO_chart_data2, params, $failureDetect.setReturnChart, null, $tools.configs.Env);
};
$failureDetect.setReturnChart = function(data) {
    $tools.closeLoading();
    if (!data["CONTENT"]["pieChart"]) {
        return;
    }
    var returnData = data["CONTENT"]["pieChart"];
    var l = returnData.length;
    var returnChart = [];
    for (var i = 0; i < l; i++) {
        returnChart.push({
            category: returnData[i]["text"],
            value: returnData[i]["value"]
        });
    }
    $failureDetect.ReturnChart(returnChart);
};
$failureDetect.ReturnChart = function(data) {
    if (data && data.length == 0) {
        var data = [{
            category: "当前办理量",
            value: 100,
            color: "#B8B2B2"
        }];
        $("#businessPerformance_return_chart").kendoChart({
            legend: {
                position: "bottom"
            },
            tooltip: {
                visible: true,
                template: "#= category # : 0",
                color: "#fff"
            },
            series: [{
                type: "donut",
                data: data
            }]
        });
    } else {
        var data = data || [];
        $("#businessPerformance_return_chart").kendoChart({
            legend: {
                position: "bottom"
            },
            tooltip: {
                visible: true,
                template: "#= category # : #= value #",
                color: "#fff"
            },
            series: [{
                type: "donut",
                data: data
            }]
        });
    }

};
$failureDetect.getStartTimeAndEndTime = function(index) {
    if (index) {
        var date = new Date();
        var time = {
            startTime: "",
            endTime: ""
        };
        var hours = 1000 * 60 * 60;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var Today = new Date(year + "/" + month + "/" + day).getTime();
        var tomorrow = Today + hours * 24;
        if (index == 0) {
            time.endTime = $tools.dateZerofill(date);
            time.startTime = $tools.dateZerofill(new Date(date.getTime() - 1000 * 60 * 60));
        } else if (index == 1) {
            time.startTime = $tools.dateZerofill(new Date(Today));
            time.endTime = $tools.dateZerofill(new Date(tomorrow));
        }
        return time;
    }
};


//$failureDetect.getSingleBusinessInformation = function (start) {
//    var table = $failureDetect.singleBusinessInformation;
//    var base = $failureDetect.baseDefault;
//    if (typeof start !== "undefined") {
//        table.start = start;
//    }
//    var params = {
//        startIndex: table.start,
//        pageStatus: table.count
//    };
//    params["alarmBusiId"] = base.singleBusinessInformationId;
//    $tools.getData(base.singleBusinessInformationUrl,
//        params,
//        $failureDetect.setSingleBusinessInformation,
//        base.singleBusinessInformationId);
//};
//$failureDetect.setSingleBusinessInformation = function (data,id) {
//    if (data) {
//        //分页
//        var base = $failureDetect.singleBusinessInformation,
//            contentVal = singleBusinessInformation.CONTENT,
//            contentName = singleBusinessInformation.CONTENT_NAME,
//            totalName = singleBusinessInformation.total;
//        if (base.total != data[contentName][totalName]) {
//            base.total = data[contentName][totalName];
//            var baseDefault = {
//                totalCount: base.total,
//                showCount: base.showCount,
//                limit: base.count,
//                box: base.pageBox,
//                callBack: $failureDetect.getSingleBusinessInformation
//            };
//            $tools.callBackPagination(baseDefault);
//        }
//        $failureDetect.setSingleBusinessInformationTitle(id);
//        var table_main_tr = $("#singleBusinessInformationTable-tr").html(),
//            table_list = "",
//            table_array = [],
//            content = data[contentName]["resultData"],
//            length = content.length;
//        singleBusinessInformation.CONTENT_LIST = content;
//        for (var i = 0; i < length; i++) {
//            //var state = "";
//            //if (content[i][contentVal.state] == 1) {
//            //    state = $failureDetect.baseDefault.alertStateToOK;
//            //} else if (content[i][contentVal.state] == 0) {
//            //    state = $failureDetect.baseDefault.alertStateToWant;
//            //}
//            table_list = table_main_tr.replace(/{{id}}/g, content[i][contentVal.id])
//                .replace(/{{name}}/g, content[i][contentVal.name])
//                .replace(/{{transactionChannel}}/g, content[i][contentVal.transactionChannel])
//                .replace(/{{number}}/g, content[i][contentVal.number])
//                .replace(/{{operatorNo}}/, content[i][contentVal.operatorNum])
//                .replace(/{{time}}/g, content[i][contentVal.time])
//                .replace(/{{durationTime}}/g, parseInt(content[i][contentVal.durationTime])/1000)
//                .replace(/{{state}}/g, content[i][contentVal.state]);
//            table_array.push(table_list);
//        }
//        $(".singleBusinessInformationTable-tbody").html(table_array.join(""));
//
//        $(".openCommandWord").click($failureDetect.openCommandWord);
//    } else {
//        $(".content-right-table-main-tbody").html("暂无数据");
//    }
//    $("#singleBusinessInformation").modal("show");
//};
//$failureDetect.setSingleBusinessInformationTitle = function (id) {
//    var titleBox = "#singleBusinessInformationTitle";
//    var contentName = alertServiceDetails.CONTENT;
//    var content = alertServiceDetails.CONTENT_LIST;
//    var l = content.length;
//    var title_name = "", title_content = "";
//    for (var i = 0; i < l; i++) {
//        if (content[i][contentName.id] == id) {
//            title_name = "<h4>" + content[i][contentName.name] + "</h4>";
//            title_content += "<p>首次告警时间:" + content[i][contentName.time] + "，";
//            title_content += "告警持续时长:" + parseFloat(content[i][contentName.durationTime]).toFixed(2) + "</p>";
//        }
//    }
//    $(titleBox).html(title_name + title_content);
//};
////命令字信息
//$failureDetect.openCommandWord = function () {
//    var commandWordId = $(this).attr("values");
//    if (!commandWordId && commandWordId == "") {
//        return;
//    }
//    $failureDetect.baseDefault.commandWordId = commandWordId;
//    $failureDetect.getCommandWord();
//};
//$failureDetect.getCommandWord = function (start) {
//    var table = $failureDetect.commandWord;
//    var base = $failureDetect.baseDefault;
//    if (typeof start !== "undefined") {
//        table.start = start;
//    }
//    var params = {
//        alarmCommId: parseInt(base.commandWordId),
//        startIndex: table.start,
//        pageStatus: table.count
//    };
//    $tools.getData(base.commandWordUrl,
//        params,
//        $failureDetect.setCommandWord,
//        base.commandWordId);
//};
//$failureDetect.setCommandWord = function (data,id) {
//    if (data) {
//        //分页
//        $failureDetect.setCommandWordTitle(id);
//        var base = $failureDetect.commandWord,
//            contentVal = commandWord.CONTENT,
//            contentName = commandWord.CONTENT_NAME,
//            totalName = commandWord.total;
//        if (base.total != data[contentName][totalName]) {
//            base.total = data[contentName][totalName];
//            var baseDefault = {
//                totalCount: base.total,
//                showCount: base.showCount,
//                limit: base.count,
//                box: base.pageBox,
//                callBack: $failureDetect.getCommandWord
//            };
//            $tools.callBackPagination(baseDefault);
//        }
//        var table_main_tr = $("#commandWordTable-tr").html(),
//            table_list = "",
//            table_array = [],
//            content = data[contentName]["resultData"],
//            length = content.length;
//        for (var i = 0; i < length; i++) {
//            var state = "";
//            if (content[i][contentVal.state] == 1) {
//                state = $failureDetect.baseDefault.alertStateToOK;
//            } else if (content[i][contentVal.state] == 0) {
//                state = $failureDetect.baseDefault.alertStateToWant;
//            }
//            table_list = table_main_tr.replace(/{{name}}/g, content[i][contentVal.name])
//                .replace(/{{number}}/g, content[i][contentVal.number])
//                .replace(/{{commandWord}}/g, content[i][contentVal.commandWord])
//                .replace(/{{time}}/g, content[i][contentVal.time])
//                .replace(/{{clientIP}}/g, content[i][contentVal.clientIP])
//                .replace(/{{serverIP}}/g, content[i][contentVal.serverIP])
//                .replace(/{{responseTime}}/g, content[i][contentVal.responseTime])
//                .replace(/{{returnCode}}/g, content[i][contentVal.returnCode])
//                .replace(/{{returnInfo}}/g, content[i][contentVal.returnInfo]);
//            table_array.push(table_list);
//        }
//        $(".commandWordTable-tbody").html(table_array.join(""));
//    } else {
//        $(".commandWordTable-tbody").html("暂无数据");
//    }
//    $("#commandWord").modal("show");
//};
//$failureDetect.setCommandWordTitle = function (id) {
//    var titleBox = "#commandWordTitle";
//    var contentName = singleBusinessInformation.CONTENT;
//    var content = singleBusinessInformation.CONTENT_LIST;
//    var l = content.length;
//    var title_name = "", title_content = "";
//    for (var i = 0; i < l; i++) {
//        if (content[i][contentName.id] == id) {
//            title_name = "<h4>" + content[i][contentName.transactionChannel] + "</h4>";
//            title_content += "<p>操作工号:" + content[i][contentName.operatorNum] + "，";
//            title_content += "用户号码:" + content[i][contentName.number] + "，";
//            title_content += "办理时间:" + content[i][contentName.time] + "，";
//            title_content += "办理结果:" + content[i][contentName.state] + "</p>";
//        }
//    }
//    $(titleBox).html(title_name + title_content);
//};