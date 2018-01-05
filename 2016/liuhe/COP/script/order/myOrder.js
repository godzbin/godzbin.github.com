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
		var that = this;
		if (params && params.record) {
			this.orderRecord = params.record
		} else if (params) {
			this.jumpSceneId = params.jumpSceneId;
			this.jumpStatuId = params.jumpStatuId
		}
		if (!this.loading) {
			this.initView();
			setTimeout(function() {
				that.getSelfInfo();
			}, 200);
		}
		this.loading = true;
		this.mainPanelShow();
		this.viewPanel.show();
		// this.myOrderDetailsMainPanel.hide();

		if (this.jumpSceneId) {
			var isOpen = this.selectSceneNode(this.jumpSceneId);
			isOpen && (this.jumpSceneId = null);
		}

		this.orderRecord && this.openOrderDetails(this, null, null, null, null, this.orderRecord);
	};
	this.initView = function() {
		var panel = this.getMainPanel();
		panel.add(this.viewPanel);
		// panel.add(this.myOrderDetailsMainPanel);

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
		// console.log(params);
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
		var panel = this.getMainPanel();
		if (!panel.getComponent(this.myOrderDetailsMainPanel)) {
			panel.add(this.myOrderDetailsMainPanel);
		}
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
main.regContent(new MyOrder(main));