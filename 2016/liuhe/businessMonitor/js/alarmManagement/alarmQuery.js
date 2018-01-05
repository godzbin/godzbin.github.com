/**
 * Created by GodzBin on 2016/3/9.
 */
$(function() {
    $tools.getNav("../nav/header.html", ".header-nav-main", $main.setHeaderNav);
    $tools.getNav("../nav/failureDetect.html", ".content-left", $main.setLeftNav);
    $main.init();
});
var $BusinessDetails = {
    Res: {
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
        transactionChannel: "业务渠道",
        hall: "交易渠道",
        userPhone: "用户手机号码",
        handleState: "办理状态"
    },
    CONTENT: {
        id: "_id",
        busiType: "busiType",
        ts: "ts",
        channel: "channel",
        hall: "hall",
        operator: "operator",
        phone: "phone",
        timePeriod: "timePeriod",
        status: "status"
    },
    businessDetailsTablePageBox: ".businessDetailsTablePage"

};
var $BusinessDetails2 = {
    Res: {
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
        transactionChannel: "业务渠道",
        hall: "交易渠道",
        userPhone: "用户手机号码",
        handleState: "办理状态"
    },
    CONTENT: {
        id: "id",
        busiType: "busiName",
        ts: "executeTime",
        channel: "busiChannel",
        hall: "transChannel",
        operator: "operatorNum",
        phone: "userNum",
        timePeriod: "duration",
        status: "status"
    },
    businessDetailsTablePageBox: ".businessDetailsTablePage",
    businessDetailsId: 0,
    busiType: null
};
var $Commandword = {
    Res: {
        busiName: "业务名称",
        cmdName: "命令字",
        ts: "调用时间",
        res_peroid: "响应时间(ms)",
        ip_dst: "源IP",
        ip_src: "目标IP",
        ret_code: "返回码",
        msg: "返回信息"
    },
    CONTENT: {
        busiName: "busiType",
        cmdName: "cmdName",
        ts: "ts",
        res_peroid: "res_peroid",
        ip_dst: "ip_dst",
        ip_src: "ip_src",
        ret_code: "ret_code",
        msg: "msg"
    },
    commandWordTablePage: ".commandWordTablePage"
};
var $Commandword2 = {
    Res: {
        busiName: "业务名称",
        cmdName: "命令字",
        ts: "调用时间",
        res_peroid: "响应时间(ms)",
        ip_dst: "源IP",
        ip_src: "目标IP",
        ret_code: "返回码",
        msg: "返回信息"
    },
    totalCount: "totalCount",
    CONTENT: {
        busiName: "name",
        cmdName: "cmdName",
        ts: "time",
        res_peroid: "resDuration",
        ip_dst: "dstIp",
        ip_src: "srcIp",
        ret_code: "returnCode",
        msg: "message"
    },
    commandWordTablePage: ".commandWordTablePage"
};
var $main = {
    setHeaderNav: function() {
        $(".header-nav-bg2").addClass("action");

    },
    setLeftNav: function() {
        $("#alarmHanding").collapse("show");
        $(".content-left-nav3-open2").addClass("action");
    },
    clicks: 0,
    hrefLoad: false,
    isQuery: false,
    Res: {
        cannotNUll: "不能为空"
    },
    box: {
        startTime: "#startTime",
        endTime: "#endTime",
        businessType: "#businessType",
        businessChannel: "#businessChannel",
        userPhone: "#userPhone",
        operatorNo: "#operatorNo",
        handleState: "#handleState",
        businessDetailsTable: "#businessDetailsTableMain",
        query: ".query",
        commandWordTable: "#commandWordTableMain"
    },
    url: {
        BT_business: "BT_business",
        BT_channel: "BT_channel",
        BT_status: "BT_status",
        getBusinessDetailsTableUrl: "BT_grid1",
        getBusinessDetailsTableUrl2: "alarmBusiPage",
        getCommandWordUrl: "BT_grid2",
        getCommandWordUrl2: "alarmCommPage"
    },
    init: function() {
        $("input").val("");
        kendo.culture("zh-CN");
        var date = new Date();
        var startTime = new Date(date.getTime() - (1000 * 60 * 5));
        $(this.box.startTime).kendoDateTimePicker({
            value: startTime
        });
        $(this.box.endTime).kendoDateTimePicker({
            value: new Date()
        });
        $tools.kendoComboBox(this.box.businessChannel, "text", "_id", []);
        $tools.kendoComboBox(this.box.businessType, "text", "_id", []);
        $tools.kendoComboBox(this.box.handleState, "text", "_id", []);
        $($main.box.businessChannel).change($main.businessChannelChange);

        this.initBusinessDetailsTable();
        this.initCommandWordTable();
        this.getDimension();
        $(this.box.query).click(this.clickQuery);
        $BusinessDetails["page"] = new $tools.pageDefault(0, 10, 0, 10, $BusinessDetails.businessDetailsTablePageBox);
        $Commandword2["page"] = new $tools.pageDefault(0, 10, 0, 10, $Commandword.commandWordTablePage);
    },
    businessChannelChange: function() {
        var box = $main.box.businessChannel;
        $main.getBusinessTypeBox(box);
    },
    //获取维度
    getDimension: function() {
        //this.getBusinessTypeBox();
        this.getBusinessChannelBox();
        this.getHandleStateBox();
    },
    getBusinessTypeBox: function(box) {
        var busiChannel = $(box).val();
        var params = {
            channel_id: parseInt(busiChannel)
        };
        $tools.getData(this.url.BT_business, params, this.setBusinessTypeBox, null, $tools.configs.Env);
    },
    setBusinessTypeBox: function(data) {
        if (!data) {
            return;
        }
        var businessTypeBox = data["CONTENT"];
        var box = $main.box.businessType;
        if (businessTypeBox.length) {
            $(box).data("kendoComboBox").dataSource.data(businessTypeBox);
            $(box).data("kendoComboBox").value(businessTypeBox[0]["_id"]);
        } else {
            $(box).data("kendoComboBox").dataSource.data(businessTypeBox);
            $(box).data("kendoComboBox").value("");
        }
        if (!$main.isQuery) {
            if ($BusinessDetails2.busiType) {
                $(box).data("kendoComboBox").value($BusinessDetails2.busiType);
                return;
            }
        }
        $main.getHref();
    },
    getBusinessChannelBox: function() {
        $tools.getData(this.url.BT_channel, null, this.setBusinessChannelBox, null, $tools.configs.Env);
    },
    setBusinessChannelBox: function(data) {
        if (!data) {
            return;
        }
        var transactionChannelBox = data["CONTENT"];
        var box = $main.box.businessChannel;
        $(box).data("kendoComboBox").dataSource.data(transactionChannelBox);
        $(box).data("kendoComboBox").value(transactionChannelBox[0]["_id"]);
        $main.getBusinessTypeBox(box);
    },
    getHandleStateBox: function() {
        $tools.getData(this.url.BT_status, null, this.setHandleStateBox, null, $tools.configs.Env);
    },
    setHandleStateBox: function(data) {
        if (!data) {
            return;
        }
        var handleStateBox = data["CONTENT"];
        var box = $main.box.handleState;
        $(box).data("kendoComboBox").dataSource.data(handleStateBox);
        $(box).data("kendoComboBox").value(handleStateBox[0]["_id"]);
        $main.getHref();

    },
    clickQuery: function(e) {
        var businessType = $($main.box.businessType).val();
        var handleState = $("#handleState").val();
        if (businessType == "" || handleState == "") {
            return;
        }
        $main.isQuery = true;
        $main.initBusinessDetailsTable();
        $main.initCommandWordTable();
        $main.getBusinessDetailsTable();
    },
    //初始化业务详情列表
    initBusinessDetailsTable: function() {
        var content, id;
        if ($main.isQuery) {
            content = $BusinessDetails.CONTENT;
            id = "_id"
        } else {
            content = $BusinessDetails2.CONTENT;
            id = "id"
        }

        $($main.box.businessDetailsTable).kendoGrid({
            scrollable: true,
            height: 300,
            columns: [{
                field: content.busiType,
                title: $BusinessDetails.Res.type
            }, {
                field: content.ts,
                title: $BusinessDetails.Res.time
            }, {
                field: content.channel,
                title: $BusinessDetails.Res.businessChannel
            }, {
                field: content.hall,
                title: $BusinessDetails.Res.hall
            }, {
                field: content.operator,
                title: $BusinessDetails.Res.operatorNo
            }, {
                field: content.phone,
                title: $BusinessDetails.Res.number
            }, {
                field: content.timePeriod,
                title: $BusinessDetails.Res.handleTime
            }, {
                field: content.status,
                title: $BusinessDetails.Res.state
            }],
            change: $main.onChange,
            selectable: content.id
        });
        $($main.box.businessDetailsTable).data("kendoGrid").dataSource.data([]);
    },
    onChange: function() {
        //e.stopPropagation();
        var node = this.dataItem(this.select());
        //模拟双击
        if (node) {
            //if ($main.clicks !== 1) {
            //    $main.clicks++;
            //    setTimeout(function () {
            //        $main.clicks = 0;
            //    }, 200);
            //    return false;
            //}
            $main.selectBusiness(node);
            //$main.clicks = 0;
        } else {
            return false;
        }
    },
    initCommandWordTable: function() {
        var content, title;
        if ($main.isQuery) {
            content = $Commandword.CONTENT;
            title = $Commandword.Res;
        } else {
            content = $Commandword2.CONTENT;
            title = $Commandword2.Res;
        }
        $($main.box.commandWordTable).kendoGrid({
            scrollable: true,
            height: 300,
            columns: [{
                field: content.busiName,
                title: title.busiName
            }, {
                field: content.cmdName,
                title: title.cmdName
            }, {
                field: content.ts,
                title: title.ts
            }, {
                field: content.res_peroid,
                title: title.res_peroid
            }, {
                field: content.ip_dst,
                title: title.ip_dst
            }, {
                field: content.ip_src,
                title: title.ip_src
            }, {
                field: content.ret_code,
                title: title.ret_code
            }, {
                field: content.msg,
                title: title.msg,
                width: "100"
            }]
        });
        $($main.box.commandWordTable).data("kendoGrid").dataSource.data([]);
    },
    getBusinessDetailsTable: function(start) {
        $main.initBusinessDetailsTable();
        $($main.box.commandWordTable).data("kendoGrid").dataSource.data([]);
        var table = $BusinessDetails.page;
        var busiChannel = $($main.box.businessChannel).val();
        if (typeof start !== "undefined") {
            table.start = start;
        }
        if (!$main.isQuery) {
            var params = {
                startIndex: table.start,
                pageStatus: table.count,
                alarmBusiId: $BusinessDetails2.businessDetailsId,
                channel_id: parseInt(busiChannel)
            };
            $tools.getData($main.url.getBusinessDetailsTableUrl2, params, $main.setBusinessDetailsTable);
        } else {
            var base = $main.box,
                Res = $main.Res;
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();
            var businessType = $(base.businessType).val();
            var businessChannel = $(base.businessChannel).val();
            var userPhone = $("#userPhone").val();
            var handleState = $("#handleState").val();
            var operator = $("#operatorNo").val();
            var hall = $("#hall").val();
            if (!startTime) {
                alert($BusinessDetails.Res.startTime + Res.cannotNUll);
                return;
            }
            if (!endTime) {
                alert($BusinessDetails.Res.endTime + Res.cannotNUll);
                return;
            }
            if (!businessType) {
                alert($BusinessDetails.Res.businessType + Res.cannotNUll);
                return;
            }
            if (!businessChannel) {
                alert($BusinessDetails.Res.businessChannel + Res.cannotNUll);
                return;
            }
            if (!handleState) {
                alert($BusinessDetails.Res.handleState + Res.cannotNUll);
                return;
            }
            startTime = startTime.replace("-", "/");
            endTime = endTime.replace("-", "/");
            startTime = $tools.dateZerofill(new Date(startTime));
            endTime = $tools.dateZerofill(new Date(endTime));
            var params = {
                start_time: startTime,
                end_time: endTime,
                busiTypeId: parseInt(businessType),
                hall: hall,
                channel: parseInt(businessChannel),
                channel_id: parseInt(busiChannel),
                phone: userPhone,
                status: parseInt(handleState),
                start_row: table.start,
                row_count: table.count,
                operator: operator
            };
            $tools.getData($main.url.getBusinessDetailsTableUrl, params, $main.setBusinessDetailsTable, null, $tools.configs.Env);
        }
        $tools.loading();
    },
    setBusinessDetailsTable: function(data) {
        $tools.closeLoading();
        if (!data) {
            return;
        }
        var base = $BusinessDetails.page;
        var total = "",
            grid = [],
            content = {};
        if ($main.isQuery) {
            total = "total_count";
            grid = data["CONTENT"]["grid"];
            content = $BusinessDetails.CONTENT;
        } else {
            total = "totalCount";
            grid = data["CONTENT"]["resultData"];
            content = $BusinessDetails2.CONTENT;
        }
        if (base.total != data["CONTENT"][total]) {
            base.total = data["CONTENT"][total];
            var baseDefault = {
                totalCount: base.total,
                showCount: base.showCount,
                limit: base.count,
                box: base.pageBox,
                callBack: $main.getBusinessDetailsTable
            };
            $tools.callBackPagination(baseDefault);
        }
        for (var i = 0, l = grid.length; i < l; i++) {
            if ($main.isQuery) {
                grid[i][content.timePeriod] = parseFloat(grid[i][content.timePeriod]).toFixed(3);
            } else {
                grid[i][content.timePeriod] = (parseFloat(grid[i][content.timePeriod]) / 1000).toFixed(3);
            }

        }
        $($main.box.businessDetailsTable).data("kendoGrid").dataSource.data(grid);
    },
    selectBusiness: function(node) {
        var id;
        if ($main.isQuery) {
            id = node["_id"];
        } else {
            id = node["id"];
        }
        if (id) {
            $main.getCommandWord(id);
        }
    },
    getCommandWord: function(id) {
        var busiChannel = $($main.box.businessChannel).val();
        if ($main.isQuery) {
            var businessType = $($main.box.businessType).val();

            params = {
                _id: id,
                grid1_id: parseInt(businessType),
                channel_id: parseInt(busiChannel)
            };
            $tools.getData($main.url.getCommandWordUrl, params, $main.setCommandWord, null, $tools.configs.Env);
        } else {
            var page = $Commandword2.page,
                params;
            params = {
                startIndex: page.start,
                pageStatus: page.count,
                alarmCommId: parseInt(id),
                channel_id: parseInt(busiChannel)
            };
            $tools.getData($main.url.getCommandWordUrl2, params, $main.setCommandWord);
        }
        $tools.loading();
    },
    setCommandWord: function(data) {
        $tools.closeLoading();
        if (!data) {
            return;
        }
        if ($main.isQuery) {
            for (var i = 0, l = data["CONTENT"].length; i < l; i++) {
                var msg = data["CONTENT"][i][$Commandword.CONTENT.msg];
                if (msg && (msg.indexOf("table") !== -1 || msg.indexOf("css") !== -1)) {
                    data["CONTENT"][i][$Commandword.CONTENT.msg] = "";
                }
            }
            $($main.box.commandWordTable).data("kendoGrid").dataSource.data(data["CONTENT"]);
            $($Commandword2.page.pageBox).hide();
        } else {
            for (var j = 0, l2 = data["CONTENT"]["resultData"].length; j < l2; j++) {
                var msg2 = data["CONTENT"]["resultData"][j][$Commandword2.CONTENT.msg];
                if (msg2 && (msg2.indexOf("table") !== -1 || msg2.indexOf("css") !== -1)) {
                    data["CONTENT"]["resultData"][j][$Commandword2.CONTENT.msg] = "";
                }
            }
            var base = $Commandword2.page,
                contentVal = $Commandword2.CONTENT,
                totalName = $Commandword2.totalCount;
            if (base.total != data["CONTENT"][totalName]) {
                base.total = data["CONTENT"][totalName];
                var baseDefault = {
                    totalCount: base.total,
                    showCount: base.showCount,
                    limit: base.count,
                    box: base.pageBox,
                    callBack: $main.getCommandWord
                };
                $tools.callBackPagination(baseDefault);
            }
            $($main.box.commandWordTable).data("kendoGrid").dataSource.data(data["CONTENT"]["resultData"]);
        }
    },
    getHref: function() {
        var box = $main.box;
        var businessType = $(box.businessType).val();
        var transactionChannel = $(box.businessChannel).val();
        var handleState = $(box.handleState).val();
        var paramsStr = decodeURI(window.location.href.split("?")[1]);
        if (businessType == "" || transactionChannel == "" || handleState == "") {
            return;
        }
        if (paramsStr == "undefined") {
            $main.clickQuery();
            return;
        }
        if ($main.hrefLoad) {
            return;
        }
        console.log(paramsStr);
        var paramsArray = paramsStr.split("&");
        var l = paramsArray.length;
        var params = {};
        for (var i = 0; i < l; i++) {
            params[paramsArray[i].split("=")[0]] = paramsArray[i].split("=")[1];
        }

        $(box.businessChannel).data("kendoComboBox").value(params["channel_id"]);
        $(box.handleState).data("kendoComboBox").value(1);
        $main.getBusinessTypeBox($main.box.businessChannel);
        //$(box.businessType).data("kendoComboBox").value(params["businessChannel"]);
        $(box.startTime).val(params["startTime"]);
        $(box.endTime).val(params["endTime"]);
        $BusinessDetails2.busiType = params["busiType"];
        $BusinessDetails2.businessDetailsId = params["id"];
        $main.getBusinessDetailsTable();
        $main.hrefLoad = true;
    }
};