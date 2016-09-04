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
				modal: false,
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
			modal: false,
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
			modal: false,
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
						modal: false,
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