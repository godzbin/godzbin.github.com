Ext.ns("ctrl");
Ext.onReady(function() {
	ctrl.main.init();
});
/**
 *结构
 * 主控制器
 * 业务概况
 * 明细监控
 * 业务追踪
 * 运营分析
 * 业务专题
 * 概况配置
 * 
 */
// 
var ctrl = {
	status: {},
	getNowTime: function() {
		model.more.getNowTime();
	},
	setNowTime: function(data) {
		if (!data.length) {
			data = ""
		}
		var str1 = data.split(" ")[0];
		var str2 = data.split(" ")[1];
		if (str1 && str2) {
			var arr1 = str1.split("-");
			var arr2 = str2.split(":");
			configs.endTimeStr = [arr1[0], arr1[1] - 1, arr1[2], arr2[0], arr2[1], arr2[2]];
		}
	},
	getStatus: function() {
		model.more.getStatus();
	},
	setStatus: function(data) {
		for (var i = 0, l = data.length; i < l; i++) {
			ctrl.status[data[i]["_id"]] = data[i]["text"];
		}
	},
	getTime: function() {
		var store = Ext.create("Ext.data.Store", {
			storeId: "time",
			fields: [configs.dimension.key, configs.dimension.value]
		});
		model.more.getTime();
	},
	setTime: function(data) {
		var store = Ext.StoreMgr.get("time");
		store.loadData(data);
	},
	getArea: function() {
		var store = Ext.create("Ext.data.Store", {
			storeId: "area",
			fields: [configs.dimension.key, configs.dimension.value]
		});
		model.more.getArea();
	},
	setArea: function(data) {
		var store = Ext.StoreMgr.get("area");
		store.loadData(data);
		if (Ext.getCmp(configs.busiProfile.busiProfileArea) && data[0]) {
			Ext.getCmp(configs.busiProfile.busiProfileArea).setValue(data[0]["_id"])
		}
	},
	getChannel: function() {
		var store = Ext.create("Ext.data.Store", {
			storeId: "channel",
			fields: [configs.dimension.key, configs.dimension.value]
		});
		model.more.getChannel();
	},
	setChannel: function(data) {
		var store = Ext.StoreMgr.get("channel");
		store.loadData(data);
	},
	getContent: function() {
		var content = Ext.getCmp("content");
		return content;
	},
	getContentWidth: function() {
		var content = ctrl.getContent();
		var contentWidth = content.getWidth();
		return contentWidth;
	},
	// ctrl.setContent
	clickMenu: function(_id) {
		if (!this._id) {
			if (!this.component) {
				this._id = _id;
			}
		}
		if (this._id == "menu1") {
			return;
		}
		ctrl.contentHide();
		if (!this._id) {
			this._id = this.component._id;
		}
		if (this._id == "menu2") {
			ctrl.openBusiTrack();
		} else if (this._id == "menu3") {
			ctrl.openOperationAnalysis();
		} else if (this._id == "menu4") {
			ctrl.openBusiTopics();
		} else if (this._id == "menu1chlid1") {
			ctrl.openBusiMoitor();
		} else if (this._id == "menu1chlid2") {
			ctrl.openDetailMonitor();
		} else if (this._id == "openConfig") {
			ctrl.openBusiConfig();
		}
	},
	menuChange: function(menuLi) {
		var menus = Ext.getCmp("mainMenu").items.items;
		for (i in menus) {

			if (menus[i].hasCls("action")) {
				menus[i].removeCls("action");
			}
		}
		var menu = Ext.getCmp(menuLi);
		menu.addCls("action");
		menu.focus();
	},
	contentHide: function() {
		var content = this.getContent();
		var items = content.items.items;
		var contentTools = Ext.getCmp("contentTools");
		var toolsItems = contentTools.items.items;
		for (var i = 0, l = items.length; i < l; i++) {
			var children = items[i];
			var toolsChildren = toolsItems[i];
			children.hide();
			toolsChildren.hide();
		}
	},
	openBusiMoitor: function() {
		var content = ctrl.getContent();
		var contentTools = Ext.getCmp("contentTools");
		ctrl.menuChange("menu1");
		if (!Ext.getCmp(configs.pageId.busiProfile)) {
			view.busiMoitor.busiProfile.content();
			view.busiMoitor.busiProfile.tools();
			contentTools.add(Ext.getCmp(configs.pageId.busiProfile + "tools"));
			content.add(Ext.getCmp(configs.pageId.busiProfile));
			ctrl.busiMoitor.run();
		}
		Ext.getCmp(configs.pageId.busiProfile + "tools").show();
		Ext.getCmp(configs.pageId.busiProfile).show();
	},
	openDetailMonitor: function() {
		var content = ctrl.getContent();
		var contentTools = Ext.getCmp("contentTools");
		ctrl.menuChange("menu1");
		if (!Ext.getCmp(configs.pageId.detailMonitor)) {
			view.busiMoitor.detailMonitor.content();
			view.busiMoitor.detailMonitor.tools();
			contentTools.add(Ext.getCmp(configs.pageId.detailMonitor + "tools"));
			content.add(Ext.getCmp(configs.pageId.detailMonitor));
			ctrl.detailMonitor.run();
		}
		Ext.getCmp(configs.pageId.detailMonitor + "tools").show();
		Ext.getCmp(configs.pageId.detailMonitor).show();
	},
	openBusiConfig: function() {
		var content = ctrl.getContent();
		var contentTools = Ext.getCmp("contentTools");
		ctrl.menuChange("menu1");
		if (!Ext.getCmp(configs.pageId.busiConfig)) {
			view.busiConfig.content();
			view.busiConfig.tools();
			contentTools.add(Ext.getCmp(configs.pageId.busiConfig + "tools"));
			content.add(Ext.getCmp(configs.pageId.busiConfig));
			ctrl.busiConfig.run();
		}
		Ext.getCmp(configs.pageId.busiConfig + "tools").show();
		Ext.getCmp(configs.pageId.busiConfig).show();
	},
	openBusiTrack: function() {
		var content = ctrl.getContent();
		var contentTools = Ext.getCmp("contentTools");
		ctrl.menuChange("menu2");
		if (!Ext.getCmp(configs.pageId.busiTrack)) {
			view.busiTrack.content();
			view.busiTrack.tools();
			contentTools.add(Ext.getCmp(configs.pageId.busiTrack + "tools"));
			content.add(Ext.getCmp(configs.pageId.busiTrack));
			ctrl.busiTrack.run();
		}
		Ext.getCmp(configs.pageId.busiTrack + "tools").show();
		Ext.getCmp(configs.pageId.busiTrack).show();
	},
	openOperationAnalysis: function() {
		var content = ctrl.getContent();
		var contentTools = Ext.getCmp("contentTools");
		ctrl.menuChange("menu3");
		if (!Ext.getCmp(configs.pageId.operationAnalysis)) {
			view.operationAnalysis.content();
			view.operationAnalysis.tools();
			contentTools.add(Ext.getCmp(configs.pageId.operationAnalysis + "tools"));
			content.add(Ext.getCmp(configs.pageId.operationAnalysis));
			ctrl.operationAnalysis.run();
		}
		Ext.getCmp(configs.pageId.operationAnalysis + "tools").show();
		Ext.getCmp(configs.pageId.operationAnalysis).show();
	},
	openBusiTopics: function() {
		var content = ctrl.getContent();
		var contentTools = Ext.getCmp("contentTools");
		ctrl.menuChange("menu4");
		if (!Ext.getCmp(configs.pageId.busiTopics)) {
			view.busiTopics.content();
			view.busiTopics.tools();
			contentTools.add(Ext.getCmp(configs.pageId.busiTopics + "tools"));
			content.add(Ext.getCmp(configs.pageId.busiTopics));
			ctrl.busiTopics.run();
		}
		Ext.getCmp(configs.pageId.busiTopics + "tools").show();
		Ext.getCmp(configs.pageId.busiTopics).show();
	}
};
ctrl.main = {
	init: function() {
		view.main.interface();
		ctrl.getTime();
		ctrl.getArea();
		ctrl.getChannel();
		ctrl.getStatus();
		ctrl.getNowTime();
		// ctrl.openBusiTrack();
		// ctrl.openOperationAnalysis();
		ctrl.openBusiMoitor();
		// ctrl.openBusiTopics();
		// ctrl.openDetailMonitor();
	}
};

// 业务概况----------------------------------
ctrl.busiMoitor = {
	intervalTopRealTime: true,
	channelId: 1,
	run: function() {
		ctrl.busiMoitor.initChart();
		ctrl.busiMoitor.setTopRealTime();
		setInterval(ctrl.busiMoitor.setTopRealTime, 1000 * 60);
		ctrl.busiMoitor.getTime();
	},
	setTopRealTime: function() {
		if (!ctrl.busiMoitor.intervalTopRealTime) {
			return;
		}
		var $this = ctrl.busiMoitor;
		// var topRealTime = $("#topRealTime");
		// var date = new Date();
		// var time = tools.dateZerofill(date).substring(0, 16);
		// time = time + ":00";

		var cycle = Ext.getCmp(configs.busiProfile.busiProfileTime);
		if (Ext.getCmp(configs.pageId.busiProfile).isHidden()) {
			return;
		}
		if (topRealTime && Ext.getCmp(configs.busiProfile.busiProfileTime)) {
			model.busiMoitor.getNowTime();
			$this.busiProfileTimeChange();
		}
	},
	setNowTime: function(data) {
		var topRealTime = $("#topRealTime");
		var time = data;
		topRealTime.html(configs.msg.topRealTime + time);
	},
	initChart: function() {
		busiProfileChart.gauge_chart1("#busiProfileHandlingGauge");
		busiProfileChart.gauge_chart2("#busiProfileRateGauge");
		busiProfileChart.gauge_chart3("#busiProfileDurationGauge");
		busiProfileChart.gauge_chart4("#busiProfileAlarmGauge");
		busiProfileChart.pie_chart1("#busiProfileHandlingChart");
		busiProfileChart.pie_chart2("#busiProfileAlarmChart");
		busiProfileChart.column_chart1("#busiProfileRateChart");
		busiProfileChart.column_chart2("#busiProfileDurationChart");
		busiProfileChart.line_chart1("#busiHandlingTrend");
		busiProfileChart.line_chart2("#busiRateTrend");
		busiProfileChart.line_chart3("#busiDurationTrend");
	},
	getTime: function() {
		model.busiMoitor.getTime();
	},
	setTime: function(data) {
		var comboBox = Ext.getCmp(configs.busiProfile.busiProfileTime);
		var store = comboBox.getStore();
		store.loadData(data);
		var thisValue = data[1];
		if (thisValue) {
			comboBox.setValue(thisValue[configs.dimension.value]);
		}
		// var $this = ctrl.busiMoitor;
		// $this.busiProfileTimeChange();
	},
	busiProfileTimeChange: function() {
		var time = Ext.getCmp(configs.busiProfile.busiProfileTime).getValue();
		var $this = ctrl.busiMoitor;
		if (typeof time == "object") {
			return;
		}
		var params = {
			time_range_id: time,
			now: tools.dateZerofill(configs.nowTime())
		};
		$this.mainTop.getMainTop(params);
		$this.getBusiProfileAll();
	},
	mainTop: {
		getMainTop: function(params) {
			model.busiMoitor.getBusiProfileChart(params);
		},
		setMainTop: function(data) {
			var data = data || [];
			var $this = ctrl.busiMoitor.mainTop;
			var yyt = data["yyt"];
			var dq = data["dq"];
			var handling = {
				value: yyt["busi_amount"] + dq["busi_amount"],
				value1: yyt["busi_amount"],
				value2: dq["busi_amount"]
			};
			var total = yyt["busi_amount"] + dq["busi_amount"];
			var fail_amount = yyt["fail_amount"] + dq["fail_amount"];
			var durationValue = 0;
			if (dq["busi_amount"] == 0) {
				durationValue = parseFloat((yyt["busi_avg_time"] * configs.testTime).toFixed(2)) || 0
			} else {
				durationValue = parseFloat(((yyt["busi_avg_time"] + dq["busi_avg_time"]) / 2 / configs.testTime).toFixed(2)) || 0
			}
			var rate = {
				value: parseFloat(((total - fail_amount) / total * 100).toFixed(2)) || 0,
				value1: parseFloat(((yyt["busi_amount"] - yyt["fail_amount"]) / yyt["busi_amount"] * 100).toFixed(2)) || 0,
				value2: parseFloat(((dq["busi_amount"] - dq["fail_amount"]) / dq["busi_amount"] * 100).toFixed(2)) || 0
			};
			var duration = {
				value: durationValue,
				value1: parseFloat((yyt["busi_avg_time"] * configs.testTime).toFixed(2)) || 0,
				value2: parseFloat((dq["busi_avg_time"] * configs.testTime).toFixed(2)) || 0
			};
			$this.setMainTopBusiProfileHandlingChart(handling);
			$this.setMainTopBusiProfileRateChart(rate);
			$this.setMainTopBusiProfileDurationChart(duration);
			// $this.setMainTopBusiProfileAlarmChart(alarm);
		},
		setMainTopBusiProfileHandlingChart: function(data) {
			var value = data["value"] || 0;
			var value1 = data["value1"] || 0;
			var value2 = data["value2"] || 0;
			var values = [{
				name: '营业厅',
				y: value1,
				color: '#8FC320'
			}, {
				name: '电渠',
				y: value2,
				color: '#07913B'
			}];
			var label = Ext.getCmp("busiProfileHandlingLabel");
			var gauge = $("#busiProfileHandlingGauge").highcharts();
			var chart = $("#busiProfileHandlingChart").highcharts();
			label.setText(value);


			var time = Ext.getCmp(configs.busiProfile.busiProfileTime).getValue();
			var max = 0;
			max = configs.guageMaxValue.busiMoitor[time];
			if (configs.guageMaxValue.busiMoitor[time]) {
				var setMax = tools.setMax(max);
				gauge.yAxis[0].update(setMax);
				var setPlotBands = tools.setPlotBands(max);
				gauge.yAxis[0].removePlotBand("gauge_chart1_1");
				gauge.yAxis[0].removePlotBand("gauge_chart1_2");
				gauge.yAxis[0].removePlotBand("gauge_chart1_3");
				gauge.yAxis[0].addPlotBand(setPlotBands[0]);
				gauge.yAxis[0].addPlotBand(setPlotBands[1]);
				gauge.yAxis[0].addPlotBand(setPlotBands[2]);
			}
			gauge.series[0].setData([value]);
			chart.series[0].setData(values);
		},
		setMainTopBusiProfileRateChart: function(data) {
			var value = data["value"] || 0;
			var value1 = data["value1"] || 0;
			var value2 = data["value2"] || 0;
			var label = Ext.getCmp("busiProfileRateLabel");
			var gauge = $("#busiProfileRateGauge").highcharts();
			var chart = $("#busiProfileRateChart").highcharts();
			label.setText(value + "%");
			gauge.series[0].setData([value]);
			chart.series[0].setData([value1]);
			chart.series[1].setData([value2]);
		},
		setMainTopBusiProfileDurationChart: function(data) {
			var value = data["value"] || 0;
			var value1 = data["value1"] || 0;
			var value2 = data["value2"] || 0;
			var label = Ext.getCmp("busiProfileDurationLabel");
			var gauge = $("#busiProfileDurationGauge").highcharts();
			var chart = $("#busiProfileDurationChart").highcharts();
			label.setText(value + "s");
			gauge.series[0].setData([value]);
			chart.series[0].setData([value1]);
			chart.series[1].setData([value2]);
		},
		setMainTopBusiProfileAlarmChart: function(data) {
			var value = data["value"] || 0;
			var value1 = data["value1"] || 0;
			var value2 = data["value2"] || 0;
			var values = [{
				name: '营业厅',
				y: value1,
				color: '#8FC320'
			}, {
				name: '电渠',
				y: value2,
				color: '#07913B'
			}];
			var label = Ext.getCmp("busiProfileAlarmLabel");
			var gauge = $("#busiProfileAlarmGauge").highcharts();
			var chart = $("#busiProfileAlarmChart").highcharts();
			label.setText(value);
			gauge.series[0].setData([value]);
			chart.series[0].setData(values);

		}
	},
	topButtonChanger: function() {
		// $(".busiProfileOpBtn").removeClass("action");
		Ext.getCmp("busiProfileOpBtnStart").removeCls("action");
		Ext.getCmp("busiProfileOpBtnStop").removeCls("action");
		this.addCls("action");
		if (this.name == "stop") {
			ctrl.busiMoitor.intervalTopRealTime = false;
		} else {
			ctrl.busiMoitor.intervalTopRealTime = true;
		}
		return false;
	},
	getBusiProfileChannelBox: function() {
		var panel = Ext.getCmp("busiProfileChannel");
		return panel;
	},
	busiProfileChannelChange: function() {
		var $this = ctrl.busiMoitor;
		var channelBox = $this.getBusiProfileChannelBox();
		var items = channelBox.items.items;
		for (i in items) {
			if (items[i].hasCls("action")) {
				items[i].removeCls("action");
			}
		}
		this.addCls("action");
		$this.channelId = this.channelId;
		$this.getBusiProfileAll();
	},
	getBusiProfileAll: function() {
		var $this = ctrl.busiMoitor;
		var time = Ext.getCmp(configs.busiProfile.busiProfileTime).getValue();
		var params = {
			channel: $this.channelId,
			time_range_id: time,
			now: tools.dateZerofill(configs.nowTime())
		};
		// model.busiMoitor.getBusiProfileAll(params);
		$this.getBusiProfile(params);
		$this.getBusiAlarm(params);
		$this.getTrendAnalysis(params);
	},
	// setBusiProfileAll: function(data) {
	// 	var data = data || [];
	// 	var busiProfileData = data["busiProfile"];
	// 	var busiAlarmData = data["busiAlarm"];
	// 	var $this = ctrl.busiMoitor;
	// 	$this.setBusiProfile(busiProfileData);
	// 	$this.setBusiAlarm(busiAlarmData);
	// },
	getBusiProfile: function(params) {
		model.busiMoitor.getBusiProfile(params);
	},
	getBusiAlarm: function() {
		var $this = ctrl.busiMoitor;
		var time = Ext.getCmp(configs.busiProfile.busiProfileTime).getValue();
		var area = Ext.getCmp(configs.busiProfile.busiProfileArea).getValue();
		var params = {
			channelId: $this.channelId,
			city: area
		};
		model.busiMoitor.getBusiAlarm(params);
	},
	setBusiProfile: function(data) {
		var data = data || [];
		var store = Ext.StoreMgr.get("busiProfileGrid");
		store.loadData(data);
	},
	setBusiAlarm: function(data) {
		var data = data || [];
		var store = Ext.StoreMgr.get("busiAlarmGrid");
		store.loadData(data["DATA_LIST"]);
		var alarm = {
			value: data["TOTAL_COUNT"] || 0,
			value1: data["TOTAL_COUNT"] || 0,
			value2: 0
		}
		ctrl.busiMoitor.mainTop.setMainTopBusiProfileAlarmChart(alarm);
	},
	getTrendAnalysis: function(params) {
		model.busiMoitor.getTrendAnalysis(params);
	},
	setTrendAnalysis: function(data) {
		console.log(data);
		var handling = [];
		var duration = [];
		var rate = [];
		var data = data || {
			category: [],
			amount: [],
			busi_time_data: [],
			succ_rate: []
		};
		var y = data["category"];
		var $this = ctrl.busiMoitor;
		var index = 0;
		for (i in data["amount"]) {
			handling.push({
				name: i,
				color: configs.Colors[index],
				data: data["amount"][i]
			});
			index++;
		}
		index = 0;
		for (i in data["busi_time_data"]) {
			for (var j = 0, d_l = data["busi_time_data"][i].length; j < d_l; j++) {
				if (data["busi_time_data"][i][j]) {
					data["busi_time_data"][i][j] = data["busi_time_data"][i][j] * configs.testTime
				}
			}
			duration.push({
				name: i,
				color: configs.Colors[index],
				data: data["busi_time_data"][i]
			});
			index++;
		}
		index = 0;
		for (i in data["succ_rate"]) {
			rate.push({
				name: i,
				color: configs.Colors[index],
				data: data["succ_rate"][i]
			});
			index++;
		}
		$this.setTrendAnalysisChart("#busiHandlingTrend", handling, y);
		$this.setTrendAnalysisChart("#busiDurationTrend", duration, y);
		$this.setTrendAnalysisChart("#busiRateTrend", rate, y);
	},
	clickTrend: function(busiName, time) {
		var obj = ctrl.busiTrack;
		obj.isJump = true;
		obj.jumpParam.busiName = busiName;
		obj.jumpParam.time = time;
		ctrl.clickMenu("menu2");
		obj.busiMoitorJump();
	},
	setTrendAnalysisChart: function(elId, data, y) {
		var chart = $(elId).highcharts();
		var series = chart.series;
		var $this = ctrl.busiMoitor;
		$this.removeSeries(series);
		chart.xAxis[0].setCategories(y);
		for (var i = 0, l = data.length; i < l; i++) {
			chart.addSeries(data[i]);
		}
	},
	removeSeries: function(series) {
		for (var l = series.length, i = l - 1; i >= 0; i--) {
			if (series[i]) {
				series[i].remove();
			}
		}
	}
};
// 业务概况 结束----------------------------------
// 
// 明细监控----------------------------------------
ctrl.detailMonitor = {
	intervalTopRealTime: true,
	channelId: 1,
	BusiDetailGrid: [],
	BusiDetailRadio: [],
	busiChannel: {},
	mainLeftRadio: [],
	rateList: {},
	timeList: [],

	run: function() {
		var $this = ctrl.detailMonitor;
		$this.initChart();
		$this.setTopRealTime();
		$this.getBusiType();
		$this.getChannel();
		setInterval(ctrl.detailMonitor.setTopRealTime, 1000 * 60);
	},
	getBusiness: function(busiId) {
		ctrl.clickMenu("menu2");
		var obj = ctrl.busiTrack;
		obj.isJump = true;

		var $this = ctrl.detailMonitor;
		var params = {
			"channelId": $this.channelId,
			"id": busiId
		}
		model.detailMonitor.getBusiness(params);
	},
	setBusiness: function(data) {
		var obj = ctrl.busiTrack;
		var setObj = obj.jumpParam;
		console.log(data);
		setObj["busiName"] = data["M_busi_name"];
		setObj["ts"] = data["endTime"];
		setObj["hall"] = data["channel"];
		setObj["phone"] = data["user"];
		setObj["operator"] = data["operator"];
		setObj["timePeriod"] = data["M_effective_time"];
		setObj["status"] = data["M_QB_status"];
		setObj["_id"] = data["_id"];
		setObj["busiName_id"] = data["busiName_id"];
		obj.isJump = true;
		obj.jumpType = "detailMonitor";
		obj.detailMonitorJump();
	},
	topButtonChanger: function() {
		Ext.getCmp("detailMonitorOpBtnStart").removeCls("action");
		Ext.getCmp("detailMonitorOpBtnStop").removeCls("action");
		this.addCls("action");
		if (this.name == "stop") {
			ctrl.detailMonitor.intervalTopRealTime = false;
		} else {
			ctrl.detailMonitor.intervalTopRealTime = true;
		}
		return false;
	},
	getBusiProfileChannelBox: function() {
		return Ext.getCmp("detailMonitorChannel");
	},
	busiProfileChannelChange: function() {
		var $this = ctrl.detailMonitor;
		var channelBox = $this.getBusiProfileChannelBox();
		var items = channelBox.items.items;
		for (i in items) {
			if (items[i].hasCls("action")) {
				items[i].removeCls("action");
			}
		}
		this.addCls("action");
		$this.channelId = this.channelId;
		$this.initPage();
	},
	initChart: function() {
		detailMonitorChart.areaChart("#detailMonitorChart1");
		detailMonitorChart.solidgauge("#detailMonitorChart2");
		detailMonitorChart.chart3("#detailMonitorChart3");
	},
	initPage: function() {
		var $this = ctrl.detailMonitor;
		$this.initChart();
		$this.BusiDetailGrid = [];
		Ext.getCmp("busiGridBox").removeAll();
	},
	tagSelect: function(comb, record) {
		var values = this.getValue();
		var $this = this;
		if (values.length > 3) {
			setTimeout(function() {
				var values2 = values.pop();
				$this.setValue(values);
			}, 1);
		}
	},
	getAreaValue: function() {
		var area = Ext.getCmp(configs.detailMonitor.detailMonitorArea).getValue();
		return area;
	},
	setTopRealTime: function() {
		if (!ctrl.detailMonitor.intervalTopRealTime) {
			return;
		}
		var $this = ctrl.detailMonitor;

		if (!Ext.getCmp(configs.pageId.detailMonitor) || Ext.getCmp(configs.pageId.detailMonitor).isHidden()) {
			return;
		}

		model.detailMonitor.getNowTime();
		$this.getDetailMonitor();
	},
	setNowTime: function(data) {
		var topRealTime = $("#detailMonitorTopRealTime");
		var time = data;
		topRealTime.html(configs.msg.topRealTime + time);
	},
	getChannel: function() {
		var $this = ctrl.detailMonitor;
		var area = $this.getAreaValue();
		var params = {
			"city": area,
			"channelId": $this.channelId
		}
		model.detailMonitor.getChannel(params);
	},
	setChannel: function(data) {
		var $this = ctrl.detailMonitor;
		for (var i = 0, l = data.length; i < l; i++) {
			var name = data[i]["name"];
			var channel = data[i]["channel"];
			$this.busiChannel[channel] = name;
		}
		var box = Ext.getCmp(configs.detailMonitor.detailMonitorTC);
		var store = box.getStore();
		data.unshift({
			channel: "all",
			name: "全部渠道"
		});
		Ext.Array.remove(data, data[data.length - 1]);
		store.loadData(data);

		box.setValue(data[0]["channel"]);
		$this.getDetailMonitor();
	},
	getBusiType: function() {
		var $this = ctrl.detailMonitor;
		var area = $this.getAreaValue();
		var params = {
			channel: $this.channelId,
			city: area
		};
		model.detailMonitor.getBusiType(params);
	},
	setBusiType: function(data) {
		var $this = ctrl.detailMonitor;
		var busiType = Ext.getCmp(configs.detailMonitor.detailMonitorBusiType);
		var stroe = Ext.StoreMgr.get(configs.detailMonitor.detailMonitorBusiType);
		// var stroe = busiType.getStore();
		var datas = [];
		for (var i = 0, l = data.length; i < l; i++) {
			datas.push({
				text: data[i]["busi_name"],
				_id: data[i]["busi_name"]
			});
		}
		stroe.loadData(datas);
		busiType.setValue(configs.busiNameTag);
		$this.getDetailMonitor();
	},
	selectBtnClick: function() {
		var $this = ctrl.detailMonitor;
		var busiTypeValue = Ext.getCmp(configs.detailMonitor.detailMonitorBusiType).getValue();
		var transactionChannel = Ext.getCmp(configs.detailMonitor.detailMonitorTC).getValue();
		if (busiTypeValue.length == 0) {
			tools.toast("请选择业务类型");
			return;
		}
		if (!transactionChannel) {
			tools.toast("请选择交易渠道");
			return;
		}
		$this.initChart();
		$this.getDetailMonitor();
	},
	getDetailMonitor: function() {
		var $this = ctrl.detailMonitor;
		var busiTypeValue = Ext.getCmp(configs.detailMonitor.detailMonitorBusiType).getValue();
		var transactionChannel = Ext.getCmp(configs.detailMonitor.detailMonitorTC).getValue();
		var area = $this.getAreaValue();
		if (busiTypeValue.length == 0) {
			return;
		}
		if (!transactionChannel) {
			return;
		}
		if (transactionChannel == "all") {
			transactionChannel = undefined;
		}
		$this.getBusiDetailGrid(busiTypeValue, transactionChannel, area);
		$this.setBusiNameRadio(busiTypeValue);
		// $this.getBusiDetailChart(busiTypeValue, transactionChannel, area);
		var params = {
			busiName: busiTypeValue.join(","),
			channelId: $this.channelId,
			busiChannel: transactionChannel,
			city: area
		};
		$this.getRateChart(params);
		$this.getStatusChart(params);

	},
	setMainLeftBusiNameRadio: function(busiTypeValue) {
		var $this = ctrl.detailMonitor;
		var form = Ext.getCmp("mainLeftBusiNameRadio");
		for (var j = 0, r_l = $this.mainLeftRadio.length; j < r_l; j++) {
			var isHasRadio = false;
			for (var i = 0, l = busiTypeValue.length; i < l; i++) {
				if ($this.mainLeftRadio[j] == busiTypeValue[i]) {
					var isHasRadio = true;
				}
			}
			if (!isHasRadio) {
				var radio = Ext.getCmp($this.mainLeftRadio[j] + "mainLeftRadio");
				form.remove(radio);
				Ext.Array.remove($this.mainLeftRadio, $this.mainLeftRadio[j]);
			}
		}
		for (var i = 0, l = busiTypeValue.length; i < l; i++) {
			if (!Ext.getCmp(busiTypeValue[i] + "mainLeftRadio")) {
				var newRadio = {
					id: busiTypeValue[i] + "mainLeftRadio",
					xtype: "radiofield",
					boxLabel: busiTypeValue[i],
					name: 'busiName',
					width: 100,
					busiName: busiTypeValue[i],
					inputValue: busiTypeValue[i],
					margin: "0 10 0 10",
					listeners: {
						change: ctrl.detailMonitor.mainLeftRadioChange
					}
				};
				form.add(newRadio);
				$this.mainLeftRadio.push(busiTypeValue[i]);
			}
		}
		var values = form.getValues()
		if (!values["busiName"]) {
			if (form.getComponent(0)) {
				form.getComponent(0).setValue(true);
				form.getComponent(0).focus();
			}
		} else {
			ctrl.detailMonitor.setSinlgRateChart(values["busiName"]);
		}
	},

	getRateChart: function(params) {
		model.detailMonitor.getRateChart(params);
	},
	setRateChart: function(data) {
		var $this = ctrl.detailMonitor;
		// var chartData = [];
		var time = data["endTime"] || 0;
		$this.timeList = [];
		var length = 0;
		var color = ["#7FC533", "#48BBE7", "#FF4800"];
		data["dataList"] = data["dataList"] || [];
		if (data["dataList"] && data["dataList"].length > 0) {
			length = data["dataList"][0]["rates"].length;
			$this.timeList = $this.getChartTimeList(time, length);
		}
		for (var i = 0, l = data["dataList"].length; i < l; i++) {
			$this.rateList[data["dataList"][i]["busiName"]] = {
				color: color[i],
				name: data["dataList"][i]["busiName"],
				data: data["dataList"][i]["rates"]
			};
		}
		var busiTypeValue = Ext.getCmp(configs.detailMonitor.detailMonitorBusiType).getValue();
		$this.setMainLeftBusiNameRadio(busiTypeValue);

	},
	mainLeftRadioChange: function() {
		if (!this.getValue()) {
			return;
		}
		var $this = ctrl.detailMonitor;
		var busiName = this.busiName;
		$this.setSinlgRateChart(busiName);
	},

	setSinlgRateChart: function(busiName) {
		var $this = ctrl.detailMonitor;
		if ($this.rateList[busiName]) {
			var chart = $("#detailMonitorChart1").highcharts();
			chart.xAxis[0].setCategories($this.timeList);
			var series = chart.series;
			$this.removeSeries(series);
			chart.addSeries($this.rateList[busiName]);
		}
	},
	getChartTimeList: function(time, length) {
		var times = [];
		for (var i = 0; i < length; i++) {
			var min = i * 60 * 1000;
			var newTime = "";
			if (i % 5 == 0) {
				newTime = Ext.Date.format(new Date((time * 1000) - min), 'H:i');
			}
			times.unshift(newTime);
		}
		return times;

	},
	getStatusChart: function(params) {
		model.detailMonitor.getStatusChart(params);
	},
	initLable: function() {
		$(".title1").html("无").hide();
		$(".title2").html("无").hide();
		$(".title3").html("无").hide();
	},
	setStatusChart: function(data) {
		var $this = ctrl.detailMonitor;
		var chart = $("#detailMonitorChart2").highcharts();
		var series = chart.series;
		$this.removeSeries(series);
		var addSeries = [];
		var successStatus = 0;
		$this.initLable();
		for (i in ctrl.status) {
			if (ctrl.status[i] == "成功") {
				successStatus = i;
			}
		}
		for (var i = 0, l = data.length; i < l; i++) {
			var arr = data[i];

			if (arr["statusList"] && arr["statusList"].length > 0) {
				var rate = 0;
				for (var z = 0, s_l = arr["statusList"].length; z < s_l; z++) {
					if (arr["statusList"][z]["status"] == successStatus) {
						rate = (arr["statusList"][z]["rate"] * 100)
					}
				}
				var html = "<div class='title_p'><p style='color:#999;'>" + arr["busiName"] + "</p>" + "<p style='font-size: 1.2em;color:#ADD664;'>成功率：" + rate + "%</p></div>";
				$(".title" + (i + 1)).html(html).show();
			}
			if (!arr["statusList"] || arr["statusList"].length == 0) {
				var html = "<div class='title_p'><p style='color:#999;'>" + arr["busiName"] + "</p>" + "<p style='font-size: 1.2em;color:#ADD664;'>成功率：无</p></div>";
				$(".title" + (i + 1)).html(html).show();
				var params = [{
					index: i,
					mainName: arr["busiName"],
					name: "数据",
					y: 100,
					value: 0,
					color: "#DDD"
				}]
			} else {
				var params = $this.getStatusChartParams(arr["busiName"], arr["statusList"], i);
			}
			for (var j = 0, p_l = params.length; j < p_l; j++) {
				addSeries.push(params[j]);
			}
		}
		for (var j = 0, a_l = addSeries.length; j < a_l; j++) {
			var addData = $this.setSingleStatusChart(addSeries[j])
			chart.addSeries(addData);
		}
	},
	getStatusChartParams: function(mainName, arr, index) {
		var params = [];
		var l = arr.length;

		for (var i = l - 1; i >= 0; i--) {
			var y = 0;
			for (var j = 0; j <= i; j++) {
				y += arr[j]["rate"];
			}

			var paramsNode = {
				index: index,
				mainName: mainName,
				name: ctrl.status[arr[i]["status"]],
				y: y * 100,
				value: arr[i]["rate"] * 100,
				color: configs.statusColor[arr[i]["status"]]
			};
			params.push(paramsNode);
		}
		return params;
	},
	setSingleStatusChart: function(params) {
		var data = {
			name: params.mainName,
			borderColor: params.color,
			data: [{
				color: params.color,
				radius: (25 * (params.index + 2)) + '%',
				innerRadius: (25 * (params.index + 2)) + '%',
				y: params.y,
				name: params.name,
				value: params.value
			}]
		};
		return data;
	},
	removeSeries: function(series) {
		for (var l = series.length, i = l - 1; i >= 0; i--) {
			if (series[i]) {
				series[i].remove();
			}
		}
	},
	setBusiNameRadio: function(busiTypeValue) {
		var $this = ctrl.detailMonitor;
		var form = Ext.getCmp("busiNameRadio");
		for (var j = 0, r_l = $this.BusiDetailRadio.length; j < r_l; j++) {
			var isHasRadio = false;
			for (var i = 0, l = busiTypeValue.length; i < l; i++) {
				if ($this.BusiDetailRadio[j] == busiTypeValue[i]) {
					var isHasRadio = true;
				}
			}
			if (!isHasRadio) {
				var radio = Ext.getCmp($this.BusiDetailRadio[j] + "radio");
				form.remove(radio);
				Ext.Array.remove($this.BusiDetailRadio, $this.BusiDetailRadio[j]);
			}
		}
		for (var i = 0, l = busiTypeValue.length; i < l; i++) {
			if (!Ext.getCmp(busiTypeValue[i] + "radio")) {
				var mewRadio = {
					id: busiTypeValue[i] + "radio",
					xtype: "radiofield",
					boxLabel: busiTypeValue[i],
					name: 'busiName',
					width: 100,
					inputValue: busiTypeValue[i],
					margin: "0 10 0 10",
					listeners: {
						change: ctrl.detailMonitor.getBusiDetailChartName
					}
				};
				form.add(mewRadio);
				$this.BusiDetailRadio.push(busiTypeValue[i]);
			}
		}
		var values = form.getValues()
		if (!values["busiName"]) {
			if (form.getComponent(0)) {
				form.getComponent(0).setValue(true);
				form.getComponent(0).focus();
			}
		} else {
			ctrl.detailMonitor.getBusiDetailChart(values["busiName"]);
		}
	},
	getBusiDetailChartName: function() {

		var $this = ctrl.detailMonitor;
		if (!this.getValue()) {
			return;
		}
		// var value = this.getValue();
		var busiTypeValue = this.inputValue;
		$this.getBusiDetailChart(busiTypeValue);

	},
	getBusiDetailChart: function(busiName) {
		var $this = ctrl.detailMonitor;
		var transactionChannel = Ext.getCmp(configs.detailMonitor.detailMonitorTC).getValue();
		var area = $this.getAreaValue();
		if (transactionChannel == "all") {
			transactionChannel = undefined;
		}
		var params = {
			busiName: busiName,
			channelId: $this.channelId,
			busiChannel: transactionChannel,
			city: area
		}
		model.detailMonitor.getBusiDetailChart(params);

	},
	setBusiDetailChart: function(data) {
		var chart = $("#detailMonitorChart3").highcharts();
		var $this = ctrl.detailMonitor;
		var status = ctrl.status;
		$this.removeSeries(chart.series);
		if (data[0]) {
			var min = data[0]["endTime"];
		}
		for (i in status) {
			if (i != 3) {
				var chartData = {
					name: status[i],
					color: configs.statusColor[i],
					data: []
				};
				for (var j = 0, l = data.length; j < l; j++) {
					if (j >= 0) {
						if (data[j]["endTime"] < min) {
							min = data[j]["endTime"]
						}
					}
					if (i == data[j]["M_QB_status"]) {
						// chartData["data"].push([data[j]["endTime"], data[j]["M_effective_time"] * configs.testTime]);
						var dataObj = {
							x: data[j]["endTime"],
							y: data[j]["M_effective_time"] * configs.testTime,
							busiId: data[j]["_id"]
						}
						chartData["data"].push(dataObj);
					}
				}
				chart.addSeries(chartData);
			}
		}
	},
	getBusiDetailGrid: function(busiTypeValue, transactionChannel, area) {
		var $this = ctrl.detailMonitor;
		$this.hideGrid();
		// $this.isHasGrid(busiTypeValue);
		for (var i = 0, l = busiTypeValue.length; i < l; i++) {
			var params = {
				busiName: busiTypeValue[i],
				channelId: $this.channelId,
				busiChannel: transactionChannel,
				city: area
			};
			$this.setBusiDetailGridPanel(busiTypeValue[i], i);
			model.detailMonitor.getBusiDetailGrid(params, i);
		}
	},
	isHasGrid: function(busiTypeValue) {
		var $this = ctrl.detailMonitor;
		var grids = $this.BusiDetailGrid;
		var mainPanel = Ext.getCmp("busiGridBox");
		for (var i = 0, l = grids.length; i < l; i++) {
			var isHasGrid = false;
			for (var j = 0, b_l = busiTypeValue.length; j < b_l; j++) {
				if (busiTypeValue[j] == grids[i]) {
					isHasGrid = true;
				}
			}
			if (!isHasGrid) {
				mainPanel.remove(Ext.getCmp(grids[i]));
				Ext.Array.remove(grids, grids[i]);
			}
		}
	},
	hideGrid: function() {
		var $this = ctrl.detailMonitor;
		var mainPanel = Ext.getCmp("busiGridBox");
		mainPanel.getComponent(0).hide();
		mainPanel.getComponent(1).hide();
		mainPanel.getComponent(2).hide();
	},
	setBusiDetailGridPanel: function(gridId, index) {
		var mainPanel = Ext.getCmp("busiGridBox");
		var $this = ctrl.detailMonitor;
		var panel = mainPanel.getComponent(index).show();
		var title = gridId + " | 所有营业厅";
		var backgroundSizeWidth = 185 - title.length * 15 + 15;
		panel.getComponent(0).setStyle('background-position', "-" + backgroundSizeWidth + "px center");
		panel.getComponent(0).getComponent(0).setText(title);

		// var grids = $this.BusiDetailGrid;
		// var viewObj = view.busiMoitor.detailMonitor.busiGrid;
		// if (!Ext.getCmp(gridId)) {
		// 	grids.push(gridId);
		// 	console.log(mainPanel.body.dom.id);
		// 	var panel = viewObj.gridPanelDemo(gridId, gridId);
		// 	mainPanel.add(panel);
		// }
	},
	setBusiDetailGrid: function(data, gridId) {
		var $this = ctrl.detailMonitor;
		var grid = Ext.getCmp("busiGridBox" + gridId + "grid");
		if (grid) {
			var store = grid.getStore();
			store.loadData(data);
		}

	}
};
// 明细监控结束------------------------------------
// 
// 业务追踪---------------------------------------
ctrl.busiTrack = {
	isJump: false,
	jumpParam: {},
	busiType: [],
	channelId: 1,
	busiChannel: {},
	show: function() {
		var $this = ctrl.detailMonitor;
		if ($this.isJump) {
			$this.selectBusiTrack();
		}
	},
	run: function() {
		var $this = ctrl.busiTrack;
		$this.getBusiType();
		$this.getBusiStatus();
		$this.getChannel();
		// $this.listenerChangeMenu();
	},
	listenerChangeMenu: function() {
		var $this = ctrl.busiTrack;
		$(".busiTrackToolsButton").click($this.changeMenu);
	},
	changeMenu: function() {
		var $this = ctrl.busiTrack;
		var menu1 = Ext.getCmp("busiTrackChildMenu1");
		var menu2 = Ext.getCmp("busiTrackChildMenu2");
		if (menu1.hasCls("action")) {
			menu1.removeCls("action")
		}
		if (menu2.hasCls("action")) {
			menu2.removeCls("action")
		}
		var button = Ext.getCmp($(this).attr("id"));
		button.addCls("action");
		$this.channelId = button.channelId;
		$this.getBusiType();
		$this.initGrid();
	},
	initGrid: function() {
		var store = Ext.StoreMgr.get("busiTrackBusiProfileGrid");
		store.loadData([]);
		var pageBar = ctrl.busiTrack.getPageBar();
		pageBar.setCurrPage(1);
		pageBar.setTotalCount(0);
	},
	getAreaValue: function() {
		return Ext.getCmp(configs.busiTrack.area).getValue();
	},
	getChannel: function() {
		var $this = ctrl.busiTrack;
		var params = {
			city: $this.getAreaValue(),
			channelId: $this.channelId
		}
		model.busiTrack.getChannel(params);
	},
	setChannel: function(data) {
		var $this = ctrl.busiTrack;
		var box = Ext.getCmp(configs.busiTrack.busiTrackTC);
		var store = box.getStore();
		data.unshift({
			channel: "all",
			name: "全部渠道"
		});
		store.loadData(data);
		for (var i = 0, l = data.length; i < l; i++) {
			var name = data[i]["name"];
			var channel = data[i]["channel"];
			$this.busiChannel[channel] = name;
		}
		box.setValue(data[0]["channel"]);
		$this.selectType();
	},
	getBusiType: function() {
		var $this = ctrl.busiTrack;
		var params = {
			city: $this.getAreaValue(),
			channel: $this.channelId
		};
		model.busiTrack.getBusiType(params);
	},
	setBusiType: function(data) {
		var that = ctrl.busiTrack;
		that.busiType = data;
		var store = Ext.StoreMgr.get("busiTrackBusiType");
		data = data || [];
		var all = {};
		all[configs.dimension.busiTypeKey] = "全部业务";
		all[configs.dimension.busiTypeValue] = -1;
		data.unshift(all);
		store.loadData(data);
		if (that.isJump) {
			var jumpParam = that.jumpParam;
			var busiName;
			if (jumpParam["busiName"]) {
				for (var i = 0, len = data.length; i < len; i++) {
					if (data[i][configs.dimension.busiTypeKey] == jumpParam["busiName"]) {
						busiName = data[i][configs.dimension.busiTypeValue];
					}
				}
				Ext.getCmp(configs.busiTrack.busiType).setValue(busiName);
			} else {
				busiName = jumpParam["busiName_id"];
				Ext.getCmp(configs.busiTrack.busiType).setValue(busiName);
				return;
			}
		} else {
			Ext.getCmp(configs.busiTrack.busiType).setValue(data[0][configs.dimension.busiTypeValue]);
		}
		that.isJump = false;
		ctrl.busiTrack.selectType();
	},
	getBusiStatus: function() {
		model.busiTrack.getBusiStatus();
	},
	setBusiStatus: function(data) {
		var data = data || [];
		var comboBox = Ext.getCmp(configs.busiTrack.busiStatus);
		var store = comboBox.getStore();
		for (var i = 0, l = data.length; i < l; i++) {
			if (data[i][configs.dimension.key] == "未提交") {
				Ext.Array.remove(data, data[i]);
			}
		}
		var all = {};
		all[configs.dimension.key] = "全部状态";
		all[configs.dimension.value] = -1;
		data.unshift(all);
		store.loadData(data);
		if (data[0]) {
			comboBox.setValue(data[0][configs.dimension.value]);
		}
		ctrl.busiTrack.selectType()
	},
	getPageBar: function() {
		var pageBar = view.busiTrack.main.busiProfileGridPageBar;
		return pageBar;
	},
	selectType: function() {
		var that = ctrl.busiTrack;
		if (!that.isJump) {
			that.getBusiTrackList();
			return;
		}
	},
	detailMonitorJump: function() {
		var that = ctrl.busiTrack;
		var store = Ext.StoreMgr.get("busiTrackBusiProfileGrid");
		view.busiTrack.main.busiProfileGridPageBar.setTotalCount(1);
		var jumpParam = that.jumpParam;
		var newJumpParam = {};
		for (i in jumpParam) {
			if (i == "status") {
				newJumpParam[i] = ctrl.status[jumpParam[i]];
			} else {
				newJumpParam[i] = jumpParam[i]
			}
		}
		store.loadData([newJumpParam]);
		that.detailMonitorJumpSetTop();
	},
	busiMoitorJump: function() {
		var that = ctrl.busiTrack;
		var form = Ext.getCmp(configs.busiTrack.form);
		var jumpParam = that.jumpParam;
		var startTime = jumpParam["time"];
		var endTime = tools.dateZerofill(new Date(tools.getTimeValue(jumpParam["time"]) + 60 * 1000));
		form.getComponent(0).setValue((startTime || "").split(" ")[0]);
		form.getComponent(1).setValue((startTime || "").split(" ")[1].substring(0, 5));
		form.getComponent(2).setValue((endTime || "").split(" ")[0]);
		form.getComponent(3).setValue((endTime || "").split(" ")[1].substring(0, 5));
		form.getComponent(4).setValue("all");
		form.getComponent(6).setValue("");
		form.getComponent(7).setValue("");
		form.getComponent(8).setValue(-1);

		var data = that.busiType;
		var busiName;
		for (var i = 0, len = data.length; i < len; i++) {
			if (data[i][configs.dimension.busiTypeKey] == jumpParam["busiName"]) {
				busiName = data[i][configs.dimension.busiTypeValue];
			}
		}
		Ext.getCmp(configs.busiTrack.busiType).setValue(busiName);
		// that.jumpParam = {};
		that.getBusiTrackList();
	},
	detailMonitorJumpSetTop: function() {
		var that = ctrl.busiTrack;
		var jumpParam = that.jumpParam;
		var form = Ext.getCmp(configs.busiTrack.form);
		var msg = configs.busiTrack;
		var startTime = jumpParam["ts"];
		var endTime = tools.dateZerofill(new Date(tools.getTimeValue(jumpParam["ts"]) + 60 * 1000));
		var channel = jumpParam["hall"];
		var busiName = jumpParam["busiName_id"];
		var phone = jumpParam["phone"];
		var operatorNo = jumpParam["operator"];
		var status = jumpParam["status"];
		form.getComponent(0).setValue((startTime || "").split(" ")[0]);
		form.getComponent(1).setValue((startTime || "").split(" ")[1].substring(0, 5));
		form.getComponent(2).setValue((endTime || "").split(" ")[0]);
		form.getComponent(3).setValue((endTime || "").split(" ")[1].substring(0, 5));
		if (that.busiChannel[channel]) {
			form.getComponent(4).setValue(channel);
		} else {
			form.getComponent(4).setValue("UNKNOWN");
		}
		form.getComponent(5).setValue(busiName);
		form.getComponent(6).setValue(phone);
		form.getComponent(7).setValue(operatorNo);
		form.getComponent(8).setValue(status);
		// 隐藏单笔业务
		that.busiTrackSingleBusiGridHide();
	},
	selectBusiTrack: function() {

		var form = Ext.getCmp(configs.busiTrack.form);
		var values = form.getValues();
		var msg = configs.busiTrack;
		var startTime = values[msg.startTime] + " " + values[msg.startTime + "2"] + ":00";
		var startTimeValue = tools.getTimeValue(startTime);
		var endTime = values[msg.endTime] + " " + values[msg.endTime + "2"] + ":00";
		var endTimeValue = tools.getTimeValue(endTime);
		if (startTimeValue > endTimeValue) {
			tools.toast("开始时间不能大于结束时间");
			return;
		}

		var pageBar = ctrl.busiTrack.getPageBar();
		pageBar.setCurrPage(1);
		pageBar.setTotalCount(0);
		ctrl.busiTrack.getBusiTrackList();

	},
	getBusiTrackList: function() {

		var $this = ctrl.busiTrack;
		var form = Ext.getCmp(configs.busiTrack.form);
		var values = form.getValues();
		var msg = configs.busiTrack;
		var pageBar = ctrl.busiTrack.getPageBar();
		var start = pageBar.getStart();
		var count = pageBar.getPageCount();
		if (values[msg.busiStatus] === "") {
			return;
		}
		if (values[msg.busiType] === "") {
			return;
		}

		if (values[msg.transactionChannel] === "") {
			return;
		}
		if (values[msg.transactionChannel] === "all" || values[msg.transactionChannel] === "UNKNOWN") {
			values[msg.transactionChannel] = undefined;
		}


		var params = {
			channel: $this.channelId,
			start_time: values[msg.startTime] + " " + values[msg.startTime + "2"] + ":00",
			end_time: values[msg.endTime] + " " + values[msg.endTime + "2"] + ":00",
			hall: values[msg.transactionChannel],
			phone: values[msg.phone],
			operator: values[msg.operatorNo],
			status: values[msg.busiStatus],
			busiName: values[msg.busiType],
			start_row: parseInt(start),
			row_count: parseInt(count)
		};
		model.busiTrack.getBusiTrackList(params);
		var that = ctrl.busiTrack;
		that.busiTrackSingleBusiGridHide();
		that.jumpParam = {};
	},
	busiTrackSingleBusiGridHide: function() {
		var busiTrackSingleBusiGrid = Ext.getCmp("busiTrackSingleBusiGrid");
		if (busiTrackSingleBusiGrid) {
			busiTrackSingleBusiGrid.hide();
		}
	},
	setBusiTrackList: function(data) {
		var list = data["grid_data"];
		var store = Ext.StoreMgr.get("busiTrackBusiProfileGrid");
		var total = data["total_count"];
		view.busiTrack.main.busiProfileGridPageBar.setTotalCount(total);
		store.loadData(list);
		// ctrl.busiTrack.listenersBusiAlarmGridBtn();
	},
	listenersBusiAlarmGridBtn: function(e) {
		// $(".busiAlarmGridBtn").click(function() {
		$(".busiAlarmGridBtn").removeClass("action");
		$(e).addClass('action');
		var params = JSON.parse($(e).attr("data"));
		ctrl.busiTrack.getSingleBusi(params);
		// });
	},
	getSingleBusiLabel: function(params) {
		var singleBusiType = Ext.getCmp("singleBusiType");
		var singleBusiTime = Ext.getCmp("singleBusiTime");
		var singleBusiPhone = Ext.getCmp("singleBusiPhone");
		var singleBusiDuration = Ext.getCmp("singleBusiDuration");
		var singleBusiStatus = Ext.getCmp("singleBusiStatus");
		var msg = configs.busiTrack.busiProfileGridName;
		singleBusiType.setText(params[msg.name]);
		singleBusiTime.setText(params[msg.time]);
		singleBusiPhone.setText(params[msg.phone]);
		singleBusiDuration.setText(parseFloat(params[msg.duration] * configs.testTime).toFixed(2) + "s");
		var color = "#333";
		if (params[msg.statu]) {
			for (i in ctrl.status) {
				if (params[msg.statu] == ctrl.status[i]) {
					color = configs.statusColor[i];
				}
			}
		}
		singleBusiStatus.setText(params[msg.statu]);

	},
	getSingleBusi: function(params) {
		var $this = ctrl.busiTrack;
		var busiTrackSingleBusiGrid;
		if (!Ext.getCmp("busiTrackSingleBusiGrid")) {
			view.busiTrack.main.singleBusiGrid();
			busiTrackSingleBusiGrid = Ext.getCmp("busiTrackSingleBusiGrid");
			var busiTrackMain = Ext.getCmp("busiTrackMain");

			if (busiTrackSingleBusiGrid) {
				busiTrackMain.add(busiTrackSingleBusiGrid);
			}
		}
		busiTrackSingleBusiGrid = Ext.getCmp("busiTrackSingleBusiGrid");
		busiTrackSingleBusiGrid.show();
		ctrl.busiTrack.getSingleBusiLabel(params);
		var subParams = {
			channelId: $this.channelId,
			busiId: params["_id"]
		}
		model.busiTrack.getBusiTrackSingleBusi(subParams);
	},
	setSingleBusi: function(data) {
		var $this = ctrl.busiTrack;
		if (data.length > 0) {
			$this.setSingleBusiToWeb(data[0]);
		}
		if (data[1]) {
			$this.setSingleBusiToWas(data[1]);
		}

		// $this.setSingleBusiToCics(data["CICS"]);
	},
	setSingleBusiToWeb: function(data) {
		var webStore = Ext.StoreMgr.get("busiTrackWebBusi");
		var handlingLabel = Ext.getCmp("webHandling");
		var rateLabel = Ext.getCmp("webRate");
		// var durationLabel = Ext.getCmp("webDuration");

		var handling = data["cmdList"].length;
		var succNum = 0;
		for (var i = 0, l = handling; i < l; i++) {
			var line = data["cmdList"][i]
			if (line["returnCodeMsg"] === "成功") {
				succNum++;
			}
		}
		var rate = parseFloat(succNum / handling) * 100 || 0;
		// var ranDur = parseInt(ran * 50) + 600;
		handlingLabel.setText("调用量:" + handling + "次");
		rateLabel.setText("成功率:" + rate.toFixed(2) + "%");
		// durationLabel.setText("响应时长:" + ranDur + "ms");
		// durationLabel.setText("");
		webStore.loadData(data["cmdList"]);
	},
	setSingleBusiToWas: function(data) {
		var webStore = Ext.StoreMgr.get("busiTrackWasBusi");
		var handlingLabel = Ext.getCmp("wasHandling");
		var rateLabel = Ext.getCmp("wasRate");
		// var durationLabel = Ext.getCmp("wasDuration");

		var handling = data["cmdList"].length;
		var succNum = 0;
		for (var i = 0, l = handling; i < l; i++) {
			var line = data["cmdList"][i]
			if (line["returnCodeMsg"] === "成功") {
				succNum++;
			}
		}
		var rate = parseFloat(succNum / handling) * 100 || 0;
		// var ranDur = parseInt(ran * 50) + 600;
		handlingLabel.setText("调用量:" + handling + "次");
		rateLabel.setText("成功率:" + rate.toFixed(2) + "%");
		// durationLabel.setText("响应时长:" + ranDur + "ms");
		// durationLabel.setText("");
		webStore.loadData(data["cmdList"]);
	},
	setSingleBusiToCics: function(data) {
		var webStore = Ext.StoreMgr.get("busiTrackCicsBusi");
		var handlingLabel = Ext.getCmp("cicsHandling");
		var rateLabel = Ext.getCmp("cicsRate");
		var durationLabel = Ext.getCmp("cicsDuration");
		handlingLabel.setText("调用量:" + data["handling"] + "/次");
		rateLabel.setText("成功率:" + data["rate"] + "%");
		durationLabel.setText("响应时长:" + data["duration"] + "ms");
		webStore.loadData(data["list"]);
	}
};
// 业务追踪结束------------------------------------
// 
// 运营分析----------------------------------------
ctrl.operationAnalysis = {
	channelId: 1,
	busiType: [],
	run: function() {
		operationAnalysis.gauge_chart1("#operationAnalysisHandlingGauge");
		operationAnalysis.gauge_chart2("#operationAnalysisDurationGauge");
		operationAnalysis.gauge_chart3("#operationAnalysisRateGauge");
		// 监听渠道菜单按钮
		// ctrl.operationAnalysis.listenerChangeMenu();
		ctrl.operationAnalysis.getBusiType();
	},
	getBusiType: function() {
		var that = ctrl.operationAnalysis;
		var params = {
			city: that.getAreaValue(),
			channel: that.channelId
		};
		model.operationAnalysis.getBusiType(params);
	},
	setBusiType: function(data) {
		var box = Ext.getCmp(configs.operationAnalysis.busiType);
		var store = box.getStore();
		var that = ctrl.operationAnalysis;
		var all = {};
		all[configs.dimension.busiTypeKey] = "全部业务";
		all[configs.dimension.busiTypeValue] = -1;
		data.unshift(all);
		store.loadData(data);
		that.busiType = data;
		box.setValue(data[0][configs.dimension.busiTypeKey]);
		ctrl.operationAnalysis.selectBusi();
	},
	getAreaValue: function() {
		return Ext.getCmp(configs.operationAnalysis.area).getValue();
	},
	listenerChangeMenu: function() {
		var $this = ctrl.operationAnalysis;
		$(".operationAnalysisToolsButton").click($this.changeMenu);
	},
	changeMenu: function() {
		var $this = ctrl.operationAnalysis;
		var menu1 = Ext.getCmp("operationAnalysisChildMenu1");
		var menu2 = Ext.getCmp("operationAnalysisChildMenu2");
		if (menu1.hasCls("action")) {
			menu1.removeCls("action")
		}
		if (menu2.hasCls("action")) {
			menu2.removeCls("action")
		}
		var button = Ext.getCmp($(this).attr("id"))
		button.addCls("action");
		$this.channelId = button.channelId;
		$this.initGrid();
	},
	initGrid: function() {
		var store = Ext.StoreMgr.get("operationAnalysisGrid");
		var $this = ctrl.operationAnalysis;
		var pageBar = $this.getPageBar();
		store.loadData([]);
		pageBar.setTotalCount(0);
		pageBar.setCurrPage(1);
	},
	selectBusi: function() {
		var $this = ctrl.operationAnalysis;
		var form = Ext.getCmp("operationAnalysisForm");
		var values = form.getValues();
		var msg = configs.operationAnalysis;
		var startTime = values[msg.startTime] + " " + values[msg.startTime + "2"] + ":00";
		var endTime = values[msg.endTime] + " " + values[msg.endTime + "2"] + ":00";
		var startTimeValue = tools.getTimeValue(startTime);
		var endTimeValue = tools.getTimeValue(endTime);
		if (startTimeValue >= endTimeValue) {
			tools.toast("开始时间不能大于结束时间");
			return;
		}
		var busiName = values["busiName"];
		var data = $this.busiType;
		var isHas = false;
		for (var i = 0, len = data.length; i < len; i++) {
			if (data[i][configs.dimension.busiTypeKey] == busiName) {
				isHas = true;
			}
		}
		if (!isHas) {
			tools.toast("请输入正确的业务类型");
			return;
		}
		$this.initGrid();
		$this.getChart();
		$this.getBusiProfileList();
		$this.operationAnalysisSelcetDisable();
	},
	getChart: function() {
		var $this = ctrl.operationAnalysis;
		var form = Ext.getCmp("operationAnalysisForm");
		var values = form.getValues();
		var msg = configs.operationAnalysis;

		var startTime = values[msg.startTime] + " " + values[msg.startTime + "2"] + ":00";
		var endTime = values[msg.endTime] + " " + values[msg.endTime + "2"] + ":00";
		var startTimeValue = tools.getTimeValue(startTime);
		var endTimeValue = tools.getTimeValue(endTime);
		if (startTimeValue >= endTimeValue) {
			tools.toast("开始时间不能大于结束时间");
			return;
		}
		var busiName = values["busiName"];
		if (busiName == "全部业务") {
			busiName = undefined;
		}
		var params = {
			start_time: startTime,
			end_time: endTime,
			channel: $this.channelId,
			busiName: busiName
		};
		model.operationAnalysis.getChart(params);
	},
	setChart: function(data) {
		var $this = ctrl.operationAnalysis;
		$this.setHandlingGauge(data["amount"] || 0);
		$this.setDurationGauge(data["busi_avg_time"] * configs.testTime || 0);
		$this.setRateGauge(data["succ_rate"] || 0);
	},
	setHandlingGaugeMax: function() {
		var gauge = $("#operationAnalysisHandlingGauge").highcharts();
		var form = Ext.getCmp("operationAnalysisForm");
		var values = form.getValues();
		var msg = configs.operationAnalysis;
		var startTime = values[msg.startTime] + " " + values[msg.startTime + "2"] + ":00";
		var endTime = values[msg.endTime] + " " + values[msg.endTime + "2"] + ":00";
		var startTimeValue = tools.getTimeValue(startTime);
		var endTimeValue = tools.getTimeValue(endTime);
		var time = endTimeValue - startTimeValue;
		var max = 0;

		if (time > 0) {
			var timeValues = configs.timeValues;
			var isToK = false;
			var maxValues = configs.guageMaxValue.operationAnalysis;
			if (time >= timeValues.month) {
				max = maxValues["month"]
			} else if (time >= timeValues.week) {
				max = maxValues["week"]
			} else if (time >= timeValues.day) {
				max = maxValues["day"]
			} else {
				max = maxValues["hours"]
			}
			if (max && max >= 0) {

				if (max > maxValues.passToThousand) {
					max = max / 1000;
					isToK = true;
				}

				var setMax = tools.setMax(max);
				gauge.yAxis[0].update(setMax);

				var setPlotBands = tools.setPlotBands(max);
				gauge.yAxis[0].removePlotBand("gauge_chart1_1");
				gauge.yAxis[0].removePlotBand("gauge_chart1_2");
				gauge.yAxis[0].removePlotBand("gauge_chart1_3");
				gauge.yAxis[0].addPlotBand(setPlotBands[0]);
				gauge.yAxis[0].addPlotBand(setPlotBands[1]);
				gauge.yAxis[0].addPlotBand(setPlotBands[2]);
			}
		}
		return isToK;
	},
	setHandlingGauge: function(value) {
		var label = Ext.getCmp("operationAnalysisMianTopHanding");
		var gauge = $("#operationAnalysisHandlingGauge").highcharts();

		var isToK = ctrl.operationAnalysis.setHandlingGaugeMax();
		if (isToK) {
			gauge.tooltip.options.formatter = function() {
				return this.series.name + ":" + this.y + "K";
			};
			gauge.yAxis[0].labelFormatter = function() {
				return this.value + 'K';
			}
			label.setText(parseFloat((value / 1000).toFixed(2)) + "K");
			gauge.series[0].setData([parseFloat(value / 1000)]);
		} else {
			gauge.tooltip.options.formatter = function() {
				return this.series.name + ":" + this.y;
			};
			gauge.yAxis[0].labelFormatter = function() {
				return this.value;
			}
			label.setText(value);
			gauge.series[0].setData([value]);
		}
	},
	setDurationGauge: function(value) {
		var label = Ext.getCmp("operationAnalysisMianTopDuration");
		var gauge = $("#operationAnalysisDurationGauge").highcharts();
		value = parseFloat(value.toFixed(2)) || 0;
		label.setText(value + "s");
		gauge.series[0].setData([value]);
	},
	setRateGauge: function(value) {
		var label = Ext.getCmp("operationAnalysisMianTopRate");
		var gauge = $("#operationAnalysisRateGauge").highcharts();
		label.setText((value * 100).toFixed(2) + "%");
		gauge.series[0].setData([parseFloat((value * 100).toFixed(2)) || 0]);
	},
	getPageBar: function() {
		var pageBar = view.operationAnalysis.mainCenter.operationAnalysisGridPageBar;
		return pageBar;
	},
	getBusiProfileList: function() {
		var $this = ctrl.operationAnalysis;
		var pageBar = $this.getPageBar();
		var start = pageBar.getStart();
		var count = pageBar.getPageCount();
		var form = Ext.getCmp("operationAnalysisForm");
		var values = form.getValues();
		var msg = configs.operationAnalysis;
		var startTime = values[msg.startTime] + " " + values[msg.startTime + "2"] + ":00";
		var endTime = values[msg.endTime] + " " + values[msg.endTime + "2"] + ":00";
		var startTimeValue = tools.getTimeValue(startTime);
		var endTimeValue = tools.getTimeValue(endTime);
		if (startTimeValue >= endTimeValue) {
			tools.toast("开始时间不能大于结束时间");
			return;
		}
		var busiName = values["busiName"];
		if (busiName == "全部业务") {
			busiName = undefined;
		}
		var params = {
			start_time: startTime,
			end_time: endTime,
			row: parseInt(start),
			count: parseInt(count),
			channel: $this.channelId,
			busiName: busiName
		};
		model.operationAnalysis.getBusiProfileList(params);

		if (Ext.getCmp("operationAnalysisTrendAnalysis")) {
			Ext.getCmp("operationAnalysisTrendAnalysis").hide();
		}
	},
	setBusiProfileList: function(data) {
		var data = data || [];
		var $this = ctrl.operationAnalysis;
		var store = Ext.StoreMgr.get("operationAnalysisGrid");
		var total = data["total_len"];
		var pageBar = $this.getPageBar();
		pageBar.setTotalCount(total);
		store.loadData(data["data"]);
		// ctrl.operationAnalysis.listenersAlarmGridBtn();
		$this.operationAnalysisSelcetOpen();
	},
	listenersAlarmGridBtn: function(e) {
		// $(".operationAnalysisAlarmGridBtn").click(function() {
		$(".operationAnalysisAlarmGridBtn").removeClass("action");
		$(e).addClass('action');
		var $this = ctrl.operationAnalysis;
		var form = Ext.getCmp("operationAnalysisForm");
		var msg = configs.operationAnalysis;
		var values = form.getValues();
		var startTime = values[msg.startTime] + " " + values[msg.startTime + "2"] + ":00";
		var endTime = values[msg.endTime] + " " + values[msg.endTime + "2"] + ":00";
		var row = JSON.parse($(e).attr("data"));
		var name = configs.operationAnalysis.operationAnalysisGridName;
		var params = {
			channel: $this.channelId,
			start_time: startTime,
			end_time: endTime,
			busi_name: row[name.type]
		}
		Ext.getCmp("operationAnalysisTrendAnalysis").show();
		ctrl.operationAnalysis.getTrendAnalysisChart(params);
		ctrl.operationAnalysis.setTrendAnalysisLabel(row);
		// });
	},
	setTrendAnalysisLabel: function(params) {
		var channel = Ext.getCmp("OpTrendAnalysisChannel");
		var busiType = Ext.getCmp("OpTrendAnalysisBusiType");
		var handling = Ext.getCmp("OpTrendAnalysisHandling");
		var rate = Ext.getCmp("OpTrendAnalysisRate");
		var duration = Ext.getCmp("OpTrendAnalysisDuration");
		var name = configs.operationAnalysis.operationAnalysisGridName;
		channel.setText("业务渠道：" + params[name.channel]);
		busiType.setText("业务类型：" + params[name.type]);
		handling.setText("业务量：" + params[name.handling]);
		rate.setText("成功率：" + (parseFloat((params[name.rate] * 100).toFixed(2)) || 0) + "%");
		duration.setText("业务时长：" + (parseFloat((params[name.duration] * configs.testTime).toFixed(2)) || 0) + "s");
	},
	operationAnalysisSelcetDisable: function() {
		Ext.getCmp("operationAnalysisSelcet").setDisabled(true);
	},
	operationAnalysisSelcetOpen: function() {
		Ext.getCmp("operationAnalysisSelcet").setDisabled(false);
	},
	getTrendAnalysisChart: function(params) {

		model.operationAnalysis.getTrendAnalysisChart(params);
	},
	setTrendAnalysisChart: function(data) {
		var $this = ctrl.operationAnalysis;
		var handling = data["amount"];
		var rate = data["succRate"];
		for (var i = 0, l = data["busiTime"].length; i < l; i++) {
			if (data["busiTime"][i]) {
				data["busiTime"][i] = data["busiTime"][i] * configs.testTime;
			}
		}
		var duration = data["busiTime"];
		var y = data["category"];
		operationAnalysis.area_chart1("#operationHandlingTrend");
		operationAnalysis.area_chart2("#operationRateTrend");
		operationAnalysis.area_chart3("#operationDurationTrend");
		$this.setSingleTrendAnalysisChart("#operationHandlingTrend", handling, y);
		$this.setSingleTrendAnalysisChart("#operationRateTrend", rate, y);
		$this.setSingleTrendAnalysisChart("#operationDurationTrend", duration, y);
	},
	setSingleTrendAnalysisChart: function(eleId, data, y) {
		var chart = $(eleId).highcharts();
		chart.xAxis[0].setCategories(y);
		chart.series[0].setData(data);
	}
};
// 运营分析结束-----------------------------------
// 
// 业务专题---------------------------------------
ctrl.busiTopics = {
	channelId: 1,
	stepData: {},
	run: function() {
		var $this = ctrl.busiTopics
		$this.initChart();
		$this.getBusiType();
		// 监听渠道菜单按钮
		// $this.listenerChangeMenu();
		$this.getTime();
	},
	initChart: function() {
		busiTopicsChart.gauge_chart1("#busiTopicsHandlingGauge");
		busiTopicsChart.gauge_chart2("#busiTopicsRateGauge");
		busiTopicsChart.gauge_chart3("#busiTopicsDurationGauge");
		busiTopicsChart.gauge_chart4("#busiTopicsSysDurationGauge");
		busiTopicsChart.area_chart1("#busiTopicsHandleChart");
		busiTopicsChart.area_chart2("#busiTopicsRateChart");
		busiTopicsChart.area_chart3("#busiTopicsDurationChart");
		busiTopicsChart.column_chart1("#retention");
		busiTopicsChart.column_chart2("#sysRate");
		// busiTopicsChart.funnel("#busiTopicsStepFunnel");
	},
	listenerChangeMenu: function() {
		var $this = ctrl.busiTopics;
		$(".busiTopicsToolsButton").click($this.changeMenu);
	},
	changeMenu: function() {
		var $this = ctrl.busiTopics;
		var menu1 = Ext.getCmp("busiTopicsChildMenu1");
		var menu2 = Ext.getCmp("busiTopicsChildMenu2");
		if (menu1.hasCls("action")) {
			menu1.removeCls("action")
		}
		if (menu2.hasCls("action")) {
			menu2.removeCls("action")
		}
		var button = Ext.getCmp($(this).attr("id"))
		button.addCls("action");
		$this.channelId = button.channelId;
		$this.initPage();
	},
	getAreaValue: function() {
		return Ext.getCmp(configs.busiTopics.area).getValue();
	},
	getBusiType: function() {
		var $this = ctrl.busiTopics;
		var area = $this.getAreaValue();
		var params = {
			channel: $this.channelId,
			city: area
		}
		model.busiTopics.getBusiType(params);
	},
	setBusiType: function(data) {
		var store = Ext.StoreMgr.get(configs.busiTopics.busiTopicsBusiType);

		var comboBox = Ext.getCmp(configs.busiTopics.busiTopicsBusiType);
		var testData = [];
		for (var i = 0, l = data.length; i < l; i++) {
			if (data[i][configs.dimension.key] == configs.testData.busiTopicsBusiType[0]) {
				data[i][configs.dimension.key] = configs.testData.testBusiTopicsBusiType[0];
				testData.push(data[i]);
			}
			if (data[i][configs.dimension.key] == configs.testData.busiTopicsBusiType[1]) {
				data[i][configs.dimension.key] = configs.testData.testBusiTopicsBusiType[1];
				testData.push(data[i]);
			}
		}
		store.loadData(testData);
		// if (data[3][configs.dimension.value] == 4) {
		// 	comboBox.setValue(4);
		// } else {
		// 	comboBox.setValue(data[0][configs.dimension.value]);
		// }

		if (testData.length > 0) {
			if (testData[1]) {
				comboBox.setValue(testData[1][configs.dimension.value]);
			}
		}
		ctrl.busiTopics.selectBusi();
	},
	getTime: function() {
		model.busiTopics.getTime();
	},
	setTime: function(data) {
		var comboBox = Ext.getCmp(configs.busiTopics.busiTopicsTime);
		var store = comboBox.getStore();
		store.loadData(data);
		if (data[1]) {
			comboBox.setValue(data[1][configs.dimension.value]);
		}
		ctrl.busiTopics.selectBusi();
	},

	//查询
	selectBusi: function() {
		var $this = ctrl.busiTopics;
		var busiType = Ext.getCmp(configs.busiTopics.busiTopicsBusiType).getValue();
		var time = Ext.getCmp(configs.busiTopics.busiTopicsTime).getValue();
		if (!busiType) {
			return;
		}
		if (!time) {
			return;
		}
		$this.initChart();
		$this.stepData = {};
		var params = {
			channel: $this.channelId,
			subBusiTypeId: busiType,
			time_range_id: time
		};
		// 概况
		$this.getBusiTopicsBaseChart(params);
		// // 各步骤图表
		// $this.getBusiTopicsChart(params);
		// // 步骤and命令字
		$this.getStepChartList(params);
		$this.getCommandList(params);
		// 
		// // 步骤列表
		$this.getStepList(params);
	},


	// 概况
	getBusiTopicsBaseChart: function(params) {
		model.busiTopics.getBusiTopicsBaseChart(params);
	},
	setBusiTopicsBaseChart: function(data) {
		var $this = ctrl.busiTopics;
		var amount = 0,
			busiTime = 0,
			succ_rate = 0,
			sysTime = 0;
		for (var i = 0, l = data.length; i < l; i++) {
			amount += data[i]["amount"];
			busiTime += data[i]["busiTime"];
			succ_rate += data[i]["succ_rate"];
			sysTime += data[i]["sysTime"];
		}
		busiTime = parseFloat((busiTime).toFixed(2)) || 0;
		succ_rate = parseFloat((succ_rate * 100).toFixed(2)) || 0;
		sysTime = parseFloat((sysTime * 1000 * configs.testTime).toFixed(2)) || 0;
		$this.setHandlingGauge(amount);
		$this.setDurationGauge(busiTime);
		$this.setRateGauge(succ_rate);
		$this.setSysDurationGauge(sysTime);
	},
	setHandlingGauge: function(value) {
		var lable = Ext.getCmp("busiTopicsHandlingLabel");
		var gauge = $("#busiTopicsHandlingGauge").highcharts();
		lable.setText(value);
		var time = Ext.getCmp(configs.busiTopics.busiTopicsTime).getValue();
		var max = 0;
		max = configs.guageMaxValue.busiTopics[time];
		if (configs.guageMaxValue.busiTopics[time]) {
			var setMax = tools.setMax(max);
			gauge.yAxis[0].update(setMax);
			var setPlotBands = tools.setPlotBands(max);
			gauge.yAxis[0].removePlotBand("gauge_chart1_1");
			gauge.yAxis[0].removePlotBand("gauge_chart1_2");
			gauge.yAxis[0].removePlotBand("gauge_chart1_3");
			gauge.yAxis[0].addPlotBand(setPlotBands[0]);
			gauge.yAxis[0].addPlotBand(setPlotBands[1]);
			gauge.yAxis[0].addPlotBand(setPlotBands[2]);
		}
		gauge.series[0].setData([value]);
	},
	setDurationGauge: function(value) {
		var lable = Ext.getCmp("busiTopicsDurationLabel");
		var gauge = $("#busiTopicsDurationGauge").highcharts();
		lable.setText(value + "s");
		gauge.series[0].setData([value]);
	},
	setRateGauge: function(value) {
		var lable = Ext.getCmp("busiTopicsRateLabel");
		var gauge = $("#busiTopicsRateGauge").highcharts();
		lable.setText(value + "%");
		gauge.series[0].setData([value]);
	},
	setSysDurationGauge: function(value) {
		var lable = Ext.getCmp("busiTopicsSysDurationLabel");
		var gauge = $("#busiTopicsSysDurationGauge").highcharts();
		if (value > 1000) {
			value = parseFloat((value / 1000).toFixed(2)) || 0;
			lable.setText(value + "s");
			gauge.series[0].setData([value]);
		} else {
			value = parseFloat((value).toFixed(2)) || 0;
			lable.setText(value + "ms");
			gauge.series[0].setData([value]);
		}

	},


	// 业务步骤列表
	getStepList: function(params) {
		model.busiTopics.getStepList(params);
	},
	setStepList: function(data) {
		var $this = ctrl.busiTopics;
		var comboBox = Ext.getCmp("busiTopicsStepComboBox");
		var store = comboBox.getStore();
		store.loadData(data);
		if (data[0]) {
			comboBox.setValue(data[0][configs.dimension.value]);
		}
		$this.getTrendAnalysis();
	},
	// 业务趋势
	getTrendAnalysis: function() {
		var $this = ctrl.busiTopics;
		var busiType = Ext.getCmp(configs.busiTopics.busiTopicsBusiType).getValue();
		var time = Ext.getCmp(configs.busiTopics.busiTopicsTime).getValue();
		var stepId = Ext.getCmp("busiTopicsStepComboBox").getValue();
		if ("" === stepId) {
			return;
		}
		var params = {
			channel: $this.channelId,
			subBusiTypeId: parseInt(busiType),
			time_range_id: parseInt(time),
			stepId: parseInt(stepId)
		};
		model.busiTopics.getTrendAnalysis(params);
	},
	setTrendAnalysis: function(data) {
		var $this = ctrl.busiTopics;
		var handling, rate, duration;
		if (!data || !data["category"]) {
			return;
		}
		if (data["amount"]) {
			handling = {
				y: data["category"],
				list: data["amount"]
			};
		}
		if (data["succ_rate"]) {
			rate = {
				y: data["category"],
				list: data["succ_rate"]
			};
		}

		if (data["busi_time"]) {
			for (var i = 0, l = data["busi_time"].length; i < l; i++) {
				if (data["busi_time"][i]) {
					data["busi_time"][i] = data["busi_time"][i] * configs.testTime
				}
			}
			duration = {
				y: data["category"],
				list: data["busi_time"]
			};
		}

		$this.setTrendAnalysisChart("#busiTopicsHandleChart", handling);
		$this.setTrendAnalysisChart("#busiTopicsRateChart", rate);
		$this.setTrendAnalysisChart("#busiTopicsDurationChart", duration);
	},
	setTrendAnalysisChart: function(eleId, data) {
		data = data || {
			y: [],
			list: []
		};
		var chart = $(eleId).highcharts();
		chart.xAxis[0].setCategories(data["y"]);
		var series = chart.series[0];
		series.setData(data["list"]);
	},

	// 命令字
	getCommandList: function(params) {
		model.busiTopics.getCommandList(params);
	},
	setCommandList: function(data) {
		var store = Ext.StoreMgr.get("busiTopicsCommandGrid");
		store.loadData(data);
	},

	// 步骤
	getStepChartList: function(params) {
		model.busiTopics.getStepChartList(params);
	},
	setStepChartList: function(data, params) {
		if (!data || data.length < 3) {
			return;
		}
		var tc = configs.stepConfig;
		var lineHeight = tc.lineHeight,
			topHeight = tc.topHeight,
			stepHeight = tc.stepHeight,
			fontSize = tc.fontSize;
		var $this = ctrl.busiTopics;
		var chartBox = $("#busiTopicsStepFunnel");
		var mainPanel = Ext.getCmp("busiTopicsStepFunnelPanel");
		var stepLength = data.length;
		var img = $this.getStepChartBg(data.length);
		var height = stepLength * lineHeight + topHeight;
		var width = mainPanel.getWidth();
		mainPanel.setHeight(height);
		chartBox.height(height);
		chartBox.html("");
		chartBox.css("background-image", "url(resources/images/" + img + ")");
		for (var i = 0, l = data.length; i < l; i++) {
			$this.stepData[data[i]["_id"]] = {};
			$this.stepData[data[i]["_id"]]["name"] = data[i]["text"];
			var color = "color:#fff;font-weight: 500;";
			var index = data[i]["_id"];
			var top = "top: " + (topHeight + 30 + index * lineHeight) + "px;";
			var left = "left: " + (width / 2 - data[i]["text"].length * fontSize / 2) + "px;"
			var box = "<div style='" + color + top + left + "'>" + data[i]["text"] + "</div>";
			chartBox.append(box);
		}
		$this.getStepRateList(params);
	},
	getStepRateList: function(params) {
		model.busiTopics.getStepRateList(params);
	},
	setStepRateList: function(data, params) {
		var $this = ctrl.busiTopics;
		var tc = configs.stepConfig;
		var lineHeight = tc.lineHeight,
			topHeight = tc.topHeight,
			stepHeight = tc.stepHeight;
		var chartBox = $("#busiTopicsStepFunnel");
		var mainPanel = Ext.getCmp("busiTopicsStepFunnelPanel");
		for (var i = 0, l = data.length; i < l; i++) {
			if ($this.stepData[data[i]["_id"]]) {
				var index = data[i]["_id"];
				var color = "color:" + configs.stepColor[index] + ";";
				var rate = parseFloat((data[i]["succ_rate"] * 100).toFixed(2)) || 0;
				var amount = data[i]["amount"];
				var top = "top: " + (stepHeight + index * lineHeight) + "px;";
				var left = "left: 20px;"
				var box = "<div style='" + color + top + left + "'>" +
					"<p>业务量：" + amount + "</p>" +
					"<p>步骤成功率: " + rate + "%</p>" +
					"</div>";
				chartBox.append(box);
				$this.stepData[data[i]["_id"]]["rate"] = data[i]["succ_rate"];
				$this.stepData[data[i]["_id"]]["amount"] = amount;
			}
		}
		$this.getStepTimeList(params);
	},
	getStepTimeList: function(params) {
		model.busiTopics.getStepTimeList(params);
	},
	setStepTimeList: function(data, params) {
		var $this = ctrl.busiTopics;
		var tc = configs.stepConfig;
		var lineHeight = tc.lineHeight,
			topHeight = tc.topHeight,
			stepHeight = tc.stepHeight,
			fontSize = tc.fontSize;
		var chartBox = $("#busiTopicsStepFunnel");
		var mainPanel = Ext.getCmp("busiTopicsStepFunnelPanel");
		var stepLength = data.length;
		var height = stepLength * lineHeight + topHeight;
		var width = mainPanel.getWidth();
		for (var i = 0, l = data.length; i < l; i++) {
			if ($this.stepData[data[i]["_id"]]) {
				var index = data[i]["_id"];
				var color = "color:" + configs.stepColor[index] + ";";
				var duration = parseInt((data[i]["text"] * 1000 * configs.testTime).toFixed(2)) || 0;
				var top = "top: " + (stepHeight + index * lineHeight + 30) + "px;";
				var left = "left: 20px;";
				var box = "<div style='" + color + top + left + "'>" +
					"<p>步骤时长：" + duration + "ms</p>" +
					"</div>";
				chartBox.append(box);
				$this.stepData[data[i]["_id"]]["duration"] = duration;
			}
		}
		$this.getStepWaitTimeList(params);
	},
	getStepWaitTimeList: function(params) {
		model.busiTopics.getStepWaitTimeList(params);
	},
	setStepWaitTimeList: function(data) {
		var $this = ctrl.busiTopics;
		var tc = configs.stepConfig;
		var lineHeight = tc.lineHeight,
			topHeight = tc.topHeight,
			stepHeight = tc.stepHeight,
			fontSize = tc.fontSize;
		var chartBox = $("#busiTopicsStepFunnel");
		var mainPanel = Ext.getCmp("busiTopicsStepFunnelPanel");
		var stepLength = data.length;
		var height = stepLength * lineHeight + topHeight;
		var width = mainPanel.getWidth();
		for (var i = 0, l = data.length; i < l; i++) {
			var index = data[i]["_id"];
			var color = "color:" + configs.stepColor[index] + ";";
			var duration = parseFloat((data[i]["text"]).toFixed(2)) || 0;
			var top = "top: " + (stepHeight + index * lineHeight + 15) + "px;";
			var left = "right: 20px;";
			var box = "<div style='" + color + top + left + "'>" +
				"<p>等待时间：" + duration + "s</p>" +
				"</div>";
			chartBox.append(box);
			$this.stepData[data[i]["_id"]]["wait"] = duration;
		}
		$this.setBusiTopicsChart($this.stepData);
	},
	// // 各步骤图表
	// getBusiTopicsChart: function(params) {
	// 	model.busiTopics.getBusiTopicsChart(params);
	// },
	setBusiTopicsChart: function(data) {
		var retention = [];
		var sysRate = [];
		var startAmount = 0;
		if (data[0]) {
			startAmount = data[0]["amount"] || 0
		}

		for (i in data) {
			retention.push({
				name: data[i]["name"],
				y: data[i]["amount"] / startAmount || 0,
				color: configs.stepColor[i]
			});
			sysRate.push({
				name: data[i]["name"],
				y: data[i]["rate"] || 0,
				color: configs.stepColor[i]
			})
		}
		var $this = ctrl.busiTopics;
		$this.setRetentionChart(retention);
		$this.setSysRateChart(sysRate);
	},
	setRetentionChart: function(data) {
		var chart = $("#retention").highcharts();
		var series = chart.series[0];
		var series2 = chart.series[1];
		for (var i = 0, l = data.length; i < l; i++) {
			data[i]["color"] = configs.stepColor[i] || "";
		}
		series.setData(data);
		series2.setData(data);
	},
	setSysRateChart: function(data) {
		var chart = $("#sysRate").highcharts();
		var series = chart.series[0];
		var series2 = chart.series[1];
		for (var i = 0, l = data.length; i < l; i++) {
			data[i]["color"] = configs.stepColor[i] || "";
		}
		series.setData(data);
		series2.setData(data);
	},
	getStepChartBg: function(length) {
		var img = "";
		img = length + "step.png";
		return img;
	}
};
// 业务专题结束-----------------------------------
// 
// 概况配置
ctrl.busiConfig = {
	hide: function() {
		var store = Ext.getCmp("moitorConfigGrid").getStore();
		var stroe2 = Ext.getCmp("alarmConfigGrid").getStore();
		store.removeAll();
		store.removeAll();
	},
	show: function() {
		var $this = ctrl.busiConfig;
		$this.moitorConfig.getMoitorConfig();
		$this.alarmConfig.getAlarmConfig();
	},
	run: function() {
		ctrl.busiConfig.listenerChangeMenu();
		var alarmConfigContent = Ext.getCmp("alarmConfigContent").hide();
		ctrl.busiConfig.moitorConfig.getMoitorConfig();
	},
	listenerChangeMenu: function() {
		var $this = ctrl.busiConfig;
		$(".busiConfigToolsButton").click($this.changeMenu);
	},
	returnMoitor: function() {
		ctrl.contentHide();
		ctrl.openBusiMoitor();
	},
	changeMenu: function() {
		var $this = ctrl.busiConfig;
		var menu1 = Ext.getCmp("busiConfigToolsButton1");
		var menu2 = Ext.getCmp("busiConfigToolsButton2");
		if (menu1.hasCls("action")) {
			menu1.removeCls("action")
		}
		if (menu2.hasCls("action")) {
			menu2.removeCls("action")
		}
		var button = Ext.getCmp($(this).attr("id"))
		button.addCls("action");
		$this.showContent(this.id);
	},
	showContent: function(id) {
		var moitorConfigContent = Ext.getCmp("moitorConfigContent").hide();
		var alarmConfigContent = Ext.getCmp("alarmConfigContent").hide();
		if (id == "busiConfigToolsButton1") {
			moitorConfigContent.show();
			ctrl.busiConfig.moitorConfig.getMoitorConfig();
		} else if (id == "busiConfigToolsButton2") {
			alarmConfigContent.show();
			ctrl.busiConfig.alarmConfig.getAlarmConfig();
		}
	},
	// 
	// moitorConfig
	moitorConfig: {
		moitorConfigUpdate: {},
		getMoitorConfig: function() {
			var area = Ext.getCmp("moitorConfigArea").getValue();
			var channelId = Ext.getCmp("moitorConfigChannel").getValue();
			var params = {
				city: area,
				channel: channelId
			}
			model.busiConfig.getMoitorConfigList(params);
			ctrl.busiConfig.moitorConfig.moitorConfigUpdate = {};
		},
		setMoitorConfigList: function(data) {
			var stroe = Ext.getCmp("moitorConfigGrid").getStore();
			stroe.loadData(data);

		},
		updateMoitorConfig: function() {
			// var stroe = Ext.getCmp("moitorConfigGrid").getStore();
			// var stroeData = stroe.data.items;
			var data = [];
			var moitorConfigUpdate = ctrl.busiConfig.moitorConfig.moitorConfigUpdate;
			console.log(moitorConfigUpdate);
			for (i in moitorConfigUpdate) {
				data.push(moitorConfigUpdate[i].data);
			}
			// for (var i = 0, l = stroeData.length; i < l; i++) {
			// 	data.push(stroeData[i]["data"]);
			// }
			var params = {
				data: data
			}
			model.busiConfig.updateMoitorConfig(params);
		},
		returnUpdateMoitorConfig: function() {
			tools.toast("保存成功");
			ctrl.busiConfig.moitorConfig.getMoitorConfig();
			if (Ext.getCmp(configs.pageId.busiProfile)) {
				model.busiMoitor.getNowTime();
				ctrl.busiMoitor.busiProfileTimeChange();
			}
		},
		search: function() {
			var text = Ext.getCmp("moitorConfigsSearch").getValue();
			var store = Ext.getCmp("moitorConfigGrid").getStore();
			store.clearFilter();
			store.filterBy(function(recode, id) {
				thisText = recode.data[configs.moitorConfigName.name];
				if (thisText.indexOf(text) !== -1) {
					return true;
				} else {
					return false;
				}
			});
		}
	},
	alarmConfig: {
		getAlarmConfig: function() {
			var area = Ext.getCmp("alarmConfigArea");
			var channelId = Ext.getCmp("alarmConfigChannel").getValue();
			var params = {
				city: "GUANG_ZHOU",
				channelId: channelId || 1
			}
			model.busiConfig.getAlarmConfigList(params);
		},
		setAlarmConfigList: function(data) {
			var stroe = Ext.getCmp("alarmConfigGrid").getStore();
			var name = configs.alarmConfigName;
			for (var i = 0, l = data.length; i < l; i++) {
				if (data[i][name.rule] == 1) {
					data[i][name.threshold] = data[i][name.failedCount];
				} else {
					data[i][name.threshold] = (data[i][name.sysSuccRate] * 100) || 0;
				}
			}
			stroe.loadData(data);
		},
		updateAlarmConfig: function() {
			var stroe = Ext.getCmp("alarmConfigGrid").getStore();
			var stroeData = stroe.data.items;
			var name = configs.alarmConfigName;
			var data = [];
			for (var i = 0, l = stroeData.length; i < l; i++) {
				var rec = stroeData[i];
				var rule = rec.get(name.rule);
				var threshold = rec.get(name.threshold);
				if (rule == 1) {
					rec.set(name.failedCount, threshold);
				} else {
					rec.set(name.sysSuccRate, (threshold / 100) || 0);
				}
				data.push(stroeData[i]["data"]);
			}
			var params = {
				rules: data
			}
			model.busiConfig.updateAlarmConfig(params);
		},
		returnUpdateAlarmConfig: function() {
			tools.toast("保存成功");
			ctrl.busiConfig.alarmConfig.getAlarmConfig();
		},
		search: function() {
			var text = Ext.getCmp("alarmConfigsSearch").getValue();
			var store = Ext.getCmp("alarmConfigGrid").getStore();
			store.clearFilter();
			store.filterBy(function(recode, id) {
				thisText = recode.data[configs.alarmConfigName.name];
				if (thisText.indexOf(text) !== -1) {
					return true;
				} else {
					return false;
				}
			});
		}
	}
};
// 概况配置结束------------------------------------