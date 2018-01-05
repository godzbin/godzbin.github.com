/**
 * Created by GodzBin on 2016/2/24.
 */
$(function () {
    kendo.culture("zh-CN");
    $tools.getNav("../nav/header.html", ".header-nav-main", $bs.setHeaderNav);
    $tools.getNav("../nav/businessMonitoring.html", ".content-left", $bs.setLeftNav);
    $bs.init();
});
var $bs = {};
var BusinessSurveyList = {
    total: "total_count",
    CONTENT_NAME: "grid",
    CONTENT: {
        id: "id",
        type: "busiType",
        channel: "channel",
        handlingCapacity: "amount",
        successRate: "succRate",
        averageTime: "avgTime",
        typeId : "busiTypeId"
    }
};
$bs.setHeaderNav = function () {
    $(".header-nav-bg6").addClass("action");
};
$bs.setLeftNav = function () {
    $(".content-left-nav1").addClass("action");
};

$bs.baseDefault = {
    businessChannelBox: "#businessChannel",
    startTimeBox: "#startTime",
    endTimeBox: "#endTime",
    startTimeIsNull: "开始时间不能为空",
    endTimeIsNull: "结束时间不能为空",
    businessChannelIsNull: "业务渠道不能为空",
    businessSurveyTablePageBox: ".businessSurveyTablePageBox",
    getBusinessSurveyListUrl: "GEN_grid",
    businessChannelUrl: "BT_channel"
};
$bs.businessSurveyList = new $tools.pageDefault(0, 10, 0, 10, $bs.baseDefault.businessSurveyTablePageBox);
$bs.init = function () {
    $("input").val("");
    var date = new Date();
    var startTime = new Date(date.getTime() - (1000 * 60 * 5));
    $("#startTime").kendoDateTimePicker({
        value: startTime
    });
    $("#endTime").kendoDateTimePicker({
        value: new Date()
    });
    $tools.kendoComboBox($bs.baseDefault.businessChannelBox, "text", "_id", []);
    $(".query").click($bs.query);
    $bs.getBusinessChannel();
};
$bs.getBusinessChannel = function () {
    $tools.getData($bs.baseDefault.businessChannelUrl, null, $bs.setBusinessChannel, null ,$tools.configs.Env);
};
$bs.setBusinessChannel = function (data) {
    if (!data) {
        return;
    }
    $tools.kendoComboBox($bs.baseDefault.businessChannelBox, "text", "_id", data["CONTENT"]);
    $bs.getBusinessSurveyList();
};
$bs.query = function () {
    $bs.getBusinessSurveyList();
};
$bs.getBusinessSurveyList = function (start) {
    var table = $bs.businessSurveyList;
    if (typeof start !== "undefined") {
        table.start = start;
    }
    var base = $bs.baseDefault;
    var startTime = $(base.startTimeBox).val();
    var endTime = $(base.endTimeBox).val();
    var businessChannel = $(base.businessChannelBox).val();
    if (startTime == "") {
        alert(base.startTimeIsNull);
        return;
    }
    if (endTime == "") {
        alert(base.endTimeIsNull);
        return;
    }
    if (businessChannel == "") {
        alert(base.businessChannelIsNull);
        return;
    }
    startTime = $tools.dateZerofill(new Date(startTime));
    endTime = $tools.dateZerofill(new Date(endTime));
    var params = {
        start_row: table.start,
        row_count: table.count,
        end_time: endTime,
        start_time: startTime,
        channel: parseInt(businessChannel),
        channel_id: parseInt(businessChannel)
    };
    $tools.getData(base.getBusinessSurveyListUrl, params, $bs.setBusinessSurveyList,null,$tools.configs.Env);
    $tools.loading();
};
$bs.setBusinessSurveyList = function (data) {
    $tools.closeLoading();
    if (!data) {
        return;
    }
    //分页
    data = data["CONTENT"];
    var table_main_tr = $("#businessSurveyTableTr").html(),
        table_list = "",
        table_array = [],
        length = data[BusinessSurveyList.CONTENT_NAME].length,
        content = data[BusinessSurveyList.CONTENT_NAME];
    var table = $bs.businessSurveyList,
        contentVal = BusinessSurveyList.CONTENT;
    if (table.total != data[BusinessSurveyList.total]) {
        table.total = data[BusinessSurveyList.total];
        var baseDefault = {
            totalCount: table.total,
            showCount: table.showCount,
            limit: table.count,
            box: table.pageBox,
            callBack: $bs.getBusinessSurveyList
        };
        $tools.callBackPagination(baseDefault);
    }


    for (var i = 0; i < length; i++) {
        if (!content[i][contentVal.successRate]) {
            content[i][contentVal.successRate] = 0;
        }
        table_list = table_main_tr.replace(/{{id}}/g, content[i][contentVal.type])
            .replace(/{{busiTypeId}}/g, content[i][contentVal.typeId])
            .replace(/{{type}}/g, content[i][contentVal.type])
            .replace(/{{channel}}/g, content[i][contentVal.channel])
            .replace(/{{handlingCapacity}}/g, content[i][contentVal.handlingCapacity])
            .replace(/{{successRate}}/g, parseFloat(parseFloat(content[i][contentVal.successRate]* 100).toFixed(3))  + "%")
            .replace(/{{averageTime}}/g, content[i][contentVal.averageTime].toFixed(2));
        table_array.push(table_list);
    }
    $(".businessSurveyTableTbody").html(table_array.join(""));

    $(".com").click($bs.com);
};
$bs.com = function () {
    var base = $bs.baseDefault;
    var id = $(this).attr("values");
    var startTime = $(base.startTimeBox).val();
    var endTime = $(base.endTimeBox).val();
    var businessChannel = $(base.businessChannelBox).val();
    startTime = $tools.dateZerofill(new Date(startTime));
    endTime = $tools.dateZerofill(new Date(endTime));
    window.location.href = "transactionTrackingQuery.html?id=" +
        id + "&startTime=" + startTime + "&endTime=" + endTime + "&businessChannel=" + businessChannel;
};