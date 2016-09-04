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
				icon: "resources/images/change.png",
				tooltip: '变更',
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
			baseCls: "base-btn x-btn",
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