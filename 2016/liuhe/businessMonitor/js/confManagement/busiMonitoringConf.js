$(function() {
    kendo.culture("zh-CN");
    $tools.getNav("../nav/header.html", ".header-nav-main", nav.setHeaderNav);
    $tools.getNav("../nav/management.html", ".content-left", nav.setLeftNav);
    main.ctrl.init();
});
var nav = {
    setHeaderNav: function() {
        $(".header-nav-bg5").addClass("action");
    },
    setLeftNav: function() {
        $(".content-left-nav2").addClass("action");
    },
};
var configs = {
    area: [{
        text: "广州市",
        _id: 0
    }, {
        text: "深圳市",
        _id: 1
    }, {
        text: "。。。",
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
        channel: "#channel",
        busiConfGrid: "#busiConfGrid"
    },
    busiConfGrid_text: {
        index: "序号",
        NAME: "业务名称",
        OPEN: "操作"
    },
    busiConfGrid: {
        NAME: "NAME",
        STATUS: "STATUS",
    }
};
var main = {
    view: {
        init: function() {
            this.setHeight();
            $tools.kendoComboBox(configs.box.area, "text", "_id", []);
            $tools.kendoComboBox(configs.box.channel, "text", "_id", []);
            this.createBusiConfGrid();
        },
        setHeight: function() {
            var heigth = $(window).height() - $(".header").height() - 1;
            $(".content-right").css("min-height", heigth);
        },
        createBusiConfGrid: function() {
            $(configs.box.busiConfGrid).kendoGrid({
                height: 400,
                columns: [{
                    title: configs.busiConfGrid_text.index,
                    width: 100,
                }, {
                    field: configs.busiConfGrid.NAME,
                    title: configs.busiConfGrid_text.NAME,
                }, {
                    field: configs.busiConfGrid.STATUS,
                    title: configs.busiConfGrid_text.STATUS,
                    width: 100,
                }, {
                    field: configs.busiConfGrid.STATUS,
                    title: configs.busiConfGrid_text.OPEN,
                    template: ""
                    width: 100,
                }]
            });
        }
    },
    ctrl: {
        init: function() {
            main.view.init();
            this.getArea();
            this.getChannel();
        },
        getArea: function() {
            main.model.getArea();
        },
        getChannel: function() {
            main.model.getChannel();
        },
        setArea: function(data) {
            var comboBox = $(configs.box.area).data("kendoComboBox");
            comboBox.dataSource.data(data);
            comboBox.value(data[0]["_id"]);
            this.getBusiConfList();
        },
        setChannel: function(data) {
            var comboBox = $(configs.box.channel).data("kendoComboBox");
            comboBox.dataSource.data(data);
            comboBox.value(data[0]["_id"]);
            this.getBusiConfList();
        },

        listenerAreaChange: function(){

        },
        getBusiConfList: function(){

        }   
    },
    model: {
        getArea: function() {
            main.ctrl.setArea(configs.area);
        },
        getChannel: function() {
            main.ctrl.setChannel(configs.channel);
        }
    }
};