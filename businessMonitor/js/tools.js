/**
 * Created by GodzBin on 2016/2/17.
 */
$(function () {
    setInterval(function () {
        var time = new Date();
        $(".header-time").html($tools.dateZerofill(time));
    }, 1000);
});
var $tools = {};
$tools.alertTest = {
    error: "网络错误，请稍后再试"
};
$tools.configs = {
    Env : "bpcKpiView"
};
$tools.getNav = function (url, box, callback) {
    $(box).load(url, function () {
        callback()
    });

};
//日期格式输出
$tools.dateZerofill = function (time) {
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    var timeArray = [year, month, date, hours, minutes, seconds];
    for (var i = 0, l = timeArray.length; i < l; i++) {
        if ((timeArray[i]+"").length < 2) {
            timeArray[i] = "0" + timeArray[i];
        }
    }
    var timeStr = timeArray[0] + "-" + timeArray[1] + "-"
        + timeArray[2] + " " + timeArray[3] + ":" + timeArray[4] + ":" + timeArray[5];
    return timeStr;
};
$tools.dataIsNull = function (data) {
    if (!data) {
        return false;
    }
    var l = data.length;
    if (l) {
        for (var i = 0; i < l; i++) {
            for (j in data[i]) {
                if (data[i][j] === "") {
                    console.log(data[i][j]);
                    console.log(j);
                    return false;
                }
            }
        }
    }
    return true;
};
$tools.setArray = function (data) {
    if (!data) {
        return;
    }
    var l = data.length;
    var array = [];
    for (var i = 0; i < l; i++) {
        array.push({"text": data[i]["text"], "value": data[i]["value"]});
    }
    return array;
};
$tools.getText = function (array, key) {
    var l = array.length;
    for (var i = 0; i < l; i++) {
        if (key == array[i]["value"]) {
            return array[i]["text"];
        }
    }
};
$tools.getData = function (url, params, callback, callbackParams, Env) {
    var dataUrl = "../../../dataProcess";
    var Env = Env || "bpcEnv";
    var dataParams = {
        FUNC : "view_invokeEnvFunc",
        FUNC_PARAMS: JSON.stringify({
            ENV : Env,
            FUNC : url,
            FUNC_PARAMS : JSON.stringify(params)
        })
    };
    $.ajax({
        url: dataUrl,
        data: dataParams,
        dataType: "JSON",
        type: "POST",
        success: function (data) {
            if(data["STATE"] ==1){
                callback(data, callbackParams);
            }else{
                $tools.closeLoading();
                alert(data["ERR_MSG"]);
            }
        },
        error: function (e) {
            $tools.closeLoading();
            // alert($tools.alertTest.error);

        }
    });
};

$tools.loadData = function (url, params, callback, callbackParams, Env) {
    var dataUrl = "../../../dataProcess";
    var Env = Env || "bpcEnv";
    var dataParams = {
        FUNC : "view_invokeEnvFunc",
        FUNC_PARAMS: JSON.stringify({
            ENV : Env,
            FUNC : url,
            FUNC_PARAMS : JSON.stringify(params)
        })
    };
    $.ajax({
        url: dataUrl,
        data: dataParams,
        dataType: "JSON",
        type: "POST",
        success: function (data) {
            if(data["STATE"] ==1){
                callback(data["CONTENT"], callbackParams);
            }else{
                $tools.closeLoading();
                alert(data["ERR_MSG"]);
            }
        },
        error: function (e) {
            $tools.closeLoading();
            // alert($tools.alertTest.error);

        }
    });
};
$tools.pageDefault = function (start, count, total, showCount, pageBox) {
    this.start = start;
    this.count = count;
    this.total = total;
    this.showCount = showCount;
    this.pageBox = pageBox;
};

$tools.callBackPagination = function (baseDefault) {
    //var baseDefault = {
    //    totalCount: "",
    //    showCount: "",
    //    limit: "",
    //    box: "",
    //    callBack:""
    //};
    $(baseDefault.box).extendPagination({
        totalCount: baseDefault.totalCount,
        showCount: baseDefault.showCount,
        limit: baseDefault.limit,
        callback: function (curr, limit, totalCount) {
            var start = limit * (curr - 1);
            baseDefault.callBack(start);
        }
    });
};

$tools.kendoComboBox = function (box, dataTextField, dataValueField, dataSource, index) {
    if (!index) {
        var index = 0;
    }
    $(box).kendoComboBox({
        dataTextField: dataTextField,
        dataValueField: dataValueField,
        dataSource: dataSource,
        index: index
    });
};

$tools.loading = function(){
    var loading = "#loading";
    var $loading =$(loading);
    if(!$loading.attr("id")){
        var loading = "<div id='loading'></div>"
        $("body").append(loading);
    }
    $loading.show();
    $loading.animate({opacity: 1},1000);
};
$tools.closeLoading = function(){
    var loading = "#loading";
    var $loading =$(loading);
    if($loading){
        $loading.animate({opacity: 0},1000, function(){$loading.hide();});
    }
};