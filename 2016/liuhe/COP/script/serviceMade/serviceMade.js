//  
//  
//  create 20160808 godz
//  服务定制 页面
//  
function ServiceMadePage(parentNode) {
	Page.call(this, Configes.page.serviceMade);
	this.parentNode = parentNode;
	// 渠道
	this.channelData = [{
		NAME: "营业厅前台",
		VALUE: "channel=1"
	}, {
		NAME: "电渠",
		VALUE: "channel=2"
	}];
	// 探测方式
	this.detectionMethodData = [{
		NAME: "被动探测",
		VALUE: "detectionMethod=1"
	}];

	// 页面加载
	this.run = function() {
		if (!this.loading) {
			this.initView();
			this.getSelfInfo();
		}
		this.loading = true;
		this.mainPanelShow();
	};
	this.initView = function() {
		this.createClassifyPanel();

		var mainPanel = this.getMainPanel();
		mainPanel.add(this.classifyPanel);
		// this.classifyPanel.add(this.serviceMadePanel);
		// this.classifyPanel.add(this.orderPanel);
		// this.classifyPanel.setActiveTab(this.serviceMadePanel);
	};


	// 获取信息
	this.getSelfInfo = function() {
		tools.getData(Configes.url.view_getSelfInfo, null, this.setSelfInfo, this);
	};
	this.setSelfInfo = function(data, that) {
		that.userInfo = data;

		if (that.userInfo["_CONTENT"]) {

			that.createServiceMadePanel();
			that.createOrderPanel();
			var contentStr = that.userInfo["_CONTENT"];
			var content = JSON.parse(contentStr);
			var province = content["PROVINCE"];
			if (province == "深圳中心") {
				that.classifyPanel.add(that.orderPanel);
				that.classifyPanel.setActiveTab(that.orderPanel);
				that.getOrderList();
			} else if (province) {
				that.classifyPanel.add(that.serviceMadePanel);
				that.classifyPanel.add(that.orderPanel);
				that.classifyPanel.setActiveTab(that.serviceMadePanel);
				that.getServiceMadeList();
			}
		} else {
			that.classifyPanel.removeAll();
		}
	};

	// 创建分类窗
	this.createClassifyPanel = function() {
		this.classifyPanel = Ext.create("Ext.tab.Panel", {
			plain: true,
			border: 0,
			defaults: {
				border: 0
			}
		});
	};
	// 打开订单列表
	// this.openServiceMadeGridPanel = function() {
	// 	// this.editScene = record;
	// 	// if (!this.serviceMadeGrid) {
	// 	// 	this.createServiceMadeGridPanel();
	// 	// 	this.serviceMadePanel.add(this.serviceMadeGrid);
	// 	// }
	// 	// this.getServiceMadeList();
	// };
	// 打开订单编辑
	this.openServiceMadeCenterPanel = function(data) {
		if (!this.serviceMadeCenterPanel) {
			this.createServiceMadeCenterPanel();
			this.serviceMadePanel.add(this.serviceMadeCenterPanel);
		}
		this.serviceMadeCenterPanel.show();
		var form = this.serviceMadeCenterPanel.getComponent(0).getForm().reset();
		if (this.editType == "update") {
			var params = {
				RDN: data.RDN
			};
			this.getServiceMade(params);
			this.editOrder = data;
		}
	};

	// 打开订单
	this.openOrderCenterPanel = function(record) {
		if (!this.orderCenterPanel) {
			this.createOrderCenterPanel();
			this.orderPanel.add(this.orderCenterPanel);
		}
		console.log(record);
		this.getOrder(record.data);
	};

	// 保存服务
	this.saveServiceMade = function() {
		var form = this.serviceMadeCenterPanel.getComponent(0);
		var values = form.getForm().getValues();

		if (!values["CHANNEL"]) {
			tools.toast("请选择渠道");
			return;
		}
		if (!values["DETECTION"]) {
			tools.toast("请选择探测方式");
			return
		}
		if (!values["RDN"]) {
			values["RDN"] = undefined;
		}
		var serviceName = this.editService.data.nodeData["NAME"];
		var serviceRDN = this.editService.data.nodeData["RDN"];
		var sceneName = this.editScene.data.nodeData["NAME"];
		var sceneRDN = this.editScene.data.nodeData["RDN"];
		var channelName = this.getChannelName(values["CHANNEL"]);
		var detectionMethodName = this.getDetectionMethodName(values["DETECTION"]);
		var type = serviceRDN + "," + sceneRDN + "," + values["CHANNEL"] + "," + values["DETECTION"];
		var params = {
			RDN: values["RDN"],
			NAME: serviceName + "-" + sceneName + "-" + channelName + "-" + detectionMethodName,
			TYPE: type,
			CONTENT: values["CONTENT"]
		};
		var domain = this.userInfo.DOMAIN;
		tools.getDataToEnv(Configes.url.app_saveTmpOrder, params, this.saveServiceMadeReturn, this, null, domain);
	};
	this.saveServiceMadeReturn = function(data, that) {
		if (that.saveType == "save") {
			tools.toast("保存成功");
			that.getServiceMadeList();
			that.editType = "update";
			that.openServiceMadeCenterPanel(data);
		} else if (that.saveType == "submit") {
			that.getServiceMadeList();
			that.editType = "update";
			that.openServiceMadeCenterPanel(data);
			that.submitServiceMade(data);
		}
	};
	this.getServiceMadeList = function() {
		var domain = this.userInfo.DOMAIN;
		tools.getDataToEnv(Configes.url.app_listTmpOrder, null, this.setServiceMadeList, this, null, domain);
	};
	this.setServiceMadeList = function(data, that) {
		if (!that.serviceMadeGridStroe) {
			that.createServiceMadeGridStroePanel();
		}
		that.serviceMadeGridStroe.loadData(data);
	};
	this.getServiceMade = function(params) {
		var domain = this.userInfo.DOMAIN;
		tools.getDataToEnv(Configes.url.app_getTmpOrder, params, this.setServiceMade, this, null, domain);
	};
	this.setServiceMade = function(data, that) {
		var form = that.serviceMadeCenterPanel.getComponent(0);
		console.log(data);
		var type = data["TYPE"];

		var serviceRDN = data["TYPE"].split(",")[0];
		var sceneRDN = data["TYPE"].split(",")[1];
		that.selectTreeNode(serviceRDN, sceneRDN);

		var CHANNEL = data["TYPE"].split(",")[2];
		var DETECTION = data["TYPE"].split(",")[3];
		data["CHANNEL"] = CHANNEL;
		data["DETECTION"] = DETECTION;
		form.getForm().setValues(data);
	};
	this.selectTreeNode = function(serviceRDN, sceneRDN) {
		var root = this.serviceStore.getRoot();
		root.eachChild(function(node) {
			if (node.data.nodeData["RDN"] == serviceRDN) {
				node.expand();
				this.editService = node;
				node.eachChild(function(childNode) {

					if (childNode.data.nodeData["RDN"] == sceneRDN) {
						this.editScene = childNode;
						this.serviceMadeTreePanel.getSelectionModel().select(childNode);
					}
				}, this);
			}
		}, this);
	};
	this.removeServiceMade = function(record) {
		var params = {
			RDN: record.data["RDN"]
		}
		var domain = this.userInfo.DOMAIN;
		tools.getDataToEnv(Configes.url.app_removeTmpOrder, params, this.removeServiceMadeReturn, {
			that: this,
			data: record.data
		}, null, domain);
	};
	this.removeServiceMadeReturn = function(data, params) {
		var that = params.that;
		var data = params.data;
		that.getServiceMadeList();
		if (that.serviceMadeCenterPanel) {
			if (that.editOrder.RDN == data.RDN) {
				that.serviceMadeCenterPanel.hide();
			}
		}
	};
	this.submitServiceMade = function(data) {
		var params = {
			RDN: data.RDN
		};
		var domain = this.userInfo.DOMAIN;
		tools.getDataToEnv(Configes.url.app_submitOrder, params, this.submitServiceMadeReturn, {
			that: this,
			data: data
		}, null, domain);
	};
	this.submitServiceMadeReturn = function(data, params) {
		tools.toast("提交成功");
		var that = params.that;
		var data = params.data;
		that.getServiceMadeList();
		if (that.serviceMadeCenterPanel) {
			if (that.editOrder.RDN == data.RDN) {
				that.serviceMadeCenterPanel.hide();
			}
		}
	};


	this.getOrderList = function() {
		var start = this.orderGridPageBar.getStart();
		var count = this.orderGridPageBar.getPageCount();
		var contentStr = this.userInfo["_CONTENT"];
		var content = JSON.parse(contentStr);
		var province = content["PROVINCE"];
		var list_type = "";
		if (province == "深圳中心") {
			list_type = "ALL";
		} else {
			list_type = "OWNER_PROVINCE";
		}
		var params = {
			START: start,
			COUNT: count,
			LIST_TYPE: list_type
		};
		var domain = this.userInfo.DOMAIN;
		tools.getDataToEnv(Configes.url.app_listOrder, params, this.setOrderList, this, null, domain);
	};
	this.setOrderList = function(data, that) {
		that.orderGridPageBar.setTotalCount(data["TOTAL_COUNT"]);
		that.orderStore.loadData(data["DATA_LIST"]);
	};


	this.getOrder = function(data) {
		var domain = this.getDomain();
		var params = {
			RDN: data["RDN"],
			DETAIL: "1"
		}
		tools.getDataToEnv(Configes.url.app_getOrder, params, this.setOrder, this, null, domain);
	};
	this.setOrder = function(data, that) {
		that.editOrder = data;
		that.setOrderCenterPanel(data);
	};
	this.setOrderCenterPanel = function(data) {
		var name = data[Configes.orderModel["NAME"]];
		var submitTime = data[Configes.orderModel["$EX_SUBMIT_TIME"]];
		var STATUS = data[Configes.orderModel["$EX_STATUS"]];

		var steps = data[Configes.orderModel["$EX_STEPS"]];
		var content = data[Configes.orderModel["$EX_CONTENT"]];
		var PROVINCE = data[Configes.orderModel["PROVINCE"]];
		var SUBMITTER = data[Configes.orderModel["$EX_SUBMITTER"]];
		var PROCESSOR = data[Configes.orderModel["PROCESSOR"]];


		if (STATUS == 2) {
			STATUS = "已完成"
		} else if (STATUS == 1) {
			STATUS = "进行中"
		} else {
			STATUS = "被退回"
		}
		var items = [
			this.setOrderStepPanel("步骤", steps),
			this.setOrderCenterPanelChild("订单名", name),
			this.setOrderCenterPanelChild("提交时间", submitTime),
			this.setOrderCenterPanelChild("状态", STATUS),
			this.setOrderCenterPanelChild("区域", PROVINCE),
			this.setOrderCenterPanelChild("提交人", SUBMITTER),
			this.setOrderCenterPanelChild("处理人", PROCESSOR),
			this.setOrderCenterPanelChild("内容", content)
		];
		this.orderCenterPanel.removeAll();
		this.orderCenterPanel.add(items);
	};
	this.setOrderStepPanel = function(name, steps) {
		var stepPanels = [];
		steps = steps || [];
		this.orderStepStroe || this.createOrderStepStroe();
		var grid = Ext.create("Ext.grid.Panel", {
			border: 0,
			autoRender: true,
			autoShow: false,
			store: this.orderStepStroe,
			title: "步骤列表",
			// hideHeaders: true,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
					dataIndex: "$EX_NAME",
					text: "步骤名"
				}, {
					dataIndex: "PROCESSOR",
					text: "处理者"
				}, {
					dataIndex: "START_TIME",
					text: "开始时间"
				},{
					dataIndex: "END_TIME",
					text: "结束时间"
				},{
					dataIndex: "CONTENT",
					text: "意见"
				}]
			},
			forceFit: true,
		});
		this.orderStepStroe.loadData(steps);
		var panel = Ext.create("Ext.panel.Panel", {
			border: 0,
			defaults: {
				border: 0
			},
			items: [{
				xtype: "panel",
				defaults: {
					xtype: "label",
					style: "color: #fff;fontSize:16px;"
				},
				// items: [{
				// 	xtype: "label",
				// 	text: "步骤列表:"
				// }]
			}]
		});
		panel.add(grid);
		return panel;
	};
	this.setOrderCenterPanelChild = function(name, value) {
		var panel = {
			xtype: "panel",
			border: 0,
			defaults: {
				xtype: "label",
				style: "color: #fff"
			},
			items: [{
				text: name + ":  " + (value || "")
			}]
		};
		return panel;
	};
	// 获取渠道名称
	this.getChannelName = function(value) {
		var data = this.channelData;
		for (var i = 0, l = data.length; i < l; i++) {
			if (data[i]["VALUE"] == value) {
				return data[i]["NAME"];
			}
		}
	};
	this.getDetectionMethodName = function(value) {
		var data = this.detectionMethodData;
		for (var i = 0, l = data.length; i < l; i++) {
			if (data[i]["VALUE"] == value) {
				return data[i]["NAME"];
			}
		}
	};
	this.getDomain = function() {
		return this.userInfo["DOMAIN"];
	};


	// 
	// 
	// 
	// view
	//  服务定制
	this.createServiceMadePanel = function() {
		!this.serviceMadeGrid && this.createServiceMadeGridPanel();
		!this.serviceMadeTreePanel && this.createServiceMadeTreePanel();
		this.serviceMadePanel = Ext.create("Ext.panel.Panel", {
			title: "服务定制",
			layout: "column",
			defaults: {
				border: 0,
				margin: "10 0 0 0"
			},
			items: [
				this.serviceMadeGrid,
				this.serviceMadeTreePanel
			]
		});
	};
	this.createServiceMadeTreePanel = function() {
		var that = this;
		!this.serviceStore && this.createServiceStroe();
		this.serviceMadeTreePanel = Ext.create("Ext.tree.Panel", {
			columnWidth: 1 / 5,
			margin: "10 0 0 10",
			store: this.serviceStore,
			rootVisible: false,
			border: 0,
			cls: "serviceDirectoryTreePanel",
			listeners: {
				itemexpand: function(record) {
					if (!record.data.isLoad) {
						// that.getSceneList(record);
					}
				},
				itemdblclick: function(tree, record, ele, id, e) {
					if (record.isLeaf()) {
						that.editService = record.parentNode;
						that.editScene = record;
						that.editType = "add";
						that.openServiceMadeCenterPanel(record);
					}
				}
			}
		});
	};
	this.createServiceStroe = function() {
		this.serviceStore = Ext.create("Ext.data.TreeStore", {
			root: {
				expanded: true,
				cls: "serviceDirectoryTreeRoot",
				children: [{
					text: "监控类服务",
					leaf: false,
					nodeData: {
						RDN: "service=1",
						NAME: "监控类服务"
					},
					cls: "serviceDirectoryTreeType",
					children: [{
						text: "场景1",
						nodeData: {
							RDN: "scene=1",
							NAME: "场景1"
						},
						leaf: true,
						cls: "serviceDirectoryTreeType"
					}, {
						text: "场景2",
						nodeData: {
							RDN: "scene=2",
							NAME: "场景2"
						},
						leaf: true,
						cls: "serviceDirectoryTreeType"
					}]
				}]
			}
		});
	};
	this.createServiceMadeGridPanel = function() {
		var that = this;
		!this.serviceMadeGridStroe && this.createServiceMadeGridStroePanel();
		this.serviceMadeGrid = Ext.create("Ext.grid.Panel", {
			columnWidth: 1 / 5,
			cls: "centerFormPanel",
			border: 0,
			autoRender: true,
			autoShow: false,
			store: this.serviceMadeGridStroe,
			title: "草稿箱",
			hideHeaders: true,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
					dataIndex: "NAME",
					text: "订单名"
				}]
			},
			tools: [
				// {
				// 	xtype: "button",
				// 	text: "添加",
				// 	margin: "0 5",
				// 	handler: function() {
				// 		that.editType = "add";
				// 		that.openServiceMadeCenterPanel();
				// 	}
				// }, 
				{
					xtype: "button",
					text: "删除",
					handler: function() {
						that.editType = "delete";
						var grid = that.serviceMadeGrid;
						var select = grid.getSelectionModel().getSelection();
						that.removeServiceMade(select[0]);
					}
				}
			],
			listeners: {
				celldblclick: function() {
					that.editType = "update";
					that.openServiceMadeCenterPanel(arguments[3].data);
				}
			},
			forceFit: true
		});
	};
	this.createServiceMadeGridStroePanel = function() {
		this.serviceMadeGridStroe = Ext.create("Ext.data.Store", {
			fields: ["NAME", "RDN"]
		});
	};
	this.createServiceMadeCenterPanel = function() {
		var that = this;
		this.serviceMadeCenterPanel = Ext.create("Ext.panel.Panel", {
			columnWidth: 3 / 5,
			border: 0,
			items: [Ext.create("Ext.form.Panel", {
				border: 0,
				padding: 15,
				margin: "0 0 0 10",
				cls: "centerFormPanel",
				defaults: {
					labelStyle: "font-size: 14px; color: #fff;",
				},
				items: [{
					xtype: "hiddenfield",
					name: "RDN"
				}, {
					xtype: 'fieldcontainer',
					fieldLabel: '营业厅',
					defaultType: 'radiofield',
					anchor: "80%",
					defaults: {
						width: 150,
						name: 'CHANNEL',
					},
					layout: 'hbox',
					items: [{
						boxLabel: '营业厅前台',
						inputValue: "channel=1",
						boxLabelCls: "radioLabel",
					}, {
						boxLabel: '电渠',
						inputValue: "channel=2",
						boxLabelCls: "radioLabel",
					}]
				}, {
					xtype: 'fieldcontainer',
					fieldLabel: '探测方式',
					defaultType: 'radiofield',
					anchor: "80%",
					defaults: {
						width: 150,
						name: 'DETECTION',
						labelStyle: "font-size: 14px; color: #fff;"
					},
					layout: 'hbox',
					items: [{
						boxLabel: '被动探测',
						inputValue: "detectionMethod=1",
						boxLabelCls: "radioLabel",
					}]
				}, {
					xtype: "textareafield",
					fieldLabel: "内容",
					anchor: "80%",
					height: 200,
					labelWidth: 80,
					name: "CONTENT"
				}, {
					xtype: "button",
					baseCls: "base-btn x-btn",
					width: 80,
					text: "保存",
					margin: 10,
					handler: function() {
						that.saveType = "save";
						that.saveServiceMade();
					}
				}, {
					xtype: "button",
					baseCls: "base-btn x-btn",
					width: 80,
					margin: 10,
					text: "提交",
					handler: function() {
						that.saveType = "submit";
						that.saveServiceMade();
					}
				}]
			})]
		});
	};

	// 订单管理
	this.createOrderPanel = function() {
		var that = this;
		if (!that.orderGridPnael) {
			that.createOrderGridPanel();
		}
		this.orderPanel = Ext.create("Ext.panel.Panel", {
			title: "订单列表",
			layout: "column",
			padding: "10 0 0 0 ",
			items: [this.orderGridPnael],
			listeners: {
				show: function() {
					that.getOrderList();
				}
			}
		});
	};
	this.createOrderGridPanel = function() {
		var that = this;
		!this.provinceStore && this.createProvinceStore();
		!this.orderStore && this.createOrderStore();
		!this.orderGridPageBar && this.createOrderGridPageBar();
		this.orderGridPnael = Ext.create("Ext.grid.Panel", {
			columnWidth: 2 / 5,
			cls: "centerGridPanel",
			border: 0,
			autoRender: true,
			border: 0,
			store: this.orderStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
					dataIndex: Configes.orderModel["NAME"],
					text: "订单名",
					renderer: function(value) {
						var new_value = "<span title=" + value + ">" + value + "</span>";
						return new_value;
					}
				}, {
					dataIndex: Configes.orderModel["$EX_STATUS"],
					text: "状态"
				}, {
					dataIndex: Configes.orderModel["PROCESSOR"],
					text: "处理者",
				}, {
					dataIndex: Configes.orderModel["$EX_SUBMIT_TIME"],
					text: "提交时间"
				}, {
					dataIndex: Configes.orderModel["$EX_SUBMITTER"],
					text: "提交者"
				}, {
					dataIndex: Configes.orderModel["PROVINCE"],
					text: "区域"
				}]
			},
			tools: [{
				xtype: "button",
				text: "查看我的任务",
				handler: function() {
					that.openMyTaskPage();
				},
				width: 100,
				baseCls: "base-btn x-btn",
				margin: "0 10",
			}, {
				xtype: "button",
				text: "刷新",
				handler: function() {
					that.getOrderList();
				},
				width: 100,
				baseCls: "base-btn x-btn",
				margin: "0 10",
			}],
			bbar: this.orderGridPageBar.createToolbar(),
			listeners: {
				celldblclick: function() {
					var select = this.getSelectionModel().getSelection();
					if (select.length > 0)
						that.openOrderCenterPanel(select[0]);
				}
			},
			forceFit: true,
			// renderTo: Ext.getBody()
		});
	};
	this.openMyTaskPage = function() {
		var pageId = Configes.page.myTask;
		this.parentNode.openContent(pageId);
	};
	this.createOrderCenterPanel = function() {
		this.orderCenterPanel = Ext.create("Ext.panel.Panel", {
			columnWidth: 3 / 5,
			margin: "0 0 0 10",
			cls: "centerFormPanel",
			border: 0,
			defaults: {
				margin: 10,
				style: {
					color: "#fff",
					lineHeight: "25px"
				},
				xtype: "label"
			},
			items: [],
		});
	};
	this.createOrderGridPageBar = function() {
		this.orderGridPageBar = Ext.create("common.page.PageBar", {
			// id: "orderGridPageBar",
			listeners: {
				PAGING: {
					fn: this.getOrderList,
					scope: this
				}
			}
		});
	};
	this.createOrderStore = function() {
		this.createOrderModel();
		this.orderStore = Ext.create("Ext.data.Store", {
			// fixeds: [
			// 	Configes.orderModel["NAME"],
			// 	Configes.orderModel["PROCESSOR"],
			// 	Configes.orderModel["$EX_STATUS"],
			// 	Configes.orderModel["$EX_SUBMIT_TIME"],
			// 	Configes.orderModel["$EX_SUBMITTER"],
			// 	Configes.orderModel["PROVINCE"]
			// ]
			model: "Order"
		});
	};
	this.createOrderModel = function() {
		Ext.define('Order', {
			extend: 'Ext.data.Model',
			fields: [{
					name: "$EX_STATUS",
					convert: function(value, record) {
						var new_value;
						if (value == 1) {
							new_value = "进行中";
						} else if (value == 2) {
							new_value = "完成";
						} else {
							new_value = "打回";
						}
						return new_value
					}
				}, {
					name: "NAME"
				}, {
					name: "PROCESSOR"
				},
				Configes.orderModel["$EX_SUBMIT_TIME"],
				Configes.orderModel["$EX_SUBMITTER"],
				Configes.orderModel["PROVINCE"]
			]
		});
	};
	this.createProvinceStore = function() {
		this.provinceStore = Ext.create("Ext.data.Store", {
			fixeds: ["NAME", "VALUE"],
			data: Configes.province
		});
	};
	this.createOrderStepStroe = function() {
		this.createOrderStepModel();
		console.log(orderStep);
		this.orderStepStroe = Ext.create("Ext.data.Store", {
			model: "orderStep"
		});
	};
	this.createOrderStepModel = function() {
		Ext.define('orderStep', {
			extend: 'Ext.data.Model',
			fields: [{
					name: "STATUS",
					convert: function(value, record) {
						var new_value;
						if (value == 1) {
							new_value = "进行中";
						} else if (value == 2) {
							new_value = "完成";
						} else {
							new_value = "打回";
						}
						return new_value
					}
				}, {
					name: "$EX_NAME"
				}, {
					name: "PROCESSOR"
				},
				"START_TIME",
				"END_TIME",
				"CONTENT"
			]
		});
	};
}