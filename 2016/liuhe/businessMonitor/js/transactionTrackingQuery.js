/**
 * Created by GodzBin on 2016/2/25.
 */
$(function () {
    kendo.culture("zh-CN");
    $tools.getNav("../nav/header.html", ".header-nav-main", $tt.setHeaderNav);
    $tools.getNav("../nav/businessMonitoring.html", ".content-left", $tt.setLeftNav);
    $tt.init();
});
var $tt = {};
$tt.setHeaderNav = function () {
    $(".header-nav-bg6").addClass("action");
};
$tt.setLeftNav = function () {
    $(".content-left-nav2").addClass("action");
};
var $BusinessDetails = {};
var $SingBusinessDetails = {};
$SingBusinessDetails.Res = {
    name: "业务名称",
    command: "命令字",
    callTime: "办理时间",
    responseTime: "响应时间(ms)",
    clientIP: "客户端IP",
    serverIP: "服务端IP",
    returnCode: "返回码",
    returnInfo: "返回信息"
};

$BusinessDetails.Res = {
    type: "业务名称",
    time: "办理时间",
    businessChannel: "业务渠道",
    operatorNo: "操作工号",
    number: "手机号码",
    handleTime: "办理时长(s)",
    state: "办理状态",
    startTime: "开始时间",
    endTime: "结束时间",
    businessType: "业务类型",
    hall: "交易渠道",
    transactionChannel: "交易渠道",
    userPhone: "用户手机号码",
    handleState: "办理状态"
};
$tt.baseDefault = {
    transactionChannelBox: "#businessChannel",
    businessTypeBox: "#businessType",
    handleStateBox: "#handleState",
    businessDetailsTablePageBox: ".businessDetailsTablePage",
    singBusinessDetailsTableUrl: "BT_grid2",
    BT_business: "BT_business",
    BT_channel: "BT_channel",
    BT_status: "BT_status",
    getBusinessDetailsTableUrl: "BT_grid1",
    cannotNUll: "不能为空"
};

$tt.businessDetails = new $tools.pageDefault(0, 10, 0, 10, $tt.baseDefault.businessDetailsTablePageBox);
$tt.clicks = 0;
$tt.hrefLoad = false;
$tt.init = function () {
    $("input").val("");
    var date = new Date();
    var startTime = new Date(date.getTime() - (1000 * 60 * 5));
    $("#startTime").kendoDateTimePicker({
        value: startTime
    });
    $("#endTime").kendoDateTimePicker({
        value: new Date()
    });
    $tools.kendoComboBox($tt.baseDefault.transactionChannelBox, "text", "_id", []);
    $tools.kendoComboBox($tt.baseDefault.businessTypeBox, "text", "_id", []);
    $tools.kendoComboBox($tt.baseDefault.handleStateBox, "text", "_id", []);
    $($tt.baseDefault.transactionChannelBox).change($tt.getBusinessTypeBox);
    $tt.getDimension();
    $(".query").click($tt.query);
    $tt.initBusinessDetailsTable();
    $tt.initCommandWordTable();
};
$tt.getBusinessTypeBox = function () {
    var busiChannel = $($tt.baseDefault.transactionChannelBox).val();
    var params = {
        channel_id: parseInt(busiChannel)
    };
    $tools.getData($tt.baseDefault.BT_business, params, $tt.setBusinessTypeBox,null,$tools.configs.Env);
};
$tt.setBusinessTypeBox = function (data) {
    if (!data) {
        return;
    }
    var businessTypeBox = data["CONTENT"];
    if (businessTypeBox.length) {
        $($tt.baseDefault.businessTypeBox).data("kendoComboBox").dataSource.data(businessTypeBox);
        $($tt.baseDefault.businessTypeBox).data("kendoComboBox").value(businessTypeBox[0]["_id"]);
    } else {
        $($tt.baseDefault.businessTypeBox).data("kendoComboBox").dataSource.data(businessTypeBox);
        $($tt.baseDefault.businessTypeBox).data("kendoComboBox").value("");
    }
    $tt.getHref();
};

$tt.getTransactionChannelBox = function () {
    $tools.getData($tt.baseDefault.BT_channel, null, $tt.setTransactionChannelBox, null,$tools.configs.Env);
};
$tt.setTransactionChannelBox = function (data) {
    if (!data) {
        return;
    }
    var transactionChannelBox = data["CONTENT"];
    $($tt.baseDefault.transactionChannelBox).data("kendoComboBox").dataSource.data(transactionChannelBox);
    $($tt.baseDefault.transactionChannelBox).data("kendoComboBox").value(transactionChannelBox[0]["_id"]);
    $tt.getBusinessTypeBox();
    $tt.getHref();

};


$tt.getHandleStateBox = function () {
    $tools.getData($tt.baseDefault.BT_status, null, $tt.setHandleStateBox, null,$tools.configs.Env);
};

$tt.setHandleStateBox = function (data) {
    if (!data) {
        return;
    }
    var handleStateBox = data["CONTENT"];
    $($tt.baseDefault.handleStateBox).data("kendoComboBox").dataSource.data(handleStateBox);
    $($tt.baseDefault.handleStateBox).data("kendoComboBox").value(handleStateBox[0]["_id"]);
    $tt.getHref();
};


$tt.getDimension = function () {
    $tt.getTransactionChannelBox();
    $tt.getHandleStateBox();
};

$tt.getHref = function () {
    var businessType = $("#businessType").val();
    var transactionChannel = $("#transactionChannel").val();
    var handleState = $("#handleState").val();
    var paramsStr = decodeURI(window.location.href.split("?")[1]);
    if (businessType == "" || transactionChannel == "" || handleState == "") {
        return;
    }
    if (paramsStr == "undefined") {
        $tt.query();
        return;
    }
    var paramsArray = paramsStr.split("&");
    var l = paramsArray.length;
    var params = {};
    for (var i = 0; i < l; i++) {
        params[paramsArray[i].split("=")[0]] = paramsArray[i].split("=")[1];
    }
    $($tt.baseDefault.transactionChannelBox).data("kendoComboBox").value(params["businessChannel"]);
    
    $($tt.baseDefault.businessTypeBox).data("kendoComboBox").value(params["id"]);   
    $("#startTime").val(params["startTime"]);
    $("#endTime").val(params["endTime"]);
    if(!$tt.hrefLoad){
        $tt.getBusinessTypeBox();
        $tt.getBusinessDetailsTable();
    }
    $tt.hrefLoad = true;
};
$tt.initBusinessDetailsTable = function () {
    //var detailInit = function (e) {
    //};

    $("#businessDetailsTableMain").kendoGrid({
        scrollable: true,
        height: 300,
        //detailInit: detailInit,
        columns: [{
            field: "busiType",
            title: $BusinessDetails.Res.type
        }, {
            field: "ts",
            title: $BusinessDetails.Res.time
        }, {
            field: "channel",
            title: $BusinessDetails.Res.businessChannel
        }, {
            field: "hall",
            title: $BusinessDetails.Res.hall
        }, {
            field: "operator",
            title: $BusinessDetails.Res.operatorNo
        }, {
            field: "phone",
            title: $BusinessDetails.Res.number
        }, {
            field: "timePeriod",
            title: $BusinessDetails.Res.handleTime
        }, {
            field: "status",
            title: $BusinessDetails.Res.state
        }
        ],
        change: $tt.onChange,
        selectable: "_id"
    });
};
$tt.initCommandWordTable = function () {
    $(".singleBusinessDetailsTableMain").kendoGrid({
        height: 300,
        scrollable: true,
        columns: [{
            field: "busiType",
            title: $SingBusinessDetails.Res.name
        }, {
            field: "cmdName",
            title: $SingBusinessDetails.Res.command
        }, {
            field: "ts",
            title: $SingBusinessDetails.Res.callTime
        }, {
            field: "res_peroid",
            title: $SingBusinessDetails.Res.responseTime
        }, {
            field: "ip_dst",
            title: $SingBusinessDetails.Res.clientIP
        }, {
            field: "ip_src",
            title: $SingBusinessDetails.Res.serverIP
        }, {
            field: "ret_code",
            title: $SingBusinessDetails.Res.returnCode
        }, {
            field: "msg",
            title: $SingBusinessDetails.Res.returnInfo,
            width: "100"
        }
        ]
    });
};
$tt.getCommandWordTable = function (node) {
    var base = $tt.baseDefault;
    var businessType = $(base.businessTypeBox).val();
    var busiChannel = $(base.transactionChannelBox).val();
    if (node["_id"]) {
        $tools.getData($tt.baseDefault.singBusinessDetailsTableUrl,
            {
                _id: node["_id"],
                grid1_id: parseInt(businessType),
                channel_id: parseInt(busiChannel)
            }, $tt.setCommandWordTable, node["_id"], $tools.configs.Env);
    }
    $tools.loading();
};
$tt.setCommandWordTable = function (data, id) {
    $tools.closeLoading();
    if (!data || !id) {
        return;
    }
    $(".singleBusinessDetailsTableMain").data("kendoGrid").dataSource.data(data["CONTENT"]);
};
$tt.getBusinessDetailsTable = function (start) {
    $(".singleBusinessDetailsTableMain").data("kendoGrid").dataSource.data([]);
    var table = $tt.businessDetails;
    if (typeof start !== "undefined") {
        table.start = start;
    }
    var base = $tt.baseDefault;
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var businessType = $(base.businessTypeBox).val();
    var transactionChannel = $(base.transactionChannelBox).val();
    var userPhone = $("#userPhone").val();
    var handleState = $("#handleState").val();
    var operator = $("#operatorNo").val();
    var hall = $("#hall").val();
    if (!startTime) {
        alert($BusinessDetails.Res.startTime + $tt.baseDefault.cannotNUll);
        return;
    }
    if (!endTime) {
        alert($BusinessDetails.Res.endTime + $tt.baseDefault.cannotNUll);
        return;
    }
    if (!businessType) {
        alert($BusinessDetails.Res.businessType + $tt.baseDefault.cannotNUll);
        return;
    }
    if (!transactionChannel) {
        alert($BusinessDetails.Res.businessChannel + $tt.baseDefault.cannotNUll);
        return;
    }
    if (!handleState) {
        alert($BusinessDetails.Res.handleState + $tt.baseDefault.cannotNUll);
        return;
    }
    startTime = startTime.replace("-","/");
    endTime =  endTime.replace("-","/");
    startTime = $tools.dateZerofill(new Date(startTime));
    endTime = $tools.dateZerofill(new Date(endTime));
    var params = {
        start_time: startTime,
        end_time: endTime,
        busiTypeId: parseInt(businessType),
        hall: hall,
        channel: parseInt(transactionChannel),
        channel_id: parseInt(transactionChannel),
        phone: userPhone,
        status: parseInt(handleState),
        start_row: table.start,
        row_count: table.count,
        operator: operator
    };
    //var params = {
    //    start_time: "2015-09-21 09:30:00",
    //    end_time: endTime,
    //    busiTypeId: 668,
    //    hall: hall,
    //    channel: parseInt(transactionChannel),
    //    phone: userPhone,
    //    status: parseInt(handleState),
    //    start_row: table.start,
    //    row_count: table.count,
    //    operator: operator
    //};
    $tools.loading();
    $tools.getData($tt.baseDefault.getBusinessDetailsTableUrl, params, $tt.setBusinessDetailsTable, null,$tools.configs.Env);
};
$tt.setBusinessDetailsTable = function (data) {
    $tools.closeLoading();
    if (!data["CONTENT"]) {
        return;
    }
    if (data["CONTENT"].length == 0) {
        alert("暂无数据");
        return;
    }
    var base = $tt.businessDetails;
    if (base.total != data["CONTENT"]["total_count"]) {
        base.total = data["CONTENT"]["total_count"];
        var baseDefault = {
            totalCount: base.total,
            showCount: base.showCount,
            limit: base.count,
            box: base.pageBox,
            callBack: $tt.getBusinessDetailsTable
        };
        $tools.callBackPagination(baseDefault);
    }

    var grid = data["CONTENT"]["grid"];
    var l = grid.length;
    for (var i = 0; i < l; i++) {
        grid[i]["timePeriod"] = parseFloat(grid[i]["timePeriod"]).toFixed(3);
    }
    $("#businessDetailsTableMain").data("kendoGrid").dataSource.data(grid);
};
$tt.onChange = function () {
    //e.stopPropagation();
    var node = this.dataItem(this.select());
    //模拟双击
    if (node) {
        //if ($tt.clicks !== 1) {
        //    $tt.clicks++;
        //    setTimeout(function () {
        //        $tt.clicks = 0;
        //    }, 200);
        //    return false;
        //}
        $tt.getCommandWordTable(node);
        //$tt.clicks = 0;
    } else {
        return false;
    }
};
$tt.query = function () {
    $tt.getBusinessDetailsTable();
};

