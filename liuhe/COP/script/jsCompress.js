﻿///<jscompress sourcefile="customTree.js" />
/**
 *  godz create 20160819
 */
// 自定义树

Ext.onReady(function() {
	//Toopitp
	Ext.tip.QuickTipManager.init();
	//Model
	Ext.define('MyTreeModel', {
		extend: 'Ext.data.Model',
		fields: ['text', 'id', 'leaf', 'caitNo']
	});

	//Store
	Ext.define("MyTreeStore", {
		extend: "Ext.data.TreeStore",
		model: 'MyTreeModel'
	});

	var MyTreeStore = Ext.create("MyTreeStore");

	Ext.define("MyTreePanel", {
		extend: 'Ext.tree.Panel',
		store: MyTreeStore,
		hideHeaders: true,
		rootVisible: true,

		initComponent: function() {
			var me = this;
			//定义列
			me.columns = [{
				xtype: 'treecolumn',
				dataIndex: 'text',
				flex: 1,
			}, {
				xtype: 'actioncolumn',
				width: 24,
				icon: "resources/images/more.png",
				iconCls: "more",
				tooltip: '更多操作',
				handler: function(gridView, rowIndex, colIndex, column, e, record) {
					gridView.getSelectionModel().select(record);
					me.that.menuPanelShow(e, record);
				}
			}];
			me.callParent();
		}
	});
	Ext.define("MyTreePanel2", {
		extend: 'Ext.tree.Panel',
		store: MyTreeStore,
		hideHeaders: true,
		rootVisible: true,

		initComponent: function() {
			var me = this;
			//定义列
			me.columns = [{
				xtype: 'treecolumn',
				dataIndex: 'text',
				flex: 1,
			}, {
				xtype: 'actioncolumn',
				width: 50,
				items: [{
					icon: "resources/images/search.png",
					iconCls: "more",
					tooltip: '查看服务',
					margin: "5 5",
					handler: function(gridView, rowIndex, colIndex, column, e, record) {
						gridView.getSelectionModel().select(record);
						me.that.sceneId = record.data.nodeData["_id"];
						me.that.openCenterPanel(e, record);
						// me.that.menuPanelShow(e, record);
					},
				},{
					icon: "resources/images/edit.png",
					iconCls: "more",
					tooltip: '定制服务',
					getClass: function(v, icon, column) {

						if (me.that.userInfo["_CONTENT"]) {
							var province = me.that.getProvince();
							if (province === "深圳中心") {
								return "moreHide";
							}
						}
						return "more";
					},
					handler: function(gridView, rowIndex, colIndex, column, e, record) {
						gridView.getSelectionModel().select(record);
						me.that.sceneId = record.data.nodeData["_id"];
						me.that.openServiceMade();
						// me.that.menuPanelShow(e, record);
					},
				}, {
					xtype: 'actioncolumn',
					width: 24,
					icon: "resources/images/edit.png",
					iconCls: "more",
					tooltip: '管理服务',
					getClass: function() {

						if (me.that.userInfo["_CONTENT"]) {
							var province = me.that.getProvince();
							if (province !== "深圳中心") {
								return "moreHide";
							}
						}
						return "more";
					},
					handler: function(gridView, rowIndex, colIndex, column, e, record) {
						gridView.getSelectionModel().select(record);
						me.that.sceneId = record.data.nodeData["_id"];
						me.that.openServiceDirectoryManage();
						// me.that.menuPanelShow(e, record);
					},
				}],
				renderer: function(v, record, column) {
					if (!column.data.leaf) {
						record.style = "display: none;";
					}
					return record;
				}
			}];
			me.callParent();
		}
	});
	Ext.define("MyTreePanel3", {
		extend: 'Ext.tree.Panel',
		store: MyTreeStore,
		hideHeaders: true,
		rootVisible: true,

		initComponent: function() {
			var me = this;
			//定义列
			me.columns = [{
				xtype: 'treecolumn',
				dataIndex: 'text',
				flex: 1,
			}, {
				xtype: 'actioncolumn',
				width: 24,
				items: [{
					icon: "resources/images/edit.png",
					iconCls: "more",
					tooltip: '定制服务',
					handler: function(gridView, rowIndex, colIndex, column, e, record) {
						gridView.getSelectionModel().select(record);
						me.that.sceneId = record.data.nodeData["_id"];
						me.that.openCenterPanel(e, record);
						// me.that.menuPanelShow(e, record);
					},
				}],
				renderer: function(v, record, column) {
					if (!column.data.leaf) {
						record.style = "display: none;";
					}
					return record;
				}
			}];
			me.callParent();
		}
	});
});
///<jscompress sourcefile="pageBar.js" />
/**
 *
 *	create godz 
 *	2016 08 26
 *
 *
 * 	自定义Ext  分页控件
 */
Ext.onReady(function() {

	Ext.define("custom.PageBar", {
		extend: "Ext.panel.Panel",
		initComponent: function() {
			var me = this;
			me.currentPage = 1;
			me.total = 0;
			me.count = me.count || 10;
			me.items = me.createPageBar();
			me.callParent();
		},
		createPageBar: function() {
			this.totalLabel = Ext.create("Ext.form.Label", {
				text: "共 " + this.total + " 条",
			});
			this.firstButton = Ext.create("Ext.button.Button", {
				baseCls: "x-btn base-btn",
				text: "<<",
				tooltip: "首页",
				handler: Ext.bind(this.changePageTofirst, this)
			});
			this.upButton = Ext.create("Ext.button.Button", {
				baseCls: "x-btn base-btn",
				text: "<",
				tooltip: "上一页",
				handler: Ext.bind(this.changePageToUp, this)
			});
			var pages = this.getPages();
			this.currentPageLabel = Ext.create("Ext.form.Label", {
				text: " " + this.currentPage,
				tooltip: "当前页",
			});
			this.spritLabel = Ext.create("Ext.form.Label", {
				text: " /   " + pages,
				tooltip: "总页数",
			});

			this.downButton = Ext.create("Ext.button.Button", {
				baseCls: "x-btn base-btn",
				text: ">",
				tooltip: "下一页",
				handler: Ext.bind(this.changePageToDown, this)
			});
			this.lastButton = Ext.create("Ext.button.Button", {
				baseCls: "x-btn base-btn",
				text: ">>",
				tooltip: "尾页",
				handler: Ext.bind(this.changePageToLast, this)
			});
			this.countLabel = Ext.create("Ext.form.Label", {
				text: "每页 " + this.count + " 行"
			});
			var items = [this.totalLabel, this.firstButton, this.upButton, this.currentPageLabel, this.spritLabel, this.downButton, this.lastButton, this.countLabel];
			return items;
		},
		getPages: function() {
			return Math.ceil(this.total / this.count);
		},
		changePageTofirst: function() {
			this.currentPage = 1;
			this.refresh();
		},
		changePageToUp: function() {

			if (this.currentPage > 1) {
				this.currentPage = this.currentPage - 1;
				this.refresh();
			}
		},
		changePageToDown: function() {
			var pages = this.getPages();
			if (this.currentPage < pages) {
				this.currentPage = this.currentPage + 1;
				this.refresh();
			}
		},
		changePageToLast: function() {
			var pages = this.getPages();
			if (this.currentPage != pages) {
				this.currentPage = pages;
				this.refresh();
			}
		},
		refresh: function() {
			this.refreshPanel();
			this.fireEvent("paging", this.currentPage, this.count, this);
		},
		getCount: function() {
			return this.count;
		},
		getTotal: function() {
			return this.total;
		},
		getCurrentPage: function() {
			return this.currentPage;
		},
		getStart: function() {
			return (this.currentPage - 1) * this.count;
		},
		setCount: function(count) {
			count = parseInt(count) || 0;
			this.count = count;
			this.countLabel.setText();
			this.refreshPanel();
		},
		setCurrentPage: function(value){
			this.currentPage = value || 1;
			this.refreshPanel();
		},
		setTotal: function(total) {
			total = parseInt(total) || 0;
			this.total = total;
			this.refreshPanel();
		},
		refreshPanel: function() {
			var pages = this.getPages();
			this.totalLabel.setText("共 " + this.total + " 条");
			this.currentPageLabel.setText(this.currentPage);
			this.spritLabel.setText(" /  " + pages);
		},
	});

});
///<jscompress sourcefile="echartsMap.js" />
// Echart 地图对象
function EchartMap(eleId, praentNode) {
	this.praentNode = praentNode;
	this.eleId = eleId;
	this.initView = function() {
		var that = this;
		this.ele = document.getElementById(this.eleId);
		this.myChart = echarts.init(this.ele);
		this.option = {
			backgroundColor: 'none',
			title: {
				show: false,
			},
			tooltip: {
				trigger: 'item',
				triggerOn: "click",
				position: ["25%", "92%"],
				formatter: function(params) {
					// var province = params.data.name;
					// var value = params.data.value;
					// return "<span style='margin-right: 20px;' >区域： " +
					// 	province + "</span><span>当前定制服务数：" + value + " </span>"
					return null;
				}
			},
			legend: {
				show: false,
			},
			series: [{
				name: '交易量',
				type: 'map',
				map: 'china',
				roam: false,
				selectedMode : 'single',
				label: {
					normal: {
						show: false,
						textStyle: {
							color: "#fff",
						}
					},
					emphasis: {
						show: true,
						textStyle: {
							color: "#fff",
						}
					}
				},
				itemStyle: {
					normal: {
						areaColor: '#323c48',
						borderColor: '#7E808A'
					},
					emphasis: {
						areaColor: '#7FC533'
					}
				},
				data:[]
			}]
		};
		this.myChart.setOption(this.option);
	};
}
///<jscompress sourcefile="echartsPie.js" />
// 饼图
// 
function EchartPie(eleId, praentNode, title) {
	this.praentNode = praentNode;
	this.title = title;
	this.eleId = eleId;
	this.initView = function() {
		var that = this;
		this.ele = document.getElementById(this.eleId);
		this.myChart = echarts.init(this.ele);
		this.option = {
			color: ['#00A8E0', '#AED334', '#FF9000', '#FBED25', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
			backgroundColor: 'none',
			title: {
				show: true,
				text: this.title,
				x: "left",
				y: "top",
				textStyle: {
					color: "#fff",
					fontSize: "14px"
				}
			},
			tooltip: {
				trigger: 'item',
				textStyle: {
					color: "#fff",
					fontSize: "14px"
				},
				position: ["5%", "10%"],
				formatter: " {b} : {c} ({d}%)"
			},
			legend: {
				orient: 'horizontal',
				bottom: "bottom",
				textStyle: {
					color: "#fff"
				},
				itemWidth: 15,
				data: []
					// data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
			},
			series: [{
				name: this.title,
				type: 'pie',
				radius: '70%',
				center: ['50%', '40%'],
				// data: [{
				// 	value: 335,
				// 	name: '直接访问'
				// }, {
				// 	value: 310,
				// 	name: '邮件营销'
				// }, {
				// 	value: 234,
				// 	name: '联盟广告'
				// }, {
				// 	value: 135,
				// 	name: '视频广告'
				// }, {
				// 	value: 1548,
				// 	name: '搜索引擎'
				// }],
				data: [],
				label: {
					normal: {
						show: false,
						position: 'center'
					},
				},
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};
		this.myChart.setOption(this.option);
	};

}
///<jscompress sourcefile="myTask.js" />
/**
 *
 *	 create 2016 08 10 godz
 *	 update 2016 08 29 godz  重写
 *	 我的任务 页面
 * 
 */
function MyTask(parentNode) {
	Page.call(this, Configes.page.myTask);
	this._parentNode = parentNode;
	this.msg = new function() {
		this.labelStyle = "font-size: 14px; color: #fff; line-height: 28px;";
	};

	this.run = function() {
		if (!this.loading) {
			this.initView();
			// this.getSelfInfo();
		}
		this.loading = true;
		this.mainPanelShow();
		this.viewPanel.show();
		this.myOrderDetailsMainPanel.hide();
	};
	this.initView = function() {
		var mainPanel = this.getMainPanel();
		mainPanel.add(this.viewPanel);
		mainPanel.add(this.myOrderDetailsMainPanel);
		var btn = this.statuPanel.getComponent(0);
		btn.addCls("action");
		this.statu = 0;
		this.processor = "";
		this.getOrderList();
	};
	/**
	 *
	 * ctrl 控制模块
	 * 
	 */



	this.getValue = function() {
		var params = {};
		var provincePanel = this.provincePanel.getComponent(0);
		var searchTypePanel = this.searchPanel.getComponent(0);
		var searchPanel = this.searchPanel.getComponent(1);
		var pageBar = this.centerGridPanelPageBar;
		params.statu = this.statu;
		params.processor = provincePanel.getValue();
		params.start = pageBar.getStart();
		params.count = pageBar.getCount();
		params.searchType = searchTypePanel.getValue();
		params.search = searchPanel.getValue();
		return params;
	};

	this.statuChange = function(btn) {
		this.statuPanel.items.each(function(Btn) {
			Btn.removeCls("action");
		}, this);
		btn.addCls("action");
		this.statu = btn.statu;
		this.getOrderList();
	};
	this.searchKeydown = function(text, e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			this.getOrderList();
		}
	};



	this.openMyOrder = function() {
		this.viewPanel.show();
		this.myOrderDetailsMainPanel.hide();
	};
	//  打开订单详情
	this.openOrderDetails = function(e, line, row, btn, e2, record, el) {
		// console.log(arguments);
		this.currentOrder = record;
		var orderId = record.get("_id");
		this.viewPanel.hide();
		this.myOrderDetailsMainPanel.show();
		this.initOrderDetails();

		this.getOrderInfo(orderId,record);
	};
	this.initOrderDetails = function() {
		this.myOrderDetailsPanel.getForm().reset();
		this.myOrderInfoPanel.getComponent(1).removeAll()
	};

	// 订单的基本信息
	this.setMyOrderInfo = function(data) {

		var items = [{
			columnWidth: 1,
			text: "订单编号：" + (data.orderId || "")
		}, {
			columnWidth: 1 / 3,
			text: "订单状态：" + (data.statu || "")
		}, {
			columnWidth: 1 / 3,
			text: "订单来源：" + (data.province || "")
		}, {
			columnWidth: 1 / 3,
			text: "当前处理人：" + (data.processor || "")
		}, {
			columnWidth: 1 / 3,
			text: "订单类型：" + (data.service || "")
		}, {
			columnWidth: 1 / 3,
			text: "订单内容：" + (data.scene || "")
		}, {
			columnWidth: 1 / 3,
			text: "下 单 时 间：" + (data.startTime || "")
		}];
		this.myOrderInfoPanel.getComponent(1).add(items);
		var form = this.myOrderDetailsPanel.getForm();
		form.setValues(data);
		var channel = this.myOrderMonitorPanel.getComponent(1).getComponent(0);
		var probe = this.myOrderMonitorPanel.getComponent(1).getComponent(1);
		channel.setText("渠道：" + (data.channel || ""));
		probe.setText("探测方式：" + (data.probe || ""));
	};
	// 
	this.setMyOrderAlarmConfig = function(data) {
		var tabPanel = this.myOrderAlarmConfigTabPanel;
		tabPanel.removeAll();
		for (var i = 0, l = data["alarmType"].length; i < l; i++) {
			var alarmType = data["alarmType"][i]
			if (alarmType == "成功率") {
				this.createRateAlarmConfigGridPanel();
				tabPanel.add(this.rateAlarmConfigGridPanel);
				this.rateAlarmConfigGridStore.loadData(data["rateAlarmConfig"]);
			} else if (alarmType == "交易量") {
				this.createAmountAlarmConfigGridPanel();
				tabPanel.add(this.amountAlarmConfigGridPanel);
				this.amountAlarmConfigGridStore.loadData(data["amountAlarmConfig"]);
			} else if (alarmType == "响应时长") {
				this.createDurationAlarmConfigGridPanel();
				tabPanel.add(this.durationAlarmConfigGridPanel);
				this.durationAlarmConfigGridStore.loadData(data["durationAlarmConfig"]);
			}
		}
		if (tabPanel.items.length > 0) {
			tabPanel.setActiveTab(tabPanel.getComponent(0))
		}
	};
	// 
	this.setMyOrderRecord = function(data) {

		var panel = this.myOrderRecordPanel.getComponent(1);
		var items = [];
		for (var i = 0, l = data["step"].length; i < l; i++) {
			var step = data["step"][i];
			var stepPanel = {
				items: [{
					text: i + 1 + ". " + step["startTime"],
				}, {
					text: step["processor"] + " " + step["statu"]
				}]
			};
			stepPanel.items.push({
				xtype: "button",
				step: step,
				text: "查看详情",
				textAlign: "right",
				baseCls: "x-btn base-btn",
				// width: 100,
				style: "background:none",
				handler: Ext.bind(this.messageWinShow, this)
			});
			items.push(stepPanel);
		}
		panel.removeAll();
		panel.add(items);
	};
	// 留言盒子
	this.messageWinShow = function(btn) {
		var win = Ext.create("Ext.window.Window", {
			width: 500,
			maxHeight: 500,
			border: 0,
			header: false,
			modal: true,
			shadow: false,
			cls: "orderWin",
			closable: false,
			draggable: true,
			resizable: false,


			items: [{
				xtype: "panel",

				layout: "vbox",
				width: "100%",
				defaults: {
					style: this.msg.labelStyle
				},
				items: [{
					xtype: "label",
					text: "处理时间：" + btn.step["startTime"]
				}, {
					xtype: "label",
					text: "处 理 人  ：" + btn.step["processor"]
				}, {
					xtype: "label",
					text: "订单状态：" + btn.step["statu"]
				}, {
					xtype: "textareafield",
					height: 200,
					cls: "centerFormPanelInput",
					width: "100%",
					value: btn.step.message,
					fieldLabel: "留言",
					editable: false,
					labelWidth: 60,
					labelAlign: "left",
					labelStyle: this.msg.labelStyle,
				}, {
					xtype: "panel",
					border: 0,
					style: "text-align: center;",
					width: "100%",
					items: [{
						width: 100,
						xtype: "button",
						baseCls: "x-btn base-btn",
						text: "关闭",
						handler: function() {
							win.destroy();
						}
					}]
				}]
			}]
		}).show();
	};
	this.setMyOrderEnclosure = function(data) {
		var panel = this.myOrderEnclosurePanel.getComponent(1);
		var items = [];
		for (var i = 0, l = data["enclosure"].length; i < l; i++) {
			var enclosure = data["enclosure"][i];
			var btn = {
				text: enclosure["fileName"],
				data: enclosure
			}
			items.push(btn);
		}
		panel.removeAll();
		panel.add(items);
	};


	// 处理我的任务
	this.myOrderHandle = function() {
		var order = this.currentOrder;
		var statu = order.get("statu");
		var values = {
			statu: statu,
			orderId: order.get("_id")
		}
		if (statu == "待分派") {
			var form = this.assignmentWin.getComponent(0).getForm();
			form.reset();
			form.setValues(values);
			this.getCheckerList();
			this.assignmentWin.show();

		} else {
			if (statu == "待配置环境") {
				this.handlerBtn.getComponent(1).hide();
			} else {
				this.handlerBtn.getComponent(1).show();
			}
			var form = this.handlerWin.getComponent(0).getForm();
			form.reset();
			form.setValues(values);
			this.handlerWin.show();
		}
	};

	this.assignmentWinHide = function() {
		this.assignmentWin.hide();
	};
	this.handlerWinHide = function() {
		this.handlerWin.hide();
	};
	this.assignmentOrder = function() {
		var form = this.assignmentWin.getComponent(0).getForm();
		var values = form.getValues();
		if (!values["checker"]) {
			tools.toast("请指定分派给一个用户");
			return;
		}
		this.getAssignmentOrder(values);
	};
	this.handlerOrder = function() {
		var form = this.handlerWin.getComponent(0).getForm();
		var values = form.getValues();
		values.pass = true;
		this.getHandlerOrder(values);

		// form.setValues({
		// 	pass: true
		// });
		// form.submit({
		// 	url: "../../dataProcess",
		// 	success: Ext.bind(this.setHandlerOrder, this)
		// 	failure: Ext.bind(this.setHandlerOrderFailure, this)
		// });



	};
	this.handlerOrderIsNo = function() {
		var form = this.handlerWin.getComponent(0).getForm();
		var values = form.getValues();
		values.pass = false;
		this.getHandlerOrder(values);

		// form.setValues({
		// 	pass: false
		// });

		// form.submit({
		// 	url: "../../dataProcess",
		// 	success: Ext.bind(this.setHandlerOrder, this)
		// 	failure: Ext.bind(this.setHandlerOrderFailure, this)
		// });



	};


	this.handlerOrderBefor = function(e, line, row, btn, e2, record, el) {
		this.currentOrder = record;
		this.myOrderHandle();
	};



	/**
	 *
	 *	data  数据接入
	 * 
	 */

	// 获取订单列表
	this.getOrderList = function() {
		var params = this.getValue();
		tools.getData(Configes.url.getOrderList, params, this.setOrderList, this);
	};

	this.setOrderList = function(data, that) {
		that.centerGridPanelPageBar.setTotal(data["total"]);
		that.orderStore.loadData(data["list"]);
	};



	this.getOrderInfo = function(orderId, record) {
		var params = {
			orderId: orderId
		}
		var statu = record.get("statu");
		tools.getData(Configes.url.getOrderInfo + statu, params, this.setOrderInfo, this);
	};
	this.setOrderInfo = function(data, that) {
		that.setMyOrderInfo(data);
		that.setMyOrderAlarmConfig(data);
		that.setMyOrderRecord(data);
		that.setMyOrderEnclosure(data);
	};


	this.getCheckerList = function() {
		tools.getData(Configes.url.getCheckerList, null, this.setCheckerList, this);
	}
	this.setCheckerList = function(data, that) {
		that.checkerStore.loadData(data);
	};


	this.getHandlerOrder = function(value) {
		tools.getData(Configes.url.getHandlerOrder, value, this.setHandlerOrder, this);
	};
	this.setHandlerOrder = function(data, that) {
		tools.toast("操作成功");
		that.handlerWinHide();
		that.openMyOrder();
		that.getOrderList();
	};
	// 审批失败
	this.setHandlerOrderFailure = function(form, action) {
		var result = action.result;
		var data = result.CONTENT;
		var STATE = result.STATE;
		var ERR_MSG = result.ERR_MSG;
		if (STATE != 1) {
			main.view.toast(ERR_MSG);
		} else {
			callback(data)
		}
	};
	// 分派
	this.getAssignmentOrder = function(value) {
		tools.getData(Configes.url.getAssignmentOrder, value, this.setAssignmentOrder, this);
	}
	this.setAssignmentOrder = function(data, that) {
		tools.toast("分派成功");
		that.assignmentWinHide();
		that.openMyOrder();
		that.getOrderList();
	};
	/**
	 *
	 *	store
	 *	
	 * 
	 */
	this.orderModel = 　Ext.define("myTask.Order", {
		extend: 'Ext.data.Model',
		fields: ["_id", "service", "scene", "channel", "probe", "statu", "startTime", "province", "processor"]
	});

	this.orderStore = Ext.create("Ext.data.Store", {
		model: "myTask.Order"
	});


	this.searchTypeStore = Ext.create("Ext.data.Store", {
		fields: ["NAME", "VALUE"],
		data: [{
			NAME: "全部",
			VALUE: "all"
		}, {
			NAME: "订单号",
			VALUE: "_id"
		}, {
			NAME: "渠道",
			VALUE: "channel"
		}, {
			NAME: "探测方式",
			VALUE: "probe",
		}, {
			NAME: "当前处理人",
			VALUE: "processor"
		}, {
			NAME: "时间",
			VALUE: "startTime"
		}]
	});

	Ext.define('myOrder.AlarmConfig', {
		extend: 'Ext.data.Model',
		fields: ["NAME", "TYPE", "CONDITION", "THRESHOLD", "SELECE_THRESHOLD", "TIME", "SELECE_TIME", "SELECE_TIME_OTHER", "SELECE"]
	});
	this.rateAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "myOrder.AlarmConfig",
	});
	this.amountAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "myOrder.AlarmConfig",
	});
	this.durationAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "myOrder.AlarmConfig",
	});



	this.checkerStore = Ext.create("Ext.data.Store", {
		fields: ["NAME", "VALUE"]
	});
	/**
	 *
	 *	view 
	 * 
	 */


	this.statuPanel = Ext.create("Ext.panel.Panel", {
		region: "west",
		border: 0,
		height: 30,
		layout: "hbox",
		defaults: {
			// width: 100,
			height: 30,
			margin: "0 5",
			xtype: "button",
			baseCls: "x-btn base-btn",
			cls: "statuBtn",
			handler: Ext.bind(this.statuChange, this)
				// style: "background: none"
		},
		items: [{
			text: "待处理",
			statu: 0,
		}, {
			text: "已处理",
			statu: 1
		}]
	});

	this.provincePanel = Ext.create("Ext.panel.Panel", {
		region: "east",
		border: 0,
		items: [{
			xtype: "combobox",
			cls: "centerFormPanelInput",
			fieldLabel: "选择省份",
			store: Ext.create("Ext.data.Store", {
				fields: ["NAME", "VALUE"],
				data: [{
					NAME: "甘肃省",
					VALUE: "甘肃省"
				}]
			}),
			labelAlign: "right",
			labelStyle: this.msg.labelStyle,
			labelWidth: 80,
			autoSelect: true,
			displayField: "NAME",
			valueField: "VALUE",
			eaditabel: false,
			queryMode: "local",
			value: "甘肃省"
		}]
	});

	this.searchPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		region: "east",
		layout: "hbox",
		items: [{
			xtype: "combobox",
			store: this.searchTypeStore,
			cls: "centerFormPanelInput",
			width: 200,
			fieldLabel: "筛选",
			labelStyle: this.msg.labelStyle,
			labelWidth: 50,
			labelAlign: "right",
			autoSelect: true,
			queryMode: "local",
			displayField: "NAME",
			valueField: "VALUE",
			value: "all",
			listeners: {
				change: Ext.bind(this.getOrderList, this)
			}
		}, {
			margin: "3 0",
			xtype: "textfield",
			cls: "centerFormPanelInput searchInput",
			name: "search",
			listeners: {
				specialKey: Ext.bind(this.searchKeydown, this)
			}
		}, {
			margin: "3 5",
			xtype: "button",
			text: "刷新",
			handler: Ext.bind(this.getOrderList, this)
		}]
	});
	// 上部容器
	this.topPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		width: "100%",
		layout: "border",
		height: 35,
		margin: "5 0",
		items: [this.statuPanel, this.provincePanel, this.searchPanel]
	});


	this.centerGridColumns = {
		defaults: {
			menuDisabled: true,
			draggable: false,
			sortable: false,
			align: "center"
		},
		items: [{
			dataIndex: "_id",
			width: 120,
			text: "订单号",
		}, {
			dataIndex: "service",
			text: "订单类型"
		}, {
			dataIndex: "scene",
			text: "订单内容"
		}, {
			dataIndex: "channel",
			text: "探测渠道"
		}, {
			dataIndex: "probe",
			text: "探测方式"
		}, {
			dataIndex: "statu",
			text: "状态"
		}, {
			dataIndex: "processor",
			text: "当前处理人"
		}, {
			dataIndex: "startTime",
			text: "下单时间",
			width: 120,
		}, {
			dataIndex: "province",
			text: "订单来源"
		}, {
			// dataIndex: "",
			text: "操作",
			xtype: 'actioncolumn',
			width: 100,
			defaults: {
				scope: this
			},
			items: [{
				iconCls: "orderIcon",
				icon: "resources/images/search.png",
				tooltip: '查看',
				handler: Ext.bind(this.openOrderDetails, this)
			}, {
				iconCls: "orderIcon",
				icon: "resources/images/edit.png",
				tooltip: '审批',
				handler: Ext.bind(this.handlerOrderBefor, this),
				scope: this,
				getClass: function(v, metaData, record) {
					if (this.statu === 0) {
						return "orderIcon";
					} else {
						return "orderIconHide";
					}
				}
			}],
		}]
	};
	this.centerGridPanel = Ext.create("Ext.grid.Panel", {
		border: 0,
		cls: "alarmConfigTabGridPanel",
		autoRender: true,
		forceFit: true,
		store: this.orderStore,
		columns: this.centerGridColumns
	});
	//  分页
	this.centerGridPanelPageBar = Ext.create("custom.PageBar", {
		// height: 50,
		width: "100%",
		style: "text-align: center; margin:0 auto;",
		border: 0,
		defaults: {
			style: "background: none; line-height: 30px;color: #fff; border: 0;",
			margin: "0 5",
		},
		count: 30,
		listeners: {
			paging: Ext.bind(this.getOrderList, this)
		}
	});

	// 中心容器
	this.centerPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [this.centerGridPanel, this.centerGridPanelPageBar],

		cls: "centerFormPanel",
	});
	// 主容器
	this.viewPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [this.topPanel, this.centerPanel]
	});



	// 订单信息
	this.myOrderInfoPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			items: [{
				xtype: "label",
				text: "基本信息",
				style: this.msg.labelStyle,
			}]
		}, {
			xtype: "panel",
			border: 0,
			layout: "column",
			cls: "centerFormPanel",
			defaults: {
				style: this.msg.labelStyle,
				xtype: "label",
			},
			items: [{
				columnWidth: 1,
				text: "订单编号：1234567890-12"
			}, {
				columnWidth: 1 / 3,
				text: "订单状态：已完成"
			}, {
				columnWidth: 1 / 3,
				text: "订单来源：甘肃省"
			}, {
				columnWidth: 1 / 3,
				text: "当前处理人：甘肃移动运维组"
			}, {
				columnWidth: 1 / 3,
				text: "订单类型：监控类服务"
			}, {
				columnWidth: 1 / 3,
				text: "订单内容：故障定位监控"
			}, {
				columnWidth: 1 / 3,
				text: "下 单 时 间：2016-08-26 00:00"
			}]
		}]
	});


	//  监控定制详情
	this.myOrderMonitorPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			margin: "5 0",
			items: [{
				xtype: "label",
				text: "监控定制详情",
				style: this.msg.labelStyle,
			}]
		}, {
			xtype: "panel",
			border: 0,
			layout: "column",
			width: "100%",
			cls: "centerFormPanel",
			defaults: {
				margin: "5 0",
				readOnly: true
			},
			items: [{
				columnWidth: 1 / 4,
				xtype: "label",
				style: this.msg.labelStyle,
				text: "渠道：营业厅前台",
				name: "channel",
			}, {
				columnWidth: 1 / 4,
				xtype: "label",
				style: this.msg.labelStyle,
				text: "探测方式： 被动探测",
				name: "probe",
			}, {
				columnWidth: 1,
				xtype: "textareafield",
				cls: "centerFormPanelInput",
				fieldLabel: "业务",
				name: "business",
				labelStyle: this.msg.labelStyle,
				labelWidth: 80,
				height: 80
			}, {
				columnWidth: 1,
				xtype: "textfield",
				cls: "centerFormPanelInput",
				fieldLabel: "指标",
				name: "target",
				labelStyle: this.msg.labelStyle,
				labelWidth: 80
			}, {
				columnWidth: 1,
				xtype: "textfield",
				cls: "centerFormPanelInput",
				fieldLabel: "探测频率",
				name: "probeFrequency",
				labelStyle: this.msg.labelStyle,
				labelWidth: 80
			}]
		}]
	});



	// 告警服务定制
	// 

	// 告警类型
	this.myOrderAlarmTypePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			layout: "hbox",
			items: [{
				xtype: "label",
				style: this.msg.labelStyle,
				text: "告警类型:",
				width: "15%",
			}, {
				width: "85%",
				xtype: "fieldcontainer",
				cls: "serviceDirectoryManageFormCheckbox",
				layout: "hbox",
				defaultType: "checkboxfield",
				defaults: {
					name: "alarmType",
					margin: "5 10",
				},
				items: [{
					boxLabel: "交易量",
					inputValue: "交易量",
					readOnly: true,
					boxLabelCls: "radioLabel"
				}, {
					boxLabel: "成功率",
					inputValue: "成功率",
					readOnly: true,
					boxLabelCls: "radioLabel"
				}, {
					boxLabel: "响应时长",
					inputValue: "响应时长",
					readOnly: true,
					boxLabelCls: "radioLabel"
				}]
			}]
		}]
	});
	//  
	this.columns = {
		defaults: {
			menuDisabled: true,
			draggable: false,
			sortable: false,
		},
		items: [{
			dataIndex: "NAME",
			text: "告警级别",
		}, {
			dataIndex: "TYPE",
			text: "指标",
		}, {
			dataIndex: "CONDITION",
			text: "条件",

		}, {
			dataIndex: "THRESHOLD",
			text: "最低阈值",
			renderer: function(value, column) {
				var type = column.record.get("TYPE");
				var a = "";
				if (type == "成功率") {
					a = "%";
				} else if (type == "响应时长") {
					a = "s";
				}
				value = value || 0;
				value = value + a;
				return value;
			},
		}, {
			dataIndex: "SELECE_THRESHOLD",
			text: "阈值",
			renderer: function(value, column) {
				var type = column.record.get("TYPE");
				var threshold = column.record.get("THRESHOLD");
				var a = "";
				if (type == "成功率") {
					if (value < threshold && value > 100) {
						value = threshol;
					}
					a = "%";
				} else if (type == "响应时长") {
					if (value < threshold) {
						value = threshold;
					}
					a = "s";
				} else if (type == "交易量") {
					if (value < threshold) {
						value = threshold;
					}
				}
				value = value || 0;
				value = value + a;
				return value;
			}
		}, {
			dataIndex: "TIME",
			text: "持续时间",
			width: 300,
			maxWidth: 400,
			renderer: function(value, column) {
				var checkboxs = [];
				var selectValue = column.record.get("SELECE_TIME");
				var type = column.record.get("TYPE");
				for (var i = 0, l = value.length; i < l; i++) {
					var checked = "";
					if (value[i] == "其他") {
						var otherValue = "";
						if (selectValue == "其他") {
							otherValue = column.record.get("SELECE_TIME_OTHER") || "";
						}
						name = "<input type='text' style='width:100px;' placeholder='其他' " +
							" class = 'RATE_TIME_OTHER" +
							column.record.data.ID +
							"' value='" + otherValue + "' >";
					} else {
						name = value[i];
					}
					if (value[i] == selectValue) {
						checked = "checked";
					}
					var checkbox = "<laebl style='margin:0 5px;'>" +
						"<input type='checkbox' class='RATE_TIME" +
						column.record.data.ID + "'" +
						checked +
						"  name='time" + type + column.record.data.ID + "'  value='" +
						value[i] + "' disabled='true'>" + name + " </laebl>"
					checkboxs.push(checkbox);
				}
				var html = "<div class='centerFormPanelInput'>" + checkboxs.join("") + "</div>";
				return html;
			}
		}]
	};
	// 告警配置 各个列表
	this.createRateAlarmConfigGridPanel = function() {
		this.rateAlarmConfigGridPanel && this.rateAlarmConfigGridPanel.remove();
		this.rateAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "成功率告警",
			disable: true,
			cls: "alarmConfigTabGridPanel",
			border: 0,
			autoRender: true,
			autoShow: false,
			store: this.rateAlarmConfigGridStore,
			forceFit: true,
			columns: this.columns
		});
	};
	this.createAmountAlarmConfigGridPanel = function() {
		this.amountAlarmConfigGridPanel && this.amountAlarmConfigGridPanel.remove();
		this.amountAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "交易量告警",
			border: 0,
			cls: "alarmConfigTabGridPanel",
			autoRender: true,
			autoShow: false,
			store: this.amountAlarmConfigGridStore,
			forceFit: true,
			columns: this.columns
				// 结束
		});
	};
	this.createDurationAlarmConfigGridPanel = function() {
		this.durationAlarmConfigGridPanel && this.durationAlarmConfigGridPanel.remove();
		this.durationAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "响应时间告警",
			border: 0,
			cls: "alarmConfigTabGridPanel",
			autoRender: true,
			autoShow: false,
			store: this.durationAlarmConfigGridStore,
			forceFit: true,
			columns: this.columns
		});
	};

	this.myOrderAlarmConfigTabPanel = Ext.create("Ext.tab.Panel", {
		border: 0,
		plain: true,
		title: "告警配置",
		cls: "alarmConfigTabPanel",
	});
	// 告警配置
	// this.myOrderAlarmConfigPanel = Ext.create("Ext.panel.Panel", {
	// 	border: 0,
	// 	items: [{
	// 		xtype: "label",
	// 		style: this.msg.labelStyle,
	// 		text: "告警配置"
	// 	}, this.myOrderAlarmConfigTabPanel]
	// });

	// 告警推送
	this.myOrderAlarmPushPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			layout: "hbox",
			items: [{
				xtype: "label",
				style: this.msg.labelStyle,
				text: "是否支持告警推送:",
				width: "15%",
			}, {
				width: "85%",
				xtype: "fieldcontainer",
				cls: "serviceDirectoryManageFormCheckbox",
				layout: "hbox",
				defaultType: "radiofield",
				defaults: {
					name: "alarmPush",
					margin: "5 10",
					readOnly: true,
					width: 100,
				},
				items: [{
					boxLabel: "是",
					inputValue: true,
					boxLabelCls: "radioLabel"
				}, {
					boxLabel: "否",
					inputValue: false,
					boxLabelCls: "radioLabel"
				}]
			}]
		}]
	});
	// 
	this.myOrderAlarmPushModelPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			layout: "hbox",
			items: [{
				xtype: "label",
				style: this.msg.labelStyle,
				text: "推送方式:",
				width: "15%",
			}, {
				width: "85%",
				xtype: 'fieldcontainer',
				fieldLabel: '',
				defaultType: "checkboxfield",
				defaults: {
					margin: "10 0 10 20",
					width: 50
				},
				width: "100%",
				cls: "serviceDirectoryManageFormCheckbox",
				layout: 'hbox',
				items: [{
					name: "alarmPushMode",
					boxLabel: "短信",
					inputValue: "短信",
					boxLabelCls: "radioLabel",
				}, {
					width: 250,
					xtype: "textfield",
					fieldLabel: "号码",
					name: "alarmPushModeToPhone",
					margin: "10",
					labelWidth: 50,
					cls: "centerFormPanelInput",
					labelStyle: "color: #ddd; font-size: 14px; "
				}, {
					name: "alarmPushMode",
					boxLabel: "邮件",
					inputValue: "短信",
					boxLabelCls: "radioLabel",
				}, {
					width: 250,
					xtype: "textfield",
					fieldLabel: "邮箱",
					margin: "10",
					name: "alarmPushModeToEmail",
					cls: "centerFormPanelInput",
					labelWidth: 50,
					labelStyle: "color: #ddd; font-size: 14px;"
				}]
			}]
		}]
	});
	//
	this.myOrderAlarmPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			margin: "5 0",
			items: [{
				xtype: "label",
				text: "告警服务定制",
				style: this.msg.labelStyle,
			}]
		}, {
			xtype: "panel",
			border: 0,
			defaults: {
				margin: "10 0",
			},
			cls: "centerFormPanel",
			items: [
				this.myOrderAlarmTypePanel,
				this.myOrderAlarmConfigTabPanel,
				this.myOrderAlarmPushPanel,
				this.myOrderAlarmPushModelPanel
			]
		}]
	});



	//  数据服务-------  传输频率
	this.transmissionFrequencyPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "传输频率:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			// fieldLabel: '',
			// labelWidth: 100,
			labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			labelAlign: "right",
			defaultType: "radiofield",
			defaults: {
				name: "transmissionFrequency",
				margin: "10",
				width: 100,
				readOnly: true
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "transmissionFrequencyOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});
	//  数据服务-------  数据文件
	this.dataFilePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "数据文件:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			defaultType: "checkboxfield",
			defaults: {
				name: "dataFile",
				margin: "10",
				width: 100,
				readOnly: true
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				width: 220,
				boxLabel: "PCAP原始数据文件包",
				inputValue: "PCAP原始数据文件包",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "BTR",
				inputValue: "BTR",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "TTR",
				inputValue: "TTR",
				boxLabelCls: "radioLabel",
			}]
		}]
	});
	//  数据服务 ------ 统计指标
	this.statisticalTargetPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "统计指标:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			// labelWidth: 100,
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			// labelAlign: "right",
			defaultType: "checkboxfield",
			defaults: {
				name: "statisticalTarget",
				margin: "10",
				width: 100,
				readOnly: true
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "响应时长",
				inputValue: "响应时长",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "响应率",
				inputValue: "响应率",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "成功率",
				inputValue: "成功率",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "交易量",
				inputValue: "交易量",
				boxLabelCls: "radioLabel",
			}]
		}]
	});
	//  数据服务 ------ 统计粒度
	this.statisticalGranularityPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "统计粒度:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			// labelWidth: 100,
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			// labelAlign: "right",
			defaultType: "radiofield",
			defaults: {
				name: "statisticalGranularity",
				margin: "10",
				width: 100,
				readOnly: true
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "statisticalGranularityOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});
	// 数据服务-------  统计数据  传输频率
	this.statisticalTransmissionFrequencyPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "传输频率:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "radiofield",
			defaults: {
				name: "statisticalTransmissionFrequency",
				margin: "10",
				width: 100,
				readOnly: true
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "statisticalTransmissionFrequencyOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});


	// 
	// 数据服务--------  主体
	this.dataServiceFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		// cls: "centerFormPanel",
		items: [{
				xtype: "checkboxfield",
				name: "probeData",
				boxLabel: "探测明细数据",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}, {
				xtype: "panel",
				border: 0,
				layout: "hbox",
				padding: "10 0",
				cls: "serviceDirectoryManageFormCheckbox",
				items: [{
					xtype: "textfield",
					cls: "centerFormPanelInput",
					fieldLabel: "接口地址",
					labelAlign: "right",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "probeDataHost"
				}, {
					margin: "0 10",
					xtype: "textfield",
					cls: "centerFormPanelInput",
					labelAlign: "right",
					fieldLabel: "端口",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "probeDataPort",
				}]
			}, this.transmissionFrequencyPanel,
			this.dataFilePanel, {
				xtype: "checkboxfield",
				name: "statisticalData",
				boxLabel: "统计数据",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}, {
				xtype: "panel",
				border: 0,
				layout: "hbox",
				padding: "10 0",
				cls: "serviceDirectoryManageFormCheckbox",
				items: [{
					xtype: "textfield",
					cls: "centerFormPanelInput",
					fieldLabel: "接口地址",
					labelAlign: "right",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "statisticalHost",
				}, {
					margin: "0 10",
					xtype: "textfield",
					cls: "centerFormPanelInput",
					labelAlign: "right",
					fieldLabel: "端口",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "statisticalPort",
				}]
			},
			this.statisticalTransmissionFrequencyPanel,
			this.statisticalTargetPanel,
			this.statisticalGranularityPanel,

		]
	});

	//  数据服务定制
	this.myOrderDataPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			margin: "5 0",
			items: [{
				xtype: "label",
				text: "数据服务定制",
				style: this.msg.labelStyle,
			}]
		}, {
			xtype: "panel",
			border: 0,

			cls: "centerFormPanel",
			items: [
				this.dataServiceFormPanel
			]
		}]
	});
	// 订单的内容
	this.myOrderContentPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		margin: "10 0 0 0",
		items: [{
			xtype: "panel",
			border: 0,
			items: [{
				xtype: "label",
				text: "订单内容",
				style: this.msg.labelStyle,
			}]
		}, {
			xtype: "panel",
			border: 0,
			cls: "centerFormPanel",
			items: [
				this.myOrderMonitorPanel,
				this.myOrderAlarmPanel,
				this.myOrderDataPanel
			]
		}]
	});

	// 订单记录
	this.myOrderRecordPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "label",
			style: this.msg.labelStyle,
			text: "订单处理记录"
		}, {
			xtype: "panel",
			cls: "centerFormPanel",
			border: 0,
			defaults: {
				xtype: "panel",
				border: 0,
				style: "border-bottom: 1px #aaa solid;",
				layout: "vbox",
				defaults: {
					width: "100%",
					xtype: "label",
					style: this.msg.labelStyle
				}
			},
		}]
	});
	//  附件 panel
	this.myOrderEnclosurePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		margin: "10 0",
		items: [{
			xtype: "label",
			text: "附件",
			style: this.msg.labelStyle
		}, {
			xtype: "panel",
			border: 0,
			cls: "centerFormPanel",
			defaults: {
				width: "100%",
				baseCls: "base-btn x-btn",
				style: "background: none; border: 0;",
				textAlign: "left",
				xtype: "button"
			},
			items: []
		}]
	});

	// 处理订单

	this.myOrderHandlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		margin: "10 5",
		style: "text-align: right;",
		items: [{
			xtype: "button",
			text: "处理订单",
			baseCls: "x-btn base-btn",
			cls: "btn-save",
			width: 100,
			handler: Ext.bind(this.myOrderHandle, this)
		}]
	});



	this.myOrderDetailsLeftPanel = Ext.create("Ext.panel.Panel", {
		columnWidth: 3 / 4,
		margin: "0 10",
		border: 0,
		items: [this.myOrderInfoPanel,
			this.myOrderHandlePanel,
			this.myOrderContentPanel
		]
	});
	this.myOrderDetailsRigthPanel = Ext.create("Ext.panel.Panel", {
		columnWidth: 1 / 4,
		margin: "0 10",
		border: 0,
		items: [this.myOrderRecordPanel, this.myOrderEnclosurePanel],
	});


	// 我的任务详情 标题
	this.myOrderDetailsTitlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		margin: "5 0",
		items: [{
			xtype: "button",
			baseCls: "x-btn base-btn ",
			style: "background: none",
			text: "我的任务",
			handler: Ext.bind(this.openMyOrder, this)
		}, {
			xtype: "label",
			text: ">>",
			margin: "0 5",
			style: this.msg.labelStyle,
		}, {
			xtype: "label",
			text: "订单详情",
			margin: "0 5",
			style: this.msg.labelStyle,
		}]
	});
	// 我的订单详情 主panel
	this.myOrderDetailsPanel = Ext.create("Ext.form.Panel", {
		border: 0,
		layout: "column",
		cls: "serviceDirectoryMainPanel",
		items: [this.myOrderDetailsLeftPanel, this.myOrderDetailsRigthPanel]
	});
	// 
	this.myOrderDetailsMainPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [this.myOrderDetailsTitlePanel, this.myOrderDetailsPanel]
	});


	// 分派窗口
	this.assignmentWin = Ext.create("Ext.window.Window", {
		width: 500,
		border: 0,
		modal: true,
		header: false,
		shadow: false,
		cls: "orderWin",
		closable: false,
		draggable: true,
		resizable: false, //是否可以调整大小
		items: [{
			xtype: "form",
			layout: "vbox",
			// cls: "centerFormPanel",
			margin: 5,
			defaults: {
				labelWidth: 80,
				labelStyle: this.msg.labelStyle,
				width: "100%",
			},
			items: [{
				xtype: "textfield",
				cls: "centerFormPanelInput",
				fieldLabel: "订单编号",
				name: "orderId",
				labelStyle: this.msg.labelStyle,
				readOnly: true,
			}, {
				xtype: "textfield",
				cls: "centerFormPanelInput",
				fieldLabel: "流程",
				name: "statu",
				readOnly: true,
				labelStyle: this.msg.labelStyle
			}, {
				xtype: "combobox",
				cls: "centerFormPanelInput",
				fieldLabel: "分派给",
				queryMode: 'local',
				store: this.checkerStore,
				labelStyle: this.msg.labelStyle,
				autoSelect: true,
				displayField: "NAME",
				valueField: "VALUE",
				eaditabel: false,
				name: "checker",
			}, {
				xtype: "textareafield",
				cls: "centerFormPanelInput",
				fieldLabel: "注释",
				height: 100,
				name: "message"
			}, {
				xtype: "panel",
				style: "text-align: center;",
				defaults: {
					xtype: "button",
					width: 100,
					baseCls: "x-btn base-btn",
					margin: 10,
				},
				items: [{
					text: "确定",
					cls: "btn-submit",
					handler: Ext.bind(this.assignmentOrder, this)
				}, {
					text: "取消",
					cls: "btn-remove",
					handler: Ext.bind(this.assignmentWinHide, this)
				}]
			}]
		}]
	});

	this.handlerBtn = Ext.create("Ext.panel.Panel", {
		style: "text-align: center;",
		defaults: {
			xtype: "button",
			width: 100,
			baseCls: "x-btn base-btn",
			margin: 10,
		},
		items: [{
			text: "通过",
			cls: "btn-submit",
			handler: Ext.bind(this.handlerOrder, this)
		}, {
			text: "不通过",
			cls: "btn-remove",
			handler: Ext.bind(this.handlerOrderIsNo, this)
		}, {
			text: "取消",
			cls: "btn-hide",
			handler: Ext.bind(this.handlerWinHide, this)
		}]
	});
	// 处理窗口
	this.handlerWin = Ext.create("Ext.window.Window", {
		width: 500,
		border: 0,
		header: false,
		modal: true,
		shadow: false,
		cls: "orderWin",
		closable: false,
		draggable: true,
		resizable: false, //是否可以调整大小
		items: [{
			xtype: "form",
			// cls: "centerFormPanel",
			margin: 5,
			layout: "vbox",
			defaults: {
				labelWidth: 80,
				labelStyle: this.msg.labelStyle,
				width: "100%",
			},
			items: [{
				xtype: "textfield",
				cls: "centerFormPanelInput",
				fieldLabel: "订单编号",
				name: "orderId",
				labelStyle: this.msg.labelStyle
			}, {
				xtype: "textfield",
				cls: "centerFormPanelInput",
				fieldLabel: "流程",
				name: "statu",
				labelStyle: this.msg.labelStyle
			}, {
				xtype: "textareafield",
				cls: "centerFormPanelInput",
				fieldLabel: "注释",
				name: "message",
				height: 100,
			}, {
				xtype: "filefield",
				buttonText: '选择文件',
				cls: "centerFormPanelInput",
				fieldLabel: "上传文件",
				name: "enclosure",
			}, this.handlerBtn]
		}]
	});



}
///<jscompress sourcefile="myOrder.js" />
/**
 *
 *	creator godz
 *	2016 8 25
 *	我的订单
 *	
 *
 * 
 */

function MyOrder(parentNode) {
	Page.call(this, Configes.page.myOrder);
	this._parentNode = parentNode;
	// 基础配置
	this.msg = new function() {
		this.treeTitle = "服务目录";
		this.type = new function() {
			this.server = "server";
			this.scene = "scene";
		};
		this.editTypeToAdd = "editTypeToAdd";
		this.editTypeToUpdate = "editTypeToUpdate";
		this.labelStyle = "font-size: 14px; color: #fff; line-height: 30px;"
	};
	this.statu = 0;
	// 初始化页面
	this.run = function(params) {
		if (params && params.record) {
			this.orderRecord = params.record
		} else if (params) {
			this.jumpSceneId = params.jumpSceneId;
			this.jumpStatuId = params.jumpStatuId
		}
		if (!this.loading) {
			this.initView();
			this.getSelfInfo();
		}
		this.loading = true;
		this.mainPanelShow();
		this.viewPanel.show();
		this.myOrderDetailsMainPanel.hide();

		if (this.jumpSceneId) {
			var isOpen = this.selectSceneNode(this.jumpSceneId);
			isOpen && (this.jumpSceneId = null);
		}

		this.orderRecord && this.openOrderDetails(this, null, null, null, null, this.orderRecord);
	};
	this.initView = function() {
		var panel = this.getMainPanel();
		panel.add(this.viewPanel);
		panel.add(this.myOrderDetailsMainPanel);
		
	};

	/**
	 *
	 *	ctrl
	 * 
	 */



	// 状态变化
	this.statuChange = function(btn) {
		if (btn.hasCls("action")) {
			return;
		}
		this.statuPanel.items.each(function(children) {
			children.removeCls("action");
		}, this);
		this.statu = btn.statu;
		btn.addCls("action");
		if (btn.statu == 0) {
			this.centerPanel.remove(this.centerOtherGridMainPanel, false);
			this.centerPanel.add(this.centerServiceingGridMainPanel);

			this.initServiceingGrid();
			this.serviceChange();
		} else {
			this.centerPanel.remove(this.centerServiceingGridMainPanel, false);
			this.centerPanel.add(this.centerOtherGridMainPanel);
			this.initOtherOrderGrid();
			this.otherChange();
		}
	};

	// 初始化服务中的订单列表
	this.initServiceingGrid = function() {
		var pageBar = this.centerServiceingGridPanelPageBar;
		pageBar.setCurrentPage(1);
		pageBar.setTotal(0);
		this.orderStore.loadData([]);
	};
	// 初始化其他列表
	this.initOtherOrderGrid = function() {
		var pageBar = this.centerOtherGridPanelPageBar;
		pageBar.setCurrentPage(1);
		pageBar.setTotal(0);
		this.orderOtherStore.loadData([]);
	};
	// 选择某个节点时
	this.selectNode = function(tree, node) {
		if (this.statu == 0) {
			this.serviceChange();
		} else {
			this.otherChange();
		}
	};
	// 获取所有条件值
	this.getValues = function() {
		var params = {};
		var pageBar = this.centerServiceingGridPanelPageBar;
		params.start = pageBar.getStart();
		params.count = pageBar.getCount();
		params.province = this.provincePanel.getComponent(0).getValue();
		params.statu = this.statu;
		var selects = this.treePanel.getSelectionModel().getSelection();
		params.orderType = "all";
		var _id;
		if (selects.length > 0) {
			var node = selects[0];
			if (node.isRoot()) {
				params.orderType = "all";
			} else if (!node.isLeaf()) {
				params.orderType = "service";
				params._id = node.data.nodeData._id;
			} else if (node.isLeaf()) {
				params.orderType = "scene";
				params._id = node.data.nodeData._id;
			}
		};
		var searchTypeInput = this.centerServiceingSearchType;
		var searchInput = this.centerServiceingSearch;
		var searchType = searchTypeInput.getValue();
		var searchValue = searchInput.getValue();
		if (searchValue) {
			params.searchValue = searchValue;
			params.searchType = searchType;
		}
		console.log(params);
		return params;
	};
	// 服务中的订单的查询值的变更
	this.serviceChange = function() {
		var params = this.getValues();
		this.getServiceingOrderList(params);
	};
	// 其他状态订单的查询值的变更
	this.otherChange = function() {
		var params = this.getValues();
		this.getOtherOrderList(params);
	};
	//  查询其他状态的订单
	this.searchOtherOrder = function(e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			this.otherChange();
		}
	};
	//  查询服务中的订单
	this.searchSeviceingOrder = function(text, e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			this.serviceChange();
		}
	};
	this.openMyOrder = function() {
		this.viewPanel.show();
		this.myOrderDetailsMainPanel.hide();
	};
	//  打开订单详情
	this.openOrderDetails = function(e, line, row, btn, e2, record, el) {
		// console.log(arguments);
		var orderId = record.get("_id");
		this.viewPanel.hide();
		this.myOrderDetailsMainPanel.show();
		this.initOrderDetails();

		this.getOrderInfo(orderId, record);
	};
	this.initOrderDetails = function() {
		this.myOrderDetailsPanel.getForm().reset();
		this.myOrderInfoPanel.getComponent(1).removeAll()
	};

	// 订单的基本信息
	this.setMyOrderInfo = function(data) {

		var items = [{
			columnWidth: 1,
			text: "订单编号：" + (data.orderId || "")
		}, {
			columnWidth: 1 / 3,
			text: "订单状态：" + (data.statu || "")
		}, {
			columnWidth: 1 / 3,
			text: "订单来源：" + (data.province || "")
		}, {
			columnWidth: 1 / 3,
			text: "当前处理人：" + (data.processor || "")
		}, {
			columnWidth: 1 / 3,
			text: "订单类型：" + (data.service || "")
		}, {
			columnWidth: 1 / 3,
			text: "订单内容：" + (data.scene || "")
		}, {
			columnWidth: 1 / 3,
			text: "下 单 时 间：" + (data.startTime || "")
		}];
		this.myOrderInfoPanel.getComponent(1).add(items);
		var form = this.myOrderDetailsPanel.getForm();
		form.setValues(data);
		var channel = this.myOrderMonitorPanel.getComponent(1).getComponent(0);
		var probe = this.myOrderMonitorPanel.getComponent(1).getComponent(1);
		channel.setText("渠道：" + (data.channel || ""));
		probe.setText("探测方式：" + (data.probe || ""));
	};
	// 
	this.setMyOrderAlarmConfig = function(data) {
		var tabPanel = this.myOrderAlarmConfigTabPanel;
		tabPanel.removeAll();
		for (var i = 0, l = data["alarmType"].length; i < l; i++) {
			var alarmType = data["alarmType"][i]
			if (alarmType == "成功率") {
				this.createRateAlarmConfigGridPanel();
				tabPanel.add(this.rateAlarmConfigGridPanel);
				this.rateAlarmConfigGridStore.loadData(data["rateAlarmConfig"]);
			} else if (alarmType == "交易量") {
				this.createAmountAlarmConfigGridPanel();
				tabPanel.add(this.amountAlarmConfigGridPanel);
				this.amountAlarmConfigGridStore.loadData(data["amountAlarmConfig"]);
			} else if (alarmType == "响应时长") {
				this.createDurationAlarmConfigGridPanel();
				tabPanel.add(this.durationAlarmConfigGridPanel);
				this.durationAlarmConfigGridStore.loadData(data["durationAlarmConfig"]);
			}
		}
		if (tabPanel.items.length > 0) {
			tabPanel.setActiveTab(tabPanel.getComponent(0))
		}
	};
	// 
	this.setMyOrderRecord = function(data) {

		var panel = this.myOrderRecordPanel.getComponent(1);
		var items = [];
		for (var i = 0, l = data["step"].length; i < l; i++) {
			var step = data["step"][i];
			var stepPanel = {
				items: [{
					text: i + 1 + ". " + step["startTime"],
				}, {
					text: step["processor"] + " " + step["statu"]
				}]
			};
			stepPanel.items.push({
				xtype: "button",
				step: step,
				text: "查看详情",
				textAlign: "right",
				baseCls: "x-btn base-btn",
				// width: 100,
				style: "background:none",
				handler: Ext.bind(this.messageWinShow, this)
			});
			items.push(stepPanel);
		}
		panel.removeAll();
		panel.add(items);
	};
	// 留言盒子
	this.messageWinShow = function(btn) {
		var win = Ext.create("Ext.window.Window", {
			width: 500,
			maxHeight: 500,
			border: 0,
			header: false,
			modal: true,
			shadow: false,
			cls: "orderWin",
			closable: false,
			draggable: true,
			resizable: false,


			items: [{
				xtype: "panel",

				layout: "vbox",
				width: "100%",
				defaults: {
					style: this.msg.labelStyle
				},
				items: [{
					xtype: "label",
					text: "处理时间：" + btn.step["startTime"]
				}, {
					xtype: "label",
					text: "处 理 人  ：" + btn.step["processor"]
				}, {
					xtype: "label",
					text: "订单状态：" + btn.step["statu"]
				}, {
					xtype: "textareafield",
					height: 200,
					cls: "centerFormPanelInput",
					width: "100%",
					editable: false,
					value: btn.step.message,
					fieldLabel: "留言",
					labelWidth: 60,
					labelAlign: "left",
					labelStyle: this.msg.labelStyle,
				}, {
					xtype: "panel",
					border: 0,
					style: "text-align: center;",
					width: "100%",
					items: [{
						width: 100,
						xtype: "button",
						baseCls: "x-btn base-btn",
						text: "关闭",
						handler: function() {
							win.destroy();
						}
					}]
				}]
			}]
		}).show();
	};
	this.setMyOrderEnclosure = function(data) {
		var panel = this.myOrderEnclosurePanel.getComponent(1);
		var items = [];
		for (var i = 0, l = data["enclosure"].length; i < l; i++) {
			var enclosure = data["enclosure"][i];
			var btn = {
				text: enclosure["fileName"],
				data: enclosure
			}
			items.push(btn);
		}
		panel.removeAll();
		panel.add(items);
	};
	/**
	 *
	 *	 model 
	 *
	 * 
	 */
	this.getOrderInfo = function(orderId, record) {
		var params = {
			orderId: orderId
		}
		var statu = record.get("statu");
		tools.getData(Configes.url.getOrderInfo + statu, params, this.setOrderInfo, this);
	};
	this.setOrderInfo = function(data, that) {
		that.setMyOrderInfo(data);
		that.setMyOrderAlarmConfig(data);
		that.setMyOrderRecord(data);
		that.setMyOrderEnclosure(data);
	};
	this.getSelfInfo = function() {
		tools.getData(Configes.url.view_getSelfInfo, null, this.setSelfInfo, this);
	};
	this.setSelfInfo = function(data, that) {
		that.userInfo = data;
		that.getServerList();
	};
	this.getServerList = function() {
		tools.getData(Configes.url.getServerList, null, this.setServerList, this);
	};
	this.setServerList = function(data, that) {
		var treeData = [];
		var root = that.treeRoot.getRoot();
		for (var i = 0, l = data.length; i < l; i++) {
			var treeNode = {
				expanded: true,
				text: data[i]["name"],
				iconCls: "i",
				leaf: false,
				isLoad: false,
				nodeData: data[i],
				type: that.msg.type.server,
				cls: "serviceDirectoryTreeType",
				children: []
			}
			treeData.push(treeNode);
			var node = root.appendChild(treeNode);
			that.getSceneList(node);
		}
		that.serviceChange();
	};
	this.getSceneList = function(node) {
		var callbackParams = {
			that: this,
			node: node
		}
		var params = {
			serviceId: node.data.nodeData._id
		}
		tools.getData(Configes.url.getSceneList + node.data.nodeData._id, params, this.setSceneList, callbackParams);
	};
	this.setSceneList = function(data, params) {
		var treeData = [];
		var that = params.that;
		var node = params.node;
		for (var i = 0, l = data.length; i < l; i++) {
			var treeNode = {
				text: data[i]["name"],
				iconCls: "i",
				leaf: true,
				type: that.msg.type.scene,
				cls: "serviceDirectoryTreeScene",
				nodeData: data[i]
			}
			treeData.push(treeNode);
		};
		node.removeAll();
		node.appendChild(treeData);
		node.data.isLoad = true;

		if (this.jumpSceneId) {
			var isOpen = this.selectSceneNode(this.jumpSceneId);
			isOpen && (this.jumpSceneId = null);
		}
	};
	this.selectSceneNode = function(senceId) {
		var btn;
		var statu = this.jumpStatuId;
		this.statuPanel.items.each(function(Btn) {
			if (Btn.statu == statu) {
				btn = Btn;
			}
		});
		this.statuChange(btn);
		var root = this.treeRoot.getRoot();
		var sceneNode;
		root.eachChild(function(node) {
			node.eachChild(function(childNode) {
				if (childNode.data.nodeData["_id"] == senceId) {
					this.treePanel.getSelectionModel().select(childNode);
					sceneNode = childNode;
				}
			}, this);
		}, this);
		sceneNode && statu && this.otherChange(sceneNode);
		sceneNode && !statu && this.serviceChange(sceneNode);
		return sceneNode;
	};


	this.getServiceingOrderList = function(params) {
		tools.getData(Configes.url.getOrderListToService, params, this.setServiceingOrderList, this);
	};
	this.setServiceingOrderList = function(data, that) {
		var list = data["list"];
		var total = data["total"];
		that.centerServiceingGridPanelPageBar.setTotal(total);
		that.orderStore.loadData(list);
	};
	this.getOrderListToHistory = function(record, store) {
		var orderId = record.get("_id");
		var params = {
			orderId: orderId
		};
		tools.getData(Configes.url.getOrderListToHistory, params, this.setOrderListToHistory, {
			that: this,
			store: store
		});
	};
	this.setOrderListToHistory = function(data, callbackParams) {
		var store = callbackParams.store;
		store.loadData(data);
	};
	this.getOtherOrderList = function(params) {
		tools.getData(Configes.url.getOrderListTo + params.statu, params, this.setOtherOrderList, this);
	};
	this.setOtherOrderList = function(data, that) {
		if (!data) {
			return;
		}
		var list = data["list"];
		var total = data["total"];
		that.centerOtherGridPanelPageBar.setTotal(total);
		that.orderOtherStore.loadData(list);
	};
	/**
	 *
	 *   store =========================================
	 *
	 *
	 * 
	 */
	Ext.define('Order', {
		extend: 'Ext.data.Model',
		fields: ["_id", "service", "scene", "channel", "probe", "statu", "startTime", "province", "processor"]
	});
	this.treeRoot = Ext.create("Ext.data.TreeStore", {
		root: {
			expanded: true,
			text: "所有订单",
			icon: "",
			cls: "serviceDirectoryTreeRoot serviceDirectoryTreeType"
		}
	});

	this.orderStore = Ext.create("Ext.data.Store", {
		model: "Order",
		// data: [
		// 	[1, 2, 3, 4, 5, 6, 7, 8, 9],
		// 	[2, 2, 3, 4, 5, 6, 7, 8, 9],
		// 	[3, 2, 3, 4, 5, 6, 7, 8, 9]
		// ]
	});
	this.orderOtherStore = Ext.create("Ext.data.Store", {
		model: "Order",
		// data: [
		// 	[1, 2, 3, 4, 5, 6, 7, 8, 9],
		// 	[2, 2, 3, 4, 5, 6, 7, 8, 9]
		// ]
	});



	this.searchTypeStore = Ext.create("Ext.data.Store", {
		fields: ["NAME", "VALUE"],
		data: [{
			NAME: "全部",
			VALUE: "all"
		}, {
			NAME: "订单号",
			VALUE: "_id"
		}, {
			NAME: "渠道",
			VLAUE: "channel"
		}, {
			NAME: "探测方式",
			VALUE: "probe",
		}, {
			NAME: "当前处理人",
			VALUE: "processor"
		}, {
			NAME: "下单时间",
			VALUE: "startTime"
		}]
	});
	// 取消 按钮的显示
	this.orderIconShow = function() {
		if (this.userInfo["_CONTENT"]) {
			var province = this.getProvince();
			if (province == "深圳中心") {
				return "orderIconHide";
			}
		}
		if (this.statu == 1) {
			return "orderIcon";
		} else {
			return "orderIconHide";
		}
	};
	//  变更 按钮的显示
	this.orderIconShowToChange = function() {
		if (this.userInfo["_CONTENT"]) {
			var province = this.getProvince();
			if (province == "深圳中心") {
				return "orderIconHide";
			}
		}
		if (this.statu == 0) {
			return "orderIcon";
		} else {
			return "orderIconHide";
		}
	};
	this.getProvince = function() {
		var contentStr = this.userInfo["_CONTENT"];
		var content = JSON.parse(contentStr);
		var province = content["PROVINCE"];
		return province
	};
	this.cancelOrder = function(btn) {
		var form = this.cancelOrderWin.getComponent(0).getForm();
		var values = form.getValues();
		tools.getData(Configes.url.cancelOrder, values, this.cancelOrderReturn.bind(this), this.cancelOrderWin)
	};
	this.cancelOrderReturn = function(data, win) {
		console.log(this);
		tools.toast("已取消订单");
		win.destroy();
		this.otherChange();
	};
	// 打开 取消窗口 
	this.cancelOrderWinShow = function(gridView, rowIndex, colIndex, column, e, record) {
		var that = this;
		this.cancelOrderWin = Ext.create("Ext.window.Window", {
			width: 500,
			border: 0,
			header: false,
			modal: true,
			shadow: false,
			cls: "orderWin",
			closable: false,
			draggable: true,
			resizable: false,
			items: [{
				xtype: "form",
				margin: 5,
				layout: "vbox",
				defaults: {
					labelWidth: 80,
					labelStyle: this.msg.labelStyle,
					width: "100%",
				},
				items: [{
					xtype: "textfield",
					cls: "centerFormPanelInput",
					fieldLabel: "订单编号",
					value: record.get("_id"),
					editable: false,
					name: "orderId",
					labelStyle: this.msg.labelStyle
				}, {
					xtype: "textfield",
					cls: "centerFormPanelInput",
					editable: false,
					fieldLabel: "流程:",
					value: record.get("statu"),
					name: "statu",
					labelStyle: this.msg.labelStyle
				}, {
					xtype: "textareafield",
					cls: "centerFormPanelInput",
					fieldLabel: "注释",
					name: "notes",
					height: 100,
				}, {
					xtype: "panel",
					style: "text-align: center;",
					defaults: {
						width: 100,
						margin: "0 5",
						xtype: "button",
						baseCls: "x-btn base-btn"
					},
					items: [{
						cls: "btn-save",
						text: "确定取消",
						handler: Ext.bind(this.cancelOrder, this)
					}, {
						cls: "btn-hide",
						text: "关闭窗口",
						handler: function() {
							that.cancelOrderWin.destroy();
						}
					}]
				}]
			}]
		}).show();
	};
	// 
	this.centerGridColumns = {
		defaults: {
			menuDisabled: true,
			draggable: false,
			sortable: false,
			align: "center"
		},
		items: [{
			dataIndex: "_id",
			width: 120,
			text: "订单号",
		}, {
			dataIndex: "service",
			text: "订单类型"
		}, {
			dataIndex: "scene",
			text: "订单内容"
		}, {
			dataIndex: "channel",
			text: "探测渠道"
		}, {
			dataIndex: "probe",
			text: "探测方式"
		}, {
			dataIndex: "statu",
			text: "状态"
		}, {
			dataIndex: "processor",
			text: "当前处理人"
		}, {
			dataIndex: "startTime",
			text: "下单时间",
			width: 120,
		}, {
			dataIndex: "province",
			text: "订单来源"
		}, {
			// dataIndex: "",
			text: "操作",
			xtype: 'actioncolumn',
			width: 100,
			items: [{
				iconCls: "orderIcon",
				icon: "resources/images/search.png",
				tooltip: '查看',
				handler: Ext.bind(this.openOrderDetails, this)
			}, {
				iconCls: "orderIcon",
				icon: "resources/images/change.png",
				getClass: Ext.bind(this.orderIconShowToChange, this),
				tooltip: '变更',
			}, {
				iconCls: "orderIcon",
				icon: "resources/images/cancel.png",
				tooltip: '取消',
				getClass: Ext.bind(this.orderIconShow, this),
				handler: Ext.bind(this.cancelOrderWinShow, this)
			}]
		}]
	};
	this.centerGridColumns2 = {
		defaults: {
			menuDisabled: true,
			draggable: false,
			sortable: false,
			align: "center"
		},
		items: [{
			dataIndex: "_id",
			width: 120,
			text: "订单号",
		}, {
			dataIndex: "service",
			text: "订单类型"
		}, {
			dataIndex: "scene",
			text: "订单内容"
		}, {
			dataIndex: "channel",
			text: "探测渠道"
		}, {
			dataIndex: "probe",
			text: "探测方式"
		}, {
			dataIndex: "statu",
			text: "状态"
		}, {
			dataIndex: "processor",
			text: "当前处理人"
		}, {
			dataIndex: "startTime",
			text: "下单时间",
			width: 120,
		}, {
			dataIndex: "province",
			text: "订单来源"
		}, {
			// dataIndex: "",
			text: "操作",
			xtype: 'actioncolumn',
			width: 100,
			items: [{
				iconCls: "orderIcon",
				icon: "resources/images/search.png",
				tooltip: '查看',
				handler: Ext.bind(this.openOrderDetails, this)
			}]
		}]
	};

	Ext.define("MyOrder.MoreGrid", {
		extend: 'Ext.grid.Panel',
		alias: 'widget.MainGrid',
		store: this.orderStore,
		columns: tools.deepClone(this.centerGridColumns),
		selModel: {
			selType: 'cellmodel'
		},
		plugins: [{
			ptype: 'rowexpander',
			rowBodyTpl: [
				'<div id="MoreGridRow{id}">',
				'</div>'
			]
		}],
		animCollapse: false,
		initComponent: function() {
			var me = this;
			this.callParent(arguments);
		}
	});


	Ext.define('myOrder.AlarmConfig', {
		extend: 'Ext.data.Model',
		fields: ["NAME", "TYPE", "CONDITION", "THRESHOLD", "SELECE_THRESHOLD", "TIME", "SELECE_TIME", "SELECE_TIME_OTHER", "SELECE"]
	});
	this.rateAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "myOrder.AlarmConfig",
	});
	this.amountAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "myOrder.AlarmConfig",
	});
	this.durationAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "myOrder.AlarmConfig",
	});
	/**
	 *
	 *  view 视图模块 ==========================================
	 * 
	 * 
	 */



	// 上部条件栏

	this.statuPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		region: "west",
		defaults: {
			xtype: "button",
			// width: 100,
			margin: "10 5",
			baseCls: "x-btn base-btn",
			cls: "statuBtn",
			handler: Ext.bind(this.statuChange, this)
		},
		items: [{
			text: "当前服务订单",
			cls: "statuBtn action",
			statu: 0,
		}, {
			text: "待审批订单",
			statu: 1,
		}, {
			text: "审批未通过",
			statu: 2,
		}, {
			text: "待配置环境",
			statu: 3,
		}, {
			text: "待验证配置",
			statu: 4,
		}, {
			text: "待部署",
			statu: 5,
		}]
	});


	this.provincePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		region: "east",
		items: [{
			margin: "5",
			xtype: "combobox",
			name: "province",
			store: Ext.create("Ext.data.Store", {
				fields: ["NAME", "VALUE"],
				data: [{
					NAME: "甘肃省",
					VALUE: "甘肃省"
				}]
			}),
			fieldLabel: "选择省份",
			labelWidth: 80,
			labelStyle: this.msg.labelStyle,
			editable: false,
			queryMode: 'local',
			displayField: 'NAME',
			valueField: "VALUE",
			autoSelect: true,
			value: "甘肃省",
			cls: "centerFormPanelInput"
		}]
	});

	this.topPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "border",
		height: 50,
		width: "100%",
		items: [
			this.statuPanel,
			this.provincePanel
		]
	});
	//  上部条件栏 end


	//  主体  树
	this.treeTitlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 50,
		items: [{
			xtype: "button",
			baseCls: "x-btn base-btn",
			cls: "allOrderBtn",
			text: "所有订单",
			height: 50,
			style: "font-size: 18px; color: #fff;background: none;",
			// handler: 
		}]
	});

	this.treePanel = Ext.create("Ext.tree.Panel", {
		store: this.treeRoot,
		// rootVisible: false,
		border: 0,
		cls: "serviceDirectoryTreePanel",
		listeners: {
			select: Ext.bind(this.selectNode, this)
		}
	});
	this.mainTreePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 1 / 5,
		items: [
			// this.treeTitlePanel,
			this.treePanel
		]
	});

	//  主体 树  end
	//  主体 列表
	//  
	//  
	//  服务中的订单列表
	//  
	//  
	//  
	this.centerServiceingSearchType = Ext.create("Ext.form.ComboBox", {
		width: 120,
		store: this.searchTypeStore,
		editable: false,
		queryMode: 'local',
		displayField: 'NAME',
		valueField: "VALUE",
		autoSelect: true,
		value: "all",
		cls: "centerFormPanelInput"
	});
	this.centerServiceingSearch = Ext.create("Ext.form.Text", {
		cls: "centerFormPanelInput searchInput",
		listeners: {
			specialKey: Ext.bind(this.searchSeviceingOrder, this)
		}
	});
	// 列表上
	this.centerServiceingTopPael = Ext.create("Ext.panel.Panel", {
		border: 0,
		width: "100%",
		layout: "border",
		height: 35,
		defaults: {
			region: "east",
		},
		items: [{
			xtype: "panel",
			items: [this.centerServiceingSearchType]
		}, {
			xtype: "panel",
			items: [this.centerServiceingSearch]
		}, {
			xtype: "panel",
			margin: "0 15",
			items: [{
				xtype: "button",
				text: "刷新",
				handler: Ext.bind(this.serviceChange, this)
			}]
		}]
	});
	this.centerServiceingGridPanel = Ext.create("MyOrder.MoreGrid", {
		border: 0,
		autoRender: true,
		autoShow: false,
		forceFit: true,
		cls: "alarmConfigTabGridPanel"
	});


	this.displayInnerGrid = function(record) {
		var renderId = record.get("id");
		var store = Ext.create("Ext.data.Store", {
			model: "Order",
		});
		var innerGrid = Ext.create('Ext.grid.Panel', {
			width: "100%",
			store: store,
			selModel: {
				selType: 'cellmodel'
			},
			columns: tools.deepClone(this.centerGridColumns2),
			border: 0,
			autoRender: true,
			autoShow: false,
			forceFit: true,
			cls: "alarmConfigTabGridPanel",
			renderTo: "MoreGridRow" + renderId
		});

		innerGrid.getEl().swallowEvent([
			'mousedown', 'mouseup', 'click',
			'contextmenu', 'mouseover', 'mouseout',
			'dblclick', 'mousemove'
		]);
		this.getOrderListToHistory(record, store);
	};
	this.destroyInnerGrid = function(record) {
		var parent = document.getElementById("MoreGridRow" + record.get('id'));
		var child = parent.firstChild;

		while (child) {
			child.parentNode.removeChild(child);
			child = child.nextSibling;
		}
	};
	this.centerServiceingGridPanel.view.on('expandBody', function(rowNode, record, expandRow, eOpts) {
		this.displayInnerGrid(record);
	}, this);
	this.centerServiceingGridPanel.view.on('collapsebody', function(rowNode, record, expandRow, eOpts) {
		this.destroyInnerGrid(record);
	}, this);


	//  分页
	this.centerServiceingGridPanelPageBar = Ext.create("custom.PageBar", {
		// height: 50,
		width: "100%",
		style: "text-align: center; margin:0 auto;",
		border: 0,
		defaults: {
			style: "background: none; line-height: 30px;color: #fff; border: 0;",
			margin: "0 5",
		},
		listeners: {
			paging: Ext.bind(this.serviceChange, this)
		}
	});
	this.centerServiceingGridMainPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 4 / 5,
		margin: "0 0 0 10",
		items: [
			this.centerServiceingTopPael,
			this.centerServiceingGridPanel,
			this.centerServiceingGridPanelPageBar
		]
	});


	//  服务中的订单列表 end
	//  
	//  
	//  其他订单列表
	//  
	this.centerOtherSearchType = Ext.create("Ext.form.ComboBox", {
		width: 120,
		store: this.searchTypeStore,
		editable: false,
		queryMode: 'local',
		displayField: 'NAME',
		valueField: "VALUE",
		autoSelect: true,
		value: "all",
		cls: "centerFormPanelInput"
	});
	this.centerOtherSearch = Ext.create("Ext.form.Text", {
		cls: "centerFormPanelInput searchInput",
		listeners: {
			specialKey: Ext.bind(this.searchOtherOrder, this)
		}
	});
	// 列表上
	this.centerOtherTopPael = Ext.create("Ext.panel.Panel", {
		border: 0,
		width: "100%",
		layout: "border",
		height: 35,
		defaults: {
			region: "east",
		},
		items: [{
			xtype: "panel",
			items: [this.centerOtherSearchType]
		}, {
			xtype: "panel",
			items: [this.centerOtherSearch]
		}, {
			xtype: "panel",
			margin: "0 15",
			items: [{
				xtype: "button",
				text: "刷新",
				handler: Ext.bind(this.otherChange, this)
			}]
		}]
	});

	this.centerOtherGridPanel = Ext.create("Ext.grid.Panel", {
		border: 0,
		autoRender: true,
		autoShow: false,
		forceFit: true,
		cls: "alarmConfigTabGridPanel",
		store: this.orderOtherStore,
		columns: tools.deepClone(this.centerGridColumns),
	});
	this.centerOtherGridPanelPageBar = Ext.create("custom.PageBar", {
		// height: 50,
		width: "100%",
		style: "text-align: center; margin:0 auto;",
		border: 0,
		defaults: {
			style: "background: none; line-height: 30px;color: #fff; border: 0;",
			margin: "0 5",
		},
		listeners: {
			paging: Ext.bind(this.otherChange, this)
		}
	});
	this.centerOtherGridMainPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 4 / 5,
		margin: "0 0 0 10",
		items: [
			this.centerOtherTopPael,
			this.centerOtherGridPanel,
			this.centerOtherGridPanelPageBar
		]
	});

	this.centerPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "column",
		cls: "serviceDirectoryMainPanel",
		items: [
			this.mainTreePanel,
			this.centerServiceingGridMainPanel
		]
	});

	// 我的订单
	this.viewPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [
			this.topPanel, this.centerPanel
		]
	});


	// 订单信息
	this.myOrderInfoPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			items: [{
				xtype: "label",
				text: "基本信息",
				style: this.msg.labelStyle,
			}]
		}, {
			xtype: "panel",
			border: 0,
			layout: "column",
			cls: "centerFormPanel",
			defaults: {
				style: this.msg.labelStyle,
				xtype: "label",
			},
			items: [{
				columnWidth: 1,
				text: "订单编号：1234567890-12"
			}, {
				columnWidth: 1 / 3,
				text: "订单状态：已完成"
			}, {
				columnWidth: 1 / 3,
				text: "订单来源：甘肃省"
			}, {
				columnWidth: 1 / 3,
				text: "当前处理人：甘肃移动运维组"
			}, {
				columnWidth: 1 / 3,
				text: "订单类型：监控类服务"
			}, {
				columnWidth: 1 / 3,
				text: "订单内容：故障定位监控"
			}, {
				columnWidth: 1 / 3,
				text: "下 单 时 间：2016-08-26 00:00"
			}]
		}]
	});


	//  监控定制详情
	this.myOrderMonitorPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			margin: "5 0",
			items: [{
				xtype: "label",
				text: "监控定制详情",
				style: this.msg.labelStyle,
			}]
		}, {
			xtype: "panel",
			border: 0,
			layout: "column",
			width: "100%",
			cls: "centerFormPanel",
			defaults: {
				margin: "5 0",
				readOnly: true
			},
			items: [{
				columnWidth: 1 / 4,
				xtype: "label",
				style: this.msg.labelStyle,
				text: "渠道：营业厅前台",
				name: "channel",
			}, {
				columnWidth: 1 / 4,
				xtype: "label",
				style: this.msg.labelStyle,
				text: "探测方式： 被动探测",
				name: "probe",
			}, {
				columnWidth: 1,
				xtype: "textareafield",
				cls: "centerFormPanelInput",
				fieldLabel: "业务",
				name: "business",
				labelStyle: this.msg.labelStyle,
				labelWidth: 80,
				height: 80
			}, {
				columnWidth: 1,
				xtype: "textfield",
				cls: "centerFormPanelInput",
				fieldLabel: "指标",
				name: "target",
				labelStyle: this.msg.labelStyle,
				labelWidth: 80
			}, {
				columnWidth: 1,
				xtype: "textfield",
				cls: "centerFormPanelInput",
				fieldLabel: "探测频率",
				name: "probeFrequency",
				labelStyle: this.msg.labelStyle,
				labelWidth: 80
			}]
		}]
	});



	// 告警服务定制
	// 

	// 告警类型
	this.myOrderAlarmTypePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			layout: "hbox",
			items: [{
				xtype: "label",
				style: this.msg.labelStyle,
				text: "告警类型:",
				width: "15%",
			}, {
				width: "85%",
				xtype: "fieldcontainer",
				cls: "serviceDirectoryManageFormCheckbox",
				layout: "hbox",
				defaultType: "checkboxfield",
				defaults: {
					name: "alarmType",
					margin: "5 10",
				},
				items: [{
					boxLabel: "交易量",
					inputValue: "交易量",
					readOnly: true,
					boxLabelCls: "radioLabel"
				}, {
					boxLabel: "成功率",
					inputValue: "成功率",
					readOnly: true,
					boxLabelCls: "radioLabel"
				}, {
					boxLabel: "响应时长",
					inputValue: "响应时长",
					readOnly: true,
					boxLabelCls: "radioLabel"
				}]
			}]
		}]
	});
	//  
	this.columns = {
		defaults: {
			menuDisabled: true,
			draggable: false,
			sortable: false,
		},
		items: [{
			dataIndex: "NAME",
			text: "告警级别",
		}, {
			dataIndex: "TYPE",
			text: "指标",
		}, {
			dataIndex: "CONDITION",
			text: "条件",

		}, {
			dataIndex: "THRESHOLD",
			text: "最低阈值",
			renderer: function(value, column) {
				var type = column.record.get("TYPE");
				var a = "";
				if (type == "成功率") {
					a = "%";
				} else if (type == "响应时长") {
					a = "s";
				}
				value = value || 0;
				value = value + a;
				return value;
			},
		}, {
			dataIndex: "SELECE_THRESHOLD",
			text: "阈值",
			renderer: function(value, column) {
				var type = column.record.get("TYPE");
				var threshold = column.record.get("THRESHOLD");
				var a = "";
				if (type == "成功率") {
					if (value < threshold && value > 100) {
						value = threshol;
					}
					a = "%";
				} else if (type == "响应时长") {
					if (value < threshold) {
						value = threshold;
					}
					a = "s";
				} else if (type == "交易量") {
					if (value < threshold) {
						value = threshold;
					}
				}
				value = value || 0;
				value = value + a;
				return value;
			}
		}, {
			dataIndex: "TIME",
			text: "持续时间",
			width: 300,
			maxWidth: 400,
			renderer: function(value, column) {
				var checkboxs = [];
				var selectValue = column.record.get("SELECE_TIME");
				var type = column.record.get("TYPE");
				for (var i = 0, l = value.length; i < l; i++) {
					var checked = "";
					if (value[i] == "其他") {
						var otherValue = "";
						if (selectValue == "其他") {
							otherValue = column.record.get("SELECE_TIME_OTHER") || "";
						}
						name = "<input type='text' style='width:100px;' placeholder='其他' " +
							" class = 'RATE_TIME_OTHER" +
							column.record.data.ID +
							"' value='" + otherValue + "' >";
					} else {
						name = value[i];
					}
					if (value[i] == selectValue) {
						checked = "checked";
					}
					var checkbox = "<laebl style='margin:0 5px;'>" +
						"<input type='checkbox' class='RATE_TIME" +
						column.record.data.ID + "'" +
						checked +
						"  name='time" + type + column.record.data.ID + "'  value='" +
						value[i] + "' disabled='true'>" + name + " </laebl>"
					checkboxs.push(checkbox);
				}
				var html = "<div class='centerFormPanelInput'>" + checkboxs.join("") + "</div>";
				return html;
			}
		}]
	};
	// 告警配置 各个列表
	this.createRateAlarmConfigGridPanel = function() {
		this.rateAlarmConfigGridPanel && this.rateAlarmConfigGridPanel.remove();
		this.rateAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "成功率告警",
			disable: true,
			cls: "alarmConfigTabGridPanel",
			border: 0,
			autoRender: true,
			autoShow: false,
			store: this.rateAlarmConfigGridStore,
			forceFit: true,
			columns: this.columns
		});
	};
	this.createAmountAlarmConfigGridPanel = function() {
		this.amountAlarmConfigGridPanel && this.amountAlarmConfigGridPanel.remove();
		this.amountAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "交易量告警",
			border: 0,
			cls: "alarmConfigTabGridPanel",
			autoRender: true,
			autoShow: false,
			store: this.amountAlarmConfigGridStore,
			forceFit: true,
			columns: this.columns
				// 结束
		});
	};
	this.createDurationAlarmConfigGridPanel = function() {
		this.durationAlarmConfigGridPanel && this.durationAlarmConfigGridPanel.remove();
		this.durationAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "响应时间告警",
			border: 0,
			cls: "alarmConfigTabGridPanel",
			autoRender: true,
			autoShow: false,
			store: this.durationAlarmConfigGridStore,
			forceFit: true,
			columns: this.columns
		});
	};

	this.myOrderAlarmConfigTabPanel = Ext.create("Ext.tab.Panel", {
		border: 0,
		plain: true,
		title: "告警配置",
		cls: "alarmConfigTabPanel",
	});
	// 告警配置
	// this.myOrderAlarmConfigPanel = Ext.create("Ext.panel.Panel", {
	// 	border: 0,
	// 	items: [{
	// 		xtype: "label",
	// 		style: this.msg.labelStyle,
	// 		text: "告警配置"
	// 	}, this.myOrderAlarmConfigTabPanel]
	// });

	// 告警推送
	this.myOrderAlarmPushPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			layout: "hbox",
			items: [{
				xtype: "label",
				style: this.msg.labelStyle,
				text: "是否支持告警推送:",
				width: "15%",
			}, {
				width: "85%",
				xtype: "fieldcontainer",
				cls: "serviceDirectoryManageFormCheckbox",
				layout: "hbox",
				defaultType: "radiofield",
				defaults: {
					name: "alarmPush",
					margin: "5 10",
					readOnly: true,
					width: 100,
				},
				items: [{
					boxLabel: "是",
					inputValue: true,
					boxLabelCls: "radioLabel"
				}, {
					boxLabel: "否",
					inputValue: false,
					boxLabelCls: "radioLabel"
				}]
			}]
		}]
	});
	// 
	this.myOrderAlarmPushModelPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			layout: "hbox",
			items: [{
				xtype: "label",
				style: this.msg.labelStyle,
				text: "推送方式:",
				width: "15%",
			}, {
				width: "85%",
				xtype: 'fieldcontainer',
				fieldLabel: '',
				defaultType: "checkboxfield",
				defaults: {
					margin: "10 0 10 20",
					width: 50
				},
				width: "100%",
				cls: "serviceDirectoryManageFormCheckbox",
				layout: 'hbox',
				items: [{
					name: "alarmPushMode",
					boxLabel: "短信",
					inputValue: "短信",
					boxLabelCls: "radioLabel",
				}, {
					width: 250,
					xtype: "textfield",
					fieldLabel: "号码",
					name: "alarmPushModeToPhone",
					margin: "10",
					labelWidth: 50,
					cls: "centerFormPanelInput",
					labelStyle: "color: #ddd; font-size: 14px; "
				}, {
					name: "alarmPushMode",
					boxLabel: "邮件",
					inputValue: "短信",
					boxLabelCls: "radioLabel",
				}, {
					width: 250,
					xtype: "textfield",
					fieldLabel: "邮箱",
					margin: "10",
					name: "alarmPushModeToEmail",
					cls: "centerFormPanelInput",
					labelWidth: 50,
					labelStyle: "color: #ddd; font-size: 14px;"
				}]
			}]
		}]
	});
	//
	this.myOrderAlarmPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			margin: "5 0",
			items: [{
				xtype: "label",
				text: "告警服务定制",
				style: this.msg.labelStyle,
			}]
		}, {
			xtype: "panel",
			border: 0,
			defaults: {
				margin: "10 0",
			},
			cls: "centerFormPanel",
			items: [
				this.myOrderAlarmTypePanel,
				this.myOrderAlarmConfigTabPanel,
				this.myOrderAlarmPushPanel,
				this.myOrderAlarmPushModelPanel
			]
		}]
	});



	//  数据服务-------  传输频率
	this.transmissionFrequencyPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "传输频率:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			// fieldLabel: '',
			// labelWidth: 100,
			labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			labelAlign: "right",
			defaultType: "radiofield",
			defaults: {
				name: "transmissionFrequency",
				margin: "10",
				width: 100,
				readOnly: true
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "transmissionFrequencyOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});
	//  数据服务-------  数据文件
	this.dataFilePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "数据文件:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			defaultType: "checkboxfield",
			defaults: {
				name: "dataFile",
				margin: "10",
				width: 100,
				readOnly: true
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				width: 220,
				boxLabel: "PCAP原始数据文件包",
				inputValue: "PCAP原始数据文件包",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "BTR",
				inputValue: "BTR",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "TTR",
				inputValue: "TTR",
				boxLabelCls: "radioLabel",
			}]
		}]
	});
	//  数据服务 ------ 统计指标
	this.statisticalTargetPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "统计指标:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			// labelWidth: 100,
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			// labelAlign: "right",
			defaultType: "checkboxfield",
			defaults: {
				name: "statisticalTarget",
				margin: "10",
				width: 100,
				readOnly: true
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "响应时长",
				inputValue: "响应时长",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "响应率",
				inputValue: "响应率",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "成功率",
				inputValue: "成功率",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "交易量",
				inputValue: "交易量",
				boxLabelCls: "radioLabel",
			}]
		}]
	});
	//  数据服务 ------ 统计粒度
	this.statisticalGranularityPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "统计粒度:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			// labelWidth: 100,
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			// labelAlign: "right",
			defaultType: "radiofield",
			defaults: {
				name: "statisticalGranularity",
				margin: "10",
				width: 100,
				readOnly: true
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "statisticalGranularityOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});
	// 数据服务-------  统计数据  传输频率
	this.statisticalTransmissionFrequencyPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "传输频率:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "radiofield",
			defaults: {
				name: "statisticalTransmissionFrequency",
				margin: "10",
				width: 100,
				readOnly: true
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "statisticalTransmissionFrequencyOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});


	// 
	// 数据服务--------  主体
	this.dataServiceFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		// cls: "centerFormPanel",
		items: [{
				xtype: "checkboxfield",
				name: "probeData",
				boxLabel: "探测明细数据",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}, {
				xtype: "panel",
				border: 0,
				layout: "hbox",
				padding: "10 0",
				cls: "serviceDirectoryManageFormCheckbox",
				items: [{
					xtype: "textfield",
					cls: "centerFormPanelInput",
					fieldLabel: "接口地址",
					labelAlign: "right",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "probeDataHost"
				}, {
					margin: "0 10",
					xtype: "textfield",
					cls: "centerFormPanelInput",
					labelAlign: "right",
					fieldLabel: "端口",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "probeDataPort",
				}]
			}, this.transmissionFrequencyPanel,
			this.dataFilePanel, {
				xtype: "checkboxfield",
				name: "statisticalData",
				boxLabel: "统计数据",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}, {
				xtype: "panel",
				border: 0,
				layout: "hbox",
				padding: "10 0",
				cls: "serviceDirectoryManageFormCheckbox",
				items: [{
					xtype: "textfield",
					cls: "centerFormPanelInput",
					fieldLabel: "接口地址",
					labelAlign: "right",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "statisticalHost",
				}, {
					margin: "0 10",
					xtype: "textfield",
					cls: "centerFormPanelInput",
					labelAlign: "right",
					fieldLabel: "端口",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "statisticalPort",
				}]
			},
			this.statisticalTransmissionFrequencyPanel,
			this.statisticalTargetPanel,
			this.statisticalGranularityPanel,

		]
	});

	//  数据服务定制
	this.myOrderDataPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "panel",
			border: 0,
			margin: "5 0",
			items: [{
				xtype: "label",
				text: "数据服务定制",
				style: this.msg.labelStyle,
			}]
		}, {
			xtype: "panel",
			border: 0,

			cls: "centerFormPanel",
			items: [
				this.dataServiceFormPanel
			]
		}]
	});
	// 订单的内容
	this.myOrderContentPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		margin: "10 0 0 0",
		items: [{
			xtype: "panel",
			border: 0,
			items: [{
				xtype: "label",
				text: "订单内容",
				style: this.msg.labelStyle,
			}]
		}, {
			xtype: "panel",
			border: 0,
			cls: "centerFormPanel",
			items: [
				this.myOrderMonitorPanel,
				this.myOrderAlarmPanel,
				this.myOrderDataPanel
			]
		}]
	});

	// 订单记录
	this.myOrderRecordPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			xtype: "label",
			style: this.msg.labelStyle,
			text: "订单处理记录"
		}, {
			xtype: "panel",
			cls: "centerFormPanel",
			border: 0,
			defaults: {
				xtype: "panel",
				border: 0,
				style: "border-bottom: 1px #aaa solid;",
				layout: "vbox",
				defaults: {
					width: "100%",
					xtype: "label",
					style: this.msg.labelStyle
				}
			},
		}]
	});
	//  附件 panel
	this.myOrderEnclosurePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		margin: "10 0",
		items: [{
			xtype: "label",
			text: "附件",
			style: this.msg.labelStyle
		}, {
			xtype: "panel",
			border: 0,
			cls: "centerFormPanel",
			defaults: {
				width: "100%",
				baseCls: "base-btn x-btn",
				style: "background: none; border: 0;",
				textAlign: "left",
				xtype: "button"
			},
			items: []
		}]
	});

	this.myOrderDetailsLeftPanel = Ext.create("Ext.panel.Panel", {
		columnWidth: 3 / 4,
		margin: "0 10",
		border: 0,
		items: [this.myOrderInfoPanel,
			this.myOrderContentPanel
		]
	});
	this.myOrderDetailsRigthPanel = Ext.create("Ext.panel.Panel", {
		columnWidth: 1 / 4,
		margin: "0 10",
		border: 0,
		items: [this.myOrderRecordPanel, this.myOrderEnclosurePanel],
	});


	// 我的订单详情 标题
	this.myOrderDetailsTitlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		margin: "5 0",
		items: [{
			xtype: "button",
			baseCls: " x-btn base-btn",
			style: "background: none",
			text: "我的订单",
			handler: Ext.bind(this.openMyOrder, this)
		}, {
			xtype: "label",
			text: ">>",
			margin: "0 5",
			style: this.msg.labelStyle,
		}, {
			xtype: "label",
			text: "订单详情",
			margin: "0 5",
			style: this.msg.labelStyle,
		}]
	});
	// 我的订单详情 主panel
	this.myOrderDetailsPanel = Ext.create("Ext.form.Panel", {
		border: 0,
		layout: "column",
		cls: "serviceDirectoryMainPanel",
		items: [this.myOrderDetailsLeftPanel, this.myOrderDetailsRigthPanel]
	});
	// 
	this.myOrderDetailsMainPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [this.myOrderDetailsTitlePanel, this.myOrderDetailsPanel]
	})



}
MyOrder.prototype = new Page(Configes.page.myOrder);
///<jscompress sourcefile="statistics.js" />
!function(w,Ext){

	'use strict';

	var 
		/* public object */ 
		vz2 = {},

		/* component */ 
		prolongation = {},

		core2array = [],
		core_forEach = Function.prototype.call.bind(core2array.forEach),
		common = {
			_province: '甘肃省',
		};

	var 
		_application;

	!function(){
		var test = true;
		vz2.ajax = function(opts){
			var _u = opts.url,
				_f = opts.success;
			opts.method = 'GET',
			opts.success = function(res,eOpts){
				var result = JSON.parse(res.responseText);
				_f(true === test ? result[_u] : result,eOpts);
			};
			if(true === test)opts.url = 'script/test.json';
			Ext.Ajax.request(opts);
		}
	}();

	vz2.createDateTimePicker = function(width,columnWidth,hidden,style){
		var
			 mainPanel = Ext.create('Ext.button.Split',{
				text: '选择日期时间',
				width: width,
				columnWidth: columnWidth,
				hidden: hidden || false,
				autoRender: true,
				style: style || {
					background: 'rgba(0,0,0,0.4)',
				},
				handler: function() {
					this.showMenu();
				},
				listeners: {
					menuhide: function(){
						var 
							date = mainPanel.menu.items.get(0).value,
							time = mainPanel.menu.items.get(1).value,
							dateTimeString;

						if(date instanceof Date && time instanceof Date){
							dateTimeString = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + time.getHours() + ':' + time.getMinutes()
							mainPanel.setText(dateTimeString);
						}
					}
				},
				menu: new Ext.menu.Menu({
				    items: [
						{
							xtype: 'datepicker'
						}, {
							fieldLabel: '时间',
							xtype: 'timefield',
							increment: 1,
						}, {
							xtype: 'button',
							text: '确定',
							align: 'center',
							handler: function(button,e){
								mainPanel.hideMenu();
							}
						}
					]
				}),
			});

		return mainPanel;
	}

	/* home */ 

	vz2.monitorSceneInitialize = function(){

		/* define storage & config */ 

		var 
			viewValueController,

			provinceStore = Ext.create('Ext.data.Store',{
				fields: ['name','value'],
				data: [
					{name: '甘肃省', value: 1},
				]
			}),

			businessStore = Ext.create('Ext.data.Store',{
				fields: ['name','value'],
				data: [
					{name: '全部',          value:'1'},
					{name: '充值',          value:'2'},
					{name: '购机',          value:'3'},
					{name: '查欠',          value:'4'},
					{name: '换卡',          value:'5'},
					{name: '活动受理',      value:'6'},
					{name: '积分查询',      value:'7'},
					{name: '交费',          value:'8'},
					{name: '客户信息查询',   value:'9'},
					{name: '免费资源查询',   value:'10'},
					{name: '实时话费查询',   value:'11'},
					{name: '详单查询',       value:'12'},
					{name: '业务变更',       value:'13'},
					{name: '用户订购产品查询',value:'14'},
					{name: '月结账单查询',   value:'15'},
					{name: '中心业务受理',   value:'16'},
					{name: '转套餐办产品',   value:'17'}
				 ]
			}),

			timeRangeStore = Ext.create('Ext.data.Store',{
				fields: ['name','value'],
				data: [
					{name: '近10分钟',  value: '10'},
					{name: '近1小时',   value: '60'},
					{name: '近1天',     value: '1440'},
					{name: '自定义',    value: '0'}
				]
			}),

			warningListStore = Ext.create('Ext.data.Store', {
				fields: [
					{name: 'province', type: 'string'},
					{name: 'channel',  type: 'string'},
					{name: 'business', type: 'string'},
					{name: 'warning',  type: 'string'},
					{name: 'level',    type: 'string'},
					{name: 'timing',   type: 'string'},
					{name: 'count',    type: 'string'},
					{name: 'state',    type: 'string'}
				]
			}),

			boxContent = {
			 	bar1: {
			 		title: '客户端',
			 		boxes: [
			 			{
			 				title: '营业厅客户端',
			 				latitude: 0,
			 				type: 1,
			 				icon: 1,
			 				arrowRight: true
			 			}, {
			 				title: '掌厅客户端',
			 				latitude: 5,
			 				type: 1,
			 				icon: 1,
			 				arrowRight: true
			 			}, {
			 				title: '网厅客户端',
			 				latitude: 4,
			 				type: 1,
			 				icon: 1,
			 				arrowRight: true
			 			}, {
			 				title: '其他',
			 				latitude: 6,
			 				type: 1,
			 				icon: 1,
			 				arrowRight: true
			 			}
			 		]
			 	},
			 	bar2: {
			 		title: '接口区',
					translate: '(255,0)',
			 		boxes: [
			 			{
			 				title: '营业厅protal',
			 				latitude: 0,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '掌厅protal',
			 				latitude: 5,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '网厅protal',
			 				latitude: 4,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '其他protal',
			 				latitude: 6,
			 				type: 1,
			 				icon: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}
			 		]
			 	},
			 	bar3: {
			 		title: '核心区',
					translate: '(510,0)',
					scale: '(2.416666,1)',
			 		boxes: [
			 			{
			 				title: 'CRM前台-雁滩',
			 				latitude: 0,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: 'CRM前台-银滩',
			 				latitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: 'BOSS前台-雁滩',
			 				latitude: 2,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: 'BOSS前台-银滩',
			 				latitude: 3,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: 'CRM后台',
			 				latitude: 0,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '账管后台',
			 				latitude: 2,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '账处后台',
			 				latitude: 3,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '统一接口-银滩',
			 				latitude: 4,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '统一接口A-雁滩',
			 				latitude: 5,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '统一接口B-雁滩',
			 				latitude: 6,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}
			 		]
			 	},
			 	bar4: {
			 		title: '接口区',
					translate: '(1020,0)',
			 		boxes: [
			 			{
			 				title: 'CRM-DB',
			 				latitude: 0,
			 				type: 2,
			 				arrowLeft: true
			 			}, {
			 				title: 'BOSS-DB',
			 				latitude: 1,
			 				type: 2,
			 				arrowLeft: true
			 			}
			 		]
			 	}
			},

			tools = {
				model:[
					{title: '交易量',   content: '0', x1:65, y1:32, x2:65, y2:46},
					{title: '响应时间', content: '0', x1:115,y1:32, x2:115,y2:46},
					{title: '成功率',   content: '0', x1:65, y1:62, x2:65, y2:75},
					{title: '告警事件', content: '0', x1:115,y1:62, x2:115,y2:75}
				],

				createPaintContainer: function(options){
					var options = options;
					options.xmlns = "http://www.w3.org/2000/svg";
					options.version = "1.1";

					var oSvg = this.createSVGPattern({
						type: 'svg',
						attr: options
					});
					oSvg.innerHTML = '\
						<defs>\
							<g id="mainPanel">\
								<rect x="10" y="10" width="160" height="670" fill="rgba(0,0,0,0.2)" stroke="none" />\
								<rect x="5" y="5" width="170" height="680" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="10px" stroke-linejoin="round"/>\
							</g>\
							<g id="outerPanel1">\
								<rect x="50" y="10" width="80" height="60" fill="rgba(0,0,0,0.2)" stroke="none" />\
								<rect x="45" y="5" width="90" height="70" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="10px" stroke-linejoin="round" />\
								<path d="M 40 20 L 140 20" stroke-width="1px" stroke="#ffffff" fill="none" id="panelSlice1"/>\
							</g>\
							<g id="outerPanel2">\
								<use xlink:href="#outerPanel1" x="" y=""/>\
								<path d="M 40 50 L 140 50 M 91 20 L 91 80" stroke-width="1px" stroke="#999999" fill="none"/>\
							</g>\
							<!-- icon -->\
							<path d="M 1 1 L 41 1 L 41 21 L 1 21 L 1 0 M 16 22 L 16 27 M 26 22 L 26 27 M 9 28 L 33 28" stroke-width="2px" stroke="#ffffff" fill="none" id="computerPanel"/>\
							<g id="board">\
								<rect x="" y="" width="20" height="30" fill="none" stroke="#ffffff" stroke-width="4px"/>\
								<path d="M 0 6 L 20 6" stroke-width="3px" stroke="#ffffff" fill="none"/>\
								<rect x="0" y="10" width="20" height="20" fill="#ffffff" stroke="none"/>\
							</g>\
							<path d="M 1 1 L 5 5 L 1 9" stroke-width="2px" stroke="#ffffff" stroke-linejoin="round" fill="none" id="arrow"/>\
							<g id="arrowLeft">\
								<use xlink:href="#arrow" x="18" y="5"/>\
								<use xlink:href="#arrow" x="23" y="5"/>\
							</g>\
							<g id="arrowRight">\
								<use xlink:href="#arrow" x="152" y="5"/>\
								<use xlink:href="#arrow" x="157" y="5"/>\
							</g>\
						</defs>'

					return oSvg;
				},
				createComponent: function(){
					var 
						_this = this,
						barElement,
						barOpts,
						box;

					viewValueController = new tools.ViewValueController();

					for(var bar in boxContent){
						barOpts = {
							title:     boxContent[bar]['title'],
							translate: boxContent[bar]['translate'],
							scale:     boxContent[bar]['scale']
						};
						barElement = tools.createBar(barOpts);

						boxContent[bar]['boxes'].forEach(function(item){
							box = tools.createBox(item);
							viewValueController.add({
								el:   box,
								type: item.type
							});
							barElement.appendChild(box);
						});

						paintPanel.appendChild(barElement);
					}

					var sx = 163, // start x
						sy = 55,  // start y
						ex = 277, // end x
						ey = 55,  // end y
						dx = 255, // distance x
						dy = 90;  // distance y

					var lineGroup = tools.createLineGroup([
						[sx+dx*0, sy+dy*0, ex+dx*0, ey+dy*0],
						[sx+dx*0, sy+dy*4, ex+dx*0, ey+dy*4],
						[sx+dx*0, sy+dy*5, ex+dx*0, ey+dy*5],
						[sx+dx*0, sy+dy*6, ex+dx*0, ey+dy*6],

						[sx+dx*1, sy+dy*0, ex+dx*1, ey+dy*0],
						[sx+dx*1, sy+dy*0, ex+dx*1, ey+dy*1],
						[sx+dx*1, sy+dy*0, ex+dx*1, ey+dy*2],
						[sx+dx*1, sy+dy*0, ex+dx*1, ey+dy*3],

						[sx+dx*1, sy+dy*4, ex+dx*2, ey+dy*4],
						[sx+dx*1, sy+dy*4, ex+dx*2, ey+dy*5],
						[sx+dx*1, sy+dy*5, ex+dx*2, ey+dy*4],
						[sx+dx*1, sy+dy*5, ex+dx*2, ey+dy*5],
						[sx+dx*1, sy+dy*6, ex+dx*2, ey+dy*4],
						[sx+dx*1, sy+dy*6, ex+dx*2, ey+dy*5],
						[sx+dx*1, sy+dy*6, ex+dx*2, ey+dy*6],

						[sx+dx*2, sy+dy*0, ex+dx*2, ey+dy*0],
						[sx+dx*2, sy+dy*1, ex+dx*2, ey+dy*0],
						[sx+dx*2, sy+dy*2, ex+dx*2, ey+dy*2],
						[sx+dx*2, sy+dy*2, ex+dx*2, ey+dy*3],
						[sx+dx*2, sy+dy*3, ex+dx*2, ey+dy*2],
						[sx+dx*2, sy+dy*3, ex+dx*2, ey+dy*3],

						[sx+dx*3, sy+dy*0, ex+dx*3, ey+dy*0],
						[sx+dx*3, sy+dy*0, ex+dx*3, ey+dy*1],
						[sx+dx*3, sy+dy*2, ex+dx*3, ey+dy*0],
						[sx+dx*3, sy+dy*2, ex+dx*3, ey+dy*1],
						[sx+dx*3, sy+dy*3, ex+dx*3, ey+dy*1],
						[sx+dx*3, sy+dy*4, ex+dx*3, ey+dy*1],
						[sx+dx*3, sy+dy*5, ex+dx*3, ey+dy*1],
						[sx+dx*3, sy+dy*6, ex+dx*3, ey+dy*1]
					]);
					paintPanel.appendChild(lineGroup);
				},
				createLineGroup: function(pointArray){
					var
						g = this.createSVGPattern({type:'g'}),
						_this = this;

					pointArray.forEach(function(item){
						var point = _this.createSVGPattern({
							type: 'path',
							attr: {
								'd': 'M '+item[0]+' '+item[1]+' L '+item[2]+' '+item[3],
								'stroke': '#ffffff',
								'stroke-width': '1px',
								'fill': 'none'
							}
						});
						g.appendChild(point);
					});

					return g;
				},
				createBar: function(options){
					/*
					 * optional property: translate, scale
					 */ 
					var 
						options = options || {},
						g = this.createSVGPattern({
							type: 'g',
							attr: {
								transform: 'translate'+(options.translate||'(0)')
							}
						}),
						use = this.createSVGPattern({
							type: 'use',
							attr: {
								transform: 'scale'+(options.scale||'(1)')
							},
							attrNS: {
								xlink: '#mainPanel'
							}
						}),
						title = this.createText({
							x: 50,
							y: 25,
							fs: '16px',
							content: options.title
						});

					[use,title].forEach(function(item){
						g.appendChild(item);
					});

					return g;
				},
				createBox: function(options){
					/*
					 * options: type, title
					 * optional property: translate, icon, arrow, content!
					 */ 
					var 
						g = this.createSVGPattern({
							type: 'g',
							attr: {
								transform: 'translate('+(parseInt(options.longitude) * 255 || 0)+','+(parseInt(options.latitude) * 90 + 45)+')'
							}
						}),
						background = this.createSVGPattern({
							type: 'use',
							attrNS: {
								xlink: '#outerPanel'+options.type
							}
						}),
						title = this.createText({
							x: 90,
							y: 15,
							fs: options['fs']||'13px',
							content: options.title,
							color: options.color
						}),
						container,
						icon = options.icon && this.createSVGPattern({
							type: 'use',
							attr: {
								x: options.icon==1?69:80,
								y: 35
							},
							attrNS: {
								xlink: options.icon==1?'#computerPanel':'#board'
							}
						}),
						arrowLeft = options.arrowLeft && this.createSVGPattern({
							type: 'use',
							attrNS: {
								xlink: '#arrowLeft'
							}
						}),
						arrowRight = options.arrowRight && this.createSVGPattern({
							type: 'use',
							attrNS: {
								xlink: '#arrowRight'
							}
						});

					if(options.type === 2){
						/* create box content */ 
						container = document.createDocumentFragment();
						tools.model.forEach(function(item,index){
							var 
								boxTitle = tools.createText({
									'x': item['x1'],
									'y': item['y1'],
									'content': item.title,
									'fs': '12px',
									'color':item.color
								}),
								boxContent = tools.createText({
									'x': item['x2'],
									'y': item['y2'],
									'content': item['content'],
									'fs': '12px',
									'color':item.color
								});
							container.appendChild(boxTitle);
							container.appendChild(boxContent);
						});

						g.addEventListener('click',function(e){
							_application = this.getElementsByTagName('text')[0].innerHTML;
							mainPanel.hide();
							componentPanel.show();
						},false);
						g.style.cursor = 'pointer';
					}

					[background,title,container,icon,arrowLeft,arrowRight].forEach(function(item){
						true === item instanceof Node && g.appendChild(item);
					});

					return g;
				},
				createText: function(opt){
					/*
					 * options: content
					 * optional property: x, y, fs(short for font-size), color
					 */ 
					var text = this.createSVGPattern({
						type: 'text',
						attr: {
							'x': opt.x||0,
							'y': opt.y||0,
							'font-size': opt['fs']||'16px',
							'text-anchor': 'middle',
							'fill': opt.color||'#ffffff'
						}
					});
					text.innerHTML = opt.content;
					return text;
				},
				createSVGPattern: function(options){
					/*
					 * optional property:
					 * x, y, fs(short for font-size), color
					 */ 
					var o = document.createElementNS('http://www.w3.org/2000/svg',options.type);
					if(void 0 !== options.attr){
						for(var n1 in options.attr){
							o.setAttribute(n1,options.attr[n1]);
						}
					}
					if(void 0 !== options.attrNS){
						for(var n2 in options.attrNS){
							o.setAttributeNS('http://www.w3.org/1999/'+n2,n2+':href',options.attrNS[n2]);
						}
					}
					return o;
				},
				ViewValueController: function(){
					var 
						elementStore = [],
						col,
						i;

					this.add = function(){
						core_forEach(arguments,function(item){
							elementStore.push(item);
						});
					}

					this.update = function(){
						i = 0;
						var arg = arguments[0];
						core_forEach(elementStore,function(item){
							if(item.type === 2 && void 0 !== arg[i]){
								handle(item.el.children,arg[i]);

								i++;
							}
						});
					}

					function handle(el,data){
						col =  data[3] > 0 ? '#ff0000' : '#ffffff';
						el[1].setAttribute('fill',col);
						el[8].setAttribute('fill',col);
						el[9].setAttribute('fill',col);

						el[3].innerHTML = data[0] + '笔';
						el[5].innerHTML = data[1] + 'ms';
						el[7].innerHTML = data[2] + '%';
						el[9].innerHTML = data[3];
					}
				},
			};

		/* define panel */ 

		var 

			mainPanel = Ext.create('Ext.panel.Panel',{
				border: 0,
				id: 'vz_monitorSceneMode',
				listeners: {
					afterrender: function(){
						mainPanel.child().getEl().dom.parentNode.appendChild(paintPanel);
						reload({
							province: '甘肃',
							business: '全部',
							timing: '300000'
						});
						mainPanel.show();
						componentPanel.hide();
					}
				}
			}),

			componentPanel = Ext.create('Ext.panel.Panel',{
				border: 0,
				hidden: true,
				listeners: {
					show: function(){
						setActiveTag(0);
						menuPanel.items.get(1).setActiveTab(0);
						var _o = menuPanel.query('combobox');
						_o[0].setValue(_application);
						_o[1].setValue(common._province);
					}
				}
			}),

			filterPanel = Ext.create('Ext.form.Panel',{
				layout: 'column',
				border: 0,
				padding: '0 0 10 0',
				margin: '0 0 740 0',
				style: 'border: 0;border-bottom: 1px #aaa solid',
				defaults: {
					editable: false,
					displayField: "name",
					valueField: "value",
					queryMode: "local",
				},
				items: [
					{
						disabled: true,
						fieldLabel: '选择省份',
						labelWidth: 65,
						margin: '0 10 0 0',
						store: provinceStore,
						width: 185,
						xtype: "combobox",
						listeners: {
							afterrender: function(){
								this.setValue(1);
							}
						}
					}, {
						fieldLabel: '选择业务',
						labelWidth: 65,
						margin: '0 10 0 0',
						store: businessStore,
						width: 185,
						xtype: "combobox",
						listeners: {
							afterrender: function(){
								this.setValue(1);
							}
						}
					}, {
						fieldLabel: '选择时间段',
						labelWidth: 75,
						margin: '0 10 0 0',
						store: timeRangeStore,
						width: 185,
						xtype: "combobox",
						listeners: {
							afterrender: function(){
								this.setValue('60');
							},
							select: function(){
								var 
									initial = false,
									cmp1,cmp2,cmp3;
								return function(combobox,e){
									if(false === initial){
										var itemList = this.ownerCt.items;
										cmp1 = itemList.get(3);
										cmp2 = itemList.get(4);
										cmp3 = itemList.get(5);
										initial = true;
									};

									[cmp1,cmp2,cmp3].forEach(function(item){
										combobox.lastMutatedValue === '自定义'?item.show():item.hide();
									});
								};
							}()
						}
					},
					vz2.createDateTimePicker(125,null,true),
					{
						hidden: true,
						style: {
							lineHeight: '24px',
							textAlign: 'center',
						},
						text: '—',
						width: 30,
						xtype:'label',
					},
					vz2.createDateTimePicker(125,null,true),
					{
						cls: 'vz_search_btn',
						margin: '0 0 0 10',
						width: 27,
						xtype: 'button',
						handler: function(){
							var 
								params = {},
								initial = false,
								itemList = [];

							return function(){
								if(false === initial){
									itemList = filterPanel.query('combobox,splitbutton');
									initial = true;
								}
								params = {
									province:itemList[0].emptyText||itemList[0].lastMutatedValue,
									channel: itemList[1].lastMutatedValue,
									time:    itemList[2].lastMutatedValue,
								}
								if(params.time === '自定义'){
									params.startTime = itemList[5].text;
									params.endTime   = itemList[6].text;
								};
								reload(params);
							}
						}()
					}
				]
			}),

			paintPanel = tools.createPaintContainer({
				width: 1200,
				height: 700,
				style: 'position: absolute;top: 65px;'
			}),

			warningListPanel = Ext.create('Ext.grid.Panel',{
				border: 0,
				columnWidth: 1,
				cls: 'vz_warningList',
				maxHeight: 220,
				store: warningListStore,
				columns: {
					defaults: {
						menuDisabled: true,
						draggable: false,
						sortable: false,
						align: 'center',
					},
					items: [
						{
							dataIndex: 'province',
							text: "省份"
						}, {
							dataIndex: 'channel',
							text: "交易渠道"
						}, {
							dataIndex: 'business',
							text: "业务名称",
						}, {
							dataIndex: 'warning',
							text: "告警类型"
						}, {
							dataIndex: 'level',
							text: "告警级别"
						}, {
							dataIndex: 'timing',
							text: "告警发生时间"
						}, {
							dataIndex: 'count',
							text: "告警条数"
						}, {
							dataIndex: 'state',
							text: "告警状态"
						}, {
							text: "操作",
							dataIndex:"button", 
							renderer:function(value){
								return "<input type='button' value='查看' />" ;
							}   
						}
					]
				},
				viewConfig : {
					forceFit : false, 
					autoFill : false 
				},
				tbar: [
					{
						xtype: 'label',
						text: '告警列表'
					}, {
						baseCls: "vz-icon vz-icon-i1",
						handler: function() {
							var initial = false;
							return function(){
								false === initial && (initial = true) && void 0 === warningCenterPanel && warningCenterInitial();
								mainPanel.hide();
								warningCenterPanel.show();
							}
						}()
					}
				],
				layout: 'fit',
				listeners: {
					itemclick: function(){
						var initial = false;
						return function(){
							false === initial && (initial = true) && void 0 === warningCenterPanel && warningCenterInitial();
							mainPanel.hide();
							warningCenterPanel.show();
						}
					}()
				},
				forceFit: true,
				autoRender: true
			}),

			menuPanel = Ext.create('Ext.panel.Panel',{
				border: 0,
				cls: 'vz_lock_menu',
				style: {
					borderBottom: '1px #fff solid'
				},
				items: [
					{
						border: 0,
						defaults: {
							xtype: 'combobox',
							editable: false,
							displayField: 'name',
							valueField: 'value'
						},
						width: 350,
						layout: 'column',
						style: {
							margin: '0 auto'
						},
						items: [
							{
								cls: 'vz_combobox_large',
								width: 220,
								height: 37,
								style: {
									fontSize: '24px',
								},
								store: new Ext.data.Store({
									fields: ['name','value'],
									data: [
										{name: '营业厅protal' ,value: '营业厅protal'  },
										{name: '网厅protal'   ,value: '网厅protal'   },
										{name: '掌厅protal'   ,value: '掌厅protal'   },
										{name: 'CRM前台-雁滩' ,value: 'CRM前台-雁滩'  },
										{name: 'CRM前台-银滩' ,value: 'CRM前台-银滩'  },
										{name: 'BOSS前台-雁滩',value: 'BOSS前台-雁滩' },
										{name: 'BOSS前台-银滩',value: 'BOSS前台-银滩' },
										{name: 'CRM后台'      ,value: 'CRM后台'       },
										{name: '账管后台'      ,value: '账管后台'      },
										{name: '账处后台'      ,value: '账处后台'      },
										{name: '统一接口-银滩' ,value: '统一接口-银滩' },
										{name: '统一接口A-雁滩',value: '统一接口A-雁滩'},
										{name: '统一接口B-雁滩',value: '统一接口B-雁滩'},
										{name: 'CRM-DB'       ,value: 'CRM-DB'       },
										{name: 'BOSS-DB'      ,value: 'BOSS-DB'      },
									]
								}),
							},{
								margin: '12 0 0 20',
								width: 100,
								store: new Ext.data.Store({
									fields: ['name','value'],
									data: [
										{name: '甘肃省', value: '甘肃省'}
									]
								}),
							}
						]
					}, {
						border: 0,
						plain: true,
						width: 370,
						xtype: 'tabpanel',
						style: {
							margin: '0 auto',
						},
						defaults: {
							border: 0,
							listeners: {
								activate: function(newTag,oldTag){
									setActiveTag(newTag.pageId,oldTag.pageId);
								}
							}
						},
						items: [
							{pageId: 0,title: "应用层视图",}, 
							{pageId: 1,title: "应用层快照",}, 
							{pageId: 2,title: "多维统计",  }, 
							{pageId: 3,title: '交易追踪',  },
						],
					}
				],
			}),

			warningCenterPanel;

		/* define features */ 

		var 

			reload = function(){
				var 
					province,
					business,
					timing;

				return function(options){
					if('province' in options)province = options['province'];
					if('business' in options)business = options['business'];
					if('timing'   in options)timing   = options['timing'];

					vz2.ajax({
						url: 'monitorSceneInitialize',
						params: {
							'province':province,
							'business':business,
							'timing':  timing
						},
						success: function(res, eOpts){
							var
								review = res['review'],
								warningList = res['warningList'];

							viewValueController.update(review);
							warningListStore.loadData(warningList);
						},
						failure: function(){

						}
					})
				}
			}(),

			setActiveTag = function(){
				var tagContainer = [],
					_constructor = ['applicationSceneMode','applicationSnapShot','applicationStatistics','transactionTracking'];

				return function(index,lastActiveTag){
					if(void 0 === tagContainer[index]){
						var _o =  prolongation[_constructor[index]]();
						tagContainer[index] = _o;
						componentPanel.add(_o);
					}
					if(void 0 !== lastActiveTag)tagContainer[lastActiveTag].hide();
					tagContainer[index].show();
				}
			}(),

			warningCenterInitial = function(){
				warningCenterPanel = prolongation['warningCenter']();
				mainPanel.up('panel').add(warningCenterPanel);
			};

			vz2.changeModel = function(){
				var initial = false;
				return function(){
					false === initial && (initial = true) && void 0 === warningCenterPanel && warningCenterInitial();
					mainPanel.hide();
					warningCenterPanel.show();
				}
			}();

		/* initialize */ 

		tools.createComponent();
		mainPanel.add([filterPanel,warningListPanel]);
		componentPanel.add(menuPanel);

		return [mainPanel,componentPanel];
	};

	vz2.extend = function(name, target){
		prolongation[name] = target;
	}

	/* component */ 


	return w.vz2 = vz2;

}(window,Ext);
///<jscompress sourcefile="vz_applicationSceneMode.js" />
/*
 * 应用层视图
 *
 */ 


vz2.extend('applicationSceneMode',function(){

	/* define option for combobox */ 

	var 
		cTools,
		transactionTypeStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '全部', value: '0'},
				{name: '交易类型1', value: '1'},
				{name: '交易类型2', value: '2'},
				{name: '交易类型3', value: '3'},
				{name: '交易类型4', value: '4'},
				{name: '交易类型5', value: '5'},
			]
		}),
		transactionChannelStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '全部', value: '0'},
				{name: '交易渠道1', value: '1'},
				{name: '交易渠道2', value: '2'},
				{name: '交易渠道3', value: '3'},
				{name: '交易渠道4', value: '4'},
				{name: '交易渠道5', value: '5'},
			]
		}),
		periodStore = Ext.create('Ext.data.Store', {
			/* unit: minute */ 
			fields: ['name','value'],
			data: [
				{name: '近10分钟',  value: '10'},
				{name: '近1小时',   value: '60'},
				{name: '近1天',     value: '1440'},
				{name: '自定义',    value: '0'}
			]
		});

	/* define panel */ 

	var 

		mainPanel = Ext.create('Ext.panel.Panel',{
			style: 'width: 100%;min-width:1200px;',
			id: 'vz_appSceneMode',
			listeners: {
				afterrender: function(){
					var 
						initial = false,
						itemList;

					return function(){
						if(false === initial){
							itemList = mainPanel.query('combobox');
							initial = true;
						};
						var params = cTools.granularityCalculator();

						params.statement = itemList[0].lastMutatedValue,
						params.channel   = itemList[1].lastMutatedValue,

						reload(params);
					}
				}()
			},
			defaults: {
				border: 'none'
			},
			tbar: {
				margin: '0 0 10 0',
				defaults: {
					editable: false,
					displayField: 'name',
					valueField: 'value',
					queryMode: 'local',
				},
				items: [
					{
						fieldLabel: '交易类型',
						labelWidth: '75px',
						store: transactionTypeStore,
						value: '0',
						xtype: 'combobox',
					}, {
						fieldLabel: '交易渠道',
						labelWidth: '75px',
						store: transactionChannelStore,
						value: '0',
						xtype: 'combobox',
					}, {
						fieldLabel: '时间',
						labelWidth: '75px',
						store: periodStore,
						value: '60',
						xtype: 'combobox',
						listeners: {
							select: function(){
								var 
									initial = false,
									cmp1,cmp2,cmp3,cmp4,
									refer = {'0':'','10':'1分钟','60':'5分钟','1440':'30分钟'};
								return function(combobox,e){
									if(false === initial){
										var itemList = this.ownerCt.items;
										cmp1 = itemList.get(3);
										cmp2 = itemList.get(4);
										cmp3 = itemList.get(5);
										cmp4 = itemList.get(6);
										initial = true;
									};
									[cmp1,cmp2,cmp3].forEach(function(item){
										combobox.value === '0'?item.show():item.hide();
									});

									cmp4.setValue(refer[combobox.value]);
								};
							}()
						}
					},
					vz2.createDateTimePicker(null,0.125,true),
					{
						columnWidth: 1/46,
						hidden: true,
						style: {
							lineHeight: '24px',
							textAlign: 'center',
							color: '#fff',
						},
						text: '—',
						xtype:'label',
					},
					vz2.createDateTimePicker(null,0.125,true),
					{ 
						fieldLabel: '粒度',
						labelWidth: 40,
						value: '5分钟',
						name: 'timeGranularity',
						readOnly: true,
						width: 100,
						xtype: 'textfield',
					}, {
						cls: 'vz_search_btn',
						columnWidth: 1/25,
						margin: '0 0 0 20',
						xtype: 'button',
						handler: function(){
							var 
								initial = false,
								refer = {1:'1分钟',5:'5分钟',15:'15分钟',30:'30分钟',60:'1小时',240:'4小时',1440:'1天'},
								granularity,
								itemList;

							return function(){
								if(false === initial){
									itemList = mainPanel.query('combobox');
									granularity = mainPanel.query('textfield')[5];
									initial = true;
								};
								var params = cTools.granularityCalculator();

								params.statement = itemList[0].lastMutatedValue,
								params.channel   = itemList[1].lastMutatedValue,

								granularity.setValue(refer[params.granularity]);
								reload(params);
							}
						}()
					}
				]
			},
			items: [{
				layout: 'column',
				defaults: {
					border: 'none'
				},
				items: [{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas1" width="1180" height="420"></canvas>'
				},{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas2" width="1180" height="420"></canvas>'
				}]
			}, {
				layout: 'column',
				items: [{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas3" width="1180" height="420"></canvas>'
				},{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas4" width="1180" height="420"></canvas>'
				}]
			}, {
				layout: 'column',
				items: [{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas5" width="1180" height="420"></canvas>'
				},{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas6" width="1180" height="420"></canvas>'
				}]
			}]
		});

	/* define features */ 

	cTools = {
		drawCoordinate:  function(ctx,opts){
			ctx.clearRect(0,0,1180,420);

			var result = cTools.pointFilter({
				startTime: opts.startTime,
				endTime: opts.endTime,
				granularity: opts.timeDistance,
				lineChartPointArray: opts.lineChartPointArray,
				x: opts.lineChartOriginX,
				y: opts.lineChartOriginY,
				strokeStyle: opts.lineChartStrokeStyle,
				lineWidth: opts.lineChartWidth,
				fillStyle: opts.lineChartFillStyle
			});

			cTools.drawTitle(ctx, opts.title);

			cTools.drawMathOrdinate(ctx, opts.rowValue, opts.rows);

			cTools.drawTimeAbscissa(ctx, result);

			opts.statement.forEach(function(item){
				cTools.drawStatement(ctx,{
					x:item.x,
					y:item.y,
					strokeStyle: item.strokeStyle,
					fillStyle: item.fillStyle,
					text: item.text
				});
			});

			cTools.drawLineChart(ctx, result);
		},
		drawBarGraph:    function(ctx,opts){
			ctx.clearRect(0,0,1180,420);

			var result = cTools.pointFilter({
				startTime: opts.startTime,
				endTime: opts.endTime,
				granularity: opts.timeDistance,
				lineChartPointArray: opts.lineChartPointArray,
				x: opts.lineChartOriginX,
				y: opts.lineChartOriginY,
				strokeStyle: opts.lineChartStrokeStyle,
				lineWidth: opts.lineChartWidth,
				fillStyle: opts.lineChartFillStyle
			});

			cTools.drawTitle(ctx, opts.title);

			cTools.drawMathOrdinate(ctx, opts.rowValue, opts.rows);

			cTools.drawTimeAbscissa(ctx, result);

			opts.statement.forEach(function(item){
				cTools.drawStatement(ctx,{
					x:item.x,
					y:item.y,
					strokeStyle: item.strokeStyle,
					fillStyle: item.fillStyle,
					text: item.text
				});
			});

			var 
				degreeLength = result.degreeLength,
				barWidth = degreeLength * 2 / 3,
				halfWidth = barWidth / 2;

			ctx.save();
			ctx.translate(result.x, result.y);
			result.path.forEach(function(item,i){
				ctx.fillStyle = '#fff';
				ctx.fillRect(i * degreeLength - halfWidth,0,barWidth,-200);
				ctx.fillStyle = 'rgb(219,0,97)';
				ctx.fillRect(i * degreeLength - halfWidth,0,barWidth,-item[1]);
			});
			ctx.restore();
		},
		drawRankingLisk: function(ctx,opts){
			ctx.clearRect(0,0,1180,420);

			cTools.drawTitle(ctx, opts.title);

			opts.statement.forEach(function(item){
				cTools.drawStatement(ctx,{
					x:item.x,
					y:item.y,
					strokeStyle: item.strokeStyle,
					fillStyle: item.fillStyle,
					text: item.text
				});
			});


			var 
				adjustValue = opts.columnValue,
				degreeLength,
				step,
				cube = 0;

			while(adjustValue > 10){
				adjustValue = adjustValue/10;
				cube++;
			}
			for(var i = 8;i > 4;i--){
				if(adjustValue * 10 % i === 0){
					step = i;
					break;
				}
			}
			degreeLength = 1000 / step;
			adjustValue = Math.ceil(adjustValue) * Math.pow(10,cube);

			ctx.save();
			ctx.translate(130,300);
			ctx.beginPath();
			ctx.moveTo(0,   0);
			ctx.lineTo(1000,0);
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#fff';
			ctx.textAlign = "center";
			ctx.font = '100 20px/1 arial';
			for(var i = 0;i <= step;i++){
				ctx.moveTo(i * degreeLength,20);
				ctx.lineTo(i * degreeLength,-220);
				ctx.fillText(i * adjustValue / step,i * degreeLength,20)
			}
			ctx.closePath();
			ctx.strokeStyle = '#999';
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.restore();

			ctx.save();
			ctx.translate(120,90);
			ctx.lineWidth = 2;
			ctx.font = '100 20px/1 arial';
			ctx.fillStyle = '#fff';
			ctx.textAlign = "end";
			ctx.textBaseline = 'middle';
			for(var i = 0;i < 10;i++){
				ctx.fillText(opts.rankingList[i]['type'], 0, 200 - 20 * i);
			}
			ctx.restore();

			ctx.save();
			ctx.translate(130,105);
			ctx.fillStyle = 'rgba(195,114,27,0.8)';
			for(var i = 0;i < 10;i++){
				ctx.fillRect(0,i * 20,1000 * opts.rankingList[i]['length'] / adjustValue,15);
			}
			ctx.restore();
		},
		drawPieChart:    function(ctx,opts){
			ctx.clearRect(0,0,1180,420);

			var 
				startAnkle = -Math.PI / 2,
				endAnkle;

			cTools.drawTitle(ctx, opts.title);

			ctx.save();

			opts.items.forEach(function(item,index){
				cTools.drawStatement(ctx,{
					x:920,
					y:130 + index * 50,
					strokeStyle: item.strokeStyle,
					fillStyle: item.fillStyle,
					text: item.text
				});

				ctx.beginPath();

				endAnkle = startAnkle + Math.PI * item.percent / 50;
				ctx.arc(
					opts.lineChartOriginX,
					opts.lineChartOriginY,
					125,
					startAnkle,
					endAnkle,
					false
				);
				ctx.lineTo(opts.lineChartOriginX,opts.lineChartOriginY);
				ctx.fillStyle = item.fillStyle;
				ctx.fill();
				startAnkle = endAnkle;
			});
			ctx.closePath();

			ctx.restore();
		},
		drawLineChart: function(ctx,opts){
			ctx.save();
			ctx.translate(opts.x,opts.y);
			ctx.beginPath();
			ctx.moveTo(opts.path[0][0],-opts.path[0][1]);
			opts.path.shift();
			opts.path.forEach(function(point,index){
				ctx.lineTo(point[0],-point[1]);
			});
			if(void 0 !== opts.fillStyle){
				ctx.lineTo(900,0);
				ctx.lineTo(0,0);
				ctx.closePath();
				ctx.fillStyle = opts.fillStyle;
				ctx.fill();
			}
			ctx.lineWidth = opts.lineWidth || 2;
			ctx.strokeStyle = opts.strokeStyle;
			ctx.stroke();
			ctx.restore();
		},
		drawTitle: function(ctx,text){
			ctx.save();
			ctx.font = '100 30px/1 arial';
			ctx.lineWidth = 2;
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#fff';
			ctx.fillText(text,30,30);
			ctx.restore();
		},
		drawMathOrdinate: function(ctx,maxValue,row){
			var 
				valueDiff = maxValue / row,
				lineHeight = 200 / row;

			ctx.save();
			ctx.lineWidth = 2;
			ctx.fillStyle = '#fff';
			ctx.font = '100 20px/1 arial';
			ctx.textAlign = "end";
			ctx.textBaseline = 'middle';
			ctx.translate(120,100);
			for(var i = 0;i <= row;i++){
				ctx.fillText(valueDiff * i, 0, 200 - lineHeight * i);
			}
			ctx.restore();

			ctx.save();
			ctx.translate(130,100);
			ctx.beginPath();

			for(var j = 0;j <= row;j++){
				ctx.moveTo(0,   j*lineHeight);
				ctx.lineTo(1000,j*lineHeight);
			}
			ctx.moveTo(0,200);
			ctx.lineTo(0,0);
			ctx.closePath();

			ctx.strokeStyle = '#999';
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.restore();
		},
		drawTimeAbscissa: function(ctx,opts){

			/**
			 *  时间长度应该调整为 粒度x2 的整数倍
			 *  以保证刻度数量为偶数
			 *  最小10min 最大90day
			 *	遇到刻度数量为以下数字时，按给定方式调整
			 *  22 -> 20 : (10x 2) + 1 + 1
			 *  26 -> 24 : (6 x 4) + 1 + 1
			 *  34 -> 30 : (6 x 5) + 1 + 1
			 *  38 -> 35 : (7 x 5) + 1 + 1
			 *  46 -> 42 : (7 x 6) + 1 + 1
			 *  58 -> 54 : (9 x 6) + 1 + 1
			 *  其余情况，按刻度标数12～5，计算绘制刻度标数的间隔数
			 */ 

			var 
				count = opts.count,
				degreeLength = opts.degreeLength,
				_date,
				time,
				day,
				rows = 1;

			ctx.save();
			ctx.translate(opts.x, opts.y);
			ctx.beginPath();

			ctx.lineWidth = 1;
			ctx.strokeStyle = '#999';
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#fff';
			ctx.textAlign = "end";
			ctx.font = '100 20px/1 arial';

			if(opts.endTime - opts.startTime > 86400000)rows = 2;

			for(var i = 0;i <= count;i++){
				ctx.moveTo(i * degreeLength,0);
				if(i % opts.step === 0){
					_date = new Date(opts.startTime - -opts.granularity * i * 60000).toString()
					time  = _date.substr(16,5);
					day   = _date.substr(4,6)
					ctx.lineTo(i * degreeLength,20);
					ctx.fillText(time,i * degreeLength + 25,20 * rows);
					if(rows > 1)ctx.fillText(day,i * degreeLength + 28,20);
				}else{
					ctx.lineTo(i * degreeLength,10);
				}
			};
			if(true === opts.compensate){
				ctx.fillText(
					opts.endTime.toString().substr(16,5),
					930,20
				);
			};

			ctx.closePath();
			ctx.stroke();
			ctx.restore();
		},
		drawStatement: function(ctx,opts){
			ctx.save();

			ctx.translate(opts.x,opts.y);
			ctx.fillStyle = opts.fillStyle;
			ctx.fillRect(0,1,18,18);
			if(void 0 !== opts.strokeStyle){
				ctx.strokeStyle = '#fff';
				ctx.strokeRect(0,1,18,18);
			}
			ctx.fillStyle = '#fff';
			ctx.font = '100 20px/1 arial';
			ctx.textBaseline = 'top';
			ctx.fillText(opts.text,30,0);

			ctx.restore();
		},
		pointFilter: function(opts){

			var 
				opts = opts,
				step,
				count = (opts.endTime - opts.startTime) / (opts.granularity * 60000),
				degreeLength = 900 / count;

			opts.compensate = false;

			!function(){
				switch(count){
					case 26:
						step = 3;
						break;
					case 34:
						step = 5;
						break;
					case 38:
						step = 5;
						break;
					case 46:
						step = 6;
						break;
					case 58:
						step = 6;
						break;
				}
				if(step > 0)return opts.compensate = true;
				for(var i = 12;i > 4;i--){
					if(count % i === 0){
						step = count / i;
						break;
					}
				}
			}();

			opts.step = step;
			opts.count = count;
			opts.degreeLength = degreeLength;

			opts.path = opts.lineChartPointArray.map(function(item,i){
				return [i * degreeLength,item];
			});

			return opts;
		},
		granularityCalculator: function(){
			var 
				timeLength,startTimePanel,endTimePanel,
				initial = false;
			return function(){
				if(false === initial){
					timeLength = mainPanel.query('combobox')[2];
					var splitbutton = mainPanel.query('splitbutton');
					startTimePanel = splitbutton[0];
					endTimePanel   = splitbutton[splitbutton.length > 2 ? 2 : 1];
					initial = true;
				}
				var 
					resultObj = {},
					granularity,
					st = new Date(startTimePanel.text), 
					et = new Date(endTimePanel.text), 
					_length = parseInt(timeLength.value);

				if(_length === 0){
					_length = (et - st) / 60000;
				}else{
					et = new Date().getTime();
				}

				if(isNaN(_length))return resultObj;

				_length = _length > 43200 ? 43200 : _length < 10 ? 10 : _length;

				!function(a,b){
					[a,b,a].forEach(function(item){
						item();
					});
				}(
					function(){
						switch(true){
							case _length < 60:
								granularity = 1;
								break;
							case _length < 300:
								granularity = 5;
								break;
							case _length < 900:
								granularity = 15;
								break;
							case _length < 1800:
								granularity = 30;
								break;
							case _length < 3600:
								granularity = 60;
								break;
							case _length < 14400:
								granularity = 240;
								break;
							default:
								granularity = 1440;
								break;
						}
					},
					function(){
						_length = Math.ceil(_length /(2 * granularity)) * granularity * 2;
					}
				);

				et = new Date(Math.floor(et / (granularity*60000)) * (granularity*60000))
				st = new Date(et - _length * 60000);

				resultObj = {
					granularity: granularity,
					startTime:   st,
					endTime:     et,
					length:      _length,
				};

				return resultObj;
			}
		}()
	};

	var reload = function(){
		var 
			initial = false,
			canvas1, ctx1,
			canvas2, ctx2,
			canvas3, ctx3,
			canvas4, ctx4,
			canvas5, ctx5,
			canvas6, ctx6;

		return function(params){
			if(false === initial){
				canvas1 = document.getElementById('vz_canvas1');ctx1 = canvas1.getContext('2d');
				canvas2 = document.getElementById('vz_canvas2');ctx2 = canvas2.getContext('2d');
				canvas3 = document.getElementById('vz_canvas3');ctx3 = canvas3.getContext('2d');
				canvas4 = document.getElementById('vz_canvas4');ctx4 = canvas4.getContext('2d');
				canvas5 = document.getElementById('vz_canvas5');ctx5 = canvas5.getContext('2d');
				canvas6 = document.getElementById('vz_canvas6');ctx6 = canvas6.getContext('2d');
				initial = true;
			}
			var params = params;

			vz2.ajax({
				url: 'applicationSceneMode',
				params: params,
				success: function(res,eOpts){
					var 
						transactionCount = res['transactionCount'],
						transactionRate  = res['transactionRate'],
						responseTime     = res['responseTime'],
						responseRate     = res['responseRate'],
						ranking          = res['ranking'],
						responseCode     = res['responseCode'],
						maxValue = Math.max.apply(Math,transactionCount.pointArray);

					!function(){
						var i = 0;
						while(maxValue > 10){
							maxValue /= 10;
							i++;
						};
						maxValue = Math.ceil(maxValue) * Math.pow(10,i);
						if(maxValue < 30)maxValue = 30;
					}();

					cTools.drawCoordinate(ctx1, {
						title: '交易量/笔',
						rows: 5,
						rowValue: maxValue,
						startTime: params.startTime,
						endTime: params.endTime,
						timeDistance: params.granularity,
						lineChartOriginX: 180,
						lineChartOriginY: 300,
						lineChartPointArray: transactionCount.pointArray.slice(0,(params.length/params.granularity)+1),
						lineChartStrokeStyle: '#fff',
						lineChartWidth: 2,
						lineChartFillStyle: 'rgba(102,180,35,0.8)',
						statement: [{
							x:550,
							y:370,
							strokeStyle: '#fff',
							fillStyle: '#62992F',
							text: '交易量'
						}],
					});

					cTools.drawCoordinate(ctx2, {
						title: '交易成功率',
						rows: 5,
						rowValue: 100,
						startTime: params.startTime,
						endTime: params.endTime,
						timeDistance: params.granularity,
						lineChartOriginX: 180,
						lineChartOriginY: 300,
						lineChartPointArray: transactionRate.pointArray.slice(0,(params.length/params.granularity)+1),
						lineChartStrokeStyle: '#f00',
						lineChartWidth: 2,
						statement: [{
							x:550,
							y:370,
							fillStyle: '#f00',
							text: '交易成功率'
						}],
					});

					cTools.drawCoordinate(ctx3, {
						title: '响应时间/ms',
						rows: 6,
						rowValue: 300,
						startTime: params.startTime,
						endTime: params.endTime,
						timeDistance: params.granularity,
						lineChartOriginX: 180,
						lineChartOriginY: 300,
						lineChartPointArray: responseTime.pointArray.slice(0,(params.length/params.granularity)+1),
						lineChartStrokeStyle: '#fff',
						lineChartWidth: 2,
						lineChartFillStyle: 'rgba(195,114,27,0.8)',
						statement: [{
							x:550,
							y:370,
							strokeStyle: '#fff',
							fillStyle: 'rgb(195,114,27)',
							text: '响应时间'
						}],
					});

					cTools.drawBarGraph(ctx4, {
						title: '响应率%',
						rows: 5,
						rowValue: 100,
						startTime: params.startTime,
						endTime: params.endTime,
						timeDistance: params.granularity,
						lineChartOriginX: 180,
						lineChartOriginY: 300,
						lineChartPointArray: responseRate.pointArray.slice(0,(params.length/params.granularity)+1),
						lineChartStrokeStyle: '#fff',
						lineChartWidth: 2,
						lineChartFillStyle: 'rgba(195,114,27,0.8)',
						statement: [{
							x:450,
							y:370,
							fillStyle: 'rgb(219,0,97)',
							text: '无响应比率'
						},{
							x:600,
							y:370,
							fillStyle: '#fff',
							text: '响应率'
						}],
					});

					cTools.drawRankingLisk(ctx5, {
						title: '各交易类型响应时间排名',
						rows: 6,
						columnValue: 300,
						startTime: new Date(2016,7,24,9,0,0),
						endTime: new Date(2016,7,24,9,10,0),
						timeDistance: 1,
						lineChartOriginX: 180,
						lineChartOriginY: 300,
						rankingList: ranking.rankingList,
						lineChartStrokeStyle: '#fff',
						lineChartWidth: 2,
						lineChartFillStyle: 'rgba(195,114,27,0.8)',
						statement: [{
							x:550,
							y:370,
							strokeStyle: '#fff',
							fillStyle: 'rgb(195,114,27)',
							text: '响应时间/ms'
						}],
					});

					cTools.drawPieChart(ctx6, {
						title: '返回码分布',
						lineChartOriginX: 590,
						lineChartOriginY: 210,
						items: responseCode.items,
					});
					
				},
				failure: function(){

				}
			})
		}
	}();

	return mainPanel;
});
///<jscompress sourcefile="vz_applicationSnapShot.js" />
/*
 * 应用层快照
 *
 */ 

vz2.extend('applicationSnapShot',function(){
	'use strict';
	
	var 
		transactionTypeStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '全部',     value: '0'},
				{name: '交易类型1', value: '1'},
				{name: '交易类型2', value: '2'},
				{name: '交易类型3', value: '3'},
				{name: '交易类型4', value: '4'},
				{name: '交易类型5', value: '5'}
			]
		}),
		cityStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '广州', value: '1'},
				{name: '东莞', value: '2'},
				{name: '珠海', value: '3'},
				{name: '深圳', value: '4'},
				{name: '佛山', value: '5'}
			]
		}),
		transactionChannelStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '全部', value: '0'},
				{name: '交易渠道1', value: '1'},
				{name: '交易渠道2', value: '2'},
				{name: '交易渠道3', value: '3'},
				{name: '交易渠道4', value: '4'},
				{name: '交易渠道5', value: '5'}
			]
		}),
		periodStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '近10分钟',value: '10'},
				{name: '近1小时', value: '60'},
				{name: '近1天',   value: '1440'},
				{name: '近30天',  value: '43200'},
				{name: '自定义',  value: '0'}
			]
		}),

		typeRankingStore = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'type',       type: 'string'},
				{name: 'responTime', type: 'float' }
			]
		}),
		codeRankingStore = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'code',    type: 'string'},
				{name: 'count',   type: 'int'   },
				{name: 'percent', type: 'float' }
			]
		});

	var mainPanel = Ext.create('Ext.panel.Panel',{
		width: '100%',
		id: 'vz_appSnapShot',
		defaults: {
			border: 'none'
		},
		listeners: {
			afterrender: function(){
				reload();
			}
		},
		tbar: {
			defaults: {
				displayField: 'name',
				valueField: 'value',
				queryMode: 'local',
				labelWidth: '1px',
				editable: false,
			},
			items: [
				{
					fieldLabel: '交易类型',
					store: transactionTypeStore,
					value: '0',
					xtype: 'combobox',
				},{
					fieldLabel: '地市',
					labelWidth: 30,
					store: cityStore,
					value: '1',
					width: 150,
					xtype: 'combobox',
				},{
					fieldLabel: '子渠道',
					store: transactionChannelStore,
					value: '0',
					xtype: 'combobox',
				},{
					fieldLabel: '时间',
					margin: '0 20 0 0',
					width: 150,
					labelWidth: 30,
					store: periodStore,
					value: '60',
					xtype: 'combobox',
					listeners: {
						select: function(){
							var initial = false,
								cmp1,cmp2,cmp3;
							return function(combobox,e){
								if(false === initial){
									var itemList = mainPanel.query('splitbutton,label');
									cmp1 = itemList[0];
									cmp2 = itemList[1];
									cmp3 = itemList[2];
									initial = true;
								};

								[cmp1,cmp2,cmp3].forEach(function(item){
									combobox.lastMutatedValue === '自定义'?item.show():item.hide();
								});
							};
						}()
					}
				},
				vz2.createDateTimePicker(null,0.125,true),
				{
					text: '—',
					xtype:'label',
					style: {
						lineHeight: '24px',
						textAlign: 'center',
					},
					columnWidth: 1/46,
					hidden: true,
				},
				vz2.createDateTimePicker(null,0.125,true),
				{
					xtype: 'button',
					cls: 'vz_search_btn',
					columnWidth: 1/25,
					margin: '0 0 0 20',
					handler: function(){
						var 
							initial = false,
							customTime = false,

							params = {},
							inputItemList;

						return function(){
							if(false === initial){
								inputItemList  = mainPanel.query('combobox,splitbutton');

								initial = true;
							}
							params = {
								type:    inputItemList[0].lastMutatedValue,
								city:    inputItemList[1].lastMutatedValue,
								channel: inputItemList[2].lastMutatedValue,
								time:    inputItemList[3].lastMutatedValue,
							}
							if(true === customTime || inputItemList[6].text !== '选择日期时间' && inputItemList[7].text !== '选择日期时间'){

								params.startTime = inputItemList[6].text;
								params.endTime   = inputItemList[7].text;
								customTime = true;
							}
							console.log(params);

							reload(params);
						}
					}()
				}
			]
		},
		items: [{
			cls: 'vz_appSnapShot_count',
			layout: 'column',
			margin: '20 0 20 0',
			defaults: {
				columnWidth: 1/4,
				xtype: 'panel',
				height: 140,
				style: {
					fontSize: '30px'
				},
			},
			items: [
				{
					title: "交易量(笔)",
					margin: '0 20 0 0',
					items: {
						xtype: 'box',
						html: '11109',
						style: {
							fontSize: '70px',
							textAlign: 'center',
							lineHeight: '100px'
						},

					}
				},{
					title: "成功率(%)",
					margin: '0 10 0 0',
					items: {
						xtype: 'box',
						html: '98.86',
						style: {
							fontSize: '70px',
							textAlign: 'center',
							lineHeight: '100px'
						},

					}
				},{
					title: "响应时间(ms)",
					margin: '0 0 0 10',
					items: {
						xtype: 'box',
						html: '58.755',
						style: {
							fontSize: '70px',
							textAlign: 'center',
							lineHeight: '100px'
						},

					}
				},{
					title: "响应率(%)",
					margin: '0 0 0 20',
					items: {
						xtype: 'box',
						html: '100',
						style: {
							fontSize: '70px',
							textAlign: 'center',
							lineHeight: '100px'
						},

					}
				}
			]
		}, {
			layout: 'column',
			items: [{
				columnWidth: 1 / 2,
				cls: 'vz_appSnapShot_Ranking',
				height: 400,
				margin: '0 10 0 0',
				store: typeRankingStore,
				title: '交易类型排名',
				xtype: 'grid',
				columns: {
					border: 'none',
					defaults: {
						align: 'left',
						border: 'none',
						draggable: false,
						menuDisabled: true,
						padding: '5 0 5 0',
						sortable: false,
					},
					items: [
						{
							dataIndex: 'type',
							text: "响应类型",
							width: 300
						}, {
							dataIndex: 'responTime',
							text: "交易时长(ms)",
							width: 100
						}
					]
				},
				forceFit: true,
			}, {
				columnWidth: 1 / 2,
				cls: 'vz_appSnapShot_Ranking',
				height: 400,
				margin: '0 0 0 10',
				store: codeRankingStore,
				title: '返回码排名',
				xtype: 'grid',
				columns: {
					border: 'none',
					defaults: {
						align: 'left',
						border: 'none',
						draggable: false,
						menuDisabled: true,
						padding: '5 0 5 0',
						sortable: false,
					},
					items: [
						{
							dataIndex: 'code',
							text: "返回码"
						}, {
							dataIndex: 'count',
							text: "交易量(笔)"
						}, {
							dataIndex: 'percent',
							text: "百分比(%)"
						}
					]
				},
				forceFit: true,
			}]
		}]
	});

	var 
		reload = function(){
			var 
				initial = false,
				outputItemList = [];

			return function(params){
				if(false === initial){
					var o = mainPanel.items.get(0).query('box');
					outputItemList.push(
						document.getElementById(o[3].id),
						document.getElementById(o[7].id),
						document.getElementById(o[11].id),
						document.getElementById(o[15].id)
					);
					initial = true;
				}

				vz2.ajax({
					url: 'applicationSnapShot',
					params: params,
					success: function(res,eOpts){
						outputItemList[0].innerHTML = res.total.transactionCount;
						outputItemList[1].innerHTML = res.total.successRate;
						outputItemList[2].innerHTML = res.total.responseTime;
						outputItemList[3].innerHTML = res.total.responseRate;

						typeRankingStore.loadData(res.typeRanking);
						codeRankingStore.loadData(res.codeRanking);
					},
					failure: function(){

					}
				});

			}
		}();

	return mainPanel;
});
///<jscompress sourcefile="vz_applicationStatistics.js" />
/*
 * 多维统计
 *
 */ 

vz2.extend('applicationStatistics',function(){
	'use strict';
	/* define pointer & storage */ 

	var 
		selector = 0,
		statLibrary;

	/* create Ext storage */ 

	var 

		periodStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '自定义',  value: '0'},
				{name: '近10分钟',value: '10'},
				{name: '近1小时', value: '60'},
				{name: '近1天',   value: '1440'},
				{name: '近1月',   value: '43200'},
			]
		}),

		multiStatisticsStore = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'transactionType', type: 'string'},
				{name: 'transactionCount',type: 'int'   },
				{name: 'successRate',     type: 'float' },
				{name: 'responseTime',    type: 'float' },
				{name: 'responseRate',    type: 'float' }
			]
		});

	/* define panel */ 

	var 

		mainPanel = Ext.create('Ext.panel.Panel',{
			width: '100%',
			id: 'vz_multiStatistics',
			defaults: {
				border: 'none'
			},
			listeners: {
				afterrender: function(){
					reload();
				}
			},
			tbar: {
				items: [
					{
						displayField: "name",
						editable: false,
						fieldLabel: '时间',
						labelAlign: 'left',
						labelWidth: 50,
						margin: '0 20 0 0',
						queryMode: "local",
						store: periodStore,
						valueField: "value",
						value: '60',
						xtype: 'combobox',
						listeners: {
							select: function(){
								var initial = false,
									cmp1,cmp2,cmp3;
								return function(combobox,e){
									if(false === initial){
										var itemList = this.ownerCt.items;
										cmp1 = itemList.get(1);
										cmp2 = itemList.get(2);
										cmp3 = itemList.get(3);
										initial = true;
									};

									[cmp1,cmp2,cmp3].forEach(function(item){
										combobox.value === '0'?item.show():item.hide();
									});
								};
							}()
						}
					},
					vz2.createDateTimePicker(150,null,true),
					{
						text: '—',
						xtype:'label',
						style: {
							lineHeight: '24px',
							textAlign: 'center',
						},
						columnWidth: 1/46,
						hidden: true,
					},
					vz2.createDateTimePicker(150,null,true),
					{
						cls: 'vz_search_btn',
						columnWidth: 1/25,
						margin: '0 0 0 20',
						xtype: 'button',
						handler: function(){
							var 
								initial = false,
								itemList = [];

							return function(){
								if(false === initial){
									var obj1 = mainPanel.query('combobox'),
										obj2 = mainPanel.query('splitbutton');
									itemList.push(obj1[0],obj2[0],obj2[1]);
									initial = true;
								};
								
								var params = {time: itemList[0].value};
								if(params.time === '0'){
									params.startTime = itemList[1].text;
									params.endTime   = itemList[2].text;
								};
								reload(params);
							}
						}()
					}
				]
			},
			items: [{
				xtype: 'radiogroup',
				layout: 'column',
				margin: '10 0',
				defaults: {
					boxLabelAlign: 'after',
					labelWidth: 80,
					padding: '0 20 0 0',
					xtype: 'radio',
					listeners: {
						dirtychange: function(){
							if(arguments[0].lastValue === false)return;
							selector = arguments[0].inputValue;
							void 0 !== statLibrary && multiStatisticsStore.loadData(statLibrary[selector]);
						}
					}
				},
				items: [
					{inputValue: 0,boxLabel: '交易类型',checked: true},
					{inputValue: 1,boxLabel: '地市'},
					{inputValue: 2,boxLabel: '子渠道'},
					{inputValue: 3,boxLabel: '业务状态'},
					{inputValue: 4,boxLabel: '交易返回码'},
					{inputValue: 5,boxLabel: '服务器IP'},
					{inputValue: 6,boxLabel: '客户端IP'}
				]
			},{
				store: multiStatisticsStore,
				padding: '20 40',
				height: 400,
				xtype: 'grid',
				columns: {
					border: 'none',
					defaults: {
						menuDisabled: true,
						draggable: false,
						sortable: true,
						align: 'center',
						width: 160,
					},
					items: [
						{
							sortable: false,
							text: "序号",
							width: 80,
							xtype : 'rownumberer',
						}, {
							align: 'left',
							dataIndex: 'transactionType',
							forceFit: true,
							sortable: false,
							text: "交易类型",
							width: 400,
						}, {
							dataIndex: 'transactionCount',
							text: "交易笔数",
						}, {
							dataIndex: 'successRate',
							text: "成功率%",
						}, {
							dataIndex: 'responseTime',
							text: "响应时间ms",
						}, {
							dataIndex: 'responseRate',
							text: "响应率%",
						}
					]
				},
				forceFit : true, 
			}]
		});

	var reload = function(params){
		vz2.ajax({
			url: 'applicationStatistics',
			params: params,
			success: function(res,eOpts){
				statLibrary = res;
				multiStatisticsStore.loadData(statLibrary[selector]);
			},
			failure: function(result){

			}
		});
	};

	return mainPanel;
});
///<jscompress sourcefile="vz_transactionTracking.js" />
/*
 * 交易追踪
 *
 */ 

vz2.extend('transactionTracking',function(){
	'use strict';

	/* create option for combobox */ 

	var 

		clientIPStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',         value: '0'},
				{name: '10.252.17.203',value: '10.252.17.203'},
				{name: '10.252.17.204',value: '10.252.17.204'},
				{name: '10.252.17.205',value: '10.252.17.205'},
				{name: '10.252.17.206',value: '10.252.17.206'},
				{name: '10.252.17.207',value: '10.252.17.207'},
			]
		}),
		serverIPStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',         value: '0'},
				{name: '10.252.18.203',value: '10.252.18.203'},
				{name: '10.252.18.204',value: '10.252.18.204'},
				{name: '10.252.18.205',value: '10.252.18.205'},
				{name: '10.252.18.206',value: '10.252.18.206'},
				{name: '10.252.18.207',value: '10.252.18.207'},
			]
		}),
		transactionTypeStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',           value: '0'},
				{name: '检查客户资源',    value: '1'},
				{name: '支付',           value: '2'},
				{name: '返回查询CUST信息',value: '3'},
				{name: '安装监测SIN密码', value: '4'},
				{name: '提交',           value: '5'},
			]
		}),
		statementStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',  value: '0'},
				{name: '排队中',value: '1'},
				{name: '处理中',value: '2'},
				{name: '成功',  value: '3'},
				{name: '失败',  value: '4'},
			]
		}),
		cityStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '广州',value: '广州'},
				{name: '东莞',value: '东莞'},
				{name: '深圳',value: '深圳'},
				{name: '珠海',value: '珠海'},
				{name: '佛山',value: '佛山'},
			]
		}),
		channelStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{value:"0", name: '全部',     },
				{value:"1", name: '广州越秀润粤服营厅',     },
				{value:"2", name: '广州越秀东湖西路服营厅',  },
				{value:"3", name: '广州中山大道西棠下营业厅',},
				{value:"4", name: '广州九佛镇营业厅',       },
				{value:"5", name: '广州良田镇营业厅',       },
			]
		}),
		codeStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',value: '0'},
				{name: '100',value: '100'},
				{name: '101',value: '101'},
				{name: '200',value: '200'},
				{name: '201',value: '201'},
				{name: '202',value: '202'},
			]
		}),
		periodStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '近10分钟',value: '10'},
				{name: '近1小时', value: '60'},
				{name: '近1天',   value: '1440'},
				{name: '近1月',   value: '43200'},
				{name: '自定义',  value: '0'},
			]
		}),
		/* grid panel store */ 
		resultStore = Ext.create('Ext.data.Store',{
			fields: [
				{name: 'type',     type: 'string'},
				{name: 'channel',  type: 'string'},
				{name: 'city',     type: 'string'},
				{name: 'phone',    type: 'int'},
				{name: 'reqTime',  type: 'string'},
				{name: 'resTime',  type: 'string'},
				{name: 'clientIP', type: 'string'},
				{name: 'serverIP', type: 'string'},
				{name: 'code',     type: 'string'},
				{name: 'state',    type: 'string'},
			]
		});

	/* define panel */ 

	var 

		mainPanel = Ext.create('Ext.panel.Panel',{
			id: 'vz_transactionTracking',
			listeners: {
				afterrender: function(){
					reload();
				}
			}
		}),

		searchPanel = Ext.create('Ext.form.Panel',{
			layout: 'form',
			width: 1200,
			items: [
				{
					layout: 'column',
					defaults: {
						columnWidth: 0.23,
						displayField: "name",
						editable: false,
						labelWidth: 70,
						labelAlign: 'right',
						queryMode: "local",
						valueField: "value",
						xtype: 'combobox',
					},
					items: [
						{
							columnWidth: 1/16,
							style: "line-height: 24px;text-align: right;padding-right: 5px;",
							text: '响应时长:',
							xtype: 'label',
						}, {
							columnWidth: 1/16,
							editable: true,
							xtype: 'textfield',
						}, {
							columnWidth: 1/46,
							style: "line-height: 24px;text-align: center;",
							text: '—',
							xtype: 'label',
						}, {
							columnWidth: 1/16,
							editable: true,
							xtype: 'textfield',
						}, {
							columnWidth: 1/46,
							style: "line-height: 24px;text-align: center;",
							text: 'ms',
							xtype: 'label',
						}, {
							fieldLabel: '客户端id',
							store: clientIPStore,
							value: '0',
						}, {
							fieldLabel: '服务端id',
							store: serverIPStore,
							value: '0',
						}, {
							fieldLabel: '交易类型',
							store: transactionTypeStore,
							value: '0',
						}
					]
				}, {
					layout: 'column',
					defaults: {
						columnWidth: 0.23,
						displayField: "name",
						editable: false,
						labelWidth: 70,
						labelAlign: 'right',
						queryMode: "local",
						valueField: "value",
						xtype: 'combobox',
						allowBlank: false,
						blankText: '该字段不能为空',
						msgTarget: 'under',
					},
					items: [
						{store: statementStore,fieldLabel: '业务状态',value: '0'},
						{store: cityStore,     fieldLabel: '地市',value: '深圳'},
						{store: channelStore,  fieldLabel: '子渠道',value: '0'},
						{store: codeStore,     fieldLabel: '返回码',value: '0'},
					]
				}, {
					layout: 'column',
					defaults: {
						columnWidth: 0.23,
						labelWidth: 70,
						labelAlign: 'right',
						xtype: 'combobox',
					},
					items: [
						{fieldLabel: '手机号码',xtype: 'textfield'}, 
						{
							fieldLabel: '时间',
							columnWidth: 1/6,
							margin: '0 20 0 0',
							store: periodStore,
							editable: false,
							value: '60',
							displayField: "name",
							valueField: "value",
							queryMode: "local",
							listeners: {
								select: function(){
									var initial = false,
										cmp1,cmp2,cmp3;
									return function(combobox,e){
										if(false === initial){
											var itemList = this.ownerCt.items;
											cmp1 = itemList.get(2);
											cmp2 = itemList.get(3);
											cmp3 = itemList.get(4);
											initial = true;
										};

										[cmp1,cmp2,cmp3].forEach(function(item){
											combobox.value === '0' ? item.show():item.hide();
										});
									};
								}()
							}
						},
						vz2.createDateTimePicker(null,0.125,true),
						{
							columnWidth: 1/46,
							text: '—',
							style: "line-height: 24px;text-align: center;",
							hidden: true,
							xtype:'label',
						},
						vz2.createDateTimePicker(null,0.125,true),
						{
							xtype: 'button',
							cls: 'vz_search_btn',
							columnWidth: 1/25,
							margin: '0 0 0 20',
							handler: function(){
								var 
									initial = false,
									itemList = [];

								return function(){
									if(false === initial){
										var obj1 = searchPanel.query('textfield,combobox'),
											obj2 = searchPanel.query('splitbutton');
										itemList.push(obj1[0],obj1[1],obj1[2],obj1[3],obj1[4],obj1[5],obj1[6],obj1[7],obj1[8],obj1[9],obj1[10]);
										itemList.push(obj2[0],obj2[obj2.length>2?2:1]);
										initial = true;
									}
									var params = {
										minResponseTime: itemList[0].lastValue,
										maxResponseTime: itemList[1].lastValue,
										clientIP:        itemList[2].lastMutatedValue,
										serverIP:        itemList[3].lastMutatedValue,
										type:            itemList[4].lastMutatedValue,
										statement:       itemList[5].lastMutatedValue,
										city:            itemList[6].lastMutatedValue,
										channel:         itemList[7].lastMutatedValue,
										code:            itemList[8].lastMutatedValue,
										phone:           itemList[9].lastValue,
										time:            itemList[10].lastMutatedValue,
										startTime:       itemList[11].text,
										endTime:         itemList[12].text
									}
									// for(var key in params){
									// 	params[key] === ''
									// }
									reload(params);
								}
							}()
						}
					]
				}, {
					html: '匹配记录0笔',
					margin: '20 0 0 0',
					style: 'font-size: 20px;display: inline-block',
					xtype: 'label',
				}
			]
		}),

		resultPanel = Ext.create('Ext.grid.Panel',{
			cls: 'vz_gridPanel',
			forceFit: true,
			height: 380,
			padding: '0 20',
			store: resultStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: true,
					align: 'center',
				},
				items: [
					{width: 50, xtype : 'rownumberer',text: "序号",sortable: false,}, 
					{width: 140,dataIndex: 'type',    text: "交易类型",align: 'left',sortable: false,}, 
					{width: 70, dataIndex: 'city',    text: "地市",}, 
					{width: 200,dataIndex: 'channel', text: "子渠道",  align: 'left',}, 
					{width: 100,dataIndex: 'phone',   text: "手机号码",}, 
					{width: 125,dataIndex: 'reqTime', text: "请求时间",}, 
					{width: 125,dataIndex: 'resTime', text: "响应时间",}, 
					{width: 105,dataIndex: 'clientIP',text: "客户端IP",}, 
					{width: 105,dataIndex: 'serverIP',text: "服务端IP",}, 
					{width: 70, dataIndex: 'code',    text: "返回码",}, 
					{width: 75, dataIndex: 'state',   text: "业务状态",}
				]
			}
		});

	mainPanel.add([searchPanel,resultPanel]);

	var reload = function(params){
		vz2.ajax({
			url: 'transactionTracking',
			params: params,
			success: function(res,eOpts){
				resultStore.loadData(res);
				searchPanel.query('label')[4].setText('匹配记录'+res.length+'笔');
			},
			failure: function(){

			}
		});
	};

	return mainPanel;
});
///<jscompress sourcefile="vz_warningCenter.js" />
vz2.extend('warningCenter',function(){
	'use strict';

	var 
		contentStore = [],

		warningListStore = Ext.create('Ext.data.Store',{
			fields: [
				'province','channel','type',
				'warningType','level','threshold',
				'dispatchThreshold','state','lasting',
				'operation','data'
			]
		});

	/* define panel */ 

	var 
		mainPanel = Ext.create('Ext.panel.Panel',{
			border: 0,
			id: 'vz_warningCenter',
		}),

		filterPanel = Ext.create('Ext.panel.Panel',{
			border: 0,
			items: [
				{
					width: 200,
					style: "margin: 0 auto;",
					layout: 'column',
					defaults: {columnWidth: 0.5},
					items: [
						{xtype: 'label',    text: '告警中心',style: 'color: #fff;line-height: 24px;font-size: 24px;'}, 
						{xtype: 'combobox', editable: false,value: '甘肃省'}
					]
				}, {
					border: 0,
					style: {
						borderTop: '1px #ccc solid',
						marginTop: '10px',
						paddingTop: '15px',
					},
					items: [
						{
							border: 0,
							layout: 'column',
							defaults: {
								displayField: 'name',
								editable: false,
								labelWidth: 60,
								style: "margin-right: 15px;",
								valueField: 'value',
								width: 160,
								xtype: 'combobox',
							},
							margin: '0 0 15 0',
							items: [
								{fieldLabel: '交易渠道',},
								{fieldLabel: '交易类型',},
								{fieldLabel: '告警类型',},
							]
						},{
							border: 0,
							layout: 'column',
							defaults: {
								displayField: 'name',
								editable: false,
								labelWidth: 60,
								style: "margin-right: 15px;",
								valueField: 'value',
								width: 160,
								xtype: 'combobox',
							},
							margin: '0 0 10 0',
							padding: '0 0 10 0',
							style: "border-bottom: 1px #ccc solid;",
							items: [
								{fieldLabel: '告警级别'},
								{fieldLabel: '告警状态'},
								{
									xtype: 'label',
									text: '时间',
									width: 35,
									style: "color: #ccc;line-height: 24px",
								},
								vz2.createDateTimePicker(140,null,false,{
									background: 'transparent',
									border: '1px #fff solid'
								}),
								{
									xtype: 'label',
									text: '—',
									width: 15,
									style: {
										color: '#ccc',
										lineHeight: '24px',
										margin: '0 5px',
									},
								},
								vz2.createDateTimePicker(140,null,false,{
									background: 'transparent',
									border: '1px #fff solid'
								}),
								{
									xtype: 'button',
									width: 29,
									cls: 'vz_search_btn',
									style: {
										borderRadius: '5px',
										backgroundColor: 'rgba(0,0,0,0.4)',
										marginLeft: '15px',
									}
								}
							]
						}
					]
				}
			]
		}),

		contentPanel = Ext.create('Ext.grid.Panel',{
			border: 0,
			minHeight: 350,
			store: warningListStore,
			id: 'innerGrid',
			pageSize: 2,
			layout: 'fit',
			padding: '0 20',
			forceFit: true,
			style: {
				background: 'rgba(0,0,0,0.2)',
				borderRadius: '5px',
			},
			plugins: {
				ptype: 'rowexpander',
				brforeBody: true,
				columnWidth: 150,
				headerWidth: 0,
				rowBodyTpl: '<div class="innerGridExpander"></div>',
			},
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false,
					align: 'center',
					width: 100,
					style: "border: none;color: #fff;",
				},
				items: [
					{dataIndex: 'province',         text: "省份"},
					{dataIndex: 'channel',          text: "交易渠道"},
					{dataIndex: 'type',             text: "交易类型"},
					{dataIndex: 'warningType',      text: "告警类型"},
					{dataIndex: 'level',            text: "告警级别"},
					{dataIndex: 'warningTime',      text: "告警时间",width: 160,}, 
					{dataIndex: 'threshold',        text: "最低触发阀值",},
					{dataIndex: 'dispatchThreshold',text: "设置阀值"},
					{dataIndex: 'state',            text: "告警状态"},
					{dataIndex: 'lasting',          text: "连续时间"},
					{
						text:"操作",
						width:130,
						align:"center",
						renderer:function(value,cellmeta){
							var returnStr = "<INPUT type='button' value='查看'>";
							return returnStr;
						}	
  					},
				]
			},
			listeners: {
				afterrender: function(){
					contentPanel.view.on('expandbody',function(){
						var index = arguments[1].data.index;
						if(void 0 !== contentStore[index])return;
						var container = arguments[2].getElementsByClassName('innerGridExpander')[0];
						var data = arguments[1].data.data;
						var grid = Ext.create('Ext.grid.Panel',{
							border: 0,
							store: new Ext.data.Store({
								fields: [
									'type','channel','application',
									'count','responseRate','successRate',
									'responseTime','warning','threshold',
									'lasting',
								],
								data: data
							}),
							columns: {
								defaults: {
									menuDisabled: true,
									draggable: false,
									sortable: false,
									align: 'center',
									width: 110,
									style: {
										border: 'none',
										color: '#fff',
									},
								},
								items: [
									{dataIndex: 'type',        text: "交易类型"}, 
									{dataIndex: 'channel',     text: "交易渠道"}, 
									{dataIndex: 'application', text: "中间件",width: 145}, 
									{dataIndex: 'count',       text: "交易量"}, 
									{dataIndex: 'responseRate',text: "响应率"}, 
									{dataIndex: 'successRate', text: "成功率",}, 
									{dataIndex: 'responseTime',text: "响应时长"}, 
									{dataIndex: 'warning',     text: "是否告警"}, 
									{dataIndex: 'threshold',   text: "设置阀值",}, 
									{dataIndex: 'lasting',     text: "持续时间",}
								]
							},
							renderTo:container,
						});
						grid.getEl().swallowEvent([  
							'mousedown', 'mouseup',   'click',  
							'mouseover', 'mouseout',  'contextmenu', 
							'dblclick',  'mousemove', 'mouseenter',
							'itemmousedown','itemmouseup',  'itemsclick',
							'itemmouseover','itemmouseout', 'itemcontextmenu',
							'itemdblclick', 'itemmousemove','itemmouseenter',
							'focus','blur'
						],true);  
						contentStore[index] = grid;
					}).on('collapsebody',function(){
						var index = arguments[1].data.index;
						if(void 0 == contentStore[index])return;
						contentStore[index].destroy();
						delete contentStore[index];
					});
				},
				rowclick: function(){
					var i = arguments[3];
					contentPanel.plugins[0].toggleRow(i,warningListStore.data.items[i]);
				},
			}
		}),

		pagingBarPanel = Ext.create('Ext.panel.Panel',{
			border: 0,
			listeners: {
				afterrender: function(){
					vz2.ajax({
						url: 'warningCenter',
						params: {
							page: 1,
							limit: 10,
						},
						success: function(res,eOpts){
							contentPanel.store.loadData(res);
							createPagingtoolbar(contentPanel,pagingBarPanel,{
								pageCount: 100
							});
						},
						failure: function(){

						}
					});

				}
			}
		});

	/* define features */ 

	var createPagingtoolbar = function(){
		var 
			currentPage,
			pageCount;

		var updatePage = function(girdPanel,pagingPanel,selected,loadData){
			true === loadData && vz2.ajax({
				url: 'warningCenter',
				params: {
					page: selected,
					limit: 10,
				},
				success: function(res,eOpts){
					girdPanel.store.loadData(res);
				},
				failure: function(){

				}
			});

			currentPage = selected;
			var label = pagingPanel.query('label');
			if(pageCount < 5){
				label[0].hide();
				label[1].hide();
			}else{
				selected > 4 ? label[0].show() : label[0].hide();
				selected < pageCount - 3 ? label[1].show():label[1].hide();
			}
			pagingPanel.hide();

			var btnList = pagingPanel.query('button');
			btnList.forEach(function(item,i){
				item.removeCls('select');
				if(i === 0 || i === 1 || i === pageCount+2 || i === pageCount+3 )return;

				if(i === 2 || i === pageCount + 1)return item.show();
				if(selected - i > 1 || i - selected > 3){
					item.hide();
				}else{
					item.show();
				}
			});

			btnList[selected + 1].addCls('select');
			pagingPanel.show();
		}

		return function(girdPanel,pagingPanel,detail){
			currentPage = 1;
			pageCount = detail.pageCount;

			var items = [];

			for(var i = 0;i < pageCount + 2;i++){
				if(i === 0 || i === pageCount + 1 && i > 2){
					items[i] = Ext.create('Ext.button.Button',{
						text: i === 0 ? 1 : pageCount,
						handler: function(){
							var _i = i === 0 ? 1 : pageCount;
							return function(){
								updatePage(girdPanel,pagingPanel,_i,true);
							};
						}(),
					});
					continue;
				}else if(i === 1 || i === pageCount || pageCount < 2){
					items[i] = Ext.create('Ext.form.Label',{
						text: '...',
						style: {color: '#fff'},
					});
					continue;
				}
				items[i] = Ext.create('Ext.button.Button',{
					text: i,
					hidden: true,
					handler: function(){
						var _i = i;
						return function(){
							updatePage(girdPanel,pagingPanel,_i,true);
						};
					}(),
				});
			}

			items.unshift(Ext.create('Ext.button.Button',{
				text: '<',
				handler: function(){
					if(currentPage === 1)return;
					currentPage--;
					updatePage(girdPanel,pagingPanel,currentPage,true);
				}
			}));

			items.unshift(Ext.create('Ext.button.Button',{
				text: '<<',
				handler: function(){
					if(currentPage === 1)return;
					updatePage(girdPanel,pagingPanel,1,true);
				}
			}));

			items.push(Ext.create('Ext.button.Button',{
				text: '>',
				handler: function(){
					if(currentPage === pageCount)return;
					currentPage++;
					updatePage(girdPanel,pagingPanel,currentPage,true);
				}
			}));

			items.push(Ext.create('Ext.button.Button',{
				text: '>>',
				handler: function(){
					if(currentPage === pageCount)return;
					updatePage(girdPanel,pagingPanel,pageCount);
				}
			}));

			var s = Ext.create('Ext.form.Panel',{
				border: 0,
				items: items,
				width: 375,
				style: {
					margin: '0 auto',
				},
			});

			pagingPanel.add(s);

			updatePage(girdPanel,pagingPanel,1,false);
		}
	}();


	mainPanel.add([filterPanel,contentPanel,pagingBarPanel]);

	return mainPanel;
});
///<jscompress sourcefile="sceneMode.js" />
/*
 * 监控场景
 * 
 */ 


function SceneMode(parentNode){
	Page.call(this, Configes.page.sceneMode);
	this._parentNode = parentNode;
	this.run = function(){
		if(true !== this.exist){
			this.exist = true;
			this.initView();
		}

		this.mainPanelShow();
	};

	this.initView = function(){
		var 
			_this = this,
			mainPanel;

		this.monitorPanel = Ext.create('Ext.panel.Panel',{
			border: 0,
			// width: 1200,
		});

		this.menuPanel = Ext.create('Ext.tab.Bar',{
			border: 0,
			width: '500px',
			style: {
				'left': '280px',
				'top': '25px',
				'position': 'fixed',
				'z-index': '9999'
			},
			cls: 'vz_monitorSceneMenu',
			layout: 'column',
			defaults: {
				width: 30,
				height: 30,
				border: 0,
				margin: '0 20 0 0',
				xtype: 'button',
				listeners: {
					click:function(target,e,eOpts){
						_this.menuPanel.items.each(function(cmp){
							cmp.el.dom.style.opacity = 0.4;
						});
						target.el.dom.style.opacity = 1;

						var _i = target.pageId + 1;

						_this.mainPanel.items.each(function(cmp,index){
							if(index === _i){
								cmp.items.each(function(_cmp,_index){
									_index === 0 && _cmp.show() || _cmp.hide();
								});
								cmp.show();
							}else if(index !== 0){
								cmp.hide();
							}
						});
					},
					afterrender: function(){
						_this.menuPanel.items.items[0].el.dom.style.opacity = 1;
					}
				}
			},
			items: [
				{
					tooltip: '故障定位监控',
					cls: 'vz-icon-i14 vz-icon',
					pageId: 0,
				},{
					xtype: 'box',
					cls: 'vz-icon-i15 vz-icon',
					pageId: 1,
					disabled: true,
				},{
					xtype: 'box',
					cls: 'vz-icon-i16 vz-icon',
					pageId: 2,
					disabled: true,
				},{
					xtype: 'box',
					cls: 'vz-icon-i17 vz-icon',
					pageId: 3,
					disabled: true,
				},{
					xtype: 'box',
					cls: 'vz-icon-i18 vz-icon',
					pageId: 4,
					disabled: true,
				},{
					xtype: 'box',
					cls: 'vz-icon-i19 vz-icon',
					pageId: 5,
					disabled: true,
				}
			]
		});

		this.mainPanel = this.getMainPanel();

		this.mainPanel.addListener({
			show: function(){
				_this.mainPanel.items.each(function(cmp,index){
					index === 0 || index === 1 && cmp.show() || cmp.hide();
				});

				_this.monitorPanel.items.each(function(cmp,index){
					index === 0 && cmp.show() || cmp.hide();
				});

				_this.menuPanel.items.each(function(cmp,index){
					cmp.el.dom.style.opacity = index === 0 ? 1 : 0.4;
				});
			}
		});

		var monitorPanel = vz2.monitorSceneInitialize();

		this.monitorPanel.add([monitorPanel[0],monitorPanel[1]]);

		this.mainPanel.add([this.menuPanel,this.monitorPanel]);
	};
}
///<jscompress sourcefile="editor.js" />
// 编辑器对象
// 
/**
 * [Editor description]
 * @param {[type]} parentNode [父节点] 
 * @param {[type]} name       [编辑器标识]
 * @param {[type]} size       [{width,height} 编辑器高和宽]
 */
function Editor(configs) {
	this.configs = configs;
	this.parentNode = configs.parentNode;
	this.name = configs.name;
	this.labelName = configs.labelName;
	this.size = configs.size || {
		width: "100%",
		height: "100%"
	};
	this.getValue = function() {

	};
	this.createPanel = function() {
		this.mainPanel = Ext.create("Ext.panel.Panel", {
			node: this,
			border: 0,
			width: "100%",
			height: 325,
			layout: "vbox",
			items: [{
				margin: "10 0",
				xtype: "label",
				width: "100%",
				text: this.labelName,
				style: "font-size: 14px; color: #fff"
			}, {
				xtype: "panel",
				border: 0,
				width: "100%",
				height: 300,
				html: '<script id="' + this.name + '" type="text/plain" class="ueditor" style="background-color: rgba(0,0,0,.3);width:100%;height:200px;"></script>'
			}]
		});

	};
	this.createPanel();
	return this.mainPanel;
}
///<jscompress sourcefile="serviceDirectory.js" />
/**
 *
 *	creator godz  
 * 	2016 08 21
 *	服务目录展示
 *
 * 
 */

function ServiceDirectory(parentNode) {
	Page.call(this, Configes.page.serviceDirectory);
	this._parentNode = parentNode;
	// 基础配置
	this.msg = new function() {
		this.treeTitle = "服务目录";
		this.type = new function() {
			this.server = "server";
			this.scene = "scene";
		};
		this.editTypeToAdd = "editTypeToAdd";
		this.editTypeToUpdate = "editTypeToUpdate";
	};
	this.editors = new Array();

	// 初始化页面
	this.run = function(sceneId) {
		this.jumpSceneId = sceneId;
		if (!this.loading) {
			this.initView();
			this.getSelfInfo();
			this.getChannel();
			this.getBusiness();
			// 获取指标
			this.getTarget();
			this.getProbe();
			// 探测频率
			this.getProbeFrequency();
		}
		this.loading = true;
		this.mainPanelShow();

		if (this.jumpSceneId) {
			this.selectSceneNode(this.jumpSceneId);
			this.jumpSceneId = null;
		}
	};
	this.initView = function() {
		this.mainTreePanel.add([this.treeTitlePanel, this.treePanel]);
		this.viewPanel.add(this.mainTreePanel, this.centerPanel);
		this.centerPanel.hide();
		var mainPanel = this.getMainPanel();
		mainPanel.add(this.viewPanel);
	};



	/**
	 * 控制模块
	 *
	 *
	 * 
	 */



	// 打开编辑容器
	this.openCenterPanel = function(tree, record, ele, id, e) {
		if (!record.isLeaf()) {
			return;
		}
		this.sceneId = record.data.nodeData["_id"];

		var sceneId = record.data.nodeData["_id"];
		var sceneName = record.data.nodeData["name"];
		var serviceName = record.parentNode.data.nodeData["name"];

		// 标题
		var titlePanel = this.centerTitlePanel.getComponent(0);
		var serviceNamePanel = titlePanel.getComponent(0);
		var sceneNamePanel = titlePanel.getComponent(2);
		// 按钮
		var btnPanel = this.centerTitlePanel.getComponent(1);
		var smPanel = btnPanel.getComponent(0).hide();
		var sdmPanel = btnPanel.getComponent(1).hide();

		var morebtn = this.moreBtnPanel.getComponent(0).getComponent(0);
		morebtn.setText("更多");
		if (this.userInfo["_CONTENT"]) {
			var province = this.getProvince();
			if (province === "深圳中心") {
				sdmPanel.show();
			} else {
				smPanel.show();
			}
		}

		this.destroyEditor();
		this.setEditor();

		serviceNamePanel.setText(serviceName);
		sceneNamePanel.setText(sceneName);
		this.centerMoreFormPanel.hide();
		this.getScene(sceneId);
		this.centerPanel.show();
	};

	// 显示更多
	this.showMore = function(btn) {
		console.log(btn);
		if (this.centerMoreFormPanel.isHidden()) {
			btn.setText("收起");
			this.centerMoreFormPanel.show();
		} else {
			btn.setText("更多");
			this.centerMoreFormPanel.hide();
		}
	};


	// 清除编辑器
	this.destroyEditor = function() {
		var l = this.editors.length;
		for (var i = 0; i < l; i++) {
			this.editors[i].destroy();
		}
		this.editors = [];
	};

	// 实例化编辑器
	this.setEditor = function() {
		this.editors = [];
		this.editors.push(UE.getEditor("serviceDirectoryDesc"));
		this.editors[0].addListener("ready", function() {
			this.setOpt(
				'toolbars', []
			);
			// editor准备好之后才可以使用
			this.setDisabled()
		});

	};

	// 查询场景
	this.searchScene = function(input, e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			var value = input.getValue();
			var root = this.treeRoot.getRoot();
			var sceneNode;
			root.eachChild(function(node) {
				if (node.data.nodeData["name"] == value) {
					this.treePanel.getSelectionModel().select(node);
				} else {
					node.eachChild(function(childNode) {
						if (childNode.data.nodeData["name"] == value) {
							this.treePanel.getSelectionModel().select(childNode);
							sceneNode = childNode;
						}
					}, this);
				}

			}, this);
			sceneNode && this.openCenterPanel(this.treePanel, sceneNode);
		}
	};

	// 跳转到服务目录管理
	this.openServiceDirectoryManage = function() {
		this._parentNode.openContent(Configes.page.serviceDirectoryManage, this.sceneId);
	};
	this.openServiceMade = function() {
		this._parentNode.openContent(Configes.page.serviceMade, this.sceneId);
	};

	/**
	 * 数据加载模块
	 *
	 *	getUserInfo
	 *
	 * 	getServerList
	 * 	getChannel
	 *  getBusiness
	 *  getTarget
	 *  getProbe
	 *  getProbeFrequency
	 *
	 * 
	 */
	this.getSelfInfo = function() {
		tools.getData(Configes.url.view_getSelfInfo, null, this.setSelfInfo, this);
	};
	this.setSelfInfo = function(data, that) {
		that.userInfo = data;

		that.getServerList();
	};
	this.getProvince = function() {
		var contentStr = this.userInfo["_CONTENT"];
		var content = JSON.parse(contentStr);
		var province = content["PROVINCE"];
		return province
	};


	this.getServerList = function() {
		tools.getData(Configes.url.getServerList, null, this.setServerList, this);
	};
	this.setServerList = function(data, that) {
		var treeData = [];
		var root = that.treeRoot.getRoot();
		for (var i = 0, l = data.length; i < l; i++) {
			var treeNode = {
				expanded: true,
				text: data[i]["name"],
				iconCls: "i",
				leaf: false,
				isLoad: false,
				nodeData: data[i],
				type: that.msg.type.server,
				cls: "serviceDirectoryTreeType",
				children: []
			}
			treeData.push(treeNode);
			var node = root.appendChild(treeNode);
			that.getSceneList(node);
		}
	};
	this.getSceneList = function(node) {
		var callbackParams = {
			that: this,
			node: node
		}
		var params = {
			serviceId: node.data.nodeData._id
		}
		tools.getData(Configes.url.getSceneList + node.data.nodeData._id, params, this.setSceneList, callbackParams);
	};
	this.setSceneList = function(data, params) {
		var treeData = [];
		var that = params.that;
		var node = params.node;
		for (var i = 0, l = data.length; i < l; i++) {
			var treeNode = {
				text: data[i]["name"],
				iconCls: "i",
				leaf: true,
				type: that.msg.type.scene,
				cls: "serviceDirectoryTreeScene",
				nodeData: data[i]
			}
			treeData.push(treeNode);
		};
		node.removeAll();
		node.appendChild(treeData);
		node.data.isLoad = true;

		if (that.jumpSceneId) {
			var isOpen = that.selectSceneNode(that.jumpSceneId);
			isOpen && (that.jumpSceneId = null)
		}

	};
	this.selectSceneNode = function(senceId) {
		var root = this.treeRoot.getRoot();
		var sceneNode;
		root.eachChild(function(node) {
			node.eachChild(function(childNode) {
				if (childNode.data.nodeData["_id"] == senceId) {
					this.treePanel.getSelectionModel().select(childNode);
					sceneNode = childNode;
				}
			}, this);
		}, this);
		sceneNode && this.openCenterPanel(null, sceneNode);
		return sceneNode;
	};

	this.getScene = function(sceneId) {
		var params = {
			sceneId: sceneId
		}
		tools.getData(Configes.url.getScene, params, this.setScene, this);
	};

	this.setScene = function(data, that) {
		var form = that.centerFormPanel.getForm();
		form.reset();
		form.setValues(data);
		that.initAlarmConfigPanel();
		that.setAlarmConfig(data);
		that.editors[0].addListener("ready", function() {
			// editor准备好之后才可以使用
			this.setContent(data.desc);
		});
		// that.editors[0].setContent(data["desc"]);
	};
	this.initAlarmConfigPanel = function() {
		this.alarmConfigPanel.removeAll(false);
		this.rateAlarmConfigGridStore.loadData([]);
		this.amountAlarmConfigGridStore.loadData([]);
		this.durationAlarmConfigGridStore.loadData([]);
	};
	this.setAlarmConfig = function(data) {
		var panel = this.alarmConfigPanel;
		if (data["alarmType"].indexOf("成功率") !== -1) {
			var rateAlarmConfig = data["rateAlarmConfig"];
			panel.add(this.rateAlarmConfigGridPanel);
			this.rateAlarmConfigGridStore.loadData(rateAlarmConfig);
		}

		if (data["alarmType"].indexOf("交易量") !== -1) {
			var amountAlarmConfig = data["amountAlarmConfig"];
			panel.add(this.amountAlarmConfigGridPanel);
			this.amountAlarmConfigGridStore.loadData(amountAlarmConfig);
		}

		if (data["alarmType"].indexOf("响应时间") !== -1) {
			var durationAlarmConfig = data["durationAlarmConfig"];
			panel.add(this.durationAlarmConfigGridPanel);
			this.durationAlarmConfigGridStore.loadData(durationAlarmConfig);
		}
		var firstPanel = panel.getComponent(0);
		firstPanel && panel.setActiveTab(firstPanel);
	};
	// 基础数据
	this.getChannel = function() {
		tools.getData(Configes.url.getChannel, null, this.setChannel, this)
	};
	this.setChannel = function(data, that) {
		that.channelData = data;
	};
	this.getBusiness = function() {
		tools.getData(Configes.url.getBusiness, null, this.setBusiness, this);
	};
	this.setBusiness = function(data, that) {
		that.businessData = data;
	};
	this.getTarget = function() {
		tools.getData(Configes.url.getTarget, null, this.setTarget, this);
	};
	this.setTarget = function(data, that) {
		that.targetData = data;
	};
	this.getProbe = function() {
		tools.getData(Configes.url.getProbe, null, this.setProbe, this);
	};
	this.setProbe = function(data, that) {
		that.probeData = data;
	};
	this.getProbeFrequency = function() {
		tools.getData(Configes.url.getProbeFrequency, null, this.setProbeFrequency, this);
	};
	this.setProbeFrequency = function(data, that) {
		that.probeFrequency = data;
	};

	/**
	 *
	 *	store 模块
	 * 
	 */
	// 树的Store
	this.treeRoot = Ext.create("Ext.data.TreeStore", {
		root: {
			expanded: true,
			cls: "serviceDirectoryTreeRoot"
		}
	});
	Ext.define('serviceDirectory.AlarmConfig', {
		extend: 'Ext.data.Model',
		fields: ["NAME", "TYPE", "CONDITION", "THRESHOLD", "TIME"]
	});
	this.rateAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		model: "serviceDirectory.AlarmConfig",
	});
	this.amountAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		model: "serviceDirectory.AlarmConfig",
	});
	this.durationAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		model: "serviceDirectory.AlarmConfig",
	});
	/**
	 *
	 *	视图模块
	 *
	 *	viewPanel
	 * 	mainTreePanel
	 *  treeTitlePanel
	 * 	treePanel
	 *
	 * 	
	 */
	// 主容器
	this.viewPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "column",
		cls: "serviceDirectoryMainPanel"
	});
	// 服务目录树
	this.mainTreePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 1 / 5,
		margin: 5
	});
	this.treeTitlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		// height: 50,
		// layout: "border",
		items: [{
			// region: "west",
			xtype: "label",
			text: "服务目录",
			style: {
				fontSize: "20px",
				color: "#fff",
				lineHeight: "30px"
			}
		}, {
			// region: "east",
			height: 30,
			margin: "5 0",
			border: 0,
			xtype: "panel",
			items: [{
				width: "100%",
				xtype: "textfield",
				cls: "centerFormPanelInput searchInput",
				listeners: {
					specialKey: Ext.bind(this.searchScene, this)
				}
			}]

		}]
	});

	this.treePanel = Ext.create("MyTreePanel2", {
		that: this,
		store: this.treeRoot,
		rootVisible: false,
		border: 0,
		cls: "serviceDirectoryTreePanel",
		listeners: {
			itemdblclick: Ext.bind(this.openCenterPanel, this)
		}
	});


	// 查看 标题
	this.centerTitlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "border",
		height: 35,
		defaults: {
			style: {
				fontSize: "20px",
				color: "#fff",
				lineHeight: "30px",
				margin: "0 5px",
				border: 0,
			}
		},
		items: [{
			xtype: "panel",
			defaults: {
				style: {
					fontSize: "20px",
					color: "#fff",
					lineHeight: "30px",
					margin: "0 5px",
					border: 0,
				}
			},
			items: [{
				xtype: "label",
				text: ""
			}, {
				xtype: "label",
				text: ">>"
			}, {
				xtype: "label",
				text: ""
			}, ]
		}, {
			xtype: "panel",
			region: "east",
			height: 20,
			items: [{
				xtype: "button",
				// margin: "5",
				text: "定制服务",
				handler: Ext.bind(this.openServiceMade, this)
			}, {
				xtype: "button",
				// margin: "5",
				baseCls: "x-btn base-btn",
				cls: "btn-submit",

				text: "管理服务",
				handler: Ext.bind(this.openServiceDirectoryManage, this)
			}]
		}]
	});


	// 编辑器
	this.editor = new Editor({
		parentNode: this,
		labelName: "场景介绍",
		name: "serviceDirectoryDesc",
		size: {
			width: "95%",
			height: 600
		}
	});


	//  查看 基础数据
	this.centerBaseFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		cls: "centerFormPanel",
		defaults: {
			border: 0,
			labelStyle: "color: #fff; font-size: 14px; line-height: 24px;",
			anchor: "100%",
			labelWidth: 80,
			// margin: "5 0",
		},
		items: [
			this.editor, {
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					text: "探测渠道",
					margin: "5 0"
				}, {
					xtype: "textfield",
					cls: "centerFormPanelInput",
					width: "100%",
					name: "channel",
					readOnly: true
				}]
			}, {
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					text: "探测方式",
					margin: "5 0"
				}, {
					xtype: "textfield",
					cls: "centerFormPanelInput",
					width: "100%",
					name: "probe",
					readOnly: true
				}]
			}, {
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					text: "业务",
					margin: "5 0"
				}, {
					xtype: "textareafield",
					cls: "centerFormPanelInput",
					height: 100,
					width: "100%",
					name: "business",
					readOnly: true
				}]
			}, {
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					text: "指标",
					margin: "5 0"
				}, {
					xtype: "textfield",
					cls: "centerFormPanelInput",
					width: "100%",
					name: "target",
					readOnly: true
				}]
			}, {
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					text: "探测频率",
					margin: "5 0"
				}, {
					xtype: "textfield",
					cls: "centerFormPanelInput",
					width: "100%",
					name: "probeFrequency",
					readOnly: true
				}]
			}
		]
	});



	this.rateAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
		title: "成功率告警",
		disable: true,
		cls: "alarmConfigTabGridPanel",
		border: 0,
		autoRender: true,
		autoShow: false,
		store: this.rateAlarmConfigGridStore,
		forceFit: true,
		disableSelection: true,
		columns: {
			defaults: {
				menuDisabled: true,
				draggable: false,
				sortable: false,
			},
			items: [{
				dataIndex: "NAME",
				text: "告警级别",
			}, {
				dataIndex: "TYPE",
				text: "指标",
			}, {
				dataIndex: "CONDITION",
				text: "条件"
			}, {
				dataIndex: "THRESHOLD",
				text: "最低阈值",
				renderer: function(value) {
					console.log();
					value = value || 0;
					value = value + "%";
					return value;
				}
			}, {
				dataIndex: "TIME",
				text: "持续时间（是否开放选择）",
				width: 300,
				renderer: function(value, column) {
					var checkboxs = [];
					var data = ["5min", "10min", "15min", "其他"];
					for (var i = 0, l = data.length; i < l; i++) {
						var checked = "";
						for (var j = 0, v_l = value.length; j < v_l; j++) {
							if (value[j] == data[i]) {
								checked = "checked";
							}
						}
						var checkbox = "<laebl style='margin:0 5px;'>" +
							"<input type='checkbox' class='RATE_TIME" +
							column.record.data.ID + "'" +
							checked +
							"  name='time'  value='" +
							data[i] + "'  disabled='true' >" + data[i] + " </laebl>"
						checkboxs.push(checkbox);
					}
					var html = "<div >" + checkboxs.join("") + "</div>"
					return html;
				}
			}]
		},
	});
	this.amountAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
		title: "交易量告警",
		border: 0,
		cls: "alarmConfigTabGridPanel",
		autoRender: true,
		autoShow: false,
		store: this.amountAlarmConfigGridStore,
		forceFit: true,
		disableSelection: true,
		// selType: 'cellmodel',
		// plugins: [
		// 	Ext.create('Ext.grid.plugin.CellEditing', {
		// 		clicksToEdit: 1
		// 	})
		// ],
		// 开始
		columns: {
			defaults: {
				menuDisabled: true,
				draggable: false,
				sortable: false,
			},
			items: [{
				dataIndex: "NAME",
				text: "告警级别",
			}, {
				dataIndex: "TYPE",
				text: "指标",
			}, {
				dataIndex: "CONDITION",
				text: "条件"
			}, {
				dataIndex: "THRESHOLD",
				text: "最低阈值",
				renderer: function(value) {
					value = value || 0;
					return value;
				}
			}, {
				dataIndex: "TIME",
				text: "持续时间（是否开放选择）",
				width: 300,
				renderer: function(value, column) {
					var checkboxs = [];
					var data = ["5min", "10min", "15min", "其他"];
					for (var i = 0, l = data.length; i < l; i++) {
						var checked = "";
						for (var j = 0, v_l = value.length; j < v_l; j++) {
							if (value[j] == data[i]) {
								checked = "checked";
							}
						}
						var checkbox = "<laebl style='margin:0 5px;'>" +
							"<input type='checkbox' class='RATE_TIME" +
							column.record.data.ID + "'" +
							checked +
							"  name='time' value='" +
							data[i] + "' disabled='true'>" + data[i] + "</laebl>"
						checkboxs.push(checkbox);
					}
					var html = "<div >" + checkboxs.join("") + "</div>"
					return html;
				}
			}]
		},
		// 结束
	});
	this.durationAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
		title: "响应时间告警",
		border: 0,
		cls: "alarmConfigTabGridPanel",
		autoRender: true,
		autoShow: false,
		store: this.durationAlarmConfigGridStore,
		forceFit: true,
		disableSelection: true,
		// selType: 'cellmodel',
		// plugins: [
		// 	Ext.create('Ext.grid.plugin.CellEditing', {
		// 		clicksToEdit: 1
		// 	})
		// ],
		columns: {
			defaults: {
				menuDisabled: true,
				draggable: false,
				sortable: false,
			},
			items: [{
				dataIndex: "NAME",
				text: "告警级别",
			}, {
				dataIndex: "TYPE",
				text: "指标",
			}, {
				dataIndex: "CONDITION",
				text: "条件"
			}, {
				dataIndex: "THRESHOLD",
				text: "最低阈值",
				renderer: function(value) {
					value = value || 0;
					value = value + "s";
					return value;
				}
			}, {
				dataIndex: "TIME",
				text: "持续时间（是否开放选择）",
				width: 300,
				renderer: function(value, column) {
					var checkboxs = [];
					var data = ["5min", "10min", "15min", "其他"];
					for (var i = 0, l = data.length; i < l; i++) {
						var checked = "";
						for (var j = 0, v_l = value.length; j < v_l; j++) {
							if (value[j] == data[i]) {
								checked = "checked";
							}
						}
						var checkbox = "<laebl style='margin:0 5px;'>" +
							"<input type='checkbox' class='RATE_TIME" +
							column.record.data.ID + "'" +
							checked +
							"  name='time' value='" +
							data[i] + "' disabled='true'>" + data[i] + "</laebl>"
						checkboxs.push(checkbox);
					}
					var html = "<div >" + checkboxs.join("") + "</div>"
					return html;
				}
			}]
		},
	});
	// 告警配置 
	this.alarmConfigPanel = Ext.create("Ext.tab.Panel", {
		border: 0,
		plain: true,
		title: "告警配置",
		cls: "alarmConfigTabPanel",
	});


	//  查看  更多数据
	this.centerMoreFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		cls: "centerFormPanel",
		defaults: {
			border: 0,
			labelStyle: "color: #fff; font-size: 14px; line-height: 24px;",
			anchor: "100%",
			labelWidth: 80,
			// margin: "5 0",
		},
		hidden: true,
		items: [{
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					text: "探测方式价值与意义",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					margin: "5 0"
				}, {
					xtype: "textareafield",
					cls: "centerFormPanelInput",
					name: "detectionMethodsValueAndSignificance",
					height: 100,
					width: "100%",
					readOnly: true
				}]
			}, {
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					text: "探测原理及架构",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					margin: "5 0"
				}, {
					xtype: "textareafield",
					cls: "centerFormPanelInput",
					name: "detectionPrincipleAndArchitecture",
					height: 100,
					width: "100%",
					readOnly: true
				}]
			}, {
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					text: "探测运用范围",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					margin: "5 0"
				}, {
					xtype: "textareafield",
					cls: "centerFormPanelInput",
					name: "detectingApplicationRange",
					height: 100,
					width: "100%",
					readOnly: true
				}]
			}, {
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					text: "探测流程及风险分析",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					margin: "5 0"
				}, {
					xtype: "textareafield",
					cls: "centerFormPanelInput",
					name: "detectionProcessAndRiskAnalysis",
					height: 100,
					width: "100%",
					readOnly: true
				}]
			}, {
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					text: "省端准备工作",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					margin: "5 0"
				}, {
					xtype: "textareafield",
					cls: "centerFormPanelInput",
					name: "endPreparationWork",
					height: 100,
					width: "100%",
					readOnly: true
				}]
			}, {
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					text: "告警类型",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					margin: "5 0"
				}, {
					xtype: "textfield",
					cls: "centerFormPanelInput",
					name: "alarmType",
					width: "100%",
					readOnly: true
				}]
			},
			this.alarmConfigPanel, {
				xtype: "panel",
				layout: "hbox",
				margin: "5 0",
				items: [{
					xtype: "label",
					width: "20%",
					text: "是否支持告警推送",
					style: "color: #fff; font-size: 14px; line-height: 45px;",
					// margin: "10 0",
				}, {
					xtype: 'fieldcontainer',
					defaultType: "radiofield",
					padding: 5,
					cls: "serviceDirectoryManageFormCheckbox",
					width: "80%",
					defaults: {
						name: "alarmPush",
						width: 100,
						margin: "10",
					},
					layout: 'hbox',
					items: [{
						boxLabel: "是",
						readOnly: true,
						inputValue: true,
						boxLabelCls: "radioLabel",
					}, {
						boxLabel: "否",
						readOnly: true,
						inputValue: false,
						boxLabelCls: "radioLabel",
					}]
				}]
			}, {
				xtype: "panel",
				layout: "hbox",
				margin: "5 0",
				items: [{
					xtype: "label",
					width: "20%",
					text: "* 推送方式",
					style: "color: #fff; font-size: 14px; line-height: 45px;",
					// margin: "10 0",
				}, {
					xtype: 'fieldcontainer',
					defaultType: "checkboxfield",
					padding: 5,
					cls: "serviceDirectoryManageFormCheckbox",
					width: "80%",
					defaults: {
						name: "alarmPushMode",
						margin: "10",
						width: 100
					},
					layout: 'hbox',
					items: [{
						boxLabel: "短信",
						inputValue: "短信",
						readOnly: true,
						boxLabelCls: "radioLabel",
					}, {
						boxLabel: "邮件",
						inputValue: "邮件",
						readOnly: true,
						boxLabelCls: "radioLabel",
					}]
				}]
			}
		]
	});
	//  更多 按钮
	this.moreBtnPanel = Ext.create("Ext.panel.Panel", {
		height: 25,
		margin: "5",
		layout: "border",
		items: [{
			region: "east",
			xtype: "panel",
			border: 0,
			layout: "hbox",
			items: [{
				icon: "resources/images/more.png",
				iconAlign: "right",
				xtype: "button",
				baseCls: "x-btn base-btn",
				style: "background:none;border: 0px; color: #fff; font-size: 14px; line-height: 24px;cursor: pointer;",
				text: "更多",
				handler: Ext.bind(this.showMore, this)
			}]
		}],
	});



	//  主表单容器
	this.centerFormPanel = Ext.create("Ext.form.Panel", {
		border: 0,
		items: [
			this.centerBaseFormPanel,
			this.moreBtnPanel,
			this.centerMoreFormPanel
		]
	});
	// 
	// 主查看容器
	this.centerPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 4 / 5,
		margin: 5,
		items: [
			this.centerTitlePanel,
			this.centerFormPanel
		]
	});



}
ServiceDirectory.prototype = new Page(Configes.page.serviceDirectory);
///<jscompress sourcefile="serviceDirectoryManage.js" />
//  godz
//  update 2016 8 21
//  
//  
//  服务目录管理
//  
//
//  

function ServiceDirectoryManage(parentNode) {

	Page.call(this, Configes.page.serviceDirectoryManage);
	this._parentNode = parentNode;
	this.msg = new function() {
		this.treeTitle = "服务目录";
		this.type = new function() {
			this.server = "server";
			this.scene = "scene";
		};
		this.editTypeToAdd = "editTypeToAdd";
		this.editTypeToUpdate = "editTypeToUpdate";
	};
	// 当前打开场景编辑模式
	this.editType = null; // editTypeToAdd || editTypeToUpdate
	// 显示页面
	this.run = function(sceneId) {
		this.jumpSceneId = sceneId;
		if (!this.loading) {
			this.initView();
			this.getChannel();
			this.getBusiness();
			// 获取指标
			this.getTarget();
			this.getProbe();
			// 探测频率
			this.getProbeFrequency();
		}
		this.loading = true;
		this.mainPanelShow();

		if (this.jumpSceneId) {
			this.selectSceneNode(this.jumpSceneId);
			this.jumpSceneId = null;
		}
	};
	// 初始化界面
	this.initView = function() {
		this.viewPanel.add(this.treeMainPanel);
		this.viewPanel.add(this.centerPanel);
		var mainPanel = this.getMainPanel();
		mainPanel.add(this.viewPanel);
		this.getServerList();
	};
	// 当前编辑场景数据
	this.currentSceneData = {};


	// 控制模块  ---------------------------------- 
	// 打开编辑主容器
	this.editors = [];


	// 打开新增场景
	this.openAddCenterPanel = function(node) {
		// 设置当前打开编辑器为添加场景
		this.editType = this.msg.editTypeToAdd;
		var parentNodeName = node.data.text;
		var nodeName = null;
		var sceneId = null;
		var serverId = null;
		this.currentServerId = node.data.nodeData["_id"];
		this.currentEditType = "addScene";
		this.currentSceneId = null;
		this.setCenterPanelChild(parentNodeName, nodeName, serverId, sceneId);
		this.getRateAlarmConfig();
		this.getAmountAlarmConfig();
		this.getDurationAlarmConfig();
	};
	// 打开编辑
	// 
	this.openCenterPanelBefore = function(node) {
		this.centerPanel && this.centerPanel.hide();
		var nodeData = node.data.nodeData;
		var statu = nodeData.statu;
		var edit = nodeData.edit;
		var that = this;
		this.currentServerId = node.parentNode.data.nodeData["_id"];
		this.currentEditType = "updateScene";
		this.currentSceneId = node.data.nodeData["_id"];
		if (statu && edit) {
			Ext.Msg.show({
				title: "提示",
				modal: true,
				msg: "存在未提交的编辑服务内容，是否继续上次编辑内容?",
				buttonText: {
					yes: "继续编辑",
					no: "重新编辑"
				},
				fn: function(btn) {
					if (btn === "yes") {
						that.openCenterPanel(node);
						return;
					} else if (btn === "no") {
						that.removeSaveScene();
						return;
					}
				}
			});
			return;
		} else {
			this.openCenterPanel(node);
		}
	};
	this.openCenterPanel = function(node) {
		this.editType = this.msg.editTypeToUpdate;
		this.currentSceneData = node.data.nodeData;
		var parentNode = node.parentNode;
		var nodeName = node.data.nodeData.name;
		var parentNodeName = parentNode.data.text;
		var sceneId = null;
		var serverId = null;
		this.setCenterPanelChild(parentNodeName, nodeName, serverId, sceneId);
		this.getScene(this.currentSceneId);
	};


	// 
	this.setCenterPanelChild = function(parentNodeName, nodeName, serverId, sceneId) {
		this.centerPanel && this.centerPanel.show();
		this.destroyEditor();
		this.centerPanel.removeAll();
		this.createCenterTitlePanel(parentNodeName, nodeName);
		this.createCenterFormPanel();
		this.centerPanel.add([this.centerTitlePanel, this.centerFormPanel]);
		this.setEditor();
	};

	// 编辑器
	// 
	// 清除编辑器

	this.destroyEditor = function() {
		var l = this.editors.length;
		for (var i = 0; i < l; i++) {
			this.editors[i].destroy();
		}
		this.editors = [];
	};

	// 实例化编辑器
	this.setEditor = function() {
		this.editors = [];
		this.editors.push(UE.getEditor("desc"));
	};


	// 树右键菜单显示
	this.menuPanelShow = function(e, record) {
		var x = e.pageX;
		var y = e.pageY;
		this.menuPanel.setPagePosition(x, y);
		var addServer = this.menuPanel.getComponent("addServer");
		var editServer = this.menuPanel.getComponent("editServer");
		var addScene = this.menuPanel.getComponent("addScene");
		var updateScene = this.menuPanel.getComponent("updateScene");
		var deleteScene = this.menuPanel.getComponent("deleteScene");
		var deleteServer = this.menuPanel.getComponent("deleteServer");
		addServer && addServer.hide();
		editServer && editServer.hide();
		addScene && addScene.hide();
		updateScene && updateScene.hide();
		deleteScene && deleteScene.hide();
		deleteServer && deleteServer.hide();
		if (record.data.type == this.msg.type.server) {
			addServer.show();
			addScene.show();
			editServer.show();
			deleteServer.show();
		} else if (record.data.type == this.msg.type.scene) {
			updateScene.show();
			deleteScene.show();
		}
		this.menuPanel.show();
	};
	this.editServerWinShow = function(node) {
		if (!this.editServerWin) {
			this.createEditServerWin();
		}
		var form = this.editServerWin.getComponent(0);
		form.getForm().reset();
		this.editServerWin.show();

		if (node) {
			this.getServer(node.data.nodeData);
		}
	};
	this.editServerWinHide = function() {
		this.editServerWin.hide();
	};



	this.saveScene = function() {
		if (this.currentEditType == "addScene") {
			this.addScene();
		} else if (this.currentEditType == "updateScene") {
			this.updateScene();
		}
	};
	// 获取当前场景的内容
	this.getCurrentSceneValues = function() {
		var form = this.centerFormPanel.getForm();
		var values = form.getValues();
		var desc = this.editors[0].getContent();

		if (this.currentSceneId) {
			values["sceneId"] = this.currentSceneId || 0;
		}
		var rateAlarmConfig = this.getAlarmConfigData(this.rateAlarmConfigGridStore);
		var amountAlarmConfig = this.getAlarmConfigData(this.amountAlarmConfigGridStore);
		var durationAlarmConfig = this.getAlarmConfigData(this.durationAlarmConfigGridStore);
		values["rateAlarmConfig"] = rateAlarmConfig;
		values["amountAlarmConfig"] = amountAlarmConfig;
		values["durationAlarmConfig"] = durationAlarmConfig;
		values["desc"] = desc;

		if (!this.isBlank(values)) {
			return false;
		}
		return values;
	};



	// 判断是否为空
	this.isBlank = function(values) {
		if (!values["name"]) {
			tools.toast("请填写场景名称");
			return null;
		}
		if (!values["desc"]) {
			tools.toast("请填写监控场景介绍");
			return null;
		}


		if (!values["channel"] || !values["channel"].length) {
			tools.toast("请选择渠道");
			return null;
		}
		if (!values["probe"] || !values["probe"].length) {
			tools.toast("请选择探测方式");
			return null;
		}
		if (!values["probeFrequency"] || !values["probeFrequency"].length) {
			tools.toast("请选择探测频率");
			return null;
		}
		if (!values["business"]) {
			tools.toast("请选择业务");
			return null;
		}
		if (!values["target"]) {
			tools.toast("请选择指标");
			return null;
		}

		if (!values["detectionMethodsValueAndSignificance"]) {
			tools.toast("请填写探测方式价值与意义");
			return null;
		}
		if (!values["detectionPrincipleAndArchitecture"]) {
			tools.toast("请填写探测原理及架构");
			return null;
		}
		if (!values["detectingApplicationRange"]) {
			tools.toast("请填写探测运用范围");
			return null;
		}
		if (!values["detectionProcessAndRiskAnalysis"]) {
			tools.toast("请填写探测流程及风险分析");
			return null;
		}
		if (!values["endPreparationWork"]) {
			tools.toast("请填写省端准备工作");
			return null;
		}

		if (values["alarmType"]) {

			// 判断阈值
			// 
			var rateAlarmConfig = values["rateAlarmConfig"];
			var amountAlarmConfig = values["amountAlarmConfig"];
			var durationAlarmConfig = values["durationAlarmConfig"];
			var result = true;
			if (typeof values["alarmType"] == "object") {
				for (var i = 0, l = values["alarmType"].length; i < l; i++) {
					var value = values["alarmType"][i];
					if (value == "成功率") {
						result = this.thresholdValueLimit(rateAlarmConfig);
					} else if (value == "交易量") {
						result = this.thresholdValueLimit(amountAlarmConfig);
					} else if (value == "响应时长") {
						result = this.thresholdValueLimit(durationAlarmConfig);
					}
				}
			} else {
				var value = values["alarmType"];
				if (value == "成功率") {
					result = this.thresholdValueLimit(rateAlarmConfig);
				} else if (value == "交易量") {
					result = this.thresholdValueLimit(amountAlarmConfig);
				} else if (value == "响应时长") {
					result = this.thresholdValueLimit(durationAlarmConfig);
				}
			}
			if (!result) {
				return null;
			}
			if (values["alarmPush"]) {
				if (!values["alarmPushMode"]) {
					tools.toast("请选择告警推送方式");
				}
			}
		}
		return true;
	};
	this.thresholdValueLimit = function(alarmConfig) {
		for (var i = 0, l = alarmConfig.length; i < l; i++) {
			var level = alarmConfig[i]["NAME"];
			var name = alarmConfig[i]["TYPE"];
			var threshold = alarmConfig[i]["THRESHOLD"];
			var nextThreshold
			if (alarmConfig[i + 1]) {
				nextThreshold = alarmConfig[i + 1]["THRESHOLD"];
			}

			var condition = alarmConfig[i]["CONDITION"];
			if (!threshold) {
				tools.toast(name + "的级别：" + level + "告警配置不能为空");
				return false;
			}
			if (nextThreshold) {
				if (condition == "小于") {
					if (threshold < nextThreshold) {
						// tools.toast(name + "的级别：" + level + "不能" + condition + "它的下一级别");
						tools.toast("高级别告警的阀值必须比较低级别告警的阀值更严格，请重新配置告警");
						return false;
					}
				} else if (condition == "大于") {
					if (threshold > nextThreshold) {
						// tools.toast(name + "的级别：" + level + "不能" + condition + "它的下一级别");
						tools.toast("高级别告警的阀值必须比较低级别告警的阀值更严格，请重新配置告警");
						return false;
					}
				}
			}
		}
		return true;
	};
	// 获取告警配置数据
	this.getAlarmConfigData = function(store) {
		var items = store.data;
		var data = new Array();
		items.each(function(record) {
			data.push(record.data);
		});
		return data;
	};



	this.getCurrentServerNode = function() {
		var serverId = this.currentServerId;
		var root = this.treeRoot.getRoot();
		var serverNode;
		root.eachChild(function(node) {
			if (node.data.nodeData["_id"] == serverId) {
				serverNode = node;
			}
		});
		return serverNode;
	};
	this.getCurrentSceneNode = function(parentNode) {
		var sceneId = this.currentSceneId;
		var sceneNode;
		parentNode && parentNode.eachChild(function(node) {
			if (node.data.nodeData["_id"] == sceneId) {
				sceneNode = node;
			}
		});
		return sceneNode;
	};
	// 保存并提交
	this.saveAndSubmitScene = function() {
		this._submitScene = true;
		this.saveScene();
	};

	// 当指标变化时，影响告警类型
	this.targetChange = function(checkbox) {
		var value = checkbox.inputValue;
		var check = checkbox.getValue();
		var alarmTypeBox = Ext.getCmp("manageAlarmTypeTo" + value);
		alarmTypeBox.setDisabled(!check);
		!check && alarmTypeBox.setValue(check);
	};



	// 控制模块 end---------------------------------- 
	// 
	// 
	// 
	// 
	// 
	// 
	// 
	// 
	// 数据加载模块----------------------------
	// 



	// 获取服务列表-----
	this.getServerList = function() {
		tools.getData(Configes.url.getServerList, null, this.setServerList, this);
	};
	this.setServerList = function(data, that) {
		var treeData = [];
		var root = that.treeRoot.getRoot();
		for (var i = 0, l = data.length; i < l; i++) {
			var treeNode = {
				expanded: true,
				text: data[i]["name"],
				iconCls: "i",
				leaf: false,
				isLoad: false,
				nodeData: data[i],
				type: that.msg.type.server,
				cls: "serviceDirectoryTreeType",
				children: []
			}
			treeData.push(treeNode);
			var node = root.appendChild(treeNode);
			that.getSceneList(node);
		}
	};
	// 添加服务---------------
	this.addServer = function(data) {
		var params = data;
		// this.addServerReturn(data, this);
		tools.getData(Configes.url.addServer, null, this.addServerReturn, this);
	};
	this.addServerReturn = function(data, that) {
		var node = {
			text: data["name"],
			iconCls: "i",
			leaf: false,
			isLoad: false,
			nodeData: data,
			type: that.msg.type.server,
			cls: "serviceDirectoryTreeType",
			children: []
		}
		that.treeRoot.getRoot().appendChild(node);
		that.editServerWinHide();
	};
	this.getServer = function(data) {
		// this.setServer(data, this);
		tools.getData(Configes.url.getServer, null, this.setServer, this);
	};
	this.setServer = function(data, that) {
		var form = that.editServerWin.getComponent(0).getForm();
		form.setValues({
			_id: data["_id"],
			name: data["name"]
		});
	};
	// 编辑服务-----------
	this.editServer = function(data, node) {
		var params = data;
		// this.editServerReturn(data, this);
		tools.getData(Configes.url.updateServer, params, this.editServerReturn, this);
	};
	this.editServerReturn = function(data, that) {
		var root = that.treeRoot.getRoot();
		var node = root.findChildBy(function() {
			if (this.data.nodeData["_id"] == data["_id"]) {
				return true;
			}
		});
		var newNode = {
			text: data["name"],
			iconCls: "i",
			leaf: false,
			isLoad: false,
			nodeData: data,
			type: that.msg.type.server,
			cls: "serviceDirectoryTreeType",
			children: []
		};
		root.replaceChild(newNode, node);
		that.editServerWinHide();
	};
	// 删除服务-----------
	this.deleteServer = function(data) {
		var callbackParams = {
			that: this,
			data: data
		}
		tools.getData(Configes.url.deleteServer, data, this.deleteServerReturn, callbackParams);
		// this.deleteServerReturn(data, params);
	};
	this.deleteServerReturn = function(data, params) {
		var that = params.that;
		var nodeData = params.data;
		var root = that.treeRoot.getRoot();
		var node = root.findChildBy(function() {
			if (this.data.nodeData["_id"] == nodeData["_id"]) {
				return true;
			}
		});
		node.remove();
	};
	// 获取场景列表-----
	this.getSceneList = function(node) {

		var callbackParams = {
			that: this,
			node: node
		}
		var params = {
			serviceId: node.data.nodeData._id
		}
		tools.getData(Configes.url.getSceneList + node.data.nodeData._id, params, this.setSceneList, callbackParams);
	};
	this.setSceneList = function(data, params) {
		var treeData = [];
		var that = params.that;
		var node = params.node;
		for (var i = 0, l = data.length; i < l; i++) {
			var statu = data[i]["statu"];
			var edit = data[i]["edit"];
			var name = data[i]["name"];
			!statu && (name = "(未提交)" + name);
			var treeNode = {
				text: name,
				iconCls: "i",
				leaf: true,
				type: that.msg.type.scene,
				cls: "serviceDirectoryTreeScene",
				nodeData: data[i]
			}
			treeData.push(treeNode);
		};
		node.removeAll();
		node.appendChild(treeData);
		node.data.isLoad = true;
		// node.expand();
		// 
		// 
		if (that.jumpSceneId) {
			var isOpen = that.selectSceneNode(that.jumpSceneId);
			isOpen && (that.jumpSceneId = null);
		}
	};


	this.selectSceneNode = function(senceId) {
		var root = this.treeRoot.getRoot();
		var sceneNode;
		root.eachChild(function(node) {
			node.eachChild(function(childNode) {
				if (childNode.data.nodeData["_id"] == senceId) {
					this.treePanel.getSelectionModel().select(childNode);
					sceneNode = childNode;

				}
			}, this);
		}, this);
		sceneNode && this.openCenterPanelBefore(sceneNode);
		return sceneNode;
	};
	// 获取场景
	this.getScene = function(serverId) {
		var params = {
			serverId: serverId
		};
		tools.getData(Configes.url.getScene, params, this.setScene, this);
	};
	this.setScene = function(data, that) {
		var form = that.centerFormPanel.getForm();
		form.setValues(data);

		that.rateAlarmConfigGridStore || that.createRateAlarmConfigGridStore();
		that.amountAlarmConfigGridStore || that.createAmountAlarmConfigGridStore();
		that.durationAlarmConfigGridStore || that.createDurationAlarmConfigGridStore();
		that.rateAlarmConfigGridStore.loadData(data.rateAlarmConfig);
		that.amountAlarmConfigGridStore.loadData(data.amountAlarmConfig);
		that.durationAlarmConfigGridStore.loadData(data.durationAlarmConfig);
		that.editors[0].addListener("ready", function() {
			// editor准备好之后才可以使用
			this.setContent(data.desc);
		});
	};


	// 删除场景
	this.removeScene = function() {
		var sceneNode = this.treePanel.getSelectionModel().getSelection()[0];
		var sceneId = sceneNode.data.nodeData._id;
		var that = this;
		var params = {
			sceneId: sceneId
		}
		if (!sceneId) {
			return;
		}
		Ext.Msg.show({
			title: "警告",
			modal: true,
			msg: "存在编辑中的服务内容，删除后，该服务下的所有内容（包括编辑中的和已存在的服务内容）都将被删除。是否继续删除？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					tools.getData(Configes.url.removeScene, params, that.removeSceneReturn, {
						that: that,
						node: sceneNode
					});
					return;
				} else {
					return;
				}
			}
		});
	};
	this.removeSceneReturn = function(data, params) {
		var that = params.that;
		var node = params.node;

		var sceneId = node.data.nodeData._id;
		var parentNode = node.parentNode;
		node.remove();
		if (that.currentSceneId && that.currentSceneId == sceneId) {
			if (that.centerPanel) {
				that.centerPanel.hide();
			}
		}
		tools.toast("删除成功");
	};

	// 恢复到提交状态
	this.removeSaveScene = function() {
		var that = this;
		var sceneId = this.currentSceneId;
		if (!sceneId) {
			return;
		}
		var params = {
			sceneId: sceneId
		};
		tools.getData(Configes.url.removSaveScene, params, that.removeSaveReturn, that);
	};
	this.removeSaveReturn = function(data, that) {
		// tools.toast("已恢复到提交状态内容");
		var serviceNode = that.getCurrentServerNode();
		var sceneNode = that.getCurrentSceneNode(serviceNode);
		that.openCenterPanel(sceneNode);
	};

	// 提交
	this.submitScene = function() {

		var sceneId = this.currentSceneId;
		var params = {
			sceneId: sceneId
		}
		this._submitScene = false;
		tools.getData(Configes.url.submitScene, params, this.submitSceneReturn, this);
	};
	this.submitSceneReturn = function(data, that) {
		tools.toast("提交成功");
	};


	// 获取渠道
	this.getChannel = function() {
		tools.getData(Configes.url.getChannel, null, this.setChannel, this);
	};
	this.setChannel = function(data, that) {
		that.channelStore || that.createChannelStore();
		that.channelStore.loadData(data);
	};

	// 获取业务
	this.getBusiness = function() {
		tools.getData(Configes.url.getBusiness, null, this.setBusiness, this);
	};
	this.setBusiness = function(data, that) {
		var checkboxs = [];
		for (var i = 0, l = data.length; i < l; i++) {
			var checkbox = {
				boxLabel: data[i]["NAME"],
				inputValue: data[i]["VALUE"],
				boxLabelCls: "radioLabel",
			}
			checkboxs.push(checkbox);
		}
		that.businessData = checkboxs;
		that.createBusinessCheckBox();
	};
	this.createBusinessCheckBox = function() {
		this.businessCheckBox && this.businessCheckBox.remove();
		this.businessCheckBoxPanel && this.businessCheckBoxPanel.remove();
		var checkboxs = this.businessData;
		this.businessCheckBox = Ext.create("Ext.panel.Panel", {
			xtype: 'fieldcontainer',
			border: 0,
			height: 100,
			autoScroll: true,
			defaultType: "checkboxfield",
			cls: "serviceDirectoryManageFormCheckbox",
			defaults: {
				name: "business",
				margin: "0 10",
			},
			width: "100%",
			layout: 'column',
			items: checkboxs
		});
		this.businessCheckBoxPanel = Ext.create("Ext.panel.Panel", {
			xtype: "panel",
			layout: "vbox",
			items: [{
					xtype: "panel",
					// layout: "border",
					layout: "column",
					width: "100%",
					defaults: {
						height: 35,
					},
					items: [{
						columnWidth: 1 / 8,
						xtype: "panel",
						border: 0,
						items: [{
							xtype: "label",
							text: "* 业务",
							style: "color: #fff; font-size: 14px; line-height: 35px;",
							margin: "5 0"
						}]
					}, {
						columnWidth: 1 / 8,
						xtype: "panel",
						border: 0,
						items: [{
							xtype: "checkboxfield",
							boxLabel: "全选",
							inputValue: "1",
							boxLabelCls: "radioLabel",
							margin: "5 0",
							listeners: {
								change: Ext.bind(this.businessSelect, this)
							}
						}],
					}, {
						xtype: "panel",
						border: 0,
						columnWidth: 2 / 8,
						items: [{
							xtype: "textfield",
							fieldLabel: "搜索",
							labelWidth: 50,
							labelStyle: "color: #ddd; font-size: 14px; line-height: 24px;",
							cls: "centerFormPanelInput",
							listeners: {
								specialKey: Ext.bind(this.searchBusiness, this)
							}
						}]
					}]
				},
				this.businessCheckBox
			]
		});
	};
	this.businessSelect = function(checkbox) {
		var value = checkbox.getValue();
		console.log(value);
		var items = this.businessCheckBox.items;
		items.each(function(box) {
			box.setValue(value);
		});
	};
	this.searchBusiness = function(textfield, e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			var value = textfield.getValue();
			var items = this.businessCheckBox.items;
			items.each(function(checkbox) {
				if (checkbox.boxLabel == value) {
					var x = checkbox.getPosition()[0];
					var y = checkbox.getPosition()[1];
					this.businessCheckBox.scrollBy(x, y, true);
					checkbox.setValue(true);
				}
			}, this);
		}
	};
	// 获取指标
	this.getTarget = function() {
		tools.getData(Configes.url.getTarget, null, this.setTarget, this);
	};
	this.setTarget = function(data, that) {
		var checkboxs = [];
		for (var i = 0, l = data.length; i < l; i++) {
			var checkbox = {
				boxLabel: data[i]["NAME"],
				inputValue: data[i]["VALUE"],
				boxLabelCls: "radioLabel",
				listeners: {
					change: Ext.bind(that.targetChange, that)
				}
			}
			checkboxs.push(checkbox);
		}
		that.targetCheckBox = {
			xtype: 'fieldcontainer',
			// fieldLabel: '指标',
			defaultType: "checkboxfield",
			cls: "serviceDirectoryManageFormCheckbox",
			defaults: {
				name: "target",
				margin: "10",
			},
			layout: 'hbox',
			width: "100%",
			items: checkboxs
		};
		that.targetCheckBoxPanel = {
			xtype: "panel",
			layout: "vbox",
			items: [{
				xtype: "label",
				text: "* 指标",
				style: "color: #fff; font-size: 14px; line-height: 24px;",
				margin: "5 0"
			}, that.targetCheckBox]
		};
		that.createAlarmTypePanel(data);
	};


	// 获取探测方式
	this.getProbe = function() {
		tools.getData(Configes.url.getProbe, null, this.setProbe, this);
	};
	this.setProbe = function(data, that) {

		that.probeStore || that.createProbeStore();
		that.probeStore.loadData(data);

	};
	// 探测频率
	this.getProbeFrequency = function() {
		tools.getData(Configes.url.getProbeFrequency, null, this.setProbeFrequency, this);
	};
	this.setProbeFrequency = function(data, that) {
		that.probeFrequencyStore || that.createProbeFrequencyStore();
		that.probeFrequencyStore.loadData(data);
	};


	// 获取成功率告警配置模板
	this.getRateAlarmConfig = function() {
		tools.getData(Configes.url.getRateAlarmConfig, null, this.setRateAlarmConfig, this);
	};
	this.setRateAlarmConfig = function(data, that) {
		that.rateAlarmConfigGridStore || this.createRateAlarmConfigGridStore();
		that.rateAlarmConfigGridStore.loadData(data);
	};
	this.getAmountAlarmConfig = function() {
		tools.getData(Configes.url.getAmountAlarmConfig, null, this.setAmountAlarmConfig, this);
	};
	this.setAmountAlarmConfig = function(data, that) {
		that.amountAlarmConfigGridStore || that.createAmountAlarmConfigGridStore();
		that.amountAlarmConfigGridStore.loadData(data);
	};
	this.getDurationAlarmConfig = function() {
		tools.getData(Configes.url.getDurationAlarmConfig, null, this.setDurationAlarmConfig, this);

	};
	this.setDurationAlarmConfig = function(data, that) {
		that.durationAlarmConfigGridStore || that.createDurationAlarmConfigGridStore();
		that.durationAlarmConfigGridStore.loadData(data);
	};



	this.addScene = function() {
		var params = this.getCurrentSceneValues();
		if (!params) {
			return;
		}
		tools.getData(Configes.url.addScene, params, this.addSceneReturn, this);
	};
	this.addSceneReturn = function(data, that) {

		that.currentSceneId = data["_id"];
		var serverNode = that.getCurrentServerNode();
		var treeNode = {
			text: data["name"],
			iconCls: "i",
			leaf: true,
			type: that.msg.type.scene,
			cls: "serviceDirectoryTreeScene",
			nodeData: data
		};
		var newNode = serverNode.appendChild(treeNode);
		that.treePanel.getSelectionModel().select(newNode);
		that.openCenterPanel(newNode);

		if (that._submitScene) {
			that.submitScene();
		} else {
			tools.toast("添加成功");
		}
	};
	this.updateScene = function() {
		var params = this.getCurrentSceneValues();
		if (!params) {
			return;
		}
		tools.getData(Configes.url.updateScene, params, this.updateSceneReturn, this);
	};
	this.updateSceneReturn = function(data, that) {

		var serverNode = that.getCurrentServerNode();
		var sceneNode = that.getCurrentSceneNode(serverNode);
		var treeNode = {
			text: data["name"],
			iconCls: "i",
			leaf: true,
			type: that.msg.type.scene,
			cls: "serviceDirectoryTreeScene",
			nodeData: data
		};
		var newNode;
		serverNode && sceneNode && (newNode = serverNode.replaceChild(treeNode, sceneNode));
		newNode.parentNode = serverNode;
		that.openCenterPanel(newNode);
		that.treePanel.getSelectionModel().select(newNode);
		if (that._submitScene) {
			that.submitScene();
		} else {
			tools.toast("保存成功");
		}
	};


	// 数据加载模块 end----------------------------



	// 视图模块view
	// 
	// 
	// 主容器-------------------------
	this.viewPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "column",
		cls: "serviceDirectoryMainPanel"
	});

	// 服务目录 树store-------------------
	this.treeRoot = Ext.create("Ext.data.TreeStore", {
		root: {
			expanded: true,
			cls: "serviceDirectoryTreeRoot"
		}
	});

	// 服务目录树标题
	this.createTreeTitlePanel = function() {
		var that = this;
		this.treeTitlePanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			height: 50,
			layout: "border",
			items: [{
				region: "west",
				xtype: "label",
				text: this.msg.treeTitle,
				style: {
					fontSize: "20px",
					color: "#fff",
					lineHeight: "50px"
				}
			}, ]
		});
	};

	// 服务目录树容器
	this.createTreePanel = function() {
		var that = this;
		this.treePanel = Ext.create("MyTreePanel", {
			that: this,
			store: this.treeRoot,
			rootVisible: false,
			border: 0,
			cls: "serviceDirectoryTreePanel",
			listeners: {
				itemcontextmenu: function(tree, record, ele, id, e) {
					e.preventDefault();
					that.menuPanelShow(e, record);
				},
				itemdblclick: function(tree, record, ele, id, e) {
					if (record.isLeaf()) {
						that.openCenterPanelBefore(record);
					}
				}
			}
		});
	};


	// 编辑服务窗口
	this.createEditServerWin = function() {
		var that = this;
		this.editServerWin = Ext.create("Ext.window.Window", {
			width: 500,
			modal: false,
			title: "新增/编辑服务",
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false, //是否可以调整大小
			cls: "window",
			items: [Ext.create("Ext.form.Panel", {
				border: 0,
				defaults: {
					xtype: "textfield",
					labelWidth: 50,
					margin: 5,
					padding: 5,
					anchor: "95%"
				},
				items: [{
					xtype: "hiddenfield",
					name: "_id"
				}, {
					fieldLabel: "服务名",
					name: "name"
				}, {
					fieldLabel: "描述",
					name: "desc"
				}]
			})],
			buttons: [{
				text: "确定",
				handler: function() {
					var data = that.editServerWin.getComponent(0).getForm().getValues();
					if (!data["_id"]) {
						that.addServer(data);
					} else {
						that.editServer(data);
					}
				}
			}, {
				text: "取消",
				handler: function() {
					that.editServerWinHide();
				}
			}]
		});
	};

	// 创建服务目录树标题 and 服务目录树容器
	this.createTreeTitlePanel();
	this.createTreePanel();



	// 服务目录树主容器
	this.treeMainPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 1 / 5,
		margin: 5,
		items: [
			this.treeTitlePanel, this.treePanel
		]
	});

	// 配置服务目录主容器
	this.centerPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 4 / 5,
		margin: 5,
		items: []
	});
	// 场景标题
	this.createCenterTitlePanel = function(serviceName, sceneName) {
		this.centerTitlePanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			defaults: {
				style: {
					fontSize: "20px",
					color: "#fff",
					lineHeight: "50px",
					margin: "0 5px"
				}
			},
			items: [{
				xtype: "label",
				text: serviceName
			}, {
				xtype: "label",
				text: ">>"
			}, {
				xtype: "label",
				text: sceneName || "新增场景"
			}]
		});
	};

	this.createAlarmTypePanel = function(data) {
		var checkboxs = [];
		for (var i = 0, l = data.length; i < l; i++) {
			var checkbox = {
				disabled: true,
				boxLabel: data[i]["NAME"],
				inputValue: data[i]["VALUE"],
				id: "manageAlarmTypeTo" + data[i]["VALUE"],
				boxLabelCls: "radioLabel",
			};
			checkboxs.push(checkbox);
		}
		this.alarmTypePanel = {
			xtype: "panel",
			layout: "vbox",
			items: [{
				xtype: "label",
				text: "* 告警类型",
				style: "color: #fff; font-size: 14px; line-height: 24px;",
				margin: "5 0"
			}, {
				xtype: 'fieldcontainer',
				fieldLabel: '',
				defaultType: "checkboxfield",
				defaults: {
					name: "alarmType",
					margin: "10",
				},
				width: "100%",
				cls: "serviceDirectoryManageFormCheckbox",
				layout: 'hbox',
				items: checkboxs
			}]
		}
	};
	// 场景表单
	this.createCenterFormPanel = function() {
		var that = this;

		this.createBaseFormPanel();
		this.createAlarmConfigFormPanel();
		this.createRequiredFormPanel();
		this.createSceneBtnsPanel();
		this.centerFormPanel = Ext.create("Ext.form.Panel", {
			border: 0,
			items: [this.baseFormPanel,
				this.alarmConfigFormPanel,
				this.requiredFormPanel,
				this.sceneBtnsPanel
			]
		});
	};



	this.createBaseFormPanel = function() {
		var editor = new Editor({
			parentNode: this,
			labelName: "* 监控场景介绍",
			name: "desc",
			size: {
				width: "100%",
				height: 600
			}
		});
		this.createBusinessCheckBox();
		// this.baseFormPanel && this.baseFormPanel.remove();
		this.baseFormPanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			cls: "centerFormPanel",
			defaults: {
				border: 0,
				labelStyle: "color: #fff; font-size: 14px; line-height: 24px;",
				anchor: "100%",
				labelWidth: 80,
				// margin: "5 0",
			},
			items: [{
					xtype: "textfield",
					name: "name",
					fieldLabel: "* 场景名称",
					width: "50%",
					cls: "centerFormPanelInput",
				}, editor, {
					xtype: "panel",
					layout: "vbox",
					items: [{
						xtype: "label",
						text: "* 渠道",
						style: "color: #fff; font-size: 14px; line-height: 24px;",
						margin: "5 0"
					}, Ext.create("Ext.form.field.Tag", {
						store: this.channelStore,
						valueField: "VALUE",
						displayField: "NAME",
						name: "channel",
						editable: false,
						filterPickList: false,
						queryMode: 'local',
						width: "100%",
						cls: "serviceDirectoryManageFormTag"
							// fieldLabel:
					})]
				}, {
					xtype: "panel",
					layout: "vbox",
					items: [{
						xtype: "label",
						text: "* 探测方式",
						style: "color: #fff; font-size: 14px; line-height: 24px;",
						margin: "5 0"
					}, Ext.create("Ext.form.field.Tag", {
						store: this.probeStore,
						valueField: "VALUE",
						displayField: "NAME",
						name: "probe",
						editable: false,
						filterPickList: false,
						queryMode: 'local',
						width: "100%",
						cls: "serviceDirectoryManageFormTag"
							// fieldLabel:
					})]
				},
				this.targetCheckBoxPanel, {
					xtype: "panel",
					layout: "vbox",
					items: [{
						xtype: "label",
						text: "* 探测频率",
						style: "color: #fff; font-size: 14px; line-height: 24px;",
						margin: "5 0"
					}, Ext.create("Ext.form.field.Tag", {
						store: this.probeFrequencyStore,
						valueField: "VALUE",
						displayField: "NAME",
						name: "probeFrequency",
						editable: false,
						filterPickList: false,
						queryMode: 'local',
						width: "100%",
						cls: "serviceDirectoryManageFormTag"
							// fieldLabel:
					})]
				},
				this.businessCheckBoxPanel, {
					xtype: "panel",
					layout: "vbox",
					items: [{
						xtype: "label",
						text: "* 探测方式价值与意义",
						style: "color: #fff; font-size: 14px; line-height: 24px;",
						margin: "5 0"
					}, {
						xtype: "textareafield",
						cls: "centerFormPanelInput",
						name: "detectionMethodsValueAndSignificance",
						height: 100,
						width: "100%",
					}]
				}, {
					xtype: "panel",
					layout: "vbox",
					items: [{
						xtype: "label",
						text: "* 探测原理及架构",
						style: "color: #fff; font-size: 14px; line-height: 24px;",
						margin: "5 0"
					}, {
						xtype: "textareafield",
						cls: "centerFormPanelInput",
						name: "detectionPrincipleAndArchitecture",
						height: 100,
						width: "100%",
					}]
				}, {
					xtype: "panel",
					layout: "vbox",
					items: [{
						xtype: "label",
						text: "* 探测运用范围",
						style: "color: #fff; font-size: 14px; line-height: 24px;",
						margin: "5 0"
					}, {
						xtype: "textareafield",
						cls: "centerFormPanelInput",
						name: "detectingApplicationRange",
						height: 100,
						width: "100%",
					}]
				}, {
					xtype: "panel",
					layout: "vbox",
					items: [{
						xtype: "label",
						text: "* 探测流程及风险分析",
						style: "color: #fff; font-size: 14px; line-height: 24px;",
						margin: "5 0"
					}, {
						xtype: "textareafield",
						cls: "centerFormPanelInput",
						name: "detectionProcessAndRiskAnalysis",
						height: 100,
						width: "100%",
					}]
				}, {
					xtype: "panel",
					layout: "vbox",
					items: [{
						xtype: "label",
						text: "* 省端准备工作",
						style: "color: #fff; font-size: 14px; line-height: 24px;",
						margin: "5 0"
					}, {
						xtype: "textareafield",
						cls: "centerFormPanelInput",
						name: "endPreparationWork",
						height: 100,
						width: "100%",
					}]
				}
			]
		});
	};
	this.createAlarmConfigFormPanel = function() {
		this.alarmConfigTabPanel && this.alarmConfigTabPanel.remove();
		this.createAlarmConfigTabPanel();
		// this.createAlarmTypePanel();
		this.alarmConfigFormPanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			cls: "centerFormPanel",
			margin: "10 0",
			defaults: {
				border: 0,
				labelStyle: "color: #fff; font-size: 14px; line-height: 24px;",
				anchor: "100%",
				labelWidth: 80,
				// margin: "5 0",
			},
			items: [this.alarmTypePanel,
				this.alarmConfigTabPanel, {
					xtype: "panel",
					layout: "hbox",
					margin: "5 0",
					items: [{
						xtype: "label",
						width: "20%",
						text: "* 是否支持告警推送",
						style: "color: #fff; font-size: 14px; line-height: 45px;",
						// margin: "10 0",
					}, {
						xtype: 'fieldcontainer',
						defaultType: "radiofield",
						padding: 5,
						cls: "serviceDirectoryManageFormCheckbox",
						width: "80%",
						defaults: {
							name: "alarmPush",
							width: 100,
							margin: "10",
						},
						layout: 'hbox',
						items: [{
							boxLabel: "是",
							inputValue: true,
							boxLabelCls: "radioLabel",
						}, {
							boxLabel: "否",
							inputValue: false,
							boxLabelCls: "radioLabel",
						}]
					}]
				}, {
					xtype: "panel",
					layout: "hbox",
					margin: "5 0",
					items: [{
						xtype: "label",
						width: "20%",
						text: "* 推送方式",
						style: "color: #fff; font-size: 14px; line-height: 45px;",
						// margin: "10 0",
					}, {
						xtype: 'fieldcontainer',
						defaultType: "checkboxfield",
						padding: 5,
						cls: "serviceDirectoryManageFormCheckbox",
						width: "80%",
						defaults: {
							name: "alarmPushMode",
							margin: "10",
							width: 100
						},
						layout: 'hbox',
						items: [{
							boxLabel: "短信",
							inputValue: "短信",
							boxLabelCls: "radioLabel",
						}, {
							boxLabel: "邮件",
							inputValue: "邮件",
							boxLabelCls: "radioLabel",
						}]
					}]
				}
			]
		});
	};
	// 必填项表单
	this.createRequiredFormPanel = function() {
		this.requiredFormPanel && this.requiredFormPanel.remove();
		this.requiredFormPanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			cls: "centerFormPanel",
			margin: "5 0",
			defaults: {
				border: 0,
				labelStyle: "color: #fff; font-size: 14px; line-height: 24px;",
				anchor: "100%",
				labelWidth: 80,
				// margin: "5 0",
			},
			items: [{
				xtype: "panel",
				layout: "vbox",
				items: [{
					xtype: "label",
					text: "* 省端必填字段",
					style: "color: #fff; font-size: 14px; line-height: 24px;",
					margin: "5 0"
				}, {
					xtype: 'fieldcontainer',
					defaultType: "checkboxfield",
					defaults: {
						name: "required",
						margin: "10",
					},
					width: "100%",
					cls: "serviceDirectoryManageFormCheckbox",
					layout: 'hbox',
					items: [{
						boxLabel: "渠道",
						inputValue: "渠道",
						boxLabelCls: "radioLabel",
					}, {
						boxLabel: "探测方式",
						inputValue: "探测方式",
						boxLabelCls: "radioLabel",
					}, {
						boxLabel: "指标",
						inputValue: "指标",
						boxLabelCls: "radioLabel",
					}, {
						boxLabel: "探测频率",
						inputValue: "探测频率",
						boxLabelCls: "radioLabel",
					}, {
						boxLabel: "业务",
						inputValue: "业务",
						boxLabelCls: "radioLabel",
					}]
				}]
			}]
		});
	};
	// 告警配置Tab
	this.createAlarmConfigTabPanel = function() {
		this.rateAlarmConfigGridPanel && this.rateAlarmConfigGridPanel.remove();
		this.amountAlarmConfigGridPanel && this.amountAlarmConfigGridPanel.remove();
		this.durationAlarmConfigGridPanel && this.durationAlarmConfigGridPanel.remove();
		this.createRateAlarmConfigGridPanel();
		this.createAmountAlarmConfigGridPanel();
		this.createDurationAlarmConfigGridPanel();
		this.alarmConfigTabPanel = Ext.create("Ext.tab.Panel", {
			border: 0,
			plain: true,
			title: "告警配置",
			cls: "alarmConfigTabPanel",
			items: [
				this.rateAlarmConfigGridPanel,
				this.amountAlarmConfigGridPanel,
				this.durationAlarmConfigGridPanel
			]
		});
	};
	// 成功率grid
	this.createRateAlarmConfigGridPanel = function() {
		var that = this;
		this.rateAlarmConfigGridStore || this.createRateAlarmConfigGridStore();
		this.rateAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "成功率告警",
			disable: true,
			cls: "alarmConfigTabGridPanel",
			border: 0,
			autoRender: true,
			autoShow: false,
			store: this.rateAlarmConfigGridStore,
			forceFit: true,
			selType: 'cellmodel',
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})
			],
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false,
				},
				items: [{
					dataIndex: "NAME",
					text: "告警级别",
				}, {
					dataIndex: "TYPE",
					text: "指标",
				}, {
					dataIndex: "CONDITION",
					text: "条件"
				}, {
					dataIndex: "THRESHOLD",
					text: "最低阈值",
					renderer: function(value) {
						console.log();
						value = value || 0;
						value = value + "%";
						return value;
					},
					editor: {
						xtype: 'numberfield',
						keyNavEnabled: false,
						maxValue: 99,
						minValue: 0
					}
				}, {
					dataIndex: "TIME",
					text: "持续时间（是否开放选择）",
					width: 300,
					renderer: function(value, column) {
						var checkboxs = [];
						var data = ["5min", "10min", "15min", "其他"];
						for (var i = 0, l = data.length; i < l; i++) {
							var checked = "";
							for (var j = 0, v_l = value.length; j < v_l; j++) {
								if (value[j] == data[i]) {
									checked = "checked";
								}
							}
							var checkbox = "<laebl style='margin:0 5px;'>" +
								"<input type='checkbox' class='RATE_TIME" +
								column.record.data.ID + "'" +
								checked +
								"  name='time' value='" +
								data[i] + "'>" + data[i] + "</laebl>"
							checkboxs.push(checkbox);
						}
						var html = "<div >" + checkboxs.join("") + "</div>"
						return html;
					},
					listeners: {
						click: function() {
							var grid = that.rateAlarmConfigGridPanel;
							var record = grid.getSelectionModel().getSelection();
							var id = record[0].data.ID;
							var checkboxs = document.getElementsByClassName("RATE_TIME" + id);
							var checked = [];
							for (var i = 0, l = checkboxs.length; i < l; i++) {
								if (checkboxs[i].checked) {
									checked.push(checkboxs[i].value);
								}
							}
							record[0].set("TIME", checked);
						}
					}
				}]
			},
		});
	};
	// 业务量配置grid
	this.createAmountAlarmConfigGridPanel = function() {
		this.amountAlarmConfigGridStore || this.createAmountAlarmConfigGridStore();
		this.amountAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "交易量告警",
			border: 0,
			cls: "alarmConfigTabGridPanel",
			autoRender: true,
			autoShow: false,
			store: this.amountAlarmConfigGridStore,
			forceFit: true,
			selType: 'cellmodel',
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})
			],
			// 开始
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false,
				},
				items: [{
					dataIndex: "NAME",
					text: "告警级别",
				}, {
					dataIndex: "TYPE",
					text: "指标",
				}, {
					dataIndex: "CONDITION",
					text: "条件",
				}, {
					dataIndex: "THRESHOLD",
					text: "最低阈值",
					renderer: function(value) {
						value = value || 0;
						return value;
					},
					editor: {
						xtype: 'numberfield',
						keyNavEnabled: false,
						minValue: 0
					}
				}, {
					dataIndex: "TIME",
					text: "持续时间（是否开放选择）",
					width: 300,
					renderer: function(value, column) {
						var checkboxs = [];
						var data = ["5min", "10min", "15min", "其他"];
						for (var i = 0, l = data.length; i < l; i++) {
							var checked = "";
							for (var j = 0, v_l = value.length; j < v_l; j++) {
								if (value[j] == data[i]) {
									checked = "checked";
								}
							}
							var checkbox = "<laebl style='margin:0 5px;'>" +
								"<input type='checkbox' class='RATE_TIME" +
								column.record.data.ID + "'" +
								checked +
								"  name='time' value='" +
								data[i] + "'>" + data[i] + "</laebl>"
							checkboxs.push(checkbox);
						}
						var html = "<div >" + checkboxs.join("") + "</div>"
						return html;
					},
					listeners: {
						click: function(column, record) {
							var grid = that.amountAlarmConfigGridPanel;
							var record = grid.getSelectionModel().getSelection();
							var id = record[0].data.ID;
							var checkboxs = document.getElementsByClassName("RATE_TIME" + id);
							var checked = [];
							for (var i = 0, l = checkboxs.length; i < l; i++) {
								if (checkboxs[i].checked) {
									checked.push(checkboxs[i].value);
								}
							}
							record[0].set("TIME", checked);
						}
					}
				}]
			},
			// 结束
		});
	};
	//  业务时长
	this.createDurationAlarmConfigGridPanel = function() {
		this.durationAlarmConfigGridStore || this.createDurationAlarmConfigGridStore();
		this.durationAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "响应时间告警",
			border: 0,
			cls: "alarmConfigTabGridPanel",
			autoRender: true,
			autoShow: false,
			store: this.durationAlarmConfigGridStore,
			forceFit: true,
			selType: 'cellmodel',
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})
			],
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false,

				},
				items: [{
					dataIndex: "NAME",
					text: "告警级别",
				}, {
					dataIndex: "TYPE",
					text: "指标",
				}, {
					dataIndex: "CONDITION",
					text: "条件",
				}, {
					dataIndex: "THRESHOLD",
					text: "最低阈值",
					renderer: function(value) {
						value = value || 0;
						value = value + "s";
						return value;
					},
					editor: {
						xtype: 'numberfield',
						keyNavEnabled: false,
						minValue: 0
					}
				}, {
					dataIndex: "TIME",
					text: "持续时间（是否开放选择）",
					width: 300,
					renderer: function(value, column) {
						var checkboxs = [];
						var data = ["5min", "10min", "15min", "其他"];
						for (var i = 0, l = data.length; i < l; i++) {
							var checked = "";
							for (var j = 0, v_l = value.length; j < v_l; j++) {
								if (value[j] == data[i]) {
									checked = "checked";
								}
							}
							var checkbox = "<laebl style='margin:0 5px;'>" +
								"<input type='checkbox' class='RATE_TIME" +
								column.record.data.ID + "'" +
								checked +
								"  name='time' value='" +
								data[i] + "'>" + data[i] + "</laebl>"
							checkboxs.push(checkbox);
						}
						var html = "<div >" + checkboxs.join("") + "</div>"
						return html;
					},
					listeners: {
						click: function(column, record) {
							var grid = that.durationAlarmConfigGridPanel;
							var record = grid.getSelectionModel().getSelection();
							var id = record[0].data.ID;
							var checkboxs = document.getElementsByClassName("RATE_TIME" + id);
							var checked = [];
							for (var i = 0, l = checkboxs.length; i < l; i++) {
								if (checkboxs[i].checked) {
									checked.push(checkboxs[i].value);
								}
							}
							record[0].set("TIME", checked);
						}
					}
				}]
			},
		});
	};

	this.removeSaveSceneWin = function() {
		Ext.Msg.show({
			title: "提示",
			modal: true,
			msg: "确定要重新编辑吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					that.removeSaveScene();
					return;
				} else {
					return;
				}
			}
		})
	};

	//  按钮组
	this.createSceneBtnsPanel = function() {
		this.sceneBtnsPanle && this.sceneBtnsPanel.remove();
		var btns = new Array();
		var saveBtn = {
			xtype: "button",
			text: "保存",
			baseCls: "x-btn base-btn",
			cls: "btn-save",
			handler: Ext.bind(this.saveScene, this)
		};
		var removeSaveBtn = {
			xtype: "button",
			text: "重新编辑",
			baseCls: "x-btn base-btn",
			cls: "btn-remove",
			handler: Ext.bind(this.removeSaveSceneWin, this)
		};
		var removeSceneBtn = {
			xtype: "button",
			text: "删除",
			baseCls: "x-btn base-btn",
			cls: "btn-remove",
			handler: Ext.bind(this.removeScene, this)
		};
		var submitBtn = {
			xtype: "button",
			text: "提交",
			baseCls: "x-btn base-btn",
			cls: "btn-submit",
			handler: Ext.bind(this.saveAndSubmitScene, this)
		};

		if (this.currentEditType == "addScene") {
			btns.push(saveBtn);
			btns.push(submitBtn);
		} else if (this.currentEditType == "updateScene") {
			btns.push(saveBtn);
			btns.push(removeSceneBtn);
			if (this.currentSceneData.statu && this.currentSceneData.edit) {
				btns.push(removeSaveBtn);
			}
			btns.push(submitBtn);
		}
		this.sceneBtnsPanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			style: "text-align: center;",
			defaults: {
				height: 30,
				width: 120,
				margin: "10 10 10 0"
			},
			items: btns
		});
	};


	//  store 
	// 成功率
	this.createRateAlarmConfigGridStore = function() {
		this.rateAlarmConfigGridStore = Ext.create("Ext.data.Store", {
			model: "serviceDirectoryManage.AlarmConfig",
		});
	};
	//  业务量
	this.createAmountAlarmConfigGridStore = function() {
		this.amountAlarmConfigGridStore = Ext.create("Ext.data.Store", {
			model: "serviceDirectoryManage.AlarmConfig",
		});
	};
	// 业务时长
	this.createDurationAlarmConfigGridStore = function() {
		this.durationAlarmConfigGridStore = Ext.create("Ext.data.Store", {
			model: "serviceDirectoryManage.AlarmConfig",
		});
	};
	Ext.define('serviceDirectoryManage.AlarmConfig', {
		extend: 'Ext.data.Model',
		fields: ["NAME", "TYPE", "CONDITION", "THRESHOLD", "TIME"]
	});
	this.createChannelStore = function() {
		this.channelStore = Ext.create("Ext.data.Store", {
			fields: ["NAME", "VALUE"]
		});
	};
	this.createProbeStore = function() {
		this.probeStore = Ext.create("Ext.data.Store", {
			fields: ["NAME", "VALUE"]
		});
	};
	this.createProbeFrequencyStore = function() {
		this.probeFrequencyStore = Ext.create("Ext.data.Store", {
			fields: ["NAME", "VALUE"]
		});
	};
	// 树右键菜单容器
	this.createMenuPanel = function() {
		var that = this;
		this.menuPanel = Ext.create("Ext.menu.Menu", {
			cls: "serviceDirectoryTreeMenu",
			width: 100,
			renderTo: Ext.getBody(),
			defaults: {
				padding: 5
			},
			items: [{
				itemId: "addServer",
				region: "east",
				icon: "resources/images/add.png",
				iconCls: "more",
				text: "新增服务",
				// cls: "serviceDirectory-addserver",
				handler: function() {
					that.editServerWinShow();
				}
			}, {
				itemId: "editServer",
				icon: "resources/images/update.png",
				iconCls: "more",
				text: "编辑服务",
				handler: function() {
					var record = that.treePanel.getSelectionModel().getSelection()[0];
					that.editServerWinShow(record);
				}
			}, {
				itemId: "deleteServer",
				icon: "resources/images/delete.png",
				iconCls: "more",
				text: "删除服务",
				handler: function() {
					var record = that.treePanel.getSelectionModel().getSelection()[0];
					Ext.Msg.show({
						title: "警告",
						modal: true,
						msg: "是否删除该类型所有服务内容？",
						buttonText: {
							yes: "确定",
							no: "取消"
						},
						fn: function(btn) {
							if (btn === "yes") {
								that.deleteServer(record.data.nodeData);
								return;
							} else {
								return;
							}
						}
					});
				}
			}, {
				itemId: "addScene",
				text: "新增场景",
				icon: "resources/images/add.png",
				iconCls: "more",
				handler: function() {
					var record = that.treePanel.getSelectionModel().getSelection()[0];
					that.openAddCenterPanel(record);
				}
			}, {
				itemId: "updateScene",
				text: "编辑场景",
				icon: "resources/images/update.png",
				iconCls: "more",
				handler: function() {
					var record = that.treePanel.getSelectionModel().getSelection()[0];
					that.openCenterPanel(record);
				}
			}, {
				itemId: "deleteScene",
				icon: "resources/images/delete.png",
				text: "删除场景",
				iconCls: "more",
				handler: Ext.bind(this.removeScene, this)
			}]
		});
	};
	this.createMenuPanel();
}
ServiceDirectoryManage.prototype = new Page(Configes.page.serviceDirectoryManage);
///<jscompress sourcefile="serviceMade.js" />
/**
 *	creator godz
 *
 * 	2016 08 23
 *	服务定制
 * 
 */

function ServiceMade(parentNode) {
	Page.call(this, Configes.page.serviceMade);
	this._parentNode = parentNode;
	// 基础配置
	this.msg = new function() {
		this.treeTitle = "服务目录";
		this.type = new function() {
			this.server = "server";
			this.scene = "scene";
		};
		this.editTypeToAdd = "editTypeToAdd";
		this.editTypeToUpdate = "editTypeToUpdate";
	};
	// 初始化页面
	this.run = function(sceneId) {
		this.jumpSceneId = sceneId;
		if (!this.loading) {
			this.initView();
			this.getSelfInfo();
		}
		this.loading = true;
		this.mainPanelShow();

		if (this.jumpSceneId) {
			this.selectSceneNode(this.jumpSceneId);
			this.jumpSceneId = null;
		}
	};
	this.initView = function() {
		this.mainTreePanel.add([this.treeTitlePanel, this.treePanel]);
		this.viewPanel.add(this.mainTreePanel, this.centerPanel);
		this.centerPanel.hide();
		var mainPanel = this.getMainPanel();
		mainPanel.add(this.viewPanel);
	};


	/**
	 *
	 *
	 *	ctrl 控制 =================================================================
	 * 
	 */
	this.openCenterPanel = function(tree, record, ele, id, e) {
		this.initCenterPanel();
		this.centerPanel.hide();
		if (!record.isLeaf()) {
			return;
		}
		this.sceneId = record.data.nodeData["_id"];

		var sceneId = record.data.nodeData["_id"];
		var sceneName = record.data.nodeData["name"];
		var serviceName = record.parentNode.data.nodeData["name"];

		// 标题
		var titlePanel = this.centerTitlePanel.getComponent(0);
		var serviceNamePanel = titlePanel.getComponent(0);
		var sceneNamePanel = titlePanel.getComponent(2);
		serviceNamePanel.setText(serviceName);
		sceneNamePanel.setText(sceneName);


		this.getScene(sceneId);
		this.getServiceingOrder(sceneId);
		this.centerPanel.show();
	};


	this.setSceneOver = function(sceneId) {
		var sceneNode = this.getSceneNodeById(sceneId);
		var that = this;
		if (sceneNode.data.nodeData.edit) {
			Ext.Msg.show({
				title: "提示",
				modal: true,
				msg: "存在未提交的订制服务内容，是否继续上次服务定制?",
				buttonText: {
					yes: "继续编辑",
					no: "重新编辑"
				},
				fn: function(btn) {
					if (btn === "yes") {
						that.getSaveSceneOrder(sceneId);
						return;
					} else {
						return;
					}
				}
			});
		}
	};

	this.getSceneNodeById = function(sceneId) {
		var root = this.treeRoot.getRoot();
		var sceneNode;
		root.eachChild(function(node) {
			node.eachChild(function(childNode) {
				if (childNode.data.nodeData._id == sceneId) {
					sceneNode = childNode;
				}
			}, this);
		}, this);
		return sceneNode;
	};


	this.initCenterPanel = function() {
		this.centerFormPanel.getForm().reset();
		Ext.tip.QuickTipManager.init();
		this.alarmServiceBtnPanel.getComponent(0).setIcon("resources/images/-.png");
		this.monitorBtnPanel.getComponent(0).setIcon("resources/images/-.png");
		this.faultServiceBtnPanel.getComponent(0).setIcon("resources/images/-.png");
		this.dataServiceBtnPanel.getComponent(0).setIcon("resources/images/-.png");
		this.monitorFormPanel.show();
		this.alarmServiceFormPanel.hide();
		this.faultServiceFormPanel.hide();
		this.dataServiceFormPanel.hide();

		this.initAlarmConfigPanel();
	};
	this.searchScene = function(input, e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			var value = input.getValue();
			var root = this.treeRoot.getRoot();
			var sceneNode;
			root.eachChild(function(node) {
				if (node.data.nodeData["name"] == value) {
					this.treePanel.getSelectionModel().select(node);
				} else {
					node.eachChild(function(childNode) {
						if (childNode.data.nodeData["name"] == value) {
							this.treePanel.getSelectionModel().select(childNode);
							sceneNode = childNode;
						}
					}, this);
				}

			}, this);
			sceneNode && this.openCenterPanel(this.treePanel, sceneNode);
		}
	};
	// 设置草稿内容
	this.setSaveSceneOrderData = function(data) {
		var form = this.centerFormPanel.getForm();
		form.setValues(data);


		var rateAlarmConfig = data["rateAlarmConfig"];
		var amountAlarmConfig = data["amountAlarmConfig"];
		var durationAlarmConfig = data["durationAlarmConfig"];
		rateAlarmConfig && this.setAlarmConfigData(this.rateAlarmConfigGridStore, rateAlarmConfig);
		amountAlarmConfig && this.setAlarmConfigData(this.amountAlarmConfigGridStore, amountAlarmConfig);
		durationAlarmConfig && this.setAlarmConfigData(this.durationAlarmConfigGridStore, durationAlarmConfig);
	};
	this.setAlarmConfigData = function(store, data) {
		for (var i = 0, l = data.length; i < l; i++) {
			store.data.each(function(record) {
				var id = record.get("ID");
				if (id == data[i]["ID"]) {
					record.set("SELECE", data[i]["SELECE"]);
					record.set("SELECE_TIME", data[i]["SELECE_TIME"]);
					record.set("SELECE_TIME_OTHER", data[i]["SELECE_TIME_OTHER"]);
					record.set("SELECE_THRESHOLD", data[i]["SELECE_THRESHOLD"]);
				}
			});
		}

	}

	// 对打开的场景的设置
	this.channelBox = function(data) {
		var fieldcontainer = this.monitorChannelPanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
			}
			radiofields.push(radiofield);
		}
		fieldcontainer.add(radiofields);
	};
	this.probeBox = function(data) {
		var fieldcontainer = this.monitorProbePanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
			}
			radiofields.push(radiofield);
		}
		fieldcontainer.add(radiofields);
	};
	this.businessBox = function(data) {
		var fieldcontainer = this.monitorBusinessPanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
			}
			radiofields.push(radiofield);
		}
		fieldcontainer.add(radiofields);
	};
	this.probeFrequencyBox = function(data) {
		var fieldcontainer = this.monitorProbeFrequencyPanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
			}
			radiofields.push(radiofield);
		}
		fieldcontainer.add(radiofields);
	};
	this.targetBox = function(data) {
		var fieldcontainer = this.monitorTargetPanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
				listeners: {
					change: Ext.bind(this.targetChange, this)
				}
			}
			radiofields.push(radiofield);
		}
		fieldcontainer.add(radiofields);
	};
	this.alarmBox = function(data, allData) {
		var fieldcontainer = this.alarmTypePanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
				disabled: true
			}
			radiofields.push(radiofield);
			if (data[i] == "成功率") {
				this.alarmConfigPanel.add(this.rateAlarmConfigGridPanel);
				this.rateAlarmConfigGridStore.loadData(allData["rateAlarmConfig"]);
			} else if (data[i] == "交易量") {
				this.alarmConfigPanel.add(this.amountAlarmConfigGridPanel);
				this.amountAlarmConfigGridStore.loadData(allData["amountAlarmConfig"]);
			} else if (data[i] == "响应时间") {
				this.alarmConfigPanel.add(this.durationAlarmConfigGridPanel);
				this.durationAlarmConfigGridStore.loadData(allData["durationAlarmConfig"]);
			}
		}
		fieldcontainer.add(radiofields);
		var panel = this.alarmConfigPanel.getComponent(0);
		panel && this.alarmConfigPanel.setActiveTab(panel);
	};
	// 初始化告警配置
	this.initAlarmConfigPanel = function() {
		this.alarmConfigPanel.removeAll(true);
		this.rateAlarmConfigGridStore.loadData([]);
		this.amountAlarmConfigGridStore.loadData([]);
		this.durationAlarmConfigGridStore.loadData([]);
		this.createRateAlarmConfigGridPanel();
		this.createAmountAlarmConfigGridPanel();
		this.createDurationAlarmConfigGridPanel();
	};
	// 告警推送的显示
	this.alarmPushBox = function(isShow, data) {
		var fieldcontainer = this.alarmPushModePanel.getComponent(1);
		fieldcontainer.removeAll();
		if (isShow) {
			this.alarmPushPanel.show();
			this.alarmPushModePanel.show();

			var items = [];
			for (var i = 0, l = data.length; i < l; i++) {
				if (data[i] == "短信") {
					items.push({
						boxLabel: "短信",
						inputValue: "短信",
						name: "alarmPushMode",
						boxLabelCls: "radioLabel",
					});
					items.push({
						width: 250,
						xtype: "textfield",
						fieldLabel: "号码",
						margin: "10",
						labelWidth: 50,
						name: "alarmPushModeToPhone",
						cls: "centerFormPanelInput",
						labelStyle: "color: #ddd; font-size: 14px; "
					})
				}

				if (data[i] == "邮件") {
					items.push({
						boxLabel: "邮件",
						inputValue: "邮件",
						name: "alarmPushMode",
						boxLabelCls: "radioLabel",
					});
					items.push({
						width: 250,
						xtype: "textfield",
						fieldLabel: "邮箱",
						margin: "10",
						name: "alarmPushModeToEmail",
						cls: "centerFormPanelInput",
						labelWidth: 50,
						labelStyle: "color: #ddd; font-size: 14px;"
					})
				}
			}

			fieldcontainer.add(items);
		} else {
			this.alarmPushPanel.hide();
			this.alarmPushModePanel.hide();
		}
	};
	// 点击按钮控制配置窗口的显示
	this.configFormPanelShow = function(btn) {
		if (btn.formPanel.isHidden()) {
			btn.formPanel.show();
			btn.setIcon("resources/images/-.png");
		} else {
			btn.formPanel.hide();
			btn.setIcon("resources/images/+.png");
		}
	};
	// 业务的全选
	this.businessSelect = function(checkbox) {
		var value = checkbox.getValue();
		var items = this.monitorBusinessPanel.getComponent(1).items;
		items.each(function(box) {
			box.setValue(value);
		});
	};
	// 搜索业务
	this.searchBusiness = function(textfield, e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			var value = textfield.getValue();
			var panel = this.monitorBusinessPanel.getComponent(1)
			var items = panel.items;
			items.each(function(checkbox) {
				if (checkbox.boxLabel == value) {
					var x = checkbox.getPosition()[0];
					var y = checkbox.getPosition()[1];
					panel.scrollBy(x, y, true);
					checkbox.setValue(true);
				}
			}, this);
		}
	};


	this.getCurrentSceneValues = function() {
		var form = this.centerFormPanel.getForm();
		var values = form.getValues();

		if (this.currentSceneId) {
			values["sceneId"] = this.currentSceneId;
		}
		var rateAlarmConfig = this.getAlarmConfigData(this.rateAlarmConfigGridStore);
		var amountAlarmConfig = this.getAlarmConfigData(this.amountAlarmConfigGridStore);
		var durationAlarmConfig = this.getAlarmConfigData(this.durationAlarmConfigGridStore);
		values["rateAlarmConfig"] = rateAlarmConfig;
		values["amountAlarmConfig"] = amountAlarmConfig;
		values["durationAlarmConfig"] = durationAlarmConfig;

		if (!this.isBlank(values)) {
			return false;
		}
		return values;
	};


	// 判断是否为空
	this.isBlank = function(values) {

		if (!values["channel"]) {
			tools.toast("请选择渠道");
			return null;
		}
		if (!values["probe"]) {
			tools.toast("请选择探测方式");
			return null;
		}
		if (!values["probeFrequency"]) {
			tools.toast("请选择探测频率");
			return null;
		}
		if (!values["business"]) {
			tools.toast("请选择业务");
			return null;
		}
		if (!values["target"]) {
			tools.toast("请选择指标");
			return null;
		}
		// 告警配置
		if (values["alarmType"]) {

			// 判断阈值
			// 
			var result = true;
			if (typeof values["alarmType"] == "object") {
				for (var i = 0, l = values["alarmType"].length; i < l; i++) {
					var value = values["alarmType"][i];
					result = result && this.isThresholdValueLimit(values, value);
				}
			} else {
				var value = values["alarmType"];
				result = this.isThresholdValueLimit(values, value);
			}
			if (!result) {
				return null;
			}

			if (values["alarmPush"]) {
				if (!values["alarmPushMode"]) {
					tools.toast("请选择告警推送方式");
				}
				return null;
			}
		}

		if (values["probeData"]) {
			if (!values["probeDataHost"]) {
				tools.toast("探测明细数据接口地址不能为空");
				return null;
			}
			if (!values["probeDataPort"]) {
				tools.toast("探测明细数据端口不能为空");
				return null;
			}
			if (!values["transmissionFrequency"]) {
				tools.toast("探测明细数据传输频率不能为空");
				return null;
			}
			if (!values["dataFile"]) {
				tools.toast("探测明细数据数据文件不能为空");
				return null;
			}
		}
		if (values["statisticalData"]) {
			if (!values["statisticalHost"]) {
				tools.toast("数据统计接口地址不能为空");
				return null;
			}
			if (!values["statisticalPort"]) {
				tools.toast("数据统计端口不能为空");
				return null;
			}
			if (!values["statisticalTarget"]) {
				tools.toast("数据统计指标不能为空");
				return null;
			}
			if (!values["statisticalGranularity"]) {
				tools.toast("数据统计粒度不能为空");
				return null;
			}
			if (!values["statisticalTransmissionFrequency"]) {
				tools.toast("数据统计频率不能为空");
				return null;
			}
		}
		return true;
	};


	// 阈值限制
	this.isThresholdValueLimit = function(values, value) {
		var result = true;
		var rateAlarmConfig = values["rateAlarmConfig"];
		var amountAlarmConfig = values["amountAlarmConfig"];
		var durationAlarmConfig = values["durationAlarmConfig"];
		if (value == "成功率") {
			result = this.selectIsBlank(rateAlarmConfig) && this.selectTimeIsBlank(rateAlarmConfig) && this.thresholdValueLimit(rateAlarmConfig);
		} else if (value == "交易量") {
			result = this.selectIsBlank(amountAlarmConfig) && this.selectTimeIsBlank(amountAlarmConfig) && this.thresholdValueLimit(amountAlarmConfig);
		} else if (value == "响应时长") {
			result = this.selectIsBlank(durationAlarmConfig) && this.selectTimeIsBlank(durationAlarmConfig) && this.thresholdValueLimit(durationAlarmConfig);
		}
		return result;
	};
	//  告警选择是否为空
	this.selectIsBlank = function(alarmConfig) {
		var result = true;
		for (var i = 0, l = alarmConfig.length; i < l; i++) {
			result = result || alarmConfig[i]["SELECE"];
		}
		if (!result) {
			tools.toast("告警配置不能为空");
		}
		return result;
	};
	//  
	this.selectTimeIsBlank = function(alarmConfig) {
		var result = true;
		for (var i = 0, l = alarmConfig.length; i < l; i++) {
			if (alarmConfig["SELECE"]) {
				if (alarmConfig["SELECE_TIME"]) {
					if (alarmConfig["SELECE_TIME"] == "其他") {
						if (alarmConfig["SELECE_TIME_OTHER"]) {
							result = false;
						}
					}
				} else {
					result = false;
				}
			}
		}
		if (!result) {
			tools.toast("告警配置不能为空");
		}
		return result;
	};
	// 阈值限制判断
	this.thresholdValueLimit = function(alarmConfig) {
		for (var i = 0, l = alarmConfig.length; i < l; i++) {
			var level = alarmConfig[i]["NAME"];
			var name = alarmConfig[i]["TYPE"];
			var condition = alarmConfig[i]["CONDITION"];
			var select = alarmConfig[i]["SELECE"];
			var threshold = alarmConfig[i]["SELECE_THRESHOLD"];
			var minThreshold = alarmConfig[i]["THRESHOLD"];
			var nextThreshold;
			if (select) {
				if (alarmConfig[i + 1]) {
					nextThreshold = alarmConfig[i + 1]["THRESHOLD_SELECT"];
				}
				if (threshold < minThreshold) {
					tools.toast(name + "的级别：" + level + "阈值不能小于最低阈值");
					return false;
				}

				if (!threshold) {
					tools.toast(name + "的级别：" + level + "告警配置不能为空");
					return false;
				}
				if (nextThreshold) {
					if (condition == "小于") {
						if (threshold < nextThreshold) {
							// tools.toast(name + "的级别：" + level + "不能" + condition + "它的下一级别");
							tools.toast("高级别告警的阀值必须比较低级别告警的阀值更严格，请重新配置告警");
							return false;
						}
					} else if (condition == "大于") {
						if (threshold > nextThreshold) {
							// tools.toast(name + "的级别：" + level + "不能" + condition + "它的下一级别");
							tools.toast("高级别告警的阀值必须比较低级别告警的阀值更严格，请重新配置告警");
							return false;
						}
					}
				}
			}
		}
		return true;
	};
	// 获取告警配置数据
	this.getAlarmConfigData = function(store) {
		var items = store.data;
		var data = new Array();
		items.each(function(record) {
			data.push(record.data);
		});
		return data;
	};

	// 保存前
	this.saveOrderBefor = function() {
		var values = this.getCurrentSceneValues();
		this.saveOrder(values);
	};

	// 提交前
	this.submitOrderBefor = function() {
		var values = this.getCurrentSceneValues();
		this.submitOrder(values);
	};

	// 指标关联告警类型
	this.targetChange = function(checkbox) {
		var value = checkbox.inputValue;
		var check = checkbox.getValue();
		var items = this.alarmTypePanel.getComponent(1).items;
		items.each(function(panel) {
			if (panel.inputValue == value) {
				panel.setDisabled(!check);
				!check && panel.setValue(check);
			}
		})

	};
	this.openOrderList = function() {
		var sceneId = this.sceneId;
		this._parentNode.openContent(Configes.page.myOrder, {
			jumpSceneId: sceneId,
			jumpStatuId: 0
		});
	};
	this.submitOver = function() {
		var sceneId = this.sceneId;
		var sceneNode = this.getSceneNodeById(sceneId);
		var form = this.centerFormPanel.getForm();
		var values = form.getValues();
		if (values["submitOver"]) {
			this.openCenterPanel(this, sceneNode);
		} else {
			this._parentNode.openContent(Configes.page.myOrder, {
				jumpSceneId: sceneId,
				jumpStatuId: 1
			});
		}
	};
	// 保存订单
	this.saveOrder = function(values) {
		tools.getData(Configes.url.saveOrder, values, this.saveOrderReturn, this);
	};
	this.saveOrderReturn = function(data, that) {
		var sceneId = that.sceneId;
		var sceneNode = that.getSceneNodeById(sceneId);
		sceneNode.data.nodeData.edit = 0;
		this.openCenterPanel(that, sceneNode);
		tools.toast("保存成功");
	};

	//  提交订单
	this.submitOrder = function(values) {
		tools.getData(Configes.url.submitOrder, values, this.submitOrderReturn, this);
	};

	this.submitOrderReturn = function(data, that) {
		var sceneId = that.sceneId;
		that.removeSaveOrder(sceneId);
		tools.toast("提交成功");
		that.submitOver();
	};
	// 移除保存的数据
	this.removeSaveOrder = function(sceneId) {
		var params = {
			sceneId: sceneId
		}
		tools.getData(Configes.url.removeSaveOrder, params, this.removeSaveOrderReturn, this);
	};
	this.removeSaveOrderReturn = function(data, that) {
		// 移除成功
	};
	/**
	 *
	 *
	 *	model 数据加载模块=============================================================
	 *
	 *
	 * 
	 */

	// 加载个人信息
	this.getSelfInfo = function() {
		tools.getData(Configes.url.view_getSelfInfo, null, this.setSelfInfo, this);
	};
	this.setSelfInfo = function(data, that) {
		that.userInfo = data;
		that.getServerList();
	};

	// 加载服务类列表
	this.getServerList = function() {
		tools.getData(Configes.url.getServerList, null, this.setServerList, this);
	};
	this.setServerList = function(data, that) {
		var treeData = [];
		var root = that.treeRoot.getRoot();
		for (var i = 0, l = data.length; i < l; i++) {
			var treeNode = {
				expanded: true,
				text: data[i]["name"],
				iconCls: "i",
				leaf: false,
				isLoad: false,
				nodeData: data[i],
				type: that.msg.type.server,
				cls: "serviceDirectoryTreeType",
				children: []
			}
			treeData.push(treeNode);
			var node = root.appendChild(treeNode);
			that.getSceneList(node);
		}
	};

	// 加载场景列表
	this.getSceneList = function(node) {
		var callbackParams = {
			that: this,
			node: node
		}
		var params = {
			serviceId: node.data.nodeData._id
		}
		tools.getData(Configes.url.getSceneList + node.data.nodeData._id, params, this.setSceneList, callbackParams);
	};
	this.setSceneList = function(data, params) {
		var treeData = [];
		var that = params.that;
		var node = params.node;
		for (var i = 0, l = data.length; i < l; i++) {
			var treeNode = {
				text: data[i]["name"],
				iconCls: "i",
				leaf: true,
				type: that.msg.type.scene,
				cls: "serviceDirectoryTreeScene",
				nodeData: data[i]
			}
			treeData.push(treeNode);
		};
		node.removeAll();
		node.appendChild(treeData);
		node.data.isLoad = true;


		if (that.jumpSceneId) {
			var isOpen = that.selectSceneNode(that.jumpSceneId);
			isOpen && (that.jumpSceneId = null)
		}
	};
	this.selectSceneNode = function(senceId) {
		var root = this.treeRoot.getRoot();
		var sceneNode;
		root.eachChild(function(node) {
			node.eachChild(function(childNode) {
				if (childNode.data.nodeData["_id"] == senceId) {
					this.treePanel.getSelectionModel().select(childNode);
					sceneNode = childNode;
				}
			}, this);
		}, this);
		sceneNode && this.openCenterPanel(null, sceneNode);
		return sceneNode;
	};

	// 加载场景列表
	this.getScene = function(sceneId) {
		var params = {
			sceneId: sceneId
		};
		var callbackParams = {
			that: this,
			sceneId: sceneId
		}
		tools.getData(Configes.url.getScene, null, this.setScene, callbackParams);
	};
	this.setScene = function(data, callbackParams) {
		var that = callbackParams.that;
		var sceneId = callbackParams.sceneId;
		that.channelBox(data["channel"]);
		that.probeBox(data["probe"]);
		that.probeFrequencyBox(data["probeFrequency"]);
		that.businessBox(data["business"]);
		that.targetBox(data["target"]);
		that.alarmBox(data["alarmType"], data);
		that.alarmPushBox(data["alarmPush"], data["alarmPushMode"]);

		that.setSceneOver(sceneId);
	};
	// 获取用户草稿
	this.getSaveSceneOrder = function(sceneId) {
		var params = {
			sceneId: sceneId
		}
		tools.getData(Configes.url.getSaveSceneOrder, params, this.setSaveSceneOrder, this);
	};
	this.setSaveSceneOrder = function(data, that) {
		that.setSaveSceneOrderData(data);
	};

	this.getServiceingOrder = function(sceneId) {
		var params = {
			sceneId: sceneId
		}
		tools.getData(Configes.url.getServiceingOrder, params, this.setServiceingOrder, this);
	};
	this.setServiceingOrder = function(data, that) {
		var form = that.centerFormPanel.getForm();
		data && form.setValues({
			serviceing: data
		});
	};
	/**
	 *
	 *
	 * 
	 *
	 *	Store ======================================================
	 *
	 *
	 * 
	 * 
	 */
	this.treeRoot = Ext.create("Ext.data.TreeStore", {
		root: {
			expanded: true,
			cls: "serviceDirectoryTreeRoot"
		}
	});
	Ext.define('serviceDirectory.AlarmConfig', {
		extend: 'Ext.data.Model',
		fields: ["NAME", "TYPE", "CONDITION", "THRESHOLD", "SELECE_THRESHOLD", "TIME", "SELECE_TIME", "SELECE_TIME_OTHER", "SELECE"]
	});
	this.rateAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "serviceDirectory.AlarmConfig",
	});
	this.amountAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "serviceDirectory.AlarmConfig",
	});
	this.durationAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "serviceDirectory.AlarmConfig",
	});
	/**
	 *
	 * view  ===============================================================
	 * 
	 */

	// 主容器
	this.viewPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "column",
		cls: "serviceDirectoryMainPanel"
	});
	// 服务目录树主容器
	this.mainTreePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 1 / 5,
		margin: 5,
	});
	// 服务目录标题
	this.treeTitlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		width: "100%",
		// height: 50,
		// layout: "border",
		items: [{
			region: "west",
			xtype: "label",
			text: "服务目录",
			style: {
				fontSize: "20px",
				color: "#fff",
				lineHeight: "30px"
			}
		}, {
			// region: "east",

			height: 30,
			margin: "5 0",
			border: 0,
			xtype: "panel",
			items: [{
				width: "100%",
				xtype: "textfield",
				cls: "centerFormPanelInput searchInput",
				listeners: {
					specialKey: Ext.bind(this.searchScene, this)
				}
			}]

		}]
	});
	// 服务目录树
	this.treePanel = Ext.create("MyTreePanel3", {
		that: this,
		store: this.treeRoot,
		rootVisible: false,
		border: 0,
		cls: "serviceDirectoryTreePanel",
		listeners: {
			itemdblclick: Ext.bind(this.openCenterPanel, this)
		}
	});



	// 查看 标题
	this.centerTitlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "border",
		height: 35,
		defaults: {
			style: {
				fontSize: "20px",
				color: "#fff",
				lineHeight: "30px",
				margin: "0 5px",
				border: 0,
			}
		},
		items: [{
			xtype: "panel",
			defaults: {
				style: {
					fontSize: "20px",
					color: "#fff",
					lineHeight: "30px",
					margin: "0 5px",
					border: 0,
				}
			},
			items: [{
				xtype: "label",
				text: ""
			}, {
				xtype: "label",
				text: ">>"
			}, {
				xtype: "label",
				text: ""
			}, ]
		}]
	});


	this.serviceingPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		width: "100%",
		cls: "centerFormPanel",
		items: [{
			xtype: "panel",
			layout: "border",
			height: 35,
			// layout: "column",
			width: "100%",
			defaults: {
				height: 35,
			},
			items: [{
				width: 100,
				region: "west",
				xtype: "panel",
				border: 0,
				items: [{
					xtype: "label",
					text: "已定制的服务：",
					style: "color: #fff; font-size: 14px; line-height: 35px;",
					margin: "5 0"
				}]
			}, {
				// width: 300,
				region: "east",
				xtype: "panel",
				layout: "hbox",
				border: 0,
				items: [{
					xtype: "button",
					// baseCls: "x-btn base-btn",
					// width: 100,
					text: "查看已有服务",
					height: 25,
					handler: Ext.bind(this.openOrderList, this)
				}],
			}]
		}, {
			xtype: "textareafield",
			width: "100%",
			height: 50,
			readOnly: true,
			labelWidth: 50,
			name: "serviceing",
			cls: "centerFormPanelInput",
			labelStyle: "color: #ddd; font-size: 14px; "
		}]
	});

	//  监控 渠道
	this.monitorChannelPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "渠道 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "radiofield",
			defaults: {
				name: "channel",
				margin: "10",
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox'
		}]
	});
	// 监控 探测方式
	this.monitorProbePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "探测方式 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "radiofield",
			defaults: {
				name: "probe",
				margin: "10",
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox'
		}]
	});
	// 监控 业务
	this.monitorBusinessPanel = Ext.create("Ext.panel.Panel", {
		xtype: "panel",
		layout: "vbox",
		items: [{
			xtype: "panel",
			layout: "border",
			height: 35,
			// layout: "column",
			width: "100%",
			defaults: {
				height: 35,
			},
			items: [{
				width: 100,
				region: "west",
				xtype: "panel",
				border: 0,
				items: [{
					xtype: "label",
					text: "* 业务",
					style: "color: #fff; font-size: 14px; line-height: 35px;",
					margin: "5 0"
				}]
			}, {
				// width: 300,
				region: "east",
				xtype: "panel",
				layout: "hbox",
				border: 0,
				items: [{
					xtype: "checkboxfield",
					// width: 100,
					boxLabel: "全选",
					height: 35,
					inputValue: "1",
					boxLabelCls: "radioLabel",
					margin: "5 10",
					listeners: {
						change: Ext.bind(this.businessSelect, this)
					}
				}, {
					xtype: "textfield",
					margin: "5 0",
					// fieldLabel: "搜索",
					// labelWidth: 50,
					labelStyle: "color: #ddd; font-size: 14px; line-height: 24px;",
					cls: "centerFormPanelInput searchInput",
					listeners: {
						specialKey: Ext.bind(this.searchBusiness, this)
					}
				}],
			}]
		}, {
			xtype: 'fieldcontainer',
			border: 0,
			height: 100,
			autoScroll: true,
			defaultType: "checkboxfield",
			cls: "serviceDirectoryManageFormCheckbox",
			defaults: {
				name: "business",
				margin: "0 10",
			},
			width: "100%",
			layout: 'column',
		}]
	});
	//  指标
	this.monitorTargetPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "指标 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "checkboxfield",
			defaults: {
				name: "target",
				margin: "10",
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox'
		}]
	});
	// 探测频率
	this.monitorProbeFrequencyPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "探测频率 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "radiofield",
			defaults: {
				name: "probeFrequency",
				margin: "10",
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox'
		}]
	});
	//  监控服务
	this.monitorFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		cls: "centerFormPanel",
		items: [
			this.monitorChannelPanel,
			this.monitorProbePanel,
			this.monitorBusinessPanel,
			this.monitorTargetPanel,
			this.monitorProbeFrequencyPanel
		]
	});
	this.monitorBtnPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			formPanel: this.monitorFormPanel,
			margin: "5",
			xtype: "button",
			text: "监控定制",
			baseCls: "x-btn base-btn",
			icon: "resources/images/-.png",
			style: "background: none;border: 0px;",
			handler: Ext.bind(this.configFormPanelShow, this)
		}],
	});
	this.monitorPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [
			this.monitorBtnPanel,
			this.monitorFormPanel
		]
	});



	//  监控服务end
	//  
	// 告警服务 -----------------------------------
	this.alarmTimeChange = function() {
		var grid = this.rateAlarmConfigGridPanel;
		var record = grid.getSelectionModel().getSelection();
		var id = record[0].data.ID;
		var checkboxs = document.getElementsByClassName("RATE_TIME" + id);
		var others = document.getElementsByClassName("RATE_TIME_OTHER" + id);
		var value = "";
		for (var i = 0, l = checkboxs.length; i < l; i++) {
			if (checkboxs[i].checked) {
				value = checkboxs[i].value;
			}
		}
		record[0].set("SELECE_TIME", value);
		if (value == "其他") {
			var otherValue = others[0].value;
			record[0].set("SELECE_TIME_OTHER", otherValue || "");
		}
	};
	this.columns = {
		defaults: {
			menuDisabled: true,
			draggable: false,
			sortable: false,
		},
		items: [{
			dataIndex: "SELECE",
			width: 35,
			renderer: function(value, column) {
				var checkbox = "";
				value && (checkbox = "checked");
				var html = '<input type="checkbox" ' + checkbox + ' name="rate" value="' + value + '">'
				return html;
			},
			listeners: {
				click: {
					fn: function() {
						var grid = this.rateAlarmConfigGridPanel;
						var records = grid.getSelectionModel().getSelection();
						if (records.length) {
							var SELECE = records[0].get("SELECE");
							records[0].set("SELECE", !SELECE);
						}
					},
					scope: this
				}
			}
		}, {
			dataIndex: "NAME",
			text: "告警级别",
		}, {
			dataIndex: "TYPE",
			text: "指标",
		}, {
			dataIndex: "CONDITION",
			text: "条件",

		}, {
			dataIndex: "THRESHOLD",
			text: "最低阈值",
			renderer: function(value, column) {
				var type = column.record.get("TYPE");
				var a = "";
				if (type == "成功率") {
					a = "%";
				} else if (type == "响应时长") {
					a = "s";
				}
				value = value || 0;
				value = value + a;
				return value;
			},
		}, {
			dataIndex: "SELECE_THRESHOLD",
			text: "阈值",
			renderer: function(value, column) {
				var type = column.record.get("TYPE");
				var threshold = column.record.get("THRESHOLD");
				var a = "";
				if (type == "成功率") {
					if (value < threshold && value > 100) {
						value = threshol;
					}
					a = "%";
				} else if (type == "响应时长") {
					if (value < threshold) {
						value = threshold;
					}
					a = "s";
				} else if (type == "交易量") {
					if (value < threshold) {
						value = threshold;
					}
				}
				value = value || 0;
				value = value + a;
				return value;
			},
			editor: {
				xtype: 'numberfield',
				keyNavEnabled: false,
				// maxValue: 99,
				// minValue: 0
			}
		}, {
			dataIndex: "TIME",
			text: "持续时间",
			width: 300,
			maxWidth: 400,
			renderer: function(value, column) {
				var checkboxs = [];
				var selectValue = column.record.get("SELECE_TIME");
				var type = column.record.get("TYPE");
				for (var i = 0, l = value.length; i < l; i++) {
					var checked = "";
					if (value[i] == "其他") {
						var otherValue = "";
						if (selectValue == "其他") {
							otherValue = column.record.get("SELECE_TIME_OTHER") || "";
						}
						name = "<input type='text' style='width:100px;' placeholder='其他' " +
							" class = 'RATE_TIME_OTHER" +
							column.record.data.ID +
							"' value='" + otherValue + "' >";
					} else {
						name = value[i];
					}
					if (value[i] == selectValue) {
						checked = "checked";
					}
					var checkbox = "<laebl style='margin:0 5px;'>" +
						"<input type='radio' class='RATE_TIME" +
						column.record.data.ID + "'" +
						checked +
						"  name='time" + type + column.record.data.ID + "'  value='" +
						value[i] + "' >" + name + " </laebl>"
					checkboxs.push(checkbox);
				}
				var html = "<div class='centerFormPanelInput'>" + checkboxs.join("") + "</div>";
				return html;
			},
			listeners: {
				click: Ext.bind(this.alarmTimeChange, this),
				blur: Ext.bind(this.alarmTimeChange, this)
			}
		}]
	};

	this.createRateAlarmConfigGridPanel = function() {
		this.rateAlarmConfigGridPanel && this.rateAlarmConfigGridPanel.remove();
		this.rateAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "成功率告警",
			disable: true,
			cls: "alarmConfigTabGridPanel",
			border: 0,
			autoRender: true,
			autoShow: false,
			store: this.rateAlarmConfigGridStore,
			forceFit: true,

			selType: 'cellmodel',
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})
			],
			columns: this.columns
		});
	};
	this.createAmountAlarmConfigGridPanel = function() {
		this.amountAlarmConfigGridPanel && this.amountAlarmConfigGridPanel.remove();
		this.amountAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "交易量告警",
			border: 0,
			cls: "alarmConfigTabGridPanel",
			autoRender: true,
			autoShow: false,
			store: this.amountAlarmConfigGridStore,
			forceFit: true,
			// selModel: Ext.create('Ext.selection.CheckboxModel', {
			// 	mode: "SIMPLE"
			// }),
			selType: 'cellmodel',
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})
			],
			columns: this.columns
				// 结束
		});
	};
	this.createDurationAlarmConfigGridPanel = function() {
		this.durationAlarmConfigGridPanel && this.durationAlarmConfigGridPanel.remove();
		this.durationAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "响应时间告警",
			border: 0,
			cls: "alarmConfigTabGridPanel",
			autoRender: true,
			autoShow: false,
			store: this.durationAlarmConfigGridStore,
			forceFit: true,
			// selModel: Ext.create('Ext.selection.CheckboxModel', {
			// 	mode: "SIMPLE"
			// }),
			selType: 'cellmodel',
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})
			],
			columns: this.columns
		});
	};



	// 告警配置 
	this.alarmConfigPanel = Ext.create("Ext.tab.Panel", {
		border: 0,
		plain: true,
		title: "告警配置",
		cls: "alarmConfigTabPanel",
	});



	this.alarmTypePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "告警类型 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "checkboxfield",
			defaults: {
				name: "alarmType",
				margin: "10",
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox'
		}]
	});


	this.alarmPushPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "告警是否需要推送 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "radiofield",
			defaults: {
				name: "alarmPush",
				margin: "10",
				width: 100
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "是",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "否",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}]
		}]
	});
	this.alarmPushModePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "推送方式 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "checkboxfield",
			defaults: {
				margin: "10 0 10 20",
				width: 50
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				name: "alarmPushMode",
				boxLabel: "短信",
				inputValue: "短信",
				boxLabelCls: "radioLabel",
			}, {
				width: 250,
				xtype: "textfield",
				fieldLabel: "号码",
				name: "alarmPushModeToPhone",
				margin: "10",
				labelWidth: 50,
				cls: "centerFormPanelInput",
				labelStyle: "color: #ddd; font-size: 14px; "
			}, {
				name: "alarmPushMode",
				boxLabel: "邮件",
				inputValue: "短信",
				boxLabelCls: "radioLabel",
			}, {
				width: 250,
				xtype: "textfield",
				fieldLabel: "邮箱",
				margin: "10",
				name: "alarmPushModeToEmail",
				cls: "centerFormPanelInput",
				labelWidth: 50,
				labelStyle: "color: #ddd; font-size: 14px;"
			}]
		}]
	});


	// 告警服务表单
	this.alarmServiceFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		cls: "centerFormPanel",
		items: [
			this.alarmTypePanel,
			this.alarmConfigPanel,
			this.alarmPushPanel,
			this.alarmPushModePanel
		]
	});
	this.alarmServiceBtnPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			formPanel: this.alarmServiceFormPanel,
			margin: "5",
			xtype: "button",
			text: "告警服务定制",
			baseCls: "x-btn base-btn",
			icon: "resources/images/-.png",
			style: "background: none;border: 0px;",
			handler: Ext.bind(this.configFormPanelShow, this)
		}],
	});

	this.alarmServicePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [
			this.alarmServiceBtnPanel,
			this.alarmServiceFormPanel,

		]
	});



	// 告警服务end
	// 
	// 故障服务
	this.faultServiceFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		cls: "centerFormPanel",
		items: []
	});
	this.faultServiceBtnPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			formPanel: this.faultServiceFormPanel,
			margin: "5",
			xtype: "button",
			text: "故障服务定制",
			baseCls: "x-btn base-btn",
			icon: "resources/images/-.png",
			style: "background: none;border: 0px;",
			handler: Ext.bind(this.configFormPanelShow, this)
		}],
	});
	this.faultServicePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [
			this.faultServiceBtnPanel,
			this.faultServiceFormPanel
		]
	});;

	// 故障服务end
	// 
	// 
	// 
	//  数据服务-------  传输频率
	this.transmissionFrequencyPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "传输频率:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			// fieldLabel: '',
			// labelWidth: 100,
			labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			labelAlign: "right",
			defaultType: "radiofield",
			defaults: {
				name: "transmissionFrequency",
				margin: "10",
				width: 100
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "transmissionFrequencyOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});
	//  数据服务-------  数据文件
	this.dataFilePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "数据文件:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			defaultType: "checkboxfield",
			defaults: {
				name: "dataFile",
				margin: "10",
				width: 100,
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				width: 220,
				boxLabel: "PCAP原始数据文件包",
				inputValue: "PCAP原始数据文件包",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "BTR",
				inputValue: "BTR",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "TTR",
				inputValue: "TTR",
				boxLabelCls: "radioLabel",
			}]
		}]
	});
	//  数据服务 ------ 统计指标
	this.statisticalTargetPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "统计指标:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			// labelWidth: 100,
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			// labelAlign: "right",
			defaultType: "checkboxfield",
			defaults: {
				name: "statisticalTarget",
				margin: "10",
				width: 100
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "响应时长",
				inputValue: "响应时长",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "响应率",
				inputValue: "响应率",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "成功率",
				inputValue: "成功率",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "交易量",
				inputValue: "交易量",
				boxLabelCls: "radioLabel",
			}]
		}]
	});
	//  数据服务 ------ 统计粒度
	this.statisticalGranularityPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "统计粒度:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			// labelWidth: 100,
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			// labelAlign: "right",
			defaultType: "radiofield",
			defaults: {
				name: "statisticalGranularity",
				margin: "10",
				width: 100
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "statisticalGranularityOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});
	// 数据服务-------  统计数据  传输频率
	this.statisticalTransmissionFrequencyPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "传输频率:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			// labelWidth: 100,
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			// labelAlign: "right",
			defaultType: "radiofield",
			defaults: {
				name: "statisticalTransmissionFrequency",
				margin: "10",
				width: 100
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "statisticalTransmissionFrequencyOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});


	// 
	// 数据服务--------  主体
	this.dataServiceFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		cls: "centerFormPanel",
		items: [{
				xtype: "checkboxfield",
				name: "probeData",
				boxLabel: "探测明细数据",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}, {
				xtype: "panel",
				border: 0,
				layout: "hbox",
				padding: "10 0",
				cls: "serviceDirectoryManageFormCheckbox",
				items: [{
					xtype: "textfield",
					cls: "centerFormPanelInput",
					fieldLabel: "接口地址",
					labelAlign: "right",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "probeDataHost"
				}, {
					margin: "0 10",
					xtype: "textfield",
					cls: "centerFormPanelInput",
					labelAlign: "right",
					fieldLabel: "端口",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "probeDataPort",
				}]
			}, this.transmissionFrequencyPanel,
			this.dataFilePanel, {
				xtype: "checkboxfield",
				name: "statisticalData",
				boxLabel: "统计数据",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}, {
				xtype: "panel",
				border: 0,
				layout: "hbox",
				padding: "10 0",
				cls: "serviceDirectoryManageFormCheckbox",
				items: [{
					xtype: "textfield",
					cls: "centerFormPanelInput",
					fieldLabel: "接口地址",
					labelAlign: "right",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "statisticalHost",
				}, {
					margin: "0 10",
					xtype: "textfield",
					cls: "centerFormPanelInput",
					labelAlign: "right",
					fieldLabel: "端口",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "statisticalPort",
				}]
			},
			this.statisticalTransmissionFrequencyPanel,
			this.statisticalTargetPanel,
			this.statisticalGranularityPanel,

		]
	});
	this.dataServiceBtnPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			formPanel: this.dataServiceFormPanel,
			margin: "5",
			xtype: "button",
			text: "数据服务定制",
			baseCls: "x-btn base-btn",
			icon: "resources/images/-.png",
			style: "background: none;border: 0px;",
			handler: Ext.bind(this.configFormPanelShow, this)
		}],
	});
	this.dataServicePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [
			this.dataServiceBtnPanel,
			this.dataServiceFormPanel
		]
	});

	// submitOver 
	this.submitOverPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		// style: "border-top: 1px #ddd solid;",
		margin: "10 0",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "提交后:",
			width: 60,
			margin: "0 10",
			style: "color: #fff; font-size: 14px; line-height: 40px; "
		}, {
			xtype: 'fieldcontainer',
			defaultType: "radiofield",
			// fieldLabel: "提交后",
			// labelWidth: 100,
			// labelAlign: "right",
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px;",
			// padding: 5,
			cls: "serviceDirectoryManageFormCheckbox",
			width: "100%",
			defaults: {
				name: "submitOver",
				width: 200,
				margin: "10",
			},
			layout: 'hbox',
			items: [{
				boxLabel: "继续为该类型定制服务",
				inputValue: true,
				value: true,
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "返回我的订单",
				inputValue: false,
				boxLabelCls: "radioLabel",
			}]
		}]
	});



	this.overBtnPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 30,
		style: "text-align: center;",
		defaults: {
			xtype: "button",
			baseCls: "x-btn base-btn",
			width: 100,
			margin: "0 5",
		},
		items: [{
			text: "保存",
			cls: "btn-save",
			handler: Ext.bind(this.saveOrderBefor, this)
		}, {
			text: "提交",
			cls: "btn-submit",
			handler: Ext.bind(this.submitOrderBefor, this)
		}]
	});

	// 场景配置
	this.centerFormPanel = Ext.create("Ext.form.Panel", {
		border: 0,
		items: [
			this.serviceingPanel,
			this.monitorPanel,
			this.alarmServicePanel,
			this.faultServicePanel,
			this.dataServicePanel,
			this.submitOverPanel,
			this.overBtnPanel
		]
	});

	// 主查看容器
	this.centerPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 4 / 5,
		margin: 5,
		items: [
			this.centerTitlePanel,
			this.centerFormPanel
		]
	});
}

ServiceDirectory.prototype = new Page(Configes.page.serviceDirectory);
///<jscompress sourcefile="userCenter.js" />
/*
 * 我的资料
 * 
 */ 

function UserCenter(parentNode){
	Page.call(this, Configes.page.userCenter);
	this._parentNode = parentNode;
	this.run = function(){
		if(true !== this.exist){
			this.exist = true;
			this.initView();
			this.loadData();
		}

		this.mainPanelShow();
	};

	this.initView = function(){
		var 
			mainPanel,

			infoPanel,
			enterEdition,
			leaveEdition,

			classifyPanel = Ext.create('Ext.panel.Panel',{
				border: 0,
				defaults: {
					border: 0
				}
			}),

			_this = this,

			win = Ext.create('Ext.Window',{
				width:400,
				height:200,
				closable:true,
				top: 100,
				layout:'fit',//布局方式
				closeAction:'hide',
				title: '修改密码',
				cls: 'modifyPassword',
				constrainHeader:true,//设置窗口的顶部不会超出浏览器边界
				defaultButton:0,//默认选中的按钮
				resizable:true,//控制窗口是否可以通过拖拽改变大小
				resizeHandles:'se',//控制拖拽方式,必须是在设置了resizable的情况下,
				modal:true,//弹出窗口后立刻屏蔽掉其他的组件,只有关闭窗口后才能操作其他组件,
				plain:true,//对窗口内部内容惊醒美化,可以看到整齐的边框
				animateTarget:'target',//可以使窗口展示弹并缩回效果的动画
				items:[{
					layout:'form',
					defaultType:'textfield',
					defaults:{
						width:200,
						inputType:'password'
					},
					style:{
						marginTop:10,
						marginLeft:10
					},
					labelWidth:120,
					labelAlign:'right',
					items:[{
						style:{
							marginTop:10,
							marginLeft:10
						},
						id: 'modifyPassword1',
						labelStyle:'margin-Top:10px',
						fieldLabel:'旧密码'
					},{
						style:{
							marginTop:10,
							marginLeft:10
						},
						id: 'modifyPassword2',
						labelStyle:'margin-Top:10px',
						fieldLabel:'新密码'
					},{
						style:{
							marginTop:10,
							marginLeft:10
						},
						id: 'modifyPassword3',
						labelStyle:'margin-Top:10px',
						fieldLabel:'重复新密码'
					}]
				}],
				buttons:[{
					text:'保存',
					handler:function(){
						_this.modifyPassword(
							Ext.getCmp('modifyPassword1').getValue(),
							Ext.getCmp('modifyPassword2').getValue(),
							Ext.getCmp('modifyPassword3').getValue()
						)
					}
				}],
				buttonAlign: 'center'
			}),

			formPanel = Ext.create('Ext.form.Panel',{
				minWidth : 850,
				height: 400,
				autoHeight : true,
				frame : true,
				layout : "form", // 整个大的表单是form布局
				labelWidth : 65,
				labelAlign : "right",
				style: 'background: transparent;margin: 0 0 0 auto;min-width:850px;',
				border: 0,
				defaults: {
					style: 'background: transparent;',
					border: 0
				},
				items : [{ // 行1
					title: '账户信息',
					layout : "column", // 从左往右的布局
					id: 'userCenterPassword',
					items : [{
						columnWidth : .3, // 该列有整行中所占百分比
						layout : "form", // 从上往下的布局
						disabled: true,
						items : [{
							xtype : "textfield",
							fieldLabel : "账户名",
							width : 120,
							name: 'account'
						}]
					}, {
						columnWidth : .3,
						layout : "form",
						disabled: true,
						items : [{
							xtype : "textfield",
							fieldLabel : "密码",
							inputType: 'password',
							width : 120,
							name: 'password'
						}]
					}, {
						columnWidth : .3,
						layout : "form",
						items : [{
							xtype : "button",
							text: '修改密码',
							width : 120,
							handler: function(){
								win.show();
								Ext.getCmp('modifyPassword1').setValue('');
								Ext.getCmp('modifyPassword2').setValue('');
								Ext.getCmp('modifyPassword3').setValue('');
							}

						}]
					}]
				}, {
					title: '个人信息',
					layout: 'column',
					id: 'layoutInfo',
					disabled: true,
					defaults: {
						border: 0,
						width: 100
					},
					items: [{
						columnWidth: 0.31,
						title: '基本信息',
						layout: 'form',
						style: 'margin-right: 10px;',
						defaults: {xtype: 'textfield'},
						items: [{
							fieldLabel: '真实姓名',
							name: 'realName'
						}, {
							fieldLabel: '姓名',
							name: 'nickName'
						}, {
							fieldLabel: '年龄',
							name: 'age'
						}]
					}, {
						columnWidth: 0.31,
						title: '企业信息',
						layout: 'form',
						style: 'margin-right: 10px;',
						defaults: {xtype: 'textfield'},
						items: [{
							fieldLabel: '所属省份',
							name: 'province'
						}, {
							fieldLabel: '所属公司',
							name: 'company',
							xtype: 'combobox',
							displayField: 'name',
							valueField: 'value',
							store: new Ext.data.Store({
								fields: ['name','value'],
								data: [
									{name: '中国移动(深圳)有限公司',value:'深圳'},
									{name: '甘肃移动有限公司',value:'甘肃'},
									{name: '广东移动有限公司',value:'广东'},
									{name: '贵州移动有限公司',value:'贵州'},
								]
							}),
						}, {
							fieldLabel: '部门',
							name: 'department'
						}, {
							fieldLabel: '职位',
							name: 'position'
						}]
					}, {
						columnWidth: 0.31,
						title: '联系方式',
						layout: 'form',
						defaults: {xtype: 'textfield'},
						items: [{
							fieldLabel: '手机号码',
							name: 'number'
						}, {
							fieldLabel: '邮箱',
							name: 'email'
						}, {
							fieldLabel: 'QQ',
							name: 'qqAccount'
						}]
					}]
				}, {
					layout: 'column',
					cls: 'editInfo',
					width: 120,
					id: 'enterEdition',
					border: 0,
					items: [{
						columnWidth: .93,
						xtype: 'button',
						text: '修改个人信息',
						handler: function(){
							infoPanel.enable();
							enterEdition.hide();
							leaveEdition.show();
						}
					}]
				}, {
					layout: 'column',
					cls: 'editInfo',
					width: 150,
					hidden: true,
					id: 'leaveEdition',
					border: 0,
					items: [{
						columnWidth: 0.47,
						xtype: 'button',
						text: '确认',
						handler: function(){
							_this.modifyInfo();
							infoPanel.disable();
							enterEdition.show();
							leaveEdition.hide();
						}
					}, {
						columnWidth: 0.47,
						xtype: 'button',
						text: '关闭',
						margin: '0 0 0 5',
						handler: function(){
							_this.setData();
							infoPanel.disable();
							enterEdition.show();
							leaveEdition.hide();
						}
					}]
				}]
			});

		return function(){
			this.classifyPanel = classifyPanel;
			this.formPanel = formPanel;
			this.win = win;
			infoPanel = Ext.getCmp('layoutInfo');
			enterEdition = Ext.getCmp('enterEdition');
			leaveEdition = Ext.getCmp('leaveEdition');
			mainPanel = this.getMainPanel();

			mainPanel.add(this.classifyPanel);
			this.classifyPanel.add(this.formPanel);
		}
	}.bind(this)();

	this.loadData = function(){
		tools.getData(Configes.url.view_getSelfInfo, null, this.setData.bind(this), null);
	};

	this.setData = function(){
		var testData = {
			account: '小明',
			password: '123456',
			realName: '小明',
			nickName: 'kk',
			age: '39',
			province: 'shandong',
			company: '深圳',
			department: 'business',
			position: 'cleankeeper',
			number: '13566660099',
			email: 'xiaoming@hotmail.cc',
			qqAccount: '2231456234'
		},
			formPanel,
			_account,
			_password,
			_realName,
			_nickName,
			_age,
			_province,
			_company,
			_department,
			_position,
			_number,
			_email,
			_qqAccount,

			_data;

		return function(data, scope){
			void 0 !== data && (this.userInfo = data);
			this.userInfo = testData;
			_data = this.userInfo;

			if(void 0 === formPanel){
				formPanel   = this.formPanel.getForm();
				_account     = formPanel.findField('account');
				_password   = formPanel.findField('password');
				_realName   = formPanel.findField('realName');
				_nickName   = formPanel.findField('nickName');
				_age        = formPanel.findField('age');
				_province   = formPanel.findField('province');
				_company    = formPanel.findField('company');
				_department = formPanel.findField('department');
				_position   = formPanel.findField('position');
				_number     = formPanel.findField('number');
				_email      = formPanel.findField('email');
				_qqAccount   = formPanel.findField('qqAccount');
			}

			void 0 !== _data['account']  && _account.setValue(_data['account']);
			void 0 !== _data['password'] && _password.setValue(_data['password']);
			_realName.setValue(_data['realName']);
			_nickName.setValue(_data['nickName']);
			_age.setValue(_data['age']);
			_province.setValue(_data['province']);
			_company.setValue(_data['company']);
			_department.setValue(_data['department']);
			_position.setValue(_data['position']);
			_number.setValue(_data['number']);
			_email.setValue(_data['email']);
			_qqAccount.setValue(_data['qqAccount']);
		};
	}.bind(this)();

	this.modifyInfo = function(){ // submit event
		var info = this.formPanel.getForm().getValues();
		var _this = this;

		Ext.Msg.wait('资料保存中..');
		Ext.Ajax.request({
			url: 'http://www.baidu.com',
			params: info,
			method: 'post',
			success: function(res){
				Ext.Msg.alert('消息', '保存成功!');
				_this.setData(info);
			},
			failure: function(){
				_this.setData();
				Ext.Msg.alert('消息', '保存失败..');
			}
		});
		console.log(info);
	}

	this.modifyPassword = function(){
		var _this = this;
		if(arguments.length !== 3)return;

		if(arguments[1] !== arguments[2])return Ext.Msg.alert('消息','新密码输入有误，请重新输入');
		if(arguments[1].length < 6)return Ext.Msg.alert('消息', '密码长度过短, 请输入6位新密码');

		var params = {
			originalPW: arguments[0],
			newPW: arguments[1],
			repeatPW: arguments[2]
		};

		Ext.Msg.wait('密码重置中..');
		Ext.Ajax.request({
			url: 'http://www.baidu.com',
			params: params,
			method: 'post',
			success: function(res){
				Ext.Msg.alert('消息', '密码修改成功!');
			},
			failure: function(){
				Ext.Msg.alert('消息', '密码修改失败..');
				_this.win.hide();
			}
		});
	}

}
///<jscompress sourcefile="securityManage.js" />
/**
 * create 20160801
 * godz
 *
 * 用户管理页面主体
 */
function SecurityManage(parentObj) {
	this.parentObj = parentObj;
	Page.call(this, Configes.page.securityManage);
	this.panelId = Configes.page.securityManage;
	this.run = function() {
		if (!this.loading) {
			this.initView();
			// this.getSelfInfo();
		}
		this.loading = true;
		this.mainPanelShow();
	};
	this.initView = function() {
		this.createTreeStore();
		this.createTreePanel();
		this.createEdiotorPanel();
		this.setMainPanel();
		this.getMainPanel().add(this.mainCenterPanel);
		this.setTreeNode();
	};
	this.treeType = {
		userManage: "userManage",
		groupManage: "groupManage",
		roleManage: "roleManage",
		sessionManage: "sessionManage"
	};
	this.userModel = {
		_NAME: "_NAME",
		DOMAIN: "DOMAIN",
		_ADDRESS: "_ADDRESS",
		_NICK_NAME: "_NICK_NAME",
		_EMAIL: "_EMAIL",
		_GENDER: "_GENDER",
		_ID: "_ID",
		_PHONE: "_PHONE"
	};
	this.gridModel = {
		_NAME: "_NAME",
		_LABEL: "_LABEL",
		_DESC: "_DESC",
		USERS: "USERS",
		ROLES: "ROLES"
	};
	this.roleModel = {
		RDN: "RDN",
		_ID: "_ID",
		_PDN: "_PDN",
		_NAME: "_NAME",
		_LABEL: "_LABEL",
		_DESC: "_DESC",
		PRIVILEGES: "PRIVILEGES"
	};
	this.sesstionModel = {
		USER_NAME: "USER_NAME",
		USER_RDN: "USER_RDN",
		LOGIN_TIME: "LOGIN_TIME",
		NICK_NAME: "NICK_NAME",
		LAST_ACCESS_TIME: "LAST_ACCESS_TIME",
		HOST: "HOST",
		DOMAIN: "DOMAIN",
		PORT: "PORT",
		SESSION_KEY: "SESSION_KEY"
	};
	this.setTreeNode = function() {
		var root = this.treeStore.getRoot();
		var node = [{
			text: "用户管理",
			leaf: true,
			cls: "serviceDirectoryTreeType",
			type: this.treeType.userManage
		}, {
			text: "组管理",
			leaf: true,
			cls: "serviceDirectoryTreeType",
			type: this.treeType.groupManage
		}, {
			text: "角色管理",
			leaf: true,
			cls: "serviceDirectoryTreeType",
			type: this.treeType.roleManage
		}, {
			text: "会话管理",
			leaf: true,
			cls: "serviceDirectoryTreeType",
			type: this.treeType.sessionManage
		}]
		root.appendChild(node);
	};
	this.setMainPanel = function() {
		this.mainCenterPanel = Ext.create("Ext.panel.Panel", {
			// id: this.panelId,
			layout: "column",
			cls: "serviceDirectoryMainPanel",
			border: 0,
			defaults: {
				border: 0
			},
			items: [this.treePanel, this.ediotorPanel]
		});
	};
	// 打开编辑器
	this.openEdiotor = function(record) {
		// this.editDomain = record.parentNode.data.nodeData.RDN;
		this.ediotorPanel.removeAll();
		if (record.data.type === this.treeType.userManage) {
			this.createUserGridPanel();
			this.ediotorPanel.add(this.userGridPanel);
			this.getUserList();
			this.getGroupsList(record);
		} else if (record.data.type === this.treeType.groupManage) {
			this.createGroupsGridPanel();
			this.ediotorPanel.add(this.groupsGridPanel);
			this.getGroupsList(record);
		} else if (record.data.type === this.treeType.roleManage) {
			this.createRolesGridPanel();
			this.ediotorPanel.add(this.rolesGridPanel);
			this.getRoleList(record);
			this.getListPrivilege();
		} else if (record.data.type === this.treeType.sessionManage) {
			this.createSesstionGridPanel();
			this.ediotorPanel.add(this.sesstionGridPanel);
			this.getSesstionList();
		}
	};
	this.openEditUserWin = function(record) {
		if (!this.editUserWin) {
			this.createEditUserWin();
		}
		this.passwordChange = false;
		this.getRoleList();
		this.editUserWin.show();
		var form = this.editUserWin.getComponent(0);
		var usernameInput = form.getComponent(2);
		usernameInput.setReadOnly(false);
		form.getForm().reset();
		if (this.editType == "update") {
			var data = record.data;
			this.getUserInfo(data);
			usernameInput.setReadOnly(true);
		}
	};
	this.openEditRoleWin = function(record) {
		if (!this.editRoleWin) {
			this.createEditRoleWin();
		}
		this.editRoleWin.show();
		var root = this.privilegeStore.getRoot();

		this.PrivilegeListTreeChange = false;
		var form = this.editRoleWin.getComponent(0);
		form.getForm().reset();
		if (this.editType == "update") {
			var data = record.data;
			this.getRoleInfo(data);
		}
	};
	this.openEditGroupsWin = function(record) {
		if (!this.editGroupWin) {
			this.createEditGroupWin();
		}
		this.editGroupWin.show();
		this.getUserList();
		this.getRoleList();
		var form = this.editGroupWin.getComponent(0);
		form.getForm().reset();
		if (this.editType == "update") {
			var data = record.data;
			this.getGroupInfo(data);
		}
	};

	// model-------------------------
	// 
	// 
	//获取用户列表
	this.getUserList = function(RDN) {
		Ext.getCmp("userGroupBox") && (RDN = Ext.getCmp("userGroupBox").getValue());

		if (!RDN) {
			RDN = undefined;
		}
		var params = {
			RDN: RDN,
			DOMAIN: this.editDomain
		}
		tools.getData(Configes.url.view_listUserInfo, params, this.setUserList, this);
	};
	this.setUserList = function(data, that) {
		if (!that.userGridStore) {
			that.createUserGridStore();
		}
		var userList = [];
		for (var i = 0, l = data.length; i < l; i++) {
			userList.push(data[i]["DATA"]);
		}
		that.userGridStore.loadData(userList);
	};

	this.getUserInfo = function(data) {
		tools.getData(Configes.url.view_getUserInfo, data, this.setUserInfo, this);
	};
	this.setUserInfo = function(data, that) {
		var form = that.editUserWin.getComponent(0).getForm();
		that.randomString = tools.randomString();
		var _CONTENT_STR = data["DATA"]["_CONTENT"] || "{}";
		var _CONTENT = JSON.parse(_CONTENT_STR);
		data["DATA"]["PROVINCE"] = _CONTENT["PROVINCE"];
		data["DATA"]["_PWD"] = that.randomString;
		data["DATA"]["GROUPS"] = data["GROUP_RDNS"];
		data["DATA"]["ROLES"] = data["ROLE_RDNS"];
		form.setValues(data["DATA"]);
	};
	this.updateUser = function(data) {
		var data = this.editUserWin.getComponent(0).getForm().getValues();
		if (!data["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!data["_NICK_NAME"]) {
			tools.toast("用户名不能为空");
			return;
		}
		if (!data["_PWD"]) {
			tools.toast("密码不能为空");
			return;
		}
		if (data["_PWD"] !== this.randomString) {
			var name = data["_NAME"];
			data["_PWD"] = tools.passwordNecToAdmin(data["_PWD"]);
		} else {
			data["_PWD"] = undefined;
		}
		if (typeof data["GROUPS"] !== "string") data["GROUPS"] = data["GROUPS"].join(",");
		if (typeof data["ROLES"] !== "string") data["ROLES"] = data["ROLES"].join(",");
		// 添加用户归属
		data["_CONTENT"] = JSON.stringify({
			PROVINCE: data["PROVINCE"]
		});
		var params = data;
		tools.getData(Configes.url.view_updateUser, params, this.updateInfoReturn, this);


	};
	this.updateInfoReturn = function(data, that) {
		that.editUserWinHide();
		that.getUserList();
	};
	// 获取组列表
	this.getGroupsList = function() {
		var params = {
			RDN: this.editDomain
		};
		tools.getData(Configes.url.view_listGroupInfo, params, this.setGroupsList, this);
	};
	this.setGroupsList = function(data, that) {
		var groups = [];
		for (var i = 0, l = data.length; i < l; i++) {
			data[i]["DATA"]["ROLE_RDNS"] = data[i]["ROLE_RDNS"];
			data[i]["DATA"]["USER_RDNS"] = data[i]["USER_RDNS"];
			groups.push(data[i]["DATA"]);
		}
		if (!that.groupsGridStore) {
			that.createGroupsStore();
		}
		that.groupsGridStore.loadData(groups);
	};
	// 获取组信息
	this.getGroupInfo = function(data) {
		tools.getData(Configes.url.view_getGroupInfo, data, this.setGroupInfo, this);
	};
	this.setGroupInfo = function(data, that) {
		data["DATA"]["USERS"] = data["USER_RDNS"];
		data["DATA"]["ROLES"] = data["ROLE_RDNS"];
		var form = that.editGroupWin.getComponent(0).getForm();
		form.setValues(data["DATA"]);
	};
	// 修改组信息
	this.updateGroup = function(data) {

		if (!data["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!data["_LABEL"]) {
			tools.toast("标签不能为空");
			return;
		}

		if (typeof data["USERS"] !== "string") data["USERS"] = data["USERS"].join(",");
		if (typeof data["ROLES"] !== "string") data["ROLES"] = data["ROLES"].join(",");
		var params = data;
		tools.getData(Configes.url.view_updateGroup, params, this.updateGroupReturn, this);
	};
	this.updateGroupReturn = function(data, that) {
		that.editGroupWinHide();
		that.getGroupsList();
	};

	// 添加组信息
	this.addGroup = function(data) {
		if (!data["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!data["_LABEL"]) {
			tools.toast("标签不能为空");
			return;
		}
		data["_ID"] = undefined;
		data["_PDN"] = this.editDomain;
		if (typeof data["USERS"] !== "string") data["USERS"] = data["USERS"].join(",");
		if (typeof data["ROLES"] !== "string") data["ROLES"] = data["ROLES"].join(",");
		var params = data;
		tools.getData(Configes.url.view_addGroup, params, this.addGroupReturn, this);
	};
	this.addGroupReturn = function(data, that) {
		that.editGroupWinHide();
		that.getGroupsList();
	};

	// 删除组信息
	this.deleteGroup = function(RDN) {
		var params = {
			RDN: RDN
		};
		tools.getData(Configes.url.view_removeGroup, params, this.deleteGroupReturn, this);
	};
	this.deleteGroupReturn = function(data, that) {
		that.getGroupsList();
	};


	// 添加用户
	this.addUser = function(data) {
		var data = this.editUserWin.getComponent(0).getForm().getValues();
		if (!data["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!data["_NICK_NAME"]) {
			tools.toast("用户名不能为空");
			return;
		}
		if (!data["_PWD"]) {
			tools.toast("密码不能为空");
			return;
		}
		data["_ID"] = undefined;
		data["_PDN"] = this.editDomain;

		data["_PWD"] = tools.passwordNecToAdmin(data["_PWD"]);
		data["_CONTENT"] = JSON.stringify({
			PROVINCE: data["PROVINCE"]
		});
		if (typeof data["GROUPS"] !== "string") data["GROUPS"] = data["GROUPS"].join(",");
		if (typeof data["ROLES"] !== "string") data["ROLES"] = data["ROLES"].join(",");
		var params = data;
		tools.getData(Configes.url.view_addUser, params, this.addUserReturn, this);
	};
	this.addUserReturn = function(data, that) {
		that.editUserWinHide();
		that.getUserList();
	};



	// 获取角色列表
	this.getRoleList = function() {

		var params = {
			RDN: this.editDomain
		}
		tools.getData(Configes.url.view_listRoleInfo, params, this.setRoleList, this);
	};
	this.setRoleList = function(data, that) {
		var roleList = [];
		for (var i = 0, l = data.length; i < l; i++) {
			roleList.push(data[i]["DATA"]);
		}
		if (!that.rolesGridStore) {
			that.createRoleStore();
		}
		that.rolesGridStore.loadData(roleList);
	};
	// 获取权限列表
	this.getListPrivilege = function() {
		var params = {
			RDN: this.editDomain
		};
		tools.getData(Configes.url.view_listPrivilegeAndGroup, params, this.setListPrivilege, this);
	};
	this.setListPrivilege = function(data, that) {
		if (!that.privilegeStore) {
			that.createPrivilegeList();
		}
		var root = that.privilegeStore.getRoot();
		root.removeAll();
		for (var i = 0, l = data.length; i < l; i++) {
			var node = {
				leaf: false,
				checked: false,
				text: data[i]["_LABEL"] || data[i]["_NAME"],
				nodeData: data[i]
			};
			var newNode = root.appendChild(node);
			that.getListPrivilegeChild(data[i], newNode);
		}
		that.getSysDomain();

	};
	this.getSysDomain = function() {
		tools.getData(Configes.url.view_getSysDomain, null, this.getAdminListPrivilege, this);
	};
	this.getAdminListPrivilege = function(data, that) {
		tools.getData(Configes.url.view_listPrivilegeAndGroup, data, that.setAdminListPrivilege, that);
	};
	this.setAdminListPrivilege = function(data, that) {
		var root = that.privilegeStore.getRoot();
		for (var i = 0, l = data.length; i < l; i++) {
			var node = {
				leaf: false,
				checked: false,
				text: data[i]["_LABEL"] || data[i]["_NAME"],
				nodeData: data[i]
			};
			var newNode = root.appendChild(node);
			that.getListPrivilegeChild(data[i], newNode);
		}

	};
	// 获取权限子列表
	this.getListPrivilegeChild = function(data, node) {
		var params = {
			node: node,
			that: this
		}
		tools.getData(Configes.url.view_listPrivilegeAndGroup, data, this.setListPrivilegeChild, params);
	};
	this.setListPrivilegeChild = function(data, params) {
		var parentNode = params.node;
		var that = params.that;
		for (var i = 0, l = data.length; i < l; i++) {
			var node = {
				leaf: data[i]["LEAF"],
				checked: false,
				text: data[i]["_LABEL"] || data[i]["_NAME"],
				nodeData: data[i]
			};
			var newNode = parentNode.appendChild(node);
			if (data[i]["LEAF"] == false) {
				that.getListPrivilegeChild(data[i], newNode);
			}
		}
	};

	// 获取角色信息
	this.getRoleInfo = function(data) {
		tools.getData(Configes.url.view_getRoleInfo, data, this.getRoleInfoReturn, this);
	};
	this.getRoleInfoReturn = function(data, that) {
		var form = that.editRoleWin.getComponent(0).getForm();
		form.setValues(data["DATA"]);
		privilege = data["PRIVILEGE_RDNS"];
		that.setRoleInfoToprivilege(privilege);
	};



	// ------------------------------------------------------------
	// 设置权限树的选择
	this.setRoleInfoToprivilege = function(privilege) {
		var root = this.privilegeStore.getRoot();
		for (var i = 0, l = privilege.length; i < l; i++) {
			this.setRoleInfoToprivilegeChild(root, privilege[i])
		}
	};
	this.setRoleInfoToprivilegeChild = function(node, RDN) {
			node.eachChild(function(Node) {
				if (Node.data.nodeData["RDN"] == RDN) {
					Node.set("checked", true);
					this.selectParentNodes(Node, true);
					node.expand();
				}
				if (!Node.isLeaf()) {
					this.setRoleInfoToprivilegeChild(Node, RDN);
				}
			}, this);
		}
		// 添加角色
	this.addRole = function(values) {
		if (!values["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!values["_LABEL"]) {
			tools.toast("标签不能为空");
			return;
		}


		values["_ID"] = undefined;
		values["_PDN"] = this.editDomain;
		if (this.PrivilegeListTreeChange) {
			var root = this.privilegeStore.getRoot();
			var checkPrivileges = this.getCheckPrivileges(root);
			values["PRIVILEGES"] = checkPrivileges.join(",");
		}
		tools.getData(Configes.url.view_addRole, values, this.addRoleReturn, this);
	};
	//  获取权限树的选择-------------------------------------------------
	this.getCheckPrivileges = function(node) {
		// var root = this.privilegeStore.getRoot();
		var checkPrivileges = [];

		node.eachChild(function(Node) {
			if (!Node.isLeaf()) {
				var checks = this.getCheckPrivileges(Node);
				console.log(checks);
				checkPrivileges = Ext.Array.merge(checkPrivileges, checks);
			} else if (Node.data.checked) {
				console.log(Node);
				checkPrivileges.push(Node.data.nodeData["RDN"]);
			}
		}, this);
		return checkPrivileges;
	};

	//  
	this.addRoleReturn = function(data, that) {
		that.editRoleWinHide();
		that.getRoleList();
	};


	this.updateRole = function(values) {

		if (!values["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!values["_LABEL"]) {
			tools.toast("标签不能为空");
			return;
		}

		if (this.PrivilegeListTreeChange) {
			var root = this.privilegeStore.getRoot();
			var checkPrivileges = this.getCheckPrivileges(root);
			values["PRIVILEGES"] = checkPrivileges.join(",");
		}
		tools.getData(Configes.url.view_updateRole, values, this.addRoleReturn, this);
	};
	this.updateRoleReturn = function(data, that) {
		that.editRoleWinHide();
		that.getRoleList();
	};

	this.deleteRole = function(RDN) {
		var params = {
			RDN: RDN
		}
		tools.getData(Configes.url.view_removeRole, params, this.deleteRoleReturn, this);
	};
	this.deleteRoleReturn = function(data, that) {
		that.getRoleList();
	};

	// 获取会话列表
	this.getSesstionList = function() {
		var params = {
			RDN: this.editDomain
		}
		tools.getData(Configes.url.view_listSession, params, this.setSelectionList, this);

	};
	this.setSelectionList = function(data, that) {
		that.sesstionGridStore.loadData(data);
	};

	this.deleteSesstion = function(KEY) {
		var params = {
			KEY: KEY
		}
		tools.getData(Configes.url.view_removeSession, params, this.deleteSesstionReturn, this);
	};
	this.deleteSesstionReturn = function(data, that) {
		that.getSesstionList();
	};
	// view 
	this.createTreeStore = function() {
		this.treeStore = Ext.create("Ext.data.TreeStore", {
			root: {
				expanded: true,
				cls: "serviceDirectoryTreeRoot serviceDirectoryTreeType"
			}
		});
	};
	// 创建域的树
	this.createTreePanel = function() {
		var that = this;
		this.treePanel = Ext.create("Ext.tree.Panel", {
			store: this.treeStore,
			rootVisible: false,
			border: 0,
			cls: "serviceDirectoryTreePanel",
			columnWidth: 1 / 4,
			margin: "0 10",
			// padding: 5,
			listeners: {
				itemdblclick: function(tree, record, ele, id, e) {
					if (record.isLeaf()) {
						that.openEdiotor(record);
					}
				}
			}
		});
	};
	// 创建编辑器
	this.createEdiotorPanel = function() {
		this.ediotorPanel = Ext.create("Ext.panel.Panel", {
			columnWidth: 3 / 4,
			margin: "0 10",
			// padding: 5,
		});
	};
	//  创建用户列表
	this.createUserGridPanel = function() {
		var that = this;
		if (!this.groupsGridStore) {
			this.createGroupsStore();
		}
		if (!this.userGridStore) {
			this.createUserGridStore();
		}
		this.userGridPanel = Ext.create("Ext.grid.Panel", {
			cls: "centerFormPanel alarmConfigTabGridPanel",
			border: 0,
			// height: 450,
			layout: "fit",
			width: "100%",
			autoShow: false,
			border: 0,
			// multiSelect: true,
			store: this.userGridStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
					dataIndex: this.userModel["_NAME"],
					text: "用户名"
				}, {
					dataIndex: this.userModel["_NICK_NAME"],
					text: "姓名"
				}, {
					dataIndex: this.userModel["_ADDRESS"],
					text: "地址"
				}, {
					dataIndex: this.userModel["_EMAIL"],
					text: "邮箱"
				}, {
					dataIndex: this.userModel["_PHONE"],
					text: "电话"
				}, {
					dataIndex: this.userModel["_GENDER"],
					text: "性别",
					renderer: function(value) {
						if (value) {
							value = "女";
						} else {
							value = "男";
						}
						return value;
					}
				}]
			},
			tools: [{
				xtype: "combobox",
				id: "userGroupBox",
				store: that.groupsGridStore,
				fieldLabel: "分组",
				labelWidth: 50,
				name: "_GENDER",
				queryMode: 'local',
				displayField: '_LABEL',
				valueField: "RDN",
				autoSelect: true,
				listeners: {
					change: function() {
						var RDN = this.getValue();
						that.getUserList(RDN);
					}
				}
			}, {
				xtype: "button",
				text: "添加用户",
				margin: "0 5",
				handler: function() {
					that.editType = "add";
					that.openEditUserWin();
				}
			}, {
				xtype: "button",
				text: "修改用户",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditUserWin(select[0]);
					}
				}
			}],
			listeners: {
				celldblclick: function() {
					var grid = that.userGridPanel;
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditUserWin(select[0]);
					}
				}
			},
			forceFit: true,
			renderTo: Ext.getBody(),
		});
	};
	// 创建组列表
	this.createGroupsGridPanel = function() {
		var that = this;
		if (!this.groupsGridStore) {
			this.createGroupsStore();
		}
		this.groupsGridPanel = Ext.create("Ext.grid.Panel", {
			cls: "centerFormPanel alarmConfigTabGridPanel",
			border: 0,
			layout: "fit",
			width: "100%",
			autoShow: false,
			border: 0,
			store: this.groupsGridStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
						dataIndex: this.gridModel["_NAME"],
						text: "名称"
					}, {
						dataIndex: this.gridModel["_LABEL"],
						text: "标签"
					}, {
						dataIndex: this.gridModel["_DESC"],
						text: "描述"
					}
					// , {
					// 	dataIndex: this.gridModel["USERS"],
					// 	text: "用户"
					// }, {
					// 	dataIndex: this.gridModel["ROLES"],
					// 	text: "角色"
					// }
				]
			},
			tools: [{
				xtype: "button",
				text: "添加",
				margin: "0 5",
				handler: function() {
					that.editType = "add";
					that.openEditGroupsWin();
				}
			}, {
				xtype: "button",
				text: "修改",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditGroupsWin(select[0]);
					}
				}
			}, {
				xtype: "button",
				text: "删除",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "delete";
						that.deleteGroupWin(select[0]);
					}
				}
			}],
			listeners: {
				celldblclick: function() {
					var grid = that.groupsGridPanel;
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditGroupsWin(select[0]);
					}
				}
			},
			forceFit: true,
			renderTo: Ext.getBody(),
		});
	};
	//  创建角色列表
	this.createRolesGridPanel = function() {
		var that = this;
		if (!this.rolesGridStore) {
			this.createRoleStore();
		}
		this.rolesGridPanel = Ext.create("Ext.grid.Panel", {
			cls: "centerFormPanel alarmConfigTabGridPanel",
			border: 0,
			layout: "fit",
			width: "100%",
			autoShow: false,
			border: 0,
			store: this.rolesGridStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
					dataIndex: this.roleModel["_NAME"],
					text: "名称"
				}, {
					dataIndex: this.roleModel["_LABEL"],
					text: "标签"
				}, {
					dataIndex: this.roleModel["_DESC"],
					text: "描述"
				}]
			},
			tools: [{
				xtype: "button",
				text: "添加",
				margin: "0 5",
				handler: function() {
					that.editType = "add";
					that.openEditRoleWin();
				}
			}, {
				xtype: "button",
				text: "修改",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditRoleWin(select[0]);
					}
				}
			}, {
				xtype: "button",
				text: "删除",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "delete";
						that.deleteRoleWin(select[0]);
					}
				}
			}],
			listeners: {
				celldblclick: function() {
					var grid = that.rolesGridPanel;
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditRoleWin(select[0]);
					}
				}
			},
			forceFit: true,
			renderTo: Ext.getBody(),
		});
	};
	this.createSesstionGridPanel = function() {
		var that = this;
		if (!this.sesstionGridStore) {
			this.createSesstionStore();
		}
		this.sesstionGridPanel = Ext.create("Ext.grid.Panel", {
			cls: "centerFormPanel alarmConfigTabGridPanel",
			border: 0,
			layout: "fit",
			width: "100%",
			autoShow: false,
			border: 0,
			store: this.sesstionGridStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
					dataIndex: this.sesstionModel["USER_NAME"],
					text: "账号"
				}, {
					dataIndex: this.sesstionModel["NICK_NAME"],
					text: "姓名"
				}, {
					dataIndex: this.sesstionModel["LOGIN_TIME"],
					text: "登录时间",
					renderer: function(value, columns) {
						var date = new Date(value * 1000);
						var newValue = tools.dateZerofill(date);
						return newValue;
					}
				}, {
					dataIndex: this.sesstionModel["LAST_ACCESS_TIME"],
					text: "最后操作时间",
					renderer: function(value, columns) {
						var date = new Date(value * 1000);
						var newValue = tools.dateZerofill(date);
						return newValue;
					}
				}, {
					dataIndex: this.sesstionModel["HOST"],
					text: "登录地址"
				}, {
					dataIndex: this.sesstionModel["PORT"],
					text: "登录端口"
				}]
			},
			tools: [{
				xtype: "button",
				text: "删除会话",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "delete";
						that.deleteSesstionWin(select[0]);
					}
				}
			}],
			forceFit: true,
			renderTo: Ext.getBody(),
		});
	};

	// 删除角色警告框
	this.deleteRoleWin = function(record) {
		var RDN = record.data["RDN"];
		var that = this;
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "要删除该角色吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					that.deleteRole(RDN);
					return;
				} else {
					return;
				}
			}
		});
	};
	// 删除组警告框
	this.deleteGroupWin = function(record) {
		var RDN = record.data["RDN"];
		var that = this;
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "要删除该组吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					that.deleteGroup(RDN);
					return;
				} else {
					return;
				}
			}
		});
	};
	this.deleteSesstionWin = function(record) {
		var KEY = record.data["SESSION_KEY"];
		var that = this;
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "要删除该组吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					that.deleteSesstion(KEY);
					return;
				} else {
					return;
				}
			}
		});
	};
	//  编辑组 窗口
	this.createEditGroupWin = function() {
		var that = this;
		if (!this.userGridStore) {
			this.createUserGridStore();
		}
		if (!this.rolesGridStore) {
			this.createRoleStore();
		}
		this.editGroupWin = Ext.create("Ext.window.Window", {
			width: 500,
			modal: false,
			title: "新增/编辑组",
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false, //是否可以调整大小
			cls: "window",
			items: [Ext.create("Ext.form.Panel", {
				border: 0,
				defaults: {
					xtype: "textfield",
					labelWidth: 50,
					margin: 5,
					padding: 5,
					anchor: "95%"
				},
				items: [{
					// 域RDN
					xtype: "hiddenfield",
					name: "_PDN"
				}, {
					xtype: "hiddenfield",
					name: "_ID"
				}, {
					xtype: "textfield",
					name: "_NAME",
					fieldLabel: "名称"
				}, {
					xtype: "textfield",
					name: "_LABEL",
					fieldLabel: "标签"
				}, {
					xtype: "textareafield",
					height: 50,
					name: "_DESC",
					fieldLabel: "描述"
				}, Ext.create("Ext.form.field.Tag", {
					store: this.userGridStore,
					fieldLabel: "用户",
					labelWidth: 50,
					margin: 5,
					padding: 5,
					anchor: "95%",
					name: "USERS",
					editable: false,
					filterPickList: false,
					renderTo: Ext.getBody(),
					valueField: "RDN",
					displayField: "_NICK_NAME",
					queryMode: 'local'
				}), Ext.create("Ext.form.field.Tag", {
					store: this.rolesGridStore,
					fieldLabel: "角色",
					labelWidth: 50,
					margin: 5,
					padding: 5,
					anchor: "95%",
					name: "ROLES",
					editable: false,
					filterPickList: false,
					renderTo: Ext.getBody(),
					valueField: "RDN",
					displayField: "_LABEL",
					queryMode: 'local'
				})]
			})],
			buttons: [{
				text: "确定",
				handler: function() {
					var data = that.editGroupWin.getComponent(0).getForm().getValues();
					if (that.editType == "add") {
						that.addGroup(data);
					} else {
						that.updateGroup(data);
					}
				}
			}, {
				text: "取消",
				handler: function() {
					that.editGroupWinHide();
				}
			}]
		});
	};
	this.editGroupWinHide = function() {
		if (this.editGroupWin) {
			this.editGroupWin.hide();
		}
	};
	// 编辑角色
	this.createEditRoleWin = function() {
		var that = this;
		if (!this.privilegeStore) {
			this.createPrivilegeList();
		}
		if (!this.privilegeListTree) {
			this.createPrivilegeListTree();
		}
		this.editRoleWin = Ext.create("Ext.window.Window", {
			width: 500,
			height: 500,
			autoScroll: true,
			modal: false,
			title: "新增/编辑角色",
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false, //是否可以调整大小
			cls: "window",
			items: [Ext.create("Ext.form.Panel", {
				border: 0,
				defaults: {
					xtype: "textfield",
					labelWidth: 50,
					margin: 5,
					padding: 5,
					anchor: "95%"
				},
				items: [{
						// 域RDN
						xtype: "hiddenfield",
						name: "_PDN"
					}, {
						xtype: "hiddenfield",
						name: "_ID"
					}, {
						xtype: "textfield",
						name: "_NAME",
						fieldLabel: "名称"
					}, {
						xtype: "textfield",
						name: "_LABEL",
						fieldLabel: "标签"
					}, {
						xtype: "textareafield",
						name: "_DESC",
						fieldLabel: "描述",
						height: 50
					}, {
						xtype: "label",
						text: "权限管理"
					},
					this.privilegeListTree
				]
			})],
			buttons: [{
				text: "确定",
				handler: function() {
					var data = that.editRoleWin.getComponent(0).getForm().getValues();
					if (that.editType == "add") {
						that.addRole(data);
					} else {
						that.updateRole(data);
					}
				}
			}, {
				text: "取消",
				handler: function() {
					that.editRoleWinHide();
				}
			}]
		});
	};
	// 编辑角色窗口隐藏
	this.editRoleWinHide = function() {
		if (this.editRoleWin) {
			this.editRoleWin.hide();
		}
		var root = this.privilegeStore.getRoot();
		this.initPrivilegeStore(root);
	};
	// 编辑用户
	this.createEditUserWin = function() {
		var that = this;
		if (!this.groupsGridStore) {
			this.createGroupsStore();
		}
		if (!this.rolesGridStore) {
			this.createRoleStore();
		}
		this.editUserWin = Ext.create("Ext.window.Window", {
			width: 500,
			modal: false,
			title: "新增/编辑用户",
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false, //是否可以调整大小
			cls: "window",
			items: [Ext.create("Ext.form.Panel", {
				border: 0,
				defaults: {
					xtype: "textfield",
					labelWidth: 80,
					margin: 5,
					padding: 5,
					anchor: "95%"
				},
				items: [{
					// 域RDN
					xtype: "hiddenfield",
					name: "_PDN"
				}, {
					xtype: "hiddenfield",
					name: "_ID"
				}, {
					// 登录名
					fieldLabel: "登录名",
					name: "_NAME"
				}, {

					fieldLabel: "密码",
					name: "_PWD",
					inputType: "password",
					listeners: {
						change: function() {
							that.passwordChange = true;
						}
					}
				}, {
					fieldLabel: "姓名",
					name: "_NICK_NAME"
				}, {
					xtype: "combobox",
					store: Ext.create("Ext.data.Store", {
						fields: ["name", "value"],
						data: [{
							name: "男",
							value: 0
						}, {
							name: "女",
							value: 1
						}]
					}),
					value: 0,
					fieldLabel: "性别",
					name: "_GENDER",
					editable: false,
					queryMode: 'local',
					displayField: 'name',
					valueField: "value",
					autoSelect: true
				}, {
					fieldLabel: "电话",
					name: "_PHONE"
				}, {
					fieldLabel: "电子邮箱",
					name: "_EMAIL",
					vtype: "email"
				}, {
					fieldLabel: "地址",
					name: "_ADDRESS"
				}, {
					xtype: "combobox",
					store: Ext.create("Ext.data.Store", {
						fields: ["name", "value"],

						data: [{
							name: "清除",
							value: 0
						}, {
							name: "有效",
							value: 1
						}]
					}),
					value: 1,
					fieldLabel: "状态",
					name: "_STATUS",
					editable: false,
					queryMode: 'local',
					displayField: 'name',
					valueField: "value",
					autoSelect: true
				}, {
					xtype: "combobox",
					value: false,
					store: Ext.create("Ext.data.Store", {
						fields: ["name", "value"],
						data: [{
							name: "未锁定",
							value: false
						}, {
							name: "锁定",
							value: true
						}]
					}),
					fieldLabel: "锁定",
					name: "_LOCKED",
					editable: false,
					queryMode: 'local',
					displayField: 'name',
					valueField: "value",
					autoSelect: true
				}, Ext.create("Ext.form.field.Tag", {
					store: this.groupsGridStore,
					fieldLabel: "组",
					labelWidth: 80,
					margin: 5,
					padding: 5,
					anchor: "95%",
					name: "GROUPS",
					editable: false,
					filterPickList: false,
					renderTo: Ext.getBody(),
					queryMode: 'local',
					valueField: "RDN",
					displayField: "_LABEL"
				}), Ext.create("Ext.form.field.Tag", {

					store: this.rolesGridStore,
					fieldLabel: "角色",
					labelWidth: 80,
					margin: 5,
					padding: 5,
					anchor: "95%",
					name: "ROLES",
					editable: false,
					filterPickList: false,
					renderTo: Ext.getBody(),
					queryMode: 'local',
					valueField: "RDN",
					displayField: "_NAME"
				}), {
					xtype: "combobox",
					store: Ext.create("Ext.data.Store", {
						fixeds: ["NAME", "VALUE"],
						data: [{
							NAME: "深圳中心",
							VALUE: "深圳中心"
						}, {
							NAME: "甘肃",
							VALUE: "甘肃"
						}]
					}),
					fieldLabel: "用户归属",
					// labelWidth: 80,
					name: "PROVINCE",
					queryMode: 'local',
					displayField: 'NAME',
					valueField: "VALUE",
					autoSelect: true,
					listeners: {

					}
				}]
			})],
			buttons: [{
				text: "确定",
				handler: function() {
					var data = that.editUserWin.getComponent(0).getForm().getValues();
					if (that.editType == "add") {
						that.addUser(data);
					} else {
						that.updateUser(data);
					}
				}
			}, {
				text: "取消",
				handler: function() {
					that.editUserWinHide();
				}
			}]
		});
	};
	this.editUserWinHide = function() {
		if (this.editUserWin) {
			this.editUserWin.hide();
		}
	};

	// 角色数据集
	this.createRoleStore = function() {
		this.rolesGridStore = Ext.create("Ext.data.Store", {
			fixeds: [

				this.roleModel["_NAME"],
				this.roleModel["_ID"],
				this.roleModel["_PDN"],
				this.roleModel["RDN"],
				this.roleModel["_LABEL"],
				this.roleModel["_DESC"],
				this.roleModel["PRIVILEGES"]
			],
		});
	};

	this.createSesstionStore = function() {
		this.sesstionGridStore = Ext.create("Ext.data.Store", {
			fixeds: [
				this.sesstionModel["USER_NAME"],
				this.sesstionModel["USER_RDN"],
				this.sesstionModel["LOGIN_TIME"],
				this.sesstionModel["NICK_NAME"],
				this.sesstionModel["LAST_ACCESS_TIME"],
				this.sesstionModel["HOST"],
				this.sesstionModel["DOMAIN"],
				this.sesstionModel["PORT"],
				this.sesstionModel["SESSION_KEY"]
			],
		});
	};
	// 用户集合
	this.createUserGridStore = function() {
		this.userGridStore = Ext.create("Ext.data.Store", {
			fixeds: [this.userModel["DOMAIN"],
				this.userModel["_ADDRESS"],
				this.userModel["_NICK_NAME"],
				this.userModel["_EMAIL"],
				this.userModel["_GENDER"],
				this.userModel["_ID"],
				this.userModel["_PHONE"]
			],
		});
	};
	// 组集合
	this.createGroupsStore = function() {
		this.groupsGridStore = Ext.create("Ext.data.Store", {
			fixeds: [
				this.gridModel["_NAME"],
				this.gridModel["_LABEL"],
				this.gridModel["_DESC"],
				this.gridModel["USERS"],
				this.gridModel["ROLES"]
			],
		});
	};
	// 选择子节点
	this.selectChildNodes = function(Node, checked) {
		Node.expand();
		Node.eachChild(function(node) {
			// node.data.checked = checked;
			node.set("checked", checked);
			if (node.isLeaf()) {

			} else {
				this.selectChildNodes(node, checked);
			}
		}, this);
	};
	this.selectParentNodes = function(Node, checked) {
		var parentNode = Node.parentNode;
		parentNode.set("checked", true);
		if (parentNode.parentNode) {
			this.selectParentNodes(parentNode, checked);
		}
	};
	//初始化节点 
	this.initPrivilegeStore = function(Node) {
		Node.set("checked", false);
		Node.eachChild(function(node) {
			node.set("checked", false);
			if (!node.isLeaf()) {
				this.initPrivilegeStore(node);
			}
		}, this);
		if (Node.isExpanded()) {
			Node.collapseChildren();
		}
	};
	// 权限树
	this.createPrivilegeListTree = function() {
		this.privilegeListTree = Ext.create("Ext.tree.Panel", {
			store: this.privilegeStore,
			rootVisible: false,
			border: 0,
			columnWidth: 1 / 4,
			margin: "0 10",
			listeners: {
				checkchange: {
					fn: function(node, checked) {
						this.PrivilegeListTreeChange = true;
						this.selectChildNodes(node, checked); //选定子节点  
						if (checked) {
							this.selectParentNodes(node, checked);
						}
					}
				},
				scope: this
			}
		});
	};
	// 权限集合
	this.createPrivilegeList = function() {
		this.privilegeStore = Ext.create("Ext.data.TreeStore", {
			root: {
				expanded: true
			}
		});
	};
	// this.initView();
}
SecurityManage.prototype = new Page(Configes.page.SecurityManage);
