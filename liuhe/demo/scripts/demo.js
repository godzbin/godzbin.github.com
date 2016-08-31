Ext.ns("P_main");

Ext.onReady(function() {
			new P_main.GuiMgr().render();
		});

P_main.Const = {
	gap : 5,
	bodyPadding : 5
};

P_main.Utils = {
	resize : function(mgrs, p, colCount, rowCount, h) {
		var w;
		if (h && h > 0) {
			var el = p.body.child("table");
			w = el.getWidth();
			if (h > p.getInnerHeight()) {
				w -= 20;
			}
		} else {
			w = p.getInnerWidth();
			h = p.getInnerHeight();
		}
		var pw = parseInt((w - P_main.Const.gap * (colCount + 1)) / colCount);
		var ph = parseInt((h - P_main.Const.gap * (rowCount + 1)) / rowCount);
		for (var i = 0; i < mgrs.length; ++i) {
			mgrs[i].getContent().setSize(pw, ph);
		}
	},

	render : function(mgrs, cellIds) {
		for (var i = 0; i < mgrs.length; ++i) {
			mgrs[i].createContent({
						style : {
							height : "100%"
						}
					}).render(cellIds[i]);
		}
	}
};

P_main.createTableHTML = function(column, row, cellIds) {
	var s = [];
	s.push("<table class='layoutTable' cellspacing='" + P_main.Const.gap
			+ "px'>");
	for (var i = 0; i < row; ++i) {
		s.push("<tr>");
		for (var j = 0; j < column; ++j) {
			var cellId = "c" + Utils.getId();
			cellIds.push(cellId);
			s.push("<td id='" + cellId + "'></td>");
		}
		s.push("</tr>");
	}
	s.push("</table>");
	return s.join("");
};

P_main.BusiGeneral = {
	NAME : "NAME",
	TRANS_COUNT : "TRANS_COUNT",
	SUCC_RATE : "SUCC_RATE",
	USED_TIME : "USED_TIME",
	ALARM_COUNT : "ALARM_COUNT"
};

P_main.BusiDetail = {
	NAME : "NAME",
	END_TIME : "END_TIME",
	USED_TIME : "USED_TIME",
	STATUS : "STATUS"
};

P_main.BusiAlarm = {
	LEVEL : "LEVEL",
	NAME : "NAME",
	DESC : "DESC",
	OCCUR_TIME : "OCCUR_TIME"
};

P_main.BusiP2PInfo = {
	NAME : "NAME",
	VALUE1 : "VALUE1",
	VALUE2 : "VALUE2",
	VALUE3 : "VALUE3"
};

P_main.ChartMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_main.ChartMgr.superclass.constructor.call(this);
			},

			createContent : function(config) {
				this.chartId = "chart" + Utils.getId();
				this.content = new Ext.Panel(Ext.apply({}, config || {}));
				this.content.on("afterrender", this.onAfterRender, this);
				return this.content;
			},

			getContent : function() {
				return this.content;
			},

			onAfterRender : function(p) {
				p.on("resize", this.onResize, this);
				this.renderChart();
			},

			onResize : function(p, w, h) {
				this.chart.setSize(w, h);
			},

			createChart : function(containerId) {
			},

			renderChart : function() {
				if (!this.chart) {
					this.chart = this.createChart(this.content.body.dom.id);
				}
			}
		});

P_main.BusiGeneralChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.BusiGeneralChart.superclass.constructor.call(this);
			},

			createChart : function(containerId) {
				var series1 = {
					data : [15529, 5455, 3581, 45660, 26804, 29316, 9977,
							24784, 11396, 39878, 11504, 16029],
					name : '实时话费查询'
				};
				var series2 = {
					data : [3029, 523, 2382, 1204, 1586, 2931, 3745, 1311,
							2476, 4464, 2248, 3776],
					name : '我的移动'
				};
				var series3 = {
					data : [51513, 68451, 5080, 68911, 26135, 50782, 24897,
							65582, 19807, 45045, 58551, 41294],
					name : '营业厅登陆'
				};
				var series4 = {
					data : [34981, 49322, 24624, 42644, 49755, 25539, 26206,
							23488, 56045, 24301, 44959, 26320],
					name : '普通充值'
				};
				var series5 = {
					data : [23527, 5423, 47668, 16363, 67228, 69446, 67236,
							11352, 44488, 69825, 75228, 31090],
					name : '实时费用查询'
				};
				var categoryList = ['15:00', '15:05', '15:10', '15:15',
						'15:20', '15:25', '15:30', '15:35', '15:40', '15:45',
						'15:50', '15:55'];
				var max = function(dataList) {
					return Math.max.apply(Math, dataList);
				}
				var extreme_val = max([max(series1.data), max(series2.data),
						max(series3.data), max(series4.data), max(series5.data)])
						* 1.2;
				return new Highcharts.Chart({
							title : {
								text : ""
							},
							series : [series1, series2, series3, series4,
									series5],
							yAxis : {
								title : {
									text : "平均办理时长ms"
								},
								max : extreme_val,
								min : 0
							},
							xAxis : {
								categories : categoryList
							},
							credits : {
								enabled : false
							},
							chart : {
								renderTo : containerId
							}
						});
			}
		});

P_main.BusiGeneralGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				P_main.BusiGeneralGrid.superclass.constructor.call(this);
			},

			createFields : function() {
				var o = P_main.BusiGeneral;
				var fs = [];
				for (var k in o) {
					fs.push(o[k]);
				}
				return fs;
			},

			createColumnModel : function() {
				var cols = [{
							header : "序号",
							width : 30,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "业务",
							dataIndex : P_main.BusiGeneral.NAME,
							width : 100,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "交易量",
							dataIndex : P_main.BusiGeneral.TRANS_COUNT,
							width : 80,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "成功率",
							dataIndex : P_main.BusiGeneral.SUCC_RATE,
							width : 80,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "办理时长(ms)",
							dataIndex : P_main.BusiGeneral.USED_TIME,
							width : 80,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "告警数",
							dataIndex : P_main.BusiGeneral.ALARM_COUNT,
							width : 80,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}];
				return P_main.BusiGeneralGrid.superclass.createColumnModel
						.call(this, cols);
			},

			__renderer : function(value, metaData, record, rowIndex, colIndex,
					store) {
				if (colIndex == 0) {
					return rowIndex + 1;
				}
				return value;
			},

			createContent : function(config) {
				this.content = P_main.BusiGeneralGrid.superclass.createGrid
						.call(this, Ext.apply({
											title : "业务概况",
											frame : true
										}, config || {}));
				this.content.on("afterrender", this.onAfterRender, this);
				return this.content;
			},

			getContent : function() {
				return this.content;
			},

			onAfterRender : function() {
				this.setDataList(this.createDatas());
			},

			createDatas : function() {
				var datas = [];
				var o = {};
				o[P_main.BusiGeneral.NAME] = "产品变更";
				o[P_main.BusiGeneral.TRANS_COUNT] = 46326;
				o[P_main.BusiGeneral.SUCC_RATE] = "99.50%";
				o[P_main.BusiGeneral.USED_TIME] = 23685;
				o[P_main.BusiGeneral.ALARM_COUNT] = 2;
				datas.push(o);

				o = {};
				o[P_main.BusiGeneral.NAME] = "收费";
				o[P_main.BusiGeneral.TRANS_COUNT] = 16800;
				o[P_main.BusiGeneral.SUCC_RATE] = "98.64%";
				o[P_main.BusiGeneral.USED_TIME] = 12881;
				o[P_main.BusiGeneral.ALARM_COUNT] = 4;
				datas.push(o);

				o = {};
				o[P_main.BusiGeneral.NAME] = "重置密码";
				o[P_main.BusiGeneral.TRANS_COUNT] = 5040;
				o[P_main.BusiGeneral.SUCC_RATE] = "99.32%";
				o[P_main.BusiGeneral.USED_TIME] = 16425;
				o[P_main.BusiGeneral.ALARM_COUNT] = 0;
				datas.push(o);

				o = {};
				o[P_main.BusiGeneral.NAME] = "空白卡补卡";
				o[P_main.BusiGeneral.TRANS_COUNT] = 5010;
				o[P_main.BusiGeneral.SUCC_RATE] = "99.23%";
				o[P_main.BusiGeneral.USED_TIME] = 39652;
				o[P_main.BusiGeneral.ALARM_COUNT] = 8;
				datas.push(o);

				o = {};
				o[P_main.BusiGeneral.NAME] = "开户";
				o[P_main.BusiGeneral.TRANS_COUNT] = 3946;
				o[P_main.BusiGeneral.SUCC_RATE] = "98.96%";
				o[P_main.BusiGeneral.USED_TIME] = 56170;
				o[P_main.BusiGeneral.ALARM_COUNT] = 3;
				datas.push(o);

				return datas;
			}
		});

P_main.BusiDetailGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				P_main.BusiDetailGrid.superclass.constructor.call(this);
			},

			createFields : function() {
				var o = P_main.BusiDetail;
				var fs = [];
				for (var k in o) {
					fs.push(o[k]);
				}
				return fs;
			},

			createColumnModel : function() {
				var cols = [{
							header : "序号",
							width : 30,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "业务",
							dataIndex : P_main.BusiDetail.NAME,
							width : 100,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "结束时间",
							dataIndex : P_main.BusiDetail.END_TIME,
							width : 100,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "办理时长(ms)",
							dataIndex : P_main.BusiDetail.USED_TIME,
							width : 80,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "状态",
							dataIndex : P_main.BusiDetail.STATUS,
							width : 60,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}];
				return P_main.BusiDetailGrid.superclass.createColumnModel.call(
						this, cols);
			},

			__renderer : function(value, metaData, record, rowIndex, colIndex,
					store) {
				if (colIndex == 0) {
					return rowIndex + 1;
				}
				return value;
			},

			createContent : function(config) {
				this.content = P_main.BusiDetailGrid.superclass.createGrid
						.call(this, Ext.apply({
											title : "业务详单",
											frame : true
										}, config || {}));
				this.content.on("afterrender", this.onAfterRender, this);
				return this.content;
			},

			getContent : function() {
				return this.content;
			},

			onAfterRender : function() {
				this.setDataList(this.createDatas());
			},

			createDatas : function() {
				var datas = [];
				var o = {};
				o[P_main.BusiDetail.NAME] = "补卡";
				o[P_main.BusiDetail.END_TIME] = "2016-04-05 11:04:30";
				o[P_main.BusiDetail.USED_TIME] = 24116;
				o[P_main.BusiDetail.STATUS] = "成功";
				datas.push(o);

				o = {};
				o[P_main.BusiDetail.NAME] = "身份确认";
				o[P_main.BusiDetail.END_TIME] = "2016-04-06 11:04:30";
				o[P_main.BusiDetail.USED_TIME] = 28021;
				o[P_main.BusiDetail.STATUS] = "成功";
				datas.push(o);

				o = {};
				o[P_main.BusiDetail.NAME] = "预约销户";
				o[P_main.BusiDetail.END_TIME] = "2016-04-07 11:04:30";
				o[P_main.BusiDetail.USED_TIME] = 23200;
				o[P_main.BusiDetail.STATUS] = "失败";
				datas.push(o);

				o = {};
				o[P_main.BusiDetail.NAME] = "品牌转换";
				o[P_main.BusiDetail.END_TIME] = "2016-04-08 11:04:30";
				o[P_main.BusiDetail.USED_TIME] = 34187;
				o[P_main.BusiDetail.STATUS] = "成功";
				datas.push(o);

				o = {};
				o[P_main.BusiDetail.NAME] = "申请开机";
				o[P_main.BusiDetail.END_TIME] = "2016-04-09 11:04:30";
				o[P_main.BusiDetail.USED_TIME] = 10682;
				o[P_main.BusiDetail.STATUS] = "成功";
				datas.push(o);

				return datas;
			}
		});

P_main.BusiAlarmGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				P_main.BusiAlarmGrid.superclass.constructor.call(this);
			},

			createFields : function() {
				var o = P_main.BusiAlarm;
				var fs = [];
				for (var k in o) {
					fs.push(o[k]);
				}
				return fs;
			},

			createColumnModel : function() {
				var cols = [{
							header : "序号",
							width : 30,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "级别",
							dataIndex : P_main.BusiAlarm.LEVEL,
							width : 40,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "标题",
							dataIndex : P_main.BusiAlarm.NAME,
							width : 100,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "现象",
							dataIndex : P_main.BusiAlarm.DESC,
							width : 120,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "触发时间",
							dataIndex : P_main.BusiAlarm.OCCUR_TIME,
							width : 100,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}];
				return P_main.BusiAlarmGrid.superclass.createColumnModel.call(
						this, cols);
			},

			__renderer : function(value, metaData, record, rowIndex, colIndex,
					store) {
				if (colIndex == 0) {
					return rowIndex + 1;
				}
				return value;
			},

			createContent : function(config) {
				this.content = P_main.BusiAlarmGrid.superclass.createGrid.call(
						this, Ext.apply({
									title : "业务警告",
									frame : true
								}, config || {}));
				this.content.on("afterrender", this.onAfterRender, this);
				return this.content;
			},

			getContent : function() {
				return this.content;
			},

			onAfterRender : function() {
				this.setDataList(this.createDatas());
			},

			createDatas : function() {
				var datas = [];
				var o = {};
				o[P_main.BusiAlarm.LEVEL] = "紧急";
				o[P_main.BusiAlarm.NAME] = "产品变更失败告警";
				o[P_main.BusiAlarm.DESC] = "连续10分钟成功率小于95%";
				o[P_main.BusiAlarm.OCCUR_TIME] = "2016-04-05 11:04:30";
				datas.push(o);

				o = {};
				o[P_main.BusiAlarm.LEVEL] = "紧急";
				o[P_main.BusiAlarm.NAME] = "收费失败告警";
				o[P_main.BusiAlarm.DESC] = "连续10分钟成功率小于95%";
				o[P_main.BusiAlarm.OCCUR_TIME] = "2016-04-06 11:04:30";
				datas.push(o);

				o = {};
				o[P_main.BusiAlarm.LEVEL] = "紧急";
				o[P_main.BusiAlarm.NAME] = "重置密码失败告警";
				o[P_main.BusiAlarm.DESC] = "15分钟失败次数超过50次";
				o[P_main.BusiAlarm.OCCUR_TIME] = "2016-04-07 11:04:30";
				datas.push(o);

				o = {};
				o[P_main.BusiAlarm.LEVEL] = "紧急";
				o[P_main.BusiAlarm.NAME] = "空白卡补卡失败告警";
				o[P_main.BusiAlarm.DESC] = "15分钟失败次数超过50次";
				o[P_main.BusiAlarm.OCCUR_TIME] = "2016-04-08 11:04:30";
				datas.push(o);

				o = {};
				o[P_main.BusiAlarm.LEVEL] = "紧急";
				o[P_main.BusiAlarm.NAME] = "开户失败告警";
				o[P_main.BusiAlarm.DESC] = "连续5分钟成功率小于90%";
				o[P_main.BusiAlarm.OCCUR_TIME] = "2016-04-09 11:04:30";
				datas.push(o);

				return datas;
			}
		});

P_main.PathGraphMgr = Ext.extend(Ext.util.Observable, {
	constructor : function() {
		P_main.PathGraphMgr.superclass.constructor.call(this);
	},

	createContent : function(config) {
		this.containerId = "container" + Utils.getId();
		this.content = new Ext.Panel(Ext.apply({
			title : this.getTitle(),
			frame : true,
			bodyStyle : {
				border : "1px solid #97CBFF",
				backgroundColor : "#fff",
				"overflow-x" : "auto"
			},
			html : "<div id='"
					+ this.containerId
					+ "' style='position:absolute;top:0px;left:0px;width:100%;height:100%'></div>"
		}, config || {}));
		this.content.on("afterrender", this.renderGraph, this);
		return this.content;
	},

	getContent : function() {
		return this.content;
	},

	createListHTML : function(item, separate) {
		var s = [];
		s.push("<div class='content " + (separate ? "separate" : "") + "'>");
		s.push("<div class='title'>" + item.title + "</div>");
		s.push("<div class='listContainer'>");
		for (var i = 0; i < item.kpisList.length; ++i) {
			var kpis = item.kpisList[i];
			s.push("<div class='list'>");
			for (var j = 0; j < kpis.length; ++j) {
				s.push("<div>" + kpis[j] + "</div>");
			}
			s.push("</div>");
		}
		s.push("</div>");
		s.push("</div>");
		return s.join("");
	},

	renderGraph : function() {
	}
});

P_main.BusiPathGraphMgr = Ext.extend(P_main.PathGraphMgr, {
			constructor : function() {
				P_main.BusiPathGraphMgr.superclass.constructor.call(this);
			},

			getTitle : function() {
				return "业务路径图";
			},

			createPathItemHTML : function(o) {
				var s = [];
				s.push("<div class='pathItem busiess " + (o.cls ? o.cls : "")
						+ "'>");
				s.push(this.createListHTML(o));
				s.push("</div>");
				return s.join("");
			},

			renderGraph : function() {
				var body = Ext.get(this.containerId);
				var x = 20;
				var y = 8;
				var hgap = 80;
				var html = this.createPathItemHTML({
							title : "客户详情和账户列表",
							kpisList : [["平均处理时长: 1651.867ms", "成功率: 99.93%"],
									["交易量: 8152", "告警数: 17921"]]
						});
				var el = Ext.get(body.insertHtml("beforeEnd", html));
				el.setLeftTop(x + "px", y + "px");

				var html = this.createPathItemHTML({
							title : "普通充值_资金费用信息",
							kpisList : [["平均处理时长: 1694.533ms", "成功率: 100%"],
									["交易量: 4845", "告警数: 21200"]]
						});
				var el = Ext.get(body.insertHtml("beforeEnd", html));
				el.setLeftTop((x + 420) + "px", y + "px");

				var html = this.createPathItemHTML({
							title : "普通充值_充值",
							cls : "green",
							kpisList : [["平均处理时长: 158.801ms", "成功率: 99.85%"],
									["交易量: 1330", "告警数: 10514"]]
						});
				var el = Ext.get(body.insertHtml("beforeEnd", html));
				el.setLeftTop((x + 840) + "px", y + "px");

				var el = Ext.get(Ext.DomHelper.append(body, {
							cls : "arrow-right",
							style : {
								position : "absolute"
							}
						}));
				el.setLeftTop((x + 350) + "px", (y + 50) + "px");

				var el = Ext.get(Ext.DomHelper.append(body, {
							cls : "arrow-right",
							style : {
								position : "absolute"
							}
						}));
				el.setLeftTop((x + 770) + "px", (y + 50) + "px");
			}
		});

P_main.ITPathGraphMgr = Ext.extend(P_main.PathGraphMgr, {
			constructor : function() {
				P_main.ITPathGraphMgr.superclass.constructor.call(this);
			},

			getTitle : function() {
				return "IT路径图";
			},

			createPathItemHTML : function(o) {
				var s = [];
				s.push("<div class='pathItem'>");
				s.push("<div class='header'>");
				s.push("<div class='left'>" + o.caption + "</div>");
				s.push("<div class='right'>" + o.subCaption + "</div>");
				s.push("</div>");
				s.push("<div class='body clear'>");
				for (var k = 0; k < o.items.length; ++k) {
					s.push(this.createListHTML(o.items[k], o.separate));
				}
				s.push("<div class='clear'></div>");
				s.push("</div>");
				s.push("</div>");
				return s.join("");
			},

			renderGraph : function() {
				var body = Ext.get(this.containerId);
				var x = 20;
				var y = 8;
				var hgap = 80;
				var html = this.createPathItemHTML({
							caption : "客户环节",
							subCaption : "平均处理时长: 32.166ms",
							items : [{
								title : "客户端",
								kpisList : [
										["平均处理时长: 32.166ms", "成功率: 42.09%"],
										["用户数量: 6", "告警数: 77261"]]
							}]
						});
				var el = Ext.get(body.insertHtml("beforeEnd", html));
				el.setLeftTop(x + "px", y + "px");

				var html = this.createPathItemHTML({
							caption : "网络环节",
							subCaption : "平均传输时长: 223.176ms",
							items : [{
										title : "访问网络",
										kpisList : [["平均传输时长: 223.176ms",
												"告警数: 6"]]
									}, {
										title : "接口网络",
										kpisList : [["平均传输时长: 0ms", "告警数: 0"]]
									}]
						});

				var el = Ext.get(body.insertHtml("beforeEnd", html));
				el.setLeftTop((x + 450) + "px", y + "px");

				var html = this.createPathItemHTML({
							caption : "接口环节",
							subCaption : "平均处理时长: 0ms",
							items : [{
								title : "统一接口",
								kpisList : [["平均处理时长: 0ms", "成功率: 0%"],
										["交易量: 6", "告警数: 0"]]
							}]
						});

				var el = Ext.get(body.insertHtml("beforeEnd", html));
				el.setLeftTop((x + 900), y + "px");

				var html = this.createPathItemHTML({
							caption : "系统环节",
							subCaption : "平均处理时长: 1197.139ms",
							separate : true,
							items : [{
								title : "WebService",
								kpisList : [
										["平均处理时长: 1197.139ms", "成功率: 42.09%"],
										["交易量: 3923", "告警数: 3765"]]
							}, {
								title : "中间件",
								kpisList : [["平均处理时长: 195.922ms", "成功率: 100%"],
										["交易量: 9201", "告警数: 2647"]]
							}, {
								title : "oracle",
								kpisList : [["平均处理时长: 1.6ms", "成功率: 100%"],
										["交易量: 10065", "告警数: 129"]]
							}]
						});

				var el = Ext.get(body.insertHtml("beforeEnd", html));
				el.setLeftTop(x + "px", (y + 250) + "px");

				var el = Ext.get(Ext.DomHelper.append(body, {
							cls : "arrow-right",
							style : {
								position : "absolute"
							}
						}));
				el.setLeftTop((x + 380) + "px", (y + 60) + "px");

				var el = Ext.get(Ext.DomHelper.append(body, {
							cls : "arrow-right",
							style : {
								position : "absolute"
							}
						}));
				el.setLeftTop((x + 830) + "px", (y + 60) + "px");

				var el = Ext.get(Ext.DomHelper.append(body, {
							cls : "arrow-right",
							style : {
								position : "absolute"
							}
						}));
				el.setLeftTop((x + 830) + "px", (y + 60) + "px");

				var el = Ext.get(Ext.DomHelper.append(body, {
							cls : "arrow-down",
							style : {
								position : "absolute"
							}
						}));
				el.setLeftTop((x + 500) + "px", (y + 190) + "px");

				var el = Ext.get(Ext.DomHelper.append(body, {
							cls : "arrow-up",
							style : {
								position : "absolute"
							}
						}));
				el.setLeftTop((x + 600) + "px", (y + 190) + "px");

				var el = Ext.get(Ext.DomHelper.append(body, {
							cls : "arrow-right",
							style : {
								position : "absolute"
							}
						}));
				el.setLeftTop((x + 360) + "px", (y + 330) + "px");

				var el = Ext.get(Ext.DomHelper.append(body, {
							cls : "arrow-right",
							style : {
								position : "absolute"
							}
						}));
				el.setLeftTop((x + 760) + "px", (y + 330) + "px");
			}
		});

P_main.GeneralPage = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_main.GeneralPage.superclass.constructor.call(this);
				this.ITGraphMgr = new P_main.ITPathGraphMgr();
				this.cellIds = [];
				this.topPanelMgrs = [new P_main.BusiGeneralGrid(),
						new P_main.BusiDetailGrid(),
						new P_main.BusiGeneralChart(),
						new P_main.BusiAlarmGrid()];
			},

			activate : function() {
				this.content.doLayout();
			},

			createTopPanel : function() {
				var topPanel = new Ext.Panel({
							height : 350 + P_main.Const.gap * 3,
							border : false,
							html : P_main.createTableHTML(2, 2, this.cellIds)
						});
				topPanel.on("afterrender", this.onTopPanelRendered, this);
				return topPanel;
			},

			onTopResize : function(p, w, h) {
				P_main.Utils.resize(this.topPanelMgrs, p, 2, 2);
			},

			onTopPanelRendered : function(p) {
				P_main.Utils.render(this.topPanelMgrs, this.cellIds);
				p.on("resize", this.onTopResize, this);
			},

			createContent : function() {
				var v = P_main.Const.gap;
				var bottomPanel = new Ext.Panel({
							height : 500,
							region : "center",
							border : false,
							layout : "fit",
							bodyStyle : {
								padding : "0 " + v + "px " + v + "px " + v
										+ "px"
							},
							items : [this.ITGraphMgr.createContent()]
						});
				this.content = new Ext.Panel({
							layout : "column",
							border : false,
							bodyStyle : {
								"overflow-y" : "auto"
							},
							defaults : {
								columnWidth : 1
							},
							items : [this.createTopPanel(), bottomPanel]
						});
				return this.content;
			}
		});

P_main.TransCountTopNChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.TransCountTopNChart.superclass.constructor.call(this);
			},

			createChart : function(containerId) {
				return new Highcharts.Chart({
							chart : {
								type : 'bar',
								renderTo : containerId
							},
							title : {
								text : '业务交易量'
							},
							credits : {
								enabled : false
							},
							xAxis : {
								type : 'category',
								labels : {
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							},
							yAxis : {
								min : 0,
								title : {
									text : '交易量'
								}
							},
							legend : {
								enabled : false
							},
							tooltip : {

				}			,
							series : [{
								name : '交易量',
								data : [['套餐变更', 2500000], ['普通充值', 1250000],
										['实时费用查询', 30000], ['营业厅登陆', 20000],
										['实时话费查询', 9000]],
								dataLabels : {
									enabled : false,
									color : '#FFFFFF',
									align : 'right',
									format : '{point.y:.1f}', // one decimal
									y : 10, // 10 pixels down from the top
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							}]
						});
			}
		});

P_main.AvgUsedTimeTopNChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.AvgUsedTimeTopNChart.superclass.constructor.call(this);
			},

			createChart : function(containerId) {
				return new Highcharts.Chart({
							chart : {
								type : 'bar',
								renderTo : containerId
							},
							title : {
								text : '业务平均处理时长'
							},
							credits : {
								enabled : false
							},
							xAxis : {
								type : 'category',
								labels : {
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							},
							yAxis : {
								min : 0,
								title : {
									text : '平均处理时长(ms)'
								}
							},
							legend : {
								enabled : false
							},
							tooltip : {

				}			,
							series : [{
								name : '处理时长',
								data : [['营业厅登陆', 5509], ['实时费用查询', 3260],
										['月账单查询', 2334], ['实时话费查询', 1503],
										['普通充值', 1422]],
								dataLabels : {
									enabled : false,
									color : '#FFFFFF',
									align : 'right',
									format : '{point.y:.1f}', // one decimal
									y : 10, // 10 pixels down from the top
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							}]
						});
			}
		});

P_main.SuccRateTopNChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.SuccRateTopNChart.superclass.constructor.call(this);
			},

			createChart : function(containerId) {
				return new Highcharts.Chart({
							chart : {
								type : 'bar',
								renderTo : containerId
							},
							title : {
								text : '业务成功率'
							},
							credits : {
								enabled : false
							},
							xAxis : {
								type : 'category',
								labels : {
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							},
							yAxis : {
								min : 0,
								max : 100,
								title : {
									text : '成功率(%s)'
								}
							},
							legend : {
								enabled : false
							},
							series : [{
								name : '成功率',
								data : [['月账单查询', 100], ['实时费用查询', 99.9],
										['普通充值', 99.8], ['实时话费查询', 99.6],
										['营业厅登陆', 99.5]],
								dataLabels : {
									enabled : false,
									color : '#FFFFFF',
									align : 'right',
									format : '{point.y:.1f}', // one decimal
									y : 10, // 10 pixels down from the top
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							}]
						});
			}
		});

P_main.ServerCostTimeTopNChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.ServerCostTimeTopNChart.superclass.constructor
						.call(this);
			},

			createChart : function(containerId) {
				return new Highcharts.Chart({
							chart : {
								type : 'bar',
								renderTo : containerId
							},
							title : {
								text : '服务端耗时'
							},
							credits : {
								enabled : false
							},
							xAxis : {
								type : 'category',
								labels : {
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							},
							yAxis : {
								min : 0,
								title : {
									text : '消耗时长(ms)'
								}
							},
							legend : {
								enabled : false
							},
							series : [{
								name : '消耗时长',
								data : [['月账单查询', 2800],
										['来电提醒服务变更(开通)', 2250],
										['实时话费查询', 2023], ['充值记录查询', 1198],
										['自选套餐', 1007]],
								dataLabels : {
									enabled : false,
									color : '#FFFFFF',
									align : 'right',
									format : '{point.y:.1f}', // one decimal
									y : 10, // 10 pixels down from the top
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							}]
						});
			}
		});

P_main.ClientCostTimeTopNChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.ClientCostTimeTopNChart.superclass.constructor
						.call(this);
			},

			createChart : function(containerId) {
				return new Highcharts.Chart({
							chart : {
								type : 'bar',
								renderTo : containerId
							},
							title : {
								text : '客户端耗时'
							},
							credits : {
								enabled : false
							},
							xAxis : {
								type : 'category',
								labels : {
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							},
							yAxis : {
								min : 0,
								title : {
									text : '消耗时长(ms)'
								}
							},
							legend : {
								enabled : false
							},
							series : [{
								name : '消耗时长',
								data : [['月账单查询', 2800],
										['来电提醒服务变更(开通)', 2250],
										['实时话费查询', 2023], ['充值记录查询', 1198],
										['自选套餐', 1007]],
								dataLabels : {
									enabled : false,
									color : '#FFFFFF',
									align : 'right',
									format : '{point.y:.1f}', // one decimal
									y : 10, // 10 pixels down from the top
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							}]
						});
			}
		});

P_main.NetworkCostTimeTopNChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.NetworkCostTimeTopNChart.superclass.constructor
						.call(this);
			},

			createChart : function(containerId) {
				return new Highcharts.Chart({
							chart : {
								type : 'bar',
								renderTo : containerId
							},
							title : {
								text : '网络耗时'
							},
							credits : {
								enabled : false
							},
							xAxis : {
								type : 'category',
								labels : {
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							},
							yAxis : {
								min : 0,
								title : {
									text : '消耗时长(ms)'
								}
							},
							legend : {
								enabled : false
							},
							series : [{
								name : '消耗时长',
								data : [['月账单查询', 2800],
										['来电提醒服务变更(开通)', 2250],
										['实时话费查询', 2023], ['充值记录查询', 1198],
										['自选套餐', 1007]],
								dataLabels : {
									enabled : false,
									color : '#FFFFFF',
									align : 'right',
									format : '{point.y:.1f}', // one decimal
									y : 10, // 10 pixels down from the top
									style : {
										fontSize : '13px',
										fontFamily : 'Verdana, sans-serif'
									}
								}
							}]
						});
			}
		});

P_main.MultiDimTopNPage = Ext.extend(Ext.util.Observable, {
	constructor : function() {
		P_main.MultiDimTopNPage.superclass.constructor.call(this);
		this.cellIds = [];
		this.mgrs = [new P_main.TransCountTopNChart(),
				new P_main.AvgUsedTimeTopNChart(),
				new P_main.SuccRateTopNChart(),
				new P_main.ServerCostTimeTopNChart(),
				new P_main.ClientCostTimeTopNChart(),
				new P_main.NetworkCostTimeTopNChart()];
	},

	activate : function() {
		if (!this.innerPanel) {
			this.innerPanel = new Ext.Panel({
				title : "当前路径 / 综合分析 / 多维度TopN分析",
				border : false,
				html : "<div class='layoutTableContainer'>"
						+ P_main.createTableHTML(2, 3, this.cellIds) + "</div>",
				tbar : this.createTBar()
			});
			this.innerPanel.on("afterrender", this.onAfterRender, this);
			this.content.add(this.innerPanel);
		}
	},

	createContent : function() {
		this.content = new Ext.Panel({
					bodyStyle : {
						padding : P_main.Const.bodyPadding + "px"
					},
					border : false,
					layout : "fit"
				});
		return this.content;
	},

	getContent : function() {
		return this.content;
	},

	onResize : function(p, w, h) {
		P_main.Utils.resize(this.mgrs, p, 2, 3, 700);
	},

	onAfterRender : function(p) {
		p.body.child("table").applyStyles("height: 500px");
		P_main.Utils.render(this.mgrs, this.cellIds);
		p.on("resize", this.onResize, this);
	},

	createTBar : function() {
		var gapHtml = "&nbsp;";
		var data = [["所有区域", ""]];
		var areaDimCombo = GuiUtil.createComboBox({
					width : 120,
					store : new Ext.data.SimpleStore({
								fields : ["name", "value"],
								data : data
							}),
					value : data[0][1]
				});

		data = [["所有营业厅", ""]];
		var busiHallDimCombo = GuiUtil.createComboBox({
					width : 120,
					store : new Ext.data.SimpleStore({
								fields : ["name", "value"],
								data : data
							}),
					value : data[0][1]
				});

		data = [["所有系统", ""]];
		var systemDimCombo = GuiUtil.createComboBox({
					width : 120,
					store : new Ext.data.SimpleStore({
								fields : ["name", "value"],
								data : data
							}),
					value : data[0][1]
				});

		data = [["所有业务", ""]];
		var busiDimCombo = GuiUtil.createComboBox({
					width : 120,
					store : new Ext.data.SimpleStore({
								fields : ["name", "value"],
								data : data
							}),
					value : data[0][1]
				});

		data = [["业务", ""]];
		var busiCombo = GuiUtil.createComboBox({
					width : 120,
					store : new Ext.data.SimpleStore({
								fields : ["name", "value"],
								data : data
							}),
					value : data[0][1]
				});

		data = [["最近一小时", ""]];
		var intervalCombo = GuiUtil.createComboBox({
					width : 120,
					store : new Ext.data.SimpleStore({
								fields : ["name", "value"],
								data : data
							}),
					value : data[0][1]
				});

		data = [["前5条", ""]];
		var pageCountCombo = GuiUtil.createComboBox({
					width : 120,
					store : new Ext.data.SimpleStore({
								fields : ["name", "value"],
								data : data
							}),
					value : data[0][1]
				});

		var findBtn = common.ToolItem.createRefresh({
					text : "检 索",
					width : 60,
					iconCls : null
				});
		return [areaDimCombo, gapHtml, busiHallDimCombo, gapHtml,
				systemDimCombo, gapHtml, busiDimCombo, gapHtml, "统计对象:",
				gapHtml, busiCombo, gapHtml, intervalCombo, gapHtml,
				pageCountCombo, gapHtml, findBtn];
	}
});

P_main.AvgUsedTimeGeneralChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.AvgUsedTimeGeneralChart.superclass.constructor
						.call(this);
			},

			createChart : function(containerId) {
				var series1 = {
					data : [15529, 5455, 3581, 45660, 26804, 29316, 9977,
							24784, 11396, 39878, 11504, 16029],
					name : '套餐变更'
				};
				var series2 = {
					data : [3029, 523, 2382, 1204, 1586, 2931, 3745, 1311,
							2476, 4464, 2248, 3776],
					name : '营业厅登录'
				};
				var series3 = {
					data : [51513, 68451, 5080, 68911, 26135, 50782, 24897,
							65582, 19807, 45045, 58551, 41294],
					name : '普通充值'
				};
				var series4 = {
					data : [34981, 49322, 24624, 42644, 49755, 25539, 26206,
							23488, 56045, 24301, 44959, 26320],
					name : '月账单查询'
				};
				var series5 = {
					data : [23527, 5423, 47668, 16363, 67228, 69446, 67236,
							11352, 44488, 69825, 75228, 31090],
					name : '实时费用查询'
				};
				var categoryList = ['15:00', '15:05', '15:10', '15:15',
						'15:20', '15:25', '15:30', '15:35', '15:40', '15:45',
						'15:50', '15:55'];
				var max = function(dataList) {
					return Math.max.apply(Math, dataList);
				}
				var extreme_val = max([max(series1.data), max(series2.data),
						max(series3.data), max(series4.data), max(series5.data)])
						* 1.2;
				return new Highcharts.Chart({
							title : {
								text : "业务平均处理时长"
							},
							series : [series1, series2, series3, series4,
									series5],
							yAxis : {
								title : {
									text : "平均办理时长ms"
								},
								max : extreme_val,
								min : 0
							},
							xAxis : {
								categories : categoryList
							},
							credits : {
								enabled : false
							},
							chart : {
								renderTo : containerId,
								height : 200
							}
						});
			}
		});

P_main.TransCountGeneralChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.TransCountGeneralChart.superclass.constructor.call(this);
			},

			createChart : function(containerId) {
				var series1 = {
					data : [15529, 5455, 3581, 45660, 26804, 29316, 9977,
							24784, 11396, 39878, 11504, 16029],
					name : '套餐变更'
				};
				var series2 = {
					data : [3029, 523, 2382, 1204, 1586, 2931, 3745, 1311,
							2476, 4464, 2248, 3776],
					name : '营业厅登录'
				};
				var series3 = {
					data : [51513, 68451, 5080, 68911, 26135, 50782, 24897,
							65582, 19807, 45045, 58551, 41294],
					name : '普通充值'
				};
				var series4 = {
					data : [34981, 49322, 24624, 42644, 49755, 25539, 26206,
							23488, 56045, 24301, 44959, 26320],
					name : '月账单查询'
				};
				var series5 = {
					data : [23527, 5423, 47668, 16363, 67228, 69446, 67236,
							11352, 44488, 69825, 75228, 31090],
					name : '实时费用查询'
				};
				var categoryList = ['15:00', '15:05', '15:10', '15:15',
						'15:20', '15:25', '15:30', '15:35', '15:40', '15:45',
						'15:50', '15:55'];
				var max = function(dataList) {
					return Math.max.apply(Math, dataList);
				}
				var extreme_val = max([max(series1.data), max(series2.data),
						max(series3.data), max(series4.data), max(series5.data)])
						* 1.2;
				return new Highcharts.Chart({
							title : {
								text : "业务交易量"
							},
							series : [series1, series2, series3, series4,
									series5],
							yAxis : {
								title : {
									text : "交易量"
								},
								max : extreme_val,
								min : 0
							},
							xAxis : {
								categories : categoryList
							},
							credits : {
								enabled : false
							},
							chart : {
								renderTo : containerId,
								height : 200
							}
						});
			}
		});

P_main.BusiSuccRateGeneralChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.BusiSuccRateGeneralChart.superclass.constructor
						.call(this);
			},

			createChart : function(containerId) {
				var series1 = {
					data : [99.6, 99.2, 99.3, 99.4, 99.7, 99.2, 99.7, 99.9, 99.5, 99.1],
					name : '套餐变更'
				};
				var series2 = {
					data : [99.1, 99.6, 99.0, 99.7, 99.5, 99.5, 99.3, 99.9, 99.5, 99.7],
					name : '营业厅登录'
				};
				var series3 = {
					data : [99.9, 99.4, 99.7, 99.9, 99.2, 99.9, 99.1, 99.6, 99.7, 99.3],
					name : '普通充值'
				};
				var series4 = {
					data : [99.5, 99.9, 99.3, 99.6, 99.2, 99.1, 99.1, 99.3, 99.7, 99.9],
					name : '月账单查询'
				};
				var series5 = {
					data : [99.1, 99.6, 99.1, 99.5, 99.3, 99.5, 99.5, 99.3, 99.3, 99.9],
					name : '实时费用查询'
				};
				var categoryList = ['15:00', '15:05', '15:10', '15:15',
						'15:20', '15:25', '15:30', '15:35', '15:40', '15:45',
						'15:50', '15:55'];
				var max = function(dataList) {
					return Math.max.apply(Math, dataList);
				}
				var extreme_val = 100;
				return new Highcharts.Chart({
							title : {
								text : "业务成功率"
							},
							series : [series1, series2, series3, series4,
									series5],
							yAxis : {
								title : {
									text : "成功率(%)"
								},
								max : extreme_val,
								min : 90
							},
							xAxis : {
								categories : categoryList
							},
							credits : {
								enabled : false
							},
							chart : {
								renderTo : containerId,
								height : 200
							}
						});
			}
		});

P_main.BusiFailGeneralChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.BusiFailGeneralChart.superclass.constructor.call(this);
			},

			createChart : function(containerId) {
				var series1 = {
					data : [0.4, 0.5, 0.4, 0.1, 0.8, 0.6, 1.0, 0.5, 0.8, 0.5],
					name : '套餐变更'
				};
				var series2 = {
					data : [0.8, 1.0, 0.5, 0.1, 0.8, 0.6, 0.6, 0.9, 0.9, 0.1],
					name : '营业厅登录'
				};
				var series3 = {
					data : [0.1, 0.4, 0.5, 0.1, 0.1, 0.5, 0.4, 0.3, 1.0, 0.9],
					name : '普通充值'
				};
				var series4 = {
					data : [0.3, 0.8, 0.2, 0.9, 0.9, 0.9, 0.8, 0.3, 0.6, 0.8],
					name : '月账单查询'
				};
				var series5 = {
					data : [0.9, 0.2, 0.2, 0.5, 1.0, 0.7, 0.3, 0.9, 0.5, 0.6],
					name : '实时费用查询'
				};
				var categoryList = ['15:00', '15:05', '15:10', '15:15',
						'15:20', '15:25', '15:30', '15:35', '15:40', '15:45',
						'15:50', '15:55'];
				var max = function(dataList) {
					return Math.max.apply(Math, dataList);
				}
				var extreme_val = max([max(series1.data), max(series2.data),
						max(series3.data), max(series4.data), max(series5.data)])
						* 10;
				return new Highcharts.Chart({
							title : {
								text : "业务失败率"
							},
							series : [series1, series2, series3, series4,
									series5],
							yAxis : {
								title : {
									text : "失败率(%)"
								},
								max : extreme_val,
								min : 0
							},
							xAxis : {
								categories : categoryList
							},
							credits : {
								enabled : false
							},
							chart : {
								renderTo : containerId,
								height : 200
							}
						});
			}
		});

P_main.MultiDimGeneralPage = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_main.MultiDimGeneralPage.superclass.constructor.call(this);
				this.cellIds = [];
				this.mgrs = [new P_main.AvgUsedTimeGeneralChart(),
						new P_main.TransCountGeneralChart(),
						new P_main.BusiSuccRateGeneralChart(),
						new P_main.BusiFailGeneralChart()];
			},

			activate : function() {
				if (!this.innerPanel) {
					this.innerPanel = new Ext.Panel({
								title : "当前路径 / 综合分析 / 多维度统计分析",
								border : false,
								html : P_main.createTableHTML(2, 2,
										this.cellIds),
								tbar : this.createTBar()
							});
					this.innerPanel.on("afterrender", this.onAfterRender, this);
					this.content.add(this.innerPanel);
				}
			},

			createContent : function() {
				this.content = new Ext.Panel({
							bodyStyle : {
								padding : P_main.Const.bodyPadding + "px"
							},
							border : false,
							layout : "fit"
						});
				return this.content;
			},

			getContent : function() {
				return this.content;
			},

			onResize : function(p, w, h) {
				P_main.Utils.resize(this.mgrs, p, 2, 2);
			},

			onAfterRender : function(p) {
				P_main.Utils.render(this.mgrs, this.cellIds);
				p.on("resize", this.onResize, this);
			},

			createTBar : function() {
				var gapHtml = "&nbsp;";
				var data = [["所有区域", ""]];
				var areaDimCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				data = [["所有营业厅", ""]];
				var busiHallDimCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				data = [["所有系统", ""]];
				var systemDimCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				data = [["所有业务", ""]];
				var busiDimCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				data = [["业务", ""]];
				var busiCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				data = [["最近一小时", ""]];
				var intervalCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				var findBtn = common.ToolItem.createRefresh({
							text : "检 索",
							width : 60,
							iconCls : null
						});
				return [areaDimCombo, gapHtml, busiHallDimCombo, gapHtml,
						systemDimCombo, gapHtml, busiDimCombo, gapHtml,
						"统计对象:", gapHtml, busiCombo, gapHtml, intervalCombo,
						gapHtml, findBtn];
			}
		});

P_main.BusiTransCountChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.BusiTransCountChart.superclass.constructor.call(this);
			},

			createContent : function(config) {
				return P_main.BusiTransCountChart.superclass.createContent
						.call(this, Ext.apply({
											title : "业务交易量"
										}, config || {}));
			},

			createChart : function(containerId) {
				var series1 = {
					data : [3, 5, 8, 15, 20, 27, 33, 39, 43, 54, 57, 68],
					name : "普通充值"
				}

				var categoryList = ['15:00', '15:05', '15:10', '15:15',
						'15:20', '15:25', '15:30', '15:35', '15:40', '15:45',
						'15:50', '15:55'];

				var y_name = "交易量";

				var max = function(dataList) {
					return Math.max.apply(Math, dataList);
				};

				var extreme_val = max(series1.data) * 1.2;

				return new Highcharts.Chart({
							title : {
								text : ''
							},
							series : [series1],
							yAxis : {
								title : {
									text : y_name
								},
								max : extreme_val,
								min : 0
							},
							xAxis : {
								categories : categoryList
							},
							credits : {
								enabled : false
							},
							chart : {
								renderTo : containerId
							}
						});

			}
		});

P_main.BusiUsedTimeChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.BusiUsedTimeChart.superclass.constructor.call(this);
			},

			createContent : function(config) {
				return P_main.BusiUsedTimeChart.superclass.createContent.call(
						this, Ext.apply({
									title : "处理时长"
								}, config || {}));
			},

			createChart : function(containerId) {
				var series1 = {
					data : [203, 299, 309, 350, 251, 366, 205, 252, 255, 365, 243, 247],
					name : "普通充值"
				}

				var categoryList = ['15:00', '15:05', '15:10', '15:15',
						'15:20', '15:25', '15:30', '15:35', '15:40', '15:45',
						'15:50', '15:55'];

				var y_name = "处理时长(ms)";

				var max = function(dataList) {
					return Math.max.apply(Math, dataList);
				};

				var extreme_val = max(series1.data) * 1.2;

				return new Highcharts.Chart({
							title : {
								text : ''
							},
							series : [series1],
							yAxis : {
								title : {
									text : y_name
								},
								max : extreme_val,
								min : 0
							},
							xAxis : {
								categories : categoryList
							},
							credits : {
								enabled : false
							},
							chart : {
								renderTo : containerId
							}
						});
			}
		});

P_main.BusiSuccRateChart = Ext.extend(P_main.ChartMgr, {
			constructor : function() {
				P_main.BusiSuccRateChart.superclass.constructor.call(this);
			},

			createContent : function(config) {
				return P_main.BusiSuccRateChart.superclass.createContent.call(
						this, Ext.apply({
									title : "成功率"
								}, config || {}));
			},

			createChart : function(containerId) {
				var series1 = {
					data : [99.4, 99.2, 99.5, 99.3, 99.2, 99.3, 99.5, 99.9, 99.5, 99.7, 99.4, 99.2],
					name : "普通充值"
				}

				var categoryList = ['15:00', '15:05', '15:10', '15:15',
						'15:20', '15:25', '15:30', '15:35', '15:40', '15:45',
						'15:50', '15:55'];

				var y_name = "成功率(%)";

				var max = function(dataList) {
					return Math.max.apply(Math, dataList);
				};

				var extreme_val = 100;

				return new Highcharts.Chart({
							title : {
								text : ''
							},
							series : [series1],
							yAxis : {
								title : {
									text : y_name
								},
								max : extreme_val,
								min : 90
							},
							xAxis : {
								categories : categoryList
							},
							credits : {
								enabled : false
							},
							chart : {
								renderTo : containerId
							}
						});
			}
		});

P_main.BusiAnalyzeMgr = Ext.extend(Ext.util.Observable, {
	constructor : function() {
		P_main.BusiAnalyzeMgr.superclass.constructor.call(this);
		this.mgrs = [new P_main.BusiTransCountChart(),
				new P_main.BusiUsedTimeChart(), new P_main.BusiSuccRateChart()];
	},

	createContent : function() {
		var items = [];
		for (var i = 0; i < this.mgrs.length; ++i) {
			items.push(this.mgrs[i].createContent({
						border : false
					}));
		}
		this.content = new Ext.Panel({
					title : "业务交易分析",
					frame : true,
					layout : "fit",
					items : [new Ext.TabPanel({
								plain : true,
								activeTab : 0,
								items : items
							})]
				});
		return this.content;
	},

	getContent : function() {
		return this.content;
	}
});

P_main.BusiP2PInfoGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				P_main.BusiP2PInfoGrid.superclass.constructor.call(this);
			},

			createFields : function() {
				var o = P_main.BusiP2PInfo;
				var fs = [];
				for (var k in o) {
					fs.push(o[k]);
				}
				return fs;
			},

			createColumnModel : function() {
				var cols = [{
							header : "&nbsp;",
							width : 100,
							dataIndex : P_main.BusiP2PInfo.NAME,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "客户详情和账户列表",
							dataIndex : P_main.BusiP2PInfo.VALUE1,
							width : 100,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "普通充值_资金费用信息",
							dataIndex : P_main.BusiP2PInfo.VALUE2,
							width : 100,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}, {
							header : "普通充值_充值",
							dataIndex : P_main.BusiP2PInfo.VALUE3,
							width : 100,
							renderer : this.__renderer,
							sortable : false,
							scope : this
						}];
				return P_main.BusiP2PInfoGrid.superclass.createColumnModel
						.call(this, cols);
			},

			__renderer : function(value, metaData, record, rowIndex, colIndex,
					store) {
				return value;
			},

			createContent : function(config) {
				this.content = P_main.BusiP2PInfoGrid.superclass.createGrid
						.call(this, config);
				this.content.on("afterrender", this.onAfterRender, this);
				return this.content;
			},

			getContent : function() {
				return this.content;
			},

			onAfterRender : function() {
				this.setDataList(this.createDatas());
			},

			createDatas : function() {
				var datas = [];
				var o = {};
				o[P_main.BusiP2PInfo.NAME] = "交易量"
				o[P_main.BusiP2PInfo.VALUE1] = 8152
				o[P_main.BusiP2PInfo.VALUE2] = 4845;
				o[P_main.BusiP2PInfo.VALUE3] = 1330;
				datas.push(o);

				o = {};
				o[P_main.BusiP2PInfo.NAME] = "相对转换率"
				o[P_main.BusiP2PInfo.VALUE1] = "-";
				o[P_main.BusiP2PInfo.VALUE2] = "59.43%";
				o[P_main.BusiP2PInfo.VALUE3] = "27.45%";
				datas.push(o);

				o = {};
				o[P_main.BusiP2PInfo.NAME] = "绝对转换率"
				o[P_main.BusiP2PInfo.VALUE1] = "100%";
				o[P_main.BusiP2PInfo.VALUE2] = "59.43%";
				o[P_main.BusiP2PInfo.VALUE3] = "16.32%";
				datas.push(o);
				return datas;
			}
		});

Highcharts.getOptions().plotOptions.pie.colors = (function() {
	var colors = [], base = Highcharts.getOptions().colors[0], i;

	// Start out with a darkened base color (negative brighten), and end
	// up with a much brighter color
	colors.push('#4BBADA', '#EFA740', '#D8504C', '#53B453');
	return colors;
}());

Highcharts.getOptions().plotOptions.funnel.colors = (function() {
	var colors = [], base = Highcharts.getOptions().colors[0], i;

	// Start out with a darkened base color (negative brighten), and end
	// up with a much brighter color
	colors.push('#FF981F', '#00CCFF', '#90ED7D');
	return colors;
}());
P_main.AvgUsedTimePieChart = Ext.extend(P_main.ChartMgr, {
	constructor : function() {
		P_main.AvgUsedTimePieChart.superclass.constructor.call(this);
	},

	createChart : function(containerId) {
		return new Highcharts.Chart({
					chart : {
						type : 'pie',
						renderTo : containerId
					},
					title : {
						text : '<span>平均处理时长: 123001ms'
					},
					legend : {
						align : 'left',
						verticalAlign : 'top',
						layout : 'vertical',
						x : 0,
						y : 100
					},
					plotOptions : {
						pie : {
							innerSize : 70,
							dataLabels : {
								enabled : false
							}
						}
					},
					credits : {
						enabled : false
					},
					series : [{
								name : '交易量',
								data : [['正常', 10000], ['重要', 264], ['紧急', 32]],
								showInLegend : true,
								zoneAxis : 'y'
							}]
				});
	}
});

P_main.BusiP2PFunnelChart = Ext.extend(P_main.ChartMgr, {
	constructor : function() {
		P_main.BusiP2PFunnelChart.superclass.constructor.call(this);
	},

	createChart : function(containerId) {
		return new Highcharts.Chart({
			chart : {
				type : 'funnel',
				renderTo : containerId,
				marginRight : 150
			},
			title : {
				text : '',
				x : -50
			},
			plotOptions : {
				funnel : {
					dataLabels : {
						enabled : false
					}
				},
				series : {
					dataLabels : {
						enabled : true,
						format : '<b>{point.name}</b> ({point.y:,.0f})',
						color : (Highcharts.theme && Highcharts.theme.contrastTextColor)
								|| 'black',
						softConnector : true
					},
					neckWidth : '30%',
					neckHeight : '25%'
				}
			},
			credits : {
				enabled : false
			},
			legend : {
				enabled : false
			},
			series : [{
				name : '业务量',
				data : [['账户详情和账表', 8152], ['普通充值_资金费用信息', 4064],
						['普通充值_充值', 1987]]
			}]
		});
	}
});

P_main.BusiGeneralMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_main.BusiGeneralMgr.superclass.constructor.call(this);
				this.topCellIds = [];
				this.topMgrs = [new P_main.AvgUsedTimePieChart(),
						new P_main.BusiP2PFunnelChart()];
				this.grid = new P_main.BusiP2PInfoGrid();
			},

			createContent : function() {
				var topPanel = new Ext.Panel({
							region : "center",
							border : false,
							html : P_main
									.createTableHTML(2, 1, this.topCellIds)
						});
				topPanel.on("afterrender", this.onTopAfterRender, this);
				topPanel.on("resize", this.onTopResize, this);
				this.content = new Ext.Panel({
							title : "业务概况",
							layout : "border",
							items : [topPanel, this.grid.createContent({
												region : "south",
												border : false,
												height : 90
											})]
						});
				return this.content;
			},

			getContent : function() {
				return this.content;
			},

			onTopResize : function(p, w, h) {
				P_main.Utils.resize(this.topMgrs, p, 2, 1);
			},

			onTopAfterRender : function() {
				P_main.Utils.render(this.topMgrs, this.topCellIds);
			}
		});

P_main.BusiP2PAnalyzePage = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_main.BusiP2PAnalyzePage.superclass.constructor.call(this);
				this.busiGraphMgr = new P_main.BusiPathGraphMgr();
				this.ITGraphMgr = new P_main.ITPathGraphMgr();
				this.topCellIds = [];
				this.topMgrs = [new P_main.BusiGeneralMgr(),
						new P_main.BusiAnalyzeMgr()];
			},

			activate : function() {
				if (!this.innerPanel) {
					this.innerPanel = new Ext.Panel({
								title : "当前路径 / 业务监控 / 业务运行端到端分析",
								border : false,
								layout : "column",
								defaults : {
									columnWidth : 1
								},
								bodyStyle : {
									paddingRight : P_main.Const.bodyPadding
											+ "px",
									"overflow-y" : "auto"
								},
								items : [this.createTopPanel(),
										this.createMiddlePanel(),
										this.createBottomPanel()],
								tbar : this.createTBar()
							});
					this.content.add(this.innerPanel);
				}
			},

			createContent : function() {
				this.content = new Ext.Panel({
							bodyStyle : {
								padding : P_main.Const.bodyPadding + "px"
							},
							border : false,
							layout : "fit"
						});
				return this.content;
			},

			getContent : function() {
				return this.content;
			},

			createTopPanel : function() {
				var topPanel = new Ext.Panel({
							height : 350,
							border : false,
							html : P_main
									.createTableHTML(2, 1, this.topCellIds)
						});
				topPanel.on("afterrender", this.onTopAfterRender, this);
				return topPanel;
			},

			onTopResize : function(p, w, h) {
				P_main.Utils.resize(this.topMgrs, p, 2, 1);
			},

			onTopAfterRender : function(p) {
				P_main.Utils.render(this.topMgrs, this.topCellIds);
				p.on("resize", this.onTopResize, this);
			},

			createMiddlePanel : function() {
				return new Ext.Panel({
							layout : "fit",
							border : false,
							height : 210,
							bodyStyle : {
								paddingBottom : P_main.Const.bodyPadding + "px"
							},
							items : [this.busiGraphMgr.createContent()]
						});
			},

			createBottomPanel : function() {
				return new Ext.Panel({
							layout : "fit",
							border : false,
							height : 500,
							items : [this.ITGraphMgr.createContent()]
						});
			},

			createTBar : function() {
				var gapHtml = "&nbsp;";
				var data = [["所有区域", ""]];
				var areaDimCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				data = [["所有营业厅", ""]];
				var busiHallDimCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				data = [["营业厅", ""]];
				var busiHallCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				data = [["普通充值", ""]];
				var busiCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				data = [["最近一小时", ""]];
				var intervalCombo = GuiUtil.createComboBox({
							width : 120,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});

				var findBtn = common.ToolItem.createRefresh({
							text : "检 索",
							width : 60,
							iconCls : null
						});
				return [areaDimCombo, gapHtml, busiHallDimCombo, gapHtml,
						busiHallCombo, gapHtml, busiCombo, gapHtml,
						intervalCombo, gapHtml, findBtn];
			}
		});


P_main.GuiMgr = Ext.extend(Ext.util.Observable, {
	constructor : function() {
		P_main.GuiMgr.superclass.constructor.call(this);
		this.headerHeight = 35;
		this.mgrs = [new P_main.GeneralPage(), new P_main.BusiP2PAnalyzePage(),
				new P_main.MultiDimGeneralPage(), new P_main.MultiDimTopNPage()];
	},

	createContent : function() {
		var items = [];
		for (var i = 0; i < this.mgrs.length; ++i) {
			items.push(this.mgrs[i].createContent());
		}
		var headerLabel = "<span style='font-size: 14pt; font-weight: bold;padding-left: 5px;'>业务探测监控系统</span>";
		this.content = new Ext.Panel({
					layout : "card",
					items : items,
					tbar : new Ext.Toolbar({
								height : this.headerHeight,
								items : [headerLabel]
							})
				});
		return this.content;
	},

	render : function() {
		Utils.disableBackspace();
		ScreenLock.lockAjax();
		new Ext.Viewport({
					layout : "fit",
					items : [this.createContent()]
				});
		this.createNavigator();
	},

	createNavigator : function() {
		this.tabPanel = new Ext.TabPanel({
					renderTo : Ext.getBody(),
					plain : true,
					width : 415,
					height : 0,
					x : 100,
					y : 0,
					style : {
						position : "absolute",
						zIndex : 99999
					},
					items : [{
								title : "整体情况"
							}, {
								title : "单个业务"
							}, {
								title : "多维统计分析"
							}, {
								title : "多维Top-N分析"
							}, {
								title : "业务监测"
							}]
				});
		this.tabPanel.on("tabchange", this.onTabChanged, this);
		this.content.on("resize", this.onResize, this);
		this.onResize();
		this.tabPanel.setActiveTab(0);
	},

	onResize : function() {
		var x = Ext.getBody().getWidth() - this.tabPanel.getWidth();
		var y = this.headerHeight - this.tabPanel.getHeight() + 1;
		this.tabPanel.setPosition(x, y);
	},

	onTabChanged : function(tabPanel, panel) {
		var idx = tabPanel.items.indexOf(panel);
		if (idx > -1) {
			if (idx == tabPanel.items.getCount() - 1) {
				location.href = "../businessMonitor/alarmManagement/failureDetect.html";
			} else {
				this.content.getLayout().setActiveItem(idx);
				this.mgrs[idx].activate();
			}
		}
	},

	getXType : function() {
		return P_main.GuiMgr;
	}
})
P_main.GuiMgr.XTYPE = "P_main.GuiMgr";

