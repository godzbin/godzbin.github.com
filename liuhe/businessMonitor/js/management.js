/**
 * Created by GodzBin on 2016/2/22.
 */
$(function () {
    $tools.getNav("../nav/header.html", ".header-nav-main", $management.setHeaderNav);
    $tools.getNav("../nav/management.html", ".content-left", $management.setLeftNav);
    $management.init();
});

var $management = {};
// 告警配置参数名
var AlertConfiguration = {
    CONTENT_NAME: "CONTENT",
    CONTENT: {
        id: "_id",
        name: "type",
        metric: "metric",
        state: "currentRule",
        condition: "cond",
        triggerTime: "interval",
        threshold: "threshold"
    },
    CONTENT_LIST : [{
        _id : -1,
        type: 1,
        cond : ">",
        currentRule : 0,
        interval : 15,
        threshold : 0
    },
    {
        _id: 0,
        type: 2,
        cond : "<",
        currentRule : 0,
        interval : 15,
        threshold : 0
    }]
};
//维度
var dimension ={
    "condition" :
        [{"text":"大于", "value": ">"},
        {"text":"小于", "value": "<"}],
    "triggerTime" :
        [{"text":"15分钟", "value": 15},
        {"text":"30分钟", "value": 30},
        {"text":"1个小时", "value": 60}],
    "metric" : [{"text":"个","value": 0},{"text":"%","value": 1}],
    "name" :[{"text":"成功率","value":1},{"text":"失败次数","value": 2}],
};

$management.setHeaderNav = function () {
    $(".header-nav-bg5").addClass("action");
};
$management.setLeftNav = function () {
    $(".content-left-nav1").addClass("action");
};
$management.baseDefault = {
    imgPath: "../img/",
    conditionBox: ".condition",
    triggerTimeBox: ".triggerTime",
    getDimensionUrl: "",
    getAlertConfigurationUrl: "ruleDisplayPage",
    alertConfigurationTableTrModel: "#alertConfigurationTableTrModel",
    alertConfigurationManagementTr: "#alertConfigurationManagementTr",
    updateAlertConfigurationUrl: "defineRule",
    statePic: {
        open: "state_open",
        close: "state_close"
    },
    switchPic: {
        open: "switch_open",
        close: "switch_close"
    },
    updateResult: {
        success: "保存成功",
        fail: "保存失败"
    },
    changeIsNull: "字段不能为空",
    changeIsError: "请选择正确的选项"
};
$management.condition = [];
$management.triggerTime = [];
$management.metric = [];
$management.alertConfigurationData = [];
$management.init = function () {
    $management.getDimension();
};
$management.updateAlertConfigurationBtn = function () {
    var base = $management.baseDefault;
    var isNull = $tools.dataIsNull($management.alertConfigurationData);
    if(!isNull){
        alert(base.changeIsNull);
        return;
    }
    console.log($management.alertConfigurationData);
    var params = {
            rule: $management.alertConfigurationData
    };
    $tools.getData(base.updateAlertConfigurationUrl, params, $management.updateAlertConfigurationReturn);
};
$management.updateAlertConfigurationReturn = function (data) {
    if (data) {
        var result = $management.baseDefault.updateResult;
        if (data["STATE"] == 1) {
            alert(result.success);
        } else {
            alert(result.fail);
        }
    }
};
//取得维度
$management.getDimension = function () {
    $management.setDimension(dimension);
};
$management.setDimension = function (data) {
    if (data) {
        var condition = data["condition"];
        var triggerTime = data["triggerTime"];
        var metric = data["metric"];
        $management.condition = $tools.setArray(condition);
        $management.triggerTime = $tools.setArray(triggerTime);
        $management.metric = $tools.setArray(metric);
        $management.getAlertConfiguration();
    }
};
//获取告警配置
$management.getAlertConfiguration = function () {
    var base = $management.baseDefault;
    $tools.getData(base.getAlertConfigurationUrl, null, $management.setAlertConfiguration);
};

$management.setAlertConfiguration = function (data) {
    if (data) {
        var base = $management.baseDefault,
            contentName = AlertConfiguration.CONTENT_NAME,
            contentVal = AlertConfiguration.CONTENT;
        var table = $(base.alertConfigurationTableTrModel).html();
        var tableHtml = "";
        var tableArray = [];

        var dataList = data[contentName];
        var listLength = dataList.length;
        var tableData = AlertConfiguration.CONTENT_LIST;
        var l = tableData.length;
        for(var j=0;j<listLength; j++){
            for(var z=0; z<l; z++){
                if(dataList[j][contentVal.name] == tableData[z][contentVal.name]){
                    tableData[z][contentVal.id] =  dataList[j][contentVal.id];
                    tableData[z][contentVal.condition] =  dataList[j][contentVal.condition];
                    tableData[z][contentVal.state] =  dataList[j][contentVal.state];
                    tableData[z][contentVal.threshold] =  dataList[j][contentVal.threshold];
                    tableData[z][contentVal.triggerTime] =  dataList[j][contentVal.triggerTime];
                }
            }
        }
        $management.alertConfigurationData = tableData;
        var statePic = "", switchPic = "", metric = "",name="";
        for (var i = 0; i < l; i++) {
            if (tableData[i][contentVal.state] == 1) {
                statePic = base.statePic.open;
                switchPic = base.switchPic.open;
            } else {
                statePic = base.statePic.close;
                switchPic = base.switchPic.close;
            }
            if(tableData[i][contentVal.name] == 1){
                name = "失败次数";
            }else if(tableData[i][contentVal.name] == 2){
                name = "成功率";
            }
            metric = $tools.getText($management.metric, i);
            tableHtml = table.replace(/{{id}}/g, tableData[i][contentVal.id])
                .replace(/{{name}}/g, name)
                .replace(/{{metric}}/g, metric)
                .replace(/{{state}}/g, statePic)
                .replace(/{{switch}}/g, switchPic);
            tableArray.push(tableHtml);
        }
        $(".alertConfigurationManagementTable").html(tableArray.join(""));
        var tr = base.alertConfigurationManagementTr;
        var trId = "";
        var conditionBox, triggerTimeBox, thresholdBox;
        for (var i = 0; i < l; i++) {
            trId = tr + tableData[i]["_id"];
            conditionBox = "#condition"+ tableData[i]["_id"];
            triggerTimeBox = "#triggerTime"+ tableData[i]["_id"];
            thresholdBox = "#threshold"+ tableData[i]["_id"];

            $tools.kendoComboBox(conditionBox, "text", "value", $management.condition);
            $tools.kendoComboBox(triggerTimeBox, "text", "value", $management.triggerTime);

            console.log($(conditionBox).data("kendoComboBox"));
            $(conditionBox).data("kendoComboBox").value(tableData[i][contentVal.condition]);
            $(triggerTimeBox).data("kendoComboBox").value(tableData[i][contentVal.triggerTime]);
            $(thresholdBox).val(tableData[i][contentVal.threshold]);
            $(thresholdBox).kendoMaskedTextBox({
                mask: ""
            });
        }
        $management.listen();
    }
};

//监听按钮
$management.listen = function () {
    $(".switch").click($management.clickSwitch);
    $(".alertConfigurationManagementTable input[type=text]").change($management.inputChange);
    $(".updateBtn").click($management.updateAlertConfigurationBtn);
};
$management.inputChange = function () {
    var tr = $(this).parents("tr");
    var trId = tr.attr("values");
    var inputValue = $(this).val();
    var inputClass = $(this).attr("values");
    $management.updateAlertConfigurationData(trId, inputClass, inputValue);
};
$management.clickSwitch = function () {
    var base = $management.baseDefault;
    var tr = $(this).parents("tr");
    var trId = tr.attr("values");
    var remove = "";
    var add = "";
    var switchPic = "";
    var statePic = "";
    var state = 0;
    if ($(this).hasClass(base.switchPic.open)) {
        remove = base.switchPic.open;
        add = base.switchPic.close;
        switchPic = base.switchPic.close;
        statePic = base.statePic.close;
        state = 0;
    } else {
        remove = base.switchPic.close;
        add = base.switchPic.open;
        switchPic = base.switchPic.open;
        statePic = base.statePic.open;
        state = 1;
    }
    $(this).removeClass(remove);
    $(this).addClass(add);
    $(this).attr("src", base.imgPath + switchPic + ".png");
    tr.find(".state").attr("src", base.imgPath + statePic + ".png");
    $management.updateAlertConfigurationData(trId, AlertConfiguration.CONTENT.state, state);
};
$management.updateAlertConfigurationData = function (id, key, value) {
    if (!id || !key || value == null) {
        return;
    }
    if(key !== AlertConfiguration.CONTENT.condition){
        value = parseInt(value);
    }
    if(key === AlertConfiguration.CONTENT.triggerTime){
        if(value != 15 && value != 30 && value != 60 ){
            alert($management.baseDefault.changeIsError);
            return;
        }
    }
    var data = $management.alertConfigurationData;
    var base =$management.baseDefault;
    var l = data.length;
    for (var i = 0; i < l; i++) {
        if (data[i]["_id"] == id) {
            data[i][key] = value;
        }
    }
};





