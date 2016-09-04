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